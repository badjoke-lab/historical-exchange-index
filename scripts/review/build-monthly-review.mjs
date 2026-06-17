import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { loadCanonicalData } from '../monitoring/core/load-canonical-data.mjs'
import { buildMonthlyReviewData, parseReviewMonth, previousUtcMonth } from './monthly-review-core.mjs'

function parseArgs(argv) {
  const args = { month: null }
  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--month') {
      args.month = argv[index + 1]
      index += 1
    } else {
      throw new Error(`Unknown argument: ${arg}`)
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

async function listDirectJsonFiles(directory) {
  if (!(await exists(directory))) return []
  const entries = await fsp.readdir(directory, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => path.join(directory, entry.name))
    .sort()
}

async function loadMonitoringManifests(directory, monthInfo, warnings) {
  if (!(await exists(directory))) return []
  const entries = await fsp.readdir(directory, { withFileTypes: true })
  const manifests = []

  for (const entry of entries) {
    if (!entry.isDirectory() || !/^\d{8}$/.test(entry.name)) continue
    if (!entry.name.startsWith(monthInfo.compact_prefix)) continue
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

async function loadJsonDocuments(directory, warnings) {
  const documents = []
  for (const filePath of await listDirectJsonFiles(directory)) {
    try {
      const document = await readJson(filePath, null)
      if (document) documents.push(document)
    } catch (error) {
      warnings.push(`${filePath}: ${error.message}`)
    }
  }
  return documents
}

async function writeJson(filePath, value) {
  await fsp.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

async function main() {
  const args = parseArgs(process.argv)
  const root = process.cwd()
  const month = args.month || previousUtcMonth()
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
  const previousMetrics = await readJson(path.join(outputRoot, monthInfo.previous_month, 'metrics.json'), null)
  const publicVersion = await readJson(path.join(root, 'public', 'version.json'), null)
  const publicManifest = await readJson(path.join(root, 'public', 'data', 'manifest.json'), null)
  const canonicalData = await loadCanonicalData()

  const review = buildMonthlyReviewData({
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

  await fsp.mkdir(outputDirectory, { recursive: true })
  await writeJson(path.join(outputDirectory, 'manifest.json'), review.manifest)
  await fsp.writeFile(path.join(outputDirectory, 'summary.md'), review.summary, 'utf8')
  await writeJson(path.join(outputDirectory, 'metrics.json'), review.metrics)
  await writeJson(path.join(outputDirectory, 'monitoring-health.json'), review.monitoringHealth)
  await writeJson(path.join(outputDirectory, 'candidate-aging.json'), review.candidateAging)
  await writeJson(path.join(outputDirectory, 'quality-delta.json'), review.qualityDelta)
  await writeJson(path.join(outputDirectory, 'consistency-check.json'), review.consistency)
  await writeJson(path.join(outputDirectory, 'event-snapshot.json'), review.eventSnapshot)
  await fsp.writeFile(path.join(outputDirectory, 'next-month-plan.md'), review.nextPlanMarkdown, 'utf8')

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `monthly_review_dir=${outputDirectory}\n`)
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `review_month=${month}\n`)
  }

  console.log(`Built HEI monthly review ${month}: ${review.metrics.counts.entities} entities, ${review.monitoringHealth.observed_unique_runs} monitoring runs.`)
}

main().catch((error) => {
  console.error(error?.stack || error?.message || error)
  process.exit(1)
})
