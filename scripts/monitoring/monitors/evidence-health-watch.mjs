import { DEAD_SIDE_STATUSES } from '../core/constants.mjs';
import { createFinding, createMonitorResult } from '../core/finding-utils.mjs';
import { checkHttpUrl } from '../adapters/http-check.mjs';

const ENABLE_EVIDENCE_CHECKS = process.env.HEI_MONITORING_ENABLE_EVIDENCE_URL_CHECKS === '1';
const DEFAULT_LIMIT = 50;

function getCheckLimit() {
  const parsed = Number.parseInt(process.env.HEI_MONITORING_EVIDENCE_URL_CHECK_LIMIT || String(DEFAULT_LIMIT), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_LIMIT;
}

function entityMap(entities = []) {
  return new Map(entities.map((entity) => [entity.id, entity]));
}

function evidencePriority(source, entitiesById) {
  const entity = entitiesById.get(source.exchange_id);
  let score = 0;
  if (!source.archived_url) score += 5;
  if (entity && DEAD_SIDE_STATUSES.includes(entity.status)) score += 4;
  if (source.source_type === 'official_statement' || source.source_type === 'official_blog') score += 2;
  if (source.reliability === 'high') score += 1;
  return score;
}

function selectEvidenceTargets(evidence = [], entities = []) {
  const entitiesById = entityMap(entities);
  return evidence
    .filter((source) => source.url)
    .map((source) => ({ source, priority: evidencePriority(source, entitiesById) }))
    .sort((a, b) => b.priority - a.priority || String(a.source.id).localeCompare(String(b.source.id)))
    .map((item) => item.source);
}

function sourceStatusCategory(check, hasArchive) {
  if (check.status === 'ok') return 'source_ok';
  if (['not_found', 'http_error'].includes(check.status) && hasArchive) return 'source_404_archive_ok';
  if (['not_found', 'http_error'].includes(check.status) && !hasArchive) return 'source_404_archive_missing';
  if (check.status === 'redirected') return 'source_redirected';
  if (['server_error', 'timeout', 'dns_failure', 'tls_failure'].includes(check.status)) return `source_${check.status}`;
  return `source_${check.status || 'unknown'}`;
}

function severityForSourceCheck(check, hasArchive) {
  if (check.status === 'ok') return 'low';
  if (['not_found', 'http_error'].includes(check.status) && !hasArchive) return 'high';
  if (['not_found', 'http_error'].includes(check.status) && hasArchive) return 'medium';
  if (['dns_failure', 'tls_failure'].includes(check.status) && !hasArchive) return 'high';
  if (['dns_failure', 'tls_failure'].includes(check.status)) return 'medium';
  if (['server_error', 'timeout'].includes(check.status)) return 'medium';
  if (check.status === 'redirected') return 'low';
  return 'medium';
}

function recommendedActionForSourceCheck(check, hasArchive) {
  if (check.status === 'ok') return 'no_action';
  if (['not_found', 'http_error', 'dns_failure', 'tls_failure'].includes(check.status) && !hasArchive) return 'find_archive_or_replacement_evidence';
  if (['not_found', 'http_error', 'dns_failure', 'tls_failure'].includes(check.status) && hasArchive) return 'verify_archived_url_and_consider_source_note';
  if (['server_error', 'timeout'].includes(check.status)) return 'recheck_before_replacing_evidence';
  if (check.status === 'redirected') return 'review_redirect_target';
  return 'review_evidence_url_health';
}

async function maybeCheckArchive(source) {
  if (!source.archived_url) return null;
  return checkHttpUrl(source.archived_url, { timeoutMs: 15000, maxBodyChars: 5000 });
}

export async function runEvidenceHealthWatch(context, { startedAt } = {}) {
  const monitor = 'evidence-health-watch';
  const started_at = startedAt || new Date().toISOString();
  const findings = [];
  const errors = [];
  const { entities = [], evidence = [] } = context.canonicalData || {};
  const targets = selectEvidenceTargets(evidence, entities);

  if (!ENABLE_EVIDENCE_CHECKS) {
    findings.push(createFinding({
      monitor,
      severity: 'low',
      category: 'evidence_url_watch_disabled',
      title: 'Evidence URL checks are disabled',
      summary: 'Set HEI_MONITORING_ENABLE_EVIDENCE_URL_CHECKS=1 to enable evidence source URL checks.',
      recommended_action: 'enable_evidence_url_checks_when_ready_for_scheduled_external_checks',
      confidence: 'medium',
      dedupe_key: `${monitor}:evidence_url_checks_disabled`,
    }));

    return createMonitorResult({
      monitor,
      started_at,
      finished_at: new Date().toISOString(),
      findings,
      candidates: [],
      errors,
      extra: {
        evidence_health_summary: {
          enabled: false,
          evidence_with_urls: targets.length,
          checked: 0,
        },
      },
    });
  }

  const limit = getCheckLimit();
  const selected = targets.slice(0, limit);
  const checks = [];

  for (const source of selected) {
    const sourceCheck = await checkHttpUrl(source.url, { timeoutMs: 15000, maxBodyChars: 8000 });
    const archiveCheck = await maybeCheckArchive(source);
    const hasArchive = Boolean(source.archived_url);
    const category = sourceStatusCategory(sourceCheck, hasArchive);

    checks.push({
      evidence_id: source.id,
      exchange_id: source.exchange_id,
      event_id: source.event_id || null,
      title: source.title,
      publisher: source.publisher || null,
      url: source.url,
      archived_url: source.archived_url || null,
      source_check: sourceCheck,
      archive_check: archiveCheck,
    });

    if (sourceCheck.status !== 'ok') {
      const severity = severityForSourceCheck(sourceCheck, hasArchive);
      findings.push(createFinding({
        monitor,
        severity,
        category,
        title: `Evidence source URL issue: ${source.id}`,
        summary: `${source.title || 'untitled'} — ${source.url} -> ${sourceCheck.status}${sourceCheck.http_status ? ` HTTP ${sourceCheck.http_status}` : ''}${sourceCheck.error ? ` error=${sourceCheck.error}` : ''}`,
        affected_entity: {
          matched_existing_entity: true,
          id: source.exchange_id,
          slug: null,
          canonical_name: null,
        },
        recommended_action: recommendedActionForSourceCheck(sourceCheck, hasArchive),
        source_urls: [source.url, source.archived_url].filter(Boolean),
        confidence: severity === 'high' ? 'medium' : 'low',
        dedupe_key: `${monitor}:${category}:${source.id}`,
      }));
    }

    if (archiveCheck && archiveCheck.status !== 'ok' && archiveCheck.status !== 'redirected') {
      findings.push(createFinding({
        monitor,
        severity: 'medium',
        category: `archive_${archiveCheck.status}`,
        title: `Evidence archive URL issue: ${source.id}`,
        summary: `${source.archived_url} -> ${archiveCheck.status}${archiveCheck.http_status ? ` HTTP ${archiveCheck.http_status}` : ''}${archiveCheck.error ? ` error=${archiveCheck.error}` : ''}`,
        affected_entity: {
          matched_existing_entity: true,
          id: source.exchange_id,
          slug: null,
          canonical_name: null,
        },
        recommended_action: 'review_or_replace_archived_url',
        source_urls: [source.archived_url].filter(Boolean),
        confidence: 'medium',
        dedupe_key: `${monitor}:archive_${archiveCheck.status}:${source.id}`,
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
      evidence_health_summary: {
        enabled: true,
        evidence_with_urls: targets.length,
        checked: selected.length,
        findings: findings.length,
        without_archive_total: evidence.filter((source) => source.url && !source.archived_url).length,
      },
      evidence_url_checks: checks,
    },
  });
}
