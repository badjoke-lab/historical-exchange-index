import { Suspense } from 'react'
import type { Metadata } from 'next'
import LocalizedPageHeader from '../../components/layout/localized-page-header'
import ActiveExplorerClient from '../../components/registry/active-explorer-client'
import { loadEntities } from '../../lib/data/load-entities'
import {
  buildLocalizedPageMetadata,
  getPagePresentation,
} from '../../lib/i18n/page-presentations'
import { CONTACT_HREF, SITE_NAME, SITE_URL } from '../../lib/site-constants'

const ACTIVE_SIDE = new Set<string>(['active', 'limited', 'inactive'])

function loadActiveEntities() {
  return loadEntities()
    .filter((item) => ACTIVE_SIDE.has(item.status))
    .sort((a, b) => a.canonical_name.localeCompare(b.canonical_name))
}

export function generateMetadata(): Metadata {
  const total = loadActiveEntities().length
  const presentation = getPagePresentation('en', 'active')
  return buildLocalizedPageMetadata({
    locale: 'en',
    page: 'active',
    pathname: '/active/',
    descriptionOverride: `${presentation.description} Current reviewed active-side records: ${total}.`,
  })
}

export default function ActivePage() {
  const entities = loadActiveEntities()
  const presentation = getPagePresentation('en', 'active')
  const summary = {
    total: entities.length,
    active: entities.filter((item) => item.status === 'active').length,
    limited: entities.filter((item) => item.status === 'limited').length,
    inactive: entities.filter((item) => item.status === 'inactive').length,
    liveVerified: entities.filter((item) => item.official_url_status === 'live_verified').length,
    archiveCoverage: entities.length > 0
      ? Math.round((entities.filter((item) => item.archived_url).length / entities.length) * 100)
      : 0,
  }
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/active/`,
    url: `${SITE_URL}/active/`,
    name: presentation.heading,
    description: presentation.description,
    numberOfItems: summary.total,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
  }

  return (
    <main className="longform">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <LocalizedPageHeader
        presentation={presentation}
        footer={(
          <p style={{ margin: '12px 0 0', fontWeight: 700 }}>
            Active-side total: {summary.total}
          </p>
        )}
        actions={(
          <a className="btn" href={CONTACT_HREF} target="_blank" rel="noreferrer">
            Contact / corrections
          </a>
        )}
      />

      <Suspense
        fallback={(
          <section className="panel table-panel">
            <div className="results-meta">
              <div>Loading registry…</div>
            </div>
          </section>
        )}
      >
        <ActiveExplorerClient entities={entities} summary={summary} />
      </Suspense>
    </main>
  )
}
