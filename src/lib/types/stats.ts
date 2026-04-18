export interface StatsBreakdownItem {
  key: string
  label: string
  count: number
  share: number
}

export interface StatsMetricItem {
  key: string
  label: string
  value: number | string
  note?: string
}

export interface StatsYearCount {
  year: number
  count: number
}

export interface StatsOriginStatusRow {
  key: string
  label: string
  total: number
  deadSide: number
  activeSide: number
}

export interface StatsOriginTypeRow {
  key: string
  label: string
  total: number
  cex: number
  dex: number
  hybrid: number
}

export interface StatsSnapshot {
  generated_at: string
  totals: {
    total_entities: number
    dead_side_total: number
    active_side_total: number
    total_events: number
    total_evidence: number
    archive_coverage: number
    high_confidence_share: number
    country_origin_known_share: number
  }
  by_status: StatsBreakdownItem[]
  by_type: StatsBreakdownItem[]
  dead_reason: StatsBreakdownItem[]
  active_analysis: {
    status_breakdown: StatsBreakdownItem[]
    url_status_breakdown: StatsBreakdownItem[]
    launch_year_histogram: StatsYearCount[]
    age_bands: StatsBreakdownItem[]
    type_breakdown: StatsBreakdownItem[]
    confidence_breakdown: StatsBreakdownItem[]
    evidence_depth: StatsBreakdownItem[]
    last_verified_recency: StatsBreakdownItem[]
  }
  dead_analysis: {
    status_breakdown: StatsBreakdownItem[]
    death_reason_breakdown: StatsBreakdownItem[]
    death_year_histogram: StatsYearCount[]
    evidence_depth: StatsBreakdownItem[]
    archive_coverage: number
    average_lifespan_years: number
  }
  quality: {
    confidence_breakdown: StatsBreakdownItem[]
    unknown_field_rates: StatsMetricItem[]
    last_verified_recency: StatsBreakdownItem[]
  }
  coverage: {
    archive: StatsMetricItem[]
    url_status_breakdown: StatsBreakdownItem[]
    date_known: StatsMetricItem[]
  }
  country_origin: {
    strict_countries: StatsBreakdownItem[]
    origin_buckets: StatsBreakdownItem[]
    status_rows: StatsOriginStatusRow[]
    type_rows: StatsOriginTypeRow[]
    completeness: StatsMetricItem[]
  }
  events: {
    event_type_breakdown: StatsBreakdownItem[]
    impact_level_breakdown: StatsBreakdownItem[]
    status_effect_breakdown: StatsBreakdownItem[]
    averages: StatsMetricItem[]
  }
  evidence: {
    source_type_breakdown: StatsBreakdownItem[]
    reliability_breakdown: StatsBreakdownItem[]
    claim_scope_breakdown: StatsBreakdownItem[]
    averages: StatsMetricItem[]
  }
  completeness: StatsMetricItem[]
}

export interface StatsHistorySnapshot {
  date: string
  total_entities: number
  dead_side_total: number
  active_side_total: number
  total_events: number
  total_evidence: number
  archive_coverage: number
  high_confidence_share: number
}

export interface StatsHistory {
  generated_at: string
  snapshots: StatsHistorySnapshot[]
  launch_year_counts: StatsYearCount[]
  death_year_counts: StatsYearCount[]
}
