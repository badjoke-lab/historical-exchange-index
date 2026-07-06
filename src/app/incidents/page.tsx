import Link from 'next/link'
import type { Metadata } from 'next'
import { buildIncidentTimeline, incidentEventTypeLabel } from '../../lib/data/build-incident-timeline'
import { CONTACT_HREF } from '../../lib/site-constants'
import { formatDate } from '../../lib/utils/format-date'
import styles from './incidents.module.css'

export const metadata: Metadata = {
  title: 'Exchange Incident Timeline',
  description: 'Reviewed exchange incidents and shutdown milestones recorded in the Historical Exchange Index.',
  alternates: { canonical: '/incidents' },
}

export default function ExchangeIncidentTimelinePage() {
  const incidents = buildIncidentTimeline()
  const affectedExchanges = new Set(incidents.map((item) => item.entity.id)).size
  const criticalEvents = incidents.filter((item) => item.event.impact_level === 'critical').length
  const linkedSources = incidents.reduce((total, item) => total + item.evidence.length, 0)

  return (
    <main className={styles.page}>
      <section className="panel longform-panel">
        <div className={styles.headerRow}>
          <div>
            <p className="muted">Reviewed historical incidents</p>
            <h2 className={styles.pageTitle}>Exchange Incident Timeline</h2>
            <p className={styles.lead}>
              A chronological view of reviewed disruptions, enforcement actions, insolvency events, and shutdown milestones already present in HEI public records.
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

      <section className={styles.timeline} aria-label="Exchange incident history">
        {incidents.map(({ event, entity, evidence }) => (
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
              <span>Direct event links: <strong>{evidence.length}</strong></span>
            </div>
          </article>
        ))}
      </section>

      <section className="callout">
        This page is generated from reviewed HEI public event records. It is not a live alert feed, and internal monitoring output is not included.
      </section>
    </main>
  )
}
