import { WATCHLIST_AUTO_ROOT } from '../core/constants.mjs';
import { writeJsonFile } from '../core/fs-utils.mjs';
import { createFinding, createMonitorResult } from '../core/finding-utils.mjs';
import { slugifyName, uniqueStrings } from '../core/normalize.mjs';
import { buildEntityIndex, duplicateCheckForCandidate } from '../core/dedupe.mjs';
import { classifyCandidate } from '../core/classify.mjs';
import { getStaticExternalItems } from '../sources/external-lists.mjs';

function runDateFromRunId(runId) {
  return String(runId || new Date().toISOString().slice(0, 10).replace(/-/g, '')).slice(0, 8);
}

function toCandidateRecord(rawItem, index, runId, ordinal) {
  const canonicalName = rawItem.canonical_name || rawItem.name || rawItem.title || rawItem.slug;
  const slug = rawItem.slug || slugifyName(canonicalName);
  const base = {
    candidate_id: `auto_${runDateFromRunId(runId)}_${String(ordinal).padStart(3, '0')}`,
    canonical_name: canonicalName,
    aliases: uniqueStrings(rawItem.aliases || []),
    slug,
    likely_type: rawItem.likely_type || rawItem.type || 'unknown',
    headline: rawItem.headline || rawItem.title || canonicalName,
    source_urls: uniqueStrings(rawItem.source_urls || rawItem.urls || (rawItem.url ? [rawItem.url] : [])),
    source_quality: rawItem.source_quality || 'low',
    source_name: rawItem.source_name || 'unknown',
    description: rawItem.description || rawItem.summary || rawItem.notes || '',
    signals: uniqueStrings(rawItem.signals || []),
  };

  const duplicateCheck = duplicateCheckForCandidate({
    ...base,
    official_domain: rawItem.official_domain,
    official_url: rawItem.official_url,
    url: rawItem.url,
  }, index);
  const classification = classifyCandidate(base, duplicateCheck);

  return {
    candidate_id: base.candidate_id,
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
    next_action: classification.next_action,
    source_name: base.source_name,
  };
}

export async function runCandidateDiscovery(context, { startedAt } = {}) {
  const monitor = 'candidate-discovery';
  const started_at = startedAt || new Date().toISOString();
  const findings = [];
  const entities = context?.canonicalData?.entities || [];
  const entityIndex = buildEntityIndex(entities);
  const rawItems = getStaticExternalItems();

  const candidates = rawItems
    .filter((item) => item && (item.canonical_name || item.name || item.title || item.slug))
    .map((item, index) => toCandidateRecord(item, entityIndex, context?.runId, index + 1));

  const missingInHei = candidates.filter((candidate) => !candidate.duplicate_check.matched_existing_entity);
  const matchedExisting = candidates.filter((candidate) => candidate.duplicate_check.matched_existing_entity);
  const aCandidates = candidates.filter((candidate) => candidate.candidate_class === 'A');

  if (rawItems.length === 0) {
    findings.push(createFinding({
      monitor,
      severity: 'low',
      category: 'candidate_discovery_source_empty',
      title: 'Candidate discovery source is empty',
      summary: 'The static external-list seed is empty. This is expected until external source adapters are added.',
      recommended_action: 'add_external_source_adapter_or_seed_items_in_later_phase',
      confidence: 'medium',
      dedupe_key: `${monitor}:source_empty:manual_seed`,
    }));
  }

  for (const candidate of aCandidates) {
    findings.push(createFinding({
      monitor,
      severity: 'high',
      category: 'candidate_discovery_a_candidate',
      title: `A candidate discovered: ${candidate.canonical_name}`,
      summary: candidate.hei_relevance,
      recommended_action: candidate.next_action,
      source_urls: candidate.source_urls,
      confidence: candidate.source_quality === 'high' ? 'high' : 'medium',
      dedupe_key: `${monitor}:a_candidate:${candidate.canonical_name.toLowerCase()}`,
    }));
  }

  if (candidates.length > 0) {
    const runDate = runDateFromRunId(context?.runId);
    await writeJsonFile(`${WATCHLIST_AUTO_ROOT}/recent-candidates-${runDate}.json`, {
      watchlist_type: 'auto_candidate_discovery',
      created_at: new Date().toISOString(),
      purpose: 'Auto-generated candidate discovery output. Not canonical. Requires review before staging/canonical append.',
      candidates,
      summary: {
        total: candidates.length,
        missing_in_hei: missingInHei.length,
        matched_existing: matchedExisting.length,
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
    errors: [],
    extra: {
      discovery_summary: {
        raw_items: rawItems.length,
        candidates: candidates.length,
        missing_in_hei: missingInHei.length,
        matched_existing: matchedExisting.length,
      },
    },
  });
}
