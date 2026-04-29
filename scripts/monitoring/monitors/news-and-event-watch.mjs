import { WATCHLIST_AUTO_ROOT } from '../core/constants.mjs';
import { writeJsonFile } from '../core/fs-utils.mjs';
import { createFinding, createMonitorResult } from '../core/finding-utils.mjs';
import { slugifyName, uniqueStrings } from '../core/normalize.mjs';
import { buildEntityIndex, duplicateCheckForCandidate } from '../core/dedupe.mjs';
import { classifyCandidate } from '../core/classify.mjs';
import { loadResolutionFiles, normalizeName } from '../core/load-watchlists.mjs';
import { NEWS_WATCH_ENABLED, getNewsQueries } from '../sources/news-queries.mjs';
import { REGULATORY_WATCH_ENABLED, getRegulatoryQueries, getRegulatorySourceSummary } from '../sources/regulatory-sources.mjs';
import { fetchGoogleNewsRss } from '../adapters/rss-google-news.mjs';
import { groupNewsItemsIntoCandidates } from '../core/news-extract.mjs';

const GENERIC_CANDIDATE_NAMES = new Set([
  'after',
  'another',
  'biggest',
  'c2c',
  'ceo',
  'chicago mercantile',
  'coinbase-backed',
  'complex',
  'consumer',
  'dominance',
  'dx.',
  'etherdelta still holds',
  'first fca',
  'germany',
  'korea',
  'launch',
  'london block',
  'mango markets shutting down',
  'monthly volume smashes',
  'network introduces build-your-own perp',
  'offering the complete solution',
  'offers',
  'p2p',
  'perp',
  'perpetual',
  'prices fair',
  'protocols for decentralized margin',
  'reverses blockchain',
  'right perp',
  'rolls back after btc',
  'sector',
  'shuts down',
  'singapore',
  'soars',
  'suffers',
  'suspended',
  'that reshaped crypto',
  'volume',
  'volume soars',
  'volume surges',
  'volumes nearly triple',
]);

const AMBIGUOUS_GLOBAL_BRANDS = new Set([
  'coinbase',
  'huobi',
  'mercado libre',
  'tokenize',
]);

function runDateFromRunId(runId) {
  return String(runId || new Date().toISOString().slice(0, 10).replace(/-/g, '')).slice(0, 8);
}

function isGenericCandidateName(name) {
  const normalized = String(name || '').trim().toLowerCase();
  if (!normalized) return true;
  if (GENERIC_CANDIDATE_NAMES.has(normalized)) return true;
  if (normalized.length < 3) return true;
  if (/^(the|this|that|these|those)\b/.test(normalized)) return true;
  if (/\b(after|before|following|amid|faces|announces|offers|introduces|proposes|surges|soars|suffers|shutters|holds|shuts down)\b/.test(normalized) && normalized.split(/\s+/).length > 2) return true;
  return false;
}

function isAmbiguousBrandCandidate(candidate) {
  const normalized = String(candidate?.canonical_name || '').trim().toLowerCase();
  if (!AMBIGUOUS_GLOBAL_BRANDS.has(normalized)) return false;

  const headline = String(candidate?.headline || '').toLowerCase();
  return /\b(unit|operations|services|tool|product|coin|market|region|country|india|thai|thailand|singapore)\b/.test(headline);
}

function isLikelyHeadlineFragment(candidate) {
  const name = String(candidate?.canonical_name || '').trim();
  const headline = String(candidate?.headline || '').trim();
  if (!name || !headline) return false;
  if (name.split(/\s+/).length < 3) return false;
  return headline.toLowerCase().includes(name.toLowerCase());
}

function isResolvedCandidate(candidate, resolutions) {
  return resolutions?.resolvedNames?.has(normalizeName(candidate?.canonical_name || '')) || false;
}

function isActionableNewsCandidate(candidate, resolutions) {
  if (!candidate || isGenericCandidateName(candidate.canonical_name)) return false;
  if (isResolvedCandidate(candidate, resolutions)) return false;
  if (isAmbiguousBrandCandidate(candidate)) return false;
  if (isLikelyHeadlineFragment(candidate)) return false;

  const sourceUrls = candidate.source_urls || [];
  if (sourceUrls.length === 0) return false;

  // Existing canonical entities should not be auto-promoted into watchlist noise.
  // They are useful raw monitoring context, but event updates need manual review.
  if (candidate.duplicate_check?.matched_existing_entity) return false;

  if (candidate.candidate_class !== 'A') return false;
  if (candidate.source_category === 'regulatory_source') return false;

  const tags = new Set(candidate.historical_dead_tags || []);
  const categories = new Set(candidate.news_event_categories || []);
  const hasShutdownSignal = tags.has('shutdown_language') || categories.has('shutdown');
  const hasRegulatorySignal = tags.has('regulatory_language') || categories.has('regulatory_action');
  const hasStrongSignal = hasShutdownSignal || hasRegulatorySignal;

  // Require either a high-quality source, multiple sources, or a strong score.
  const qualityOk = candidate.source_quality === 'high' || sourceUrls.length >= 2 || Number(candidate.historical_dead_score || 0) >= 5;

  return hasStrongSignal && qualityOk;
}

function isActionableRegulatoryCandidate(candidate, resolutions) {
  if (!candidate || isGenericCandidateName(candidate.canonical_name)) return false;
  if (isResolvedCandidate(candidate, resolutions)) return false;
  if (candidate.source_category !== 'regulatory_source') return false;
  if (candidate.duplicate_check?.matched_existing_entity) return false;
  if (!['A', 'B'].includes(candidate.candidate_class)) return false;
  return (candidate.source_urls || []).length > 0;
}

function toCandidateRecord(rawItem, index, runId, ordinal) {
  const canonicalName = rawItem.canonical_name || rawItem.name || rawItem.title || rawItem.slug;
  const base = {
    candidate_id: `news_${runDateFromRunId(runId)}_${String(ordinal).padStart(3, '0')}`,
    canonical_name: canonicalName,
    aliases: uniqueStrings(rawItem.aliases || []),
    slug: rawItem.slug || slugifyName(canonicalName),
    likely_type: rawItem.likely_type || rawItem.type || 'unknown',
    headline: rawItem.headline || rawItem.title || canonicalName,
    source_urls: uniqueStrings(rawItem.source_urls || rawItem.urls || (rawItem.url ? [rawItem.url] : [])),
    source_quality: rawItem.source_quality || 'low',
    source_name: rawItem.source_name || 'unknown',
    source_category: rawItem.source_category || 'news_event',
    description: rawItem.description || rawItem.summary || rawItem.notes || '',
    signals: uniqueStrings(rawItem.signals || []),
  };

  const duplicateCheck = duplicateCheckForCandidate(base, index);
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
    source_category: base.source_category,
    likely_event_types: rawItem.likely_event_types || [],
    news_event_categories: rawItem.news_event_categories || [],
    regulatory_authorities: rawItem.regulatory_authorities || [],
    regulatory_regions: rawItem.regulatory_regions || [],
    regulatory_signals: rawItem.regulatory_signals || [],
    historical_dead_score: classification.historical_dead_score,
    historical_dead_strength: classification.historical_dead_strength,
    historical_dead_tags: classification.historical_dead_tags,
  };
}

async function fetchQueryGroup({ monitor, queryMetas, findings, errors }) {
  const items = [];

  for (const queryMeta of queryMetas) {
    const result = await fetchGoogleNewsRss(queryMeta);
    if (result.error) {
      errors.push(`${queryMeta.query}: ${result.error}`);
      findings.push(createFinding({
        monitor,
        severity: 'medium',
        category: queryMeta.source_category === 'regulatory_source' ? 'regulatory_rss_fetch_failed' : 'news_rss_fetch_failed',
        title: `${queryMeta.source_category === 'regulatory_source' ? 'Regulatory RSS' : 'News RSS'} fetch failed: ${queryMeta.query}`,
        summary: `${result.url}: ${result.error}`,
        recommended_action: queryMeta.source_category === 'regulatory_source' ? 'inspect_regulatory_source_query_or_network' : 'inspect_news_rss_source_or_network',
        confidence: 'medium',
        dedupe_key: `${monitor}:rss_failed:${queryMeta.query}`,
      }));
      continue;
    }

    items.push(...result.items.map((item) => ({
      ...item,
      source_category: queryMeta.source_category || 'news_event',
      regulatory_authority: queryMeta.regulatory_authority || null,
      regulatory_authority_short_name: queryMeta.regulatory_authority_short_name || null,
      regulatory_authority_id: queryMeta.regulatory_authority_id || null,
      regulatory_region: queryMeta.regulatory_region || null,
      regulatory_domain: queryMeta.regulatory_domain || null,
      regulatory_signal: queryMeta.regulatory_signal || null,
    })));
  }

  return items;
}

export async function runNewsAndEventWatch(context, { startedAt } = {}) {
  const monitor = 'news-and-event-watch';
  const started_at = startedAt || new Date().toISOString();
  const findings = [];
  const errors = [];
  const entities = context?.canonicalData?.entities || [];
  const entityIndex = buildEntityIndex(entities);
  const regulatorySourceSummary = getRegulatorySourceSummary();
  const resolutions = await loadResolutionFiles();

  if (!NEWS_WATCH_ENABLED && !REGULATORY_WATCH_ENABLED) {
    findings.push(createFinding({
      monitor,
      severity: 'low',
      category: 'news_and_regulatory_watch_disabled',
      title: 'News and regulatory RSS fetching is disabled',
      summary: 'Set HEI_MONITORING_ENABLE_NEWS_RSS=1 and/or HEI_MONITORING_ENABLE_REGULATORY_WATCH=1 to enable external RSS candidate discovery.',
      recommended_action: 'enable_external_rss_checks_when_ready_for_scheduled_external_checks',
      confidence: 'medium',
      dedupe_key: `${monitor}:news_and_regulatory_disabled`,
    }));

    return createMonitorResult({
      monitor,
      started_at,
      finished_at: new Date().toISOString(),
      findings,
      candidates: [],
      errors,
      extra: {
        news_summary: {
          enabled: false,
          queries: 0,
          items: 0,
          candidates: 0,
        },
        regulatory_summary: {
          ...regulatorySourceSummary,
          queries: 0,
          items: 0,
          candidates: 0,
        },
      },
    });
  }

  const newsQueries = NEWS_WATCH_ENABLED ? getNewsQueries() : [];
  const regulatoryQueries = REGULATORY_WATCH_ENABLED ? getRegulatoryQueries() : [];
  const newsItems = await fetchQueryGroup({ monitor, queryMetas: newsQueries, findings, errors });
  const regulatoryItems = await fetchQueryGroup({ monitor, queryMetas: regulatoryQueries, findings, errors });
  const allItems = [...newsItems, ...regulatoryItems];

  const rawCandidates = groupNewsItemsIntoCandidates(allItems);
  const allCandidates = rawCandidates.map((candidate, index) => toCandidateRecord(candidate, entityIndex, context?.runId, index + 1));
  const candidates = allCandidates.filter((candidate) => isActionableNewsCandidate(candidate, resolutions) || isActionableRegulatoryCandidate(candidate, resolutions));
  const aCandidates = candidates.filter((candidate) => candidate.candidate_class === 'A');
  const regulatoryCandidates = candidates.filter((candidate) => candidate.source_category === 'regulatory_source');
  const matchedExisting = candidates.filter((candidate) => candidate.duplicate_check.matched_existing_entity);
  const missingInHei = candidates.filter((candidate) => !candidate.duplicate_check.matched_existing_entity);

  if (newsQueries.length > 0 && newsItems.length === 0) {
    findings.push(createFinding({
      monitor,
      severity: 'high',
      category: 'news_rss_zero_results',
      title: 'News RSS returned zero items for all queries',
      summary: `queries=${newsQueries.length}`,
      recommended_action: 'inspect_news_rss_source_or_network',
      confidence: 'medium',
      dedupe_key: `${monitor}:rss_zero_news`,
    }));
  }

  if (regulatoryQueries.length > 0 && regulatoryItems.length === 0) {
    findings.push(createFinding({
      monitor,
      severity: 'high',
      category: 'regulatory_rss_zero_results',
      title: 'Regulatory RSS returned zero items for all queries',
      summary: `queries=${regulatoryQueries.length}`,
      recommended_action: 'inspect_regulatory_source_queries_or_network',
      confidence: 'medium',
      dedupe_key: `${monitor}:rss_zero_regulatory`,
    }));
  }

  for (const candidate of aCandidates) {
    findings.push(createFinding({
      monitor,
      severity: 'medium',
      category: candidate.source_category === 'regulatory_source' ? 'regulatory_actionable_candidate' : 'news_event_actionable_candidate',
      title: `${candidate.source_category === 'regulatory_source' ? 'Regulatory' : 'News/event'} candidate: ${candidate.canonical_name}`,
      summary: candidate.hei_relevance,
      recommended_action: candidate.next_action,
      source_urls: candidate.source_urls,
      confidence: candidate.source_quality === 'high' ? 'medium' : 'low',
      dedupe_key: `${monitor}:actionable_candidate:${candidate.source_category}:${candidate.canonical_name.toLowerCase()}`,
    }));
  }

  if (candidates.length > 0) {
    const runDate = runDateFromRunId(context?.runId);
    await writeJsonFile(`${WATCHLIST_AUTO_ROOT}/news-event-candidates-${runDate}.json`, {
      watchlist_type: 'auto_news_event_candidates',
      created_at: new Date().toISOString(),
      purpose: 'Tightly filtered auto-generated news/regulatory/event candidate output. Not canonical. Requires review before staging/canonical append.',
      news_summary: {
        enabled: NEWS_WATCH_ENABLED,
        queries: newsQueries.length,
        items: newsItems.length,
      },
      regulatory_summary: {
        ...regulatorySourceSummary,
        queries: regulatoryQueries.length,
        items: regulatoryItems.length,
        raw_candidates: allCandidates.filter((candidate) => candidate.source_category === 'regulatory_source').length,
      },
      filtering_summary: {
        raw_candidates: allCandidates.length,
        retained_candidates: candidates.length,
        dropped_candidates: allCandidates.length - candidates.length,
        resolved_candidate_names: resolutions.resolvedNames.size,
      },
      candidates,
      summary: {
        total: candidates.length,
        missing_in_hei: missingInHei.length,
        matched_existing: matchedExisting.length,
        regulatory_candidates: regulatoryCandidates.length,
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
      news_summary: {
        enabled: NEWS_WATCH_ENABLED,
        queries: newsQueries.length,
        items: newsItems.length,
        candidates: candidates.length - regulatoryCandidates.length,
      },
      regulatory_summary: {
        ...regulatorySourceSummary,
        queries: regulatoryQueries.length,
        items: regulatoryItems.length,
        candidates: regulatoryCandidates.length,
      },
      combined_summary: {
        items: allItems.length,
        raw_candidates: allCandidates.length,
        candidates: candidates.length,
        dropped_candidates: allCandidates.length - candidates.length,
        resolved_candidate_names: resolutions.resolvedNames.size,
        missing_in_hei: missingInHei.length,
        matched_existing: matchedExisting.length,
      },
    },
  });
}
