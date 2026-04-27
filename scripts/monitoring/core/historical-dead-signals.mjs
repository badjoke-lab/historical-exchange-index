import { normalizeDomain, normalizeText } from './normalize.mjs';

const SHUTDOWN_TERMS = [
  'shutdown',
  'shut down',
  'closed',
  'closure',
  'cease operations',
  'ceased operations',
  'wind down',
  'wound down',
  'service ended',
  'service discontinued',
  'permanently closed',
  'no longer operating',
];

const INSOLVENCY_TERMS = [
  'insolvent',
  'insolvency',
  'bankruptcy',
  'bankrupt',
  'shortfall',
  'liabilities',
  'unable to repay',
];

const SCAM_TERMS = [
  'exit scam',
  'scam',
  'rug pull',
  'fraud',
  'ponzi',
];

const REGULATORY_TERMS = [
  'regulatory',
  'license revoked',
  'license withdrawn',
  'warning list',
  'cease and desist',
  'enforcement',
  'sanction',
];

const CONTINUITY_TERMS = [
  'acquired by',
  'acquisition',
  'merged with',
  'merger',
  'rebranded',
  'renamed',
  'customer transfer',
  'asset transfer',
  'migration',
];

function includesAny(text, terms) {
  return terms.some((term) => text.includes(normalizeText(term)));
}

function countUrls(urls = []) {
  return Array.isArray(urls) ? urls.filter(Boolean).length : 0;
}

function hasArchiveUrl(urls = []) {
  return urls.some((url) => /web\.archive\.org|archive\.org/i.test(String(url || '')));
}

function hasDeadDomainSignal(candidate) {
  const status = normalizeText(candidate.official_url_status || '');
  if (status.includes('dead domain') || status.includes('repurposed')) return true;

  const domain = normalizeDomain(candidate.official_domain || candidate.official_url || candidate.url || '');
  if (!domain) return false;
  return /expired|parking|forsale|for-sale/i.test(String(candidate.notes || candidate.description || ''));
}

export function evaluateHistoricalDeadSignals(candidate = {}) {
  const text = normalizeText([
    candidate.canonical_name,
    candidate.name,
    candidate.description,
    candidate.summary,
    candidate.headline,
    candidate.notes,
    candidate.status,
    candidate.likely_status,
    candidate.death_reason,
    candidate.likely_death_reason,
    ...(candidate.signals || []),
  ].filter(Boolean).join(' '));
  const urls = [
    ...(candidate.source_urls || []),
    ...(candidate.urls || []),
    candidate.url,
    candidate.official_url,
    candidate.archived_url,
  ].filter(Boolean);

  const tags = [];
  let score = 0;

  if (includesAny(text, SHUTDOWN_TERMS)) {
    tags.push('shutdown_language');
    score += 3;
  }
  if (includesAny(text, INSOLVENCY_TERMS)) {
    tags.push('insolvency_language');
    score += 3;
  }
  if (includesAny(text, SCAM_TERMS)) {
    tags.push('scam_or_exit_language');
    score += 2;
  }
  if (includesAny(text, REGULATORY_TERMS)) {
    tags.push('regulatory_language');
    score += 2;
  }
  if (includesAny(text, CONTINUITY_TERMS)) {
    tags.push('continuity_language');
    score += 2;
  }
  if (hasArchiveUrl(urls)) {
    tags.push('archive_url_present');
    score += 2;
  }
  if (hasDeadDomainSignal(candidate)) {
    tags.push('dead_or_repurposed_domain_signal');
    score += 2;
  }
  if (countUrls(urls) >= 2) {
    tags.push('multiple_source_urls');
    score += 1;
  }
  if (candidate.source_quality === 'high') {
    tags.push('high_quality_source');
    score += 1;
  }

  let suggestedStatus = candidate.likely_status || 'unknown';
  let suggestedDeathReason = candidate.likely_death_reason || null;

  if (tags.includes('continuity_language')) {
    if (text.includes('rebrand') || text.includes('renamed')) {
      suggestedStatus = 'rebranded';
      suggestedDeathReason = 'rebrand';
    } else if (text.includes('acquired')) {
      suggestedStatus = 'acquired';
      suggestedDeathReason = 'acquisition';
    } else if (text.includes('merged')) {
      suggestedStatus = 'merged';
      suggestedDeathReason = 'merger';
    }
  }
  if (tags.includes('shutdown_language') || tags.includes('dead_or_repurposed_domain_signal')) {
    suggestedStatus = ['acquired', 'merged', 'rebranded'].includes(suggestedStatus) ? suggestedStatus : 'dead';
    suggestedDeathReason = suggestedDeathReason || 'voluntary_shutdown';
  }
  if (tags.includes('insolvency_language')) {
    suggestedStatus = 'dead';
    suggestedDeathReason = 'insolvency';
  }
  if (tags.includes('scam_or_exit_language')) {
    suggestedStatus = 'dead';
    suggestedDeathReason = 'scam_rug';
  }
  if (tags.includes('regulatory_language') && suggestedStatus === 'dead') {
    suggestedDeathReason = 'regulation';
  }

  const strength = score >= 6 ? 'strong' : score >= 3 ? 'medium' : score > 0 ? 'weak' : 'none';

  return {
    historical_dead_score: score,
    historical_dead_strength: strength,
    historical_dead_tags: tags,
    suggested_status: suggestedStatus,
    suggested_death_reason: suggestedDeathReason,
  };
}
