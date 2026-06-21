import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { loadReviewedBundles, mergeRecords } from './lib/reviewed-bundle-aggregation.mjs'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'
import { restorePreA4LineageEntities } from './lib/lineage-a4-baseline.mjs'

const root = process.cwd()
const lineageEventTypes = new Set(['acquired', 'merged', 'rebranded', 'token_migration'])
const lineageStatuses = new Set(['acquired', 'merged', 'rebranded'])
const lineageReasons = new Set(['acquisition', 'merger', 'rebrand'])
const allowedClassifications = new Set(['link_now', 'document_only', 'unresolved'])
const allowedLinkModes = new Set(['reciprocal_pair', 'one_way_documented'])

const load = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
const canonicalEntities = load('data/entities.json')
const canonicalEvents = load('data/events.json')
const canonicalEvidence = load('data/evidence.json')
const review = load('config/lineage-l2-dispositions.json')
const a4Manifest = load('config/lineage-a4-application.json')
const { all, newEntityBundles, entityIdMap } = loadReviewedBundles(root, canonicalEntities)
const projectedEntities = [
  ...applyReviewedEntityCorrections(canonicalEntities, all),
  ...newEntityBundles.map(({ bundle }) => bundle.entity),
]
const entities = restorePreA4LineageEntities(projectedEntities, a4Manifest)
const events = mergeRecords(canonicalEvents, all, 'events', 'event', entityIdMap)
const evidence = mergeRecords(canonicalEvidence, all, 'evidence', 'evidence', entityIdMap)

const entityById = new Map(entities.map((entity) => [entity.id, entity]))
const eventById = new Map(events.map((event) => [event.id, event]))
const evidenceById = new Map(evidence.map((item) => [item.id, item]))
const eventsByEntity = new Map()
for (const event of events) {
  const list = eventsByEntity.get(event.exchange_id) ?? []
  list.push(event)
  eventsByEntity.set(event.exchange_id, list)
}

const failures = []
const fail = (message) => failures.push(message)
const present = (value) => typeof value === 'string' && value.trim() !== ''

if (review.version !== 1) fail('review version must be 1')
if (review.scope !== 'structured_lineage_candidates_without_existing_edges') fail('unexpected review scope')
if (!Array.isArray(review.dispositions)) fail('dispositions must be an array')

const structuredCandidateIds = entities
  .filter((entity) => {
    if (present(entity.predecessor_id) || present(entity.successor_id)) return false
    const hasLineageEvent = (eventsByEntity.get(entity.id) ?? []).some((event) => lineageEventTypes.has(event.event_type))
    return lineageStatuses.has(entity.status) || lineageReasons.has(entity.death_reason) || hasLineageEvent
  })
  .map((entity) => entity.id)
  .sort()

const dispositionByEntity = new Map()
for (const item of review.dispositions ?? []) {
  const key = item.entity_id
  if (!present(key)) {
    fail('disposition missing entity_id')
    continue
  }
  if (dispositionByEntity.has(key)) fail(`duplicate disposition: ${key}`)
  dispositionByEntity.set(key, item)

  const entity = entityById.get(key)
  if (!entity) {
    fail(`${key}: entity does not exist`)
    continue
  }
  if (entity.canonical_name !== item.entity_name) fail(`${key}: entity_name drift`)
  if (!allowedClassifications.has(item.classification)) fail(`${key}: invalid classification ${item.classification}`)
  if (present(entity.predecessor_id) || present(entity.successor_id)) fail(`${key}: candidate already has a canonical relationship edge`)
  if (typeof item.rationale !== 'string' || item.rationale.trim().length < 40) fail(`${key}: rationale is too short`)
  if (!Array.isArray(item.event_ids) || item.event_ids.length === 0) fail(`${key}: event_ids must be a non-empty array`)
  if (!Array.isArray(item.evidence_ids) || item.evidence_ids.length === 0) fail(`${key}: evidence_ids must be a non-empty array`)

  const relatedIds = new Set([key])
  if (item.classification === 'link_now') {
    if (!['predecessor_id', 'successor_id'].includes(item.relation_field)) fail(`${key}: invalid relation_field`)
    if (!allowedLinkModes.has(item.link_mode)) fail(`${key}: invalid link_mode`)
    const target = entityById.get(item.target_id)
    if (!target) fail(`${key}: canonical target does not exist: ${item.target_id}`)
    else {
      relatedIds.add(target.id)
      if (target.canonical_name !== item.target_name) fail(`${key}: target_name drift`)
      if (present(entity[item.relation_field])) fail(`${key}: source relation field is already occupied`)
      if (item.link_mode === 'reciprocal_pair') {
        const reciprocalField = item.relation_field === 'predecessor_id' ? 'successor_id' : 'predecessor_id'
        const current = target[reciprocalField]
        if (present(current) && current !== key) fail(`${key}: reciprocal target field conflicts with ${current}`)
      }
    }
    if (present(item.named_target) || present(item.unresolved_reason)) fail(`${key}: link_now must not carry unresolved fields`)
  } else {
    for (const field of ['relation_field', 'target_id', 'target_name', 'link_mode']) {
      if (present(item[field])) fail(`${key}: ${item.classification} must not carry ${field}`)
    }
    if (item.classification === 'unresolved') {
      if (!present(item.named_target)) fail(`${key}: unresolved candidate requires named_target`)
      if (!present(item.unresolved_reason)) fail(`${key}: unresolved candidate requires unresolved_reason`)
    } else if (present(item.named_target) || present(item.unresolved_reason)) {
      fail(`${key}: document_only must not carry unresolved fields`)
    }
  }

  for (const eventId of item.event_ids ?? []) {
    const event = eventById.get(eventId)
    if (!event) fail(`${key}: missing event ${eventId}`)
    else if (!relatedIds.has(event.exchange_id)) fail(`${key}: event ${eventId} belongs to unrelated entity ${event.exchange_id}`)
  }
  for (const evidenceId of item.evidence_ids ?? []) {
    const record = evidenceById.get(evidenceId)
    if (!record) fail(`${key}: missing evidence ${evidenceId}`)
    else if (!relatedIds.has(record.exchange_id)) fail(`${key}: evidence ${evidenceId} belongs to unrelated entity ${record.exchange_id}`)
  }
}

for (const candidateId of structuredCandidateIds) {
  if (!dispositionByEntity.has(candidateId)) fail(`structured candidate lacks disposition: ${candidateId}`)
}
for (const entityId of dispositionByEntity.keys()) {
  if (!structuredCandidateIds.includes(entityId)) fail(`stale or non-candidate disposition: ${entityId}`)
}

const counts = { link_now: 0, document_only: 0, unresolved: 0 }
for (const item of review.dispositions ?? []) {
  if (Object.hasOwn(counts, item.classification)) counts[item.classification] += 1
}
const expectedCounts = { link_now: 7, document_only: 8, unresolved: 10 }
for (const [classification, expected] of Object.entries(expectedCounts)) {
  if (counts[classification] !== expected) fail(`${classification}: expected ${expected}, got ${counts[classification]}`)
}
if (structuredCandidateIds.length !== 25) fail(`expected 25 structured candidates, got ${structuredCandidateIds.length}`)

const report = {
  generated_at: new Date().toISOString(),
  baseline: 'pre_a4_review_state',
  projected_public_entities: entities.length,
  structured_candidates: structuredCandidateIds.length,
  reviewed_dispositions: review.dispositions?.length ?? 0,
  classification_counts: counts,
  failures,
  status: failures.length === 0 ? 'pass' : 'fail',
}

const outputArg = process.argv.find((arg) => arg.startsWith('--output='))
if (outputArg) {
  const outputPath = path.resolve(root, outputArg.slice('--output='.length))
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}

console.log(`Structured candidates: ${report.structured_candidates}`)
console.log(`Reviewed dispositions: ${report.reviewed_dispositions}`)
console.log(`Classification counts: ${JSON.stringify(report.classification_counts)}`)
if (failures.length > 0) {
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}
console.log('L2 lineage dispositions: pass')
