export const DEFAULT_SITE_URL = 'https://hei.badjoke-lab.com';

export function getSiteUrl() {
  return String(process.env.HEI_MONITORING_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');
}

export const STATIC_SITE_ROUTES = [
  { path: '/', label: 'Home', expected_status: 200, required: true },
  { path: '/dead', label: 'Dead list', expected_status: 200, required: true },
  { path: '/active', label: 'Active list', expected_status: 200, required: true },
  { path: '/stats', label: 'Stats', expected_status: 200, required: true },
  { path: '/methodology', label: 'Methodology', expected_status: 200, required: true },
  { path: '/about', label: 'About', expected_status: 200, required: true },
  { path: '/donate', label: 'Donate', expected_status: 200, required: false },
  { path: '/sitemap.xml', label: 'Sitemap', expected_status: 200, required: true },
  { path: '/robots.txt', label: 'Robots', expected_status: 200, required: true },
];

export function buildUrl(siteUrl, routePath) {
  if (routePath === '/') return `${siteUrl}/`;
  return `${siteUrl}${routePath.startsWith('/') ? routePath : `/${routePath}`}`;
}

export function getSampleExchangeRoutes(entities = [], limit = 3) {
  return entities
    .filter((entity) => entity?.slug)
    .slice(0, limit)
    .map((entity) => ({
      path: `/exchange/${entity.slug}`,
      label: `Exchange: ${entity.canonical_name || entity.slug}`,
      expected_status: 200,
      required: true,
      entity_id: entity.id,
      slug: entity.slug,
    }));
}

export function getSiteRoutes(entities = []) {
  const sampleLimit = Number.parseInt(process.env.HEI_MONITORING_SITE_SAMPLE_EXCHANGE_LIMIT || '3', 10);
  return [
    ...STATIC_SITE_ROUTES,
    ...getSampleExchangeRoutes(entities, Number.isFinite(sampleLimit) ? sampleLimit : 3),
  ];
}
