import path from 'node:path';
import { listJsonFiles, readJsonFile, writeJsonFile } from './core/fs-utils.mjs';
import { WATCHLIST_AUTO_ROOT } from './core/constants.mjs';
import { slugifyName, normalizeText, uniqueStrings } from './core/normalize.mjs';

const MANUAL_STAGING_ROOT = 'data-staging/manual';

function parseArgs(argv) {
  const args = {};
  for (const arg of argv.slice(2)) {
    if (!arg.startsWith('--')) continue;
    const [rawKey, ...rest] = arg.slice(2).split('=');
    const key = rawKey.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    args[key] = rest.length ? rest.join('=') : 'true';
  }
  return args;
}

function todayCompact() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}

function reliabilityFromSourceQuality(value) {
  if (['high', 'medium', 'low'].includes(value)) return value;
  return 'medium';
}

function sourceTypeFromCandidate(candidate) {
  if (candidate.source_category === 'regulatory_source') return 'regulatory_notice';
  if (candidate.source_category === 'news_event') return 'news_article';
  if (candidate.source_name && /news|coindesk|block|cointelegraph|reuters|bloomberg/i.test(candidate.source_name)) return 'news_article';
  return 'database_reference';
}

function eventTypeFromCandidate(candidate) {
  const likely = Array.isArray(candidate.likely_event_types) ? candidate.likely_event_types.filter(Boolean) : [];
  if (likely.length) return likely[0];
  if (candidate.likely_status === 'dead') return 'shutdown_announced';
  if (candidate.likely_status === 'acquired') return 'acquired';
  if (candidate.likely_status === 'merged') return 'merged';
  if (candidate.likely_status === 'rebranded') return 'rebranded';
  if (candidate.record_shape === 'existing_entity_event_update') return 'other';
  return 'other';
}

function eventStatusEffectFromCandidate(candidate) {
  if (['active', 'limited', 'inactive', 'dead'].includes(candidate.likely_status)) return candidate.likely_status;
  return 'none';
}

function titleCase(value) {
  return String(value || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function buildEntityDraft(candidate) {
  const name = candidate.canonical_name || candidate.headline || candidate.candidate_id;
  const slug = candidate.slug || slugifyName(name);
  return {
    id: null,
    slug,
    canonical_name: name,
    aliases: uniqueStrings(candidate.aliases || []),
    type: ['cex', 'dex', 'hybrid'].includes(candidate.likely_type) ? candidate.likely_type : null,
    status: candidate.likely_status || 'unknown',
    death_reason: candidate.likely_death_reason || null,
    launch_date: null,
    death_date: null,
    country_or_origin: null,
    official_url_original: null,
    official_domain_original: null,
    official_url_status: 'unknown',
    archived_url: null,
    summary: candidate.hei_relevance || candidate.headline || null,
    confidence: candidate.source_quality === 'high' ? 'medium' : 'low',
    successor_id: null,
    predecessor_id: null,
    last_verified_at: null,
    notes: 'Auto-generated draft from monitoring candidate. Not public-quality. Requires manual source review, ID assignment, duplicate check, archive URLs, and schema validation before canonical append.',
  };
}

function buildEventDraft(candidate, entityDraft) {
  return {
    id: null,
    exchange_id: entityDraft.id,
    event_type: eventTypeFromCandidate(candidate),
    event_date: null,
    start_date: null,
    end_date: null,
    title: candidate.headline || `${entityDraft.canonical_name} monitoring candidate`,
    summary: candidate.hei_relevance || candidate.headline || null,
    impact_level: candidate.candidate_class === 'A' ? 'high' : 'medium',
    event_status_effect: eventStatusEffectFromCandidate(candidate),
    source_count: Array.isArray(candidate.source_urls) ? candidate.source_urls.length : 0,
    notes: 'Draft event generated from monitoring candidate. Confirm event type/date/status effect and evidence mapping before canonical append.',
  };
}

function buildEvidenceDrafts(candidate, entityDraft, eventDraft) {
  const urls = uniqueStrings(candidate.source_urls || []);
  return urls.map((url, index) => ({
    id: null,
    exchange_id: entityDraft.id,
    event_id: eventDraft.id,
    source_type: sourceTypeFromCandidate(candidate),
    reliability: reliabilityFromSourceQuality(candidate.source_quality),
    claim_scope: candidate.record_shape === 'existing_entity_event_update' ? 'event' : 'entity',
    title: candidate.headline || `${entityDraft.canonical_name} source ${index + 1}`,
    publisher: candidate.source_name || null,
    url,
    archived_url: null,
    published_at: null,
    accessed_at: null,
    notes: 'Auto-generated evidence draft from monitoring candidate. Confirm source relevance and add archive URL before canonical append.',
  }));
}

function buildDraftPackage(candidate, sourceFile, args) {
  const entityDraft = buildEntityDraft(candidate);
  const eventDraft = buildEventDraft(candidate, entityDraft);
  const evidenceDrafts = buildEvidenceDrafts(candidate, entityDraft, eventDraft);

  return {
    package_type: 'monitoring_candidate_staging_draft',
    package_status: 'draft_not_merge_ready',
    created_at: new Date().toISOString(),
    source: {
      candidate_id: candidate.candidate_id || null,
      source_file: sourceFile,
      selected_by: 'scripts/monitoring/promote-candidate-to-staging.mjs',
    },
    rationale: 'Draft generated from an auto monitoring candidate. This file is a review aid only and must not be applied to canonical data without manual completion.',
    candidate_snapshot: candidate,
    records: {
      entities: [entityDraft],
      events: [eventDraft],
      evidence: evidenceDrafts,
    },
    manual_review_checklist: [
      'Confirm HEI scope: exchange / DEX / hybrid trading platform, not wallet-only or unrelated protocol.',
      'Run duplicate review against canonical slug, name, aliases, and official domain.',
      'Assign canonical IDs only after deciding to append.',
      'Verify status, death_reason, event_type, event date, and status effect from sources.',
      'Add official URL / domain / archived URL where available.',
      'Add archive URLs for every evidence item where possible.',
      'Replace draft summary and notes with public-quality wording.',
      'Ensure records.entities/events/evidence pass canonical validation before merge.',
    ],
    generation_options: args,
  };
}

async function loadCandidateEntries() {
  const files = await listJsonFiles(WATCHLIST_AUTO_ROOT);
  const entries = [];

  for (const file of files) {
    const json = await readJsonFile(file, null);
    const candidates = Array.isArray(json?.candidates) ? json.candidates : [];
    for (const candidate of candidates) {
      entries.push({ file, candidate });
    }
  }

  return entries;
}

function findCandidate(entries, args) {
  const id = args.candidateId || args.id || null;
  const name = args.candidateName || args.name || null;
  const sourceFile = args.sourceFile || null;

  const filtered = sourceFile ? entries.filter((entry) => path.normalize(entry.file) === path.normalize(sourceFile)) : entries;

  if (id) {
    return filtered.find((entry) => entry.candidate?.candidate_id === id) || null;
  }

  if (name) {
    const normalizedName = normalizeText(name);
    return filtered.find((entry) => normalizeText(entry.candidate?.canonical_name || entry.candidate?.headline) === normalizedName) || null;
  }

  const aCandidate = filtered.find((entry) => entry.candidate?.candidate_class === 'A');
  return aCandidate || filtered[0] || null;
}

function outputPathForDraft(candidate, args) {
  const name = candidate.canonical_name || candidate.headline || candidate.candidate_id || 'candidate';
  const slug = slugifyName(name) || 'candidate';
  const date = args.date || todayCompact();
  return `${MANUAL_STAGING_ROOT}/auto-draft-${slug}-${date}.json`;
}

async function main() {
  const args = parseArgs(process.argv);
  const entries = await loadCandidateEntries();
  if (!entries.length) {
    throw new Error(`No auto watchlist candidates found under ${WATCHLIST_AUTO_ROOT}`);
  }

  const selected = findCandidate(entries, args);
  if (!selected) {
    throw new Error('No matching candidate found. Use --candidate-id=... or --candidate-name=...');
  }

  const draft = buildDraftPackage(selected.candidate, selected.file, args);
  const outPath = args.output || outputPathForDraft(selected.candidate, args);

  if (args.dryRun === 'true') {
    console.log(JSON.stringify({ output: outPath, draft }, null, 2));
    return;
  }

  await writeJsonFile(outPath, draft);
  console.log(`Wrote staging draft: ${outPath}`);
  console.log(`Candidate: ${selected.candidate.candidate_id || 'unknown'} ${selected.candidate.canonical_name || selected.candidate.headline || ''}`);
}

main().catch((error) => {
  console.error(error?.stack || error?.message || error);
  process.exit(1);
});
