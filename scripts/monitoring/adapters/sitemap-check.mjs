import { checkHttpUrl } from './http-check.mjs';

function decodeXml(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function extractLocs(xml) {
  return [...String(xml || '').matchAll(/<loc>([\s\S]*?)<\/loc>/gi)]
    .map((match) => decodeXml(match[1]))
    .filter(Boolean);
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'HEI-Monitoring/0.1' },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
  return response.text();
}

export async function checkSitemap({ sitemapUrl, siteUrl, entities = [], requiredStaticRoutes = [] }) {
  const health = await checkHttpUrl(sitemapUrl, { timeoutMs: 15000, maxBodyChars: 2000 });
  if (health.status !== 'ok') {
    return {
      sitemap_url: sitemapUrl,
      status: health.status,
      http_status: health.http_status,
      error: health.error,
      urls: [],
      expected_exchange_routes: entities.length,
      actual_exchange_routes: 0,
      missing_static_routes: requiredStaticRoutes,
    };
  }

  const xml = await fetchText(sitemapUrl);
  const urls = extractLocs(xml);
  const normalizedSiteUrl = String(siteUrl || '').replace(/\/+$/, '');
  const exchangePrefix = `${normalizedSiteUrl}/exchange/`;
  const actualExchangeRoutes = urls.filter((url) => url.startsWith(exchangePrefix)).length;
  const missingStaticRoutes = requiredStaticRoutes.filter((route) => {
    const normalizedRoute = route === '/' ? '/' : route.replace(/\/+$/, '');
    const expected = normalizedRoute === '/' ? `${normalizedSiteUrl}/` : `${normalizedSiteUrl}${normalizedRoute}`;
    return !urls.includes(expected);
  });

  return {
    sitemap_url: sitemapUrl,
    status: 'ok',
    http_status: 200,
    error: null,
    urls,
    expected_exchange_routes: entities.length,
    actual_exchange_routes: actualExchangeRoutes,
    missing_static_routes: missingStaticRoutes,
  };
}
