import type { UrlStatus } from '../types/entity'

export const URL_STATUS_LABELS: Record<UrlStatus, string> = {
  live_verified: 'Live verified',
  live_unverified: 'Live unverified',
  dead_domain: 'Dead domain',
  redirected: 'Redirected',
  repurposed: 'Repurposed',
  unsafe: 'Unsafe',
  unknown: 'Unknown',
}
