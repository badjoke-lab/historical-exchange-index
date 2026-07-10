import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import EntityExplorerClient from '../../components/explorer/entity-explorer-client'
import { loadEntities } from '../../lib/data/load-entities'
import { loadEvents } from '../../lib/data/load-events'
import {
  buildLocalizedPageMetadata,
  getPagePresentation,
} from '../../lib/i18n/page-presentations'
import { SITE_NAME, SITE_URL } from '../../lib/site-constants'

export function generateMetadata(): Metadata {
  const entities = loadEntities()
  const presentation = getPagePresentation('en', 'explore')
  return buildLocalizedPageMetadata({
    locale: 'en',
    page: 'explore',
    pathname: '/explore/',
    descriptionOverride: `${presentation.description} Current reviewed entity count: ${entities.length}.`,
  })
}

export default function ExplorePage() {
  const entities = loadEntities()
  const events = loadEvents()
  const presentation = getPagePresentation('en', 'explore')
  const reviewedOrigins = [...new Set(
    entities
      .map((entity) => entity.country_or_origin)
      .filter((value): value is string => Boolean(value)),
  )].sort((a, b) => a.localeCompare(b))

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/explore/`,
    url: `${SITE_URL}/explore/`,
    name: presentation.heading,
    description: presentation.description,
    numberOfItems: entities.length + events.length,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
  }

  return (
    <main className="longform">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />

      <section className="panel longform-panel">
        <div className="detail-header">
          <div>
            <p className="muted" style={{ margin: '0 0 8px', fontSize: '12px' }}>{presentation.eyebrow}</p>
            <h2 style={{ margin: '0 0 10px', fontSize: '34px', letterSpacing: '-0.04em' }}>{presentation.heading}</h2>
            <p className="muted" style={{ lineHeight: 1.7, margin: 0, maxWidth: '72ch' }}>
              {presentation.intro}
            </p>
          </div>
        </div>
        <nav aria-label="Related HEI surfaces" style={{ marginTop: '16px' }}>
          <Link className="subtle-link" href="/compare/">Open Compare</Link>
        </nav>
      </section>

      <Suspense fallback={<section className="panel table-panel"><div className="results-meta"><div>Loading Explorer query state…</div></div></section>}>
        <EntityExplorerClient entities={entities} events={events} reviewedOrigins={reviewedOrigins} />
      </Suspense>
    </main>
  )
}
