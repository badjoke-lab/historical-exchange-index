import path from 'node:path';
import { listJsonFiles, readJsonFile } from './fs-utils.mjs';

const ENTITIES_PATH = 'data/entities.json';
const EVENTS_PATH = 'data/events.json';
const EVIDENCE_PATH = 'data/evidence.json';
const RECORDS_PATH = path.join('records', 'exchanges');

function normalizeArray(value, filePath) {
  if (Array.isArray(value)) return value;
  throw new Error(`${filePath} must contain a JSON array`);
}

function normalizeIdentity(value) {
  if (!value) return null;
  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
  return normalized || null;
}

function entityIdentityKeys(entity) {
  return new Set([
    entity?.id,
    entity?.slug,
    entity?.canonical_name,
    entity?.official_domain_original,
    entity?.official_url_original,
    ...(entity?.aliases || []),
  ].map(normalizeIdentity).filter(Boolean));
}

async function loadExchangeRecordBundles() {
  const files = await listJsonFiles(RECORDS_PATH);
  const bundles = [];
  for (const filePath of files) {
    const bundle = await readJsonFile(filePath, null);
    if (!bundle?.entity || !Array.isArray(bundle.events) || !Array.isArray(bundle.evidence)) {
      throw new Error(`${filePath}: expected { entity, events, evidence }`);
    }
    bundles.push(bundle);
  }
  return bundles;
}

function mergeNewEntities(baseEntities, bundles) {
  const seen = new Set(baseEntities.flatMap((entity) => [...entityIdentityKeys(entity)]));
  const added = [];
  for (const bundle of bundles) {
    const keys = entityIdentityKeys(bundle.entity);
    if ([...keys].some((key) => seen.has(key))) continue;
    added.push(bundle.entity);
    for (const key of keys) seen.add(key);
  }
  return [...baseEntities, ...added];
}

function mergeBundleRecords(baseRecords, bundles, field) {
  const seen = new Set(baseRecords.map((record) => record.id));
  const added = [];
  for (const bundle of bundles) {
    for (const record of bundle[field]) {
      if (seen.has(record.id)) continue;
      seen.add(record.id);
      added.push(record);
    }
  }
  return [...baseRecords, ...added];
}

export async function loadEntities() {
  return normalizeArray(await readJsonFile(ENTITIES_PATH, []), ENTITIES_PATH);
}

export async function loadEvents() {
  return normalizeArray(await readJsonFile(EVENTS_PATH, []), EVENTS_PATH);
}

export async function loadEvidence() {
  return normalizeArray(await readJsonFile(EVIDENCE_PATH, []), EVIDENCE_PATH);
}

export async function loadCanonicalData() {
  const [baseEntities, baseEvents, baseEvidence, bundles] = await Promise.all([
    loadEntities(),
    loadEvents(),
    loadEvidence(),
    loadExchangeRecordBundles(),
  ]);

  return {
    entities: mergeNewEntities(baseEntities, bundles),
    events: mergeBundleRecords(baseEvents, bundles, 'events'),
    evidence: mergeBundleRecords(baseEvidence, bundles, 'evidence'),
    paths: {
      entities: ENTITIES_PATH,
      events: EVENTS_PATH,
      evidence: EVIDENCE_PATH,
      records: RECORDS_PATH,
    },
  };
}
