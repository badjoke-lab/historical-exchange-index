export const dynamic = 'force-static'

import type { MetadataRoute } from 'next'
import { loadEntities } from '../lib/data/load-entities'
import { SITE_URL } from '../lib/site-constants'

function latestReviewedDate(entities: ReturnType<typeof loadEntities>) {
  const dates = entities
    .map((entity) => entity.last_verified_at)
    .filter((value): value is string => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value))
    .sort()
  return new Date(`${dates.at(-1) ?? '2026-04-26'}T00:00:00.000Z`)
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entities = loadEntities()
  const registryLastModified = latestReviewedDate(entities)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: registryLastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/dead/`, lastModified: registryLastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/active/`, lastModified: registryLastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/stats/`, lastModified: registryLastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/quality/`, lastModified: registryLastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/updates/`, lastModified: registryLastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/incidents/`, lastModified: registryLastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/methodology/`, lastModified: registryLastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/about/`, lastModified: registryLastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/donate/`, lastModified: registryLastModified, changeFrequency: 'monthly', priority: 0.4 },
  ]

  const entityRoutes: MetadataRoute.Sitemap = entities.map((entity) => ({
    url: `${SITE_URL}/exchange/${entity.slug}/`,
    lastModified: entity.last_verified_at ? new Date(`${entity.last_verified_at}T00:00:00.000Z`) : registryLastModified,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...entityRoutes]
}
