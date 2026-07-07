import type { EventRecord, ImpactLevel } from '../types/event'
import type { CompareMajorEvent } from '../types/compare'

const DAY_MS = 86_400_000
const IMPACT_RANK: Record<ImpactLevel, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

function parseFullUtcDate(value: string | null): number | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null

  const [year, month, day] = value.split('-').map(Number)
  const timestamp = Date.UTC(year, month - 1, day)
  const parsed = new Date(timestamp)

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null
  }

  return timestamp
}

export function deriveLifespanDays(
  launchDate: string | null,
  terminalDate: string | null,
): number | null {
  const launch = parseFullUtcDate(launchDate)
  const terminal = parseFullUtcDate(terminalDate)

  if (launch === null || terminal === null || terminal < launch) return null
  return Math.floor((terminal - launch) / DAY_MS)
}

function compareMajorEvents(a: EventRecord, b: EventRecord): number {
  const impactDifference = IMPACT_RANK[b.impact_level] - IMPACT_RANK[a.impact_level]
  if (impactDifference !== 0) return impactDifference

  if (a.event_date !== b.event_date) {
    if (a.event_date === null) return 1
    if (b.event_date === null) return -1
    return b.event_date.localeCompare(a.event_date)
  }

  if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order
  return a.id.localeCompare(b.id)
}

export function selectMajorEvents(events: readonly EventRecord[]): CompareMajorEvent[] {
  return [...events]
    .sort(compareMajorEvents)
    .slice(0, 3)
    .map((event) => ({
      id: event.id,
      eventType: event.event_type,
      eventDate: event.event_date,
      title: event.title,
      impactLevel: event.impact_level,
    }))
}
