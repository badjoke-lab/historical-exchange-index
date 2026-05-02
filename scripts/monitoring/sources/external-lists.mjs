const ENABLE_REMOTE_LISTS = process.env.HEI_MONITORING_ENABLE_REMOTE_LISTS === '1';
const DEFAULT_TIMEOUT_MS = 15000;

export const EXTERNAL_LIST_SOURCES = [
  {
    name: 'manual-seed',
    type: 'static',
    description: 'Static seed for validating candidate-discovery plumbing. Keep small and curated.',
    category: 'manual',
    items: [],
  },
  {
    name: 'historical-dead-seed',
    type: 'static',
    description: 'Curated local seed for historical dead/rebranded/acquired exchange candidates. Empty by default; filled by later research or generated watchlists.',
    category: 'historical_dead',
    items: [],
  },
  {
    name: 'defillama-protocols-dexlike',
    type: 'remote_json',
    enabled: ENABLE_REMOTE_LISTS,
    url: 'https://api.llama.fi/protocols',
    description: 'Optional remote adapter for DEX / derivatives / trading-venue discovery. Disabled by default and deliberately excludes staking, lending, vault, and yield products.',
    category: 'active_trading_venue_motherlist',
    item_limit: 75,
    transform: 'defillama_protocols_dexlike',
  },
];

const DEFINITELY_TRADING_VENUE_RE = /\b(dex|derivatives?|options?|synthetics?)\b/i;
const TRADING_NAME_RE = /\b(dex|swap|exchange|perp|perps|perpetual|trade|trading|market|markets)\b/i;
const NON_EXCHANGE_PROTOCOL_RE = /\b(liquid\s+staking|staking|staked|lst\b|lsd\b|restaking|validator|yield|vault|vaults|earn|lending|borrow|borrowing|cdp|rwa|bridge|wallet|nft|index|privacy|oracle)\b/i;

function withSource(item, source) {
  return {
    ...item,
    source_name: source.name,
    source_type: source.type,
    source_category: source.category || 'unknown',
  };
}

function controllerWithTimeout(timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeout };
}

async function fetchJson(url) {
  const { controller, timeout } = controllerWithTimeout();
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'user-agent': 'HEI-Monitoring/0.1' },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function isDefillamaTradingVenueCandidate(item) {
  const category = String(item.category || '');
  const name = String(item.name || '');
  const descriptionText = `${name} ${category} ${(item.chains || []).join(' ')}`;
  const hasTradingCategory = DEFINITELY_TRADING_VENUE_RE.test(category);
  const hasTradingName = TRADING_NAME_RE.test(name);
  const looksLikeNonExchangeProduct = NON_EXCHANGE_PROTOCOL_RE.test(descriptionText);

  if (looksLikeNonExchangeProduct && !hasTradingCategory) return false;
  if (hasTradingCategory) return true;
  if (hasTradingName && !looksLikeNonExchangeProduct) return true;
  return false;
}

function inferDefillamaType(item) {
  const category = String(item.category || '');
  const name = String(item.name || '');
  if (/\b(dex|derivatives?|options?|synthetics?)\b/i.test(`${category} ${name}`)) return 'dex';
  return 'hybrid';
}

function transformDefillamaProtocolsDexlike(json, source) {
  const protocols = Array.isArray(json) ? json : [];
  const dexLike = protocols.filter(isDefillamaTradingVenueCandidate);

  return dexLike.slice(0, source.item_limit || 75).map((item) => withSource({
    canonical_name: item.name,
    aliases: [],
    likely_type: inferDefillamaType(item),
    likely_status: 'active',
    headline: `${item.name} appears in a remote trading-venue directory`,
    description: `${item.name} category=${item.category || 'unknown'} chains=${(item.chains || []).slice(0, 8).join(', ')}`,
    source_urls: [item.url || `https://defillama.com/protocol/${item.slug}`].filter(Boolean),
    source_quality: 'medium',
    signals: ['external list diff', 'active trading venue candidate', item.category || 'unknown'],
    url: item.url || null,
    official_url: item.url || null,
  }, source));
}

function transformRemoteJson(json, source) {
  if (source.transform === 'defillama_protocols_dexlike') {
    return transformDefillamaProtocolsDexlike(json, source);
  }
  return [];
}

export function getStaticExternalItems() {
  return EXTERNAL_LIST_SOURCES.flatMap((source) => {
    if (source.type !== 'static') return [];
    return (source.items || []).map((item) => withSource(item, source));
  });
}

export async function getRemoteExternalItems() {
  const enabledRemoteSources = EXTERNAL_LIST_SOURCES.filter((source) => source.type === 'remote_json' && source.enabled);
  const items = [];
  const errors = [];

  for (const source of enabledRemoteSources) {
    try {
      const json = await fetchJson(source.url);
      items.push(...transformRemoteJson(json, source));
    } catch (error) {
      errors.push({
        source_name: source.name,
        url: source.url,
        error: error?.message || String(error),
      });
    }
  }

  return { items, errors };
}

export async function getExternalItems() {
  const staticItems = getStaticExternalItems();
  const remote = await getRemoteExternalItems();
  return {
    items: [...staticItems, ...remote.items],
    errors: remote.errors,
    source_summary: {
      static_sources: EXTERNAL_LIST_SOURCES.filter((source) => source.type === 'static').length,
      remote_sources: EXTERNAL_LIST_SOURCES.filter((source) => source.type === 'remote_json').length,
      remote_enabled: EXTERNAL_LIST_SOURCES.filter((source) => source.type === 'remote_json' && source.enabled).length,
    },
  };
}
