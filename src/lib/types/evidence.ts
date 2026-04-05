import type { Confidence } from './entity'

export type SourceType =
  | 'official_statement'
  | 'official_blog'
  | 'official_social'
  | 'archive_capture'
  | 'news_article'
  | 'court_document'
  | 'regulatory_notice'
  | 'database_reference'
  | 'community_reference'
  | 'other'

export type Reliability = Confidence

export type ClaimScope =
  | 'entity'
  | 'event'
  | 'status'
  | 'death_reason'
  | 'launch_date'
  | 'death_date'
  | 'url_history'
  | 'ownership'

export interface EvidenceRecord {
  id: string
  exchange_id: string
  event_id: string | null
  source_type: SourceType
  title: string
  url: string
  publisher: string
  published_at: string | null
  archived_url: string | null
  accessed_at: string | null
  reliability: Reliability
  claim_scope: ClaimScope
  notes: string
}
