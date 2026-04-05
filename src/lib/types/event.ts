import type { Confidence, ExchangeStatus } from './entity'

export type EventType =
  | 'launched'
  | 'rebranded'
  | 'acquired'
  | 'merged'
  | 'hack'
  | 'exploit'
  | 'withdrawal_suspended'
  | 'deposit_suspended'
  | 'trading_halted'
  | 'service_outage'
  | 'regulatory_action'
  | 'lawsuit'
  | 'bankruptcy_filed'
  | 'insolvency_declared'
  | 'shutdown_announced'
  | 'shutdown_effective'
  | 'reopened'
  | 'token_migration'
  | 'chain_shutdown_impact'
  | 'other'

export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical'
export type EventStatusEffect = 'none' | ExchangeStatus

export interface EventRecord {
  id: string
  exchange_id: string
  event_type: EventType
  event_date: string | null
  title: string
  description: string
  confidence: Confidence
  impact_level: ImpactLevel
  event_status_effect: EventStatusEffect
  source_count: number
  sort_order: number
  notes: string
}
