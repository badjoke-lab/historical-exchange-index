import Link from 'next/link'
import type { Metadata } from 'next'
import { buildIncidentTimeline } from '../../lib/data/build-incident-timeline'
import type { IncidentTimelineItem } from '../../lib/data/build-incident-timeline'
import type { EventType, ImpactLevel } from '../../lib/types/event'
import { CONTACT_HREF } from '../../lib/site-constants'
import { formatDate } from '../../lib/utils/format-date'
import styles from './timeline.module.css'

export const metadata: Metadata = {
  title: 'Exchange Incident Timeline',
  description:
    'A chronological timeline of reviewed exchange hacks, shutdowns, suspensions, bankruptcies, regulatory actions, acquisitions, mergers, and reopenings in HEI.',
  alternates: { canonical: '/timeline' },
}

const EVENT_LABELS: Record<EventType, string> = {
  launched: 'Launched',
  rebranded: 'Rebranded',
  acquired: 'Acquired',
  merged: 'Merged',
  hack: 'Hack',
  exploit: 'Exploit',
  withdrawal_suspended: 'Withdrawal suspended',
  deposit_suspended: 'Deposit suspended',
  trading_halted: 'Trading halted',
  service_outage: 'Service outage',
  regulatory_action: 'Regulatory action',
  lawsuit: 'Lawsuit',
  bankruptcy_filed: 'Bankruptcy filed',
  insolvency_declared: 'Insolvency declared',
  shutdown_announced: 'Shutdown announced',
  shutdown_effective: 'Shutdown effective',
  reopened: 'Reopened',
  token_migration: 'Token migration',
  chain_shutdown_impact: 'Chain shutdown impact',
  other: 'Other',
}

function impactClass(impact: ImpactLevel): string {
  return `${styles.impactChip} ${styles[`impact_${impact}`]}`
}

function groupByYear(items: IncidentTimelineItem[]) {
  const groups = new Map<string, IncidentTimelineItem[]>()
  for (const item of items) {
    const year = item.event.event_date?.slice(0, 4) ?? 'Unknown'
    const list = groups.get(year) ?? []
    list.push(item)
    groups.set(year, list)
  }
  return [...groups.entries()]
}

export default function IncidentTimelinePage() {
  const timeline = buildIncidentTimeline()
  const yearGroups = groupByYear(timeline.items)

  return (
    <main className={styles.page}>
      <section className="panel longform-panel">
        <div className={styles.headerRow}>
          <div>
            <p className="muted">Canonical event history</p>
            <h2 className={styles.pageTitle}>Exchange Incident Timeline</h2>
            <p className={styles.lead}>
              Reviewed HEI events ordered by date. This surface uses canonical event records only; monitoring signals and
              unresolved candidates are not included.
            </p>
          </div>
          <div className={styles.actions}>
            <Link className="btn" href="/updates">Registry Updates</Link>
            <a className="btn" href={CONTACT_HREF} target="_blank" rel="noreferrer">Submit correction</a>
          </div>
        </div>

        <div className={styles.summaryGrid}>
          <div><span>Incident events</span><strong>{timeline.items.length}</strong></div>
          <div><span>Affected exchanges</span><strong>{timeline.affectedEntities}</strong></div>
          <div><span>Earliest dated event</span><strong>{timeline.firstDate ? formatDate(timeline.firstDate) : '—'}</strong></div>
          <div><span>Latest dated event</span><strong>{timeline.lastDate ? formatDate(timeline.lastDate) : '—'}</strong></div>
        </div>

        <div className={styles.typeSummary} aria-label="Incident type summary">
          {timeline.typeCounts.slice(0, 8).map((item) => (
            <span className={styles.typeSummaryItem} key={item.type}>
              {EVENT_LABELS[item.type]} <strong>{item.count}</strong>
            </span>
          ))}
        </div>
      </section>

      <section className={styles.timeline} aria-label="Exchange incident timeline">
        {yearGroups.map(([year, items]) => (
          <div className={styles.yearGroup} key={year}>
            <div className={styles.yearRail}>
              <h3>{year}</h3>
              <span>{items.length} events</span>
            </div>
            <div className={styles.eventList}>
              {items.map(({ event, entity }) => (
                <article className={`panel ${styles.eventRow}`} key={event.id}>
                  <div className={styles.eventDate}>{event.event_date ? formatDate(event.event_date) : '—'}</div>
                  <div className={styles.eventBody}>
                    <div className={styles.eventMeta}>
                      <span className={styles.eventType}>{EVENT_LABELS[event.event_type]}</span>
                      <span className={impactClass(event.impact_level)}>{event.impact_level}</span>
                    </div>
                    <h4>{event.title}</h4>
                    <p>{event.description}</p>
                    <div className={styles.entityLine}>
                      <Link href={`/exchange/${entity.slug}`}>{entity.canonical_name}</Link>
                      <span>{entity.type.toUpperCase()}</span>
                      <span>{entity.status}</span>
                      <span>{event.source_count} source{event.source_count === 1 ? '' : 's'}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="callout">
        The timeline records meaningful lifecycle and incident events. Routine listings, market moves, and unresolved monitoring
        signals are excluded. Event dates and classifications can be revised when stronger evidence becomes available.
      </section>
    </main>
  )
}
