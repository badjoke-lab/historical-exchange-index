import { WATCHLIST_AUTO_ROOT } from '../core/constants.mjs';
import { writeJsonFile } from '../core/fs-utils.mjs';
import { createFinding, createMonitorResult } from '../core/finding-utils.mjs';
import { slugifyName, uniqueStrings } from '../core/normalize.mjs';
import { buildEntityIndex, duplicateCheckForCandidate } from '../core/dedupe.mjs';
import { classifyCandidate } from '../core/classify.mjs';
import { candidateKeyFor } from '../core/candidate-identity.mjs';
import { loadResolutionFiles, loadWatchlists } from '../core/load-watchlists.mjs';
import { TERMINAL_RESOLUTION_STATES, OPEN_RESOLUTION_STATES } from '../core/resolution-store.mjs';
import { getExternalItems } from '../sources/external-lists.mjs';

function runDateFromRunId(runId) {
  return String(runId || new Date().toISOString().slice(0, 10).replace(/-/g, '')).slice(0, 8);
}

function toCandidateRecord(rawItem, index) {
  const canonicalName = rawItem.canonical_name || rawItem.name || rawItem.title || rawItem.slug;
  const slug = rawItem.slug || slugifyName(canonicalName);
  const base = {
    canonical_name: canonicalName,
    aliases: uniqueStrings(rawItem.aliases || []),
    slug,
    likely_type: rawItem.likely_type || rawItem.type || 'unknown',
    headline: rawItem.headline || rawItem.title || canonicalName,
    source_urls: uniqueStrings(rawItem.source_urls || rawItem.urls || (rawItem.url ? [rawItem.url] : [])),
    source_quality: rawItem.source_quality || 'low',
    source_name: rawItem.source_name || 'unknown',
    source_category: rawItem.source_category || 'unknown',
    description: rawItem.description || rawItem.summary || rawItem.notes || '',
    signals: uniqueStrings(rawItem.signals || []),
  };
  const candidateKey = candidateKeyFor(base);
  const duplicateCheck = duplicateCheckForCandidate({
    ...base,
    official_domain: rawItem.official_domain,
    official_url: rawItem.official_url,
    url: rawItem.url,
  }, index);
  const classification = classifyCandidate(base, duplicateCheck);

  return {
    candidate_id: candidateKey,
    candidate_key: candidateKey,
    canonical_name: base.canonical_name,
    aliases: base.aliases,
    candidate_class: classification.candidate_class,
    likely_type: base.likely_type,
    likely_status: classification.likely_status,
    likely_death_reason: classification.likely_death_reason,
    record_shape: classification.record_shape,
    headline: base.headline,
    hei_relevance: classification.hei_relevance,
    duplicate_check: duplicateCheck,
    source_urls: base.source_urls,
    source_quality: base.source_quality,
    source_name: base.source_name,
    source_names: [base.source_name],
    source_category: base.source_category,
    next_action: classification.next_action,
    historical_dead_score: classification.historical_dead_score,
    historical_dead_strength: classification.historical_dead_strength,
    historical_dead_tags: classification.historical_dead_tags,
  };
}

function mergeCandidate(left, right) {
  const classRank = { A: 3, B: 2, C: 1 };
  const preferred = (classRank[right.candidate_class] || 0) > (classRank[left.candidate_class] || 0) ? right : left;
  return {
    ...preferred,
    aliases: uniqueStrings([...(left.aliases || []), ...(right.aliases || [])]),
    source_urls: uniqueStrings([...(left.source_urls || []), ...(right.source_urls || [])]),
    source_names: uniqueStrings([...(left.source_names || []), ...(right.source_names || [])]),
    source_quality: [left.source_quality, right.source_quality].includes('high') ? 'high' : [left.source_quality, right.source_quality].includes('medium') ? 'medium' : 'low',
  };
}

function mergeDiscoveredCandidates(items) {
  const byKey = new Map();
  for (const candidate of items) {
    if (!candidate.candidate_key) continue;
    const existing = byKey.get(candidate.candidate_key);
    byKey.set(candidate.candidate_key, existing ? mergeCandidate(existing, candidate) : candidate);
  }
  return [...byKey.values()];
}

function attachLifecycle(candidate, history, resolutions, nowIso) {
  const historical = history.byKey.get(candidate.candidate_key) || null;
  const resolution = resolutions.match(candidate);
  const terminal = Boolean(resolution && TERMINAL_RESOLUTION_STATES.has(resolution.state));
  const open = Boolean(resolution && OPEN_RESOLUTION_STATES.has(resolution.state));
  return {
    ...candidate,
    first_seen_at: resolution?.first_seen_at || historical?.first_seen_at || nowIso,
    last_seen_at: nowIso,
    seen_count: (historical?.occurrence_count || 0) + 1,
    is_new_candidate: !historical && !resolution,
    lifecycle_state: terminal ? 'terminally_resolved' : open ? resolution.state : historical ? 'recurring_unresolved' : 'new',
    resolution_state: resolution?.state || null,
    resolution_candidate_key: resolution?.candidate_key || null,
  };
}

export async function runCandidateDiscovery(context, { startedAt } = {}) {
  const monitor = 'candidate-discovery';
  const started_at = startedAt || new Date().toISOString();
  const nowIso = new Date().toISOString();
  const findings = [];
  const errors = [];
  const entities = context?.canonicalData?.entities || [];
  const entityIndex = buildEntityIndex(entities);
  const [external, history, resolutions] = await Promise.all([
    getExternalItems(),
    loadWatchlists(),
    loadResolutionFiles(),
  ]);

  for (const error of external.errors) {
    errors.push(`${error.source_name}: ${error.error}`);
    findings.push(createFinding({
      monitor,
      severity: 'medium',
      category: 'external_source_fetch_failed',
      title: `External source fetch failed: ${error.source_name}`,
      summary: `${error.url}: ${error.error}`,
      recommended_action: 'inspect_external_source_adapter',
      confidence: 'medium',
      dedupe_key: `${monitor}:source_fetch_failed:${error.source_name}`,
    }));
  }

  const discovered = mergeDiscoveredCandidates(
    external.items
      .filter((item) => item && (item.canonical_name || item.name || item.title || item.slug))
      .map((item) => toCandidateRecord(item, entityIndex)),
  ).map((candidate) => attachLifecycle(candidate, history, resolutions, nowIso));

  const matchedExisting = discovered.filter((candidate) => candidate.duplicate_check.matched_existing_entity);
  const missingInHei = discovered.filter((candidate) => !candidate.duplicate_check.matched_existing_entity);
  const terminallyResolved = missingInHei.filter((candidate) => candidate.lifecycle_state === 'terminally_resolved');
  const trackedCandidates = missingInHei.filter((candidate) => ['held', 'needs_research'].includes(candidate.lifecycle_state));
  const candidates = missingInHei.filter((candidate) => !candidate.resolution_state);
  const newCandidates = candidates.filter((candidate) => candidate.is_new_candidate);
  const recurringCandidates = candidates.filter((candidate) => !candidate.is_new_candidate);
  const historicalCandidates = candidates.filter((candidate) => ['strong', 'medium'].includes(candidate.historical_dead_strength));

  if (external.items.length === 0) {
    findings.push(createFinding({
      monitor,
      severity: 'low',
      category: 'candidate_discovery_source_empty',
      title: 'Candidate discovery source is empty',
      summary: 'No candidate source items were available. Static seeds may be empty and remote lists may be disabled.',
      recommended_action: 'enable_remote_lists_or_add_seed_items_in_later_phase',
      confidence: 'medium',
      dedupe_key: `${monitor}:source_empty:all_sources`,
    }));
  }

  for (const candidate of candidates.filter((item) => item.candidate_class === 'A')) {
    findings.push(createFinding({
      monitor,
      severity: candidate.is_new_candidate ? 'high' : 'medium',
      category: candidate.is_new_candidate ? 'candidate_discovery_a_candidate_new' : 'candidate_discovery_a_candidate_pending',
      title: `${candidate.is_new_candidate ? 'New' : 'Recurring'} A candidate: ${candidate.canonical_name}`,
      summary: `${candidate.hei_relevance} first_seen_at=${candidate.first_seen_at} seen_count=${candidate.seen_count}`,
      recommended_action: candidate.next_action,
      source_urls: candidate.source_urls,
      confidence: candidate.source_quality === 'high' ? 'high' : 'medium',
      dedupe_key: `${monitor}:a_candidate:${candidate.candidate_key}`,
    }));
  }

  if (discovered.length > 0) {
    const runDate = runDateFromRunId(context?.runId);
    await writeJsonFile(`${WATCHLIST_AUTO_ROOT}/recent-candidates-${runDate}.json`, {
      watchlist_type: 'auto_candidate_discovery',
      version: 2,
      created_at: nowIso,
      purpose: 'Auto-generated candidate state keyed by stable candidate identity. Not canonical. Requires review before staging or canonical append.',
      source_summary: external.source_summary,
      candidates,
      tracked_candidates: trackedCandidates,
      excluded_resolved_candidates: terminallyResolved,
      excluded_existing_entities: matchedExisting.map((candidate) => ({
        candidate_key: candidate.candidate_key,
        canonical_name: candidate.canonical_name,
        matched_id: candidate.duplicate_check.matched_id,
        matched_slug: candidate.duplicate_check.matched_slug,
        method: candidate.duplicate_check.method,
      })),
      summary: {
        raw_items: external.items.length,
        discovered_unique: discovered.length,
        review_candidates: candidates.length,
        new_candidates: newCandidates.length,
        recurring_unresolved: recurringCandidates.length,
        tracked_open_resolutions: trackedCandidates.length,
        terminal_resolutions_excluded: terminallyResolved.length,
        matched_existing_excluded: matchedExisting.length,
        historical_dead_or_continuity: historicalCandidates.length,
        A: candidates.filter((candidate) => candidate.candidate_class === 'A').length,
        B: candidates.filter((candidate) => candidate.candidate_class === 'B').length,
        C: candidates.filter((candidate) => candidate.candidate_class === 'C').length,
      },
    });
  }

  return createMonitorResult({
    monitor,
    started_at,
    finished_at: new Date().toISOString(),
    findings,
    candidates,
    errors,
    extra: {
      discovery_summary: {
        raw_items: external.items.length,
        discovered_unique: discovered.length,
        review_candidates: candidates.length,
        new_candidates: newCandidates.length,
        recurring_unresolved: recurringCandidates.length,
        tracked_open_resolutions: trackedCandidates.length,
        terminal_resolutions_excluded: terminallyResolved.length,
        matched_existing_excluded: matchedExisting.length,
        historical_dead_or_continuity: historicalCandidates.length,
        source_summary: external.source_summary,
      },
    },
  });
}
