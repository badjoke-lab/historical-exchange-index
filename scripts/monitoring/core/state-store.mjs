import { appendFile } from 'node:fs/promises';
import { readJsonFile, writeJsonFile } from './fs-utils.mjs';

export const MONITORING_STATE_PATH = 'data-staging/monitoring/state/latest-findings.json';

const ALWAYS_VISIBLE_CATEGORIES = new Set([
  'monitor_failed',
]);

const REPEATED_BACKLOG_CATEGORIES = new Set([
  'invalid_entity_enum',
  'invalid_event_enum',
  'invalid_evidence_enum',
  'source_count_mismatch',
  'thin_evidence',
  'missing_events',
  'missing_archive',
  'official_url_status_unknown',
  'country_or_origin_unknown',
  'possible_lineage_missing',
  'provisional_text',
]);

const REPEATED_BACKLOG_MONITORS = new Set([
  'evidence-and-record-quality-watch',
]);

function findingKey(finding) {
  return finding?.dedupe_key || [finding?.monitor, finding?.category, finding?.title]
    .filter(Boolean)
    .join(':')
    .toLowerCase()
    .replace(/\s+/g, '-');
}

function isRepeatedBacklogFinding(finding) {
  if (!finding) return false;
  if (!REPEATED_BACKLOG_MONITORS.has(finding.monitor)) return false;
  if (REPEATED_BACKLOG_CATEGORIES.has(finding.category)) return true;

  const recommendedAction = String(finding.recommended_action || '');
  return [
    'fix_entity_enum',
    'fix_event_enum',
    'fix_evidence_enum',
    'review_event_source_count',
    'add_minimum_event_or_review_record_shape',
    'improve_evidence_or_review_confidence',
    'add_second_source_or_archive',
    'review_official_url_status_when_available',
    'add_origin_if_sourceable',
    'review_lineage_fields_when_record_is_touched',
    'replace_provisional_notes_with_reviewed_text',
  ].includes(recommendedAction);
}

function isSuppressible(finding, repeatCount) {
  if (!finding || repeatCount <= 1) return false;
  if (finding.severity === 'critical') return false;
  if (ALWAYS_VISIBLE_CATEGORIES.has(finding.category)) return false;

  if (isRepeatedBacklogFinding(finding)) return true;

  return finding.severity === 'low';
}

function flattenFindings(results = []) {
  return results.flatMap((result) => (result.findings || []).map((finding) => ({ finding, result })));
}

export async function loadMonitoringState() {
  const state = await readJsonFile(MONITORING_STATE_PATH, null);
  if (!state || typeof state !== 'object') {
    return {
      version: 1,
      updated_at: null,
      findings: {},
    };
  }
  return {
    version: state.version || 1,
    updated_at: state.updated_at || null,
    findings: state.findings && typeof state.findings === 'object' ? state.findings : {},
  };
}

export function applyNoiseControl(results, previousState, nowIso = new Date().toISOString()) {
  const nextFindings = {};
  let suppressed_count = 0;
  let new_count = 0;
  let repeated_count = 0;

  for (const { finding } of flattenFindings(results)) {
    const key = findingKey(finding);
    const previous = previousState.findings[key] || null;
    const repeatCount = previous ? (previous.repeat_count || 1) + 1 : 1;
    const firstSeenAt = previous?.first_seen_at || nowIso;
    const suppressed = isSuppressible(finding, repeatCount);

    finding.first_seen_at = firstSeenAt;
    finding.last_seen_at = nowIso;
    finding.repeat_count = repeatCount;
    finding.is_new = !previous;
    finding.is_repeated = Boolean(previous);
    finding.suppressed = suppressed;
    finding.noise_control = suppressed ? 'suppressed_repeated_backlog' : 'visible';

    if (!previous) new_count += 1;
    else repeated_count += 1;
    if (suppressed) suppressed_count += 1;

    nextFindings[key] = {
      key,
      monitor: finding.monitor,
      category: finding.category,
      title: finding.title,
      severity: finding.severity,
      first_seen_at: firstSeenAt,
      last_seen_at: nowIso,
      repeat_count: repeatCount,
      last_suppressed: suppressed,
    };
  }

  return {
    results,
    state: {
      version: 1,
      updated_at: nowIso,
      findings: nextFindings,
    },
    summary: {
      total_findings: Object.keys(nextFindings).length,
      new_count,
      repeated_count,
      suppressed_count,
      visible_count: Object.keys(nextFindings).length - suppressed_count,
    },
  };
}

export async function writeMonitoringState(state) {
  await writeJsonFile(MONITORING_STATE_PATH, state);
}

export async function writeGitHubOutput(values) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) return;
  const lines = Object.entries(values).map(([key, value]) => `${key}=${value}`);
  await appendFile(outputPath, `${lines.join('\n')}\n`, 'utf8');
}
