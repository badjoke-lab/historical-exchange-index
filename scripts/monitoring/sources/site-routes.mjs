const DEFAULT_SITE_URL = 'https://hei.badjoke-lab.com';

export const SITE_SEO_WATCH_ENABLED = process.env.HEI_MONITORING_ENABLE_SITE_SEO_CHECKS === '1';
export const MONITORING_SITE_URL = (process.env.HEI_MONITORING_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');

export const STATIC_ROUTES = [
  '/',
  '/dead',
  '/active',
  '/stats',
  '/methodology',
  '/about',
  '/donate',
];

export const REQUIRED_SITEMAP_STATIC_ROUTES = [
  '/',
  '/dead',
  '/active',
  '/stats',
  '/methodology',
  '/about',
  '/donate',
];

export function routeUrl(route, siteUrl = MONITORING_SITE_URL) {
  const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
  return `${siteUrl}${normalizedRoute}`;
}

export function getRouteCheckTargets(entities = []) {
  const sampleEntity = entities.find((entity) => entity?.slug) || null;
  const routeTargets = STATIC_ROUTES.map((route) => ({
    route,
    url: routeUrl(route),
    kind: 'static_route',
  }));

  if (sampleEntity) {
    routeTargets.push({
      route: `/exchange/${sampleEntity.slug}`,
      url: routeUrl(`/exchange/${sampleEntity.slug}`),
      kind: 'sample_exchange_route',
      entity_id: sampleEntity.id,
      slug: sampleEntity.slug,
    });
  }

  return routeTargets;
}

export function getSitemapUrl(siteUrl = MONITORING_SITE_URL) {
  return `${siteUrl}/sitemap.xml`;
}

export function getRobotsUrl(siteUrl = MONITORING_SITE_URL) {
  return `${siteUrl}/robots.txt`;
}
