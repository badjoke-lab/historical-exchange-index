export type ExchangeType = 'cex' | 'dex' | 'hybrid'
export type ExchangeStatus =
  | 'active'
  | 'limited'
  | 'inactive'
  | 'dead'
  | 'merged'
  | 'acquired'
  | 'rebranded'
  | 'unknown'

export type DeathReason =
  | 'hack'
  | 'insolvency'
  | 'regulation'
  | 'scam_rug'
  | 'merger'
  | 'acquisition'
  | 'rebrand'
  | 'voluntary_shutdown'
  | 'chain_failure'
  | 'unknown'
  | null

export type UrlStatus =
  | 'live_verified'
  | 'live_unverified'
  | 'dead_domain'
  | 'redirected'
  | 'repurposed'
  | 'unsafe'
  | 'unknown'

export type Confidence = 'high' | 'medium' | 'low'

export interface EntityRecord {
  id: string
  slug: string
  canonical_name: string
  aliases: string[]
  type: ExchangeType
  status: ExchangeStatus
  death_reason: DeathReason
  launch_date: string | null
  death_date: string | null
  country_or_origin: string | null
  summary: string
  official_url_original: string | null
  official_domain_original: string | null
  official_url_status: UrlStatus
  archived_url: string | null
  confidence: Confidence
  last_verified_at: string
  notes: string
}
