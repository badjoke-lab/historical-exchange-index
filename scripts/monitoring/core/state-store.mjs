import path from 'node:path';
import { readJsonFile, writeJsonFile } from './fs-utils.mjs';
import { countBySeverity } from './finding-utils.mjs';

export const MONITORING_STATE_DIR = 'data-staging/monitoring/state';
export const LATEST_FINDINGS_STATE_PATH = path.join(MONITORING_STATE_DIR, 'latest-findings.json');

const DEFAULT_STATE = {
  version: 1,
  updated_at: null,
  findings: {},
};

function cloneDefaultState() {
  return {
    version: DEFAULT_STATE.version,
    updated_at: DEFAULT_STATE.updated_at,
    findings: {},
  };
}

export async function loadFindingState() {
  const state = await readJsonFile(LATEST_FINDINGS_STATE_PATH, null);
  if (!state || typeof state !== 'object') return cloneDefaultState();
  if (!state.findings || typeof state.findings !== 'object') state.findings = {};
  if (!state.version) state.version = 1;
  return state;
}

function findingKey(finding) {
  return finding?.dedupe_key || [finding?.monitor, finding?.category, finding?.title]
    .filter(Boolean)
    .join(':')
    .toLowerCase()
    .replace(/\s+/g, '-');
}

function escalateSeverity(baseSeverity, repeatCount) {
  if (baseSeverity === 'critical' || baseSeverity === 'high') return baseSeverity;
  if (baseSeverity === 'medium' && repeatCount >= 3) return 'high';
  if (baseSeverity === 'low' && repeatCount >= 3) return 'medium';
  return baseSeverity;
}

function shouldSuppressFinding({ baseSeverity, effectiveSeverity, repeatCount }) {
  if (effectiveSeverity === 'critical' || effectiveSeverity === 'high') return false;
  if (repeatCount <= 1) return false;
  return baseSeverity === 'low' || baseSeverity === 'medium';
}

function emptyNoiseSummary() {
  return {
    previous_findings: 0,
    current_findings_seen: 0,
    visible_findings: 0,
    suppressed_findings: 0,
    escalated_findings: 0,
    state_path: LATEST_FINDINGS_STATE_PATH,
  };
}

export function applyNoiseControl(results, previousState, { runId, now = new Date().toISOString() } = {}) {
  const nextState = {
    version: 1,
    updated_at: now,
    run_id: runId || null,
    findings: { ...(previousState?.findings || {}) },
  };
  const noiseSummary = emptyNoiseSummary();
  noiseSummary.previous_findings = Object.keys(previousState?.findings || {}).length;

  const processedResults = results.map((result) => {
    const visibleFindings = [];
    const suppressedFindings = [];

    for (const finding of result.findings || []) {
      const key = findingKey(finding);
      if (!key) {
        visibleFindings.push(finding);
        continue;
      }

      const previous = previousState?.findings?.[key] || null;
      const repeatCount = previous ? Number(previous.repeat_count || 0) + 1 : 1;
      const baseSeverity = finding.severity || 'low';
      const effectiveSeverity = escalateSeverity(baseSeverity, repeatCount);
      const escalated = effectiveSeverity !== baseSeverity;
      const enrichedFinding = {
        ...finding,
        severity: effectiveSeverity,
        original_severity: baseSeverity,
        repeat_count: repeatCount,
        first_seen_at: previous?.first_seen_at || now,
        last_seen_at: now,
        noise_control: {
          suppressed: false,
          escalated,
          state_path: LATEST_FINDINGS_STATE_PATH,
        },
      };

      nextState.findings[key] = {
        dedupe_key: key,
        monitor: finding.monitor || result.monitor,
        category: finding.category || null,
        title: finding.title || null,
        original_severity: baseSeverity,
        effective_severity: effectiveSeverity,
        repeat_count: repeatCount,
        first_seen_at: previous?.first_seen_at || now,
        last_seen_at: now,
        last_run_id: runId || null,
        last_recommended_action: finding.recommended_action || null,
      };

      noiseSummary.current_findings_seen += 1;
      if (escalated) noiseSummary.escalated_findings += 1;

      if (shouldSuppressFinding({ baseSeverity, effectiveSeverity, repeatCount })) {
        suppressedFindings.push({
          ...enrichedFinding,
          noise_control: {
            ...enrichedFinding.noise_control,
            suppressed: true,
          },
        });
        noiseSummary.suppressed_findings += 1;
      } else {
        visibleFindings.push(enrichedFinding);
      }
    }

    const severityCounts = countBySeverity(visibleFindings);
    noiseSummary.visible_findings += visibleFindings.length;

    return {
      ...result,
      findings: visibleFindings,
      suppressed_findings: suppressedFindings,
      summary: {
        ...(result.summary || {}),
        findings_count: visibleFindings.length,
        suppressed_findings_count: suppressedFindings.length,
        ...severityCounts,
      },
    };
  });

  return {
    results: processedResults,
    state: nextState,
    summary: noiseSummary,
  };
}

export async function saveFindingState(state) {
  await writeJsonFile(LATEST_FINDINGS_STATE_PATH, state);
}
