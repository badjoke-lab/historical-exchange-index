import type { EntityRecord } from '../types/entity'
import type { EventRecord, EventType, ImpactLevel } from '../types/event'
import { loadEntities } from './load-entities'
import { loadEvents } from './load-events'

const INCIDENT_TYPES = new Set<EventType>([
  'rebranded',
  'acquired',
  'merged',
  'hack',
  'exploit',
  'withdrawal_suspended',
  'deposit_suspended',
  'trading_halted',
  'regulatory_action',
  'lawsuit',
  'bankruptcy_filed',
  'insolvency_declared',
  'shutdown_announced',
  'shutdown_effective',
  'reopened',
  'chain_shutdown_impact',
])

const IMPACT_ORDER: Record<ImpactLevel, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

export type IncidentTimelineItem = {
  event: EventRecord
  entity: EntityRecord
}

export type IncidentTimelineView = {
  items: IncidentTimelineItem[]
  affectedEntities: number
  firstDate: string | null
  lastDate: string | null
  typeCounts: Array<{ type: EventType; count: number }>
}

export function buildIncidentTimeline(): IncidentTimelineView {
  const entities = loadEntities()
  const entityById = new Map(entities.map((entity) => [entity.id, entity]))

  const items = loadEvents()
    .filter((event) => Boolean(event.event_date) && INCIDENT_TYPES.has(event.event_type))
    .map((event) => ({ event, entity: entityById.get(event.exchange_id) }))
    .filter((item): item is IncidentTimelineItem => Boolean(item.entity))
    .sort((a, b) => {
      const dateOrder = String(b.event.event_date).localeCompare(String(a.event.event_date))
      if (dateOrder !== 0) return dateOrder
      const impactOrder = IMPACT_ORDER[b.event.impact_level] - IMPACT_ORDER[a.event.impact_level]
      if (impactOrder !== 0) return impactOrder
      return a.event.sort_order - b.event.sort_order
    })

  const dates = items.map((item) => item.event.event_date).filter((value): value is string => Boolean(value)).sort()
  const typeCounter = new Map<EventType, number>()
  for (const item of items) {
    typeCounter.set(item.event.event_type, (typeCounter.get(item.event.event_type) ?? 0) + 1)
  }

  const typeCounts = [...typeCounter.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type))

  return {
    items,
    affectedEntities: new Set(items.map((item) => item.entity.id)).size,
    firstDate: dates.at(0) ?? null,
    lastDate: dates.at(-1) ?? null,
    typeCounts,
  }
}
