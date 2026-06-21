import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { loadReviewedBundles, mergeRecords } from './lib/reviewed-bundle-aggregation.mjs'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'

const root = process.cwd()
const allowed = new Set([
  'keep_bidirectional',
  'add_reciprocal',
  'keep_one_way_documented',
  'remove_to_event_only',
  'unresolved',
])

const load = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
const canonicalEntities = load('data/entities.json')
const canonicalEvents = load('data/events.json')
const canonicalEvidence = load('data/evidence.json')
const review = load('config/lineage-l1-dispositions.json')
const { all, newEntityBundles, entityIdMap } = loadReviewedBundles(root, canonicalEntities)
const entities = [
  ...applyReviewedEntityCorrections(canonicalEntities, all),
  ...newEntityBundles.map(({ bundle }) => bundle.entity),
]
const events = mergeRecords(canonicalEvents, all, 'events', 'event', entityIdMap)
const evidence = mergeRecords(canonicalEvidence, all, 'evidence', 'evidence', entityIdMap)

const entityById = new Map(entities.map((entity) => [entity.id, entity]))
const eventById = new Map(events.map((event) => [event.id, event]))
const evidenceById = new Map(evidence.map((item) => [item.id, item]))
const failures = []

const fail = (message) => failures.push(message)
const edgeKey = (entityId, field) => `${entityId}:${field}`

if (review.version !== 1) fail('review version must be 1')
if (review.scope !== 'existing_predecessor_successor_edges') fail('unexpected review scope')
if (!Array.isArray(review.dispositions)) fail('dispositions must be an array')

const currentEdges = []
for (const entity of entities) {
  for (const field of ['predecessor_id', 'successor_id']) {
    if (typeof entity[field] === 'string' && entity[field]) {
      currentEdges.push({ entity_id: entity.id, field, target_id: entity[field] })
    }
  }
}

const dispositionByEdge = new Map()
for (const item of review.dispositions ?? []) {
  const key = edgeKey(item.entity_id, item.field)
  if (dispositionByEdge.has(key)) fail(`duplicate disposition: ${key}`)
  dispositionByEdge.set(key, item)

  if (!allowed.has(item.disposition)) fail(`${key}: invalid disposition ${item.disposition}`)
  if (!['predecessor_id', 'successor_id'].includes(item.field)) fail(`${key}: invalid field`)
  if (!Array.isArray(item.event_ids) || !Array.isArray(item.evidence_ids)) fail(`${key}: event_ids and evidence_ids must be arrays`)
  if (typeof item.rationale !== 'string' || item.rationale.trim().length < 40) fail(`${key}: rationale is too short`)

  const entity = entityById.get(item.entity_id)
  const target = entityById.get(item.target_id)
  if (!entity) fail(`${key}: entity does not exist`)
  if (!target) fail(`${key}: target does not exist`)
  if (entity && entity.canonical_name !== item.entity_name) fail(`${key}: entity_name drift`)
  if (target && target.canonical_name !== item.target_name) fail(`${key}: target_name drift`)
  if (entity && entity[item.field] !== item.target_id) fail(`${key}: current edge does not match reviewed target`)

  for (const eventId of item.event_ids ?? []) {
    const event = eventById.get(eventId)
    if (!event) fail(`${key}: missing event ${eventId}`)
    else if (![item.entity_id, item.target_id].includes(event.exchange_id)) fail(`${key}: event ${eventId} belongs to unrelated entity`)
  }
  for (const evidenceId of item.evidence_ids ?? []) {
    const record = evidenceById.get(evidenceId)
    if (!record) fail(`${key}: missing evidence ${evidenceId}`)
    else if (![item.entity_id, item.target_id].includes(record.exchange_id)) fail(`${key}: evidence ${evidenceId} belongs to unrelated entity`)
  }

  if (entity && target) {
    const reciprocalField = item.field === 'predecessor_id' ? 'successor_id' : 'predecessor_id'
    const reciprocal = target[reciprocalField] ?? null
    if (item.disposition === 'keep_bidirectional' && reciprocal !== item.entity_id) {
      fail(`${key}: keep_bidirectional requires ${item.target_id}.${reciprocalField}=${item.entity_id}`)
    }
    if (item.disposition === 'add_reciprocal' && reciprocal && reciprocal !== item.entity_id) {
      fail(`${key}: add_reciprocal conflicts with existing ${item.target_id}.${reciprocalField}=${reciprocal}`)
    }
  }
}

for (const edge of currentEdges) {
  const key = edgeKey(edge.entity_id, edge.field)
  const disposition = dispositionByEdge.get(key)
  if (!disposition) fail(`current edge lacks disposition: ${key}`)
  else if (disposition.target_id !== edge.target_id) fail(`${key}: target mismatch`)
}
for (const key of dispositionByEdge.keys()) {
  if (!currentEdges.some((edge) => edgeKey(edge.entity_id, edge.field) === key)) {
    fail(`stale disposition without current edge: ${key}`)
  }
}

const counts = {}
for (const item of review.dispositions ?? []) counts[item.disposition] = (counts[item.disposition] ?? 0) + 1
const report = {
  generated_at: new Date().toISOString(),
  projected_public_entities: entities.length,
  current_relationship_edges: currentEdges.length,
  reviewed_dispositions: review.dispositions?.length ?? 0,
  disposition_counts: counts,
  failures,
  status: failures.length === 0 ? 'pass' : 'fail',
}

const outputArg = process.argv.find((arg) => arg.startsWith('--output='))
if (outputArg) {
  const outputPath = path.resolve(root, outputArg.slice('--output='.length))
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}

console.log(`Current relationship edges: ${report.current_relationship_edges}`)
console.log(`Reviewed dispositions: ${report.reviewed_dispositions}`)
console.log(`Disposition counts: ${JSON.stringify(report.disposition_counts)}`)
if (failures.length > 0) {
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}
console.log('L1 lineage dispositions: pass')
