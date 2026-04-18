import Link from 'next/link'
import type { CSSProperties } from 'react'
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
    case 'last_30':
      return 'var(--active)'
    case 'limited':
    case 'live_unverified':
    case 'one':
    case 'last_365':
      return 'var(--limited)'
    case 'inactive':
    case 'redirected':
    case 'medium':
    case 'last_90':
      return 'var(--inactive)'
    case 'dead':
    case 'hack':
    case 'insolvency':
    case 'dead_domain':
    case 'unsafe':
    case 'critical':
    case 'older':
      return 'var(--dead)'
    case 'merged':
    case 'merger':
    case 'last_180':
      return '#8f8274'
    case 'acquired':
    case 'acquisition':
      return '#7286a6'
    case 'rebranded':
    case 'rebrand':
    case 'hybrid':
      return '#8473a1'
    case 'archive_capture':
    case 'dex':
    case 'five_plus':
      return 'var(--archive)'
    case 'cex':
    case 'two_to_four':
      return 'rgba(184, 135, 70, 0.88)'
    case 'zero':
    case 'low':
    case 'unknown':
      return 'var(--unknown)'
    case 'repurposed':
      return '#6f6680'
    default:
      return 'rgba(184, 135, 70, 0.7)'
  }
}

function barStyle(width: number, color: string): CSSProperties {
  return {
    '--bar-width': `${width}%`,
    '--bar-color': color,
  } as CSSProperties
}

function histogramBarStyle(height: number, color: string): CSSProperties {
  return {
    height: `${height}%`,
    backgroundColor: color,
  }
}

function histogramToneColor(tone: 'launch' | 'death'): string {
  return tone === 'death' ? 'var(--dead)' : 'rgba(184, 135, 70, 0.82)'
}

function percentValue(value: number | string): string {
  if (typeof value === 'number') return `${value}%`
  return String(value)
}

function percentMetricValue(item: StatsMetricItem): string {
  return percentValue(item.value)
}

function extractPercentFromNote(note?: string): string | null {
  if (!note) return null
  const match = note.match(/(\d+)%/)
  return match ? `${match[1]}%` : null
}

function formatCompletenessValue(item: StatsMetricItem): string {
  if (item.key === 'zero_evidence' || item.key === 'one_evidence') {
    return extractPercentFromNote(item.note) ?? String(item.value)
  }
  return percentValue(item.value)
}

function SummaryTile({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="summary-tile">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      <div className="hint">{hint}</div>
    </div>
  )
}

function SectionHeading({ title, note }: { title: string; note?: string }) {
  return (
    <div className={styles.sectionHeading}>
      <h2>{title}</h2>
      {note ? <p>{note}</p> : null}
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
              style={barStyle(Math.max(item.share, item.count > 0 ? 4 : 0), colorForKey(item.key))}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function StackedBar({ items, emptyLabel = 'No data yet' }: { items: StatsBreakdownItem[]; emptyLabel?: string }) {
  const visibleItems = items.filter((item) => item.count > 0)

  if (visibleItems.length === 0) {
    return <p className={styles.note}>{emptyLabel}</p>
  }

  return (
    <div className={styles.stackGroup}>
      <div className={styles.stackBar}>
        {visibleItems.map((item) => (
          <div
            key={item.key}
            className={styles.stackSegment}
            style={{ width: `${Math.max(item.share, item.count > 0 ? 2 : 0)}%`, backgroundColor: colorForKey(item.key) }}
            title={`${item.label}: ${item.count} (${item.share}%)`}
          />
        ))}
      </div>
      <div className={styles.stackLegend}>
        {visibleItems.map((item) => (
          <div className={styles.stackLegendItem} key={item.key}>
            <span className={styles.stackSwatch} style={{ backgroundColor: colorForKey(item.key) }} />
            <span className={styles.stackLegendLabel}>{item.label}</span>
            <span className={styles.stackLegendValue}>
              {item.count} · {item.share}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Histogram({
  items,
  emptyLabel = 'No dated records yet',
  limit = 12,
  tone = 'launch',
}: {
  items: StatsYearCount[]
  emptyLabel?: string
  limit?: number
  tone?: 'launch' | 'death'
}) {
  const sorted = [...items].sort((a, b) => a.year - b.year)
  const visibleItems = sorted.slice(Math.max(sorted.length - limit, 0))
  const maxCount = visibleItems.reduce((max, item) => Math.max(max, item.count), 0)

  if (visibleItems.length === 0) {
    return <p className={styles.note}>{emptyLabel}</p>
  }

  return (
    <div className={styles.histogram}>
      {visibleItems.map((item) => {
        const height = maxCount > 0 ? Math.max(Math.round((item.count / maxCount) * 100), item.count > 0 ? 10 : 0) : 0
        return (
          <div className={styles.histogramItem} key={item.year}>
            <div className={styles.histogramCount}>{item.count}</div>
            <div className={styles.histogramBarWrap}>
              <div className={styles.histogramBar} style={histogramBarStyle(height, histogramToneColor(tone))} />
            </div>
            <div className={styles.histogramLabel}>{item.year}</div>
          </div>
        )
      })}
    </div>
  )
}

function MetricGrid({ items, formatter }: { items: StatsMetricItem[]; formatter?: (item: StatsMetricItem) => string }) {
  return (
    <div className={styles.metricGrid}>
      {items.map((item) => (
        <div className={styles.metricCard} key={item.key}>
          <div className={styles.metricLabel}>{item.label}</div>
          <div className={styles.metricValue}>{formatter ? formatter(item) : item.value}</div>
          {item.note ? <div className={styles.metricNote}>{item.note}</div> : null}
        </div>
      ))}
    </div>
  )
}

function tableRowClass(item: StatsMetricItem): string | undefined {
  if (item.key.startsWith('archive_')) return styles.rowArchive
  return undefined
}

function ComparisonTable({
  items,
  valueFormatter,
  rowClassName,
}: {
  items: StatsMetricItem[]
  valueFormatter?: (item: StatsMetricItem) => string
  rowClassName?: (item: StatsMetricItem) => string | undefined
}) {
  if (items.length === 0) {
    return <p className={styles.note}>No table rows yet.</p>
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.key} className={rowClassName ? rowClassName(item) : undefined}>
              <td>{item.label}</td>
              <td>{valueFormatter ? valueFormatter(item) : item.value}</td>
              <td>{item.note ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function OriginStatusTable({ items }: { items: StatsOriginStatusRow[] }) {
  const visibleItems = items.slice(0, 8)

  if (visibleItems.length === 0) {
    return <p className={styles.note}>No origin rows yet.</p>
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>Origin</th>
            <th>Total</th>
            <th>Dead-side</th>
            <th>Active-side</th>
          </tr>
        </thead>
        <tbody>
          {visibleItems.map((item) => (
            <tr key={item.key}>
              <td>{item.label}</td>
              <td>{item.total}</td>
              <td>{item.deadSide}</td>
              <td>{item.activeSide}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function OriginTypeTable({ items }: { items: StatsOriginTypeRow[] }) {
  const visibleItems = items.slice(0, 8)

  if (visibleItems.length === 0) {
    return <p className={styles.note}>No type rows yet.</p>
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>Origin</th>
            <th>Total</th>
            <th>CEX</th>
            <th>DEX</th>
            <th>Hybrid</th>
          </tr>
        </thead>
        <tbody>
          {visibleItems.map((item) => (
            <tr key={item.key}>
              <td>{item.label}</td>
              <td>{item.total}</td>
              <td>{item.cex}</td>
              <td>{item.dex}</td>
              <td>{item.hybrid}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MiniLineChart({ series }: { series: Array<{ label: string; value: number }> }) {
  if (series.length < 2) return null

  const maxValue = Math.max(...series.map((item) => item.value), 0)
  const width = 360
  const height = 120
  const step = series.length > 1 ? width / (series.length - 1) : width
  const points = series
    .map((item, index) => {
      const x = index * step
      const y = maxValue > 0 ? height - (item.value / maxValue) * height : height
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className={styles.lineChartWrap}>
      <svg className={styles.lineChart} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
        <polyline points={points} fill="none" stroke="rgba(184, 135, 70, 0.88)" strokeWidth="3" />
      </svg>
      <div className={styles.lineLegend}>
        {series.map((item) => (
          <div className={styles.lineLegendItem} key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function DisclosureSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <details className={`panel ${styles.disclosure}`}>
      <summary className={styles.disclosureSummary}>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <span className={styles.disclosureHint}>Show section</span>
      </summary>
      <div className={styles.disclosureBody}>{children}</div>
    </details>
  )
}

export default function StatsPage() {
  const { snapshot, history } = buildStatsView()
  const hasSnapshotHistory = history.snapshots.length > 1

  const activeSummaryItems: StatsMetricItem[] = [
    {
      key: 'active_total',
      label: 'Active-side total',
      value: snapshot.totals.active_side_total,
      note: 'active · limited · inactive',
    },
    {
      key: 'active_archive',
      label: 'Active-side archive coverage',
      value: snapshot.coverage.archive.find((item) => item.key === 'archive_active_side')?.value ?? '—',
      note: snapshot.coverage.archive.find((item) => item.key === 'archive_active_side')?.note,
    },
    {
      key: 'active_high_conf',
      label: 'Active-side high confidence',
      value: snapshot.active_analysis.confidence_breakdown.find((item) => item.key === 'high')?.share ?? 0,
      note: 'share of active-side',
    },
    {
      key: 'active_launch_known',
      label: 'Active entries with launch year',
      value: snapshot.active_analysis.launch_year_histogram.reduce((sum, item) => sum + item.count, 0),
      note: 'dated active-side entries',
    },
  ]

  const deadSummaryItems: StatsMetricItem[] = [
    {
      key: 'dead_total',
      label: 'Dead-side total',
      value: snapshot.totals.dead_side_total,
      note: 'dead · merged · acquired · rebranded',
    },
    {
      key: 'dead_archive',
      label: 'Dead-side archive coverage',
      value: snapshot.dead_analysis.archive_coverage,
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
      value: snapshot.completeness.find((item) => item.key === 'dead_two_plus_evidence')?.value ?? '—',
      note: snapshot.completeness.find((item) => item.key === 'dead_two_plus_evidence')?.note,
    },
  ]

  const timelineSeries = hasSnapshotHistory
    ? history.snapshots.map((item) => ({
        label: formatDate(item.date),
        value: item.total_entities,
      }))
    : []

  return (
    <main className={styles.page}>
      <section className={`panel ${styles.headerPanel}`}>
        <div className={styles.headerTop}>
          <div className={styles.headerCopy}>
            <p className={styles.kicker}>Stats</p>
            <h2 className={styles.title}>Registry snapshot, coverage, and historical distributions</h2>
            <p className={styles.description}>
              Snapshot counts, active-side and dead-side analysis, archive coverage, confidence, and
              historical distributions across the canonical HEI registry.
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

      <SectionHeading title="Core analysis" note="Primary registry structure, active/dead composition, quality, and historical distributions." />

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
          <StackedBar items={snapshot.by_type} />
        </section>
      </section>

      <section className={styles.grid}>
        <section className={`panel ${styles.sectionPanel}`}>
          <div className={styles.panelHead}>
            <h3>Active analysis</h3>
            <p>Current classification, URL handling, launch timing, and evidence density on the active-side.</p>
          </div>
          <MetricGrid items={activeSummaryItems} />
          <div className={styles.subsection}>
            <h4>Active-side status mix</h4>
            <StackedBar items={snapshot.active_analysis.status_breakdown} />
          </div>
          <div className={styles.subsection}>
            <h4>URL status</h4>
            <StackedBar items={snapshot.active_analysis.url_status_breakdown} />
          </div>
          <div className={styles.subsection}>
            <h4>Launch year</h4>
            <Histogram items={snapshot.active_analysis.launch_year_histogram} emptyLabel="No active launch years yet" tone="launch" />
          </div>
          <div className={styles.subsectionGrid}>
            <div className={styles.subsectionCompact}>
              <h4>Age bands</h4>
              <StackedBar items={snapshot.active_analysis.age_bands} />
            </div>
            <div className={styles.subsectionCompact}>
              <h4>Type mix</h4>
              <StackedBar items={snapshot.active_analysis.type_breakdown} />
            </div>
            <div className={styles.subsectionCompact}>
              <h4>Confidence</h4>
              <StackedBar items={snapshot.active_analysis.confidence_breakdown} />
            </div>
            <div className={styles.subsectionCompact}>
              <h4>Evidence depth</h4>
              <StackedBar items={snapshot.active_analysis.evidence_depth} />
            </div>
            <div className={styles.subsectionCompactWide}>
              <h4>Last verified recency</h4>
              <StackedBar items={snapshot.active_analysis.last_verified_recency} />
            </div>
          </div>
        </section>

        <section className={`panel ${styles.sectionPanel}`}>
          <div className={styles.panelHead}>
            <h3>Dead analysis</h3>
            <p>Dead-side outcomes, end-state causes, archived coverage, and measured lifespan.</p>
          </div>
          <MetricGrid items={deadSummaryItems} formatter={(item) => (item.key === 'dead_archive' || item.key === 'dead_two_plus' ? percentValue(item.value) : String(item.value))} />
          <div className={styles.subsection}>
            <h4>Dead-side status mix</h4>
            <StackedBar items={snapshot.dead_analysis.status_breakdown} />
          </div>
          <div className={styles.subsection}>
            <h4>Death reason breakdown</h4>
            <BarList items={snapshot.dead_analysis.death_reason_breakdown} limit={10} />
          </div>
          <div className={styles.subsection}>
            <h4>Death year distribution</h4>
            <Histogram items={snapshot.dead_analysis.death_year_histogram} emptyLabel="No death years yet" tone="death" />
          </div>
          <div className={styles.subsectionCompactWide}>
            <h4>Evidence depth</h4>
            <StackedBar items={snapshot.dead_analysis.evidence_depth} />
          </div>
        </section>
      </section>

      <section className={styles.grid}>
        <section className={`panel ${styles.sectionPanel}`}>
          <div className={styles.panelHead}>
            <h3>Quality &amp; coverage</h3>
            <p>Confidence, URL handling, archive/date/domain coverage, and visible unknown-field rates.</p>
          </div>
          <div className={styles.subsectionCompactWide}>
            <h4>Confidence</h4>
            <StackedBar items={snapshot.quality.confidence_breakdown} />
          </div>
          <div className={styles.subsectionCompactWide}>
            <h4>URL status coverage</h4>
            <BarList items={snapshot.coverage.url_status_breakdown} limit={7} />
          </div>
          <div className={styles.subsectionCompactWide}>
            <h4>Archive / date / domain coverage</h4>
            <ComparisonTable items={[...snapshot.coverage.archive, ...snapshot.coverage.date_known]} valueFormatter={percentMetricValue} rowClassName={tableRowClass} />
          </div>
          <div className={styles.subsectionCompactWide}>
            <h4>Unknown-field rates</h4>
            <ComparisonTable items={snapshot.quality.unknown_field_rates} />
          </div>
          <div className={styles.subsectionCompactWide}>
            <h4>Record freshness</h4>
            <StackedBar items={snapshot.quality.last_verified_recency} />
          </div>
        </section>

        <section className={`panel ${styles.sectionPanel}`}>
          <div className={styles.panelHead}>
            <h3>Registry timelines &amp; distributions</h3>
            <p>Snapshot growth when available, plus launch-year and death-year distributions.</p>
          </div>
          {hasSnapshotHistory ? (
            <div className={styles.subsectionCompactWide}>
              <h4>Snapshot growth</h4>
              <MiniLineChart series={timelineSeries} />
            </div>
          ) : (
            <>
              <div className={styles.callout}>
                Snapshot history currently contains a single generated snapshot. Until multi-snapshot history
                is available, this section emphasizes current snapshot metrics and historical distributions.
              </div>
              <MetricGrid
                items={[
                  { key: 'snapshot_entities', label: 'Entities in snapshot', value: history.snapshots[0]?.total_entities ?? 0 },
                  { key: 'snapshot_events', label: 'Events in snapshot', value: history.snapshots[0]?.total_events ?? 0 },
                  { key: 'snapshot_evidence', label: 'Evidence in snapshot', value: history.snapshots[0]?.total_evidence ?? 0 },
                  {
                    key: 'snapshot_archive',
                    label: 'Snapshot archive coverage',
                    value: history.snapshots[0]?.archive_coverage ?? 0,
                    note: 'archive coverage in current snapshot',
                  },
                ]}
                formatter={(item) => (item.key === 'snapshot_archive' ? percentValue(item.value) : String(item.value))}
              />
            </>
          )}
          <div className={styles.subsection}>
            <h4>Launch year distribution</h4>
            <Histogram items={history.launch_year_counts} emptyLabel="No launch years yet" tone="launch" />
          </div>
          <div className={styles.subsection}>
            <h4>Death year distribution</h4>
            <Histogram items={history.death_year_counts} emptyLabel="No death years yet" tone="death" />
          </div>
        </section>
      </section>

      <SectionHeading title="Deep breakdowns" note="Lower-priority drilldowns. These remain available without competing with the core analysis layer." />

      <div className={styles.disclosureStack}>
        <DisclosureSection
          title="Country / origin"
          description="Strict-country counts are separated from bucketed origin values such as Global or ecosystem-level origins."
        >
          <div className={styles.subsectionCompactWide}>
            <h4>Strict country</h4>
            <BarList items={snapshot.country_origin.strict_countries} limit={8} emptyLabel="No strict-country values yet" />
          </div>
          <div className={styles.subsectionCompactWide}>
            <h4>Origin bucket</h4>
            <BarList items={snapshot.country_origin.origin_buckets} limit={6} emptyLabel="No origin buckets yet" />
          </div>
          <div className={styles.subsectionCompactWide}>
            <h4>Country / origin × status</h4>
            <OriginStatusTable items={snapshot.country_origin.status_rows} />
          </div>
          <div className={styles.subsectionCompactWide}>
            <h4>Country / origin × type</h4>
            <OriginTypeTable items={snapshot.country_origin.type_rows} />
          </div>
          <div className={styles.subsectionCompactWide}>
            <h4>Country / origin completeness</h4>
            <ComparisonTable items={snapshot.country_origin.completeness} />
          </div>
        </DisclosureSection>

        <DisclosureSection
          title="Event internals"
          description="Event type mix, impact severity, and status-effect composition from recorded timeline events."
        >
          <MetricGrid items={snapshot.events.averages} />
          <div className={styles.subsectionCompactWide}>
            <h4>Event type breakdown</h4>
            <BarList items={snapshot.events.event_type_breakdown} limit={10} emptyLabel="No events yet" />
          </div>
          <div className={styles.subsectionCompactWide}>
            <h4>Impact level</h4>
            <StackedBar items={snapshot.events.impact_level_breakdown} emptyLabel="No impact data yet" />
          </div>
          <div className={styles.subsectionCompactWide}>
            <h4>Status effect</h4>
            <StackedBar items={snapshot.events.status_effect_breakdown} emptyLabel="No status-effect data yet" />
          </div>
        </DisclosureSection>

        <DisclosureSection
          title="Evidence internals"
          description="Evidence source mix, reliability, claim scopes, and archived-share summary from the support layer."
        >
          <MetricGrid items={snapshot.evidence.averages} formatter={(item) => (item.key === 'archived_evidence_share' ? percentValue(item.value) : String(item.value))} />
          <div className={styles.subsectionCompactWide}>
            <h4>Source type breakdown</h4>
            <BarList items={snapshot.evidence.source_type_breakdown} limit={10} emptyLabel="No evidence yet" />
          </div>
          <div className={styles.subsectionCompactWide}>
            <h4>Reliability</h4>
            <StackedBar items={snapshot.evidence.reliability_breakdown} emptyLabel="No reliability labels yet" />
          </div>
          <div className={styles.subsectionCompactWide}>
            <h4>Claim scope</h4>
            <BarList items={snapshot.evidence.claim_scope_breakdown} limit={8} emptyLabel="No claim-scope data yet" />
          </div>
        </DisclosureSection>

        <DisclosureSection
          title="Record completeness"
          description="Alias, notes, summary, archive, and evidence-depth coverage at the entity layer."
        >
          <ComparisonTable items={snapshot.completeness} valueFormatter={formatCompletenessValue} />
        </DisclosureSection>
      </div>
    </main>
  )
}
