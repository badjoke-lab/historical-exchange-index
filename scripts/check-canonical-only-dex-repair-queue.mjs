import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { loadCanonicalData } from './monitoring/core/load-canonical-data.mjs'

const root = process.cwd()
const queuePath = path.join(root, 'config', 'canonical-only-dex-repair-queue.json')
const outputArg = process.argv.find((arg) => arg.startsWith('--output='))
const markdownArg = process.argv.find((arg) => arg.startsWith('--markdown='))
const strict = process.argv.includes('--strict')

function listRecordBundles() {
  const dir = path.join(root, 'records', 'exchanges')
  const byEntityId = new Map()
  if (!fs.existsSync(dir)) return byEntityId

  for (const name of fs.readdirSync(dir).filter((item) => item.endsWith('.json')).sort()) {
    const file = path.join(dir, name)
    try {
      const bundle = JSON.parse(fs.readFileSync(file, 'utf8'))
      const id = bundle?.entity?.id
      if (id) byEntityId.set(id, path.relative(root, file))
    } catch {
      // Record validation owns malformed bundle failures.
    }
  }

  return byEntityId
}

function loadQueue() {
  if (!fs.existsSync(queuePath)) throw new Error(`${path.relative(root, queuePath)} is missing`)
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'))
  if (!queue || typeof queue !== 'object' || Array.isArray(queue)) throw new Error('queue must be an object')
  if (queue.schema_version !== 1) throw new Error('queue schema_version must be 1')
  if (!Number.isInteger(queue.batch_size) || queue.batch_size < 1) throw new Error('queue batch_size must be a positive integer')
  if (queue.allow_final_partial_batch !== true) throw new Error('queue allow_final_partial_batch must be true')
  if (!Array.isArray(queue.entries)) throw new Error('queue entries must be an array')
  if (!queue.scope || queue.scope.type !== 'dex') throw new Error('queue scope must define type dex')
  return queue
}

const canonical = await loadCanonicalData()
const queue = loadQueue()
const bundleByEntityId = listRecordBundles()
const entityById = new Map(canonical.entities.map((entity) => [entity.id, entity]))
const errors = []
const ids = new Set()
const batches = new Map()
const allowedEntryStatuses = new Set(['pending', 'completed'])

for (const [index, entry] of queue.entries.entries()) {
  const label = `entries[${index}]`
  const expectedOrdinal = index + 1
  const expectedBatch = Math.floor(index / queue.batch_size) + 1

  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    errors.push(`${label}: expected object`)
    continue
  }
  if (entry.ordinal !== expectedOrdinal) errors.push(`${label}.ordinal: expected ${expectedOrdinal}`)
  if (entry.batch !== expectedBatch) errors.push(`${label}.batch: expected ${expectedBatch}`)
  if (typeof entry.id !== 'string' || !entry.id.startsWith('hei_ex_')) errors.push(`${label}.id: expected hei_ex_ identifier`)
  if (ids.has(entry.id)) errors.push(`${label}.id: duplicate ${entry.id}`)
  ids.add(entry.id)
  if (!allowedEntryStatuses.has(entry.status)) errors.push(`${label}.status: expected pending or completed`)
  if (!Number.isInteger(entry.initial_repair_score) || entry.initial_repair_score < 0) errors.push(`${label}.initial_repair_score: expected non-negative integer`)
  if (!Array.isArray(entry.initial_repair_reasons)) errors.push(`${label}.initial_repair_reasons: expected array`)

  const entity = entityById.get(entry.id)
  if (!entity) {
    errors.push(`${label}.id: entity not found`)
  } else {
    if (entity.slug !== entry.slug) errors.push(`${label}.slug: ${entry.slug} does not match ${entity.slug}`)
    if (entity.canonical_name !== entry.canonical_name) errors.push(`${label}.canonical_name: ${entry.canonical_name} does not match ${entity.canonical_name}`)
    if (entity.type !== queue.scope.type) errors.push(`${label}.id: expected type ${queue.scope.type}, got ${entity.type}`)
  }

  const hasBundle = bundleByEntityId.has(entry.id)
  if (entry.status === 'pending' && hasBundle) errors.push(`${label}: pending entry already has reviewed bundle ${bundleByEntityId.get(entry.id)}`)
  if (entry.status === 'completed' && !hasBundle) errors.push(`${label}: completed entry has no reviewed bundle`)

  const list = batches.get(entry.batch) || []
  list.push(entry)
  batches.set(entry.batch, list)
}

if (queue.scope.initial_record_count !== queue.entries.length) {
  errors.push(`scope.initial_record_count ${queue.scope.initial_record_count} does not match queue length ${queue.entries.length}`)
}

for (let index = 1; index < queue.entries.length; index += 1) {
  const previous = queue.entries[index - 1]
  const current = queue.entries[index]
  if (previous.initial_repair_score < current.initial_repair_score) {
    errors.push(`entries[${index}]: repair score order increased from ${previous.initial_repair_score} to ${current.initial_repair_score}`)
  }
  if (
    previous.initial_repair_score === current.initial_repair_score
    && previous.canonical_name.localeCompare(current.canonical_name) > 0
  ) {
    errors.push(`entries[${index}]: canonical name order regressed within score ${current.initial_repair_score}`)
  }
}

const sortedBatches = [...batches.entries()].sort((left, right) => left[0] - right[0])
const finalBatchNumber = sortedBatches.at(-1)?.[0] || null
let pendingBatchSeen = false

for (const [batchNumber, entries] of sortedBatches) {
  const isFinalBatch = batchNumber === finalBatchNumber
  const expectedLength = isFinalBatch ? queue.entries.length % queue.batch_size || queue.batch_size : queue.batch_size
  if (entries.length !== expectedLength) errors.push(`batch ${batchNumber}: expected ${expectedLength} entries, got ${entries.length}`)

  const statuses = new Set(entries.map((entry) => entry.status))
  if (statuses.size !== 1) errors.push(`batch ${batchNumber}: mixed pending/completed statuses are not allowed`)
  const status = entries[0]?.status
  if (status === 'pending') pendingBatchSeen = true
  if (status === 'completed' && pendingBatchSeen) errors.push(`batch ${batchNumber}: completed batch appears after a pending batch`)
}

const currentCanonicalOnly = canonical.entities
  .filter((entity) => entity.type === queue.scope.type && !bundleByEntityId.has(entity.id))
  .sort((left, right) => left.id.localeCompare(right.id))
const pendingEntries = queue.entries.filter((entry) => entry.status === 'pending')
const completedEntries = queue.entries.filter((entry) => entry.status === 'completed')
const pendingIds = new Set(pendingEntries.map((entry) => entry.id))
const currentCanonicalOnlyIds = new Set(currentCanonicalOnly.map((entity) => entity.id))

for (const entity of currentCanonicalOnly) {
  if (!pendingIds.has(entity.id)) errors.push(`${entity.id}: canonical-only DEX is missing from pending queue`)
}
for (const entry of pendingEntries) {
  if (!currentCanonicalOnlyIds.has(entry.id)) errors.push(`${entry.id}: pending queue entry is not currently canonical-only`)
}

const currentBatchNumber = pendingEntries.length > 0 ? Math.min(...pendingEntries.map((entry) => entry.batch)) : null
const currentBatch = currentBatchNumber == null
  ? []
  : queue.entries.filter((entry) => entry.batch === currentBatchNumber && entry.status === 'pending')
const status = errors.length > 0 ? 'fail' : pendingEntries.length > 0 ? 'active' : 'complete'

const report = {
  generated_at: new Date().toISOString(),
  status,
  queue_file: path.relative(root, queuePath),
  generated_from_main: queue.generated_from_main,
  initial_record_count: queue.scope.initial_record_count,
  total_batches: batches.size,
  completed_records: completedEntries.length,
  pending_records: pendingEntries.length,
  current_canonical_only_records: currentCanonicalOnly.length,
  current_batch_number: currentBatchNumber,
  current_batch: currentBatch.map((entry) => ({
    ordinal: entry.ordinal,
    id: entry.id,
    slug: entry.slug,
    canonical_name: entry.canonical_name,
    initial_status: entry.initial_status,
    initial_repair_score: entry.initial_repair_score,
    initial_repair_reasons: entry.initial_repair_reasons,
  })),
  errors,
}

const markdown = [
  '# HEI Canonical-only DEX Repair Queue',
  '',
  `- Status: ${report.status}`,
  `- Initial cohort: ${report.initial_record_count}`,
  `- Completed: ${report.completed_records}`,
  `- Pending: ${report.pending_records}`,
  `- Current canonical-only records: ${report.current_canonical_only_records}`,
  `- Total batches: ${report.total_batches}`,
  `- Current batch: ${report.current_batch_number ?? 'none'}`,
  '',
  '## Current batch',
  '',
  ...(report.current_batch.length > 0
    ? report.current_batch.map((entry) => `- ${entry.canonical_name} (${entry.id}) — score ${entry.initial_repair_score}; initial status ${entry.initial_status}; reasons ${entry.initial_repair_reasons.join(', ')}`)
    : ['- None; queue is complete.']),
  '',
  '## Validation errors',
  '',
  ...(errors.length > 0 ? errors.map((error) => `- ${error}`) : ['- None']),
  '',
].join('\n')

if (outputArg) {
  const outputPath = path.resolve(root, outputArg.slice('--output='.length))
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}
if (markdownArg) {
  const outputPath = path.resolve(root, markdownArg.slice('--markdown='.length))
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${markdown}\n`, 'utf8')
}

console.log(`Canonical-only DEX repair queue: ${report.status}`)
console.log(`Completed: ${report.completed_records}`)
console.log(`Pending: ${report.pending_records}`)
console.log(`Current batch: ${report.current_batch_number ?? 'none'}`)
console.log(`Selected: ${report.current_batch.map((entry) => entry.id).join(', ')}`)
if (errors.length > 0) console.error(errors.map((error) => `- ${error}`).join('\n'))
if (strict && errors.length > 0) process.exit(1)
