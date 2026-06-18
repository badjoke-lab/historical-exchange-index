import { loadEntities } from './load-entities'
import { loadEvents } from './load-events'
import { loadEvidence } from './load-evidence'

export function buildRegistrySnapshot() {
  const entities = loadEntities()
  const events = loadEvents()
  const evidence = loadEvidence()
  const deadSide = entities.filter((entity) => ['dead', 'merged', 'acquired', 'rebranded'].includes(entity.status)).length
  const activeSide = entities.filter((entity) => ['active', 'limited', 'inactive'].includes(entity.status)).length

  return {
    entities,
    events,
    evidence,
    total: entities.length,
    deadSide,
    activeSide,
  }
}
