export function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function slugifyName(value) {
  return normalizeText(value)
    .replace(/\s+/g, '-')
    .replace(/^-|-$/g, '');
}

export function normalizeDomain(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';

  try {
    const url = raw.includes('://') ? new URL(raw) : new URL(`https://${raw}`);
    return url.hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return raw
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]
      .trim();
  }
}

export function extractDomain(value) {
  return normalizeDomain(value);
}

export function uniqueStrings(values) {
  return [...new Set(values.map((value) => String(value || '').trim()).filter(Boolean))];
}

export function isExchangeLikeText(value) {
  const text = normalizeText(value);
  if (!text) return false;
  return /\b(exchange|dex|swap|trading|markets?|perp|derivatives?|crypto)\b/.test(text);
}

export function isLikelyOutOfScopeText(value) {
  const text = normalizeText(value);
  if (!text) return false;
  return /\b(wallet|nft|mining|stablecoin|airdrop|memecoin|meme coin|lending only|portfolio|analytics)\b/.test(text);
}
