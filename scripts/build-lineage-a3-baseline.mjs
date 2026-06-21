import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { buildInventory } from './audit-lineage-candidates.mjs'
import { loadReviewedBundles, mergeRecords } from './lib/reviewed-bundle-aggregation.mjs'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'
import { restorePreA4LineageEntities } from './lib/lineage-a4-baseline.mjs'
import { restorePreB1LineageEvents } from './lib/lineage-a3-event-baseline.mjs'

const root = process.cwd()
const load = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
const canonicalEntities = load('data/entities.json')
const canonicalEvents = load('data/events.json')
const manifest = load('config/lineage-a4-application.json')
const { all, newEntityBundles, entityIdMap } = loadReviewedBundles(root, canonicalEntities)
const projectedEntities = [
  ...applyReviewedEntityCorrections(canonicalEntities, all),
  ...newEntityBundles.map(({ bundle }) => bundle.entity),
]
const entities = restorePreA4LineageEntities(projectedEntities, manifest)
const events = restorePreB1LineageEvents(
  mergeRecords(canonicalEvents, all, 'events', 'event', entityIdMap),
)
const report = {
  ...buildInventory(entities, events),
  baseline: 'pre_a4_review_state',
  restored_a4_changes: manifest.changes?.length ?? 0,
  restored_pre_b1_event_types: 1,
}

const jsonArg = process.argv.find((arg) => arg.startsWith('--output-json='))
const mdArg = process.argv.find((arg) => arg.startsWith('--output-md='))
if (jsonArg) {
  const file = path.resolve(root, jsonArg.slice('--output-json='.length))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}
if (mdArg) {
  const file = path.resolve(root, mdArg.slice('--output-md='.length))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const markdown = `# HEI A3 Frozen Lineage Baseline\n\n- Baseline: pre-A4 review state\n- Projected public entities: ${report.projected_public_entities}\n- Projected public events: ${report.projected_public_events}\n- Existing relationship edges: ${report.existing_relationship_edges}\n- Structured review queue: ${report.structured_review_queue_total}\n- Text-only watchlist: ${report.text_watchlist_total}\n- Restored A4 changes: ${report.restored_a4_changes}\n- Restored pre-B1 event types: ${report.restored_pre_b1_event_types}\n`
  fs.writeFileSync(file, markdown, 'utf8')
}

console.log(`A3 frozen baseline entities: ${report.projected_public_entities}`)
console.log(`A3 frozen baseline relationship edges: ${report.existing_relationship_edges}`)
console.log(`A3 frozen structured review queue: ${report.structured_review_queue_total}`)
