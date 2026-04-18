import { loadEntities } from '../data/load-entities'
import { loadEvents } from '../data/load-events'
import { loadEvidence } from '../data/load-evidence'
import type { EvidenceRecord, ClaimScope, Reliability, SourceType } from '../types/evidence'
import type { EventRecord, EventStatusEffect, EventType, ImpactLevel } from '../types/event'
import type { EntityRecord, ExchangeStatus, ExchangeType, UrlStatus } from '../types/entity'
import type {
  StatsBreakdownItem,
  StatsHistory,
  StatsMetricItem,
  StatsOriginStatusRow,
  StatsOriginTypeRow,
  StatsSnapshot,
  StatsYearCount,
} from '../types/stats'
import { DEATH_REASON_LABELS } from '../utils/death-reason-meta'
import { STATUS_LABELS } from '../utils/status-meta'
import { URL_STATUS_LABELS } from '../utils/url-meta'

const DEAD_SIDE_STATUSES: ExchangeStatus[] = ['dead', 'merged', 'acquired', 'rebranded']
const ACTIVE_SIDE_STATUSES: ExchangeStatus[] = ['active', 'limited', 'inactive']
const STATUS_ORDER: ExchangeStatus[] = [
  'active',
  'limited',
  'inactive',
  'dead',
  'merged',
  'acquired',
  'rebranded',
  'unknown',
]
const TYPE_ORDER: ExchangeType[] = ['cex', 'dex', 'hybrid']
const URL_STATUS_ORDER: UrlStatus[] = [
  'live_verified',
  'live_unverified',
  'redirected',
  'repurposed',
  'dead_domain',
  'unsafe',
  'unknown',
]
const EVENT_TYPE_ORDER: EventType[] = [
  'launched',
  'rebranded',
  'acquired',
  'merged',
  'hack',
  'exploit',
  'withdrawal_suspended',
  'deposit_suspended',
  'trading_halted',
  'service_outage',
  'regulatory_action',
  'lawsuit',
  'bankruptcy_filed',
  'insolvency_declared',
  'shutdown_announced',
  'shutdown_effective',
  'reopened',
  'token_migration',
  'chain_shutdown_impact',
  'other',
]
const IMPACT_LEVEL_ORDER: ImpactLevel[] = ['critical', 'high', 'medium', 'low']
const EVENT_STATUS_EFFECT_ORDER: EventStatusEffect[] = [
  'dead',
  'inactive',
  'limited',
  'active',
  'none',
]
const SOURCE_TYPE_ORDER: SourceType[] = [
  'official_statement',
  'official_blog',
  'official_social',
  'archive_capture',
  'news_article',
  'court_document',
  'regulatory_notice',
  'database_reference',
  'community_reference',
  'other',
]
const RELIABILITY_ORDER: Reliability[] = ['high', 'medium', 'low']
const CLAIM_SCOPE_ORDER: ClaimScope[] = [
  'entity',
  'event',
  'status',
  'death_reason',
  'launch_date',
  'death_date',
  'url_history',
  'ownership',
]

const TYPE_LABELS: Record<ExchangeType, string> = {
  cex: 'CEX',
  dex: 'DEX',
  hybrid: 'Hybrid',
}

const IMPACT_LABELS: Record<ImpactLevel, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

const STATUS_EFFECT_LABELS: Record<EventStatusEffect, string> = {
  dead: 'Dead',
  inactive: 'Inactive',
  limited: 'Limited',
  active: 'Active',
  none: 'No change',
  acquired: 'Acquired',
  merged: 'Merged',
  rebranded: 'Rebranded',
  unknown: 'Unknown',
}

const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  official_statement: 'Official statement',
  official_blog: 'Official blog',
  official_social: 'Official social',
  archive_capture: 'Archive capture',
  news_article: 'News article',
  court_document: 'Court document',
  regulatory_notice: 'Regulatory notice',
  database_reference: 'Database reference',
  community_reference: 'Community reference',
  other: 'Other',
}

const CLAIM_SCOPE_LABELS: Record<ClaimScope, string> = {
  entity: 'Entity',
  event: 'Event',
  status: 'Status',
  death_reason: 'Death reason',
  launch_date: 'Launch date',
  death_date: 'Death date',
  url_history: 'URL history',
  ownership: 'Ownership',
}

const EVIDENCE_DEPTH_LABELS = {
  zero: '0 sources',
  one: '1 source',
  two_to_four: '2–4 sources',
  five_plus: '5+ sources',
} as const

const AGE_BAND_LABELS = {
  zero_to_two: '0–2 years',
  three_to_five: '3–5 years',
  six_to_nine: '6–9 years',
  ten_plus: '10+ years',
  unknown: 'Unknown',
} as const

const RECENCY_LABELS = {
  last_30: '0–30 days',
  last_90: '31–90 days',
  last_180: '91–180 days',
  last_365: '181–365 days',
  older: '366+ days',
} as const

const DEAD_SIDE_SET = new Set<ExchangeStatus>(DEAD_SIDE_STATUSES)
const ACTIVE_SIDE_SET = new Set<ExchangeStatus>(ACTIVE_SIDE_STATUSES)

type EvidenceDepthKey = keyof typeof EVIDENCE_DEPTH_LABELS
type AgeBandKey = keyof typeof AGE_BAND_LABELS
type RecencyKey = keyof typeof RECENCY_LABELS

function percent(count: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((count / total) * 100)
}

function average(total: number, count: number): number {
  if (count <= 0) return 0
  return Math.round((total / count) * 10) / 10
}

function addCount<T extends string | number>(map: Map<T, number>, key: T, amount = 1) {
  map.set(key, (map.get(key) ?? 0) + amount)
}

function sumCounts<T extends string | number>(map: Map<T, number>): number {
  return Array.from(map.values()).reduce((sum, value) => sum + value, 0)
}

function toYear(value: string | null | undefined): number | null {
  if (!value) return null
  const match = value.match(/(\d{4})/)
  return match ? Number(match[1]) : null
}

function buildYearCounts(values: Array<number | null | undefined>): StatsYearCount[] {
  const counts = new Map<number, number>()

  values.forEach((value) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      addCount(counts, value)
    }
  })

  return Array.from(counts.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([year, count]) => ({ year, count }))
}

function humanizeKey(value: string): string {
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function buildBreakdown<T extends string>(
  counts: Map<T, number>,
  order: readonly T[],
  labelFor: (key: T) => string,
  includeZero = false,
): StatsBreakdownItem[] {
  const total = sumCounts(counts)

  return order
    .map((key) => {
      const count = counts.get(key) ?? 0
      return {
        key,
        label: labelFor(key),
        count,
        share: percent(count, total),
      }
    })
    .filter((item) => includeZero || item.count > 0)
}

function buildDynamicBreakdown<T extends string>(counts: Map<T, number>, labelFor: (key: T) => string): StatsBreakdownItem[] {
  const total = sumCounts(counts)

  return Array.from(counts.entries())
    .sort((a, b) => {
      if (a[1] !== b[1]) return b[1] - a[1]
      return String(a[0]).localeCompare(String(b[0]))
    })
    .map(([key, count]) => ({
      key,
      label: labelFor(key),
      count,
      share: percent(count, total),
    }))
}

function buildMetric(key: string, label: string, value: number | string, note?: string): StatsMetricItem {
  return { key, label, value, note }
}

function buildCountsByExchangeId<T extends { exchange_id: string }>(records: T[]): Map<string, number> {
  const counts = new Map<string, number>()
  records.forEach((record) => addCount(counts, record.exchange_id))
  return counts
}

function evidenceDepthKey(count: number): EvidenceDepthKey {
  if (count <= 0) return 'zero'
  if (count === 1) return 'one'
  if (count <= 4) return 'two_to_four'
  return 'five_plus'
}

function buildEvidenceDepthBreakdown(entities: EntityRecord[], evidenceCounts: Map<string, number>): StatsBreakdownItem[] {
  const counts = new Map<EvidenceDepthKey, number>()

  entities.forEach((entity) => {
    addCount(counts, evidenceDepthKey(evidenceCounts.get(entity.id) ?? 0))
  })

  return buildBreakdown(
    counts,
    ['zero', 'one', 'two_to_four', 'five_plus'],
    (key) => EVIDENCE_DEPTH_LABELS[key],
  )
}

function buildAgeBandBreakdown(entities: EntityRecord[]): StatsBreakdownItem[] {
  const counts = new Map<AgeBandKey, number>()
  const currentYear = new Date().getUTCFullYear()

  entities.forEach((entity) => {
    const launchYear = toYear(entity.launch_date)

    if (!launchYear) {
      addCount(counts, 'unknown')
      return
    }

    const age = Math.max(0, currentYear - launchYear)

    if (age <= 2) addCount(counts, 'zero_to_two')
    else if (age <= 5) addCount(counts, 'three_to_five')
    else if (age <= 9) addCount(counts, 'six_to_nine')
    else addCount(counts, 'ten_plus')
  })

  return buildBreakdown(
    counts,
    ['zero_to_two', 'three_to_five', 'six_to_nine', 'ten_plus', 'unknown'],
    (key) => AGE_BAND_LABELS[key],
  )
}

function buildLastVerifiedRecencyBreakdown(entities: EntityRecord[]): StatsBreakdownItem[] {
  const counts = new Map<RecencyKey, number>()
  const now = Date.now()

  entities.forEach((entity) => {
    const parsed = Date.parse(entity.last_verified_at)
    if (Number.isNaN(parsed)) {
      addCount(counts, 'older')
      return
    }

    const days = Math.floor((now - parsed) / (1000 * 60 * 60 * 24))

    if (days <= 30) addCount(counts, 'last_30')
    else if (days <= 90) addCount(counts, 'last_90')
    else if (days <= 180) addCount(counts, 'last_180')
    else if (days <= 365) addCount(counts, 'last_365')
    else addCount(counts, 'older')
  })

  return buildBreakdown(
    counts,
    ['last_30', 'last_90', 'last_180', 'last_365', 'older'],
    (key) => RECENCY_LABELS[key],
  )
}

function buildLifespanAverage(entities: EntityRecord[]): number {
  let totalYears = 0
  let measured = 0

  entities.forEach((entity) => {
    const launchYear = toYear(entity.launch_date)
    const deathYear = toYear(entity.death_date)

    if (!launchYear || !deathYear || deathYear < launchYear) return

    totalYears += deathYear - launchYear
    measured += 1
  })

  return average(totalYears, measured)
}

function classifyOrigin(value: string | null | undefined): { kind: 'strict' | 'bucket'; key: string; label: string } {
  const raw = value?.trim()

  if (!raw) {
    return { kind: 'bucket', key: 'unknown', label: 'Unknown' }
  }

  const lower = raw.toLowerCase()

  if (lower === 'global') {
    return { kind: 'bucket', key: 'global', label: 'Global' }
  }

  if (lower.includes('ecosystem')) {
    return { kind: 'bucket', key: 'ecosystem', label: raw }
  }

  if (lower.includes('region')) {
    return { kind: 'bucket', key: 'region_level', label: 'Region-level' }
  }

  return { kind: 'strict', key: raw, label: raw }
}

function buildCountryOriginSection(entities: EntityRecord[]) {
  const strictCountryCounts = new Map<string, number>()
  const originBucketCounts = new Map<string, number>()
  const statusRows = new Map<string, StatsOriginStatusRow>()
  const typeRows = new Map<string, StatsOriginTypeRow>()

  entities.forEach((entity) => {
    const origin = classifyOrigin(entity.country_or_origin)

    if (origin.kind === 'strict') {
      addCount(strictCountryCounts, origin.key)
    } else {
      addCount(originBucketCounts, origin.key)
    }

    const statusRow = statusRows.get(origin.key) ?? {
      key: origin.key,
      label: origin.label,
      total: 0,
      deadSide: 0,
      activeSide: 0,
    }
    statusRow.total += 1
    if (DEAD_SIDE_SET.has(entity.status)) statusRow.deadSide += 1
    if (ACTIVE_SIDE_SET.has(entity.status)) statusRow.activeSide += 1
    statusRows.set(origin.key, statusRow)

    const typeRow = typeRows.get(origin.key) ?? {
      key: origin.key,
      label: origin.label,
      total: 0,
      cex: 0,
      dex: 0,
      hybrid: 0,
    }
    typeRow.total += 1
    typeRow[entity.type] += 1
    typeRows.set(origin.key, typeRow)
  })

  const strictCountries = buildDynamicBreakdown(strictCountryCounts, (key) => key)
  const originBuckets = buildDynamicBreakdown(originBucketCounts, (key) => {
    const row = Array.from(statusRows.values()).find((item) => item.key === key)
    return row?.label ?? key
  })

  const statusRowItems = Array.from(statusRows.values()).sort((a, b) => {
    if (a.total !== b.total) return b.total - a.total
    return a.label.localeCompare(b.label)
  })

  const typeRowItems = Array.from(typeRows.values()).sort((a, b) => {
    if (a.total !== b.total) return b.total - a.total
    return a.label.localeCompare(b.label)
  })

  const knownOrigins = entities.filter((entity) => Boolean(entity.country_or_origin?.trim())).length
  const strictCountryEntities = entities.filter((entity) => classifyOrigin(entity.country_or_origin).kind === 'strict').length
  const bucketEntities = entities.filter((entity) => classifyOrigin(entity.country_or_origin).kind === 'bucket').length

  return {
    strict_countries: strictCountries,
    origin_buckets: originBuckets,
    status_rows: statusRowItems,
    type_rows: typeRowItems,
    completeness: [
      buildMetric('known_origin', 'Origin present', knownOrigins, `${percent(knownOrigins, entities.length)}% of entities`),
      buildMetric('strict_country', 'Strict-country entries', strictCountryEntities, `${percent(strictCountryEntities, entities.length)}% of entities`),
      buildMetric('bucketed_origin', 'Bucketed origin entries', bucketEntities, `${percent(bucketEntities, entities.length)}% of entities`),
      buildMetric(
        'missing_origin',
        'Missing origin',
        entities.length - knownOrigins,
        `${percent(entities.length - knownOrigins, entities.length)}% of entities`,
      ),
    ],
  }
}

function buildAveragesMetrics(
  totalRecords: number,
  totalRelatedRecords: number,
  deadSideRelated: number,
  activeSideRelated: number,
): StatsMetricItem[] {
  return [
    buildMetric('avg_per_entity', 'Average per entity', average(totalRelatedRecords, totalRecords)),
    buildMetric('avg_per_dead_side', 'Average per dead-side entity', average(deadSideRelated, totalRecords || 0)),
    buildMetric('avg_per_active_side', 'Average per active-side entity', average(activeSideRelated, totalRecords || 0)),
  ]
}

export function buildStatsSnapshotFromRecords(
  entities: EntityRecord[],
  events: EventRecord[],
  evidence: EvidenceRecord[],
): StatsSnapshot {
  const generatedAt = new Date().toISOString()
  const deadEntities = entities.filter((entity) => DEAD_SIDE_SET.has(entity.status))
  const activeEntities = entities.filter((entity) => ACTIVE_SIDE_SET.has(entity.status))

  const evidenceCounts = buildCountsByExchangeId(evidence)
  const eventCounts = buildCountsByExchangeId(events)

  const statusCounts = new Map<ExchangeStatus, number>()
  entities.forEach((entity) => addCount(statusCounts, entity.status))

  const typeCounts = new Map<ExchangeType, number>()
  entities.forEach((entity) => addCount(typeCounts, entity.type))

  const deadReasonCounts = new Map<Exclude<EntityRecord['death_reason'], null>, number>()
  deadEntities.forEach((entity) => {
    addCount(deadReasonCounts, entity.death_reason ?? 'unknown')
  })

  const activeStatusCounts = new Map<ExchangeStatus, number>()
  activeEntities.forEach((entity) => addCount(activeStatusCounts, entity.status))

  const activeUrlCounts = new Map<UrlStatus, number>()
  activeEntities.forEach((entity) => addCount(activeUrlCounts, entity.official_url_status))

  const activeTypeCounts = new Map<ExchangeType, number>()
  activeEntities.forEach((entity) => addCount(activeTypeCounts, entity.type))

  const activeConfidenceCounts = new Map<EntityRecord['confidence'], number>()
  activeEntities.forEach((entity) => addCount(activeConfidenceCounts, entity.confidence))

  const deadStatusCounts = new Map<ExchangeStatus, number>()
  deadEntities.forEach((entity) => addCount(deadStatusCounts, entity.status))

  const confidenceCounts = new Map<EntityRecord['confidence'], number>()
  entities.forEach((entity) => addCount(confidenceCounts, entity.confidence))

  const urlStatusCounts = new Map<UrlStatus, number>()
  entities.forEach((entity) => addCount(urlStatusCounts, entity.official_url_status))

  const eventTypeCounts = new Map<EventType, number>()
  events.forEach((event) => addCount(eventTypeCounts, event.event_type))

  const impactCounts = new Map<ImpactLevel, number>()
  events.forEach((event) => addCount(impactCounts, event.impact_level))

  const statusEffectCounts = new Map<EventStatusEffect, number>()
  events.forEach((event) => addCount(statusEffectCounts, event.event_status_effect))

  const sourceTypeCounts = new Map<SourceType, number>()
  evidence.forEach((item) => addCount(sourceTypeCounts, item.source_type))

  const reliabilityCounts = new Map<Reliability, number>()
  evidence.forEach((item) => addCount(reliabilityCounts, item.reliability))

  const claimScopeCounts = new Map<ClaimScope, number>()
  evidence.forEach((item) => addCount(claimScopeCounts, item.claim_scope))

  const archiveCoverage = percent(
    entities.filter((entity) => Boolean(entity.archived_url)).length,
    entities.length,
  )
  const highConfidenceShare = percent(
    entities.filter((entity) => entity.confidence === 'high').length,
    entities.length,
  )
  const countryOriginKnownShare = percent(
    entities.filter((entity) => Boolean(entity.country_or_origin?.trim())).length,
    entities.length,
  )

  const countryOriginSection = buildCountryOriginSection(entities)

  return {
    generated_at: generatedAt,
    totals: {
      total_entities: entities.length,
      dead_side_total: deadEntities.length,
      active_side_total: activeEntities.length,
      total_events: events.length,
      total_evidence: evidence.length,
      archive_coverage: archiveCoverage,
      high_confidence_share: highConfidenceShare,
      country_origin_known_share: countryOriginKnownShare,
    },
    by_status: buildBreakdown(statusCounts, STATUS_ORDER, (key) => STATUS_LABELS[key], true),
    by_type: buildBreakdown(typeCounts, TYPE_ORDER, (key) => TYPE_LABELS[key], true),
    dead_reason: buildBreakdown(
      deadReasonCounts,
      ['hack', 'insolvency', 'regulation', 'scam_rug', 'merger', 'acquisition', 'rebrand', 'voluntary_shutdown', 'chain_failure', 'unknown'],
      (key) => DEATH_REASON_LABELS[key],
    ),
    active_analysis: {
      status_breakdown: buildBreakdown(activeStatusCounts, ACTIVE_SIDE_STATUSES, (key) => STATUS_LABELS[key]),
      url_status_breakdown: buildBreakdown(activeUrlCounts, URL_STATUS_ORDER, (key) => URL_STATUS_LABELS[key]),
      launch_year_histogram: buildYearCounts(activeEntities.map((entity) => toYear(entity.launch_date))),
      age_bands: buildAgeBandBreakdown(activeEntities),
      type_breakdown: buildBreakdown(activeTypeCounts, TYPE_ORDER, (key) => TYPE_LABELS[key]),
      confidence_breakdown: buildBreakdown(activeConfidenceCounts, ['high', 'medium', 'low'], (key) => humanizeKey(key)),
      evidence_depth: buildEvidenceDepthBreakdown(activeEntities, evidenceCounts),
      last_verified_recency: buildLastVerifiedRecencyBreakdown(activeEntities),
    },
    dead_analysis: {
      status_breakdown: buildBreakdown(deadStatusCounts, DEAD_SIDE_STATUSES, (key) => STATUS_LABELS[key]),
      death_reason_breakdown: buildBreakdown(
        deadReasonCounts,
        ['hack', 'insolvency', 'regulation', 'scam_rug', 'merger', 'acquisition', 'rebrand', 'voluntary_shutdown', 'chain_failure', 'unknown'],
        (key) => DEATH_REASON_LABELS[key],
      ),
      death_year_histogram: buildYearCounts(deadEntities.map((entity) => toYear(entity.death_date))),
      evidence_depth: buildEvidenceDepthBreakdown(deadEntities, evidenceCounts),
      archive_coverage: percent(
        deadEntities.filter((entity) => Boolean(entity.archived_url)).length,
        deadEntities.length,
      ),
      average_lifespan_years: buildLifespanAverage(deadEntities),
    },
    quality: {
      confidence_breakdown: buildBreakdown(confidenceCounts, ['high', 'medium', 'low'], (key) => humanizeKey(key), true),
      unknown_field_rates: [
        buildMetric(
          'missing_launch_date',
          'Missing launch date',
          entities.filter((entity) => !entity.launch_date).length,
          `${percent(entities.filter((entity) => !entity.launch_date).length, entities.length)}% of entities`,
        ),
        buildMetric(
          'missing_death_date_dead_side',
          'Dead-side missing death date',
          deadEntities.filter((entity) => !entity.death_date).length,
          `${percent(deadEntities.filter((entity) => !entity.death_date).length, deadEntities.length)}% of dead-side`,
        ),
        buildMetric(
          'missing_origin',
          'Missing origin',
          entities.filter((entity) => !entity.country_or_origin).length,
          `${percent(entities.filter((entity) => !entity.country_or_origin).length, entities.length)}% of entities`,
        ),
        buildMetric(
          'missing_domain',
          'Missing original domain',
          entities.filter((entity) => !entity.official_domain_original).length,
          `${percent(entities.filter((entity) => !entity.official_domain_original).length, entities.length)}% of entities`,
        ),
      ],
      last_verified_recency: buildLastVerifiedRecencyBreakdown(entities),
    },
    coverage: {
      archive: [
        buildMetric(
          'archive_overall',
          'Archive coverage',
          archiveCoverage,
          `${entities.filter((entity) => Boolean(entity.archived_url)).length} / ${entities.length} entities`,
        ),
        buildMetric(
          'archive_dead_side',
          'Dead-side archive coverage',
          percent(deadEntities.filter((entity) => Boolean(entity.archived_url)).length, deadEntities.length),
          `${deadEntities.filter((entity) => Boolean(entity.archived_url)).length} / ${deadEntities.length} dead-side`,
        ),
        buildMetric(
          'archive_active_side',
          'Active-side archive coverage',
          percent(activeEntities.filter((entity) => Boolean(entity.archived_url)).length, activeEntities.length),
          `${activeEntities.filter((entity) => Boolean(entity.archived_url)).length} / ${activeEntities.length} active-side`,
        ),
        buildMetric(
          'high_confidence',
          'High-confidence share',
          highConfidenceShare,
          `${entities.filter((entity) => entity.confidence === 'high').length} / ${entities.length} entities`,
        ),
      ],
      url_status_breakdown: buildBreakdown(urlStatusCounts, URL_STATUS_ORDER, (key) => URL_STATUS_LABELS[key], true),
      date_known: [
        buildMetric(
          'launch_date_known',
          'Launch date known',
          percent(entities.filter((entity) => Boolean(entity.launch_date)).length, entities.length),
          `${entities.filter((entity) => Boolean(entity.launch_date)).length} / ${entities.length} entities`,
        ),
        buildMetric(
          'death_date_known_dead_side',
          'Death date known',
          percent(deadEntities.filter((entity) => Boolean(entity.death_date)).length, deadEntities.length),
          `${deadEntities.filter((entity) => Boolean(entity.death_date)).length} / ${deadEntities.length} dead-side`,
        ),
        buildMetric(
          'origin_known',
          'Origin known',
          countryOriginKnownShare,
          `${entities.filter((entity) => Boolean(entity.country_or_origin?.trim())).length} / ${entities.length} entities`,
        ),
        buildMetric(
          'domain_known',
          'Original domain known',
          percent(entities.filter((entity) => Boolean(entity.official_domain_original)).length, entities.length),
          `${entities.filter((entity) => Boolean(entity.official_domain_original)).length} / ${entities.length} entities`,
        ),
      ],
    },
    country_origin: countryOriginSection,
    events: {
      event_type_breakdown: buildBreakdown(eventTypeCounts, EVENT_TYPE_ORDER, (key) => humanizeKey(key)),
      impact_level_breakdown: buildBreakdown(impactCounts, IMPACT_LEVEL_ORDER, (key) => IMPACT_LABELS[key]),
      status_effect_breakdown: buildBreakdown(statusEffectCounts, EVENT_STATUS_EFFECT_ORDER, (key) => STATUS_EFFECT_LABELS[key]),
      averages: [
        buildMetric('events_per_entity', 'Average events per entity', average(events.length, entities.length)),
        buildMetric('events_per_dead_side', 'Average events per dead-side entity', average(deadEntities.reduce((sum, entity) => sum + (eventCounts.get(entity.id) ?? 0), 0), deadEntities.length)),
        buildMetric('events_per_active_side', 'Average events per active-side entity', average(activeEntities.reduce((sum, entity) => sum + (eventCounts.get(entity.id) ?? 0), 0), activeEntities.length)),
      ],
    },
    evidence: {
      source_type_breakdown: buildBreakdown(sourceTypeCounts, SOURCE_TYPE_ORDER, (key) => SOURCE_TYPE_LABELS[key]),
      reliability_breakdown: buildBreakdown(reliabilityCounts, RELIABILITY_ORDER, (key) => humanizeKey(key), true),
      claim_scope_breakdown: buildBreakdown(claimScopeCounts, CLAIM_SCOPE_ORDER, (key) => CLAIM_SCOPE_LABELS[key]),
      averages: [
        buildMetric('evidence_per_entity', 'Average evidence per entity', average(evidence.length, entities.length)),
        buildMetric('evidence_per_dead_side', 'Average evidence per dead-side entity', average(deadEntities.reduce((sum, entity) => sum + (evidenceCounts.get(entity.id) ?? 0), 0), deadEntities.length)),
        buildMetric('evidence_per_active_side', 'Average evidence per active-side entity', average(activeEntities.reduce((sum, entity) => sum + (evidenceCounts.get(entity.id) ?? 0), 0), activeEntities.length)),
        buildMetric(
          'archived_evidence_share',
          'Archived evidence share',
          percent(evidence.filter((item) => Boolean(item.archived_url)).length, evidence.length),
          `${evidence.filter((item) => Boolean(item.archived_url)).length} / ${evidence.length} evidence items`,
        ),
      ],
    },
    completeness: [
      buildMetric(
        'aliases_present',
        'Aliases present',
        percent(entities.filter((entity) => entity.aliases.length > 0).length, entities.length),
        `${entities.filter((entity) => entity.aliases.length > 0).length} / ${entities.length} entities`,
      ),
      buildMetric(
        'notes_present',
        'Notes present',
        percent(entities.filter((entity) => Boolean(entity.notes.trim())).length, entities.length),
        `${entities.filter((entity) => Boolean(entity.notes.trim())).length} / ${entities.length} entities`,
      ),
      buildMetric(
        'summary_present',
        'Summary present',
        percent(entities.filter((entity) => Boolean(entity.summary.trim())).length, entities.length),
        `${entities.filter((entity) => Boolean(entity.summary.trim())).length} / ${entities.length} entities`,
      ),
      buildMetric(
        'archived_url_present',
        'Archived URL present',
        percent(entities.filter((entity) => Boolean(entity.archived_url)).length, entities.length),
        `${entities.filter((entity) => Boolean(entity.archived_url)).length} / ${entities.length} entities`,
      ),
      buildMetric(
        'dead_two_plus_evidence',
        'Dead-side with 2+ evidence',
        percent(deadEntities.filter((entity) => (evidenceCounts.get(entity.id) ?? 0) >= 2).length, deadEntities.length),
        `${deadEntities.filter((entity) => (evidenceCounts.get(entity.id) ?? 0) >= 2).length} / ${deadEntities.length} dead-side`,
      ),
      buildMetric(
        'zero_evidence',
        'Entities with 0 evidence',
        entities.filter((entity) => (evidenceCounts.get(entity.id) ?? 0) === 0).length,
        `${percent(entities.filter((entity) => (evidenceCounts.get(entity.id) ?? 0) === 0).length, entities.length)}% of entities`,
      ),
      buildMetric(
        'one_evidence',
        'Entities with 1 evidence',
        entities.filter((entity) => (evidenceCounts.get(entity.id) ?? 0) === 1).length,
        `${percent(entities.filter((entity) => (evidenceCounts.get(entity.id) ?? 0) === 1).length, entities.length)}% of entities`,
      ),
    ],
  }
}

export function buildStatsHistoryFromRecords(
  snapshot: StatsSnapshot,
  entities: EntityRecord[],
): StatsHistory {
  return {
    generated_at: snapshot.generated_at,
    snapshots: [
      {
        date: snapshot.generated_at,
        total_entities: snapshot.totals.total_entities,
        dead_side_total: snapshot.totals.dead_side_total,
        active_side_total: snapshot.totals.active_side_total,
        total_events: snapshot.totals.total_events,
        total_evidence: snapshot.totals.total_evidence,
        archive_coverage: snapshot.totals.archive_coverage,
        high_confidence_share: snapshot.totals.high_confidence_share,
      },
    ],
    launch_year_counts: buildYearCounts(entities.map((entity) => toYear(entity.launch_date))),
    death_year_counts: buildYearCounts(entities.map((entity) => toYear(entity.death_date))),
  }
}

export function buildStatsView(): { snapshot: StatsSnapshot; history: StatsHistory } {
  const entities = loadEntities()
  const events = loadEvents()
  const evidence = loadEvidence()
  const snapshot = buildStatsSnapshotFromRecords(entities, events, evidence)
  const history = buildStatsHistoryFromRecords(snapshot, entities)

  return { snapshot, history }
}
