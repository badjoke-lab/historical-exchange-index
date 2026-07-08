import type { EntityRecord } from '../types/entity'
import type { EventRecord } from '../types/event'
import type { EvidenceRecord } from '../types/evidence'

export type CompareMajorEvent = Pick<
  EventRecord,
  'id' | 'event_type' | 'event_date' | 'title' | 'impact_level' | 'sort_order'
>

export type CompareEntityContext = {
  event_count: number
  evidence_count: number
  selected_major_events: CompareMajorEvent[]
}

export type CompareContextMap = Record<string, CompareEntityContext>

type MajorEventCapable = EventRecord & {
  is_major_event?: boolean
}

const IMPACT_PRIORITY: Record<EventRecord['impact_level'], number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

function isMajorEventCandidate(event: MajorEventCapable): boolean {
  return event.is_major_event === true
    || event.impact_level === 'critical'
    || event.impact_level === 'high'
}

function compareSelectionPriority(a: MajorEventCapable, b: MajorEventCapable): number {
  const explicitMajor = Number(b.is_major_event === true) - Number(a.is_major_event === true)
  if (explicitMajor !== 0) return explicitMajor

  const impact = IMPACT_PRIORITY[a.impact_level] - IMPACT_PRIORITY[b.impact_level]
  if (impact !== 0) return impact

  const aKnown = Boolean(a.event_date)
  const bKnown = Boolean(b.event_date)
  if (aKnown !== bKnown) return aKnown ? -1 : 1

  if (a.event_date !== b.event_date) {
    return (b.event_date ?? '').localeCompare(a.event_date ?? '')
  }

  if (a.sort_order !== b.sort_order) return b.sort_order - a.sort_order
  return a.id.localeCompare(b.id)
}

function compareDisplayOrder(a: EventRecord, b: EventRecord): number {
  const aKnown = Boolean(a.event_date)
  const bKnown = Boolean(b.event_date)
  if (aKnown !== bKnown) return aKnown ? -1 : 1

  if (a.event_date !== b.event_date) {
    return (a.event_date ?? '').localeCompare(b.event_date ?? '')
  }

  if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order
  return a.id.localeCompare(b.id)
}

export function selectCompareMajorEvents(events: EventRecord[], limit = 5): CompareMajorEvent[] {
  return events
    .filter((event) => isMajorEventCandidate(event))
    .sort(compareSelectionPriority)
    .slice(0, limit)
    .sort(compareDisplayOrder)
    .map((event) => ({
      id: event.id,
      event_type: event.event_type,
      event_date: event.event_date,
      title: event.title,
      impact_level: event.impact_level,
      sort_order: event.sort_order,
    }))
}

export function buildCompareContext(
  entities: EntityRecord[],
  events: EventRecord[],
  evidence: EvidenceRecord[],
): CompareContextMap {
  const eventsByEntity = new Map<string, EventRecord[]>()
  const evidenceCountByEntity = new Map<string, number>()

  for (const event of events) {
    const current = eventsByEntity.get(event.exchange_id) ?? []
    current.push(event)
    eventsByEntity.set(event.exchange_id, current)
  }

  for (const source of evidence) {
    evidenceCountByEntity.set(
      source.exchange_id,
      (evidenceCountByEntity.get(source.exchange_id) ?? 0) + 1,
    )
  }

  return Object.fromEntries(entities.map((entity) => {
    const entityEvents = eventsByEntity.get(entity.id) ?? []
    return [entity.slug, {
      event_count: entityEvents.length,
      evidence_count: evidenceCountByEntity.get(entity.id) ?? 0,
      selected_major_events: selectCompareMajorEvents(entityEvents),
    }]
  }))
}
