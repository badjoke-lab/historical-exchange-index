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

type ColorResolver = (key: string) => string

function baseColorForKey(key: string): string {
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
      return '#8473a1'
    case 'archive_capture':
    case 'dex':
    case 'five_plus':
      return 'var(--archive)'
    case 'cex':
    case 'two_to_four':
      return 'rgba(184, 135, 70, 0.82)'
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

function typeColorForKey(key: string): string {
  switch (key) {
    case 'cex':
      return 'rgba(184, 135, 70, 0.72)'
    case 'dex':
      return 'var(--archive)'
    case 'hybrid':
      return '#8473a1'
    default:
      return baseColorForKey(key)
  }
}

function ageBandColorForKey(key: string): string {
  switch (key) {
    case 'zero_to_two':
      return 'var(--active)'
    case 'three_to_five':
      return 'var(--inactive)'
    case 'six_to_nine':
      return 'rgba(184, 135, 70, 0.82)'
    case 'ten_plus':
      return '#8473a1'
    case 'unknown':
      return 'var(--unknown)'
    default:
      return baseColorForKey(key)
  }
}

function impactColorForKey(key: string): string {
  switch (key) {
    case 'critical':
      return 'var(--dead)'
    case 'high':
      return 'rgba(200, 154, 74, 0.92)'
    case 'medium':
      return 'var(--inactive)'
    case 'low':
      return 'var(--unknown)'
    default:
      return baseColorForKey(key)
  }
}

function reliabilityColorForKey(key: string): string {
  switch (key) {
    case 'high':
      return 'var(--archive)'
    case 'medium':
      return 'var(--inactive)'
    case 'low':
      return 'var(--unknown)'
    default:
      return baseColorForKey(key)
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
  return tone === 'death' ? 'var(--dead)' : 'rgba(184, 135, 70, 0.78)'
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

function BarList({
  items,
  limit = 8,
  emptyLabel = 'No data yet',
  colorResolver,
}: {
  items: StatsBreakdownItem[]
  limit?: number
  emptyLabel?: string
  colorResolver?: ColorResolver
}) {
  const limitedItems = items.slice(0, limit)
  const resolveColor = colorResolver ?? baseColorForKey

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
              style={barStyle(Math.max(item.share, item.count > 0 ? 4 : 0), resolveColor(item.key))}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function StackedBar({
  items,
  emptyLabel = 'No data yet',
  colorResolver,
}: {
  items: StatsBreakdownItem[]
  emptyLabel?: string
  colorResolver?: ColorResolver
}) {
  const visibleItems = items.filter((item) => item.count > 0)
  const resolveColor = colorResolver ?? baseColorForKey

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
            style={{ width: `${Math.max(item.share, item.count > 0 ? 2 : 0)}%`, backgroundColor: resolveColor(item.key) }}
            title={`${item.label}: ${item.count} (${item.share}%)`}
          />
        ))}
      </div>
      <div className={styles.stackLegend}>
        {visibleItems.map((item) => (
          <div className={styles.stackLegendItem} key={item.key}>
            <span className={styles.stackSwatch} style={{ backgroundColor: resolveColor(item.key) }} />
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
        <span className={styles.disclosureHint}>Expand</span>
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
          <StackedBar items={snapshot.by_type} colorResolver={typeColorForKey} />
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
              <StackedBar items={snapshot.active_analysis.age_bands} colorResolver={ageBandColorForKey} />
            </div>
            <div className={styles.subsectionCompact}>
              <h4>Type mix</h4>
              <StackedBar items={snapshot.active_analysis.type_breakdown} colorResolver={typeColorForKey} />
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

        <section className={styles.sectionPanel}></section>
      </section>
    </main>
  )
}
