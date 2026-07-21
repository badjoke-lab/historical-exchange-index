import Link from 'next/link'
import {
  buildIncidentTimeline,
  INCIDENT_EVENT_TYPE_LABELS,
  incidentEventTypeLabel,
  type IncidentTimelineItem,
} from '../../lib/data/build-incident-timeline'
import { getPagePresentation } from '../../lib/i18n/page-presentations'
import {
  INCIDENT_PAGE_SIZE,
  incidentPageCount,
  incidentPageHref,
} from '../../lib/incidents/incident-pagination'
import { CONTACT_HREF } from '../../lib/site-constants'
import { formatDate } from '../../lib/utils/format-date'
import styles from '../../app/incidents/incidents.module.css'

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

function pageNumbers(currentPage: number, totalPages: number) {
  const values = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1])
  return [...values].filter((value) => value >= 1 && value <= totalPages).sort((a, b) => a - b)
}

export default function IncidentTimelinePage({ pageNumber }: { pageNumber: number }) {
  const incidents = buildIncidentTimeline()
  const totalPages = incidentPageCount()
  const startIndex = (pageNumber - 1) * INCIDENT_PAGE_SIZE
  const pageItems = incidents.slice(startIndex, startIndex + INCIDENT_PAGE_SIZE)
  const groups = groupByYear(pageItems)
  const presentation = getPagePresentation('en', 'incidents')
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
  const displayedStart = incidents.length === 0 ? 0 : startIndex + 1
  const displayedEnd = Math.min(startIndex + pageItems.length, incidents.length)
  const visiblePageNumbers = pageNumbers(pageNumber, totalPages)

  return (
    <main className={styles.page}>
      <section className="panel longform-panel">
        <div className={styles.headerRow}>
          <div>
            <p className="muted">{presentation.eyebrow}</p>
            <h1 className={styles.pageTitle}>{presentation.heading}</h1>
            <p className={styles.lead}>{presentation.intro}</p>
            <p className={styles.pagePosition}>Page {pageNumber} of {totalPages} · showing {displayedStart}–{displayedEnd} of {incidents.length}</p>
          </div>
          <div className={styles.headerActions}>
            <Link className="btn btn-primary" href={allIncidentEventsHref()}>Explore incident events</Link>
            <Link className="btn" href="/updates/">Registry Updates</Link>
            <Link className="btn" href="/methodology/">Methodology</Link>
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
          <h2>Incident mix</h2>
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

      <nav className={styles.pagination} aria-label="Incident pagination" data-incident-pagination>
        <div className={styles.paginationLinks}>
          {pageNumber > 1 ? <Link className="btn" href={incidentPageHref(pageNumber - 1)}>← Previous</Link> : <span className={styles.disabledPage}>← Previous</span>}
          {visiblePageNumbers.map((value, index) => {
            const previous = visiblePageNumbers[index - 1]
            return (
              <span className={styles.pageNumberGroup} key={value}>
                {previous && value - previous > 1 ? <span className={styles.paginationEllipsis}>…</span> : null}
                {value === pageNumber ? <span className={styles.currentPage} aria-current="page">{value}</span> : <Link className="btn" href={incidentPageHref(value)}>{value}</Link>}
              </span>
            )
          })}
          {pageNumber < totalPages ? <Link className="btn" href={incidentPageHref(pageNumber + 1)}>Next →</Link> : <span className={styles.disabledPage}>Next →</span>}
        </div>
        <span className={styles.paginationStatus}>Page {pageNumber} of {totalPages}</span>
      </nav>

      <section className={styles.timeline} aria-label="Exchange incident history">
        {groups.map(([year, items]) => (
          <section className={styles.yearGroup} key={year} aria-labelledby={`incident-year-${year}`}>
            <div className={styles.yearHeader}><h2 id={`incident-year-${year}`}>{year}</h2><span>{items.length} event{items.length === 1 ? '' : 's'} on this page</span></div>
            <div className={styles.yearItems}>
              {items.map(({ event, entity, evidence }) => (
                <article className={`panel ${styles.incidentCard}`} key={event.id} id={event.id}>
                  <div className={styles.incidentMeta}><time dateTime={event.event_date ?? undefined}>{event.event_date ? formatDate(event.event_date) : 'Unknown date'}</time><Link href={eventTypeHref(event.event_type)}>{incidentEventTypeLabel(event.event_type)}</Link><span>{event.impact_level}</span></div>
                  <div className={styles.exchangeRow}><Link href={`/exchange/${entity.slug}/`}>{entity.canonical_name}</Link><span>{entity.type.toUpperCase()}</span><span>{entity.status}</span></div>
                  <h3>{event.title}</h3><p className={styles.description}>{event.description}</p>
                  <div className={styles.eventFacts}><span>Status effect: <strong>{event.event_status_effect}</strong></span><span>Confidence: <strong>{event.confidence}</strong></span><span>Direct event-linked evidence: <strong>{evidence.length}</strong></span></div>
                  <div className={styles.recordLinkRow}><Link href={`/exchange/${entity.slug}/`}>Open exchange dossier</Link><Link href={eventTypeHref(event.event_type)}>Explore this event type</Link><a href={`#${event.id}`}>Permalink</a></div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </section>

      <nav className={styles.pagination} aria-label="Incident pagination bottom" data-incident-pagination>
        <div className={styles.paginationLinks}>
          {pageNumber > 1 ? <Link className="btn" href={incidentPageHref(pageNumber - 1)}>← Previous</Link> : null}
          <Link className="btn" href="/incidents/">First page</Link>
          {pageNumber < totalPages ? <Link className="btn" href={incidentPageHref(pageNumber + 1)}>Next →</Link> : null}
        </div>
        <span className={styles.paginationStatus}>Showing {displayedStart}–{displayedEnd} of {incidents.length}</span>
      </nav>
    </main>
  )
}
