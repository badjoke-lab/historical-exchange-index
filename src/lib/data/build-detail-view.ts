import type { EntityRecord } from '../types/entity'
import type { EventRecord } from '../types/event'
import type { EvidenceRecord } from '../types/evidence'
import { loadEntities } from './load-entities'
import { loadEvents } from './load-events'
import { loadEvidence } from './load-evidence'

const DEAD_SIDE = new Set(['dead', 'merged', 'acquired', 'rebranded'])
const ACTIVE_SIDE = new Set(['active', 'limited', 'inactive'])

export interface DetailView {
  entity: EntityRecord
  events: EventRecord[]
  evidence: EvidenceRecord[]
  relatedEntities: EntityRecord[]
  isDeadSide: boolean
  prefersArchive: boolean
}

function relatedScore(base: EntityRecord, candidate: EntityRecord): number {
  let score = 0

  if (base.type === candidate.type) score += 3
  if (base.status === candidate.status) score += 2
  if (
    base.country_or_origin &&
    candidate.country_or_origin &&
    base.country_or_origin === candidate.country_or_origin
  ) {
    score += 1
  }

  if (DEAD_SIDE.has(base.status) && DEAD_SIDE.has(candidate.status)) score += 1
  if (ACTIVE_SIDE.has(base.status) && ACTIVE_SIDE.has(candidate.status)) score += 1

  return score
}

function buildRelatedEntities(all: EntityRecord[], entity: EntityRecord): EntityRecord[] {
  return all
    .filter((item) => item.id !== entity.id)
    .map((item) => ({ item, score: relatedScore(entity, item) }))
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score
      return a.item.canonical_name.localeCompare(b.item.canonical_name)
    })
    .slice(0, 4)
    .map(({ item }) => item)
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
  const relatedEntities = buildRelatedEntities(entities, entity)

  const isDeadSide = DEAD_SIDE.has(entity.status)
  const prefersArchive =
    isDeadSide &&
    !!entity.archived_url &&
    (entity.official_url_status === 'dead_domain' ||
      entity.official_url_status === 'redirected' ||
      entity.official_url_status === 'repurposed' ||
      entity.official_url_status === 'unsafe')

  return {
    entity,
    events,
    evidence,
    relatedEntities,
    isDeadSide,
    prefersArchive,
  }
}
