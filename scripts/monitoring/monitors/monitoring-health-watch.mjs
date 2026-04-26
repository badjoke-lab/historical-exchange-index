import { MONITOR_NAMES } from '../core/constants.mjs';
import { createFinding, createMonitorResult } from '../core/finding-utils.mjs';
import { loadWatchlists, loadManualStagingPackages, loadResolutionFiles, normalizeName } from '../core/load-watchlists.mjs';

function daysSince(dateValue) {
  if (!dateValue) return null;
  const time = Date.parse(dateValue);
  if (!Number.isFinite(time)) return null;
  return Math.floor((Date.now() - time) / 86400000);
}

function canonicalNameSet(canonical) {
  const names = new Set();
  for (const entity of canonical?.entities || []) {
    for (const value of [entity.canonical_name, entity.slug, ...(entity.aliases || [])]) {
      if (value) names.add(normalizeName(value));
    }
  }
  return names;
}

function addWatchlistFindings({ findings, monitor, watchlists, stagingPackages, resolutions, canonicalNames }) {
  for (const entry of watchlists.parseErrors) {
    findings.push(createFinding({
      monitor,
      severity: 'high',
      category: 'watchlist_json_parse_error',
      title: `Watchlist JSON parse error: ${entry.path}`,
      summary: entry.error,
      recommended_action: 'fix_watchlist_json',
      confidence: 'high',
      dedupe_key: `${monitor}:watchlist_parse:${entry.path}`,
    }));
  }

  for (const entry of stagingPackages.parseErrors) {
    findings.push(createFinding({
      monitor,
      severity: 'high',
      category: 'staging_json_parse_error',
      title: `Manual staging JSON parse error: ${entry.path}`,
      summary: entry.error,
      recommended_action: 'fix_staging_json',
      confidence: 'high',
      dedupe_key: `${monitor}:staging_parse:${entry.path}`,
    }));
  }

  const stagedNames = new Set();
  for (const pkg of stagingPackages.packages) {
    for (const entity of pkg.entities) {
      if (entity.normalized_name) stagedNames.add(entity.normalized_name);
      if (entity.slug) stagedNames.add(normalizeName(entity.slug));
    }
  }

  const countByClass = { A: 0, B: 0, C: 0, unknown: 0 };
  for (const candidate of watchlists.candidates) {
    const cls = ['A', 'B', 'C'].includes(candidate.candidate_class) ? candidate.candidate_class : 'unknown';
    countByClass[cls] += 1;

    const ageDays = daysSince(candidate.created_at);
    const isCanonical = canonicalNames.has(candidate.normalized_name);
    const isStaged = stagedNames.has(candidate.normalized_name);
    const isResolved = resolutions.resolvedNames.has(candidate.normalized_name);

    if (cls === 'A' && !isStaged && !isCanonical && !isResolved) {
      const severity = ageDays !== null && ageDays >= 60 ? 'high' : 'medium';
      findings.push(createFinding({
        monitor,
        severity,
        category: 'watchlist_a_candidate_pending',
        title: `A candidate still pending: ${candidate.name}`,
        summary: `${candidate.name} is still in watchlist and has not been staged, canonicalized, or resolved.${ageDays === null ? '' : ` age_days=${ageDays}`}`,
        recommended_action: 'stage_downgrade_or_resolve_candidate',
        confidence: 'medium',
        dedupe_key: `${monitor}:a_pending:${candidate.normalized_name}`,
      }));
    }

    if (cls === 'B' && ageDays !== null && ageDays >= 90 && !isResolved && !isCanonical) {
      findings.push(createFinding({
        monitor,
        severity: 'low',
        category: 'watchlist_b_candidate_stale',
        title: `B candidate may be stale: ${candidate.name}`,
        summary: `${candidate.name} has remained in watchlist for ${ageDays} days.`,
        recommended_action: 'review_keep_downgrade_or_resolve_candidate',
        confidence: 'low',
        dedupe_key: `${monitor}:b_stale:${candidate.normalized_name}`,
      }));
    }

    if (isCanonical && !isResolved) {
      findings.push(createFinding({
        monitor,
        severity: 'low',
        category: 'canonicalized_watchlist_candidate_unresolved',
        title: `Watchlist candidate appears canonicalized but unresolved: ${candidate.name}`,
        summary: `${candidate.name} appears in canonical entities but is not recorded in resolution files.`,
        recommended_action: 'add_resolution_promoted_to_canonical',
        confidence: 'medium',
        dedupe_key: `${monitor}:canonical_unresolved:${candidate.normalized_name}`,
      }));
    }
  }

  for (const pkg of stagingPackages.packages) {
    for (const entity of pkg.entities) {
      if (!entity.normalized_name) continue;
      const inCanonical = canonicalNames.has(entity.normalized_name) || (entity.slug && canonicalNames.has(normalizeName(entity.slug)));
      if (!inCanonical) {
        findings.push(createFinding({
          monitor,
          severity: 'medium',
          category: 'staging_package_not_canonicalized',
          title: `Staging package entity not canonicalized: ${entity.canonical_name || entity.slug}`,
          summary: `${pkg.path} contains ${entity.canonical_name || entity.slug}, but no canonical match was found.`,
          recommended_action: 'canonicalize_or_resolve_staging_package',
          confidence: 'medium',
          dedupe_key: `${monitor}:staging_not_canonical:${entity.normalized_name}:${pkg.path}`,
        }));
      }
    }
  }

  return countByClass;
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
      title: 'Canonical data was not loaded',
      summary: 'The monitoring runner did not provide canonical data to the health monitor.',
      recommended_action: 'fix_monitoring_workflow',
      confidence: 'high',
    }));
  } else {
    const counts = {
      entities: canonical.entities?.length || 0,
      events: canonical.events?.length || 0,
      evidence: canonical.evidence?.length || 0,
    };

    if (counts.entities === 0 || counts.events === 0 || counts.evidence === 0) {
      findings.push(createFinding({
        monitor,
        severity: 'high',
        category: 'canonical_data_empty_or_missing',
        title: 'Canonical data appears empty or incomplete',
        summary: `entities=${counts.entities}, events=${counts.events}, evidence=${counts.evidence}`,
        recommended_action: 'inspect_canonical_data_paths',
        confidence: 'high',
      }));
    }
  }

  const expectedReports = MONITOR_NAMES.length;
  if (expectedReports < 6) {
    findings.push(createFinding({
      monitor,
      severity: 'medium',
      category: 'monitor_registry_incomplete',
      title: 'Monitor registry has fewer monitors than expected',
      summary: `Registered monitors: ${expectedReports}`,
      recommended_action: 'inspect_monitoring_constants',
      confidence: 'medium',
    }));
  }

  const [watchlists, stagingPackages, resolutions] = await Promise.all([
    loadWatchlists(),
    loadManualStagingPackages(),
    loadResolutionFiles(),
  ]);
  const canonicalNames = canonicalNameSet(canonical);
  const watchlistClassCounts = addWatchlistFindings({
    findings,
    monitor,
    watchlists,
    stagingPackages,
    resolutions,
    canonicalNames,
  });

  return createMonitorResult({
    monitor,
    started_at,
    finished_at: new Date().toISOString(),
    findings,
    candidates: [],
    errors: [],
    extra: {
      checked: {
        canonical_data_loaded: Boolean(canonical),
        registered_monitors: MONITOR_NAMES,
      },
      watchlist_state: {
        watchlist_files: watchlists.files.length,
        watchlist_candidates: watchlists.candidates.length,
        watchlist_class_counts: watchlistClassCounts,
        manual_staging_packages: stagingPackages.packages.length,
        resolution_files: resolutions.files.length,
        resolved_names: resolutions.resolvedNames.size,
      },
    },
  });
}
