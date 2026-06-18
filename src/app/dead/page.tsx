import { Suspense } from 'react'
import type { Metadata } from 'next'
import DeadExplorerClient from '../../components/registry/dead-explorer-client'
import { loadEntities } from '../../lib/data/load-entities'
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
  const description = `Browse ${total} dead-side crypto exchange records, including dead, merged, acquired, and rebranded exchanges with archive-aware handling.`

  return {
    title: 'Dead exchanges',
    description,
    alternates: { canonical: '/dead' },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/dead/`,
      title: `Dead exchanges | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      images: ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Dead exchanges | ${SITE_NAME}`,
      description,
      images: ['/twitter-image'],
    },
  }
}

export default function DeadPage() {
  const entities = loadDeadEntities()
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
    name: 'Dead-side exchange registry',
    description: `Collection of ${summary.total} dead-side crypto exchange records.`,
    numberOfItems: summary.total,
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
            <p className="muted" style={{ margin: '0 0 8px', fontSize: '12px' }}>Dead Exchanges</p>
            <h2 style={{ margin: '0 0 10px', fontSize: '34px', letterSpacing: '-0.04em' }}>Dead-side registry</h2>
            <p className="muted" style={{ lineHeight: 1.7, margin: 0, maxWidth: '64ch' }}>
              Closed, absorbed, rebranded, or otherwise gone exchanges. This page emphasizes death reason,
              archive access, and dense graveyard browsing.
            </p>
            <p style={{ margin: '12px 0 0', fontWeight: 700 }}>
              Dead-side total: {summary.total}
            </p>
          </div>

          <div className="hero-actions" style={{ marginTop: 0 }}>
            <a className="btn" href={CONTACT_HREF} target="_blank" rel="noreferrer">
              Contact / corrections
            </a>
          </div>
        </div>
      </section>

      <Suspense
        fallback={
          <section className="panel table-panel">
            <div className="results-meta">
              <div>Loading registry…</div>
            </div>
          </section>
        }
      >
        <DeadExplorerClient entities={entities} summary={summary} />
      </Suspense>
    </main>
  )
}
