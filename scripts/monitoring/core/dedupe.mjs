import { normalizeText, slugifyName, normalizeDomain } from './normalize.mjs';

export function buildEntityIndex(entities = []) {
  const bySlug = new Map();
  const byName = new Map();
  const byDomain = new Map();

  for (const entity of entities) {
    if (entity.slug) bySlug.set(entity.slug, entity);
    for (const name of [entity.canonical_name, ...(entity.aliases || [])]) {
      const normalized = normalizeText(name);
      if (normalized) byName.set(normalized, entity);
    }
    const domain = normalizeDomain(entity.official_domain_original || entity.official_url_original || '');
    if (domain) byDomain.set(domain, entity);
  }

  return { bySlug, byName, byDomain };
}

export function findExistingEntity(candidate, index) {
  const name = candidate?.canonical_name || candidate?.name || '';
  const slug = candidate?.slug || slugifyName(name);
  const domain = normalizeDomain(candidate?.official_domain || candidate?.official_url || candidate?.url || '');
  const aliases = candidate?.aliases || [];

  if (slug && index.bySlug.has(slug)) {
    return { entity: index.bySlug.get(slug), method: 'slug' };
  }

  const normalizedName = normalizeText(name);
  if (normalizedName && index.byName.has(normalizedName)) {
    return { entity: index.byName.get(normalizedName), method: 'canonical_name' };
  }

  for (const alias of aliases) {
    const normalizedAlias = normalizeText(alias);
    if (normalizedAlias && index.byName.has(normalizedAlias)) {
      return { entity: index.byName.get(normalizedAlias), method: 'alias' };
    }
  }

  if (domain && index.byDomain.has(domain)) {
    return { entity: index.byDomain.get(domain), method: 'domain' };
  }

  return { entity: null, method: 'no_match' };
}

export function duplicateCheckForCandidate(candidate, index) {
  const match = findExistingEntity(candidate, index);
  return {
    matched_existing_entity: Boolean(match.entity),
    matched_id: match.entity?.id || null,
    matched_slug: match.entity?.slug || null,
    method: match.method,
  };
}
