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
    description: 'Optional remote adapter for DEX-like protocol discovery. Disabled by default to avoid noisy scheduled runs.',
    category: 'active_motherlist',
    item_limit: 100,
    transform: 'defillama_protocols_dexlike',
  },
];

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

function transformDefillamaProtocolsDexlike(json, source) {
  const protocols = Array.isArray(json) ? json : [];
  const dexLike = protocols.filter((item) => {
    const text = `${item.name || ''} ${item.category || ''} ${(item.chains || []).join(' ')}`.toLowerCase();
    return /\b(dex|derivatives|options|synthetics|yield aggregator|liquid staking)\b/.test(text)
      && !/\b(lending|wallet|nft|bridge)\b/.test(text);
  });

  return dexLike.slice(0, source.item_limit || 100).map((item) => withSource({
    canonical_name: item.name,
    aliases: [],
    likely_type: /dex|derivatives|options|synthetics/i.test(item.category || '') ? 'dex' : 'hybrid',
    likely_status: 'active',
    headline: `${item.name} appears in a remote protocol directory`,
    description: `${item.name} category=${item.category || 'unknown'} chains=${(item.chains || []).slice(0, 8).join(', ')}`,
    source_urls: [item.url || `https://defillama.com/protocol/${item.slug}`].filter(Boolean),
    source_quality: 'medium',
    signals: ['external list diff', 'active motherlist candidate', item.category || 'unknown'],
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
