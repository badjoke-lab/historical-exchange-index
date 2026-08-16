import fs from 'node:fs'
import path from 'node:path'
import { buildBundleEntityIdMap, loadReviewedBundles, mergeRecords } from './lib/reviewed-bundle-aggregation.mjs'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'

const root = process.cwd()
const publicDir = path.join(root, 'public')
const outputDir = path.join(publicDir, 'data', 'exchanges')
const origin = 'https://hei.badjoke-lab.com'

function readJson(relativePath, fallback = []) {
  const filePath = path.join(root, relativePath)
  return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : fallback
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

function appendDiscoveryOnce(filePath, marker, block) {
  const current = fs.readFileSync(filePath, 'utf8').trimEnd()
  if (current.includes(marker)) return
  fs.writeFileSync(filePath, `${current}\n\n${block.trim()}\n`, 'utf8')
}

function compareEvents(a, b) {
  const dateOrder = String(a.event_date ?? '').localeCompare(String(b.event_date ?? ''))
  if (dateOrder !== 0) return dateOrder
  const sortOrder = Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)
  if (sortOrder !== 0) return sortOrder
  return String(a.id).localeCompare(String(b.id))
}

const versionPath = path.join(publicDir, 'version.json')
const manifestPath = path.join(publicDir, 'data', 'manifest.json')
const llmsPath = path.join(publicDir, 'llms.txt')
const aiPath = path.join(publicDir, 'ai.txt')
if (!fs.existsSync(versionPath)) {
  throw new Error('record-level build requires public/version.json from build-machine-readable-layer.mjs')
}
if (!fs.existsSync(manifestPath) || !fs.existsSync(llmsPath) || !fs.existsSync(aiPath)) {
  throw new Error('record-level build requires the base machine-readable public layer')
}
const version = JSON.parse(fs.readFileSync(versionPath, 'utf8'))
const generatedAt = version.build?.generated_at
if (!generatedAt) throw new Error('record-level build could not resolve generated_at')

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
const entityById = new Map(entities.map((entity) => [entity.id, entity]))

fs.rmSync(outputDir, { recursive: true, force: true })
fs.mkdirSync(outputDir, { recursive: true })

const eventsByEntity = new Map()
for (const sourceEvent of events) {
  const exchangeId = canonicalExchangeId(sourceEvent.exchange_id)
  if (!entityById.has(exchangeId)) continue
  const normalized = {
    ...sourceEvent,
    exchange_id: exchangeId,
    exchange_slug: entityById.get(exchangeId).slug,
    record_type: 'exchange_event',
    canonical_page_url: `${origin}/exchange/${entityById.get(exchangeId).slug}/`,
  }
  const list = eventsByEntity.get(exchangeId) ?? []
  list.push(normalized)
  eventsByEntity.set(exchangeId, list)
}

const evidenceByEntity = new Map()
for (const sourceEvidence of evidence) {
  const exchangeId = canonicalExchangeId(sourceEvidence.exchange_id)
  if (!entityById.has(exchangeId)) continue
  const normalized = {
    ...sourceEvidence,
    exchange_id: exchangeId,
    exchange_slug: entityById.get(exchangeId).slug,
    record_type: 'exchange_evidence',
    canonical_page_url: `${origin}/exchange/${entityById.get(exchangeId).slug}/`,
  }
  const list = evidenceByEntity.get(exchangeId) ?? []
  list.push(normalized)
  evidenceByEntity.set(exchangeId, list)
}

const indexRecords = []
for (const entity of [...entities].sort((a, b) => a.slug.localeCompare(b.slug))) {
  const entityEvents = [...(eventsByEntity.get(entity.id) ?? [])].sort(compareEvents)
  const entityEvidence = [...(evidenceByEntity.get(entity.id) ?? [])].sort((a, b) => String(a.id).localeCompare(String(b.id)))
  const evidenceIdsByEvent = new Map()
  for (const item of entityEvidence) {
    if (!item.event_id) continue
    const ids = evidenceIdsByEvent.get(item.event_id) ?? []
    ids.push(item.id)
    evidenceIdsByEvent.set(item.event_id, ids)
  }
  const enrichedEvents = entityEvents.map((event) => ({
    ...event,
    evidence_ids: [...(evidenceIdsByEvent.get(event.id) ?? [])].sort(),
  }))
  const canonicalPageUrl = `${origin}/exchange/${entity.slug}/`
  const recordJsonUrl = `${origin}/data/exchanges/${entity.slug}.json`
  const record = {
    schema_version: '1.0.0',
    data_schema_version: 'hei_entity_event_evidence_v1',
    project_id: 'historical-exchange-index',
    record_type: 'exchange_record_bundle',
    canonical_only: true,
    generated_at: generatedAt,
    canonical_origin: origin,
    canonical_page_url: canonicalPageUrl,
    record_json_url: recordJsonUrl,
    entity: {
      ...entity,
      record_type: 'exchange_entity',
      canonical_page_url: canonicalPageUrl,
    },
    relationships: {
      predecessor_id: entity.predecessor_id ?? null,
      successor_id: entity.successor_id ?? null,
    },
    verification: {
      last_verified_at: entity.last_verified_at ?? null,
      confidence: entity.confidence ?? null,
    },
    counts: {
      events: enrichedEvents.length,
      evidence: entityEvidence.length,
    },
    events: enrichedEvents,
    evidence: entityEvidence,
  }
  const serialized = JSON.stringify(record)
  for (const forbidden of ['candidate_class', 'data-staging', 'internal monitoring', 'private research note']) {
    if (serialized.includes(forbidden)) throw new Error(`record-level output leaked forbidden marker: ${forbidden} (${entity.slug})`)
  }
  writeJson(path.join(outputDir, `${entity.slug}.json`), record)
  indexRecords.push({
    id: entity.id,
    slug: entity.slug,
    canonical_name: entity.canonical_name,
    type: entity.type,
    status: entity.status,
    confidence: entity.confidence ?? null,
    last_verified_at: entity.last_verified_at ?? null,
    event_count: enrichedEvents.length,
    evidence_count: entityEvidence.length,
    canonical_page_url: canonicalPageUrl,
    record_json_url: recordJsonUrl,
  })
}

writeJson(path.join(outputDir, 'index.json'), {
  schema_version: '1.0.0',
  data_schema_version: 'hei_entity_event_evidence_v1',
  project_id: 'historical-exchange-index',
  record_type: 'exchange_record_bundle_index',
  canonical_only: true,
  generated_at: generatedAt,
  canonical_origin: origin,
  record_count: indexRecords.length,
  record_url_template: `${origin}/data/exchanges/{slug}.json`,
  records: indexRecords,
})

const recordLevelDiscovery = {
  index: '/data/exchanges/index.json',
  record_url_template: '/data/exchanges/{slug}.json',
  record_count: indexRecords.length,
  canonical_only: true,
}
version.record_level = recordLevelDiscovery
writeJson(versionPath, version)

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
manifest.record_level = recordLevelDiscovery
writeJson(manifestPath, manifest)

appendDiscoveryOnce(llmsPath, '/data/exchanges/index.json', `## Record-level reviewed bundles
- Index: /data/exchanges/index.json
- Record template: /data/exchanges/{slug}.json
- Each record bundles one reviewed exchange entity with its reviewed events, event evidence references, evidence provenance, relationships, and verification metadata.
- Record-level files use the same reviewed canonical source of truth as the main public datasets.`)

appendDiscoveryOnce(aiPath, '/data/exchanges/index.json', `Record-level reviewed bundles:
/data/exchanges/index.json
/data/exchanges/{slug}.json
These files bundle one reviewed exchange entity with its reviewed events, evidence provenance, relationships, and verification metadata from the same canonical source of truth.`)

console.log(`Built ${indexRecords.length} HEI record-level machine-readable bundles.`)
