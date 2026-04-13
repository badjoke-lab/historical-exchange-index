export const dynamic = 'force-static'

import type { MetadataRoute } from 'next'
import { loadEntities } from '../lib/data/load-entities'
import { SITE_URL } from '../lib/site-constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/dead`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/active`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/methodology`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/donate`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  const entityRoutes: MetadataRoute.Sitemap = loadEntities().map((entity) => ({
    url: `${SITE_URL}/exchange/${entity.slug}`,
    lastModified: entity.last_verified_at ? new Date(entity.last_verified_at) : now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...entityRoutes]
}
