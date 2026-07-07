import type { Confidence, DeathReason, ExchangeStatus, ExchangeType, UrlStatus } from './entity'
import type { EventType, ImpactLevel } from './event'

export interface CompareSelectionState {
  selectedSlugs: string[]
  invalidSlugs: string[]
  duplicateSlugs: string[]
  omittedValidSlugs: string[]
}

export interface CompareMajorEvent {
  id: string
  eventType: EventType
  eventDate: string | null
  title: string
  impactLevel: ImpactLevel
}

export interface CompareColumn {
  id: string
  slug: string
  canonicalName: string
  type: ExchangeType
  status: ExchangeStatus
  deathReason: DeathReason
  countryOrOrigin: string | null
  launchDate: string | null
  terminalDate: string | null
  lifespanDays: number | null
  officialUrlStatus: UrlStatus
  archiveAvailable: boolean
  confidence: Confidence
  lastVerifiedAt: string
  eventCount: number
  evidenceCount: number
  majorEvents: CompareMajorEvent[]
  dossierHref: string
}

export interface CompareView {
  columns: CompareColumn[]
}
