import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const failures = []
const fail = (message) => failures.push(message)
const load = (file) => JSON.parse(fs.readFileSync(path.resolve(root, file), 'utf8'))
const sameSet = (left, right) => left.size === right.size && [...left].every((value) => right.has(value))

function loadInventory() {
  const inventoryArg = process.argv.find((arg) => arg.startsWith('--inventory='))
  if (inventoryArg) return load(inventoryArg.slice('--inventory='.length))

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hei-lineage-a3-'))
  const outputPath = path.join(tempDir, 'lineage-inventory.json')
  const run = spawnSync(
    process.execPath,
    ['scripts/audit-lineage-candidates.mjs', `--output-json=${outputPath}`],
    { cwd: root, encoding: 'utf8' },
  )
  try {
    if (run.status !== 0) {
      throw new Error(run.stderr || run.stdout || 'lineage inventory command failed')
    }
    return JSON.parse(fs.readFileSync(outputPath, 'utf8'))
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
}

const inventory = loadInventory()
const l1 = load('config/lineage-l1-dispositions.json')
const l2 = load('config/lineage-l2-dispositions.json')

const edgeKey = (item) => `${item.entity_id}:${item.field}:${item.target_id}`
const inventoryEdges = new Set((inventory.relationship_edges ?? []).map(edgeKey))
const reviewedEdges = new Set((l1.dispositions ?? []).map(edgeKey))

if (inventory.projected_public_entities < 412) fail(`projected public entities regressed below the A3 baseline: ${inventory.projected_public_entities}`)
if (inventory.projected_public_events < 691) fail(`projected public events regressed below the A3 baseline: ${inventory.projected_public_events}`)
if (inventory.structured_review_queue_total !== 36) fail(`expected 36 structured candidates, got ${inventory.structured_review_queue_total}`)
if (inventory.candidate_counts?.linked_existing !== 11) fail(`expected 11 linked-existing candidates, got ${inventory.candidate_counts?.linked_existing}`)
if (inventory.text_watchlist_total !== 52) fail(`expected 52 text-only watchlist entries, got ${inventory.text_watchlist_total}`)
if (inventory.missing_relationship_targets !== 0) fail('missing relationship targets must be zero')
if (inventory.self_relationships !== 0) fail('self relationships must be zero')
if (inventory.invalid_event_counterparty_targets !== 0) fail('invalid event counterparty targets must be zero')

if (l1.version !== 1 || l1.scope !== 'existing_predecessor_successor_edges') fail('unexpected L1 manifest version or scope')
if ((l1.dispositions ?? []).length !== 11) fail(`expected 11 L1 dispositions, got ${l1.dispositions?.length ?? 0}`)
if (inventoryEdges.size !== 11) fail(`expected 11 current relationship edges, got ${inventoryEdges.size}`)
if (!sameSet(inventoryEdges, reviewedEdges)) fail('L1 dispositions do not exactly cover the current relationship edges')

if (l2.version !== 1 || l2.scope !== 'structured_lineage_candidates_without_existing_edges') fail('unexpected L2 manifest version or scope')
if ((l2.dispositions ?? []).length !== 25) fail(`expected 25 L2 dispositions, got ${l2.dispositions?.length ?? 0}`)

const structuredIds = new Set((inventory.candidates ?? []).map((item) => item.entity.id))
const linkedIds = new Set(
  (inventory.candidates ?? [])
    .filter((item) => item.classification === 'linked_existing')
    .map((item) => item.entity.id),
)
const unlinkedStructuredIds = new Set(
  (inventory.candidates ?? [])
    .filter((item) => item.classification !== 'linked_existing')
    .map((item) => item.entity.id),
)
const reviewedL1EntityIds = new Set((l1.dispositions ?? []).map((item) => item.entity_id))
const reviewedL2EntityIds = new Set((l2.dispositions ?? []).map((item) => item.entity_id))

if (!sameSet(linkedIds, reviewedL1EntityIds)) fail('L1 source entities do not exactly match linked-existing candidates')
if (!sameSet(unlinkedStructuredIds, reviewedL2EntityIds)) fail('L2 dispositions do not exactly cover unlinked structured candidates')
if ([...reviewedL1EntityIds].some((id) => reviewedL2EntityIds.has(id))) fail('L1 and L2 disposition sets overlap')

const combinedReviewedIds = new Set([...reviewedL1EntityIds, ...reviewedL2EntityIds])
if (!sameSet(structuredIds, combinedReviewedIds)) fail('combined L1 and L2 dispositions do not exactly cover all structured candidates')
if (combinedReviewedIds.size !== 36) fail(`expected 36 unique reviewed entities, got ${combinedReviewedIds.size}`)

const watchlistIds = (inventory.text_watchlist ?? []).map((item) => item.entity.id)
const uniqueWatchlistIds = new Set(watchlistIds)
if (watchlistIds.length !== uniqueWatchlistIds.size) fail('text-only watchlist contains duplicate entity IDs')
if (watchlistIds.some((id) => structuredIds.has(id))) fail('text-only watchlist overlaps the structured review queue')

const l1Counts = {}
for (const item of l1.dispositions ?? []) l1Counts[item.disposition] = (l1Counts[item.disposition] ?? 0) + 1
const l2Counts = {}
for (const item of l2.dispositions ?? []) l2Counts[item.classification] = (l2Counts[item.classification] ?? 0) + 1

const expectedL1 = {
  keep_one_way_documented: 4,
  add_reciprocal: 3,
  keep_bidirectional: 2,
  remove_to_event_only: 2,
}
const expectedL2 = { link_now: 7, document_only: 8, unresolved: 10 }
for (const [key, expected] of Object.entries(expectedL1)) {
  if (l1Counts[key] !== expected) fail(`L1 ${key}: expected ${expected}, got ${l1Counts[key] ?? 0}`)
}
for (const [key, expected] of Object.entries(expectedL2)) {
  if (l2Counts[key] !== expected) fail(`L2 ${key}: expected ${expected}, got ${l2Counts[key] ?? 0}`)
}

const report = {
  generated_at: new Date().toISOString(),
  phase: 'A3',
  status: failures.length === 0 ? 'closed' : 'failed',
  baseline: {
    projected_public_entities_minimum: 412,
    projected_public_events_minimum: 691,
  },
  projected_public_entities: inventory.projected_public_entities,
  projected_public_events: inventory.projected_public_events,
  structured_candidates: inventory.structured_review_queue_total,
  reviewed_structured_candidates: combinedReviewedIds.size,
  text_only_watchlist: inventory.text_watchlist_total,
  l1_dispositions: l1Counts,
  l2_dispositions: l2Counts,
  safety: {
    missing_relationship_targets: inventory.missing_relationship_targets,
    self_relationships: inventory.self_relationships,
    invalid_event_counterparty_targets: inventory.invalid_event_counterparty_targets,
  },
  next_phase: 'A4_apply_safe_lineage_links',
  failures,
}

const outputArg = process.argv.find((arg) => arg.startsWith('--output='))
if (outputArg) {
  const outputPath = path.resolve(root, outputArg.slice('--output='.length))
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}

console.log(`Structured candidates: ${report.structured_candidates}`)
console.log(`Reviewed structured candidates: ${report.reviewed_structured_candidates}`)
console.log(`Text-only watchlist: ${report.text_only_watchlist}`)
console.log(`L1 dispositions: ${JSON.stringify(report.l1_dispositions)}`)
console.log(`L2 dispositions: ${JSON.stringify(report.l2_dispositions)}`)
if (failures.length > 0) {
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}
console.log('A3 lineage closure: pass')
