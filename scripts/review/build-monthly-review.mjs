import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { loadCanonicalData } from '../monitoring/core/load-canonical-data.mjs'
import {
  buildMonthlyRegistryReview,
  parseReviewMonth,
  previousUtcMonth,
} from './monthly-registry-core.mjs'
import { buildWatchlistBacklog } from './monthly-watchlist-core.mjs'

const OUTPUT_FILES = [
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

const REGISTRY_SNAPSHOT_BASIS = 'current_reviewed_registry_at_generation_time'

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
  return args
}

async function exists(filePath) {
  try {
    await fsp.access(filePath)
    return true
  } catch {
    return false
  }
}

async function readJson(filePath, fallback = null) {
  if (!(await exists(filePath))) return fallback
  return JSON.parse(await fsp.readFile(filePath, 'utf8'))
}

async function listJsonFiles(directory) {
  if (!(await exists(directory))) return []
  const entries = await fsp.readdir(directory, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => path.join(directory, entry.name))
    .sort()
}

async function loadJsonDocuments(directory, warnings) {
  const documents = []
  for (const filePath of await listJsonFiles(directory)) {
    try {
      const value = await readJson(filePath, null)
      if (value) documents.push(value)
    } catch (error) {
      warnings.push(`${filePath}: ${error.message}`)
    }
  }
  return documents
}

async function loadMonitoringManifests(directory, monthInfo, warnings) {
  if (!(await exists(directory))) return []
  const entries = await fsp.readdir(directory, { withFileTypes: true })
  const manifests = []

  for (const entry of entries) {
    if (!entry.isDirectory() || !/^\d{8}$/.test(entry.name)) continue
    if (!entry.name.startsWith(monthInfo.month.replace('-', ''))) continue

    const manifestPath = path.join(directory, entry.name, 'manifest.json')
    try {
      const manifest = await readJson(manifestPath, null)
      if (manifest) manifests.push(manifest)
      else warnings.push(`Missing monitoring manifest: ${manifestPath}`)
    } catch (error) {
      warnings.push(`${manifestPath}: ${error.message}`)
    }
  }
  return manifests
}

function applyRegistrySnapshotSemantics(registryReview, canonicalData, generatedAt) {
  const snapshotTime = Date.parse(generatedAt)
  if (!Number.isFinite(snapshotTime)) {
    throw new Error(`Invalid monthly review generation timestamp: ${generatedAt}`)
  }

  const staleBefore = new Date(snapshotTime)
  staleBefore.setUTCFullYear(staleBefore.getUTCFullYear() - 1)
  const staleRecords = (canonicalData.entities || []).filter((entity) => {
    const timestamp = Date.parse(entity.last_verified_at)
    return Number.isFinite(timestamp) && timestamp < staleBefore.getTime()
  }).length

  registryReview.metrics = {
    ...registryReview.metrics,
    review_period: {
      start: registryReview.monthInfo.start_iso,
      end: registryReview.monthInfo.end_iso,
    },
    snapshot_basis: REGISTRY_SNAPSHOT_BASIS,
    generated_as_of: generatedAt,
    quality: {
      ...registryReview.metrics.quality,
      last_verified_older_than_one_year: staleRecords,
    },
  }

  return registryReview
}

function buildNextMonthPlan(registryReview, watchlistBacklog) {
  const priorities = []
  const add = (action, count) => {
    if (count > 0 && priorities.length < 5) {
      priorities.push({ priority: priorities.length + 1, action, count })
    }
  }

  add('Resolve A candidates open for 60+ days', watchlistBacklog.aging.a_60_plus)
  add('Repair entities without events', registryReview.metrics.quality.entities_without_events)
  add('Add archives for dead-side entities', registryReview.metrics.quality.dead_side_missing_archive)
  add('Reclassify B candidates open for 90+ days', watchlistBacklog.aging.b_90_plus)
  add(
    'Repair monitoring errors or degraded runs',
    registryReview.monitoringHealth.total_errors + registryReview.monitoringHealth.degraded_runs,
  )

  return { priorities }
}

function buildSummary(month, registryReview, watchlistBacklog, nextMonthPlan, warnings) {
  const { metrics, monitoringHealth, previousMonthDelta, consistency, eventSnapshot } = registryReview
  const lines = [
    `# HEI Monthly Review - ${month}`,
    '',
    '## Registry snapshot',
    `- Review period: ${metrics.review_period.start} to ${metrics.review_period.end}`,
    `- Registry snapshot generated: ${metrics.generated_as_of}`,
    `- Snapshot basis: ${metrics.snapshot_basis}`,
    `- Entities: ${metrics.counts.entities}`,
    `- Events: ${metrics.counts.events}`,
    `- Evidence: ${metrics.counts.evidence}`,
    `- Active-side: ${metrics.counts.active_side}`,
    `- Dead-side: ${metrics.counts.dead_side}`,
    '',
    '## Monitoring health',
    `- Expected Monday runs: ${monitoringHealth.expected_scheduled_runs}`,
    `- Observed unique runs: ${monitoringHealth.observed_unique_runs}`,
    `- Successful runs: ${monitoringHealth.successful_runs}`,
    `- Degraded runs: ${monitoringHealth.degraded_runs}`,
    `- Errors: ${monitoringHealth.total_errors}`,
    '',
    '## Watchlist backlog',
    `- Unique candidates: ${watchlistBacklog.unique_candidates_seen}`,
    `- New in month: ${watchlistBacklog.new_candidates_in_month}`,
    `- Resolved: ${watchlistBacklog.resolved_candidates}`,
    `- Unresolved: ${watchlistBacklog.unresolved_candidates}`,
    `- A candidates open 60+ days: ${watchlistBacklog.aging.a_60_plus}`,
    `- B candidates open 90+ days: ${watchlistBacklog.aging.b_90_plus}`,
    '',
    '## Quality',
    `- Entities without events: ${metrics.quality.entities_without_events}`,
    `- Entities without evidence: ${metrics.quality.entities_without_evidence}`,
    `- Dead-side missing archive: ${metrics.quality.dead_side_missing_archive}`,
    `- URL status unknown/missing: ${metrics.quality.url_status_unknown_or_missing}`,
    `- Count consistency: ${consistency.status}`,
    '',
    '## Events dated in month',
    `- Total: ${eventSnapshot.total}`,
    '',
    '## Previous-month comparison',
    previousMonthDelta.available
      ? `- Compared with ${previousMonthDelta.previous_month}`
      : `- Unavailable: ${previousMonthDelta.reason}`,
    '',
    '## Next-month priorities',
  ]

  if (nextMonthPlan.priorities.length === 0) lines.push('- No automatic priority generated.')
  for (const item of nextMonthPlan.priorities) {
    lines.push(`${item.priority}. ${item.action}: ${item.count}`)
  }

  lines.push('', '## Warnings')
  if (warnings.length === 0) lines.push('- None.')
  else warnings.forEach((warning) => lines.push(`- ${warning}`))
  lines.push('')
  return lines.join('\n')
}

function buildPlanMarkdown(month, plan) {
  const lines = [`# HEI Next-Month Plan - after ${month}`, '']
  if (plan.priorities.length === 0) lines.push('- No automatic priority generated.')
  for (const item of plan.priorities) {
    lines.push(`${item.priority}. ${item.action} (${item.count})`)
  }
  lines.push('')
  return lines.join('\n')
}

export function buildMonthlyReviewArtifacts({
  month,
  canonicalData,
  monitoringManifests = [],
  watchlists = [],
  resolutionDocuments = [],
  previousMetrics = null,
  publicVersion = null,
  publicManifest = null,
  warnings = [],
  generatedAt = new Date().toISOString(),
}) {
  parseReviewMonth(month)
  const registryReview = applyRegistrySnapshotSemantics(buildMonthlyRegistryReview({
    month,
    canonicalData,
    monitoringManifests,
    previousMetrics,
    publicVersion,
    publicManifest,
  }), canonicalData, generatedAt)
  const watchlistBacklog = buildWatchlistBacklog(
    watchlists,
    resolutionDocuments,
    registryReview.monthInfo,
  )
  const nextMonthPlan = buildNextMonthPlan(registryReview, watchlistBacklog)

  return {
    'manifest.json': {
      schema_version: 1,
      review_month: month,
      review_period: registryReview.metrics.review_period,
      generated_at: generatedAt,
      registry_snapshot: {
        basis: REGISTRY_SNAPSHOT_BASIS,
        generated_at: generatedAt,
      },
      canonical_data_changed: false,
      output_files: OUTPUT_FILES,
      source_counts: {
        monitoring_manifests: monitoringManifests.length,
        watchlists: watchlists.length,
        resolution_documents: resolutionDocuments.length,
      },
      warnings,
    },
    'summary.md': buildSummary(month, registryReview, watchlistBacklog, nextMonthPlan, warnings),
    'metrics.json': registryReview.metrics,
    'monitoring-health.json': registryReview.monitoringHealth,
    'watchlist-backlog.json': watchlistBacklog,
    'quality-delta.json': registryReview.previousMonthDelta,
    'consistency-check.json': registryReview.consistency,
    'event-snapshot.json': registryReview.eventSnapshot,
    'next-month-plan.md': buildPlanMarkdown(month, nextMonthPlan),
  }
}

async function writeArtifacts(outputDirectory, artifacts) {
  await fsp.mkdir(outputDirectory, { recursive: true })
  for (const [fileName, value] of Object.entries(artifacts)) {
    const content = typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`
    await fsp.writeFile(path.join(outputDirectory, fileName), content, 'utf8')
  }
}

export async function buildMonthlyReviewFromRepository({ root = process.cwd(), month }) {
  const monthInfo = parseReviewMonth(month)
  const warnings = []
  const importRoot = path.join(root, 'data-staging', 'monthly-review-input', month)

  const monitoringManifests = [
    ...await loadMonitoringManifests(path.join(root, 'data-staging', 'monitoring'), monthInfo, warnings),
    ...await loadMonitoringManifests(path.join(importRoot, 'monitoring'), monthInfo, warnings),
  ]
  const watchlists = [
    ...await loadJsonDocuments(path.join(root, 'data-staging', 'watchlists', 'auto'), warnings),
    ...await loadJsonDocuments(path.join(importRoot, 'watchlists', 'auto'), warnings),
  ]
  const resolutionDocuments = [
    ...await loadJsonDocuments(path.join(root, 'data-staging', 'watchlists', 'resolution'), warnings),
    ...await loadJsonDocuments(path.join(importRoot, 'watchlists', 'resolution'), warnings),
  ]

  const outputRoot = path.join(root, 'data-staging', 'monthly-reviews')
  const outputDirectory = path.join(outputRoot, month)
  const canonicalData = await loadCanonicalData()
  const previousMetrics = await readJson(path.join(outputRoot, monthInfo.previous_month, 'metrics.json'), null)
  const publicVersion = await readJson(path.join(root, 'public', 'version.json'), null)
  const publicManifest = await readJson(path.join(root, 'public', 'data', 'manifest.json'), null)

  const artifacts = buildMonthlyReviewArtifacts({
    month,
    canonicalData,
    monitoringManifests,
    watchlists,
    resolutionDocuments,
    previousMetrics,
    publicVersion,
    publicManifest,
    warnings,
  })

  await writeArtifacts(outputDirectory, artifacts)
  return { outputDirectory, artifacts }
}

async function main() {
  const args = parseArgs(process.argv)
  const month = args.month || previousUtcMonth()
  const result = await buildMonthlyReviewFromRepository({ month })

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `monthly_review_dir=${result.outputDirectory}\n`)
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `review_month=${month}\n`)
  }

  const metrics = result.artifacts['metrics.json']
  const health = result.artifacts['monitoring-health.json']
  console.log(
    `Built HEI monthly review ${month}: ${metrics.counts.entities} entities, `
    + `${health.observed_unique_runs} monitoring runs.`,
  )
}

const directRun = process.argv[1]
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href

if (directRun) {
  main().catch((error) => {
    console.error(error?.stack || error?.message || error)
    process.exit(1)
  })
}
