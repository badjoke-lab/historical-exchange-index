import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { loadReviewedBundles, mergeRecords } from './lib/reviewed-bundle-aggregation.mjs'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'

const root = process.cwd()
const TARGET_IDS = new Set([
  'hei_ex_000125',
  'hei_ex_000126',
  'hei_ex_000134',
  'hei_ex_000146',
  'hei_ex_000155',
  'hei_ex_000159',
  'hei_ex_000208',
  'hei_ex_000211',
  'hei_ex_000302',
  'hei_ex_000309',
  'hei_ex_000313',
])

const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))

const canonicalEntities = readJson('data/entities.json')
const canonicalEvents = readJson('data/events.json')
const canonicalEvidence = readJson('data/evidence.json')
const { all, newEntityBundles, entityIdMap } = loadReviewedBundles(root, canonicalEntities)
const entities = [
  ...applyReviewedEntityCorrections(canonicalEntities, all),
  ...newEntityBundles.map(({ bundle }) => bundle.entity),
]
const events = mergeRecords(canonicalEvents, all, 'events', 'event', entityIdMap)
const evidence = mergeRecords(canonicalEvidence, all, 'evidence', 'evidence', entityIdMap)
const entityById = new Map(entities.map((entity) => [entity.id, entity]))

const selectedIds = new Set(TARGET_IDS)
for (const id of TARGET_IDS) {
  const entity = entityById.get(id)
  if (!entity) continue
  if (entity.predecessor_id) selectedIds.add(entity.predecessor_id)
  if (entity.successor_id) selectedIds.add(entity.successor_id)
}

const selectedEntities = entities.filter((entity) => selectedIds.has(entity.id))
const selectedEvents = events.filter((event) => selectedIds.has(event.exchange_id))
const selectedEventIds = new Set(selectedEvents.map((event) => event.id))
const selectedEvidence = evidence.filter((item) =>
  selectedIds.has(item.exchange_id) || (item.event_id && selectedEventIds.has(item.event_id)),
)

const bundleFiles = all
  .filter(({ bundle }) => selectedIds.has(entityIdMap.get(bundle.entity.id) ?? bundle.entity.id))
  .map(({ fileName, bundle }) => ({
    file_name: fileName,
    source_entity_id: bundle.entity.id,
    resolved_entity_id: entityIdMap.get(bundle.entity.id) ?? bundle.entity.id,
    has_entity_correction: Boolean(bundle.entity_correction),
    event_ids: bundle.events.map((event) => event.id),
    evidence_ids: bundle.evidence.map((item) => item.id),
  }))

const output = {
  generated_at: new Date().toISOString(),
  target_ids: [...TARGET_IDS],
  selected_entity_ids: [...selectedIds],
  entities: selectedEntities,
  events: selectedEvents,
  evidence: selectedEvidence,
  bundle_files: bundleFiles,
}

const outputArg = process.argv.find((arg) => arg.startsWith('--output='))
const outputPath = outputArg
  ? path.resolve(root, outputArg.slice('--output='.length))
  : path.join(root, 'audit-output', 'a3-l1-context.json')
fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
console.log(`Wrote ${selectedEntities.length} entities, ${selectedEvents.length} events, and ${selectedEvidence.length} evidence records.`)
