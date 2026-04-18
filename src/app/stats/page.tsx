import Link from 'next/link'
import type { Metadata } from 'next'
import { buildStatsView } from '../../lib/stats/build-stats'
import type {
  StatsBreakdownItem,
  StatsMetricItem,
  StatsOriginStatusRow,
  StatsOriginTypeRow,
  StatsYearCount,
} from '../../lib/types/stats'
import { CONTACT_HREF } from '../../lib/site-constants'
import { formatDate } from '../../lib/utils/format-date'
import styles from './stats.module.css'

export const metadata: Metadata = {
  title: 'Stats',
  description:
    'Snapshot, coverage, and historical distributions across the Historical Exchange Index registry.',
  alternates: {
    canonical: '/stats',
  },
}

function colorForKey(key: string): string {
  switch (key) {
    case 'active':
    case 'live_verified':
    case 'high':
      return 'var(--active)'
    case 'limited':
    case 'live_unverified':
      return 'var(--limited)'
    case 'inactive':
    case 'redirected':
    case 'medium':
      return 'var(--inactive)'
    case 'dead':
    case 'hack':
    case 'insolvency':
    case 'dead_domain':
    case 'unsafe':
    case 'critical':
      return 'var(--dead)'
    case 'merged':
    case 'merger':
      return '#8f8274'
    case 'acquired':
    case 'acquisition':
      return '#7286a6'
    case 'rebranded':
    case 'rebrand':
      return '#8473a1'
    case 'archive_capture':
      return 'var(--archive)'
    case 'low':
    case 'unknown':
    case 'repurposed':
      return 'var(--unknown)'
    default:
      return 'rgba(184, 135, 70, 0.7)'
  }
}

function SummaryTile({ label, value, hint, extraClass }: { label: string; value: string; hint: string; extraClass?: string }) {
  return (
    <div className={`summary-tile ${extraClass ?? ''}`.trim()}>
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      <div className="hint">{hint}</div>
    </div>
  )
}

function BarList({ items, limit = 8, emptyLabel = 'No data yet' }: { items: StatsBreakdownItem[]; limit?: number; emptyLabel?: string }) {
  const limitedItems = items.slice(0, limit)

  if (limitedItems.length === 0) {
    return <p className={styles.note}>{emptyLabel}</p>
  }

  return (
    <div className={styles.barList}>
      {limitedItems.map((item) => (
        <div className={styles.barRow} key={item.key}>
          <div className={styles.barTop}>
            <div className={styles.barLabel}>{item.label}</div>
            <div className={styles.barValue}>
              {item.count} · {item.share}%
            </div>
          </div>
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              style={{
                ['--bar-width' as '--bar-width']: `${Math.max(item.share, item.count > 0 ? 4 : 0)}%`,
                ['--bar-color' as '--bar-color']: colorForKey(item.key),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function YearList({ items, limit = 10, emptyLabel = 'No dated records yet' }: { items: StatsYearCount[]; limit?: number; emptyLabel?: string }) {
  const sorted = [...items].sort((a, b) => b.year - a.year).slice(0, limit)
  const maxCount = sorted.reduce((max, item) => Math.max(max, item.count), 0)

  if (sorted.length === 0) {
    return <p className={styles.note}>{emptyLabel}</p>
  }

  return (
    <div className={styles.barList}>
      {sorted.map((item) => {
        const share = maxCount > 0 ? Math.round((item.count / maxCount) * 100) : 0
        return (
          <div className={styles.barRow} key={item.year}>
            <div className={styles.barTop}>
              <div className={styles.barLabel}>{item.year}</div>
              <div className={styles.barValue}>{item.count}</div>
            </div>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{
                  ['--bar-width' as '--bar-width']: `${Math.max(share, item.count > 0 ? 4 : 0)}%`,
                  ['--bar-color' as '--bar-color']: 'rgba(184, 135, 70, 0.7)',
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function MetricGrid({ items, limit }: { items: StatsMetricItem[]; limit?: number }) {
  const visibleItems = typeof limit === 'number' ? items.slice(0, limit) : items

  return (
    <div className={styles.metricGrid}>
      {visibleItems.map((item) => (
        <div className={styles.metricCard} key={item.key}>
          <div className={styles.metricLabel}>{item.label}</div>
          <div className={styles.metricValue}>{item.value}</div>
          {item.note ? <div className={styles.metricNote}>{item.note}</div> : null}
        </div>
      ))}
    </div>
  )
}

function OriginStatusGrid({ items, limit = 6 }: { items: StatsOriginStatusRow[]; limit?: number }) {
  const visibleItems = items.slice(0, limit)

  if (visibleItems.length === 0) {
    return <p className={styles.note}>No origin rows yet.</p>
  }

  return (
    <div className={styles.originGrid}>
      {visibleItems.map((item) => (
        <div className={styles.metricCard} key={item.key}>
          <div className={styles.metricLabel}>{item.label}</div>
          <div className={styles.metricValue}>{item.total}</div>
          <div className={styles.metricNote}>
            {item.deadSide} dead-side · {item.activeSide} active-side
          </div>
        </div>
      ))}
    </div>
  )
}

function OriginTypeGrid({ items, limit = 6 }: { items: StatsOriginTypeRow[]; limit?: number }) {
  const visibleItems = items.slice(0, limit)

  if (visibleItems.length === 0) {
    return <p className={styles.note}>No type rows yet.</p>
  }

  return (
    <div className={styles.originGrid}>
      {visibleItems.map((item) => (
        <div className={styles.metricCard} key={item.key}>
          <div className={styles.metricLabel}>{item.label}</div>
          <div className={styles.metricValue}>{item.total}</div>
          <div className={styles.metricNote}>
            {item.cex} CEX · {item.dex} DEX · {item.hybrid} Hybrid
          </div>
        </div>
      ))}
    </div>
  )
}

export default function StatsPage() {
  const { snapshot, history } = buildStatsView()
  const hasSnapshotHistory = history.snapshots.length > 1

  return (
    <main className={styles.page}>
      <section className={`panel ${styles.headerPanel}`}>
        <div className={styles.headerTop}>
          <div className={styles.headerCopy}>
            <p className={styles.kicker}>Stats</p>
            <h2 className={styles.title}>Registry snapshot, coverage, and historical distributions</h2>
            <p className={styles.description}>
              Snapshot counts, active-side and dead-side analysis, archive coverage, confidence, and
              distribution views across the canonical HEI registry.
            </p>
          </div>

          <div className={styles.headerActions}>
            <Link className="btn" href="/methodology">Methodology</Link>
            <a className="btn btn-primary" href={CONTACT_HREF} target="_blank" rel="noreferrer">
              Submit correction
            </a>
          </div>
        </div>

        <div className={styles.headerMeta}>
          <span>Last updated {formatDate(snapshot.generated_at)}</span>
          <span>Snapshot / trend / coverage</span>
          <span>Entity-level view only</span>
          <span>Deployment split deferred</span>
        </div>
      </section>

      <section className="panel summary-strip">
        <SummaryTile label="Total entities" value={String(snapshot.totals.total_entities)} hint="entity-level registry count" />
        <SummaryTile label="Dead-side" value={String(snapshot.totals.dead_side_total)} hint="dead · merged · acquired · rebranded" />
        <SummaryTile label="Active-side" value={String(snapshot.totals.active_side_total)} hint="active · limited · inactive" />
        <SummaryTile label="Total events" value={String(snapshot.totals.total_events)} hint="timeline records in canonical data" />
        <SummaryTile label="Total evidence" value={String(snapshot.totals.total_evidence)} hint="supporting evidence records" />
        <SummaryTile label="Archive coverage" value={`${snapshot.totals.archive_coverage}%`} hint="entities with archived URLs" />
        <SummaryTile label="High confidence" value={`${snapshot.totals.high_confidence_share}%`} hint="entities marked high confidence" />
        <SummaryTile label="Origin known" value={`${snapshot.totals.country_origin_known_share}%`} hint="entities with country / origin data" />
      </section>

      <section className={styles.grid}>
        <section className={`panel ${styles.sectionPanel}`}>
          <div className={styles.panelHead}>
            <h3>Status breakdown</h3>
            <p>Whole-registry distribution across active-side, dead-side, and uncertain end states.</p>
          </div>
          <BarList items={snapshot.by_status} limit={8} />
        </section>

        <section className={`panel ${styles.sectionPanel}`}>
          <div className={styles.panelHead}>
            <h3>Type breakdown</h3>
            <p>Entity mix across centralized, decentralized, and hybrid exchange records.</p>
          </div>
          <BarList items={snapshot.by_type} limit={3} />
        </section>
      </section>

      <section className={styles.grid}>
        <section className={`panel ${styles.sectionPanel}`}>
          <div className={styles.panelHead}>
            <h3>Active analysis</h3>
            <p>Active-side classification, current URL handling, age bands, and evidence density.</p>
          </div>
          <MetricGrid
            items={[
              {
                key: 'active_total',
                label: 'Active-side total',
                value: snapshot.totals.active_side_total,
                note: 'active · limited · inactive',
              },
              {
                key: 'active_archive',
                label: 'Active-side archive coverage',
                value:
                  snapshot.coverage.archive.find((item) => item.key === 'archive_active_side')?.value ?? '—',
                note: snapshot.coverage.archive.find((item) => item.key === 'archive_active_side')?.note,
              },
              {
                key: 'active_high_conf',
                label: 'Active-side high confidence',
                value:
                  snapshot.active_analysis.confidence_breakdown.find((item) => item.key === 'high')?.share ?? 0,
                note: 'share of active-side',
              },
              {
                key: 'active_launch_known',
                label: 'Active entries with launch year',
                value: snapshot.active_analysis.launch_year_histogram.reduce((sum, item) => sum + item.count, 0),
                note: 'dated active-side entries',
              },
            ]}
          />
          <BarList items={snapshot.active_analysis.status_breakdown} limit={3} />
          <BarList items={snapshot.active_analysis.url_status_breakdown} limit={7} />
          <BarList items={snapshot.active_analysis.age_bands} limit={5} />
          <BarList items={snapshot.active_analysis.evidence_depth} limit={4} />
        </section>

        <section className={`panel ${styles.sectionPanel}`}>
          <div className={styles.panelHead}>
            <h3>Dead analysis</h3>
            <p>Dead-side outcomes, death reasons, archived coverage, and measured lifespan.</p>
          </div>
          <MetricGrid
            items={[
              {
                key: 'dead_total',
                label: 'Dead-side total',
                value: snapshot.totals.dead_side_total,
                note: 'dead · merged · acquired · rebranded',
              },
              {
                key: 'dead_archive',
                label: 'Dead-side archive coverage',
                value: `${snapshot.dead_analysis.archive_coverage}%`,
                note: 'dead-side entities with archived URLs',
              },
              {
                key: 'dead_lifespan',
                label: 'Average lifespan',
                value: snapshot.dead_analysis.average_lifespan_years,
                note: 'years where launch and death dates are both known',
              },
              {
                key: 'dead_two_plus',
                label: 'Dead-side with 2+ evidence',
                value:
                  snapshot.completeness.find((item) => item.key === 'dead_two_plus_evidence')?.value ?? '—',
                note: snapshot.completeness.find((item) => item.key === 'dead_two_plus_evidence')?.note,
              },
            ]}
          />
          <BarList items={snapshot.dead_analysis.status_breakdown} limit={4} />
          <BarList items={snapshot.dead_analysis.death_reason_breakdown} limit={10} />
          <YearList items={snapshot.dead_analysis.death_year_histogram} limit={10} />
          <BarList items={snapshot.dead_analysis.evidence_depth} limit={4} />
        </section>
      </section>

      <section className={styles.grid}>
        <section className={`panel ${styles.sectionPanel}`}>
          <div className={styles.panelHead}>
            <h3>Quality &amp; coverage</h3>
            <p>Confidence, URL coverage, datedness, and missing-field visibility.</p>
          </div>
          <MetricGrid items={[...snapshot.coverage.archive, ...snapshot.coverage.date_known]} limit={8} />
          <BarList items={snapshot.quality.confidence_breakdown} limit={3} />
          <BarList items={snapshot.coverage.url_status_breakdown} limit={7} />
          <MetricGrid items={snapshot.quality.unknown_field_rates} limit={4} />
        </section>

        <section className={`panel ${styles.sectionPanel}`}>
          <div className={styles.panelHead}>
            <h3>Registry timelines</h3>
            <p>Launch-year and death-year distributions from canonical records, plus current snapshot state.</p>
          </div>
          {!hasSnapshotHistory ? (
            <div className={styles.callout}>
              Snapshot history currently contains a single generated snapshot. Subsequent regeneration can
              extend this section into true multi-snapshot trend lines without changing the page structure.
            </div>
          ) : null}
          <MetricGrid
            items={[
              { key: 'snapshot_entities', label: 'Entities in snapshot', value: history.snapshots[0]?.total_entities ?? 0 },
              { key: 'snapshot_events', label: 'Events in snapshot', value: history.snapshots[0]?.total_events ?? 0 },
              { key: 'snapshot_evidence', label: 'Evidence in snapshot', value: history.snapshots[0]?.total_evidence ?? 0 },
              {
                key: 'snapshot_archive',
                label: 'Snapshot archive coverage',
                value: `${history.snapshots[0]?.archive_coverage ?? 0}%`,
              },
            ]}
          />
          <YearList items={history.launch_year_counts} limit={10} emptyLabel="No launch years yet" />
          <YearList items={history.death_year_counts} limit={10} emptyLabel="No death years yet" />
        </section>
      </section>

      <section className={styles.grid}>
        <section className={`panel ${styles.sectionPanel}`}>
          <div className={styles.panelHead}>
            <h3>Country / origin</h3>
            <p>Strict-country counts are separated from bucketed origin values such as Global or ecosystem-level origins.</p>
          </div>
          <MetricGrid items={snapshot.country_origin.completeness} limit={4} />
          <BarList items={snapshot.country_origin.strict_countries} limit={8} emptyLabel="No strict-country values yet" />
          <BarList items={snapshot.country_origin.origin_buckets} limit={6} emptyLabel="No origin buckets yet" />
          <OriginStatusGrid items={snapshot.country_origin.status_rows} limit={6} />
          <OriginTypeGrid items={snapshot.country_origin.type_rows} limit={6} />
        </section>

        <section className={`panel ${styles.sectionPanel}`}>
          <div className={styles.panelHead}>
            <h3>Event internals</h3>
            <p>Event type mix, impact severity, status effects, and per-entity event density.</p>
          </div>
          <MetricGrid items={snapshot.events.averages} limit={3} />
          <BarList items={snapshot.events.event_type_breakdown} limit={10} emptyLabel="No events yet" />
          <BarList items={snapshot.events.impact_level_breakdown} limit={4} emptyLabel="No impact data yet" />
          <BarList items={snapshot.events.status_effect_breakdown} limit={6} emptyLabel="No status-effect data yet" />
        </section>
      </section>

      <section className={styles.grid}>
        <section className={`panel ${styles.sectionPanel}`}>
          <div className={styles.panelHead}>
            <h3>Evidence internals</h3>
            <p>Evidence source mix, reliability labels, claim scopes, and archived-share summary.</p>
          </div>
          <MetricGrid items={snapshot.evidence.averages} limit={4} />
          <BarList items={snapshot.evidence.source_type_breakdown} limit={10} emptyLabel="No evidence yet" />
          <BarList items={snapshot.evidence.reliability_breakdown} limit={3} emptyLabel="No reliability labels yet" />
          <BarList items={snapshot.evidence.claim_scope_breakdown} limit={8} emptyLabel="No claim-scope data yet" />
        </section>

        <section className={`panel ${styles.sectionPanel}`}>
          <div className={styles.panelHead}>
            <h3>Record completeness</h3>
            <p>Alias, notes, summary, archive, and evidence-depth coverage at the entity layer.</p>
          </div>
          <MetricGrid items={snapshot.completeness} limit={8} />
          <BarList items={snapshot.active_analysis.last_verified_recency} limit={5} emptyLabel="No verification dates yet" />
        </section>
      </section>
    </main>
  )
}
