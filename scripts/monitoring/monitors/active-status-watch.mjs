import { ACTIVE_SIDE_STATUSES } from '../core/constants.mjs';
import { createFinding, createMonitorResult } from '../core/finding-utils.mjs';
import { checkHttpUrl } from '../adapters/http-check.mjs';

const ENABLE_DOMAIN_CHECKS = process.env.HEI_MONITORING_ENABLE_DOMAIN_CHECKS === '1';
const DEFAULT_LIMIT = 50;
const DEFAULT_PRIORITY_SLUGS = ['coinchief', 'cryptopanda', 'izaka-ya', 'msx'];
const RETRYABLE_CHECK_STATUSES = new Set(['dns_failure', 'tls_failure', 'server_error', 'timeout']);

function getCheckLimit() {
  const parsed = Number.parseInt(process.env.HEI_MONITORING_DOMAIN_CHECK_LIMIT || String(DEFAULT_LIMIT), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_LIMIT;
}

function getPrioritySlugs() {
  const raw = process.env.HEI_MONITORING_PRIORITY_DOMAIN_SLUGS;
  if (!raw) return [...DEFAULT_PRIORITY_SLUGS];
  return [...new Set(raw.split(',').map((value) => value.trim()).filter(Boolean))];
}

function entityUrl(entity) {
  return entity.official_url_original || entity.official_domain_original || null;
}

function activeSideEntities(entities = []) {
  return entities
    .filter((entity) => ACTIVE_SIDE_STATUSES.includes(entity.status))
    .filter((entity) => entityUrl(entity))
    .sort((a, b) => String(a.slug || '').localeCompare(String(b.slug || '')));
}

export function prioritizeActiveStatusTargets(targets = [], prioritySlugs = []) {
  const bySlug = new Map(targets.map((entity) => [String(entity.slug || ''), entity]));
  const ordered = [];
  const seen = new Set();

  for (const slug of prioritySlugs) {
    const entity = bySlug.get(slug);
    if (!entity || seen.has(slug)) continue;
    ordered.push(entity);
    seen.add(slug);
  }

  for (const entity of targets) {
    const slug = String(entity.slug || '');
    if (seen.has(slug)) continue;
    ordered.push(entity);
    seen.add(slug);
  }

  return ordered;
}

function isAccessControlNoise(check) {
  return check.status === 'http_error' && [401, 403, 429].includes(check.http_status);
}

function isHealthyRedirect(check) {
  return check.status === 'redirected' && check.http_status === 200 && check.final_url;
}

export function shouldRetryOfficialSiteCheck(check) {
  return Boolean(check && RETRYABLE_CHECK_STATUSES.has(check.status));
}

async function checkOfficialSite(url) {
  const initialCheck = await checkHttpUrl(url);
  if (!shouldRetryOfficialSiteCheck(initialCheck)) {
    return {
      check: initialCheck,
      initial_check: null,
      retry_attempted: false,
      recovered_after_retry: false,
    };
  }

  const retryCheck = await checkHttpUrl(url);
  return {
    check: retryCheck,
    initial_check: initialCheck,
    retry_attempted: true,
    recovered_after_retry: retryCheck.status === 'ok' || isHealthyRedirect(retryCheck) || isAccessControlNoise(retryCheck),
  };
}

function shouldCreateFinding(entity, check) {
  if (check.status === 'ok') return false;
  if (isHealthyRedirect(check)) return false;
  if (isAccessControlNoise(check)) return false;

  // Inactive records are monitored for bookkeeping, but a DNS failure on an
  // already-inactive exchange is not an active-to-inactive candidate.
  if (entity.status === 'inactive' && check.status === 'dns_failure') return false;

  return true;
}

export function severityForCheck(entity, check) {
  if (check.status === 'parked_or_for_sale') return entity.status === 'active' ? 'high' : 'medium';

  // A single scheduled run performs only one immediate retry. Persistent DNS,
  // TLS, server, and timeout failures can still be caused by resolver, CDN,
  // bot-protection, or runner-specific conditions. They are review signals,
  // not sufficient high-severity lifecycle evidence by themselves.
  if (['dns_failure', 'tls_failure', 'not_found'].includes(check.status)) {
    return entity.status === 'active' ? 'medium' : 'low';
  }
  if (['server_error', 'timeout'].includes(check.status)) return 'low';
  return 'low';
}

export function actionForCheck(entity, check) {
  if (check.status === 'parked_or_for_sale') return 'investigate_active_status_and_domain_repurpose';
  if (check.status === 'dns_failure') return 'recheck_before_status_change';
  if (check.status === 'tls_failure') return 'review_official_site_tls_status';
  if (check.status === 'not_found') return 'review_official_url_or_archive';
  if (check.status === 'server_error' || check.status === 'timeout') return 'recheck_before_status_change';
  return 'review';
}

export async function runActiveStatusWatch(context, { startedAt } = {}) {
  const monitor = 'active-status-watch';
  const started_at = startedAt || new Date().toISOString();
  const findings = [];
  const errors = [];
  const entities = context?.canonicalData?.entities || [];
  const targets = activeSideEntities(entities);
  const prioritySlugs = getPrioritySlugs();

  if (!ENABLE_DOMAIN_CHECKS) {
    findings.push(createFinding({
      monitor,
      severity: 'low',
      category: 'domain_watch_disabled',
      title: 'Official site/domain checks are disabled',
      summary: 'Set HEI_MONITORING_ENABLE_DOMAIN_CHECKS=1 to enable active-side official URL checks.',
      recommended_action: 'enable_domain_checks_when_ready_for_scheduled_external_checks',
      confidence: 'medium',
      dedupe_key: `${monitor}:domain_checks_disabled`,
    }));

    return createMonitorResult({
      monitor,
      started_at,
      finished_at: new Date().toISOString(),
      findings,
      candidates: [],
      errors,
      extra: {
        active_status_summary: {
          enabled: false,
          active_side_entities_with_urls: targets.length,
          checked: 0,
          priority_slugs: prioritySlugs,
          priority_selected: 0,
        },
      },
    });
  }

  const limit = getCheckLimit();
  const prioritizedTargets = prioritizeActiveStatusTargets(targets, prioritySlugs);
  const selected = prioritizedTargets.slice(0, limit);
  const selectedSlugs = new Set(selected.map((entity) => String(entity.slug || '')));
  const checks = [];

  for (const entity of selected) {
    const url = entityUrl(entity);
    const checkResult = await checkOfficialSite(url);
    const check = checkResult.check;
    const findingCreated = shouldCreateFinding(entity, check);
    checks.push({
      entity_id: entity.id,
      slug: entity.slug,
      canonical_name: entity.canonical_name,
      status: entity.status,
      official_url: url,
      check,
      initial_check: checkResult.initial_check,
      retry_attempted: checkResult.retry_attempted,
      recovered_after_retry: checkResult.recovered_after_retry,
      finding_created: findingCreated,
    });

    if (findingCreated) {
      const severity = severityForCheck(entity, check);
      findings.push(createFinding({
        monitor,
        severity,
        category: `official_site_${check.status}`,
        title: `Official site check ${check.status}: ${entity.canonical_name}`,
        summary: `${entity.id} ${url} -> ${check.status}${check.http_status ? ` HTTP ${check.http_status}` : ''}${check.error ? ` error=${check.error}` : ''}; retry_attempted=${checkResult.retry_attempted}`,
        affected_entity: {
          matched_existing_entity: true,
          id: entity.id,
          slug: entity.slug,
          canonical_name: entity.canonical_name,
        },
        recommended_action: actionForCheck(entity, check),
        source_urls: [url].filter(Boolean),
        confidence: severity === 'high' ? 'medium' : 'low',
        dedupe_key: `${monitor}:official_site_${check.status}:${entity.id}`,
      }));
    }
  }

  return createMonitorResult({
    monitor,
    started_at,
    finished_at: new Date().toISOString(),
    findings,
    candidates: [],
    errors,
    extra: {
      active_status_summary: {
        enabled: true,
        active_side_entities_with_urls: targets.length,
        checked: selected.length,
        findings: findings.length,
        priority_slugs: prioritySlugs,
        priority_selected: prioritySlugs.filter((slug) => selectedSlugs.has(slug)).length,
        retries_attempted: checks.filter((item) => item.retry_attempted).length,
        recovered_after_retry: checks.filter((item) => item.recovered_after_retry).length,
        access_control_noise: checks.filter((item) => isAccessControlNoise(item.check)).length,
        healthy_redirects: checks.filter((item) => isHealthyRedirect(item.check)).length,
        inactive_dns_noise: checks.filter((item) => item.status === 'inactive' && item.check.status === 'dns_failure').length,
      },
      official_site_checks: checks,
    },
  });
}
