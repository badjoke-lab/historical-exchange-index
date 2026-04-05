import type { ExchangeStatus } from '../types/entity'

export const STATUS_LABELS: Record<ExchangeStatus, string> = {
  active: 'Active',
  limited: 'Limited',
  inactive: 'Inactive',
  dead: 'Dead',
  merged: 'Merged',
  acquired: 'Acquired',
  rebranded: 'Rebranded',
  unknown: 'Unknown',
}
