import type { EntityRecord } from '../types/entity'
import type { EventRecord, ImpactLevel } from '../types/event'
import type { EvidenceRecord } from '../types/evidence'
import type { CompareColumn, CompareMajorEvent, CompareView } from '../types/compare'
import { loadEntities } from '../data/load-entities'
import { loadEvents } from '../data/load-events'
import { loadEvidence } from '../data/load-evidence'

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
