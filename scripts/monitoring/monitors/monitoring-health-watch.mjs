import { MONITOR_NAMES } from '../core/constants.mjs';
import { createFinding, createMonitorResult } from '../core/finding-utils.mjs';
import { loadWatchlists, loadManualStagingPackages, loadResolutionFiles, normalizeName } from '../core/load-watchlists.mjs';
import { TERMINAL_RESOLUTION_STATES, OPEN_RESOLUTION_STATES } from '../core/resolution-store.mjs';

const ageInDays = (value) => {
  const time = Date.parse(value || '');
  return Number.isFinite(time) ? Math.floor((Date.now() - time) / 86400000) : null;
};

const reviewDue = (entry) => {
  const time = Date.parse(entry?.next_review_after || '');
  return !Number.isFinite(time) || time <= Date.now();
};

function canonicalNames(canonical) {
  const names = new Set();
  for (const entity of canonical?.entities || []) {
    for (const value of [entity.canonical_name, entity.slug, ...(entity.aliases || [])]) {
      if (value) names.add(normalizeName(value));
    }
  }
  return names;
}

function addError(findings, monitor, category, title, summary, action, key) {
  findings.push(createFinding({
    monitor,
    severity: 'high',
    category,
    title,
    summary,
    recommended_action: action,
    confidence: 'high',
    dedupe_key: `${monitor}:${category}:${key}`,
  }));
}

function inspectQueues({ findings, monitor, watchlists, staging, resolutions, projectedNames }) {
  for (const entry of watchlists.parseErrors) addError(findings, monitor, 'watchlist_json_parse_error', `Watchlist JSON error: ${entry.path}`, entry.error, 'fix_watchlist_json', entry.path);
  for (const entry of staging.parseErrors) addError(findings, monitor, 'staging_json_parse_error', `Staging JSON error: ${entry.path}`, entry.error, 'fix_staging_json', entry.path);
  for (const entry of resolutions.parseErrors) addError(findings, monitor, 'resolution_json_parse_error', `Resolution JSON error: ${entry.path}`, entry.error, 'fix_resolution_json', entry.path);
  for (const error of resolutions.errors) addError(findings, monitor, 'resolution_index_invalid', 'Resolution index is invalid', error, 'fix_resolution_index', error);
  for (const error of resolutions.coverageErrors) addError(findings, monitor, 'resolution_history_not_indexed', 'Historical resolution is not indexed', error, 'migrate_historical_resolution_to_index', error);

  const stagedNames = new Set();
  for (const pkg of staging.packages) {
    for (const entity of pkg.entities) {
      if (entity.normalized_name) stagedNames.add(entity.normalized_name);
      if (entity.slug) stagedNames.add(normalizeName(entity.slug));
    }
  }

  const classes = { A: 0, B: 0, C: 0, unknown: 0 };
  let agedA = 0;
  let openTracked = 0;

  for (const candidate of watchlists.candidates) {
    const cls = ['A', 'B', 'C'].includes(candidate.candidate_class) ? candidate.candidate_class : 'unknown';
    classes[cls] += 1;
    const age = ageInDays(candidate.first_seen_at);
    const projected = projectedNames.has(candidate.normalized_name);
    const stagedCandidate = stagedNames.has(candidate.normalized_name);
    const resolution = resolutions.match(candidate.raw || { canonical_name: candidate.name });
    const terminal = Boolean(resolution && TERMINAL_RESOLUTION_STATES.has(resolution.state));
    const open = Boolean(resolution && OPEN_RESOLUTION_STATES.has(resolution.state));
    if (open) openTracked += 1;

    if (cls === 'A' && !projected && !stagedCandidate && !terminal) {
      if (age !== null && age >= 60) agedA += 1;
      if (!open || reviewDue(resolution)) {
        findings.push(createFinding({
          monitor,
          severity: age !== null && age >= 60 ? 'high' : 'medium',
          category: open ? 'watchlist_a_candidate_review_due' : 'watchlist_a_candidate_pending',
          title: `${open ? 'Tracked' : 'Unresolved'} A candidate: ${candidate.name}`,
          summary: `candidate_key=${candidate.candidate_key}${age === null ? '' : ` age_days=${age}`}${resolution ? ` state=${resolution.state}` : ''}`,
          recommended_action: open ? 'review_or_update_candidate_resolution' : 'stage_downgrade_or_resolve_candidate',
          confidence: 'medium',
          dedupe_key: `${monitor}:a_pending:${candidate.candidate_key}`,
        }));
      }
    }

    if (cls === 'B' && age !== null && age >= 90 && !projected && !terminal && (!open || reviewDue(resolution))) {
      findings.push(createFinding({
        monitor,
        severity: 'low',
        category: open ? 'watchlist_b_candidate_review_due' : 'watchlist_b_candidate_stale',
        title: `${open ? 'Tracked' : 'Unresolved'} B candidate: ${candidate.name}`,
        summary: `candidate_key=${candidate.candidate_key} age_days=${age}${resolution ? ` state=${resolution.state}` : ''}`,
        recommended_action: 'review_keep_downgrade_or_resolve_candidate',
        confidence: 'low',
        dedupe_key: `${monitor}:b_stale:${candidate.candidate_key}`,
      }));
    }

    if (projected && !terminal) {
      findings.push(createFinding({
        monitor,
        severity: 'low',
        category: 'canonicalized_watchlist_candidate_unresolved',
        title: `Projected candidate lacks terminal resolution: ${candidate.name}`,
        summary: `candidate_key=${candidate.candidate_key}`,
        recommended_action: 'add_terminal_resolution',
        confidence: 'medium',
        dedupe_key: `${monitor}:canonical_unresolved:${candidate.candidate_key}`,
      }));
    }
  }

  for (const pkg of staging.packages) {
    for (const entity of pkg.entities) {
      if (!entity.normalized_name) continue;
      const projected = projectedNames.has(entity.normalized_name) || (entity.slug && projectedNames.has(normalizeName(entity.slug)));
      if (!projected) {
        findings.push(createFinding({
          monitor,
          severity: 'medium',
          category: 'staging_package_not_canonicalized',
          title: `Staging entity not projected: ${entity.canonical_name || entity.slug}`,
          summary: pkg.path,
          recommended_action: 'canonicalize_or_resolve_staging_package',
          confidence: 'medium',
          dedupe_key: `${monitor}:staging_not_canonical:${entity.normalized_name}:${pkg.path}`,
        }));
      }
    }
  }

  return { classes, agedA, openTracked };
}

export async function runMonitoringHealthWatch(context, { startedAt } = {}) {
  const monitor = 'monitoring-health-watch';
  const started_at = startedAt || new Date().toISOString();
  const findings = [];
  const canonical = context?.canonicalData;

  if (!canonical) {
    findings.push(createFinding({
      monitor,
      severity: 'critical',
      category: 'canonical_load_missing',
      title: 'Projected public data was not loaded',
      summary: 'Monitoring health requires projected public data.',
      recommended_action: 'fix_monitoring_workflow',
      confidence: 'high',
    }));
  }

  if (MONITOR_NAMES.length < 6) addError(findings, monitor, 'monitor_registry_incomplete', 'Monitor registry is incomplete', `registered=${MONITOR_NAMES.length}`, 'inspect_monitoring_constants', 'registry');

  const [watchlists, staging, resolutions] = await Promise.all([
    loadWatchlists(),
    loadManualStagingPackages(),
    loadResolutionFiles(),
  ]);
  const state = inspectQueues({
    findings,
    monitor,
    watchlists,
    staging,
    resolutions,
    projectedNames: canonicalNames(canonical),
  });

  return createMonitorResult({
    monitor,
    started_at,
    finished_at: new Date().toISOString(),
    findings,
    candidates: [],
    errors: [],
    extra: {
      checked: { canonical_data_loaded: Boolean(canonical), registered_monitors: MONITOR_NAMES },
      watchlist_state: {
        candidate_queue_files: watchlists.files.length,
        raw_candidate_occurrences: watchlists.rawCandidateCount,
        unique_candidate_identities: watchlists.candidates.length,
        repeated_occurrences_collapsed: watchlists.rawCandidateCount - watchlists.candidates.length,
        watchlist_class_counts: state.classes,
        aged_a_candidates: state.agedA,
        open_tracked_candidates: state.openTracked,
        manual_staging_packages: staging.packages.length,
        historical_resolution_files: resolutions.files.length,
        resolution_index_entries: resolutions.index.entries?.length || 0,
        resolution_state_counts: resolutions.stateCounts,
        resolution_coverage_errors: resolutions.coverageErrors.length,
      },
    },
  });
}
