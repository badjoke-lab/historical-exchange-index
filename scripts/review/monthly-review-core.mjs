import fs from 'node:fs/promises'
import path from 'node:path'

const DEAD_SIDE_STATUSES = new Set(['dead', 'merged', 'acquired', 'rebranded'])
const ACTIVE_SIDE_STATUSES = new Set(['active', 'limited', 'inactive'])
const TERMINAL_RESOLUTIONS = new Set([
  'promoted_to_canonical',
  'matched_existing',
  'existing',
  'duplicate',
  'out_of_scope',
  'out_of_scope_or_duplicate',
  'rejected',
  'not_a_distinct_entity',
])

function pad(value) {
  return String(value).padStart(2, '0')
}

export function parseReviewMonth(value) {
  if (!/^\d{4}-\d{2}$/.test(String(value || ''))) {
    throw new Error(`Invalid review month: ${value}. Expected YYYY-MM.`)
  }

  const [year, monthNumber] = value.split('-').map(Number)
  if (monthNumber < 1 || monthNumber > 12) {
    throw new Error(`Invalid review month: ${value}.`)
  }

  const start = new Date(Date.UTC(year, monthNumber - 1, 1))
  const end = new Date(Date.UTC(year, monthNumber, 0, 23, 59, 59, 999))
  const previousDate = new Date(Date.UTC(year, monthNumber - 2, 1))

  return {
    month: value,
    year,
    monthNumber,
    start,
    end,
    startIso: start.toISOString(),
    endIso: end.toISOString(),
    datePrefix: `${year}-${pad(monthNumber)}`,
    compactPrefix: `${year}${pad(monthNumber)}`,
    previousMonth: `${previousDate.getUTCFullYear()}-${pad(previousDate.getUTCMonth() + 1)}`,
  }
}

export function previousUtcMonth(now = new Date()) {
  const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}`
}

function normalizeKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

async function exists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function readJson(filePath, fallback = null) {
  if (!(await exists(filePath))) return fallback
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

async function listJsonFilesRecursive(root) {
  if (!(await exists(root))) return []
  const output = []
  const entries = await fs.readdir(root, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(root, entry.name)
    if (entry.isDirectory()) {
      output.push(...await listJsonFilesRecursive(fullPath))
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      output.push(fullPath)
    }
  }
  return output.sort()
}

function dateInRange(value, start, end) {
  const timestamp = Date.parse(value)
  return Number.isFinite(timestamp) && timestamp >= start.getTime() && timestamp <= end.getTime()
}

function countBy(items, getKey) {
  return items.reduce((counts, item) => {
    const key = getKey(item) || 'unknown'
    counts[key] = (counts[key] || 0) + 1
    return counts
  }, {})
}

function countMondays(monthInfo) {
  let count = 0
  const cursor = new Date(monthInfo.start)
  while (cursor <= monthInfo.end) {
    if (cursor.getUTCDay() === 1) count += 1
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return count
}

export async function collectMonitoringRuns(inputRoots, monthInfo) {
  const byRunId = new Map()
  const warnings = []

  for (const inputRoot of inputRoots) {
    const monitoringRoot = path.join(inputRoot, 'data-staging', 'monitoring')
    if (!(await exists(monitoringRoot))) continue

    const entries = await fs.readdir(monitoringRoot, { withFileTypes: true })
    for (const entry of entries) {
      if (!entry.isDirectory() || !/^\d{8}$/.test(entry.name)) continue
      if (!entry.name.startsWith(monthInfo.compactPrefix)) continue

      const runDir = path.join(monitoringRoot, entry.name)
      const manifest = await readJson(path.join(runDir, 'manifest.json'), null)
      if (!manifest) {
        warnings.push(`Missing manifest.json in ${runDir}`)
        continue
      }

      const runId = manifest.run_id || `${entry.name}:${manifest.created_at || inputRoot}`
      const existing = byRunId.get(runId)
      const candidate = { runId, runDir, inputRoot, manifest }
      if (!existing || String(manifest.created_at || '') > String(existing.manifest.created_at || '')) {
        byRunId.set(runId, candidate)
      }
    }
  }

  return {
    runs: [...byRunId.values()].sort((a, b) => String(a.manifest.started_at || '').localeCompare(String(b.manifest.started_at || ''))),
    warnings,
  }
}

function extractResolutionEntries(value, inheritedDate = null, output = []) {
  if (Array.isArray(value)) {
    for (const item of value) extractResolutionEntries(item, inheritedDate, output)
    return output
  }
  if (!value || typeof value !== 'object') return output

  const localDate = value.created_at || inheritedDate
  if (value.canonical_name && value.resolution) {
    output.push({
      canonical_name: value.canonical_name,
      resolution: value.resolution,
      entity_id: value.entity_id || null,
      created_at: localDate || null,
      notes: value.notes || null,
    })
  }

  for (const child of Object.values(value)) {
    if (child && typeof child === 'object') extractResolutionEntries(child, localDate, output)
  }
  return output
}

export async function collectCandidateHistory(inputRoots, monthInfo) {
  const occurrences = []
  const resolutions = []
  const warnings = []

  for (const inputRoot of inputRoots) {
    const autoRoot = path.join(inputRoot, 'data-staging', 'watchlists', 'auto')
    for (const filePath of await listJsonFilesRecursive(autoRoot)) {
      try {
        const value = await readJson(filePath, {})
        const seenAt = value.created_at || value.generated_at || null
        if (seenAt && Date.parse(seenAt) > monthInfo.end.getTime()) continue
        for (const candidate of value.candidates || []) {
          const key = normalizeKey(candidate.canonical_name || candidate.headline || candidate.candidate_id)
          if (!key) continue
          occurrences.push({
            key,
            seen_at: seenAt,
            candidate: { ...candidate },
            file_path: filePath,
          })
        }
      } catch (error) {
        warnings.push(`${filePath}: ${error.message}`)
      }
    }

    const resolutionRoot = path.join(inputRoot, 'data-staging', 'watchlists', 'resolution')
    for (const filePath of await listJsonFilesRecursive(resolutionRoot)) {
      try {
        const value = await readJson(filePath, {})
        for (const resolution of extractResolutionEntries(value)) {
          if (resolution.created_at && Date.parse(resolution.created_at) > monthInfo.end.getTime()) continue
          const key = normalizeKey(resolution.canonical_name)
          if (key) resolutions.push({ key, ...resolution, file_path: filePath })
        }
      } catch (error) {
        warnings.push(`${filePath}: ${error.message}`)
      }
    }
  }

  return { occurrences, resolutions, warnings }
}

export function buildMonitoringHealth(runs, monthInfo) {
  const monitorTotals = {}
  let successfulRuns = 0
  let degradedRuns = 0
  let totalFindings = 0
  let totalCandidates = 0
  let totalErrors = 0

  for (const run of runs) {
    let runDegraded = false
    for (const monitor of run.manifest.monitors || []) {
      const name = monitor.name || 'unknown'
      monitorTotals[name] ||= { runs: 0, ok: 0, degraded: 0, findings: 0, candidates: 0, errors: 0 }
      const target = monitorTotals[name]
      target.runs += 1
      target.findings += Number(monitor.findings_count || 0)
      target.candidates += Number(monitor.candidate_count || 0)
      target.errors += Number(monitor.errors_count || 0)
      if (monitor.status === 'ok' && Number(monitor.errors_count || 0) === 0) target.ok += 1
      else {
        target.degraded += 1
        runDegraded = true
      }
      totalFindings += Number(monitor.findings_count || 0)
      totalCandidates += Number(monitor.candidate_count || 0)
      totalErrors += Number(monitor.errors_count || 0)
    }
    if (runDegraded) degradedRuns += 1
    else successfulRuns += 1
  }

  const expectedScheduledRuns = countMondays(monthInfo)
  return {
    month: monthInfo.month,
    expected_scheduled_runs: expectedScheduledRuns,
    observed_unique_runs: runs.length,
    successful_runs: successfulRuns,
    degraded_runs: degradedRuns,
    possible_missing_scheduled_runs: Math.max(0, expectedScheduledRuns - runs.length),
    total_findings: totalFindings,
    total_candidates: totalCandidates,
    total_errors: totalErrors,
    monitors: monitorTotals,
    runs: runs.map((run) => ({
      run_id: run.runId,
      started_at: run.manifest.started_at || null,
      finished_at: run.manifest.finished_at || null,
      mode: run.manifest.mode || null,
      input_root: run.inputRoot,
    })),
  }
}

export function buildCandidateAging(occurrences, resolutions, monthInfo) {
  const history = new Map()
  const resolutionByKey = new Map()

  for (const resolution of resolutions) {
    const current = resolutionByKey.get(resolution.key)
    if (!current || String(resolution.created_at || '') > String(current.created_at || '')) {
      resolutionByKey.set(resolution.key, resolution)
    }
  }

  for (const occurrence of occurrences) {
    const seenAt = occurrence.seen_at || monthInfo.endIso
    const current = history.get(occurrence.key)
    if (!current) {
      history.set(occurrence.key, {
        key: occurrence.key,
        canonical_name: occurrence.candidate.canonical_name || occurrence.candidate.headline || occurrence.key,
        first_seen_at: seenAt,
        last_seen_at: seenAt,
        latest: occurrence.candidate,
        occurrences: 1,
      })
      continue
    }
    if (String(seenAt) < String(current.first_seen_at)) current.first_seen_at = seenAt
    if (String(seenAt) >= String(current.last_seen_at)) {
      current.last_seen_at = seenAt
      current.latest = occurrence.candidate
    }
    current.occurrences += 1
  }

  const items = [...history.values()].map((item) => {
    const resolution = resolutionByKey.get(item.key) || null
    const resolved = Boolean(resolution && TERMINAL_RESOLUTIONS.has(resolution.resolution))
    const firstTimestamp = Date.parse(item.first_seen_at)
    const ageDays = Number.isFinite(firstTimestamp)
      ? Math.max(0, Math.floor((monthInfo.end.getTime() - firstTimestamp) / 86_400_000))
      : 0
    return {
      canonical_name: item.canonical_name,
      candidate_class: item.latest.candidate_class || 'unknown',
      first_seen_at: item.first_seen_at,
      last_seen_at: item.last_seen_at,
      age_days: ageDays,
      occurrences: item.occurrences,
      resolved,
      resolution: resolution?.resolution || null,
      entity_id: resolution?.entity_id || null,
      next_action: item.latest.next_action || null,
      source_category: item.latest.source_category || null,
    }
  }).sort((a, b) => b.age_days - a.age_days || a.canonical_name.localeCompare(b.canonical_name))

  const unresolved = items.filter((item) => !item.resolved)
  const newInMonth = items.filter((item) => dateInRange(item.first_seen_at, monthInfo.start, monthInfo.end))

  return {
    month: monthInfo.month,
    unique_candidates_seen: items.length,
    new_candidates_in_month: newInMonth.length,
    resolved_candidates: items.length - unresolved.length,
    unresolved_candidates: unresolved.length,
    by_class: countBy(items, (item) => item.candidate_class),
    unresolved_by_class: countBy(unresolved, (item) => item.candidate_class),
    aging: {
      a_0_29: unresolved.filter((item) => item.candidate_class === 'A' && item.age_days < 30).length,
      a_30_59: unresolved.filter((item) => item.candidate_class === 'A' && item.age_days >= 30 && item.age_days < 60).length,
      a_60_plus: unresolved.filter((item) => item.candidate_class === 'A' && item.age_days >= 60).length,
      b_0_59: unresolved.filter((item) => item.candidate_class === 'B' && item.age_days < 60).length,
      b_60_89: unresolved.filter((item) => item.candidate_class === 'B' && item.age_days >= 60 && item.age_days < 90).length,
      b_90_plus: unresolved.filter((item) => item.candidate_class === 'B' && item.age_days >= 90).length,
    },
    overdue: unresolved.filter((item) =>
      (item.candidate_class === 'A' && item.age_days >= 30)
      || (item.candidate_class === 'B' && item.age_days >= 90),
    ),
    items,
  }
}

function percentage(numerator, denominator) {
  if (!denominator) return 0
  return Number(((numerator / denominator) * 100).toFixed(2))
}

export function buildCanonicalMetrics(canonicalData, monthInfo) {
  const entities = canonicalData.entities || []
  const events = canonicalData.events || []
  const evidence = canonicalData.evidence || []
  const eventCounts = countBy(events, (event) => event.exchange_id)
  const evidenceCounts = countBy(evidence, (item) => item.exchange_id)
  const deadSide = entities.filter((entity) => DEAD_SIDE_STATUSES.has(entity.status))
  const activeSide = entities.filter((entity) => ACTIVE_SIDE_STATUSES.has(entity.status))
  const staleBefore = new Date(monthInfo.end)
  staleBefore.setUTCFullYear(staleBefore.getUTCFullYear() - 1)

  const quality = {
    entities_without_events: entities.filter((entity) => !eventCounts[entity.id]).length,
    entities_without_evidence: entities.filter((entity) => !evidenceCounts[entity.id]).length,
    entities_with_one_evidence: entities.filter((entity) => evidenceCounts[entity.id] === 1).length,
    dead_side_with_fewer_than_two_evidence: deadSide.filter((entity) => (evidenceCounts[entity.id] || 0) < 2).length,
    dead_side_missing_archive: deadSide.filter((entity) => !entity.archived_url).length,
    url_status_unknown_or_missing: entities.filter((entity) => !entity.official_url_status || entity.official_url_status === 'unknown').length,
    origin_missing: entities.filter((entity) => !entity.country_or_origin).length,
    launch_date_missing: entities.filter((entity) => !entity.launch_date).length,
    dead_side_death_date_missing: deadSide.filter((entity) => !entity.death_date).length,
    low_confidence: entities.filter((entity) => entity.confidence === 'low').length,
    last_verified_older_than_one_year: entities.filter((entity) => {
      const timestamp = Date.parse(entity.last_verified_at)
      return Number.isFinite(timestamp) && timestamp < staleBefore.getTime()
    }).length,
  }

  const archiveKnown = deadSide.filter((entity) => Boolean(entity.archived_url)).length
  const highConfidence = entities.filter((entity) => entity.confidence === 'high').length
  const originKnown = entities.filter((entity) => Boolean(entity.country_or_origin)).length

  return {
    month: monthInfo.month,
    generated_as_of: monthInfo.endIso,
    counts: {
      entities: entities.length,
      events: events.length,
      evidence: evidence.length,
      active_side: activeSide.length,
      dead_side: deadSide.length,
    },
    status: countBy(entities, (entity) => entity.status),
    type: countBy(entities, (entity) => entity.type),
    quality,
    coverage: {
      dead_side_archive_percent: percentage(archiveKnown, deadSide.length),
      high_confidence_percent: percentage(highConfidence, entities.length),
      origin_known_percent: percentage(originKnown, entities.length),
    },
  }
}

function numericDelta(current, previous) {
  const output = {}
  for (const [key, value] of Object.entries(current || {})) {
    if (typeof value === 'number' && typeof previous?.[key] === 'number') {
      output[key] = Number((value - previous[key]).toFixed(2))
    }
  }
  return output
}

export function buildQualityDelta(metrics, previousMetrics, previousMonth) {
  if (!previousMetrics) {
    return { available: false, previous_month: previousMonth, reason: 'previous metrics not found' }
  }
  return {
    available: true,
    previous_month: previousMonth,
    counts: numericDelta(metrics.counts, previousMetrics.counts),
    quality: numericDelta(metrics.quality, previousMetrics.quality),
    coverage: numericDelta(metrics.coverage, previousMetrics.coverage),
  }
}

export function buildEventSnapshot(events, monthInfo) {
  const items = (events || []).filter((event) => {
    const date = event.event_date || event.start_date
    return typeof date === 'string' && date.startsWith(monthInfo.datePrefix)
  }).sort((a, b) => String(a.event_date || '').localeCompare(String(b.event_date || '')))

  return {
    month: monthInfo.month,
    basis: 'event_date_or_start_date',
    total: items.length,
    by_event_type: countBy(items, (event) => event.event_type),
    events: items.map((event) => ({
      id: event.id,
      exchange_id: event.exchange_id,
      event_type: event.event_type,
      event_date: event.event_date || null,
      title: event.title || null,
    })),
  }
}

export async function buildConsistencyCheck(root, metrics) {
  const expected = {
    primary_records: metrics.counts.entities,
    events: metrics.counts.events,
    evidence: metrics.counts.evidence,
  }
  const sources = {}

  for (const [name, relativePath, selector] of [
    ['version', 'public/version.json', (value) => value?.data?.record_counts],
    ['manifest', 'public/data/manifest.json', (value) => value?.record_counts],
  ]) {
    const value = await readJson(path.join(root, relativePath), null)
    const counts = selector(value)
    sources[name] = counts
      ? { available: true, counts, matches_expected: JSON.stringify(counts) === JSON.stringify(expected) }
      : { available: false, counts: null, matches_expected: null }
  }

  const available = Object.values(sources).filter((source) => source.available)
  return {
    expected,
    sources,
    status: available.length === 0
      ? 'unavailable'
      : available.every((source) => source.matches_expected) ? 'pass' : 'mismatch',
  }
}

export function buildNextMonthPlan(metrics, candidateAging, monitoringHealth) {
  const priorities = []
  if (candidateAging.aging.a_60_plus > 0) {
    priorities.push({ priority: 1, action: 'Resolve A candidates aged 60+ days', count: candidateAging.aging.a_60_plus })
  }
  if (metrics.quality.entities_without_events > 0) {
    priorities.push({ priority: priorities.length + 1, action: 'Repair entities without events', count: metrics.quality.entities_without_events })
  }
  if (metrics.quality.dead_side_missing_archive > 0) {
    priorities.push({ priority: priorities.length + 1, action: 'Add archives for dead-side entities', count: metrics.quality.dead_side_missing_archive })
  }
  if (candidateAging.aging.b_90_plus > 0) {
    priorities.push({ priority: priorities.length + 1, action: 'Reclassify B candidates aged 90+ days', count: candidateAging.aging.b_90_plus })
  }
  if (monitoringHealth.total_errors > 0 || monitoringHealth.degraded_runs > 0) {
    priorities.push({ priority: priorities.length + 1, action: 'Repair monitoring errors or degraded runs', count: monitoringHealth.total_errors + monitoringHealth.degraded_runs })
  }

  return { priorities: priorities.slice(0, 5) }
}

function buildSummary({ monthInfo, metrics, monitoringHealth, candidateAging, qualityDelta, consistency, eventSnapshot, nextPlan, warnings }) {
  const lines = [
    `# HEI Monthly Review - ${monthInfo.month}`,
    '',
    '## Registry snapshot',
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
    '## Candidate backlog',
    `- Unique candidates seen: ${candidateAging.unique_candidates_seen}`,
    `- New in month: ${candidateAging.new_candidates_in_month}`,
    `- Unresolved: ${candidateAging.unresolved_candidates}`,
    `- A candidates aged 60+ days: ${candidateAging.aging.a_60_plus}`,
    `- B candidates aged 90+ days: ${candidateAging.aging.b_90_plus}`,
    '',
    '## Quality',
    `- Entities without events: ${metrics.quality.entities_without_events}`,
    `- Entities without evidence: ${metrics.quality.entities_without_evidence}`,
    `- Dead-side missing archive: ${metrics.quality.dead_side_missing_archive}`,
    `- URL status unknown/missing: ${metrics.quality.url_status_unknown_or_missing}`,
    `- Consistency status: ${consistency.status}`,
    '',
    '## Events dated in month',
    `- Total: ${eventSnapshot.total}`,
    '',
    '## Previous-month comparison',
    qualityDelta.available ? `- Compared with ${qualityDelta.previous_month}` : `- Unavailable: ${qualityDelta.reason}`,
    '',
    '## Next-month priorities',
  ]

  if (nextPlan.priorities.length === 0) lines.push('- No automatic priority generated.')
  for (const item of nextPlan.priorities) lines.push(`${item.priority}. ${item.action}: ${item.count}`)

  lines.push('', '## Warnings')
  if (warnings.length === 0) lines.push('- None.')
  else warnings.forEach((warning) => lines.push(`- ${warning}`))
  lines.push('')
  return lines.join('\n')
}

function buildNextPlanMarkdown(monthInfo, nextPlan) {
  const lines = [`# HEI Next-Month Plan - after ${monthInfo.month}`, '']
  if (nextPlan.priorities.length === 0) lines.push('- No automatic priority generated.')
  for (const item of nextPlan.priorities) lines.push(`${item.priority}. ${item.action} (${item.count})`)
  lines.push('')
  return lines.join('\n')
}

export async function buildMonthlyReview({ root, month, inputRoots, outputRoot, canonicalData }) {
  const monthInfo = parseReviewMonth(month)
  const normalizedRoots = [...new Set((inputRoots?.length ? inputRoots : [root]).map((value) => path.resolve(value)))]
  const { runs, warnings: monitoringWarnings } = await collectMonitoringRuns(normalizedRoots, monthInfo)
  const candidateHistory = await collectCandidateHistory(normalizedRoots, monthInfo)
  const monitoringHealth = buildMonitoringHealth(runs, monthInfo)
  const candidateAging = buildCandidateAging(candidateHistory.occurrences, candidateHistory.resolutions, monthInfo)
  const metrics = buildCanonicalMetrics(canonicalData, monthInfo)
  const previousMetricsPath = path.join(outputRoot, monthInfo.previousMonth, 'metrics.json')
  const previousMetrics = await readJson(previousMetricsPath, null)
  const qualityDelta = buildQualityDelta(metrics, previousMetrics, monthInfo.previousMonth)
  const consistency = await buildConsistencyCheck(root, metrics)
  const eventSnapshot = buildEventSnapshot(canonicalData.events, monthInfo)
  const nextPlan = buildNextMonthPlan(metrics, candidateAging, monitoringHealth)
  const warnings = [...monitoringWarnings, ...candidateHistory.warnings]

  const manifest = {
    schema_version: 1,
    review_month: monthInfo.month,
    generated_at: new Date().toISOString(),
    input_roots: normalizedRoots,
    output_directory: path.join(outputRoot, monthInfo.month),
    monitoring_runs: runs.map((run) => run.runId),
    warnings,
    canonical_data_changed: false,
  }

  return {
    monthInfo,
    outputDir: path.join(outputRoot, monthInfo.month),
    files: {
      'manifest.json': manifest,
      'metrics.json': metrics,
      'monitoring-health.json': monitoringHealth,
      'candidate-aging.json': candidateAging,
      'quality-delta.json': qualityDelta,
      'consistency-check.json': consistency,
      'event-snapshot.json': eventSnapshot,
      'summary.md': buildSummary({ monthInfo, metrics, monitoringHealth, candidateAging, qualityDelta, consistency, eventSnapshot, nextPlan, warnings }),
      'next-month-plan.md': buildNextPlanMarkdown(monthInfo, nextPlan),
    },
  }
}

export async function writeMonthlyReview(review) {
  await fs.mkdir(review.outputDir, { recursive: true })
  for (const [fileName, value] of Object.entries(review.files)) {
    const content = typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`
    await fs.writeFile(path.join(review.outputDir, fileName), content, 'utf8')
  }
}
