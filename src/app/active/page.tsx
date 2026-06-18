import { Suspense } from 'react'
import type { Metadata } from 'next'
import ActiveExplorerClient from '../../components/registry/active-explorer-client'
import { loadEntities } from '../../lib/data/load-entities'
import { CONTACT_HREF, SITE_NAME, SITE_URL } from '../../lib/site-constants'

const ACTIVE_SIDE = new Set<string>(['active', 'limited', 'inactive'])

function loadActiveEntities() {
  return loadEntities()
    .filter((item) => ACTIVE_SIDE.has(item.status))
    .sort((a, b) => a.canonical_name.localeCompare(b.canonical_name))
}

export function generateMetadata(): Metadata {
  const total = loadActiveEntities().length
  const description = `Browse ${total} active-side crypto exchange records, including active, limited, and inactive entries with URL handling and launch timing.`

  return {
    title: 'Active exchanges',
    description,
    alternates: { canonical: '/active' },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/active/`,
      title: `Active exchanges | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      images: ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Active exchanges | ${SITE_NAME}`,
      description,
      images: ['/twitter-image'],
    },
  }
}

export default function ActivePage() {
  const entities = loadActiveEntities()
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
    name: 'Active-side exchange registry',
    description: `Collection of ${summary.total} active-side crypto exchange records.`,
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
            <p className="muted" style={{ margin: '0 0 8px', fontSize: '12px' }}>Active Exchanges</p>
            <h2 style={{ margin: '0 0 10px', fontSize: '34px', letterSpacing: '-0.04em' }}>Active-side registry</h2>
            <p className="muted" style={{ lineHeight: 1.7, margin: 0, maxWidth: '64ch' }}>
              Active, limited, and inactive-side entries. This page emphasizes active-side classification,
              URL status clarity, and launch timing without turning the registry into a ranking page.
            </p>
            <p style={{ margin: '12px 0 0', fontWeight: 700 }}>
              Active-side total: {summary.total}
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
        <ActiveExplorerClient entities={entities} summary={summary} />
      </Suspense>
    </main>
  )
}
