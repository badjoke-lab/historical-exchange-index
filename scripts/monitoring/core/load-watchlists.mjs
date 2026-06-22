import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { listJsonFiles, pathExists } from './fs-utils.mjs';
import { WATCHLIST_AUTO_ROOT, WATCHLIST_RESOLUTION_ROOT } from './constants.mjs';
import { candidateKeyFor, candidateKeyFromName, normalizeCandidateName } from './candidate-identity.mjs';
import { loadResolutionIndex, RESOLUTION_INDEX_PATH } from './resolution-store.mjs';

const WATCHLIST_ROOT = 'data-staging/watchlists';
const MANUAL_STAGING_ROOT = 'data-staging/manual';

async function readJsonLoose(filePath) {
  try {
    const raw = await readFile(filePath, 'utf8');
    return { path: filePath, json: JSON.parse(raw), error: null };
  } catch (error) {
    return { path: filePath, json: null, error: error?.message || String(error) };
  }
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function getCandidatesFromWatchlist(json) {
  if (!json || typeof json !== 'object') return [];
  return [
    ...asArray(json.candidates),
    ...asArray(json.records?.candidates),
    ...asArray(json.items),
  ];
}

function getCandidateName(candidate) {
  if (typeof candidate === 'string') return candidate;
  return candidate?.canonical_name || candidate?.name || candidate?.exchange || candidate?.title || candidate?.slug || null;
}

function getCandidateClass(candidate) {
  if (typeof candidate === 'string') return null;
  return candidate?.candidate_class || candidate?.class || candidate?.bucket || null;
}

function getCandidateCreatedAt(candidate, fallback = null) {
  if (typeof candidate === 'string') return fallback;
  return candidate?.created_at || candidate?.discovered_at || candidate?.first_seen_at || fallback;
}

function dateValue(value) {
  const time = Date.parse(value || '');
  return Number.isFinite(time) ? time : null;
}

function isCandidateQueueFile(filePath) {
  const normalized = filePath.split(path.sep).join('/');
  if (normalized.startsWith(`${WATCHLIST_AUTO_ROOT}/`)) return true;
  return normalized.startsWith(`${WATCHLIST_ROOT}/recent-negative-candidates`);
}

function aggregateCandidateHistory(entries) {
  const byKey = new Map();
  let rawCount = 0;

  for (const entry of entries.filter((item) => !item.error)) {
    const fallbackCreatedAt = entry.json?.created_at || entry.json?.generated_at || null;
    for (const raw of getCandidatesFromWatchlist(entry.json)) {
      const name = getCandidateName(raw);
      if (!name) continue;
      const candidate = typeof raw === 'string' ? { canonical_name: raw } : raw;
      const candidateKey = candidateKeyFor(candidate);
      if (!candidateKey) continue;
      rawCount += 1;
      const createdAt = getCandidateCreatedAt(candidate, fallbackCreatedAt);
      const existing = byKey.get(candidateKey);
      if (!existing) {
        byKey.set(candidateKey, {
          candidate_key: candidateKey,
          name,
          normalized_name: normalizeCandidateName(name),
          candidate_class: getCandidateClass(candidate),
          first_seen_at: createdAt,
          last_seen_at: createdAt,
          occurrence_count: 1,
          source_files: [entry.path],
          candidate_classes: getCandidateClass(candidate) ? [getCandidateClass(candidate)] : [],
          raw: candidate,
        });
        continue;
      }

      existing.occurrence_count += 1;
      if (!existing.source_files.includes(entry.path)) existing.source_files.push(entry.path);
      const cls = getCandidateClass(candidate);
      if (cls && !existing.candidate_classes.includes(cls)) existing.candidate_classes.push(cls);
      const existingFirst = dateValue(existing.first_seen_at);
      const existingLast = dateValue(existing.last_seen_at);
      const current = dateValue(createdAt);
      if (current !== null && (existingFirst === null || current < existingFirst)) existing.first_seen_at = createdAt;
      if (current !== null && (existingLast === null || current >= existingLast)) {
        existing.last_seen_at = createdAt;
        existing.name = name;
        existing.normalized_name = normalizeCandidateName(name);
        existing.candidate_class = cls;
        existing.raw = candidate;
      }
    }
  }

  return {
    candidates: [...byKey.values()].sort((left, right) => left.candidate_key.localeCompare(right.candidate_key)),
    byKey,
    rawCount,
  };
}

export async function loadWatchlists() {
  if (!(await pathExists(WATCHLIST_ROOT))) {
    return { files: [], candidates: [], byKey: new Map(), rawCandidateCount: 0, parseErrors: [] };
  }

  const allFiles = await listJsonFiles(WATCHLIST_ROOT);
  const files = allFiles.filter(isCandidateQueueFile);
  const entries = await Promise.all(files.map(readJsonLoose));
  const parseErrors = entries.filter((entry) => entry.error);
  const history = aggregateCandidateHistory(entries);

  return {
    files: entries,
    candidates: history.candidates,
    byKey: history.byKey,
    rawCandidateCount: history.rawCount,
    parseErrors,
  };
}

export async function loadManualStagingPackages() {
  if (!(await pathExists(MANUAL_STAGING_ROOT))) {
    return { files: [], packages: [], parseErrors: [] };
  }
  const files = await listJsonFiles(MANUAL_STAGING_ROOT);
  const entries = await Promise.all(files.map(readJsonLoose));
  const parseErrors = entries.filter((entry) => entry.error);
  const packages = [];

  for (const entry of entries.filter((item) => !item.error)) {
    const entities = asArray(entry.json?.records?.entities);
    if (!entities.length) continue;
    packages.push({
      path: entry.path,
      created_at: entry.json?.created_at || null,
      package_type: entry.json?.package_type || null,
      entities: entities.map((entity) => ({
        id: entity.id || null,
        slug: entity.slug || null,
        canonical_name: entity.canonical_name || entity.name || null,
        normalized_name: normalizeCandidateName(entity.canonical_name || entity.name || entity.slug || ''),
      })),
    });
  }
  return { files: entries, packages, parseErrors };
}

function legacyResolutionCandidates(json) {
  if (!json || typeof json !== 'object') return [];
  const buckets = [
    ...asArray(json.promoted_to_canonical),
    ...asArray(json.hold_or_out_of_scope),
    ...asArray(json.out_of_scope),
    ...asArray(json.resolved),
  ];
  return buckets.map((item) => ({ item, name: getCandidateName(item) })).filter((item) => item.name);
}

export async function loadResolutionFiles() {
  const authoritative = await loadResolutionIndex();
  if (!(await pathExists(WATCHLIST_RESOLUTION_ROOT))) {
    return {
      files: [],
      resolvedNames: new Set(),
      parseErrors: [],
      coverageErrors: [],
      ...authoritative,
    };
  }

  const files = (await listJsonFiles(WATCHLIST_RESOLUTION_ROOT))
    .filter((filePath) => filePath.split(path.sep).join('/') !== RESOLUTION_INDEX_PATH);
  const entries = await Promise.all(files.map(readJsonLoose));
  const parseErrors = entries.filter((entry) => entry.error);
  const coverageErrors = [];

  for (const entry of entries.filter((item) => !item.error)) {
    for (const candidate of legacyResolutionCandidates(entry.json)) {
      if (!authoritative.match({ canonical_name: candidate.name })) {
        coverageErrors.push(`${entry.path}: legacy resolution missing from index: ${candidate.name}`);
      }
    }
  }

  const resolvedNames = new Set();
  for (const entry of authoritative.index.entries || []) {
    for (const value of [entry.canonical_name, ...(entry.aliases || [])]) {
      const normalized = normalizeCandidateName(value);
      if (normalized) resolvedNames.add(normalized);
    }
  }

  return {
    files: entries,
    resolvedNames,
    parseErrors,
    coverageErrors,
    ...authoritative,
  };
}

export { WATCHLIST_AUTO_ROOT, WATCHLIST_RESOLUTION_ROOT, normalizeCandidateName as normalizeName, candidateKeyFromName };
