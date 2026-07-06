import Link from 'next/link'
import type { Metadata } from 'next'
import { buildMonthlyHistoricalSnapshot } from '../../lib/data/build-monthly-historical-snapshot'
import { incidentEventTypeLabel } from '../../lib/data/build-incident-timeline'
import { CONTACT_HREF } from '../../lib/site-constants'
import { formatDate } from '../../lib/utils/format-date'
import styles from './monthly.module.css'

export const metadata: Metadata = {
  title: 'Monthly Historical Exchange Snapshot',
  description: 'A reviewed monthly snapshot of significant exchange lifecycle and incident events recorded in the Historical Exchange Index.',
  alternates: { canonical: '/monthly' },
}

function monthlyExplorerHref(periodStart: string, periodEnd: string) {
  const params = new URLSearchParams()
  params.set('view', 'events')
  params.set('date_from', periodStart)
  params.set('date_to', periodEnd)
  return `/explore/?${params.toString()}`
}

function monthlyEventTypeHref(periodStart: string, periodEnd: string, eventType: string) {
  const params = new URLSearchParams()
  params.set('view', 'events')
  params.set('event_type', eventType)
  params.set('date_from', periodStart)
  params.set('date_to', periodEnd)
  return `/explore/?${params.toString()}`
}

function monthlyImpactHref(periodStart: string, periodEnd: string, impact: string) {
  const params = new URLSearchParams()
  params.set('view', 'events')
  params.set('date_from', periodStart)
  params.set('date_to', periodEnd)
  params.set('impact_level', impact)
  return `/explore/?${params.toString()}`
}

export default function MonthlyHistoricalExchangeSnapshotPage() {
  const snapshot = buildMonthlyHistoricalSnapshot()
  const allMonthEventsHref = monthlyExplorerHref(snapshot.periodStart, snapshot.periodEnd)

  return (
    <main className={styles.page}>
      <section className="panel longform-panel">
        <div className={styles.headerRow}>
          <div>
            <p className="muted">Reviewed monthly historical snapshot</p>
            <h2 className={styles.pageTitle}>{snapshot.monthLabel}</h2>
            <p className={styles.subtitle}>Monthly Historical Exchange Snapshot</p>
            <p className={styles.lead}>
              Significant lifecycle and incident events whose reviewed event dates fall within the latest completed UTC month. This is a historical registry view, not a breaking-news digest or a publication of raw monitoring findings.
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link className="btn btn-primary" href={allMonthEventsHref}>Explore this month</Link>
            <Link className="btn" href="/incidents">Incident Timeline</Link>
            <Link className="btn" href="/updates">Registry Updates</Link>
            <a className="btn" href={CONTACT_HREF} target="_blank" rel="noreferrer">Submit correction</a>
          </div>
        </div>

        <div className={styles.periodRow}>
          <span>Review period <strong>{snapshot.periodStart}</strong> to <strong>{snapshot.periodEnd}</strong></span>
          <span>Snapshot generated <strong>{snapshot.generatedAt.slice(0, 10)}</strong></span>
        </div>

        <div className={styles.summaryStrip}>
          <div><span>Recorded events</span><strong>{snapshot.summary.events}</strong></div>
          <div><span>Affected exchanges</span><strong>{snapshot.summary.affectedExchanges}</strong></div>
          <div><span>Critical / high</span><strong>{snapshot.summary.criticalOrHighEvents}</strong></div>
          <div><span>Event-linked evidence</span><strong>{snapshot.summary.eventLinkedEvidence}</strong></div>
        </div>
      </section>

      <section className={styles.mixGrid}>
        <article className={`panel ${styles.mixPanel}`}>
          <div><p className="muted">Recorded event types</p><h3>Monthly event mix</h3></div>
          <div className={styles.pillList}>
            {snapshot.byEventType.length > 0 ? snapshot.byEventType.map((item) => (
              <Link className={styles.pill} href={monthlyEventTypeHref(snapshot.periodStart, snapshot.periodEnd, item.key)} key={item.key}><span>{item.label}</span><strong>{item.count}</strong></Link>
            )) : <p className={styles.emptyText}>No qualifying reviewed events are recorded for this month.</p>}
          </div>
        </article>

        <article className={`panel ${styles.mixPanel}`}>
          <div><p className="muted">Recorded impact levels</p><h3>Impact mix</h3></div>
          <div className={styles.pillList}>
            {snapshot.byImpact.length > 0 ? snapshot.byImpact.map((item) => (
              <Link className={styles.pill} href={monthlyImpactHref(snapshot.periodStart, snapshot.periodEnd, item.key)} key={item.key}><span>{item.label}</span><strong>{item.count}</strong></Link>
            )) : <p className={styles.emptyText}>No impact distribution is available for this month.</p>}
          </div>
        </article>
      </section>

      <section className={`panel ${styles.registryPanel}`}>
        <div><p className="muted">Registry state at snapshot generation</p><h3>Current reviewed registry context</h3></div>
        <div className={styles.registryCounts}><span>Entities <strong>{snapshot.registryState.entities}</strong></span><span>Events <strong>{snapshot.registryState.events}</strong></span><span>Evidence <strong>{snapshot.registryState.evidence}</strong></span></div>
      </section>

      <section className={styles.eventList} aria-label={`${snapshot.monthLabel} reviewed exchange events`}>
        {snapshot.items.length > 0 ? snapshot.items.map(({ event, entity, evidenceCount }) => (
          <article className={`panel ${styles.eventCard}`} key={event.id} id={event.id}>
            <div className={styles.eventMeta}><time dateTime={event.event_date ?? undefined}>{event.event_date ? formatDate(event.event_date) : 'Unknown date'}</time><Link href={monthlyEventTypeHref(snapshot.periodStart, snapshot.periodEnd, event.event_type)}>{incidentEventTypeLabel(event.event_type)}</Link><span>{event.impact_level}</span></div>
            <div className={styles.exchangeRow}><Link href={`/exchange/${entity.slug}`}>{entity.canonical_name}</Link><span>{entity.type.toUpperCase()}</span><span>{entity.status}</span></div>
            <h3>{event.title}</h3><p>{event.description}</p>
            <div className={styles.factRow}><span>Status effect: <strong>{event.event_status_effect}</strong></span><span>Confidence: <strong>{event.confidence}</strong></span><span>Direct event-linked evidence: <strong>{evidenceCount}</strong></span></div>
            <div className={styles.linkRow}><Link href={`/exchange/${entity.slug}`}>Open exchange dossier</Link><Link href={monthlyEventTypeHref(snapshot.periodStart, snapshot.periodEnd, event.event_type)}>Explore this type in month</Link><a href={`#${event.id}`}>Permalink</a></div>
          </article>
        )) : <section className={`panel ${styles.emptyPanel}`}><h3>No qualifying reviewed events recorded for {snapshot.monthLabel}</h3><p>The public snapshot remains explicit about an empty month rather than filling the page with monitoring signals or unreviewed candidates.</p></section>}
      </section>

      <section className="callout">
        The review period and snapshot generation date are separate. Event inclusion is based on reviewed event dates within the displayed month; registry totals reflect the reviewed registry available when this page was generated.
      </section>
    </main>
  )
}
