import type { EntityRecord } from '../types/entity'
import type { EventRecord, EventType } from '../types/event'
import type { EvidenceRecord } from '../types/evidence'
import { loadEntities } from './load-entities'
import { loadEvents } from './load-events'
import { loadEvidence } from './load-evidence'

const INCIDENT_EVENT_TYPES = new Set<EventType>([
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
  'chain_shutdown_impact',
])

export const INCIDENT_EVENT_TYPE_LABELS: Partial<Record<EventType, string>> = {
  hack: 'Hack',
  exploit: 'Exploit',
  withdrawal_suspended: 'Withdrawals suspended',
  deposit_suspended: 'Deposits suspended',
  trading_halted: 'Trading halted',
  service_outage: 'Service outage',
  regulatory_action: 'Regulatory action',
  lawsuit: 'Lawsuit',
  bankruptcy_filed: 'Bankruptcy filing',
  insolvency_declared: 'Insolvency',
  shutdown_announced: 'Shutdown announced',
  shutdown_effective: 'Shutdown effective',
  chain_shutdown_impact: 'Chain shutdown impact',
}

export interface IncidentTimelineItem {
  event: EventRecord
  entity: EntityRecord
  evidence: EvidenceRecord[]
}

export function isIncidentEvent(event: EventRecord): boolean {
  return event.event_date !== null && INCIDENT_EVENT_TYPES.has(event.event_type)
}

export function incidentEventTypeLabel(eventType: EventType): string {
  return INCIDENT_EVENT_TYPE_LABELS[eventType]
    ?? eventType.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase())
}

export function buildIncidentTimeline(): IncidentTimelineItem[] {
  const entityById = new Map(loadEntities().map((entity) => [entity.id, entity]))
  const evidenceByEventId = new Map<string, EvidenceRecord[]>()

  for (const source of loadEvidence()) {
    if (!source.event_id) continue
    const current = evidenceByEventId.get(source.event_id) ?? []
    current.push(source)
    evidenceByEventId.set(source.event_id, current)
  }

  return loadEvents()
    .filter(isIncidentEvent)
    .map((event) => {
      const entity = entityById.get(event.exchange_id)
      if (!entity) {
        throw new Error(`incident timeline event references missing exchange: ${event.id}:${event.exchange_id}`)
      }

      const evidence = [...(evidenceByEventId.get(event.id) ?? [])].sort((a, b) => {
        const reliabilityOrder = { high: 0, medium: 1, low: 2 } as const
        const reliabilityDiff = reliabilityOrder[a.reliability] - reliabilityOrder[b.reliability]
        if (reliabilityDiff !== 0) return reliabilityDiff
        return a.id.localeCompare(b.id)
      })

      return { event, entity, evidence }
    })
    .sort((a, b) => {
      const dateOrder = (b.event.event_date ?? '').localeCompare(a.event.event_date ?? '')
      if (dateOrder !== 0) return dateOrder
      const sortOrder = b.event.sort_order - a.event.sort_order
      if (sortOrder !== 0) return sortOrder
      return a.event.id.localeCompare(b.event.id)
    })
}
