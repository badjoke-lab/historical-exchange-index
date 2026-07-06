import { buildStatsView } from '../stats/build-stats'
import type { StatsBreakdownItem, StatsMetricItem } from '../types/stats'

export interface QualityDefinition {
  term: string
  definition: string
  denominator: string
}

export interface QualitySummary {
  generatedAt: string
  totals: {
    entities: number
    events: number
    evidence: number
  }
  headline: StatsMetricItem[]
  entityConfidence: StatsBreakdownItem[]
  evidenceReliability: StatsBreakdownItem[]
  evidenceDepth: StatsBreakdownItem[]
  sourceTypes: StatsBreakdownItem[]
  claimScopes: StatsBreakdownItem[]
  freshness: StatsBreakdownItem[]
  coverage: StatsMetricItem[]
  unknownFields: StatsMetricItem[]
  completeness: StatsMetricItem[]
  definitions: QualityDefinition[]
}

function combineEvidenceDepth(
  active: StatsBreakdownItem[],
  dead: StatsBreakdownItem[],
  totalEntities: number,
): StatsBreakdownItem[] {
  const order = ['zero', 'one', 'two_to_four', 'five_plus']
  const labels = new Map([...active, ...dead].map((item) => [item.key, item.label]))
  const counts = new Map<string, number>()

  for (const item of [...active, ...dead]) {
    counts.set(item.key, (counts.get(item.key) ?? 0) + item.count)
  }

  return order.map((key) => {
    const count = counts.get(key) ?? 0
    return {
      key,
      label: labels.get(key) ?? key,
      count,
      share: totalEntities > 0 ? Math.round((count / totalEntities) * 100) : 0,
    }
  })
}

function metricByKey(items: StatsMetricItem[], key: string): StatsMetricItem | undefined {
  return items.find((item) => item.key === key)
}

export function buildQualitySummary(): QualitySummary {
  const { snapshot } = buildStatsView()
  const evidenceAverage = metricByKey(snapshot.evidence.averages, 'evidence_per_entity')
  const archivedEvidence = metricByKey(snapshot.evidence.averages, 'archived_evidence_share')
  const zeroEvidence = metricByKey(snapshot.completeness, 'zero_evidence')
  const highReliability = snapshot.evidence.reliability_breakdown.find((item) => item.key === 'high')

  return {
    generatedAt: snapshot.generated_at,
    totals: {
      entities: snapshot.totals.total_entities,
      events: snapshot.totals.total_events,
      evidence: snapshot.totals.total_evidence,
    },
    headline: [
      {
        key: 'archive_coverage',
        label: 'Entity archive coverage',
        value: `${snapshot.totals.archive_coverage}%`,
        note: 'entities with an archived URL',
      },
      {
        key: 'high_confidence_share',
        label: 'High-confidence entities',
        value: `${snapshot.totals.high_confidence_share}%`,
        note: 'share of all reviewed entities',
      },
      {
        key: 'average_evidence',
        label: 'Average evidence per entity',
        value: evidenceAverage?.value ?? 0,
        note: 'total evidence records divided by entities',
      },
      {
        key: 'high_reliability_evidence',
        label: 'High-reliability evidence',
        value: `${highReliability?.share ?? 0}%`,
        note: `${highReliability?.count ?? 0} of ${snapshot.totals.total_evidence} evidence records`,
      },
      {
        key: 'archived_evidence_share',
        label: 'Archived evidence share',
        value: `${archivedEvidence?.value ?? 0}%`,
        note: archivedEvidence?.note,
      },
      {
        key: 'zero_evidence_entities',
        label: 'Entities with 0 evidence',
        value: zeroEvidence?.value ?? 0,
        note: zeroEvidence?.note,
      },
    ],
    entityConfidence: snapshot.quality.confidence_breakdown,
    evidenceReliability: snapshot.evidence.reliability_breakdown,
    evidenceDepth: combineEvidenceDepth(
      snapshot.active_analysis.evidence_depth,
      snapshot.dead_analysis.evidence_depth,
      snapshot.totals.total_entities,
    ),
    sourceTypes: snapshot.evidence.source_type_breakdown,
    claimScopes: snapshot.evidence.claim_scope_breakdown,
    freshness: snapshot.quality.last_verified_recency,
    coverage: [...snapshot.coverage.archive, ...snapshot.coverage.date_known],
    unknownFields: snapshot.quality.unknown_field_rates,
    completeness: snapshot.completeness,
    definitions: [
      {
        term: 'Entity confidence',
        definition: 'The reviewed confidence classification stored on each exchange entity record.',
        denominator: 'All reviewed public entities.',
      },
      {
        term: 'Evidence reliability',
        definition: 'The reviewed reliability classification stored on each evidence record.',
        denominator: 'All reviewed public evidence records.',
      },
      {
        term: 'Evidence depth',
        definition: 'How many evidence records are associated with each exchange entity.',
        denominator: 'All reviewed public entities.',
      },
      {
        term: 'Archive coverage',
        definition: 'Whether an entity record includes an archived URL reference. It does not measure the completeness of every historical page.',
        denominator: 'The entity population named in each metric note.',
      },
      {
        term: 'Record freshness',
        definition: 'Elapsed time since the entity last_verified_at date, grouped into review-recency bands.',
        denominator: 'All reviewed public entities.',
      },
      {
        term: 'Unknown-field rates',
        definition: 'Visible missing values in selected public entity fields. Unknown values are not automatically treated as errors.',
        denominator: 'All entities or dead-side entities, as stated in each metric note.',
      },
    ],
  }
}
