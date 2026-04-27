import { normalizeText, slugifyName, uniqueStrings } from './normalize.mjs';
import { TRUSTED_NEWS_DOMAINS } from '../sources/news-queries.mjs';

const STOP_PREFIXES = [
  'crypto',
  'cryptocurrency',
  'bitcoin',
  'ethereum',
  'defi',
  'dex',
  'centralized',
  'decentralized',
  'exchange',
  'trading',
  'platform',
  'protocol',
  'users',
  'hackers',
  'regulators',
  'court',
  'police',
  'authorities',
];

const KNOWN_BAD_NAMES = new Set([
  'crypto',
  'cryptocurrency',
  'bitcoin',
  'ethereum',
  'defi',
  'dex',
  'exchange',
  'users',
  'hackers',
  'regulators',
]);

function cleanCandidateName(value) {
  const raw = String(value || '')
    .replace(/['"“”‘’]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const words = raw.split(' ').filter(Boolean);
  while (words.length > 1 && STOP_PREFIXES.includes(words[0].toLowerCase())) {
    words.shift();
  }
  return words.join(' ').replace(/\b(exchange|dex|protocol|platform)$/i, '').trim();
}

function domainFromUrl(value) {
  try {
    const url = new URL(value);
    return url.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

function sourceQuality(item) {
  const domains = [domainFromUrl(item.url), domainFromUrl(item.source_url)].filter(Boolean);
  const trusted = domains.some((domain) => TRUSTED_NEWS_DOMAINS.some((trustedDomain) => domain === trustedDomain || domain.endsWith(`.${trustedDomain}`)));
  if (trusted || item.source_category === 'regulatory_source') return 'high';
  if (item.source_name && item.source_name !== 'unknown') return 'medium';
  return 'low';
}

export function inferEventCategory(textValue, fallbackCategory = 'unknown') {
  const text = normalizeText(textValue);
  if (/\b(shutdown|shut down|closed|closure|cease operations|ceased operations|wind down|service ended|service discontinued)\b/.test(text)) return 'shutdown';
  if (/\b(hack|hacked|exploit|breach|unauthorized withdrawal|hot wallet|stolen|drained|suspicious outflows)\b/.test(text)) return 'hack_incident';
  if (/\b(withdrawals suspended|deposits suspended|trading halted|paused withdrawals|halted trading|withdrawal only|close only)\b/.test(text)) return 'withdrawal_deposit_trading_suspension';
  if (/\b(regulatory|license revoked|license withdrawn|warning list|sanction|enforcement|regional exit|cease and desist|registration cancelled|registration canceled)\b/.test(text)) return 'regulatory';
  if (/\b(acquired|acquisition|merged|merger|rebranded|renamed|customer transfer|asset transfer|migration|successor)\b/.test(text)) return 'acquisition_migration_rebrand';
  return fallbackCategory;
}

export function extractCandidateNameFromNews(item) {
  const text = `${item.title || ''} ${item.snippet || ''}`;
  const patterns = [
    /\b(?:exchange|platform|protocol|DEX)\s+([A-Z][A-Za-z0-9.&-]{2,}(?:\s+[A-Z][A-Za-z0-9.&-]{1,}){0,3})\b/,
    /\b([A-Z][A-Za-z0-9.&-]{2,}(?:\s+[A-Z][A-Za-z0-9.&-]{1,}){0,3})\s+(?:exchange|DEX|protocol|platform)\b/,
    /\b([A-Z][A-Za-z0-9.&-]{2,}(?:\s+[A-Z][A-Za-z0-9.&-]{1,}){0,2})\s+(?:shuts down|ceases operations|halts trading|suspends withdrawals|is hacked|was hacked|rebrands|is acquired|warning|enforcement action|sanctioned)\b/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const name = cleanCandidateName(match[1]);
      if (name && !KNOWN_BAD_NAMES.has(normalizeText(name))) return name;
    }
  }

  return null;
}

export function groupNewsItemsIntoCandidates(items) {
  const grouped = new Map();

  for (const item of items) {
    const name = extractCandidateNameFromNews(item);
    if (!name) continue;
    const key = slugifyName(name);
    const existing = grouped.get(key) || {
      canonical_name: name,
      aliases: [],
      source_urls: [],
      headlines: [],
      snippets: [],
      source_names: [],
      query_categories: new Set(),
      likely_event_types: new Set(),
      source_categories: new Set(),
      regulatory_authorities: new Set(),
      regulatory_regions: new Set(),
      regulatory_signals: new Set(),
      source_quality: 'low',
    };

    existing.source_urls.push(item.url);
    existing.headlines.push(item.title);
    existing.snippets.push(item.snippet);
    existing.source_names.push(item.source_name);
    existing.query_categories.add(inferEventCategory(`${item.title} ${item.snippet}`, item.query_category));
    existing.source_categories.add(item.source_category || 'news_event');
    if (item.regulatory_authority) existing.regulatory_authorities.add(item.regulatory_authority);
    if (item.regulatory_region) existing.regulatory_regions.add(item.regulatory_region);
    if (item.regulatory_signal) existing.regulatory_signals.add(item.regulatory_signal);
    for (const eventType of item.likely_event_types || []) existing.likely_event_types.add(eventType);
    const quality = sourceQuality(item);
    if (quality === 'high' || (quality === 'medium' && existing.source_quality === 'low')) existing.source_quality = quality;
    grouped.set(key, existing);
  }

  return [...grouped.values()].map((candidate) => {
    const categories = [...candidate.query_categories];
    const sourceCategories = [...candidate.source_categories];
    return {
      canonical_name: candidate.canonical_name,
      aliases: uniqueStrings(candidate.aliases),
      headline: candidate.headlines[0] || candidate.canonical_name,
      description: uniqueStrings([...candidate.headlines, ...candidate.snippets]).slice(0, 8).join(' | '),
      source_urls: uniqueStrings(candidate.source_urls).slice(0, 8),
      source_quality: candidate.source_quality,
      source_name: uniqueStrings(candidate.source_names).join(', '),
      source_category: sourceCategories.includes('regulatory_source') ? 'regulatory_source' : 'news_event',
      likely_type: categories.some((category) => String(category).includes('dex')) ? 'dex' : 'unknown',
      signals: uniqueStrings([
        sourceCategories.includes('regulatory_source') ? 'regulatory source watch' : 'news/event watch',
        ...categories,
        ...sourceCategories,
        ...[...candidate.likely_event_types].map((eventType) => `event:${eventType}`),
        ...[...candidate.regulatory_signals].map((signal) => `regulatory:${signal}`),
      ]),
      news_event_categories: categories,
      likely_event_types: [...candidate.likely_event_types],
      regulatory_authorities: [...candidate.regulatory_authorities],
      regulatory_regions: [...candidate.regulatory_regions],
      regulatory_signals: [...candidate.regulatory_signals],
    };
  });
}
