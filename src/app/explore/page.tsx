import { Suspense } from 'react'
import type { Metadata } from 'next'
import EntityExplorerClient from '../../components/explorer/entity-explorer-client'
import { loadEntities } from '../../lib/data/load-entities'
import { SITE_NAME, SITE_URL } from '../../lib/site-constants'

export function generateMetadata(): Metadata {
  const entities = loadEntities()
  const description = `Filter and research ${entities.length} reviewed crypto exchange entities by type, status, lifecycle dates, URL state, confidence, origin, and archive availability.`

  return {
    title: 'Explorer',
    description,
    alternates: { canonical: '/explore' },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/explore/`,
      title: `Explorer | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      images: ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Explorer | ${SITE_NAME}`,
      description,
      images: ['/twitter-image'],
    },
  }
}

export default function ExplorePage() {
  const entities = loadEntities()
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
    name: 'HEI Explorer',
    description: `Research interface for ${entities.length} reviewed Historical Exchange Index entity records.`,
    numberOfItems: entities.length,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
  }

  return (
    <main className="longform">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <section className="panel longform-panel">
        <div className="detail-header">
          <div>
            <p className="muted" style={{ margin: '0 0 8px', fontSize: '12px' }}>Research layer</p>
            <h2 style={{ margin: '0 0 10px', fontSize: '34px', letterSpacing: '-0.04em' }}>Explorer</h2>
            <p className="muted" style={{ lineHeight: 1.7, margin: 0, maxWidth: '72ch' }}>
              Build deterministic, shareable queries over reviewed HEI records. Entity Explorer is active now;
              Event Explorer follows on the same fixed query contract in E5-3.
            </p>
          </div>
        </div>
      </section>

      <Suspense
        fallback={
          <section className="panel table-panel">
            <div className="results-meta"><div>Loading Explorer query state…</div></div>
          </section>
        }
      >
        <EntityExplorerClient entities={entities} reviewedOrigins={reviewedOrigins} />
      </Suspense>
    </main>
  )
}
