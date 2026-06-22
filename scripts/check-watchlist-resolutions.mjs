import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { loadCanonicalData } from './monitoring/core/load-canonical-data.mjs'
import { loadResolutionFiles, loadWatchlists } from './monitoring/core/load-watchlists.mjs'
import { candidateKeyFromName } from './monitoring/core/candidate-identity.mjs'
import { OPEN_RESOLUTION_STATES, TERMINAL_RESOLUTION_STATES, validateResolutionIndex } from './monitoring/core/resolution-store.mjs'

const root = process.cwd()
const outputArg = process.argv.find((arg) => arg.startsWith('--output='))
const selfTest = process.argv.includes('--self-test')

function readCandidates(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'))
  return (data.candidates || [])
    .map((item) => typeof item === 'string' ? item : item.name || item.canonical_name)
    .filter(Boolean)
}

function runSelfTest() {
  const valid = {
    version: 1,
    entries: [{
      candidate_key: 'candidate:example',
      canonical_name: 'Example',
      aliases: [],
      candidate_class: 'A',
      state: 'needs_research',
      first_seen_at: '2026-01-01',
      last_reviewed_at: '2026-01-02',
      source_files: ['example.json'],
      notes: 'Long enough reviewed resolution note.',
    }],
  }
  if (validateResolutionIndex(valid).length !== 0) throw new Error('valid resolution fixture failed')
  const invalid = structuredClone(valid)
  invalid.entries.push({ ...invalid.entries[0] })
  if (validateResolutionIndex(invalid).length === 0) throw new Error('duplicate resolution fixture unexpectedly passed')
  console.log('Watchlist resolution self-test: pass')
}

if (selfTest) {
  runSelfTest()
  process.exit(0)
}

const [canonical, resolutions, watchlists] = await Promise.all([
  loadCanonicalData(),
  loadResolutionFiles(),
  loadWatchlists(),
])

const failures = [
  ...resolutions.errors,
  ...resolutions.parseErrors.map((entry) => `${entry.path}: ${entry.error}`),
  ...resolutions.coverageErrors,
  ...watchlists.parseErrors.map((entry) => `${entry.path}: ${entry.error}`),
]

const entityById = new Map(canonical.entities.map((entity) => [entity.id, entity]))
const entityKeys = new Map()
for (const entity of canonical.entities) {
  for (const value of [entity.canonical_name, entity.slug, ...(entity.aliases || [])]) {
    const key = candidateKeyFromName(value)
    if (key && !entityKeys.has(key)) entityKeys.set(key, entity)
  }
}

for (const entry of resolutions.index.entries || []) {
  for (const file of entry.source_files || []) {
    if (!fs.existsSync(path.resolve(root, file))) failures.push(`${entry.candidate_key}: missing source file ${file}`)
  }
  if (!['promoted', 'already_canonical'].includes(entry.state)) continue
  const byId = entry.target_entity_id ? entityById.get(entry.target_entity_id) : null
  const byName = [entry.canonical_name, ...(entry.aliases || [])]
    .map(candidateKeyFromName)
    .map((key) => entityKeys.get(key))
    .find(Boolean)
  if (!byId && !byName) failures.push(`${entry.candidate_key}: ${entry.state} entry has no projected entity match`)
  if (entry.target_entity_id && !byId) failures.push(`${entry.candidate_key}: target_entity_id does not exist: ${entry.target_entity_id}`)
}

const duplicatedWatchlistKeys = watchlists.candidates
  .map((candidate) => candidate.candidate_key)
  .filter((key, index, values) => values.indexOf(key) !== index)
if (duplicatedWatchlistKeys.length > 0) failures.push(`aggregated watchlist keys are not unique: ${duplicatedWatchlistKeys.join(', ')}`)

const reviewedQueueFiles = {
  existing: 'data-staging/watchlists/review/20260614-existing-candidates.json',
  out_of_scope: 'data-staging/watchlists/review/20260614-out-of-scope-candidates.json',
  priority: 'data-staging/watchlists/review/20260614-priority-research.json',
  active_1: 'data-staging/watchlists/review/20260614-active-later-01.json',
  active_2: 'data-staging/watchlists/review/20260614-active-later-02.json',
}

function requireReviewedState(name, states, sourceFile) {
  const entry = resolutions.match({ canonical_name: name })
  if (!entry) {
    failures.push(`${sourceFile}: missing indexed candidate ${name}`)
    return
  }
  if (!states.includes(entry.state)) {
    failures.push(`${sourceFile}: ${name} state=${entry.state}, expected ${states.join('|')}`)
  }
}

const resolvedResearchStates = [
  'needs_research',
  'held',
  'promoted',
  'already_canonical',
  'out_of_scope',
  'duplicate',
]

for (const name of readCandidates(reviewedQueueFiles.existing)) {
  requireReviewedState(name, ['promoted', 'already_canonical'], reviewedQueueFiles.existing)
}
for (const name of readCandidates(reviewedQueueFiles.out_of_scope)) {
  requireReviewedState(name, ['out_of_scope', 'duplicate', 'already_canonical', 'promoted'], reviewedQueueFiles.out_of_scope)
}
for (const name of readCandidates(reviewedQueueFiles.priority)) {
  requireReviewedState(name, resolvedResearchStates, reviewedQueueFiles.priority)
}
for (const file of [reviewedQueueFiles.active_1, reviewedQueueFiles.active_2]) {
  for (const name of readCandidates(file)) requireReviewedState(name, resolvedResearchStates, file)
}

const lifecycleCounts = {
  terminal: 0,
  open: 0,
  unresolved: 0,
  aged_a: 0,
  review_due: 0,
}
const classCounts = { A: 0, B: 0, C: 0, unknown: 0 }

for (const candidate of watchlists.candidates) {
  const cls = ['A', 'B', 'C'].includes(candidate.candidate_class) ? candidate.candidate_class : 'unknown'
  classCounts[cls] += 1
  const resolution = resolutions.match(candidate.raw || { canonical_name: candidate.name })
  if (resolution && TERMINAL_RESOLUTION_STATES.has(resolution.state)) lifecycleCounts.terminal += 1
  else if (resolution && OPEN_RESOLUTION_STATES.has(resolution.state)) lifecycleCounts.open += 1
  else lifecycleCounts.unresolved += 1

  const age = Date.now() - Date.parse(candidate.first_seen_at || '')
  if (cls === 'A' && Number.isFinite(age) && age >= 60 * 86400000 && !(resolution && TERMINAL_RESOLUTION_STATES.has(resolution.state))) {
    lifecycleCounts.aged_a += 1
  }
  if (resolution && OPEN_RESOLUTION_STATES.has(resolution.state)) {
    const due = Date.parse(resolution.next_review_after || '')
    if (!Number.isFinite(due) || due <= Date.now()) lifecycleCounts.review_due += 1
  }
}

const reviewedQueueCounts = {
  existing_reviewed: readCandidates(reviewedQueueFiles.existing).length,
  out_of_scope_reviewed: readCandidates(reviewedQueueFiles.out_of_scope).length,
  priority_research_reviewed: readCandidates(reviewedQueueFiles.priority).length,
  active_later_reviewed: [reviewedQueueFiles.active_1, reviewedQueueFiles.active_2].flatMap(readCandidates).length,
}

const report = {
  generated_at: new Date().toISOString(),
  resolution_index_entries: resolutions.index.entries?.length || 0,
  resolution_state_counts: resolutions.stateCounts,
  historical_resolution_files: resolutions.files.length,
  historical_resolution_coverage_errors: resolutions.coverageErrors.length,
  reviewed_queue_counts: reviewedQueueCounts,
  watchlist_files: watchlists.files.length,
  raw_watchlist_candidates: watchlists.rawCandidateCount,
  unique_watchlist_candidates: watchlists.candidates.length,
  repeated_watchlist_occurrences_collapsed: watchlists.rawCandidateCount - watchlists.candidates.length,
  watchlist_class_counts: classCounts,
  lifecycle_counts: lifecycleCounts,
  projected_entities: canonical.entities.length,
  failures,
  status: failures.length === 0 ? 'pass' : 'fail',
}

if (outputArg) {
  const outputPath = path.resolve(root, outputArg.slice('--output='.length))
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}

console.log(`Resolution index entries: ${report.resolution_index_entries}`)
console.log(`Resolution states: ${JSON.stringify(report.resolution_state_counts)}`)
console.log(`Reviewed queues: ${JSON.stringify(report.reviewed_queue_counts)}`)
console.log(`Raw watchlist candidates: ${report.raw_watchlist_candidates}`)
console.log(`Unique watchlist candidates: ${report.unique_watchlist_candidates}`)
console.log(`Repeated occurrences collapsed: ${report.raw_watchlist_candidates - report.unique_watchlist_candidates}`)
console.log(`Watchlist classes: ${JSON.stringify(report.watchlist_class_counts)}`)
console.log(`Lifecycle counts: ${JSON.stringify(report.lifecycle_counts)}`)
console.log(`Historical resolution coverage errors: ${report.historical_resolution_coverage_errors}`)
if (failures.length > 0) {
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}
console.log('Watchlist resolution gate: pass')
