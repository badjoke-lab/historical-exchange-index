import path from 'node:path';
import { listJsonFiles, readJsonFile } from './fs-utils.mjs';
import { classifyReviewedBundles, mergeRecords } from '../../lib/reviewed-bundle-aggregation.mjs';
import { applyReviewedEntityCorrections } from '../../lib/entity-corrections.mjs';

const ENTITIES_PATH = 'data/entities.json';
const EVENTS_PATH = 'data/events.json';
const EVIDENCE_PATH = 'data/evidence.json';
const RECORDS_PATH = path.join('records', 'exchanges');

function normalizeArray(value, filePath) {
  if (Array.isArray(value)) return value;
  throw new Error(`${filePath} must contain a JSON array`);
}

async function loadExchangeRecordEntries() {
  const files = await listJsonFiles(RECORDS_PATH);
  const entries = [];
  for (const filePath of files) {
    const bundle = await readJsonFile(filePath, null);
    if (!bundle?.entity || !Array.isArray(bundle.events) || !Array.isArray(bundle.evidence)) {
      throw new Error(`${filePath}: expected { entity, events, evidence }`);
    }
    entries.push({ fileName: filePath, bundle });
  }
  return entries;
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
  const [baseEntities, baseEvents, baseEvidence, entries] = await Promise.all([
    loadEntities(),
    loadEvents(),
    loadEvidence(),
    loadExchangeRecordEntries(),
  ]);
  const { all, newEntityBundles } = classifyReviewedBundles(baseEntities, entries);
  const correctedEntities = applyReviewedEntityCorrections(baseEntities, all);

  return {
    entities: [...correctedEntities, ...newEntityBundles.map(({ bundle }) => bundle.entity)],
    events: mergeRecords(baseEvents, all, 'events', 'event'),
    evidence: mergeRecords(baseEvidence, all, 'evidence', 'evidence'),
    paths: {
      entities: ENTITIES_PATH,
      events: EVENTS_PATH,
      evidence: EVIDENCE_PATH,
      records: RECORDS_PATH,
    },
  };
}
