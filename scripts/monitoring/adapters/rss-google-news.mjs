const DEFAULT_TIMEOUT_MS = 15000;

function decodeXml(value) {
  return String(value || '')
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function stripHtml(value) {
  return decodeXml(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function getTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? decodeXml(match[1]) : '';
}

function getSource(block) {
  const match = block.match(/<source(?:\s+url="([^"]*)")?[^>]*>([\s\S]*?)<\/source>/i);
  if (!match) return { name: 'unknown', url: '' };
  return { name: decodeXml(match[2]) || 'unknown', url: decodeXml(match[1] || '') };
}

function controllerWithTimeout(timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeout };
}

function parseRssItems(xml, queryMeta) {
  const itemBlocks = [...String(xml || '').matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((match) => match[1]);
  return itemBlocks.map((block) => {
    const source = getSource(block);
    const link = getTag(block, 'link');
    const pubDate = getTag(block, 'pubDate');
    return {
      title: stripHtml(getTag(block, 'title')),
      url: link,
      source_name: source.name,
      source_url: source.url,
      published_at: pubDate ? new Date(pubDate).toISOString() : null,
      snippet: stripHtml(getTag(block, 'description')),
      query: queryMeta.query,
      query_category: queryMeta.category,
      likely_event_types: queryMeta.likely_event_types || [],
    };
  }).filter((item) => item.title || item.url);
}

export async function fetchGoogleNewsRss(queryMeta) {
  const encoded = encodeURIComponent(queryMeta.query);
  const url = `https://news.google.com/rss/search?q=${encoded}&hl=en-US&gl=US&ceid=US:en`;
  const { controller, timeout } = controllerWithTimeout();

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'user-agent': 'HEI-Monitoring/0.1' },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }
    const xml = await response.text();
    return {
      items: parseRssItems(xml, queryMeta),
      error: null,
      url,
    };
  } catch (error) {
    return {
      items: [],
      error: error?.message || String(error),
      url,
    };
  } finally {
    clearTimeout(timeout);
  }
}
