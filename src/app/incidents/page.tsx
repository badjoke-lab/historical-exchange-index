import Link from 'next/link'
import type { Metadata } from 'next'
import {
  buildIncidentTimeline,
  incidentEventTypeLabel,
  type IncidentTimelineItem,
} from '../../lib/data/build-incident-timeline'
import { CONTACT_HREF } from '../../lib/site-constants'
import { formatDate } from '../../lib/utils/format-date'
import styles from './incidents.module.css'

export const metadata: Metadata = {
  title: 'Exchange Incident Timeline',
  description: 'Reviewed exchange incidents and shutdown milestones recorded in the Historical Exchange Index.',
  alternates: { canonical: '/incidents' },
}

function groupByYear(items: IncidentTimelineItem[]) {
  const grouped = new Map<string, IncidentTimelineItem[]>()

  for (const item of items) {
    const year = item.event.event_date?.slice(0, 4) ?? 'Unknown'
    const current = grouped.get(year) ?? []
    current.push(item)
    grouped.set(year, current)
  }

  return [...grouped.entries()]
}

export default function ExchangeIncidentTimelinePage() {
  const incidents = buildIncidentTimeline()
  const groups = groupByYear(incidents)
  const affectedExchanges = new Set(incidents.map((item) => item.entity.id)).size
  const criticalEvents = incidents.filter((item) => item.event.impact_level === 'critical').length
  const linkedSources = incidents.reduce((total, item) => total + item.evidence.length, 0)
  const typeCounts = incidents.reduce<Map<string, number>>((counts, item) => {
    const label = incidentEventTypeLabel(item.event.event_type)
    counts.set(label, (counts.get(label) ?? 0) + 1)
    return counts
  }, new Map())
  const leadingTypes = [...typeCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)

  return (
    <main className={styles.page}>
      <section className="panel longform-panel">
        <div className={styles.headerRow}>
          <div>
            <p className="muted">Reviewed historical incidents</p>
            <h2 className={styles.pageTitle}>Exchange Incident Timeline</h2>
            <p className={styles.lead}>
              A chronological view of reviewed disruptions, enforcement actions, insolvency events, and shutdown milestones already present in HEI public records. Raw monitoring signals and unmerged candidates are not included.
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link className="btn" href="/updates">Registry Updates</Link>
            <Link className="btn" href="/methodology">Methodology</Link>
            <a className="btn" href={CONTACT_HREF} target="_blank" rel="noreferrer">Submit correction</a>
          </div>
        </div>

        <div className={styles.summaryStrip}>
          <div><span>Timeline events</span><strong>{incidents.length}</strong></div>
          <div><span>Affected exchanges</span><strong>{affectedExchanges}</strong></div>
          <div><span>Critical events</span><strong>{criticalEvents}</strong></div>
          <div><span>Event-linked sources</span><strong>{linkedSources}</strong></div>
        </div>
      </section>

      <section className={`panel ${styles.breakdownPanel}`} aria-label="Leading incident types">
        <div>
          <p className="muted">Leading recorded types</p>
          <h3>Incident mix</h3>
        </div>
        <div className={styles.breakdownList}>
          {leadingTypes.map(([label, count]) => (
            <span className={styles.breakdownItem} key={label}>
              <span>{label}</span>
              <strong>{count}</strong>
            </span>
          ))}
        </div>
      </section>

      <section className={styles.timeline} aria-label="Exchange incident history">
        {groups.map(([year, items]) => (
          <section className={styles.yearGroup} key={year} aria-labelledby={`incident-year-${year}`}>
            <div className={styles.yearHeader}>
              <h2 id={`incident-year-${year}`}>{year}</h2>
              <span>{items.length} events</span>
            </div>

            <div className={styles.yearItems}>
              {items.map(({ event, entity, evidence }) => (
                <article className={`panel ${styles.incidentCard}`} key={event.id} id={event.id}>
                  <div className={styles.incidentMeta}>
                    <time dateTime={event.event_date ?? undefined}>{event.event_date ? formatDate(event.event_date) : 'Unknown date'}</time>
                    <span>{incidentEventTypeLabel(event.event_type)}</span>
                    <span>{event.impact_level}</span>
                  </div>

                  <div className={styles.exchangeRow}>
                    <Link href={`/exchange/${entity.slug}`}>{entity.canonical_name}</Link>
                    <span>{entity.type.toUpperCase()}</span>
                    <span>{entity.status}</span>
                  </div>

                  <h3>{event.title}</h3>
                  <p className={styles.description}>{event.description}</p>

                  <div className={styles.eventFacts}>
                    <span>Status effect: <strong>{event.event_status_effect}</strong></span>
                    <span>Confidence: <strong>{event.confidence}</strong></span>
                    <span>Recorded source count: <strong>{event.source_count}</strong></span>
                    <span>Direct event-linked evidence: <strong>{evidence.length}</strong></span>
                  </div>

                  <div className={styles.recordLinkRow}>
                    <Link href={`/exchange/${entity.slug}`}>Open exchange dossier</Link>
                    <a href={`#${event.id}`} aria-label={`Link to ${event.title}`}>Permalink</a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </section>

      <section className="callout">
        This page is generated from reviewed HEI public event records. It is not a live alert feed, and internal monitoring output is not included.
      </section>
    </main>
  )
}
