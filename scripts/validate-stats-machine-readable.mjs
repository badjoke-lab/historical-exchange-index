import fs from 'node:fs'
import path from 'node:path'
import { loadReviewedBundles, mergeRecords } from './lib/reviewed-bundle-aggregation.mjs'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'

const root = process.cwd()

function assert(condition, message) {
  if (!condition) throw new Error(`stats machine-readable validation failed: ${message}`)
}

function readJson(relativePath) {
  const filePath = path.join(root, relativePath)
  assert(fs.existsSync(filePath), `missing ${relativePath}`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function readText(relativePath) {
  const filePath = path.join(root, relativePath)
  assert(fs.existsSync(filePath), `missing ${relativePath}`)
  return fs.readFileSync(filePath, 'utf8')
}

function sumCounts(rows) {
  return rows.reduce((sum, row) => sum + Number(row.count || 0), 0)
}

function extractedYear(value) {
  if (!value) return null
  const match = String(value).match(/(\d{4})/)
  return match ? Number(match[1]) : null
}

const stats = readJson('out/stats.json')
const history = readJson('out/stats-history.json')
const version = readJson('out/version.json')
const manifest = readJson('out/data/manifest.json')
const llms = readText('out/llms.txt')
const ai = readText('out/ai.txt')

const canonicalEntities = readJson('data/entities.json')
const canonicalEvents = readJson('data/events.json')
const canonicalEvidence = readJson('data/evidence.json')
const { all: reviewedBundles, newEntityBundles } = loadReviewedBundles(root, canonicalEntities)
const correctedCanonicalEntities = applyReviewedEntityCorrections(canonicalEntities, reviewedBundles)
const entities = [...correctedCanonicalEntities, ...newEntityBundles.map(({ bundle }) => bundle.entity)]
const events = mergeRecords(canonicalEvents, reviewedBundles, 'events', 'event')
const evidence = mergeRecords(canonicalEvidence, reviewedBundles, 'evidence', 'evidence')

const deadSide = new Set(['dead', 'merged', 'acquired', 'rebranded'])
const activeSide = new Set(['active', 'limited', 'inactive'])
const expected = {
  total_entities: entities.length,
  dead_side_total: entities.filter((entity) => deadSide.has(entity.status)).length,
  active_side_total: entities.filter((entity) => activeSide.has(entity.status)).length,
  total_events: events.length,
  total_evidence: evidence.length,
}

for (const key of ['generated_at', 'totals', 'by_status', 'by_type', 'active_analysis', 'dead_analysis', 'country_origin', 'quality', 'coverage', 'completeness', 'events', 'evidence']) {
  assert(Object.hasOwn(stats, key), `stats.json missing top-level key ${key}`)
}
assert(!Number.isNaN(Date.parse(stats.generated_at)), 'stats.json generated_at is invalid')
for (const [key, value] of Object.entries(expected)) assert(stats.totals?.[key] === value, `stats total mismatch ${key}: expected ${value}, got ${stats.totals?.[key]}`)
assert(Array.isArray(stats.by_status) && sumCounts(stats.by_status) === entities.length, 'status breakdown does not cover all entities')
assert(Array.isArray(stats.by_type) && sumCounts(stats.by_type) === entities.length, 'type breakdown does not cover all entities')
assert(Array.isArray(stats.active_analysis?.status_breakdown) && sumCounts(stats.active_analysis.status_breakdown) === expected.active_side_total, 'active-side breakdown mismatch')
assert(Array.isArray(stats.dead_analysis?.status_breakdown) && sumCounts(stats.dead_analysis.status_breakdown) === expected.dead_side_total, 'dead-side breakdown mismatch')
assert(Array.isArray(stats.events?.event_type_breakdown) && sumCounts(stats.events.event_type_breakdown) === events.length, 'event type breakdown mismatch')
assert(Array.isArray(stats.evidence?.source_type_breakdown) && sumCounts(stats.evidence.source_type_breakdown) === evidence.length, 'evidence source-type breakdown mismatch')

for (const key of ['generated_at', 'snapshots', 'launch_year_counts', 'death_year_counts']) assert(Object.hasOwn(history, key), `stats-history.json missing top-level key ${key}`)
assert(!Number.isNaN(Date.parse(history.generated_at)), 'stats-history generated_at is invalid')
assert(Array.isArray(history.snapshots) && history.snapshots.length >= 1, 'stats history requires at least one snapshot')
const latest = history.snapshots.at(-1)
for (const key of ['total_entities', 'dead_side_total', 'active_side_total', 'total_events', 'total_evidence']) {
  assert(latest?.[key] === expected[key], `stats history latest snapshot mismatch ${key}`)
}
const knownLaunchYears = entities.filter((entity) => extractedYear(entity.launch_date) !== null).length
const knownDeathYears = entities.filter((entity) => extractedYear(entity.death_date) !== null).length
assert(sumCounts(history.launch_year_counts) === knownLaunchYears, `launch year history count mismatch: expected ${knownLaunchYears}, got ${sumCounts(history.launch_year_counts)}`)
assert(sumCounts(history.death_year_counts) === knownDeathYears, `death year history count mismatch: expected ${knownDeathYears}, got ${sumCounts(history.death_year_counts)}`)

const expectedDiscovery = {
  snapshot: '/stats.json',
  history: '/stats-history.json',
  canonical_only: true,
  source: 'reviewed_entity_event_evidence_aggregation',
}
assert(JSON.stringify(version.stats) === JSON.stringify(expectedDiscovery), 'version stats discovery mismatch')
assert(JSON.stringify(manifest.stats) === JSON.stringify(expectedDiscovery), 'manifest stats discovery mismatch')
for (const text of [llms, ai]) {
  assert(text.includes('/stats.json'), 'stats.json missing from discovery text')
  assert(text.includes('/stats-history.json'), 'stats-history.json missing from discovery text')
}

const serialized = `${JSON.stringify(stats)}\n${JSON.stringify(history)}`
for (const forbidden of ['candidate_class', 'data-staging', 'internal monitoring', 'private research note']) {
  assert(!serialized.includes(forbidden), `stats output leaked forbidden marker: ${forbidden}`)
}

console.log(`Validated HEI stats outputs: ${entities.length} entities, ${events.length} events, ${evidence.length} evidence, ${history.snapshots.length} history snapshot(s).`)
