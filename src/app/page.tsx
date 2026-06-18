import type { Metadata } from 'next'
import HomeHubClient from '../components/home/home-hub-client'
import { buildRegistryView } from '../lib/data/build-registry-view'
import { SITE_NAME, SITE_URL } from '../lib/site-constants'

export function generateMetadata(): Metadata {
  const { summary } = buildRegistryView()
  const description = `Historical registry of ${summary.total} crypto exchanges: ${summary.deadSide} dead-side and ${summary.activeSide} active-side records, with timeline events and evidence.`

  return {
    title: SITE_NAME,
    description,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      url: SITE_URL,
      title: SITE_NAME,
      description,
      siteName: SITE_NAME,
      images: ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description,
      images: ['/twitter-image'],
    },
  }
}

export default function HomePage() {
  const { entities, summary } = buildRegistryView()
  const archiveCoverage = entities.length > 0
    ? Math.round((entities.filter((item) => item.archived_url).length / entities.length) * 100)
    : 0
  const reviewedDates = entities.map((entity) => entity.last_verified_at).filter(Boolean).sort()
  const lastReviewedAt = reviewedDates.at(-1) ?? null
  const datasetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `${SITE_URL}/#dataset`,
    name: SITE_NAME,
    description: `Historical registry of ${summary.total} crypto exchanges, including ${summary.deadSide} dead-side and ${summary.activeSide} active-side records.`,
    url: SITE_URL,
    dateModified: lastReviewedAt,
    isAccessibleForFree: true,
    distribution: [
      { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${SITE_URL}/data/entities.json` },
      { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${SITE_URL}/data/events.json` },
      { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${SITE_URL}/data/evidence.json` },
    ],
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Total records', value: summary.total },
      { '@type': 'PropertyValue', name: 'Dead-side', value: summary.deadSide },
      { '@type': 'PropertyValue', name: 'Active-side', value: summary.activeSide },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
      />
      <HomeHubClient
        entities={entities}
        summary={summary}
        archiveCoverage={archiveCoverage}
      />
    </>
  )
}
