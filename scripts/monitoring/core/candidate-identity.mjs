export function normalizeCandidateName(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function candidateKeyFromName(value) {
  const normalized = normalizeCandidateName(value);
  return normalized ? `candidate:${normalized.replace(/\s+/g, '-')}` : null;
}

export function candidateIdentityNames(candidate) {
  const names = [
    candidate?.canonical_name,
    candidate?.name,
    candidate?.exchange,
    candidate?.title,
    candidate?.slug,
    ...(Array.isArray(candidate?.aliases) ? candidate.aliases : []),
  ];
  return [...new Set(names.map(normalizeCandidateName).filter(Boolean))];
}

export function candidateIdentityKeys(candidate) {
  return candidateIdentityNames(candidate)
    .map(candidateKeyFromName)
    .filter(Boolean);
}

export function candidateKeyFor(candidate) {
  return candidate?.candidate_key
    || candidateKeyFromName(candidate?.canonical_name || candidate?.name || candidate?.title || candidate?.slug);
}
