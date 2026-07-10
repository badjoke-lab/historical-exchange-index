import { Suspense } from 'react'
import type { Metadata } from 'next'
import JapanesePilotSurface from '../../../components/i18n/japanese-pilot-surface'
import EntityExplorerClient from '../../../components/explorer/entity-explorer-client'
import { loadEntities } from '../../../lib/data/load-entities'
import { loadEvents } from '../../../lib/data/load-events'
import { buildLocalizedPageMetadata, getPagePresentation } from '../../../lib/i18n/page-presentations'

export function generateMetadata(): Metadata {
  return buildLocalizedPageMetadata({ locale: 'ja', page: 'explore', pathname: '/explore/' })
}

export default function JapaneseExplorePage() {
  const entities = loadEntities()
  const events = loadEvents()
  const reviewedOrigins = [...new Set(
    entities
      .map((entity) => entity.country_or_origin)
      .filter((value): value is string => Boolean(value)),
  )].sort((a, b) => a.localeCompare(b))

  return (
    <JapanesePilotSurface presentation={getPagePresentation('ja', 'explore')} englishHref="/explore/">
      <Suspense fallback={<section className="panel table-panel"><div className="results-meta"><div>クエリ状態を読み込み中…</div></div></section>}>
        <EntityExplorerClient entities={entities} events={events} reviewedOrigins={reviewedOrigins} />
      </Suspense>
    </JapanesePilotSurface>
  )
}
