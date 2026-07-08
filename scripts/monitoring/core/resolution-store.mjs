import { listJsonFiles, pathExists, readJsonFile } from './fs-utils.mjs';
import { candidateIdentityKeys, candidateKeyFor, candidateKeyFromName } from './candidate-identity.mjs';

export const RESOLUTION_INDEX_PATH = 'data-staging/watchlists/resolution/index.json';
export const RESOLUTION_OVERRIDE_ROOT = 'data-staging/watchlists/resolution/overrides';
export const ALLOWED_RESOLUTION_STATES = [
  'promoted',
  'held',
  'out_of_scope',
  'duplicate',
  'already_canonical',
  'needs_research',
];
export const TERMINAL_RESOLUTION_STATES = new Set([
  'promoted',
  'out_of_scope',
  'duplicate',
  'already_canonical',
]);
export const OPEN_RESOLUTION_STATES = new Set(['held', 'needs_research']);

function isDateLike(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}(?:T.*Z)?$/.test(value);
}

export function validateResolutionIndex(index) {
  const errors = [];
  if (!index || typeof index !== 'object') return ['resolution index must be an object'];
  if (index.version !== 1) errors.push('resolution index version must be 1');
  if (!Array.isArray(index.entries)) errors.push('resolution index entries must be an array');

  const keyOwners = new Map();
  const aliasOwners = new Map();
  for (const [position, entry] of (index.entries || []).entries()) {
    const label = `entries[${position}]`;
    if (!entry || typeof entry !== 'object') {
      errors.push(`${label} must be an object`);
      continue;
    }
    if (typeof entry.candidate_key !== 'string' || !/^candidate:[a-z0-9][a-z0-9-]*$/.test(entry.candidate_key)) {
      errors.push(`${label}.candidate_key is invalid`);
    }
    if (typeof entry.canonical_name !== 'string' || entry.canonical_name.trim().length < 2) {
      errors.push(`${label}.canonical_name is required`);
    }
    if (!['A', 'B', 'C', 'unknown'].includes(entry.candidate_class)) {
      errors.push(`${label}.candidate_class is invalid`);
    }
    if (!ALLOWED_RESOLUTION_STATES.includes(entry.state)) {
      errors.push(`${label}.state is invalid`);
    }
    if (!isDateLike(entry.first_seen_at)) errors.push(`${label}.first_seen_at is invalid`);
    if (!isDateLike(entry.last_reviewed_at)) errors.push(`${label}.last_reviewed_at is invalid`);
    if (entry.next_review_after !== undefined && !isDateLike(entry.next_review_after)) {
      errors.push(`${label}.next_review_after is invalid`);
    }
    if (!Array.isArray(entry.aliases)) errors.push(`${label}.aliases must be an array`);
    if (!Array.isArray(entry.source_files) || entry.source_files.length === 0) {
      errors.push(`${label}.source_files must be a non-empty array`);
    }
    if (typeof entry.notes !== 'string' || entry.notes.trim().length < 20) {
      errors.push(`${label}.notes is too short`);
    }

    if (keyOwners.has(entry.candidate_key)) {
      errors.push(`${label}.candidate_key duplicates ${keyOwners.get(entry.candidate_key)}`);
    } else {
      keyOwners.set(entry.candidate_key, label);
    }

    const identityKeys = new Set([
      entry.candidate_key,
      candidateKeyFromName(entry.canonical_name),
      ...(entry.aliases || []).map(candidateKeyFromName),
    ].filter(Boolean));
    for (const key of identityKeys) {
      const owner = aliasOwners.get(key);
      if (owner && owner !== entry.candidate_key) {
        errors.push(`${label} identity ${key} conflicts with ${owner}`);
      } else {
        aliasOwners.set(key, entry.candidate_key);
      }
    }
  }

  return errors;
}

export function buildResolutionState(index) {
  const byKey = new Map();
  const aliasToKey = new Map();
  const stateCounts = Object.fromEntries(ALLOWED_RESOLUTION_STATES.map((state) => [state, 0]));

  for (const entry of index.entries || []) {
    byKey.set(entry.candidate_key, entry);
    stateCounts[entry.state] = (stateCounts[entry.state] || 0) + 1;
    const identityKeys = new Set([
      entry.candidate_key,
      candidateKeyFromName(entry.canonical_name),
      ...(entry.aliases || []).map(candidateKeyFromName),
    ].filter(Boolean));
    for (const key of identityKeys) aliasToKey.set(key, entry.candidate_key);
  }

  function match(candidate) {
    for (const key of candidateIdentityKeys(candidate)) {
      const canonicalKey = aliasToKey.get(key) || key;
      const entry = byKey.get(canonicalKey);
      if (entry) return entry;
    }
    const directKey = candidateKeyFor(candidate);
    return directKey ? byKey.get(aliasToKey.get(directKey) || directKey) || null : null;
  }

  return {
    index,
    byKey,
    aliasToKey,
    stateCounts,
    terminalEntries: (index.entries || []).filter((entry) => TERMINAL_RESOLUTION_STATES.has(entry.state)),
    openEntries: (index.entries || []).filter((entry) => OPEN_RESOLUTION_STATES.has(entry.state)),
    match,
    isTerminal(candidate) {
      const entry = match(candidate);
      return Boolean(entry && TERMINAL_RESOLUTION_STATES.has(entry.state));
    },
    isOpen(candidate) {
      const entry = match(candidate);
      return Boolean(entry && OPEN_RESOLUTION_STATES.has(entry.state));
    },
  };
}

async function loadResolutionOverrides() {
  if (!(await pathExists(RESOLUTION_OVERRIDE_ROOT))) return { entries: [], errors: [] };

  const files = (await listJsonFiles(RESOLUTION_OVERRIDE_ROOT)).sort();
  const entries = [];
  const errors = [];

  for (const filePath of files) {
    const overlay = await readJsonFile(filePath, null);
    if (!overlay) {
      errors.push(`invalid resolution override: ${filePath}`);
      continue;
    }
    const overlayErrors = validateResolutionIndex(overlay);
    for (const error of overlayErrors) errors.push(`${filePath}: ${error}`);
    if (overlayErrors.length === 0) entries.push(...overlay.entries);
  }

  return { entries, errors };
}

export async function loadResolutionIndex() {
  const baseIndex = await readJsonFile(RESOLUTION_INDEX_PATH, null);
  if (!baseIndex) {
    return {
      path: RESOLUTION_INDEX_PATH,
      index: { version: 1, entries: [] },
      errors: [`missing resolution index: ${RESOLUTION_INDEX_PATH}`],
      ...buildResolutionState({ version: 1, entries: [] }),
    };
  }

  const baseErrors = validateResolutionIndex(baseIndex);
  const overrides = await loadResolutionOverrides();
  const byKey = new Map((baseIndex.entries || []).map((entry) => [entry.candidate_key, entry]));
  for (const entry of overrides.entries) byKey.set(entry.candidate_key, entry);

  const index = {
    ...baseIndex,
    updated_at: baseIndex.updated_at,
    entries: [...byKey.values()].sort((left, right) => left.candidate_key.localeCompare(right.candidate_key)),
  };
  const mergedErrors = validateResolutionIndex(index);
  const errors = [...baseErrors, ...overrides.errors, ...mergedErrors];

  return {
    path: RESOLUTION_INDEX_PATH,
    index,
    errors,
    ...buildResolutionState(index),
  };
}
