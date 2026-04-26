import { SEVERITIES } from './constants.mjs';

function safeText(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

export function countBySeverity(findings = []) {
  const counts = Object.fromEntries(SEVERITIES.map((severity) => [severity, 0]));
  for (const finding of findings) {
    if (counts[finding?.severity] !== undefined) {
      counts[finding.severity] += 1;
    }
  }
  return counts;
}

export function createFinding({
  monitor,
  severity = 'low',
  category = 'info',
  title,
  summary = '',
  affected_entity = null,
  recommended_action = 'review',
  source_urls = [],
  confidence = 'medium',
  dedupe_key = null,
}) {
  const normalizedSeverity = SEVERITIES.includes(severity) ? severity : 'low';
  const normalizedCategory = safeText(category, 'info');
  const normalizedTitle = safeText(title, `${monitor}: ${normalizedCategory}`);
  const key = dedupe_key || [monitor, normalizedCategory, normalizedTitle]
    .filter(Boolean)
    .join(':')
    .toLowerCase()
    .replace(/\s+/g, '-');

  return {
    finding_id: `finding_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    monitor,
    severity: normalizedSeverity,
    category: normalizedCategory,
    title: normalizedTitle,
    summary: safeText(summary),
    affected_entity,
    recommended_action,
    source_urls: Array.isArray(source_urls) ? source_urls : [],
    confidence,
    dedupe_key: key,
  };
}

export function createMonitorResult({ monitor, started_at, finished_at, findings = [], candidates = [], errors = [], extra = {} }) {
  const severityCounts = countBySeverity(findings);
  return {
    monitor,
    status: errors.length > 0 ? 'degraded' : 'ok',
    started_at,
    finished_at,
    findings,
    candidates,
    errors,
    summary: {
      findings_count: findings.length,
      candidate_count: candidates.length,
      errors_count: errors.length,
      ...severityCounts,
    },
    ...extra,
  };
}

export async function runMonitorSafely(monitorName, monitorFn, context) {
  const startedAt = new Date().toISOString();
  try {
    return await monitorFn(context, { startedAt });
  } catch (error) {
    const finishedAt = new Date().toISOString();
    return createMonitorResult({
      monitor: monitorName,
      started_at: startedAt,
      finished_at: finishedAt,
      findings: [
        createFinding({
          monitor: monitorName,
          severity: 'critical',
          category: 'monitor_failed',
          title: `${monitorName} failed`,
          summary: error?.stack || error?.message || String(error),
          recommended_action: 'fix_monitoring_workflow',
          confidence: 'high',
        }),
      ],
      errors: [error?.message || String(error)],
    });
  }
}

export function hasMeaningfulFindings(results = []) {
  return results.some((result) => {
    const findings = result?.findings || [];
    const candidates = result?.candidates || [];
    return candidates.length > 0 || findings.length > 0;
  });
}
