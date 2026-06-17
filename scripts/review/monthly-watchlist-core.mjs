const CLOSED_RESOLUTIONS = new Set([
  'promoted_to_canonical',
  'matched_existing',
  'existing',
  'duplicate',
  'out_of_scope',
  'out_of_scope_or_duplicate',
  'rejected',
  'not_a_distinct_entity',
])

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
    if (child && typeof child === 'object') {
      collectResolutionEntries(child, localDate, output)
    }
  }
  return output
}

function effectiveEndDate(resolution, monthInfo) {
  const resolutionTime = Date.parse(resolution?.created_at)
  if (Number.isFinite(resolutionTime) && resolutionTime <= monthInfo.end.getTime()) {
    return resolutionTime
  }
  return monthInfo.end.getTime()
}

export function buildWatchlistBacklog(watchlists, resolutionDocuments, monthInfo) {
  const history = new Map()
  const latestResolutionByKey = new Map()

  for (const document of resolutionDocuments || []) {
    for (const resolution of collectResolutionEntries(document)) {
      const key = normalizeKey(resolution.canonical_name)
      if (!key) continue
      const current = latestResolutionByKey.get(key)
      if (!current || String(resolution.created_at || '') > String(current.created_at || '')) {
        latestResolutionByKey.set(key, resolution)
      }
    }
  }

  for (const watchlist of watchlists || []) {
    const seenAt = watchlist.created_at || watchlist.generated_at || monthInfo.end_iso
    const seenTime = Date.parse(seenAt)
    if (Number.isFinite(seenTime) && seenTime > monthInfo.end.getTime()) continue

    for (const candidate of watchlist.candidates || []) {
      const displayName = candidate.canonical_name || candidate.headline || candidate.candidate_id
      const key = normalizeKey(displayName)
      if (!key) continue

      const current = history.get(key)
      if (!current) {
        history.set(key, {
          key,
          canonical_name: displayName,
          first_seen_at: seenAt,
          last_seen_at: seenAt,
          latest: candidate,
          occurrences: 1,
        })
        continue
      }

      if (String(seenAt) < String(current.first_seen_at)) current.first_seen_at = seenAt
      if (String(seenAt) >= String(current.last_seen_at)) {
        current.last_seen_at = seenAt
        current.latest = candidate
      }
      current.occurrences += 1
    }
  }

  const items = [...history.values()].map((item) => {
    const resolution = latestResolutionByKey.get(item.key) || null
    const closed = Boolean(resolution && CLOSED_RESOLUTIONS.has(resolution.resolution))
    const firstSeenTime = Date.parse(item.first_seen_at)
    const endTime = effectiveEndDate(closed ? resolution : null, monthInfo)
    const daysOpen = Number.isFinite(firstSeenTime)
      ? Math.max(0, Math.floor((endTime - firstSeenTime) / 86_400_000))
      : 0

    return {
      canonical_name: item.canonical_name,
      candidate_class: item.latest.candidate_class || 'unknown',
      first_seen_at: item.first_seen_at,
      last_seen_at: item.last_seen_at,
      days_open: daysOpen,
      occurrences: item.occurrences,
      closed,
      resolution: resolution?.resolution || null,
      resolution_created_at: resolution?.created_at || null,
      entity_id: resolution?.entity_id || null,
      next_action: item.latest.next_action || null,
      source_category: item.latest.source_category || null,
    }
  }).sort((a, b) => b.days_open - a.days_open || a.canonical_name.localeCompare(b.canonical_name))

  const openItems = items.filter((item) => !item.closed)
  const newInMonth = items.filter((item) => String(item.first_seen_at || '').startsWith(monthInfo.month))

  const aging = {
    a_0_29: openItems.filter((item) => item.candidate_class === 'A' && item.days_open < 30).length,
    a_30_59: openItems.filter((item) => item.candidate_class === 'A' && item.days_open >= 30 && item.days_open < 60).length,
    a_60_plus: openItems.filter((item) => item.candidate_class === 'A' && item.days_open >= 60).length,
    b_0_59: openItems.filter((item) => item.candidate_class === 'B' && item.days_open < 60).length,
    b_60_89: openItems.filter((item) => item.candidate_class === 'B' && item.days_open >= 60 && item.days_open < 90).length,
    b_90_plus: openItems.filter((item) => item.candidate_class === 'B' && item.days_open >= 90).length,
  }

  return {
    month: monthInfo.month,
    unique_candidates_seen: items.length,
    new_candidates_in_month: newInMonth.length,
    resolved_candidates: items.length - openItems.length,
    unresolved_candidates: openItems.length,
    by_class: countBy(items, (item) => item.candidate_class),
    unresolved_by_class: countBy(openItems, (item) => item.candidate_class),
    aging,
    overdue: openItems.filter((item) =>
      (item.candidate_class === 'A' && item.days_open >= 30)
      || (item.candidate_class === 'B' && item.days_open >= 90),
    ),
    items,
  }
}
