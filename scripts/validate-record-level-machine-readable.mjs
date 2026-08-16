import fs from 'node:fs'
import path from 'node:path'
import { buildBundleEntityIdMap, loadReviewedBundles, mergeRecords, stableStringify } from './lib/reviewed-bundle-aggregation.mjs'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'

const root = process.cwd()
const origin = 'https://hei.badjoke-lab.com'

function assert(condition, message) {
  if (!condition) throw new Error(`record-level machine-readable validation failed: ${message}`)
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

function compareEvents(a, b) {
  const dateOrder = String(a.event_date ?? '').localeCompare(String(b.event_date ?? ''))
  if (dateOrder !== 0) return dateOrder
  const sortOrder = Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)
  if (sortOrder !== 0) return sortOrder
  return String(a.id).localeCompare(String(b.id))
}

const version = readJson('public/version.json')
const manifest = readJson('public/data/manifest.json')
const llms = readText('public/llms.txt')
const ai = readText('public/ai.txt')
const index = readJson('public/data/exchanges/index.json')
const canonicalEntities = readJson('data/entities.json')
const canonicalEvents = readJson('data/events.json')
const canonicalEvidence = readJson('data/evidence.json')
const { all: reviewedBundles, newEntityBundles } = loadReviewedBundles(root, canonicalEntities)
const correctedCanonicalEntities = applyReviewedEntityCorrections(canonicalEntities, reviewedBundles)
const entities = [...correctedCanonicalEntities, ...newEntityBundles.map(({ bundle }) => bundle.entity)]
const bundleEntityIdMap = buildBundleEntityIdMap(correctedCanonicalEntities, reviewedBundles)
const events = mergeRecords(canonicalEvents, reviewedBundles, 'events', 'event')
const evidence = mergeRecords(canonicalEvidence, reviewedBundles, 'evidence', 'evidence')
const canonicalExchangeId = (exchangeId) => bundleEntityIdMap.get(exchangeId) ?? exchangeId

const expectedDiscovery = {
  index: '/data/exchanges/index.json',
  record_url_template: '/data/exchanges/{slug}.json',
  record_count: entities.length,
  canonical_only: true,
}
assert(stableStringify(version.record_level) === stableStringify(expectedDiscovery), 'version record_level discovery mismatch')
assert(stableStringify(manifest.record_level) === stableStringify(expectedDiscovery), 'manifest record_level discovery mismatch')
for (const text of [llms, ai]) {
  assert(text.includes('/data/exchanges/index.json'), 'record-level index missing from discovery text')
  assert(text.includes('/data/exchanges/{slug}.json'), 'record-level template missing from discovery text')
}

assert(index.schema_version === '1.0.0', 'index schema_version mismatch')
assert(index.data_schema_version === 'hei_entity_event_evidence_v1', 'index data_schema_version mismatch')
assert(index.project_id === 'historical-exchange-index', 'index project_id mismatch')
assert(index.record_type === 'exchange_record_bundle_index', 'index record_type mismatch')
assert(index.canonical_only === true, 'index canonical_only must be true')
assert(index.generated_at === version.build?.generated_at, 'index generated_at must match version')
assert(index.canonical_origin === origin, 'index canonical_origin mismatch')
assert(index.record_count === entities.length, 'index record_count mismatch')
assert(index.records.length === entities.length, 'index records length mismatch')
assert(index.record_url_template === `${origin}/data/exchanges/{slug}.json`, 'index record_url_template mismatch')

const indexById = new Map(index.records.map((item) => [item.id, item]))
assert(indexById.size === entities.length, 'index IDs are not unique')

for (const entity of entities) {
  const relativePath = `public/data/exchanges/${entity.slug}.json`
  const record = readJson(relativePath)
  const expectedEvents = events
    .filter((event) => canonicalExchangeId(event.exchange_id) === entity.id)
    .sort(compareEvents)
  const expectedEvidence = evidence
    .filter((item) => canonicalExchangeId(item.exchange_id) === entity.id)
    .sort((a, b) => String(a.id).localeCompare(String(b.id)))
  const expectedEvidenceIdsByEvent = new Map()
  for (const item of expectedEvidence) {
    if (!item.event_id) continue
    const ids = expectedEvidenceIdsByEvent.get(item.event_id) ?? []
    ids.push(item.id)
    expectedEvidenceIdsByEvent.set(item.event_id, ids)
  }

  assert(record.schema_version === '1.0.0', `${entity.slug} schema_version mismatch`)
  assert(record.data_schema_version === 'hei_entity_event_evidence_v1', `${entity.slug} data_schema_version mismatch`)
  assert(record.project_id === 'historical-exchange-index', `${entity.slug} project_id mismatch`)
  assert(record.record_type === 'exchange_record_bundle', `${entity.slug} record_type mismatch`)
  assert(record.canonical_only === true, `${entity.slug} canonical_only must be true`)
  assert(record.generated_at === version.build?.generated_at, `${entity.slug} generated_at mismatch`)
  assert(record.canonical_origin === origin, `${entity.slug} canonical_origin mismatch`)
  assert(record.canonical_page_url === `${origin}/exchange/${entity.slug}/`, `${entity.slug} canonical page URL mismatch`)
  assert(record.record_json_url === `${origin}/data/exchanges/${entity.slug}.json`, `${entity.slug} record JSON URL mismatch`)
  assert(record.entity?.id === entity.id, `${entity.slug} entity ID mismatch`)
  assert(record.entity?.slug === entity.slug, `${entity.slug} entity slug mismatch`)
  assert(record.entity?.record_type === 'exchange_entity', `${entity.slug} entity record_type mismatch`)
  assert(record.relationships?.predecessor_id === (entity.predecessor_id ?? null), `${entity.slug} predecessor mismatch`)
  assert(record.relationships?.successor_id === (entity.successor_id ?? null), `${entity.slug} successor mismatch`)
  assert(record.verification?.last_verified_at === (entity.last_verified_at ?? null), `${entity.slug} last_verified_at mismatch`)
  assert(record.verification?.confidence === (entity.confidence ?? null), `${entity.slug} confidence mismatch`)
  assert(record.counts?.events === expectedEvents.length, `${entity.slug} event count mismatch`)
  assert(record.counts?.evidence === expectedEvidence.length, `${entity.slug} evidence count mismatch`)
  assert(record.events.length === expectedEvents.length, `${entity.slug} events length mismatch`)
  assert(record.evidence.length === expectedEvidence.length, `${entity.slug} evidence length mismatch`)

  for (let i = 0; i < expectedEvents.length; i += 1) {
    const actual = record.events[i]
    const expected = expectedEvents[i]
    assert(actual.id === expected.id, `${entity.slug} event order/ID mismatch at ${i}`)
    assert(actual.exchange_id === entity.id, `${entity.slug} event canonical exchange ID mismatch: ${actual.id}`)
    assert(actual.exchange_slug === entity.slug, `${entity.slug} event slug mismatch: ${actual.id}`)
    assert(actual.record_type === 'exchange_event', `${entity.slug} event record_type mismatch: ${actual.id}`)
    const expectedIds = [...(expectedEvidenceIdsByEvent.get(expected.id) ?? [])].sort()
    assert(stableStringify(actual.evidence_ids) === stableStringify(expectedIds), `${entity.slug} evidence_ids mismatch: ${actual.id}`)
  }

  for (let i = 0; i < expectedEvidence.length; i += 1) {
    const actual = record.evidence[i]
    const expected = expectedEvidence[i]
    assert(actual.id === expected.id, `${entity.slug} evidence order/ID mismatch at ${i}`)
    assert(actual.exchange_id === entity.id, `${entity.slug} evidence canonical exchange ID mismatch: ${actual.id}`)
    assert(actual.exchange_slug === entity.slug, `${entity.slug} evidence slug mismatch: ${actual.id}`)
    assert(actual.record_type === 'exchange_evidence', `${entity.slug} evidence record_type mismatch: ${actual.id}`)
  }

  const indexItem = indexById.get(entity.id)
  assert(indexItem, `${entity.slug} missing from index`)
  assert(indexItem.slug === entity.slug, `${entity.slug} index slug mismatch`)
  assert(indexItem.event_count === expectedEvents.length, `${entity.slug} index event_count mismatch`)
  assert(indexItem.evidence_count === expectedEvidence.length, `${entity.slug} index evidence_count mismatch`)
  assert(indexItem.record_json_url === record.record_json_url, `${entity.slug} index record URL mismatch`)

  const serialized = JSON.stringify(record)
  for (const forbidden of ['candidate_class', 'data-staging', 'internal monitoring', 'private research note']) {
    assert(!serialized.includes(forbidden), `${entity.slug} contains forbidden marker: ${forbidden}`)
  }
}

const files = fs.readdirSync(path.join(root, 'public', 'data', 'exchanges')).filter((name) => name.endsWith('.json'))
assert(files.length === entities.length + 1, 'record-level output contains stale or missing JSON files')

console.log(`Validated ${entities.length} HEI record-level machine-readable bundles and discovery metadata.`)
