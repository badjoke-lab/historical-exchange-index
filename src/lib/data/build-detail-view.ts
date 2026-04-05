import type { EntityRecord } from '../types/entity'
import type { EventRecord } from '../types/event'
import type { EvidenceRecord } from '../types/evidence'
import { loadEntities } from './load-entities'
import { loadEvents } from './load-events'
import { loadEvidence } from './load-evidence'

export interface DetailView {
  entity: EntityRecord
  events: EventRecord[]
  evidence: EvidenceRecord[]
}

export function buildDetailView(slug: string): DetailView | null {
  const entities = loadEntities()
  const entity = entities.find((item) => item.slug === slug)

  if (!entity) return null

  const events = loadEvents()
    .filter((item) => item.exchange_id === entity.id)
    .sort((a, b) => {
      const aDate = a.event_date ?? ''
      const bDate = b.event_date ?? ''
      if (aDate !== bDate) return aDate.localeCompare(bDate)
      return a.sort_order - b.sort_order
    })

  const evidence = loadEvidence().filter((item) => item.exchange_id === entity.id)

  return {
    entity,
    events,
    evidence,
  }
}
