import type { DeathReason } from '../types/entity'

export const DEATH_REASON_LABELS: Record<Exclude<DeathReason, null>, string> = {
  hack: 'Hack',
  insolvency: 'Insolvency',
  regulation: 'Regulation',
  scam_rug: 'Scam / Rug',
  merger: 'Merger',
  acquisition: 'Acquisition',
  rebrand: 'Rebrand',
  voluntary_shutdown: 'Voluntary shutdown',
  chain_failure: 'Chain failure',
  unknown: 'Unknown',
}
