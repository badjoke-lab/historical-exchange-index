import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { loadCanonicalData } from './monitoring/core/load-canonical-data.mjs'

const root = process.cwd()
const outputArg = process.argv.find((arg) => arg.startsWith('--output='))
const markdownArg = process.argv.find((arg) => arg.startsWith('--markdown='))
const strict = process.argv.includes('--strict')
const dispositionPath = path.join(root, 'config', 'active-cex-repair-dispositions.json')
const generatedDate = new Date().toISOString().slice(0, 10)

const ACTIVE_SIDE = new Set(['active', 'limited', 'inactive'])
const OFFICIAL_SOURCE_TYPES = new Set(['official_statement', 'official_blog', 'official_social'])
const INDEPENDENT_SOURCE_TYPES = new Set(['news_article', 'regulatory_notice', 'court_document', 'database_reference'])
const REPAIR_DISPOSITIONS = new Set(['defer'])
const STRICT_PASS_STATUSES = new Set(['pass', 'final_partial_batch', 'complete'])

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
      // Record validation owns parse failures. This audit only maps valid bundles.
    }
  }
  return byEntityId
}

function loadRepairDispositions() {
  if (!fs.existsSync(dispositionPath)) {
    return {
      reviewed_at: null,
      entries: [],
      byEntityId: new Map(),
    }
  }

  let parsed
  try {
    parsed = JSON.parse(fs.readFileSync(dispositionPath, 'utf8'))
  } catch (error) {
    throw new Error(`${path.relative(root, dispositionPath)}: invalid JSON: ${error.message}`)
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`${path.relative(root, dispositionPath)}: expected object`)
  }
  if (parsed.schema_version !== 1) {
    throw new Error(`${path.relative(root, dispositionPath)}: schema_version must be 1`)
  }
  if (!Array.isArray(parsed.entities)) {
    throw new Error(`${path.relative(root, dispositionPath)}: entities must be an array`)
  }

  const byEntityId = new Map()
  for (const [index, entry] of parsed.entities.entries()) {
    const label = `${path.relative(root, dispositionPath)}.entities[${index}]`
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new Error(`${label}: expected object`)
    }
    if (typeof entry.id !== 'string' || !entry.id.startsWith('hei_ex_')) {
      throw new Error(`${label}.id: expected hei_ex_ identifier`)
    }
    if (typeof entry.slug !== 'string' || entry.slug.trim() === '') {
      throw new Error(`${label}.slug: required`)
    }
    if (!REPAIR_DISPOSITIONS.has(entry.disposition)) {
      throw new Error(`${label}.disposition: expected one of ${[...REPAIR_DISPOSITIONS].join(', ')}`)
    }
    if (typeof entry.reason !== 'string' || entry.reason.trim().length < 20) {
      throw new Error(`${label}.reason: must contain a substantive reviewed reason`)
    }
    if (typeof entry.review_after !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(entry.review_after) || !Number.isFinite(Date.parse(entry.review_after))) {
      throw new Error(`${label}.review_after: expected YYYY-MM-DD`)
    }
    if (byEntityId.has(entry.id)) {
      throw new Error(`${label}.id: duplicate disposition for ${entry.id}`)
    }
    byEntityId.set(entry.id, entry)
  }

  return {
    reviewed_at: parsed.reviewed_at || null,
    entries: parsed.entities,
    byEntityId,
  }
}

function ageDays(value) {
  const time = Date.parse(value || '')
  return Number.isFinite(time) ? Math.floor((Date.now() - time) / 86400000) : null
}

function scoreEntity(entity, events, evidence, bundleFile) {
  const issues = []
  let score = 0
  const add = (weight, code, detail) => {
    score += weight
    issues.push({ code, weight, detail })
  }

  const launchEvents = events.filter((event) => event.event_type === 'launched')
  const entityEvidence = evidence.filter((item) => item.event_id == null)
  const officialEvidence = evidence.filter((item) => OFFICIAL_SOURCE_TYPES.has(item.source_type))
  const independentEvidence = evidence.filter((item) => INDEPENDENT_SOURCE_TYPES.has(item.source_type))
  const statusEvidence = evidence.filter((item) => ['status', 'entity'].includes(item.claim_scope))
  const launchEvidence = evidence.filter((item) => item.claim_scope === 'launch_date' || launchEvents.some((event) => event.id === item.event_id))

  if (events.length === 0) add(8, 'no_events', 'No projected events.')
  else if (events.length === 1) add(2, 'single_event', 'Only one projected event.')

  if (!entity.launch_date) add(5, 'missing_launch_date', 'Entity launch_date is missing.')
  if (launchEvents.length === 0) add(4, 'missing_launch_event', 'No launched event.')
  if (launchEvidence.length === 0) add(3, 'missing_launch_evidence', 'No evidence clearly supports launch timing.')

  if (evidence.length === 0) add(10, 'no_evidence', 'No projected evidence records.')
  else if (evidence.length === 1) add(7, 'one_evidence', 'Only one projected evidence record.')
  else if (evidence.length === 2) add(3, 'two_evidence', 'Only two projected evidence records.')

  if (officialEvidence.length === 0) add(4, 'missing_official_evidence', 'No official statement, blog, or social source.')
  if (independentEvidence.length === 0) add(4, 'missing_independent_evidence', 'No independent news, regulatory, court, or database source.')
  if (statusEvidence.length === 0 && entityEvidence.length === 0) add(4, 'missing_current_status_evidence', 'No entity-level or status evidence.')

  if (!entity.official_url_original) add(4, 'missing_original_url', 'Original official URL is missing.')
  if (!entity.official_domain_original) add(4, 'missing_original_domain', 'Original official domain is missing.')
  if (['unknown', 'live_unverified'].includes(entity.official_url_status)) add(2, 'weak_url_status', `official_url_status=${entity.official_url_status}`)
  if (!entity.archived_url) add(1, 'missing_archive', 'No archived_url.')

  if (!entity.country_or_origin || entity.country_or_origin === 'Unknown') add(3, 'weak_origin', `country_or_origin=${entity.country_or_origin || 'missing'}`)
  if ((entity.summary || '').trim().length < 100) add(2, 'short_summary', `Summary length ${(entity.summary || '').trim().length}.`)
  if (entity.confidence === 'low') add(4, 'low_confidence', 'Entity confidence is low.')
  else if (entity.confidence === 'medium') add(1, 'medium_confidence', 'Entity confidence is medium.')

  const verifiedAge = ageDays(entity.last_verified_at)
  if (verifiedAge == null) add(3, 'missing_last_verified', 'last_verified_at is missing or invalid.')
  else if (verifiedAge > 365) add(2, 'stale_verification', `Last verified ${verifiedAge} days ago.`)
  else if (verifiedAge > 180) add(1, 'aging_verification', `Last verified ${verifiedAge} days ago.`)

  if (!bundleFile) add(2, 'canonical_only', 'No reviewed record bundle maps to this entity; repair requires a guarded canonical correction or a repair bundle.')

  return {
    entity_id: entity.id,
    slug: entity.slug,
    canonical_name: entity.canonical_name,
    status: entity.status,
    confidence: entity.confidence,
    country_or_origin: entity.country_or_origin,
    official_url_status: entity.official_url_status,
    launch_date: entity.launch_date,
    last_verified_at: entity.last_verified_at,
    bundle_file: bundleFile || null,
    event_count: events.length,
    evidence_count: evidence.length,
    launch_event_count: launchEvents.length,
    official_evidence_count: officialEvidence.length,
    independent_evidence_count: independentEvidence.length,
    status_or_entity_evidence_count: new Set([...statusEvidence, ...entityEvidence].map((item) => item.id)).size,
    repair_score: score,
    issues: issues.sort((left, right) => right.weight - left.weight || left.code.localeCompare(right.code)),
  }
}

const canonical = await loadCanonicalData()
const bundleByEntityId = listRecordBundles()
const dispositions = loadRepairDispositions()
const eventsByEntity = new Map()
const evidenceByEntity = new Map()
for (const event of canonical.events) {
  const list = eventsByEntity.get(event.exchange_id) || []
  list.push(event)
  eventsByEntity.set(event.exchange_id, list)
}
for (const item of canonical.evidence) {
  const list = evidenceByEntity.get(item.exchange_id) || []
  list.push(item)
  evidenceByEntity.set(item.exchange_id, list)
}

const records = canonical.entities
  .filter((entity) => entity.type === 'cex' && ACTIVE_SIDE.has(entity.status))
  .map((entity) => {
    const record = scoreEntity(
      entity,
      eventsByEntity.get(entity.id) || [],
      evidenceByEntity.get(entity.id) || [],
      bundleByEntityId.get(entity.id),
    )
    const disposition = dispositions.byEntityId.get(entity.id) || null
    const dispositionActive = Boolean(disposition && disposition.review_after > generatedDate)
    return {
      ...record,
      repair_disposition: disposition?.disposition || null,
      repair_disposition_reason: disposition?.reason || null,
      repair_review_after: disposition?.review_after || null,
      repair_disposition_active: dispositionActive,
    }
  })
  .sort((left, right) => right.repair_score - left.repair_score || left.canonical_name.localeCompare(right.canonical_name))

const recordById = new Map(records.map((record) => [record.entity_id, record]))
const dispositionErrors = []
for (const entry of dispositions.entries) {
  const record = recordById.get(entry.id)
  if (!record) {
    dispositionErrors.push(`${entry.id}: disposition does not map to an active-side CEX record`)
    continue
  }
  if (record.slug !== entry.slug) {
    dispositionErrors.push(`${entry.id}: disposition slug ${entry.slug} does not match ${record.slug}`)
  }
  if (!record.bundle_file) {
    dispositionErrors.push(`${entry.id}: disposition requires an existing reviewed record bundle`)
  }
  if (record.repair_score === 0) {
    dispositionErrors.push(`${entry.id}: disposition is stale because the record repair score is already zero`)
  }
}
if (dispositionErrors.length > 0) {
  throw new Error(`Invalid active CEX repair dispositions:\n- ${dispositionErrors.join('\n- ')}`)
}

const deferredRecords = records.filter((record) => record.repair_disposition === 'defer' && record.repair_disposition_active)
const dueDispositions = records.filter((record) => record.repair_disposition === 'defer' && !record.repair_disposition_active)
const bundleRepairable = records.filter((record) => (
  record.bundle_file
  && record.repair_score > 0
  && !record.repair_disposition_active
))
const targetBatchSize = Math.min(5, bundleRepairable.length)
const selectedBatch = bundleRepairable.slice(0, targetBatchSize).map((record) => record.entity_id)
const scoreBands = {
  critical: records.filter((record) => record.repair_score >= 20).length,
  high: records.filter((record) => record.repair_score >= 12 && record.repair_score < 20).length,
  medium: records.filter((record) => record.repair_score >= 6 && record.repair_score < 12).length,
  low: records.filter((record) => record.repair_score > 0 && record.repair_score < 6).length,
  complete: records.filter((record) => record.repair_score === 0).length,
}
const auditStatus = targetBatchSize === 5
  ? 'pass'
  : targetBatchSize > 0
    ? 'final_partial_batch'
    : 'complete'

const report = {
  generated_at: new Date().toISOString(),
  projected_counts: {
    entities: canonical.entities.length,
    events: canonical.events.length,
    evidence: canonical.evidence.length,
  },
  scope: {
    types: ['cex'],
    statuses: [...ACTIVE_SIDE],
  },
  selection_policy: 'Rank all active-side CEX records, keep every score visible, exclude only active reviewed deferrals, then select up to five highest-scoring records that already have a reviewed bundle. A smaller final batch or zero remaining targets is valid.',
  active_side_cex_count: records.length,
  mapped_record_bundles: records.filter((record) => record.bundle_file).length,
  canonical_only_records: records.filter((record) => !record.bundle_file).length,
  repair_dispositions_reviewed_at: dispositions.reviewed_at,
  deferred_record_count: deferredRecords.length,
  deferred_records: deferredRecords,
  due_disposition_count: dueDispositions.length,
  due_dispositions: dueDispositions,
  repairable_bundle_targets: bundleRepairable.length,
  target_batch_size: targetBatchSize,
  score_bands: scoreBands,
  selected_batch: selectedBatch,
  selected_records: selectedBatch.map((id) => records.find((record) => record.entity_id === id)),
  records,
  status: auditStatus,
}

const markdown = [
  '# HEI C3 Thin Active CEX Audit',
  '',
  `- Projected registry: ${canonical.entities.length} entities / ${canonical.events.length} events / ${canonical.evidence.length} evidence`,
  `- Active-side CEX records: ${records.length}`,
  `- Mapped record bundles: ${report.mapped_record_bundles}`,
  `- Canonical-only records: ${report.canonical_only_records}`,
  `- Active reviewed deferrals: ${report.deferred_record_count}`,
  `- Deferrals due for review: ${report.due_disposition_count}`,
  `- Remaining repairable bundle targets: ${report.repairable_bundle_targets}`,
  `- Audit status: ${report.status}`,
  `- Score bands: ${JSON.stringify(scoreBands)}`,
  '- Selection: up to five scored records with an existing reviewed bundle, excluding only active reviewed deferrals; deferred records remain visible and scored.',
  '',
  '## Selected repair batch',
  '',
  ...(report.selected_records.length > 0
    ? report.selected_records.map((record, index) => `${index + 1}. ${record.canonical_name} (${record.entity_id}) — score ${record.repair_score} — ${record.bundle_file}`)
    : ['- None; the reviewed bundle repair queue is complete.']),
  '',
  '## Reviewed deferrals',
  '',
  ...(deferredRecords.length > 0
    ? deferredRecords.map((record) => `- ${record.canonical_name} (${record.entity_id}) — score ${record.repair_score} — review after ${record.repair_review_after} — ${record.repair_disposition_reason}`)
    : ['- None']),
  '',
  '## Deferrals due for review',
  '',
  ...(dueDispositions.length > 0
    ? dueDispositions.map((record) => `- ${record.canonical_name} (${record.entity_id}) — score ${record.repair_score} — review date ${record.repair_review_after}`)
    : ['- None']),
  '',
  '## Highest-priority records',
  '',
  '| Entity | Status | Score | Events | Evidence | Bundle | Disposition | Top issues |',
  '|---|---:|---:|---:|---:|---|---|---|',
  ...records.slice(0, 25).map((record) => `| ${record.canonical_name} | ${record.status} | ${record.repair_score} | ${record.event_count} | ${record.evidence_count} | ${record.bundle_file || 'canonical-only'} | ${record.repair_disposition_active ? `defer until ${record.repair_review_after}` : '—'} | ${record.issues.slice(0, 3).map((issue) => issue.code).join(', ')} |`),
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

console.log(`Active-side CEX records: ${records.length}`)
console.log(`Mapped bundles: ${report.mapped_record_bundles}`)
console.log(`Active reviewed deferrals: ${report.deferred_record_count}`)
console.log(`Deferrals due for review: ${report.due_disposition_count}`)
console.log(`Remaining repairable bundle targets: ${report.repairable_bundle_targets}`)
console.log(`Audit status: ${report.status}`)
console.log(`Score bands: ${JSON.stringify(scoreBands)}`)
console.log(`Selected batch: ${selectedBatch.join(', ')}`)
if (strict && !STRICT_PASS_STATUSES.has(report.status)) process.exit(1)
