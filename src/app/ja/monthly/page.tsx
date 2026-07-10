import Link from 'next/link'
import type { Metadata } from 'next'
import JapanesePilotSurface from '../../../components/i18n/japanese-pilot-surface'
import { buildMonthlyHistoricalSnapshot } from '../../../lib/data/build-monthly-historical-snapshot'
import { buildLocalizedPageMetadata, getPagePresentation } from '../../../lib/i18n/page-presentations'

export function generateMetadata(): Metadata {
  return buildLocalizedPageMetadata({ locale: 'ja', page: 'monthly', pathname: '/monthly/' })
}

export default function JapaneseMonthlyPage() {
  const snapshot = buildMonthlyHistoricalSnapshot()

  return (
    <JapanesePilotSurface presentation={getPagePresentation('ja', 'monthly')} englishHref="/monthly/">
      <section className="panel longform-panel">
        <div className="section" style={{ borderTop: 'none', paddingTop: 0 }}>
          <p className="muted">対象月</p>
          <h3 style={{ fontSize: '30px', marginTop: 0 }}>{snapshot.monthLabel}</h3>
          <p className="muted">{snapshot.periodStart} から {snapshot.periodEnd} までのレビュー済みeventを対象にします。</p>
        </div>
      </section>

      <section className="panel summary-strip">
        <div className="summary-tile"><div className="label">Recorded events</div><div className="value">{snapshot.summary.events}</div><div className="hint">reviewed events</div></div>
        <div className="summary-tile"><div className="label">Affected exchanges</div><div className="value">{snapshot.summary.affectedExchanges}</div><div className="hint">entity count</div></div>
        <div className="summary-tile"><div className="label">Critical / high</div><div className="value">{snapshot.summary.criticalOrHighEvents}</div><div className="hint">impact levels</div></div>
        <div className="summary-tile"><div className="label">Event-linked evidence</div><div className="value">{snapshot.summary.eventLinkedEvidence}</div><div className="hint">direct evidence links</div></div>
      </section>

      <section className="panel longform-panel">
        <div className="section" style={{ borderTop: 'none', paddingTop: 0 }}>
          <h3>月次event一覧</h3>
          <div className="record-list">
            {snapshot.items.slice(0, 12).map(({ event, entity }) => (
              <article className="record-item" key={event.id}>
                <div className="record-top">
                  <div className="record-main">
                    <Link className="record-title subtle-link" href={`/ja/exchange/${entity.slug}/`}>{entity.canonical_name}</Link>
                    <div className="record-meta"><span>{event.event_date ?? 'Unknown date'}</span><span>{event.event_type}</span><span>{event.impact_level}</span></div>
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
