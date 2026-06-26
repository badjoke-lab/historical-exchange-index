import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { loadCanonicalData } from './monitoring/core/load-canonical-data.mjs'

const root = process.cwd()
const recordsDir = path.join(root, 'records', 'exchanges')
const outputArg = process.argv.find((arg) => arg.startsWith('--output='))
const markdownArg = process.argv.find((arg) => arg.startsWith('--markdown='))
const strict = process.argv.includes('--strict')

function listRecordBundles() {
  const byEntityId = new Map()
  const errors = []

  if (!fs.existsSync(recordsDir)) return { byEntityId, errors }

  for (const name of fs.readdirSync(recordsDir).filter((item) => item.endsWith('.json')).sort()) {
    const file = path.join(recordsDir, name)
    const relativeFile = path.relative(root, file)

    try {
      const bundle = JSON.parse(fs.readFileSync(file, 'utf8'))
      const entityId = bundle?.entity?.id
      if (!entityId) {
        errors.push(`${relativeFile}: missing entity.id`)
        continue
      }
      if (byEntityId.has(entityId)) {
        errors.push(`${relativeFile}: duplicate reviewed bundle entity ${entityId}; first seen in ${byEntityId.get(entityId)}`)
        continue
      }
      byEntityId.set(entityId, relativeFile)
    } catch (error) {
      errors.push(`${relativeFile}: invalid JSON (${error.message})`)
    }
  }

  return { byEntityId, errors }
}

function increment(map, key) {
  map.set(key, (map.get(key) || 0) + 1)
}

function mapToObject(map) {
  return Object.fromEntries([...map.entries()].sort(([left], [right]) => left.localeCompare(right)))
}

function repairScore(entity, eventCount, evidenceCount, hasBundle) {
  let score = 0
  const reasons = []

  if (!hasBundle) {
    score += 20
    reasons.push('canonical_only')
  }
  if (eventCount === 0) {
    score += 8
    reasons.push('no_events')
  }
  if (evidenceCount === 0) {
    score += 8
    reasons.push('no_evidence')
  }
  if (!entity.launch_date) {
    score += 5
    reasons.push('missing_launch_date')
  }
  if (!entity.summary || entity.summary.trim().length < 80) {
    score += 5
    reasons.push('thin_summary')
  }
  if (!entity.country_or_origin || entity.country_or_origin === 'Unknown') {
    score += 4
    reasons.push('unknown_origin')
  }
  if (entity.official_url_status === 'unknown') {
    score += 4
    reasons.push('unknown_url_status')
  } else if (entity.official_url_status === 'live_unverified') {
    score += 2
    reasons.push('unverified_live_url')
  }
  if (entity.confidence === 'low') {
    score += 4
    reasons.push('low_confidence')
  } else if (entity.confidence === 'medium') {
    score += 2
    reasons.push('medium_confidence')
  }

  return { score, reasons }
}

const canonical = await loadCanonicalData()
const { byEntityId: bundleByEntityId, errors } = listRecordBundles()
const eventCounts = new Map()
const evidenceCounts = new Map()

for (const event of canonical.events) increment(eventCounts, event.exchange_id)
for (const evidence of canonical.evidence) increment(evidenceCounts, evidence.exchange_id)

const statusCounts = new Map()
const bundledStatusCounts = new Map()
const canonicalOnlyStatusCounts = new Map()

const dexEntities = canonical.entities
  .filter((entity) => entity.type === 'dex')
  .map((entity) => {
    const hasBundle = bundleByEntityId.has(entity.id)
    const eventCount = eventCounts.get(entity.id) || 0
    const evidenceCount = evidenceCounts.get(entity.id) || 0
    const repair = repairScore(entity, eventCount, evidenceCount, hasBundle)

    increment(statusCounts, entity.status)
    increment(hasBundle ? bundledStatusCounts : canonicalOnlyStatusCounts, entity.status)

    return {
      id: entity.id,
      slug: entity.slug,
      canonical_name: entity.canonical_name,
      status: entity.status,
      launch_date: entity.launch_date,
      country_or_origin: entity.country_or_origin,
      official_url_status: entity.official_url_status,
      confidence: entity.confidence,
      event_count: eventCount,
      evidence_count: evidenceCount,
      has_reviewed_bundle: hasBundle,
      bundle_path: bundleByEntityId.get(entity.id) || null,
      repair_score: repair.score,
      repair_reasons: repair.reasons,
    }
  })
  .sort((left, right) => {
    if (left.has_reviewed_bundle !== right.has_reviewed_bundle) return left.has_reviewed_bundle ? 1 : -1
    if (left.repair_score !== right.repair_score) return right.repair_score - left.repair_score
    return left.canonical_name.localeCompare(right.canonical_name)
  })

const canonicalOnly = dexEntities.filter((entity) => !entity.has_reviewed_bundle)
const bundled = dexEntities.filter((entity) => entity.has_reviewed_bundle)
const targetMinimum = 20
const targetMaximum = 40
const seedTargetMet = dexEntities.length >= targetMinimum
const recommendation = !seedTargetMet
  ? 'add_dex_seed_records'
  : canonicalOnly.length > 0
    ? 'repair_existing_canonical_only_dex_before_new_additions'
    : 'dex_seed_and_bundle_coverage_complete_move_to_quality_maintenance'

const report = {
  generated_at: new Date().toISOString(),
  scope: {
    type: 'dex',
    plan_target_minimum: targetMinimum,
    plan_target_maximum: targetMaximum,
  },
  summary: {
    canonical_dex_entities: dexEntities.length,
    reviewed_bundle_entities: bundled.length,
    canonical_only_entities: canonicalOnly.length,
    bundle_coverage_percent: dexEntities.length === 0 ? 0 : Number(((bundled.length / dexEntities.length) * 100).toFixed(1)),
    entities_with_events: dexEntities.filter((entity) => entity.event_count > 0).length,
    entities_with_evidence: dexEntities.filter((entity) => entity.evidence_count > 0).length,
    seed_target_met: seedTargetMet,
    recommendation,
  },
  status_counts: mapToObject(statusCounts),
  bundled_status_counts: mapToObject(bundledStatusCounts),
  canonical_only_status_counts: mapToObject(canonicalOnlyStatusCounts),
  canonical_only_candidates: canonicalOnly,
  reviewed_bundle_records: bundled,
  errors,
}

const topCandidates = canonicalOnly.slice(0, 30)
const markdown = [
  '# HEI DEX Seed Readiness Audit',
  '',
  `- Canonical DEX entities: ${report.summary.canonical_dex_entities}`,
  `- Reviewed bundle entities: ${report.summary.reviewed_bundle_entities}`,
  `- Canonical-only entities: ${report.summary.canonical_only_entities}`,
  `- Bundle coverage: ${report.summary.bundle_coverage_percent}%`,
  `- Entities with events: ${report.summary.entities_with_events}`,
  `- Entities with evidence: ${report.summary.entities_with_evidence}`,
  `- Plan target met (20 minimum): ${report.summary.seed_target_met}`,
  `- Recommendation: ${report.summary.recommendation}`,
  '',
  '## Status counts',
  '',
  ...Object.entries(report.status_counts).map(([status, count]) => `- ${status}: ${count}`),
  '',
  '## Highest-priority canonical-only DEX records',
  '',
  ...(topCandidates.length > 0
    ? topCandidates.map((entity) => `- ${entity.canonical_name} (${entity.id}) — score ${entity.repair_score}; status ${entity.status}; events ${entity.event_count}; evidence ${entity.evidence_count}; reasons ${entity.repair_reasons.join(', ') || 'none'}`)
    : ['- None.']),
  '',
  '## Audit errors',
  '',
  ...(errors.length > 0 ? errors.map((error) => `- ${error}`) : ['- None.']),
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

console.log(`DEX entities: ${report.summary.canonical_dex_entities}`)
console.log(`Reviewed bundles: ${report.summary.reviewed_bundle_entities}`)
console.log(`Canonical-only: ${report.summary.canonical_only_entities}`)
console.log(`Bundle coverage: ${report.summary.bundle_coverage_percent}%`)
console.log(`Recommendation: ${report.summary.recommendation}`)
if (errors.length > 0) console.error(errors.map((error) => `- ${error}`).join('\n'))
if (strict && errors.length > 0) process.exit(1)
