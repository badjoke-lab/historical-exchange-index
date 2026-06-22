import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import {
  classifyReviewedBundles,
  loadReviewedBundles,
  mergeRecords,
  stableStringify,
} from './lib/reviewed-bundle-aggregation.mjs'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'
import { loadCanonicalData } from './monitoring/core/load-canonical-data.mjs'

const root = process.cwd()
const outputArg = process.argv.find((arg) => arg.startsWith('--output='))
const selfTest = process.argv.includes('--self-test')

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function readJson(relativePath) {
  const filePath = path.join(root, relativePath)
  assert(fs.existsSync(filePath), `missing ${relativePath}`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function listIds(records, label) {
  const ids = records.map((record) => record?.id)
  assert(ids.every(Boolean), `${label}: missing id`)
  assert(new Set(ids).size === ids.length, `${label}: duplicate ids remain after projection`)
  return [...ids].sort()
}

function equalIdSets(left, right, label) {
  assert(stableStringify(listIds(left, `${label} left`)) === stableStringify(listIds(right, `${label} right`)), `${label}: id sets differ`)
}

function remapRecord(record, entityIdMap) {
  const exchangeId = entityIdMap.get(record.exchange_id) ?? record.exchange_id
  return exchangeId === record.exchange_id ? record : { ...record, exchange_id: exchangeId }
}

function assertNoConflictingDuplicateRecords(canonicalRecords, bundles, field, label, entityIdMap) {
  const byId = new Map(canonicalRecords.map((record) => [record.id, record]))
  for (const { fileName, bundle } of bundles) {
    for (const sourceRecord of bundle[field] ?? []) {
      const record = remapRecord(sourceRecord, entityIdMap)
      const existing = byId.get(record.id)
      if (!existing) {
        byId.set(record.id, record)
        continue
      }
      assert(
        stableStringify(existing) === stableStringify(record),
        `${fileName}: conflicting ${label} id: ${record.id}`,
      )
    }
  }
}

function countDetailPages() {
  const exchangeDir = path.join(root, 'out', 'exchange')
  if (!fs.existsSync(exchangeDir)) return 0
  return fs.readdirSync(exchangeDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(exchangeDir, entry.name, 'index.html')))
    .length
}

function sitemapLocations() {
  const sitemapPath = path.join(root, 'out', 'sitemap.xml')
  assert(fs.existsSync(sitemapPath), 'missing out/sitemap.xml')
  const sitemap = fs.readFileSync(sitemapPath, 'utf8')
  return [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
}

function runSelfTest() {
  const canonicalEntities = [{ id: 'hei_ex_1', slug: 'one', canonical_name: 'One', aliases: [], official_domain_original: 'one.test' }]
  const repairEntry = {
    fileName: 'repair.json',
    bundle: {
      entity: { id: 'bundle_repair', slug: 'one', canonical_name: 'One', aliases: [], official_domain_original: 'one.test' },
      events: [],
      evidence: [],
    },
  }
  const newEntry = {
    fileName: 'new.json',
    bundle: {
      entity: { id: 'hei_ex_2', slug: 'two', canonical_name: 'Two', aliases: [], official_domain_original: 'two.test' },
      events: [],
      evidence: [],
    },
  }
  const classified = classifyReviewedBundles(canonicalEntities, [repairEntry, newEntry])
  assert(classified.newEntityBundles.length === 1, 'repair bundle incorrectly increased entity count')
  assert(classified.entityIdMap.get('bundle_repair') === 'hei_ex_1', 'repair bundle did not map to canonical entity')

  const canonicalEvents = [{ id: 'event_1', exchange_id: 'hei_ex_1', event_type: 'other' }]
  const identical = [{
    fileName: 'identical.json',
    bundle: { entity: newEntry.bundle.entity, events: [{ id: 'event_2', exchange_id: 'hei_ex_2', event_type: 'other' }], evidence: [] },
  }, {
    fileName: 'identical-copy.json',
    bundle: { entity: newEntry.bundle.entity, events: [{ id: 'event_2', exchange_id: 'hei_ex_2', event_type: 'other' }], evidence: [] },
  }]
  assert(mergeRecords(canonicalEvents, identical, 'events', 'event').length === 2, 'identical duplicate event did not count once')

  const conflicting = [{
    fileName: 'conflict.json',
    bundle: { entity: newEntry.bundle.entity, events: [{ id: 'event_1', exchange_id: 'hei_ex_1', event_type: 'hack' }], evidence: [] },
  }]
  let rejected = false
  try {
    assertNoConflictingDuplicateRecords(canonicalEvents, conflicting, 'events', 'event', new Map())
  } catch {
    rejected = true
  }
  assert(rejected, 'conflicting canonical/bundle duplicate id was not rejected')
  console.log('Count semantics regression self-test: pass')
}

if (selfTest) {
  runSelfTest()
  process.exit(0)
}

const canonicalEntities = readJson('data/entities.json')
const canonicalEvents = readJson('data/events.json')
const canonicalEvidence = readJson('data/evidence.json')
const { all: reviewedBundles, newEntityBundles, entityIdMap } = loadReviewedBundles(root, canonicalEntities)
const repairBundles = reviewedBundles.filter((entry) => !newEntityBundles.includes(entry))

assertNoConflictingDuplicateRecords(canonicalEvents, reviewedBundles, 'events', 'event', entityIdMap)
assertNoConflictingDuplicateRecords(canonicalEvidence, reviewedBundles, 'evidence', 'evidence', entityIdMap)

const projectedEntities = [
  ...applyReviewedEntityCorrections(canonicalEntities, reviewedBundles),
  ...newEntityBundles.map(({ bundle }) => bundle.entity),
]
const projectedEvents = mergeRecords(canonicalEvents, reviewedBundles, 'events', 'event', entityIdMap)
const projectedEvidence = mergeRecords(canonicalEvidence, reviewedBundles, 'evidence', 'evidence', entityIdMap)
const monitoring = await loadCanonicalData()

assert(projectedEntities.length === canonicalEntities.length + newEntityBundles.length, 'repair bundles increased projected entity count')
assert(reviewedBundles.length === newEntityBundles.length + repairBundles.length, 'bundle classification does not cover all bundles')
equalIdSets(projectedEntities, monitoring.entities, 'monitoring entities')
equalIdSets(projectedEvents, monitoring.events, 'monitoring events')
equalIdSets(projectedEvidence, monitoring.evidence, 'monitoring evidence')

const manifest = readJson('public/data/manifest.json')
const machineEntities = readJson('public/data/entities.json')
const machineEvents = readJson('public/data/events.json')
const machineEvidence = readJson('public/data/evidence.json')

const expected = {
  entities: projectedEntities.length,
  events: projectedEvents.length,
  evidence: projectedEvidence.length,
}

assert(manifest.record_counts.primary_records === expected.entities, 'machine manifest entity count mismatch')
assert(manifest.record_counts.events === expected.events, 'machine manifest event count mismatch')
assert(manifest.record_counts.evidence === expected.evidence, 'machine manifest evidence count mismatch')
assert(machineEntities.record_count === expected.entities && machineEntities.records.length === expected.entities, 'machine entity collection count mismatch')
assert(machineEvents.record_count === expected.events && machineEvents.records.length === expected.events, 'machine event collection count mismatch')
assert(machineEvidence.record_count === expected.evidence && machineEvidence.records.length === expected.evidence, 'machine evidence collection count mismatch')
equalIdSets(projectedEntities, machineEntities.records, 'machine entities')
equalIdSets(projectedEvents, machineEvents.records, 'machine events')
equalIdSets(projectedEvidence, machineEvidence.records, 'machine evidence')

const outManifest = readJson('out/data/manifest.json')
const outEntities = readJson('out/data/entities.json')
const outEvents = readJson('out/data/events.json')
const outEvidence = readJson('out/data/evidence.json')
assert(outManifest.record_counts.primary_records === expected.entities, 'built manifest entity count mismatch')
assert(outManifest.record_counts.events === expected.events, 'built manifest event count mismatch')
assert(outManifest.record_counts.evidence === expected.evidence, 'built manifest evidence count mismatch')
equalIdSets(projectedEntities, outEntities.records, 'built entities')
equalIdSets(projectedEvents, outEvents.records, 'built events')
equalIdSets(projectedEvidence, outEvidence.records, 'built evidence')

const detailPages = countDetailPages()
assert(detailPages === expected.entities, `exchange detail page count mismatch: ${detailPages}`)
const locations = sitemapLocations()
assert(new Set(locations).size === locations.length, 'sitemap contains duplicate URLs')
const entityLocations = locations.filter((location) => location.includes('/exchange/'))
assert(entityLocations.length === expected.entities, `sitemap entity route count mismatch: ${entityLocations.length}`)
for (const entity of projectedEntities) {
  assert(entityLocations.includes(`https://hei.badjoke-lab.com/exchange/${entity.slug}/`), `sitemap missing entity route: ${entity.slug}`)
}

const report = {
  generated_at: new Date().toISOString(),
  canonical_counts: {
    entities: canonicalEntities.length,
    events: canonicalEvents.length,
    evidence: canonicalEvidence.length,
  },
  reviewed_bundles: {
    total: reviewedBundles.length,
    new_entities: newEntityBundles.length,
    repairs: repairBundles.length,
  },
  projected_counts: expected,
  monitoring_counts: {
    entities: monitoring.entities.length,
    events: monitoring.events.length,
    evidence: monitoring.evidence.length,
  },
  machine_counts: {
    entities: machineEntities.records.length,
    events: machineEvents.records.length,
    evidence: machineEvidence.records.length,
  },
  built_output_counts: {
    entities: outEntities.records.length,
    events: outEvents.records.length,
    evidence: outEvidence.records.length,
    exchange_detail_pages: detailPages,
    sitemap_entity_routes: entityLocations.length,
    sitemap_total_routes: locations.length,
  },
  status: 'pass',
}

if (outputArg) {
  const outputPath = path.resolve(root, outputArg.slice('--output='.length))
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}

console.log(`Count semantics regression: ${expected.entities} entities, ${expected.events} events, ${expected.evidence} evidence`)
console.log(`Reviewed bundles: ${reviewedBundles.length} total, ${newEntityBundles.length} new entities, ${repairBundles.length} repairs`)
console.log(`Built routes: ${detailPages} exchange pages, ${entityLocations.length} sitemap exchange routes`)
