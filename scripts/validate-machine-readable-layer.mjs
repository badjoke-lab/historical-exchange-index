import fs from 'node:fs'
import path from 'node:path'
import { loadReviewedBundles, mergeRecords, stableStringify } from './lib/reviewed-bundle-aggregation.mjs'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'

const root = process.cwd()
const origin = 'https://hei.badjoke-lab.com'

function fail(message) {
  throw new Error(`machine-readable validation failed: ${message}`)
}

function assert(condition, message) {
  if (!condition) fail(message)
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

function countBy(items, key) {
  return items.reduce((counts, item) => {
    const value = item[key] ?? 'unknown'
    counts[value] = (counts[value] ?? 0) + 1
    return counts
  }, {})
}

function deepEqual(actual, expected, label) {
  assert(stableStringify(actual) === stableStringify(expected), `${label} does not match generated public data`)
}

function expectedCommit() {
  return process.env.CF_PAGES_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || 'unknown'
}

function expectedBranch() {
  return process.env.CF_PAGES_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.GITHUB_REF_NAME || 'main'
}

const version = readJson('public/version.json')
const manifest = readJson('public/data/manifest.json')
const publicEntities = readJson('public/data/entities.json')
const publicEvents = readJson('public/data/events.json')
const publicEvidence = readJson('public/data/evidence.json')
const llms = readText('public/llms.txt')
const ai = readText('public/ai.txt')

const canonicalEntities = readJson('data/entities.json')
const canonicalEvents = readJson('data/events.json')
const canonicalEvidence = readJson('data/evidence.json')
const { all: reviewedBundles, newEntityBundles } = loadReviewedBundles(root, canonicalEntities)
const correctedCanonicalEntities = applyReviewedEntityCorrections(canonicalEntities, reviewedBundles)
const entities = [...correctedCanonicalEntities, ...newEntityBundles.map(({ bundle }) => bundle.entity)]
const events = mergeRecords(canonicalEvents, reviewedBundles, 'events', 'event')
const evidence = mergeRecords(canonicalEvidence, reviewedBundles, 'evidence', 'evidence')
const entityById = new Map(entities.map((entity) => [entity.id, entity]))

const deadSideStatuses = new Set(['dead', 'merged', 'acquired', 'rebranded'])
const activeSideStatuses = new Set(['active', 'limited', 'inactive'])
const expectedCounts = {
  primary_records: entities.length,
  events: events.length,
  evidence: evidence.length,
}
const expectedBreakdown = {
  exchanges: entities.length,
  active_side: entities.filter((entity) => activeSideStatuses.has(entity.status)).length,
  dead_side: entities.filter((entity) => deadSideStatuses.has(entity.status)).length,
  status: countBy(entities, 'status'),
  type: countBy(entities, 'type'),
}
const reviewedDates = entities
  .map((entity) => entity.last_verified_at)
  .filter((value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value))
  .sort()
const expectedLastReviewedAt = reviewedDates.at(-1) ?? null
const expectedPublicFiles = {
  version: '/version.json',
  manifest: '/data/manifest.json',
  entities: '/data/entities.json',
  events: '/data/events.json',
  evidence: '/data/evidence.json',
  llms: '/llms.txt',
  ai: '/ai.txt',
}

assert(version.schema_version === '1.0.0', 'version schema_version must be 1.0.0')
assert(version.project_id === 'historical-exchange-index', 'version project_id is incorrect')
assert(version.registry_family === 'badjoke-lab-ledger-series', 'version registry_family is incorrect')
assert(version.registry_type === 'historical_crypto_exchange_registry', 'version registry_type is incorrect')
assert(version.canonical_origin === origin, 'version canonical_origin is incorrect')
assert(version.build?.verification_marker === 'hei_machine_readable_layer_v1', 'verification marker is incorrect')
assert(version.build?.commit === expectedCommit(), 'build commit does not match deployment environment')
assert(version.build?.branch === expectedBranch(), 'build branch does not match deployment environment')
assert(!Number.isNaN(Date.parse(version.build?.generated_at)), 'build generated_at is not a valid timestamp')
assert(version.data?.generated_at === version.build.generated_at, 'version build/data timestamps differ')
assert(version.data?.data_schema_version === 'hei_entity_event_evidence_v1', 'data schema version is incorrect')
assert(version.data?.records_last_reviewed_at === expectedLastReviewedAt, 'records_last_reviewed_at is incorrect')
assert(version.data?.canonical_only === true, 'version canonical_only must be true')
deepEqual(version.data?.record_counts, expectedCounts, 'version record_counts')
deepEqual(version.data?.record_count_breakdown, expectedBreakdown, 'version record_count_breakdown')
deepEqual(version.public_files, expectedPublicFiles, 'version public_files')
assert(version.routes?.quality === '/quality/', 'version routes is missing quality')
assert(version.routes?.updates === '/updates/', 'version routes is missing updates')
assert(version.routes?.incidents === '/incidents/', 'version routes is missing incidents')

assert(manifest.schema_version === '1.0.0', 'manifest schema_version must be 1.0.0')
assert(manifest.data_schema_version === 'hei_entity_event_evidence_v1', 'manifest data_schema_version is incorrect')
assert(manifest.project_id === version.project_id, 'manifest/version project_id mismatch')
assert(manifest.canonical_origin === version.canonical_origin, 'manifest/version canonical_origin mismatch')
assert(manifest.registry_family === version.registry_family, 'manifest/version registry_family mismatch')
assert(manifest.registry_type === version.registry_type, 'manifest/version registry_type mismatch')
assert(manifest.generated_at === version.build.generated_at, 'manifest/version generated_at mismatch')
assert(manifest.records_last_reviewed_at === expectedLastReviewedAt, 'manifest records_last_reviewed_at mismatch')
deepEqual(manifest.record_counts, expectedCounts, 'manifest record_counts')
deepEqual(manifest.record_count_breakdown, expectedBreakdown, 'manifest record_count_breakdown')
deepEqual(manifest.data_safety, {
  canonical_only: true,
  includes_unreviewed_candidates: false,
  includes_internal_monitoring: false,
  includes_private_notes: false,
}, 'manifest data_safety')
deepEqual(manifest.public_files, expectedPublicFiles, 'manifest public_files')
assert(manifest.canonical_source_of_truth?.entities, 'manifest canonical source description is missing')

for (const [label, collection, sourceRecords, recordType] of [
  ['entities', publicEntities, entities, 'exchange_entity'],
  ['events', publicEvents, events, 'exchange_event'],
  ['evidence', publicEvidence, evidence, 'exchange_evidence'],
]) {
  assert(collection.schema_version === version.schema_version, `${label} schema_version mismatch`)
  assert(collection.data_schema_version === version.data.data_schema_version, `${label} data_schema_version mismatch`)
  assert(collection.project_id === version.project_id, `${label} project_id mismatch`)
  assert(collection.canonical_origin === origin, `${label} canonical_origin mismatch`)
  assert(collection.canonical_only === true, `${label} canonical_only must be true`)
  assert(collection.generated_at === version.build.generated_at, `${label} generated_at mismatch`)
  assert(collection.records_last_reviewed_at === expectedLastReviewedAt, `${label} records_last_reviewed_at mismatch`)
  assert(collection.record_type === recordType, `${label} record_type mismatch`)
  assert(collection.record_count === sourceRecords.length, `${label} record_count mismatch`)
  assert(collection.records.length === sourceRecords.length, `${label} records length mismatch`)
  assert(collection.records.every((record) => typeof record.canonical_page_url === 'string' && record.canonical_page_url.startsWith(`${origin}/exchange/`)), `${label} canonical_page_url is incomplete`)
  const serialized = JSON.stringify(collection)
  assert(!serialized.includes('candidate_class'), `${label} contains unreviewed candidate data`)
  assert(!serialized.includes('data-staging'), `${label} contains internal staging paths`)
}

assert(publicEntities.records.every((record) => record.record_type === 'exchange_entity' && record.last_verified_at && record.confidence), 'public entity identity fields are incomplete')
assert(publicEvents.records.every((record) => record.record_type === 'exchange_event' && record.confidence && entityById.has(record.exchange_id)), 'public event identity fields are incomplete')
assert(publicEvidence.records.every((record) => record.record_type === 'exchange_evidence' && record.reliability && entityById.has(record.exchange_id)), 'public evidence identity fields are incomplete')

const requiredRoutes = ['/', '/dead/', '/active/', '/exchange/{slug}/', '/stats/', '/quality/', '/updates/', '/incidents/', '/methodology/', '/about/', '/donate/']
for (const route of requiredRoutes) {
  assert(manifest.main_routes?.includes(route), `manifest is missing route ${route}`)
  assert(llms.includes(route), `llms.txt is missing route ${route}`)
  assert(ai.includes(route), `ai.txt is missing route ${route}`)
}

for (const endpoint of Object.values(expectedPublicFiles)) {
  assert(llms.includes(endpoint), `llms.txt is missing endpoint ${endpoint}`)
  assert(ai.includes(endpoint) || endpoint === '/ai.txt', `ai.txt is missing endpoint ${endpoint}`)
}

for (const [label, value] of [
  ['Total records', expectedCounts.primary_records],
  ['Dead-side', expectedBreakdown.dead_side],
  ['Active-side', expectedBreakdown.active_side],
  ['Events', expectedCounts.events],
  ['Evidence', expectedCounts.evidence],
]) {
  assert(llms.includes(`${label}: ${value}`), `llms.txt is missing current ${label}`)
  assert(ai.includes(`${label}: ${value}`), `ai.txt is missing current ${label}`)
}

assert(llms.includes(`${origin}/`), 'llms.txt is missing canonical site')
assert(ai.includes(origin), 'ai.txt is missing canonical origin')
assert(ai.includes('do not include unreviewed candidates'), 'ai.txt is missing public-data safety note')
assert(ai.includes('Search-engine and AI caches may contain older counts'), 'ai.txt is missing freshness guidance')

console.log(`Validated HEI machine-readable layer: ${entities.length} entities, ${events.length} events, ${evidence.length} evidence records.`)
