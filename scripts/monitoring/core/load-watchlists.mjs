import { readFile } from 'node:fs/promises';
import { listJsonFiles, pathExists } from './fs-utils.mjs';
import { WATCHLIST_AUTO_ROOT, WATCHLIST_RESOLUTION_ROOT } from './constants.mjs';

const WATCHLIST_ROOT = 'data-staging/watchlists';
const MANUAL_STAGING_ROOT = 'data-staging/manual';

async function readJsonLoose(filePath) {
  try {
    const raw = await readFile(filePath, 'utf8');
    return {
      path: filePath,
      json: JSON.parse(raw),
      error: null,
    };
  } catch (error) {
    return {
      path: filePath,
      json: null,
      error: error?.message || String(error),
    };
  }
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function getCandidatesFromWatchlist(json) {
  if (!json || typeof json !== 'object') return [];

  const candidates = [
    ...asArray(json.candidates),
    ...asArray(json.records?.candidates),
    ...asArray(json.items),
  ];

  for (const key of ['A', 'B', 'C', 'promoted_to_canonical', 'still_watch', 'hold_or_out_of_scope']) {
    if (Array.isArray(json[key])) {
      candidates.push(...json[key].map((item) => (typeof item === 'string' ? { canonical_name: item, bucket: key } : { ...item, bucket: key })));
    }
  }

  return candidates;
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

function normalizeName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export async function loadWatchlists() {
  if (!(await pathExists(WATCHLIST_ROOT))) {
    return { files: [], candidates: [], parseErrors: [] };
  }

  const files = await listJsonFiles(WATCHLIST_ROOT);
  const entries = await Promise.all(files.map(readJsonLoose));
  const parseErrors = entries.filter((entry) => entry.error);
  const candidates = [];

  for (const entry of entries.filter((item) => !item.error)) {
    const json = entry.json;
    const fallbackCreatedAt = json?.created_at || json?.generated_at || null;
    for (const candidate of getCandidatesFromWatchlist(json)) {
      const name = getCandidateName(candidate);
      if (!name) continue;
      candidates.push({
        name,
        normalized_name: normalizeName(name),
        candidate_class: getCandidateClass(candidate),
        created_at: getCandidateCreatedAt(candidate, fallbackCreatedAt),
        source_file: entry.path,
        raw: candidate,
      });
    }
  }

  return { files: entries, candidates, parseErrors };
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
        normalized_name: normalizeName(entity.canonical_name || entity.name || entity.slug || ''),
      })),
    });
  }

  return { files: entries, packages, parseErrors };
}

export async function loadResolutionFiles() {
  if (!(await pathExists(WATCHLIST_RESOLUTION_ROOT))) {
    return { files: [], resolvedNames: new Set(), parseErrors: [] };
  }

  const files = await listJsonFiles(WATCHLIST_RESOLUTION_ROOT);
  const entries = await Promise.all(files.map(readJsonLoose));
  const parseErrors = entries.filter((entry) => entry.error);
  const resolvedNames = new Set();

  for (const entry of entries.filter((item) => !item.error)) {
    const json = entry.json;
    const buckets = [
      ...asArray(json.promoted_to_canonical),
      ...asArray(json.hold_or_out_of_scope),
      ...asArray(json.out_of_scope),
      ...asArray(json.resolved),
    ];
    for (const item of buckets) {
      const name = getCandidateName(item);
      if (name) resolvedNames.add(normalizeName(name));
    }
  }

  return { files: entries, resolvedNames, parseErrors };
}

export { WATCHLIST_AUTO_ROOT, WATCHLIST_RESOLUTION_ROOT, normalizeName };
