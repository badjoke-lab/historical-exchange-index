const DEAD_SIDE_STATUSES = new Set(['dead', 'merged', 'acquired', 'rebranded'])
const ACTIVE_SIDE_STATUSES = new Set(['active', 'limited', 'inactive'])

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
    previous_month: `${previous.getUTCFullYear()}-${pad(previous.getUTCMonth() + 1)}`,
  }
}

export function previousUtcMonth(now = new Date()) {
  const previous = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))
  return `${previous.getUTCFullYear()}-${pad(previous.getUTCMonth() + 1)}`
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

export function buildRegistryMetrics(canonicalData, monthInfo) {
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
      dead_side_archive_percent: percentage(deadSide.filter((entity) => entity.archived_url).length, deadSide.length),
      high_confidence_percent: percentage(entities.filter((entity) => entity.confidence === 'high').length, entities.length),
      origin_known_percent: percentage(entities.filter((entity) => entity.country_or_origin).length, entities.length),
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
  const monitors = {}
  let successfulRuns = 0
  let degradedRuns = 0
  let totalFindings = 0
  let totalWatchItems = 0
  let totalErrors = 0

  for (const run of runs) {
    let degraded = false
    for (const monitor of run.monitors || []) {
      const name = monitor.name || 'unknown'
      monitors[name] ||= { runs: 0, ok: 0, degraded: 0, findings: 0, watch_items: 0, errors: 0 }
      const target = monitors[name]
      const errors = Number(monitor.errors_count || 0)
      const watchItems = Number(monitor.candidate_count || 0)
      target.runs += 1
      target.findings += Number(monitor.findings_count || 0)
      target.watch_items += watchItems
      target.errors += errors
      totalFindings += Number(monitor.findings_count || 0)
      totalWatchItems += watchItems
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
    total_watch_items: totalWatchItems,
    total_errors: totalErrors,
    monitors,
    runs: runs.map((run) => ({
      run_id: run.run_id || null,
      started_at: run.started_at || null,
      finished_at: run.finished_at || null,
      mode: run.mode || null,
    })),
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

export function buildPreviousMonthDelta(metrics, previousMetrics, previousMonth) {
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
    return typeof date === 'string' && date.startsWith(monthInfo.month)
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

export function buildCountConsistency(metrics, publicVersion, publicManifest) {
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

export function buildNextMonthPriorities(metrics, monitoringHealth) {
  const priorities = []
  const add = (action, count) => priorities.push({ priority: priorities.length + 1, action, count })

  if (metrics.quality.entities_without_events > 0) {
    add('Repair entities without events', metrics.quality.entities_without_events)
  }
  if (metrics.quality.dead_side_missing_archive > 0) {
    add('Add archives for dead-side entities', metrics.quality.dead_side_missing_archive)
  }
  if (metrics.quality.entities_without_evidence > 0) {
    add('Add evidence for entities without sources', metrics.quality.entities_without_evidence)
  }
  if (monitoringHealth.total_errors > 0 || monitoringHealth.degraded_runs > 0) {
    add('Repair monitoring errors or degraded runs', monitoringHealth.total_errors + monitoringHealth.degraded_runs)
  }

  return { priorities: priorities.slice(0, 5) }
}

export function buildMonthlyRegistryReview({
  month,
  canonicalData,
  monitoringManifests = [],
  previousMetrics = null,
  publicVersion = null,
  publicManifest = null,
}) {
  const monthInfo = parseReviewMonth(month)
  const metrics = buildRegistryMetrics(canonicalData, monthInfo)
  const monitoringHealth = buildMonitoringHealth(monitoringManifests, monthInfo)
  const previousMonthDelta = buildPreviousMonthDelta(metrics, previousMetrics, monthInfo.previous_month)
  const consistency = buildCountConsistency(metrics, publicVersion, publicManifest)
  const eventSnapshot = buildEventSnapshot(canonicalData.events, monthInfo)
  const nextMonthPriorities = buildNextMonthPriorities(metrics, monitoringHealth)

  return {
    monthInfo,
    metrics,
    monitoringHealth,
    previousMonthDelta,
    consistency,
    eventSnapshot,
    nextMonthPriorities,
  }
}
