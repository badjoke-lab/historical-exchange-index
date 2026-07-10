import type { Metadata } from 'next'
import JapanesePilotSurface from '../../../components/i18n/japanese-pilot-surface'
import { buildQualitySummary } from '../../../lib/data/build-quality-summary'
import { buildLocalizedPageMetadata, getPagePresentation } from '../../../lib/i18n/page-presentations'

export function generateMetadata(): Metadata {
  return buildLocalizedPageMetadata({ locale: 'ja', page: 'quality', pathname: '/quality/' })
}

export default function JapaneseQualityPage() {
  const summary = buildQualitySummary()

  return (
    <JapanesePilotSurface presentation={getPagePresentation('ja', 'quality')} englishHref="/quality/">
      <section className="panel summary-strip">
        <div className="summary-tile"><div className="label">Entities</div><div className="value">{summary.totals.entities}</div><div className="hint">レビュー済み</div></div>
        <div className="summary-tile"><div className="label">Events</div><div className="value">{summary.totals.events}</div><div className="hint">公開event</div></div>
        <div className="summary-tile"><div className="label">Evidence</div><div className="value">{summary.totals.evidence}</div><div className="hint">公開evidence</div></div>
        <div className="summary-tile"><div className="label">Generated</div><div className="value">{summary.generatedAt.slice(0, 10)}</div><div className="hint">quality snapshot</div></div>
      </section>

      <section className="home-entry-grid">
        {summary.headline.slice(0, 4).map((item) => (
          <section className="panel home-entry-card" key={item.key}>
            <div className="home-section-copy"><h3>{item.label}</h3><p>{item.note ?? '—'}</p></div>
            <strong style={{ fontSize: '28px' }}>{item.value}</strong>
          </section>
        ))}
      </section>
    </JapanesePilotSurface>
  )
}
