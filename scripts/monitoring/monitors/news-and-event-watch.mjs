import { WATCHLIST_AUTO_ROOT } from '../core/constants.mjs';
import { writeJsonFile } from '../core/fs-utils.mjs';
import { createFinding, createMonitorResult } from '../core/finding-utils.mjs';
import { slugifyName, uniqueStrings } from '../core/normalize.mjs';
import { buildEntityIndex, duplicateCheckForCandidate } from '../core/dedupe.mjs';
import { classifyCandidate } from '../core/classify.mjs';
import { NEWS_WATCH_ENABLED, getNewsQueries } from '../sources/news-queries.mjs';
import { REGULATORY_WATCH_ENABLED, getRegulatoryQueries, getRegulatorySourceSummary } from '../sources/regulatory-sources.mjs';
import { fetchGoogleNewsRss } from '../adapters/rss-google-news.mjs';
import { groupNewsItemsIntoCandidates } from '../core/news-extract.mjs';

function runDateFromRunId(runId) {
  return String(runId || new Date().toISOString().slice(0, 10).replace(/-/g, '')).slice(0, 8);
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
  const candidates = rawCandidates.map((candidate, index) => toCandidateRecord(candidate, entityIndex, context?.runId, index + 1));
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
      severity: 'high',
      category: candidate.source_category === 'regulatory_source' ? 'regulatory_a_candidate' : 'news_event_a_candidate',
      title: `${candidate.source_category === 'regulatory_source' ? 'Regulatory' : 'News/event'} A candidate: ${candidate.canonical_name}`,
      summary: candidate.hei_relevance,
      recommended_action: candidate.next_action,
      source_urls: candidate.source_urls,
      confidence: candidate.source_quality === 'high' ? 'high' : 'medium',
      dedupe_key: `${monitor}:a_candidate:${candidate.source_category}:${candidate.canonical_name.toLowerCase()}`,
    }));
  }

  if (candidates.length > 0) {
    const runDate = runDateFromRunId(context?.runId);
    await writeJsonFile(`${WATCHLIST_AUTO_ROOT}/news-event-candidates-${runDate}.json`, {
      watchlist_type: 'auto_news_event_candidates',
      created_at: new Date().toISOString(),
      purpose: 'Auto-generated news/regulatory/event candidate output. Not canonical. Requires review before staging/canonical append.',
      news_summary: {
        enabled: NEWS_WATCH_ENABLED,
        queries: newsQueries.length,
        items: newsItems.length,
      },
      regulatory_summary: {
        ...regulatorySourceSummary,
        queries: regulatoryQueries.length,
        items: regulatoryItems.length,
        raw_candidates: regulatoryCandidates.length,
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
        candidates: candidates.length,
        missing_in_hei: missingInHei.length,
        matched_existing: matchedExisting.length,
      },
    },
  });
}
