import { Suspense } from 'react'
import type { Metadata } from 'next'
import LocalizedPageHeader from '../../components/layout/localized-page-header'
import DeadExplorerClient from '../../components/registry/dead-explorer-client'
import { loadEntities } from '../../lib/data/load-entities'
import {
  buildLocalizedPageMetadata,
  getPagePresentation,
} from '../../lib/i18n/page-presentations'
import { CONTACT_HREF, SITE_NAME, SITE_URL } from '../../lib/site-constants'

const DEAD_SIDE = new Set<string>(['dead', 'merged', 'acquired', 'rebranded'])

function loadDeadEntities() {
  return loadEntities()
    .filter((item) => DEAD_SIDE.has(item.status))
    .sort((a, b) => {
      const aDate = a.death_date ?? ''
      const bDate = b.death_date ?? ''
      if (aDate !== bDate) return aDate < bDate ? 1 : -1
      return a.canonical_name.localeCompare(b.canonical_name)
    })
}

export function generateMetadata(): Metadata {
  const total = loadDeadEntities().length
  const presentation = getPagePresentation('en', 'dead')
  return buildLocalizedPageMetadata({
    locale: 'en',
    page: 'dead',
    pathname: '/dead/',
    descriptionOverride: `${presentation.description} Current reviewed dead-side records: ${total}.`,
  })
}

export default function DeadPage() {
  const entities = loadDeadEntities()
  const presentation = getPagePresentation('en', 'dead')
  const summary = {
    total: entities.length,
    dead: entities.filter((item) => item.status === 'dead').length,
    merged: entities.filter((item) => item.status === 'merged').length,
    acquired: entities.filter((item) => item.status === 'acquired').length,
    rebranded: entities.filter((item) => item.status === 'rebranded').length,
    archiveCoverage: entities.length > 0
      ? Math.round((entities.filter((item) => item.archived_url).length / entities.length) * 100)
      : 0,
  }
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/dead/`,
    url: `${SITE_URL}/dead/`,
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
            Dead-side total: {summary.total}
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
        <DeadExplorerClient entities={entities} summary={summary} />
      </Suspense>
    </main>
  )
}
