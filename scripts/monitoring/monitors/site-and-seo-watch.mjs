import { createFinding, createMonitorResult } from '../core/finding-utils.mjs';
import { checkHttpUrl } from '../adapters/http-check.mjs';
import { checkSitemap } from '../adapters/sitemap-check.mjs';
import {
  SITE_SEO_WATCH_ENABLED,
  MONITORING_SITE_URL,
  REQUIRED_SITEMAP_STATIC_ROUTES,
  getRouteCheckTargets,
  getRobotsUrl,
  getSitemapUrl,
} from '../sources/site-routes.mjs';

function severityForRoute(check) {
  if (check.status === 'ok' || check.status === 'redirected') return 'low';
  if (['not_found', 'server_error', 'dns_failure', 'tls_failure', 'timeout'].includes(check.status)) return 'critical';
  return 'high';
}

function routeAction(check) {
  if (check.status === 'ok') return 'no_action';
  if (check.status === 'redirected') return 'review_redirect_target';
  if (['dns_failure', 'tls_failure'].includes(check.status)) return 'inspect_site_domain_or_tls';
  if (check.status === 'not_found') return 'inspect_route_or_deploy';
  if (['server_error', 'timeout'].includes(check.status)) return 'inspect_runtime_or_hosting';
  return 'inspect_site_health';
}

function addRouteFinding(findings, monitor, target, check) {
  if (check.status === 'ok') return;
  findings.push(createFinding({
    monitor,
    severity: severityForRoute(check),
    category: `site_route_${check.status}`,
    title: `Site route check ${check.status}: ${target.route}`,
    summary: `${target.url} -> ${check.status}${check.http_status ? ` HTTP ${check.http_status}` : ''}${check.error ? ` error=${check.error}` : ''}`,
    recommended_action: routeAction(check),
    source_urls: [target.url],
    confidence: 'medium',
    dedupe_key: `${monitor}:site_route:${target.route}:${check.status}`,
  }));
}

function addSitemapFindings(findings, monitor, sitemapResult) {
  if (sitemapResult.status !== 'ok') {
    findings.push(createFinding({
      monitor,
      severity: 'critical',
      category: `sitemap_${sitemapResult.status}`,
      title: `Sitemap check failed: ${sitemapResult.status}`,
      summary: `${sitemapResult.sitemap_url} -> ${sitemapResult.status}${sitemapResult.http_status ? ` HTTP ${sitemapResult.http_status}` : ''}${sitemapResult.error ? ` error=${sitemapResult.error}` : ''}`,
      recommended_action: 'inspect_sitemap_route_or_deploy',
      source_urls: [sitemapResult.sitemap_url],
      confidence: 'medium',
      dedupe_key: `${monitor}:sitemap:${sitemapResult.status}`,
    }));
    return;
  }

  if (sitemapResult.missing_static_routes.length > 0) {
    findings.push(createFinding({
      monitor,
      severity: 'high',
      category: 'sitemap_missing_static_routes',
      title: 'Sitemap is missing required static routes',
      summary: sitemapResult.missing_static_routes.join(', '),
      recommended_action: 'inspect_sitemap_generation',
      source_urls: [sitemapResult.sitemap_url],
      confidence: 'high',
      dedupe_key: `${monitor}:sitemap_missing_static_routes`,
    }));
  }

  if (sitemapResult.actual_exchange_routes !== sitemapResult.expected_exchange_routes) {
    findings.push(createFinding({
      monitor,
      severity: 'high',
      category: 'sitemap_exchange_route_count_mismatch',
      title: 'Sitemap exchange route count does not match entity count',
      summary: `expected=${sitemapResult.expected_exchange_routes}, actual=${sitemapResult.actual_exchange_routes}`,
      recommended_action: 'inspect_sitemap_entity_route_generation',
      source_urls: [sitemapResult.sitemap_url],
      confidence: 'high',
      dedupe_key: `${monitor}:sitemap_exchange_route_count_mismatch`,
    }));
  }
}

export async function runSiteAndSeoWatch(context, { startedAt } = {}) {
  const monitor = 'site-and-seo-watch';
  const started_at = startedAt || new Date().toISOString();
  const findings = [];
  const errors = [];
  const entities = context?.canonicalData?.entities || [];

  if (!SITE_SEO_WATCH_ENABLED) {
    findings.push(createFinding({
      monitor,
      severity: 'low',
      category: 'site_seo_watch_disabled',
      title: 'Site and SEO checks are disabled',
      summary: 'Set HEI_MONITORING_ENABLE_SITE_SEO_CHECKS=1 to enable route, sitemap, and robots checks.',
      recommended_action: 'enable_site_seo_checks_when_ready_for_scheduled_external_checks',
      confidence: 'medium',
      dedupe_key: `${monitor}:site_seo_checks_disabled`,
    }));

    return createMonitorResult({
      monitor,
      started_at,
      finished_at: new Date().toISOString(),
      findings,
      candidates: [],
      errors,
      extra: {
        site_seo_summary: {
          enabled: false,
          site_url: MONITORING_SITE_URL,
          routes_checked: 0,
          sitemap_checked: false,
          robots_checked: false,
        },
      },
    });
  }

  const routeTargets = getRouteCheckTargets(entities);
  const routeChecks = [];
  for (const target of routeTargets) {
    const check = await checkHttpUrl(target.url, { timeoutMs: 15000, maxBodyChars: 8000 });
    routeChecks.push({ ...target, check });
    addRouteFinding(findings, monitor, target, check);
  }

  const sitemapUrl = getSitemapUrl(MONITORING_SITE_URL);
  let sitemapResult = null;
  try {
    sitemapResult = await checkSitemap({
      sitemapUrl,
      siteUrl: MONITORING_SITE_URL,
      entities,
      requiredStaticRoutes: REQUIRED_SITEMAP_STATIC_ROUTES,
    });
    addSitemapFindings(findings, monitor, sitemapResult);
  } catch (error) {
    errors.push(error?.message || String(error));
    findings.push(createFinding({
      monitor,
      severity: 'critical',
      category: 'sitemap_check_failed',
      title: 'Sitemap check failed unexpectedly',
      summary: error?.stack || error?.message || String(error),
      recommended_action: 'fix_site_seo_monitor_or_sitemap_route',
      source_urls: [sitemapUrl],
      confidence: 'medium',
      dedupe_key: `${monitor}:sitemap_check_failed`,
    }));
  }

  const robotsUrl = getRobotsUrl(MONITORING_SITE_URL);
  const robotsCheck = await checkHttpUrl(robotsUrl, { timeoutMs: 15000, maxBodyChars: 8000 });
  if (robotsCheck.status !== 'ok' && robotsCheck.status !== 'redirected') {
    findings.push(createFinding({
      monitor,
      severity: 'medium',
      category: `robots_${robotsCheck.status}`,
      title: `robots.txt check ${robotsCheck.status}`,
      summary: `${robotsUrl} -> ${robotsCheck.status}${robotsCheck.http_status ? ` HTTP ${robotsCheck.http_status}` : ''}${robotsCheck.error ? ` error=${robotsCheck.error}` : ''}`,
      recommended_action: 'inspect_robots_txt_route',
      source_urls: [robotsUrl],
      confidence: 'medium',
      dedupe_key: `${monitor}:robots:${robotsCheck.status}`,
    }));
  }

  return createMonitorResult({
    monitor,
    started_at,
    finished_at: new Date().toISOString(),
    findings,
    candidates: [],
    errors,
    extra: {
      site_seo_summary: {
        enabled: true,
        site_url: MONITORING_SITE_URL,
        routes_checked: routeTargets.length,
        route_findings: routeChecks.filter((item) => item.check.status !== 'ok').length,
        sitemap_checked: Boolean(sitemapResult),
        sitemap_status: sitemapResult?.status || 'not_checked',
        sitemap_urls: sitemapResult?.urls?.length || 0,
        sitemap_exchange_routes_expected: entities.length,
        sitemap_exchange_routes_actual: sitemapResult?.actual_exchange_routes || 0,
        robots_checked: true,
        robots_status: robotsCheck.status,
      },
      route_checks: routeChecks,
      sitemap_check: sitemapResult,
      robots_check: robotsCheck,
    },
  });
}
