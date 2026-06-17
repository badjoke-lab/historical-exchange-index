import fsp from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { loadCanonicalData } from '../monitoring/core/load-canonical-data.mjs'
import { parseReviewMonth } from './monthly-registry-core.mjs'

export const MONTHLY_REVIEW_FILES = [
  'manifest.json',
  'summary.md',
  'metrics.json',
  'monitoring-health.json',
  'watchlist-backlog.json',
  'quality-delta.json',
  'consistency-check.json',
  'event-snapshot.json',
  'next-month-plan.md',
]

const JSON_FILES = new Set(MONTHLY_REVIEW_FILES.filter((fileName) => fileName.endsWith('.json')))

function fail(message) {
  throw new Error(`monthly review validation failed: ${message}`)
}

function assert(condition, message) {
  if (!condition) fail(message)
}

function isNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0
}

function sumNumericValues(value) {
  return Object.values(value || {}).reduce((sum, item) => sum + (typeof item === 'number' ? item : 0), 0)
}

function assertNumericObject(value, label, { nonNegative = false } = {}) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `${label} must be an object`)
  for (const [key, item] of Object.entries(value)) {
    assert(typeof item === 'number' && Number.isFinite(item), `${label}.${key} must be a finite number`)
    if (nonNegative) assert(item >= 0, `${label}.${key} must be non-negative`)
  }
}

function assertCountObject(value, label) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `${label} must be an object`)
  for (const [key, item] of Object.entries(value)) {
    assert(isNonNegativeInteger(item), `${label}.${key} must be a non-negative integer`)
  }
}

function sameStringArray(actual, expected) {
  return Array.isArray(actual)
    && actual.length === expected.length
    && actual.every((item, index) => item === expected[index])
}

function expectedCanonicalCounts(canonicalData) {
  return {
    entities: canonicalData.entities.length,
    events: canonicalData.events.length,
    evidence: canonicalData.evidence.length,
  }
}

function validateManifest(manifest, month) {
  assert(manifest && typeof manifest === 'object', 'manifest.json must contain an object')
  assert(manifest.schema_version === 1, 'manifest schema_version must be 1')
  assert(manifest.review_month === month, 'manifest review_month mismatch')
  assert(!Number.isNaN(Date.parse(manifest.generated_at)), 'manifest generated_at must be a valid timestamp')
  assert(manifest.canonical_data_changed === false, 'manifest canonical_data_changed must be false')
  assert(sameStringArray(manifest.output_files, MONTHLY_REVIEW_FILES), 'manifest output_files mismatch')
  assert(Array.isArray(manifest.warnings), 'manifest warnings must be an array')
  assertCountObject(manifest.source_counts, 'manifest source_counts')
  for (const key of ['monitoring_manifests', 'watchlists', 'resolution_documents']) {
    assert(Object.hasOwn(manifest.source_counts, key), `manifest source_counts is missing ${key}`)
  }
}

function validateMetrics(metrics, month, canonicalData) {
  assert(metrics && typeof metrics === 'object', 'metrics.json must contain an object')
  assert(metrics.month === month, 'metrics month mismatch')
  assert(!Number.isNaN(Date.parse(metrics.generated_as_of)), 'metrics generated_as_of must be a valid timestamp')
  assertCountObject(metrics.counts, 'metrics counts')

  const expected = expectedCanonicalCounts(canonicalData)
  assert(metrics.counts.entities === expected.entities, 'metrics entity count does not match canonical data')
  assert(metrics.counts.events === expected.events, 'metrics event count does not match canonical data')
  assert(metrics.counts.evidence === expected.evidence, 'metrics evidence count does not match canonical data')
  assert(metrics.counts.active_side + metrics.counts.dead_side <= metrics.counts.entities, 'active/dead counts exceed entity count')

  assertCountObject(metrics.status, 'metrics status')
  assertCountObject(metrics.type, 'metrics type')
  assert(sumNumericValues(metrics.status) === metrics.counts.entities, 'status counts do not sum to entities')
  assert(sumNumericValues(metrics.type) === metrics.counts.entities, 'type counts do not sum to entities')

  assertNumericObject(metrics.quality, 'metrics quality', { nonNegative: true })
  assertNumericObject(metrics.coverage, 'metrics coverage', { nonNegative: true })
  for (const [key, value] of Object.entries(metrics.coverage)) {
    assert(value <= 100, `metrics coverage.${key} must not exceed 100`)
  }
}

function validateMonitoringHealth(health, month) {
  assert(health && typeof health === 'object', 'monitoring-health.json must contain an object')
  assert(health.month === month, 'monitoring health month mismatch')

  for (const key of [
    'expected_scheduled_runs',
    'observed_unique_runs',
    'successful_runs',
    'degraded_runs',
    'possible_missing_scheduled_runs',
    'total_findings',
    'total_watch_items',
    'total_errors',
  ]) {
    assert(isNonNegativeInteger(health[key]), `monitoring health ${key} must be a non-negative integer`)
  }

  assert(health.successful_runs + health.degraded_runs === health.observed_unique_runs, 'monitoring run totals are inconsistent')
  assert(Array.isArray(health.runs), 'monitoring health runs must be an array')
  assert(health.runs.length === health.observed_unique_runs, 'monitoring health runs length mismatch')
  assert(health.monitors && typeof health.monitors === 'object' && !Array.isArray(health.monitors), 'monitoring health monitors must be an object')

  for (const [name, monitor] of Object.entries(health.monitors)) {
    assertCountObject(monitor, `monitoring health monitors.${name}`)
    assert(monitor.ok + monitor.degraded === monitor.runs, `monitoring health monitor ${name} run totals are inconsistent`)
  }
}

function validateWatchlistBacklog(backlog, month) {
  assert(backlog && typeof backlog === 'object', 'watchlist-backlog.json must contain an object')
  assert(backlog.month === month, 'watchlist backlog month mismatch')

  for (const key of [
    'unique_candidates_seen',
    'new_candidates_in_month',
    'resolved_candidates',
    'unresolved_candidates',
  ]) {
    assert(isNonNegativeInteger(backlog[key]), `watchlist backlog ${key} must be a non-negative integer`)
  }

  assert(Array.isArray(backlog.items), 'watchlist backlog items must be an array')
  assert(Array.isArray(backlog.overdue), 'watchlist backlog overdue must be an array')
  assert(backlog.items.length === backlog.unique_candidates_seen, 'watchlist item count mismatch')
  assert(backlog.resolved_candidates + backlog.unresolved_candidates === backlog.unique_candidates_seen, 'watchlist resolved/unresolved totals are inconsistent')

  assertCountObject(backlog.by_class, 'watchlist backlog by_class')
  assertCountObject(backlog.unresolved_by_class, 'watchlist backlog unresolved_by_class')
  assertCountObject(backlog.aging, 'watchlist backlog aging')
  assert(sumNumericValues(backlog.by_class) === backlog.unique_candidates_seen, 'watchlist by_class total mismatch')
  assert(sumNumericValues(backlog.unresolved_by_class) === backlog.unresolved_candidates, 'watchlist unresolved_by_class total mismatch')

  for (const item of backlog.items) {
    assert(typeof item.canonical_name === 'string' && item.canonical_name, 'watchlist item canonical_name is required')
    assert(isNonNegativeInteger(item.days_open), `watchlist item ${item.canonical_name} days_open must be non-negative`)
    assert(isNonNegativeInteger(item.occurrences) && item.occurrences >= 1, `watchlist item ${item.canonical_name} occurrences must be positive`)
    assert(typeof item.closed === 'boolean', `watchlist item ${item.canonical_name} closed must be boolean`)
  }
}

function validateQualityDelta(delta, monthInfo) {
  assert(delta && typeof delta === 'object', 'quality-delta.json must contain an object')
  assert(typeof delta.available === 'boolean', 'quality delta available must be boolean')
  assert(delta.previous_month === monthInfo.previous_month, 'quality delta previous_month mismatch')

  if (delta.available) {
    assertNumericObject(delta.counts, 'quality delta counts')
    assertNumericObject(delta.quality, 'quality delta quality')
    assertNumericObject(delta.coverage, 'quality delta coverage')
  } else {
    assert(typeof delta.reason === 'string' && delta.reason, 'unavailable quality delta requires a reason')
  }
}

function validateConsistency(consistency, metrics) {
  assert(consistency && typeof consistency === 'object', 'consistency-check.json must contain an object')
  assert(['pass', 'mismatch', 'unavailable'].includes(consistency.status), 'consistency status is invalid')

  const expected = {
    primary_records: metrics.counts.entities,
    events: metrics.counts.events,
    evidence: metrics.counts.evidence,
  }
  assert(JSON.stringify(consistency.expected) === JSON.stringify(expected), 'consistency expected counts mismatch')
  assert(consistency.sources && typeof consistency.sources === 'object', 'consistency sources must be an object')

  const availableSources = Object.values(consistency.sources).filter((source) => source?.available)
  for (const [name, source] of Object.entries(consistency.sources)) {
    assert(typeof source.available === 'boolean', `consistency source ${name} available must be boolean`)
    if (source.available) {
      assert(source.counts && typeof source.counts === 'object', `consistency source ${name} counts are required`)
      assert(typeof source.matches_expected === 'boolean', `consistency source ${name} matches_expected must be boolean`)
    } else {
      assert(source.matches_expected === null, `consistency source ${name} matches_expected must be null when unavailable`)
    }
  }

  if (consistency.status === 'pass') {
    assert(availableSources.length > 0, 'pass consistency requires an available source')
    assert(availableSources.every((source) => source.matches_expected), 'pass consistency contains a mismatched source')
  } else if (consistency.status === 'mismatch') {
    assert(availableSources.some((source) => !source.matches_expected), 'mismatch consistency requires a mismatched source')
  } else {
    assert(availableSources.length === 0, 'unavailable consistency must not have available sources')
  }
}

function validateEventSnapshot(snapshot, month) {
  assert(snapshot && typeof snapshot === 'object', 'event-snapshot.json must contain an object')
  assert(snapshot.month === month, 'event snapshot month mismatch')
  assert(snapshot.basis === 'event_date_or_start_date', 'event snapshot basis mismatch')
  assert(isNonNegativeInteger(snapshot.total), 'event snapshot total must be a non-negative integer')
  assert(Array.isArray(snapshot.events), 'event snapshot events must be an array')
  assert(snapshot.events.length === snapshot.total, 'event snapshot total does not match events length')
  assertCountObject(snapshot.by_event_type, 'event snapshot by_event_type')
  assert(sumNumericValues(snapshot.by_event_type) === snapshot.total, 'event snapshot type total mismatch')
}

function validateMarkdown(summary, plan, month) {
  assert(typeof summary === 'string' && summary.trim(), 'summary.md must not be empty')
  assert(typeof plan === 'string' && plan.trim(), 'next-month-plan.md must not be empty')

  for (const heading of [
    `# HEI Monthly Review - ${month}`,
    '## Registry snapshot',
    '## Monitoring health',
    '## Watchlist backlog',
    '## Quality',
    '## Events dated in month',
    '## Previous-month comparison',
    '## Next-month priorities',
    '## Warnings',
  ]) {
    assert(summary.includes(heading), `summary.md is missing ${heading}`)
  }
  assert(plan.includes(`# HEI Next-Month Plan - after ${month}`), 'next-month-plan.md title mismatch')
}

export async function loadMonthlyReviewArtifacts(outputDirectory) {
  const entries = await fsp.readdir(outputDirectory, { withFileTypes: true })
  const actualFiles = entries.filter((entry) => entry.isFile()).map((entry) => entry.name).sort()
  const expectedFiles = [...MONTHLY_REVIEW_FILES].sort()
  assert(JSON.stringify(actualFiles) === JSON.stringify(expectedFiles), 'monthly review output file set mismatch')

  const artifacts = {}
  for (const fileName of MONTHLY_REVIEW_FILES) {
    const content = await fsp.readFile(path.join(outputDirectory, fileName), 'utf8')
    artifacts[fileName] = JSON_FILES.has(fileName) ? JSON.parse(content) : content
  }
  return artifacts
}

export function validateMonthlyReviewArtifacts(artifacts, { month, canonicalData }) {
  const monthInfo = parseReviewMonth(month)
  assert(artifacts && typeof artifacts === 'object', 'artifacts must be an object')
  assert(sameStringArray(Object.keys(artifacts), MONTHLY_REVIEW_FILES), 'artifact key order or set mismatch')

  validateManifest(artifacts['manifest.json'], month)
  validateMetrics(artifacts['metrics.json'], month, canonicalData)
  validateMonitoringHealth(artifacts['monitoring-health.json'], month)
  validateWatchlistBacklog(artifacts['watchlist-backlog.json'], month)
  validateQualityDelta(artifacts['quality-delta.json'], monthInfo)
  validateConsistency(artifacts['consistency-check.json'], artifacts['metrics.json'])
  validateEventSnapshot(artifacts['event-snapshot.json'], month)
  validateMarkdown(artifacts['summary.md'], artifacts['next-month-plan.md'], month)

  return {
    month,
    files: MONTHLY_REVIEW_FILES.length,
    entities: artifacts['metrics.json'].counts.entities,
    monitoring_runs: artifacts['monitoring-health.json'].observed_unique_runs,
    watchlist_items: artifacts['watchlist-backlog.json'].unique_candidates_seen,
  }
}

function parseArgs(argv) {
  const args = { month: null }
  for (let index = 2; index < argv.length; index += 1) {
    if (argv[index] === '--month') {
      args.month = argv[index + 1]
      index += 1
    } else {
      throw new Error(`Unknown argument: ${argv[index]}`)
    }
  }
  assert(args.month, '--month YYYY-MM is required')
  return args
}

async function main() {
  const args = parseArgs(process.argv)
  const root = process.cwd()
  const outputDirectory = path.join(root, 'data-staging', 'monthly-reviews', args.month)
  const canonicalData = await loadCanonicalData()
  const artifacts = await loadMonthlyReviewArtifacts(outputDirectory)
  const result = validateMonthlyReviewArtifacts(artifacts, { month: args.month, canonicalData })
  console.log(`Validated HEI monthly review ${result.month}: ${result.files} files, ${result.entities} entities.`)
}

const directRun = process.argv[1]
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href

if (directRun) {
  main().catch((error) => {
    console.error(error?.stack || error?.message || error)
    process.exit(1)
  })
}
