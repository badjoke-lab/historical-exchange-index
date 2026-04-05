import type { EntityRecord } from '../types/entity'
import { loadEntities } from './load-entities'

export interface RegistrySummary {
  total: number
  activeSide: number
  deadSide: number
  cex: number
  dex: number
  hybrid: number
}

export function sortRegistryEntities(entities: EntityRecord[]): EntityRecord[] {
  const deadSideStatuses = new Set(['dead', 'merged', 'acquired', 'rebranded'])

  return [...entities].sort((a, b) => {
    const aDeadSide = deadSideStatuses.has(a.status) ? 1 : 0
    const bDeadSide = deadSideStatuses.has(b.status) ? 1 : 0

    if (aDeadSide !== bDeadSide) return bDeadSide - aDeadSide

    if (aDeadSide === 1 && bDeadSide === 1) {
      const aDate = a.death_date ?? ''
      const bDate = b.death_date ?? ''
      if (aDate !== bDate) return aDate < bDate ? 1 : -1
    }

    return a.canonical_name.localeCompare(b.canonical_name)
  })
}

export function buildRegistrySummary(entities: EntityRecord[]): RegistrySummary {
  const deadSideStatuses = new Set(['dead', 'merged', 'acquired', 'rebranded'])
  const activeSideStatuses = new Set(['active', 'limited', 'inactive'])

  return {
    total: entities.length,
    activeSide: entities.filter((item) => activeSideStatuses.has(item.status)).length,
    deadSide: entities.filter((item) => deadSideStatuses.has(item.status)).length,
    cex: entities.filter((item) => item.type === 'cex').length,
    dex: entities.filter((item) => item.type === 'dex').length,
    hybrid: entities.filter((item) => item.type === 'hybrid').length,
  }
}

export function buildRegistryView() {
  const entities = loadEntities()
  return {
    entities: sortRegistryEntities(entities),
    summary: buildRegistrySummary(entities),
  }
}
