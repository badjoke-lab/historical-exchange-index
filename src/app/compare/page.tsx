import { Suspense } from 'react'
import type { Metadata } from 'next'
import CompareClient from '../../components/compare/compare-client'
import { buildCompareContext } from '../../lib/compare/compare-context'
import { loadEntities } from '../../lib/data/load-entities'
import { loadEvents } from '../../lib/data/load-events'
import { loadEvidence } from '../../lib/data/load-evidence'
import { SITE_NAME, SITE_URL } from '../../lib/site-constants'

export function generateMetadata(): Metadata {
  const entities = loadEntities()
  const description = `Compare reviewed lifecycle facts across ${entities.length} Historical Exchange Index entities using deterministic, shareable URL state.`

  return {
    title: 'Compare',
    description,
    alternates: { canonical: '/compare' },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/compare/`,
      title: `Compare | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      images: ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Compare | ${SITE_NAME}`,
      description,
      images: ['/twitter-image'],
    },
  }
}

export default function ComparePage() {
  const entities = loadEntities()
  const events = loadEvents()
  const evidence = loadEvidence()
  const context = buildCompareContext(entities, events, evidence)

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/compare/`,
    url: `${SITE_URL}/compare/`,
    name: 'HEI Compare',
    description: 'Side-by-side comparison of reviewed Historical Exchange Index entity lifecycle facts.',
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
  }

  return (
    <main className="longform">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />

      <section className="panel longform-panel">
        <div className="detail-header">
          <div>
            <p className="muted" style={{ margin: '0 0 8px', fontSize: '12px' }}>Research layer</p>
            <h2 style={{ margin: '0 0 10px', fontSize: '34px', letterSpacing: '-0.04em' }}>Compare</h2>
            <p className="muted" style={{ lineHeight: 1.7, margin: 0, maxWidth: '72ch' }}>
              Inspect reviewed exchange identity, lifecycle, archive state, coverage, and major events side by side. Compare uses reviewed public records and deterministic derived values only.
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={<section className="panel table-panel"><div className="results-meta"><div>Loading comparison state…</div></div></section>}>
        <CompareClient entities={entities} context={context} />
      </Suspense>
    </main>
  )
}
