import Link from 'next/link'
import type { Metadata } from 'next'
import {
  buildIncidentTimeline,
  INCIDENT_EVENT_TYPE_LABELS,
  incidentEventTypeLabel,
  type IncidentTimelineItem,
} from '../../lib/data/build-incident-timeline'
import {
  buildLocalizedPageMetadata,
  getPagePresentation,
} from '../../lib/i18n/page-presentations'
import { CONTACT_HREF } from '../../lib/site-constants'
import { formatDate } from '../../lib/utils/format-date'
import styles from './incidents.module.css'

export function generateMetadata(): Metadata {
  return buildLocalizedPageMetadata({
    locale: 'en',
    page: 'incidents',
    pathname: '/incidents/',
  })
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

function eventTypeHref(eventType: string) {
  const params = new URLSearchParams()
  params.set('view', 'events')
  params.set('event_type', eventType)
  return `/explore/?${params.toString()}`
}

function allIncidentEventsHref() {
  const params = new URLSearchParams()
  params.set('view', 'events')
  for (const eventType of Object.keys(INCIDENT_EVENT_TYPE_LABELS)) params.append('event_type', eventType)
  return `/explore/?${params.toString()}`
}

export default function ExchangeIncidentTimelinePage() {
  const incidents = buildIncidentTimeline()
  const presentation = getPagePresentation('en', 'incidents')
  const groups = groupByYear(incidents)
  const affectedExchanges = new Set(incidents.map((item) => item.entity.id)).size
  const criticalEvents = incidents.filter((item) => item.event.impact_level === 'critical').length
  const linkedSources = incidents.reduce((total, item) => total + item.evidence.length, 0)
  const typeCounts = incidents.reduce<Map<string, { count: number; eventType: string }>>((counts, item) => {
    const label = incidentEventTypeLabel(item.event.event_type)
    const current = counts.get(label)
    counts.set(label, { count: (current?.count ?? 0) + 1, eventType: item.event.event_type })
    return counts
  }, new Map())
  const leadingTypes = [...typeCounts.entries()]
    .sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))
    .slice(0, 8)

  return (
    <main className={styles.page}>
      <section className="panel longform-panel">
        <div className={styles.headerRow}>
          <div>
            <p className="muted">{presentation.eyebrow}</p>
            <h2 className={styles.pageTitle}>{presentation.heading}</h2>
            <p className={styles.lead}>{presentation.intro}</p>
          </div>
          <div className={styles.headerActions}>
            <Link className="btn btn-primary" href={allIncidentEventsHref()}>Explore incident events</Link>
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
          {leadingTypes.map(([label, value]) => (
            <Link className={styles.breakdownItem} href={eventTypeHref(value.eventType)} key={label}>
              <span>{label}</span>
              <strong>{value.count}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.timeline} aria-label="Exchange incident history">
        {groups.map(([year, items]) => (
          <section className={styles.yearGroup} key={year} aria-labelledby={`incident-year-${year}`}>
            <div className={styles.yearHeader}><h3 id={`incident-year-${year}`}>{year}</h3><span>{items.length} event{items.length === 1 ? '' : 's'}</span></div>
            <div className={styles.timelineList}>
              {items.map(({ event, entity, evidence }) => (
                <article className={`panel ${styles.eventCard}`} key={event.id} id={event.id}>
                  <div className={styles.eventMeta}><time dateTime={event.event_date ?? undefined}>{event.event_date ? formatDate(event.event_date) : 'Unknown date'}</time><Link href={eventTypeHref(event.event_type)}>{incidentEventTypeLabel(event.event_type)}</Link><span>{event.impact_level}</span></div>
                  <div className={styles.exchangeRow}><Link href={`/exchange/${entity.slug}`}>{entity.canonical_name}</Link><span>{entity.type.toUpperCase()}</span><span>{entity.status}</span></div>
                  <h3>{event.title}</h3><p>{event.description}</p>
                  <div className={styles.factRow}><span>Status effect: <strong>{event.event_status_effect}</strong></span><span>Confidence: <strong>{event.confidence}</strong></span><span>Direct event-linked evidence: <strong>{evidence.length}</strong></span></div>
                  <div className={styles.linkRow}><Link href={`/exchange/${entity.slug}`}>Open exchange dossier</Link><Link href={eventTypeHref(event.event_type)}>Explore this event type</Link><a href={`#${event.id}`}>Permalink</a></div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </section>
    </main>
  )
}
