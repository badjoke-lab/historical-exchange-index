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
  const previous = new Date(Date.UTC(year, monthNumber - 2, 1))

  return {
    month: value,
    start,
    end,
    start_iso: start.toISOString(),
    end_iso: end.toISOString(),
    date_prefix: `${year}-${pad(monthNumber)}`,
    compact_prefix: `${year}${pad(monthNumber)}`,
    previous_month: `${previous.getUTCFullYear()}-${pad(previous.getUTCMonth() + 1)}`,
  }
}

export function previousUtcMonth(now = new Date()) {
  const previous = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))
  return `${previous.getUTCFullYear()}-${pad(previous.getUTCMonth() + 1)}`
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

function countBy(items, getKey) {
  return items.reduce((counts, item) => {
    const key = getKey(item) || 'unknown'
    counts[key] = (counts[key] || 0) + 1
    return counts
  }, {})
}

function percentage(numerator, denominator) {
  if (!denominator) return 0
  return Number(((numerator / denominator) * 100).toFixed(2))
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

function dateInMonth(value, monthInfo) {
  return typeof value === 'string' && value.startsWith(monthInfo.date_prefix)
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

  const deadWithArchive = deadSide.filter((entity) => entity.archived_url).length
  const highConfidence = entities.filter((entity) => entity.confidence === 'high').length
  const originKnown = entities.filter((entity) => entity.country_or_origin).length

  return {
    month: monthInfo.month,
    generated_as_of: monthInfo.end_iso,
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
      dead_side_archive_percent: percentage(deadWithArchive, deadSide.length),
      high_confidence_percent: percentage(highConfidence, entities.length),
      origin_known_percent: percentage(originKnown, entities.length),
    },
  }
}

export function buildMonitoringHealth(manifests, monthInfo) {
  const uniqueRuns = new Map()
  for (const manifest of manifests || []) {
    const runId = manifest.run_id || `${manifest.started_at || ''}:${manifest.created_at || ''}`
    if (!runId) continue
    const current = uniqueRuns.get(runId)
    if (!current || String(manifest.created_at || '') > String(current.created_at || '')) {
      uniqueRuns.set(runId, manifest)
    }
  }

  const runs = [...uniqueRuns.values()].sort((a, b) => String(a.started_at || '').localeCompare(String(b.started_at || '')))
  const monitorTotals = {}
  let successfulRuns = 0
  let degradedRuns = 0
  let totalFindings = 0
  let totalCandidates = 0
  let totalErrors = 0

  for (const run of runs) {
    let degraded = false
    for (const monitor of run.monitors || []) {
      const name = monitor.name || 'unknown'
      monitorTotals[name] ||= { runs: 0, ok: 0, degraded: 0, findings: 0, candidates: 0, errors: 0 }
      const target = monitorTotals[name]
      const errors = Number(monitor.errors_count || 0)
      target.runs += 1
      target.findings += Number(monitor.findings_count || 0)
      target.candidates += Number(monitor.candidate_count || 0)
      target.errors += errors
      totalFindings += Number(monitor.findings_count || 0)
      totalCandidates += Number(monitor.candidate_count || 0)
      totalErrors += errors
      if (monitor.status === 'ok' && errors === 0) target.ok += 1
      else {
        target.degraded += 1
        degraded = true
      }
    }
    if (degraded) degradedRuns += 1
    else successfulRuns += 1
  }

  const expectedRuns = countMondays(monthInfo)
  return {
    month: monthInfo.month,
    expected_scheduled_runs: expectedRuns,
    observed_unique_runs: runs.length,
    successful_runs: successfulRuns,
    degraded_runs: degradedRuns,
    possible_missing_scheduled_runs: Math.max(0, expectedRuns - runs.length),
    total_findings: totalFindings,
    total_candidates: totalCandidates,
    total_errors: totalErrors,
    monitors: monitorTotals,
    runs: runs.map((run) => ({
      run_id: run.run_id || null,
      started_at: run.started_at || null,
      finished_at: run.finished_at || null,
      mode: run.mode || null,
    })),
  }
}

function collectResolutionEntries(value, inheritedDate = null, output = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectResolutionEntries(item, inheritedDate, output)
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
    })
  }

  for (const child of Object.values(value)) {
    if (child && typeof child === 'object') collectResolutionEntries(child, localDate, output)
  }
  return output
}

export function buildCandidateAging(watchlists, resolutionDocuments, monthInfo) {
  const history = new Map()
  const resolutions = new Map()

  for (const document of resolutionDocuments || []) {
    for (const item of collectResolutionEntries(document)) {
      const key = normalizeKey(item.canonical_name)
      if (!key) continue
      const current = resolutions.get(key)
      if (!current || String(item.created_at || '') > String(current.created_at || '')) {
        resolutions.set(key, item)
      }
    }
  }

  for (const watchlist of watchlists || []) {
    const seenAt = watchlist.created_at || watchlist.generated_at || monthInfo.end_iso
    if (Date.parse(seenAt) > monthInfo.end.getTime()) continue
    for (const candidate of watchlist.candidates || []) {
      const key = normalizeKey(candidate.canonical_name || candidate.headline || candidate.candidate_id)
      if (!key) continue
      const current = history.get(key)
      if (!current) {
        history.set(key, {
          key,
          canonical_name: candidate.canonical_name || candidate.headline || key,
          first_seen_at: seenAt,
          last_seen_at: seenAt,
          latest: candidate,
          occurrences: 1,
        })
      } else {
        if (String(seenAt) < String(current.first_seen_at)) current.first_seen_at = seenAt
        if (String(seenAt) >= String(current.last_seen_at)) {
          current.last_seen_at = seenAt
          current.latest = candidate
        }
        current.occurrences += 1
      }
    }
  }

  const items = [...history.values()].map((item) => {
    const resolution = resolutions.get(item.key) || null
    const firstSeen = Date.parse(item.first_seen_at)
    const ageDays = Number.isFinite(firstSeen)
      ? Math.max(0, Math.floor((monthInfo.end.getTime() - firstSeen) / 86_400_000))
      : 0
    return {
      canonical_name: item.canonical_name,
      candidate_class: item.latest.candidate_class || 'unknown',
      first_seen_at: item.first_seen_at,
      last_seen_at: item.last_seen_at,
      age_days: ageDays,
      occurrences: item.occurrences,
      resolved: Boolean(resolution && TERMINAL_RESOLUTIONS.has(resolution.resolution)),
      resolution: resolution?.resolution || null,
      entity_id: resolution?.entity_id || null,
      next_action: item.latest.next_action || null,
      source_category: item.latest.source_category || null,
    }
  }).sort((a, b) => b.age_days - a.age_days || a.canonical_name.localeCompare(b.canonical_name))

  const unresolved = items.filter((item) => !item.resolved)
  return {
    month: monthInfo.month,
    unique_candidates_seen: items.length,
    new_candidates_in_month: items.filter((item) => dateInMonth(item.first_seen_at, monthInfo)).length,
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
    return dateInMonth(date, monthInfo)
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

function sameCounts(actual, expected) {
  return Boolean(actual)
    && actual.primary_records === expected.primary_records
    && actual.events === expected.events
    && actual.evidence === expected.evidence
}

export function buildConsistencyCheck(metrics, publicVersion, publicManifest) {
  const expected = {
    primary_records: metrics.counts.entities,
    events: metrics.counts.events,
    evidence: metrics.counts.evidence,
  }
  const versionCounts = publicVersion?.data?.record_counts || null
  const manifestCounts = publicManifest?.record_counts || null
  const sources = {
    version: {
      available: Boolean(versionCounts),
      counts: versionCounts,
      matches_expected: versionCounts ? sameCounts(versionCounts, expected) : null,
    },
    manifest: {
      available: Boolean(manifestCounts),
      counts: manifestCounts,
      matches_expected: manifestCounts ? sameCounts(manifestCounts, expected) : null,
    },
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
  const add = (action, count) => priorities.push({ priority: priorities.length + 1, action, count })

  if (candidateAging.aging.a_60_plus > 0) add('Resolve A candidates aged 60+ days', candidateAging.aging.a_60_plus)
  if (metrics.quality.entities_without_events > 0) add('Repair entities without events', metrics.quality.entities_without_events)
  if (metrics.quality.dead_side_missing_archive > 0) add('Add archives for dead-side entities', metrics.quality.dead_side_missing_archive)
  if (candidateAging.aging.b_90_plus > 0) add('Reclassify B candidates aged 90+ days', candidateAging.aging.b_90_plus)
  if (monitoringHealth.total_errors > 0 || monitoringHealth.degraded_runs > 0) {
    add('Repair monitoring errors or degraded runs', monitoringHealth.total_errors + monitoringHealth.degraded_runs)
  }

  return { priorities: priorities.slice(0, 5) }
}

function buildSummary(data) {
  const { monthInfo, metrics, monitoringHealth, candidateAging, qualityDelta, consistency, eventSnapshot, nextPlan, warnings } = data
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

function buildPlanMarkdown(monthInfo, nextPlan) {
  const lines = [`# HEI Next-Month Plan - after ${monthInfo.month}`, '']
  if (nextPlan.priorities.length === 0) lines.push('- No automatic priority generated.')
  for (const item of nextPlan.priorities) lines.push(`${item.priority}. ${item.action} (${item.count})`)
  lines.push('')
  return lines.join('\n')
}

export function buildMonthlyReviewData({
  month,
  canonicalData,
  monitoringManifests = [],
  watchlists = [],
  resolutionDocuments = [],
  previousMetrics = null,
  publicVersion = null,
  publicManifest = null,
  warnings = [],
}) {
  const monthInfo = parseReviewMonth(month)
  const metrics = buildCanonicalMetrics(canonicalData, monthInfo)
  const monitoringHealth = buildMonitoringHealth(monitoringManifests, monthInfo)
  const candidateAging = buildCandidateAging(watchlists, resolutionDocuments, monthInfo)
  const qualityDelta = buildQualityDelta(metrics, previousMetrics, monthInfo.previous_month)
  const consistency = buildConsistencyCheck(metrics, publicVersion, publicManifest)
  const eventSnapshot = buildEventSnapshot(canonicalData.events, monthInfo)
  const nextPlan = buildNextMonthPlan(metrics, candidateAging, monitoringHealth)

  const data = {
    monthInfo,
    metrics,
    monitoringHealth,
    candidateAging,
    qualityDelta,
    consistency,
    eventSnapshot,
    nextPlan,
    warnings,
  }

  return {
    manifest: {
      schema_version: 1,
      review_month: monthInfo.month,
      generated_at: new Date().toISOString(),
      monitoring_run_ids: monitoringHealth.runs.map((run) => run.run_id),
      warnings,
      canonical_data_changed: false,
    },
    summary: buildSummary(data),
    metrics,
    monitoringHealth,
    candidateAging,
    qualityDelta,
    consistency,
    eventSnapshot,
    nextPlan,
    nextPlanMarkdown: buildPlanMarkdown(monthInfo, nextPlan),
  }
}
