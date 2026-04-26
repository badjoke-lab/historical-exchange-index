export const dynamic = 'force-static'

import type { MetadataRoute } from 'next'
import { loadEntities } from '../lib/data/load-entities'
import { SITE_URL } from '../lib/site-constants'

const STATIC_PAGE_LAST_MODIFIED = new Date('2026-04-26T00:00:00.000Z')

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: STATIC_PAGE_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/dead`,
      lastModified: STATIC_PAGE_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/active`,
      lastModified: STATIC_PAGE_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/stats`,
      lastModified: STATIC_PAGE_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/methodology`,
      lastModified: STATIC_PAGE_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: STATIC_PAGE_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/donate`,
      lastModified: STATIC_PAGE_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  const entityRoutes: MetadataRoute.Sitemap = loadEntities().map((entity) => ({
    url: `${SITE_URL}/exchange/${entity.slug}`,
    lastModified: entity.last_verified_at ? new Date(entity.last_verified_at) : STATIC_PAGE_LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...entityRoutes]
}
