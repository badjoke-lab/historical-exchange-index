import Link from 'next/link'
import type { Metadata } from 'next'
import JapanesePilotSurface from '../../../components/i18n/japanese-pilot-surface'
import { buildIncidentTimeline, incidentEventTypeLabel } from '../../../lib/data/build-incident-timeline'
import { buildLocalizedPageMetadata, getPagePresentation } from '../../../lib/i18n/page-presentations'
import { formatDate } from '../../../lib/utils/format-date'

export function generateMetadata(): Metadata {
  return buildLocalizedPageMetadata({ locale: 'ja', page: 'incidents', pathname: '/incidents/' })
}

export default function JapaneseIncidentsPage() {
  const incidents = buildIncidentTimeline()
  const affectedExchanges = new Set(incidents.map((item) => item.entity.id)).size
  const criticalEvents = incidents.filter((item) => item.event.impact_level === 'critical').length

  return (
    <JapanesePilotSurface presentation={getPagePresentation('ja', 'incidents')} englishHref="/incidents/">
      <section className="panel summary-strip">
        <div className="summary-tile"><div className="label">Timeline events</div><div className="value">{incidents.length}</div><div className="hint">レビュー済み</div></div>
        <div className="summary-tile"><div className="label">Affected exchanges</div><div className="value">{affectedExchanges}</div><div className="hint">entity count</div></div>
        <div className="summary-tile"><div className="label">Critical events</div><div className="value">{criticalEvents}</div><div className="hint">impact level critical</div></div>
      </section>

      <section className="panel longform-panel">
        <div className="section" style={{ borderTop: 'none', paddingTop: 0 }}>
          <h3>最近のレビュー済みインシデント</h3>
          <div className="record-list">
            {incidents.slice(0, 12).map(({ event, entity }) => (
              <article className="record-item" key={event.id}>
                <div className="record-top">
                  <div className="record-main">
                    <Link className="record-title subtle-link" href={`/ja/exchange/${entity.slug}/`}>{entity.canonical_name}</Link>
                    <div className="record-meta"><span>{event.event_date ? formatDate(event.event_date) : 'Unknown date'}</span><span>{incidentEventTypeLabel(event.event_type)}</span><span>{event.impact_level}</span></div>
                    <p className="muted" style={{ marginBottom: 0 }}>{event.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </JapanesePilotSurface>
  )
}
