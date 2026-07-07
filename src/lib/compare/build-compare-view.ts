import type { EntityRecord } from '../types/entity'
import type { EventRecord } from '../types/event'
import type { EvidenceRecord } from '../types/evidence'
import type { CompareColumn, CompareView } from '../types/compare'
import { loadEntities } from '../data/load-entities'
import { loadEvents } from '../data/load-events'
import { loadEvidence } from '../data/load-evidence'
import { deriveLifespanDays, selectMajorEvents } from './compare-core'

function buildColumn(
  entity: EntityRecord,
  events: readonly EventRecord[],
  evidence: readonly EvidenceRecord[],
): CompareColumn {
  const entityEvents = events.filter((event) => event.exchange_id === entity.id)
  const entityEvidence = evidence.filter((source) => source.exchange_id === entity.id)

  return {
    id: entity.id,
    slug: entity.slug,
    canonicalName: entity.canonical_name,
    type: entity.type,
    status: entity.status,
    deathReason: entity.death_reason,
    countryOrOrigin: entity.country_or_origin,
    launchDate: entity.launch_date,
    terminalDate: entity.death_date,
    lifespanDays: deriveLifespanDays(entity.launch_date, entity.death_date),
    officialUrlStatus: entity.official_url_status,
    archiveAvailable: Boolean(entity.archived_url),
    confidence: entity.confidence,
    lastVerifiedAt: entity.last_verified_at,
    eventCount: entityEvents.length,
    evidenceCount: entityEvidence.length,
    majorEvents: selectMajorEvents(entityEvents),
    dossierHref: `/exchange/${entity.slug}/`,
  }
}

export function buildCompareViewFromRecords(
  slugs: readonly string[],
  entities: readonly EntityRecord[],
  events: readonly EventRecord[],
  evidence: readonly EvidenceRecord[],
): CompareView {
  const entityBySlug = new Map(entities.map((entity) => [entity.slug, entity]))
  const seen = new Set<string>()
  const columns: CompareColumn[] = []

  for (const slug of slugs) {
    if (seen.has(slug)) continue
    seen.add(slug)

    const entity = entityBySlug.get(slug)
    if (!entity) continue

    columns.push(buildColumn(entity, events, evidence))
    if (columns.length >= 4) break
  }

  return { columns }
}

export function buildCompareView(slugs: readonly string[]): CompareView {
  return buildCompareViewFromRecords(slugs, loadEntities(), loadEvents(), loadEvidence())
}
