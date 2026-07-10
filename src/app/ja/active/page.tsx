import { Suspense } from 'react'
import type { Metadata } from 'next'
import JapanesePilotSurface from '../../../components/i18n/japanese-pilot-surface'
import ActiveExplorerClient from '../../../components/registry/active-explorer-client'
import { loadEntities } from '../../../lib/data/load-entities'
import { buildLocalizedPageMetadata, getPagePresentation } from '../../../lib/i18n/page-presentations'

const ACTIVE_SIDE = new Set<string>(['active', 'limited', 'inactive'])

export function generateMetadata(): Metadata {
  return buildLocalizedPageMetadata({ locale: 'ja', page: 'active', pathname: '/active/' })
}

export default function JapaneseActivePage() {
  const entities = loadEntities()
    .filter((item) => ACTIVE_SIDE.has(item.status))
    .sort((a, b) => a.canonical_name.localeCompare(b.canonical_name))
  const summary = {
    total: entities.length,
    active: entities.filter((item) => item.status === 'active').length,
    limited: entities.filter((item) => item.status === 'limited').length,
    inactive: entities.filter((item) => item.status === 'inactive').length,
    liveVerified: entities.filter((item) => item.official_url_status === 'live_verified').length,
    archiveCoverage: entities.length > 0 ? Math.round((entities.filter((item) => item.archived_url).length / entities.length) * 100) : 0,
  }

  return (
    <JapanesePilotSurface presentation={getPagePresentation('ja', 'active')} englishHref="/active/">
      <Suspense fallback={<section className="panel table-panel"><div className="results-meta"><div>レジストリを読み込み中…</div></div></section>}>
        <ActiveExplorerClient entities={entities} summary={summary} />
      </Suspense>
    </JapanesePilotSurface>
  )
}
