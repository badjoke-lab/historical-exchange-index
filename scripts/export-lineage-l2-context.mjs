import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { loadReviewedBundles, mergeRecords } from './lib/reviewed-bundle-aggregation.mjs'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'

const root = process.cwd()
const TARGET_IDS = new Set([
  'hei_ex_000033', 'hei_ex_000127', 'hei_ex_000133', 'hei_ex_000195', 'hei_ex_000199',
  'hei_ex_000213', 'hei_ex_000216', 'hei_ex_000217', 'hei_ex_000248', 'hei_ex_000251',
  'hei_ex_000260', 'hei_ex_000268', 'hei_ex_000271', 'hei_ex_000283', 'hei_ex_000284',
  'hei_ex_000285', 'hei_ex_000287', 'hei_ex_000295', 'hei_ex_000299', 'hei_ex_000301',
  'hei_ex_000306', 'hei_ex_000310', 'hei_ex_000510', 'hei_ex_000517', 'hei_ex_000520'
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
const selectedEvents = events.filter((event) => TARGET_IDS.has(event.exchange_id))
const selectedEventIds = new Set(selectedEvents.map((event) => event.id))
const selectedEvidence = evidence.filter((item) =>
  TARGET_IDS.has(item.exchange_id) || (item.event_id && selectedEventIds.has(item.event_id)),
)

const output = {
  generated_at: new Date().toISOString(),
  target_ids: [...TARGET_IDS],
  entities: entities.filter((entity) => TARGET_IDS.has(entity.id)),
  events: selectedEvents,
  evidence: selectedEvidence,
  identity_index: entities.map((entity) => ({
    id: entity.id,
    slug: entity.slug,
    canonical_name: entity.canonical_name,
    aliases: entity.aliases ?? [],
    status: entity.status,
    predecessor_id: entity.predecessor_id ?? null,
    successor_id: entity.successor_id ?? null,
  })),
  bundle_files: all
    .filter(({ bundle }) => TARGET_IDS.has(entityIdMap.get(bundle.entity.id) ?? bundle.entity.id))
    .map(({ fileName, bundle }) => ({
      file_name: fileName,
      source_entity_id: bundle.entity.id,
      resolved_entity_id: entityIdMap.get(bundle.entity.id) ?? bundle.entity.id,
      event_ids: bundle.events.map((event) => event.id),
      evidence_ids: bundle.evidence.map((item) => item.id),
    })),
}

const outputArg = process.argv.find((arg) => arg.startsWith('--output='))
const outputPath = outputArg
  ? path.resolve(root, outputArg.slice('--output='.length))
  : path.join(root, 'audit-output', 'a3-l2-context.json')
fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
console.log(`Wrote ${output.entities.length} entities, ${output.events.length} events, and ${output.evidence.length} evidence records.`)
