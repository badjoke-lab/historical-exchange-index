import { ACTIVE_SIDE_STATUSES } from '../core/constants.mjs';
import { createFinding, createMonitorResult } from '../core/finding-utils.mjs';
import { checkHttpUrl } from '../adapters/http-check.mjs';

const ENABLE_DOMAIN_CHECKS = process.env.HEI_MONITORING_ENABLE_DOMAIN_CHECKS === '1';
const DEFAULT_LIMIT = 50;

function getCheckLimit() {
  const parsed = Number.parseInt(process.env.HEI_MONITORING_DOMAIN_CHECK_LIMIT || String(DEFAULT_LIMIT), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_LIMIT;
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

function isAccessControlNoise(check) {
  return check.status === 'http_error' && [401, 403, 429].includes(check.http_status);
}

function isHealthyRedirect(check) {
  return check.status === 'redirected' && check.http_status === 200 && check.final_url;
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

function severityForCheck(entity, check) {
  if (['dns_failure', 'tls_failure', 'parked_or_for_sale'].includes(check.status)) return entity.status === 'active' ? 'high' : 'medium';
  if (['not_found', 'server_error', 'timeout'].includes(check.status)) return entity.status === 'active' ? 'medium' : 'low';
  return 'low';
}

function actionForCheck(entity, check) {
  if (check.status === 'parked_or_for_sale') return 'investigate_active_status_and_domain_repurpose';
  if (check.status === 'dns_failure') {
    return entity.status === 'active'
      ? 'investigate_active_to_inactive_candidate'
      : 'review_inactive_official_url_status';
  }
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
        },
      },
    });
  }

  const limit = getCheckLimit();
  const selected = targets.slice(0, limit);
  const checks = [];

  for (const entity of selected) {
    const url = entityUrl(entity);
    const check = await checkHttpUrl(url);
    checks.push({
      entity_id: entity.id,
      slug: entity.slug,
      canonical_name: entity.canonical_name,
      status: entity.status,
      official_url: url,
      check,
      finding_created: shouldCreateFinding(entity, check),
    });

    if (shouldCreateFinding(entity, check)) {
      const severity = severityForCheck(entity, check);
      findings.push(createFinding({
        monitor,
        severity,
        category: `official_site_${check.status}`,
        title: `Official site check ${check.status}: ${entity.canonical_name}`,
        summary: `${entity.id} ${url} -> ${check.status}${check.http_status ? ` HTTP ${check.http_status}` : ''}${check.error ? ` error=${check.error}` : ''}`,
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
        access_control_noise: checks.filter((item) => isAccessControlNoise(item.check)).length,
        healthy_redirects: checks.filter((item) => isHealthyRedirect(item.check)).length,
        inactive_dns_noise: checks.filter((item) => item.status === 'inactive' && item.check.status === 'dns_failure').length,
      },
      official_site_checks: checks,
    },
  });
}
