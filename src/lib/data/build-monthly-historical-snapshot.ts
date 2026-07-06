import { loadEntities } from './load-entities'
import { loadEvents } from './load-events'
import { loadEvidence } from './load-evidence'
import type { EntityRecord } from '../types/entity'
import type { EventRecord, EventType, ImpactLevel } from '../types/event'
import { incidentEventTypeLabel } from './build-incident-timeline'

const PUBLIC_MONTHLY_EVENT_TYPES = new Set<EventType>([
  'rebranded',
  'acquired',
  'merged',
  'hack',
  'exploit',
  'withdrawal_suspended',
  'deposit_suspended',
  'trading_halted',
  'service_outage',
  'regulatory_action',
  'lawsuit',
  'bankruptcy_filed',
  'insolvency_declared',
  'shutdown_announced',
  'shutdown_effective',
  'reopened',
  'token_migration',
  'chain_shutdown_impact',
])

export interface MonthlySnapshotItem {
  event: EventRecord
  entity: EntityRecord
  evidenceCount: number
}

export interface MonthlySnapshotBreakdownItem {
  key: string
  label: string
  count: number
}

export interface MonthlyHistoricalSnapshot {
  month: string
  monthLabel: string
  periodStart: string
  periodEnd: string
  generatedAt: string
  registryState: {
    entities: number
    events: number
    evidence: number
  }
  summary: {
    events: number
    affectedExchanges: number
    criticalOrHighEvents: number
    eventLinkedEvidence: number
  }
  byEventType: MonthlySnapshotBreakdownItem[]
  byImpact: MonthlySnapshotBreakdownItem[]
  items: MonthlySnapshotItem[]
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export function previousCompletedUtcMonth(now = new Date()): string {
  const previous = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))
  return `${previous.getUTCFullYear()}-${pad(previous.getUTCMonth() + 1)}`
}

function monthBounds(month: string): { start: string; end: string; label: string } {
  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw new Error(`invalid monthly snapshot month: ${month}`)
  }

  const [year, monthNumber] = month.split('-').map(Number)
  if (monthNumber < 1 || monthNumber > 12) {
    throw new Error(`invalid monthly snapshot month: ${month}`)
  }

  const start = new Date(Date.UTC(year, monthNumber - 1, 1))
  const end = new Date(Date.UTC(year, monthNumber, 0))
  const label = new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(start)

  return {
    start: `${month}-01`,
    end: `${end.getUTCFullYear()}-${pad(end.getUTCMonth() + 1)}-${pad(end.getUTCDate())}`,
    label,
  }
}

function buildCountBreakdown(
  items: MonthlySnapshotItem[],
  keyFor: (item: MonthlySnapshotItem) => string,
  labelFor: (key: string) => string,
): MonthlySnapshotBreakdownItem[] {
  const counts = new Map<string, number>()
  for (const item of items) {
    const key = keyFor(item)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([key, count]) => ({ key, label: labelFor(key), count }))
}

export function buildMonthlyHistoricalSnapshot(
  month = previousCompletedUtcMonth(),
): MonthlyHistoricalSnapshot {
  const entities = loadEntities()
  const events = loadEvents()
  const evidence = loadEvidence()
  const bounds = monthBounds(month)
  const entityById = new Map(entities.map((entity) => [entity.id, entity]))
  const evidenceCountByEventId = new Map<string, number>()

  for (const source of evidence) {
    if (!source.event_id) continue
    evidenceCountByEventId.set(source.event_id, (evidenceCountByEventId.get(source.event_id) ?? 0) + 1)
  }

  const items = events
    .filter((event) => Boolean(event.event_date?.startsWith(month)) && PUBLIC_MONTHLY_EVENT_TYPES.has(event.event_type))
    .map((event) => {
      const entity = entityById.get(event.exchange_id)
      if (!entity) {
        throw new Error(`monthly snapshot event references missing exchange: ${event.id}:${event.exchange_id}`)
      }
      return {
        event,
        entity,
        evidenceCount: evidenceCountByEventId.get(event.id) ?? 0,
      }
    })
    .sort((a, b) => {
      const dateOrder = (a.event.event_date ?? '').localeCompare(b.event.event_date ?? '')
      if (dateOrder !== 0) return dateOrder
      const entityOrder = a.entity.canonical_name.localeCompare(b.entity.canonical_name)
      if (entityOrder !== 0) return entityOrder
      return a.event.id.localeCompare(b.event.id)
    })

  const impactLabels: Record<ImpactLevel, string> = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  }

  return {
    month,
    monthLabel: bounds.label,
    periodStart: bounds.start,
    periodEnd: bounds.end,
    generatedAt: new Date().toISOString(),
    registryState: {
      entities: entities.length,
      events: events.length,
      evidence: evidence.length,
    },
    summary: {
      events: items.length,
      affectedExchanges: new Set(items.map((item) => item.entity.id)).size,
      criticalOrHighEvents: items.filter((item) => item.event.impact_level === 'critical' || item.event.impact_level === 'high').length,
      eventLinkedEvidence: items.reduce((total, item) => total + item.evidenceCount, 0),
    },
    byEventType: buildCountBreakdown(
      items,
      (item) => item.event.event_type,
      (key) => incidentEventTypeLabel(key as EventType),
    ),
    byImpact: buildCountBreakdown(
      items,
      (item) => item.event.impact_level,
      (key) => impactLabels[key as ImpactLevel],
    ),
    items,
  }
}
