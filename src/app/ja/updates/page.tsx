import Link from 'next/link'
import type { Metadata } from 'next'
import JapanesePilotSurface from '../../../components/i18n/japanese-pilot-surface'
import { loadRegistryUpdates } from '../../../lib/data/load-registry-updates'
import { buildLocalizedPageMetadata, getPagePresentation } from '../../../lib/i18n/page-presentations'

export function generateMetadata(): Metadata {
  const base = buildLocalizedPageMetadata({ locale: 'ja', page: 'updates', pathname: '/updates/' })
  return {
    ...base,
    alternates: {
      ...base.alternates,
      types: {
        'application/feed+json': '/feeds/updates.json',
        'application/rss+xml': '/feeds/updates.xml',
      },
    },
  }
}

export default function JapaneseUpdatesPage() {
  const updates = loadRegistryUpdates()

  return (
    <JapanesePilotSurface presentation={getPagePresentation('ja', 'updates')} englishHref="/updates/">
      <section className="panel longform-panel">
        <div className="section" style={{ borderTop: 'none', paddingTop: 0 }}>
          <h3>最新のレビュー済み更新</h3>
          <div className="record-list">
            {updates.slice(0, 8).map((update) => (
              <article className="record-item" key={update.id}>
                <div className="record-top">
                  <div className="record-main">
                    <strong className="record-title">{update.title}</strong>
                    <div className="record-meta"><span>{update.date}</span><span>{update.update_type}</span></div>
                    <p className="muted" style={{ marginBottom: 0 }}>{update.summary}</p>
                  </div>
                  <Link className="btn btn-compact" href={`/updates/#${update.id}`}>English detail</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </JapanesePilotSurface>
  )
}
