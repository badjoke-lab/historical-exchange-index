import fs from 'node:fs';
import path from 'node:path';
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs';

const ROOT = process.cwd();
const RECORD_DIR = path.join(ROOT, 'records', 'exchanges');
const DATA_DIR = path.join(ROOT, 'data');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function listRecordFiles() {
  if (!fs.existsSync(RECORD_DIR)) return [];
  return fs
    .readdirSync(RECORD_DIR)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => path.join(RECORD_DIR, name));
}

function idNumber(id) {
  const match = String(id).match(/_(\d+)$/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(',')}}`;
  }

  return JSON.stringify(value);
}

function addOrVerify(map, item, filePath, label) {
  const existing = map.get(item.id);
  if (!existing) {
    map.set(item.id, item);
    return 'added';
  }

  if (stableStringify(existing) !== stableStringify(item)) {
    throw new Error(`${filePath}: ${label} id already exists with different content: ${item.id}`);
  }

  return 'unchanged';
}

const entityPath = path.join(DATA_DIR, 'entities.json');
const eventPath = path.join(DATA_DIR, 'events.json');
const evidencePath = path.join(DATA_DIR, 'evidence.json');

const entities = readJson(entityPath);
const events = readJson(eventPath);
const evidence = readJson(evidencePath);
const recordEntries = listRecordFiles().map((filePath) => ({
  fileName: path.basename(filePath),
  filePath,
  bundle: readJson(filePath),
}));
const correctedEntities = applyReviewedEntityCorrections(entities, recordEntries);
const correctedEntityById = new Map(correctedEntities.map((entity) => [entity.id, entity]));

const entityById = new Map(entities.map((entity) => [entity.id, entity]));
const eventById = new Map(events.map((event) => [event.id, event]));
const evidenceById = new Map(evidence.map((source) => [source.id, source]));

let bundleCount = 0;
let addedEntities = 0;
let addedEvents = 0;
let addedEvidence = 0;
let correctionBundles = 0;
let unchangedEntries = 0;

for (const { filePath, bundle } of recordEntries) {
  bundleCount += 1;

  if (!bundle.entity || !Array.isArray(bundle.events) || !Array.isArray(bundle.evidence)) {
    throw new Error(`${filePath}: expected { entity, events, evidence }`);
  }

  if (bundle.entity_correction) {
    const corrected = correctedEntityById.get(bundle.entity.id);
    if (!corrected || stableStringify(corrected) !== stableStringify(bundle.entity)) {
      throw new Error(`${filePath}: correction bundle entity does not match guarded correction result`);
    }
    correctionBundles += 1;
  } else if (addOrVerify(entityById, bundle.entity, filePath, 'entity') === 'added') {
    addedEntities += 1;
  } else {
    unchangedEntries += 1;
  }

  for (const event of bundle.events) {
    if (addOrVerify(eventById, event, filePath, 'event') === 'added') {
      addedEvents += 1;
    } else {
      unchangedEntries += 1;
    }
  }

  for (const source of bundle.evidence) {
    if (addOrVerify(evidenceById, source, filePath, 'evidence') === 'added') {
      addedEvidence += 1;
    } else {
      unchangedEntries += 1;
    }
  }
}

const nextEntities = [...entityById.values()].sort((a, b) => idNumber(a.id) - idNumber(b.id));
const nextEvents = [...eventById.values()].sort((a, b) => idNumber(a.id) - idNumber(b.id));
const nextEvidence = [...evidenceById.values()].sort((a, b) => idNumber(a.id) - idNumber(b.id));

writeJson(entityPath, nextEntities);
writeJson(eventPath, nextEvents);
writeJson(evidencePath, nextEvidence);

console.log(`built data from ${bundleCount} record bundle(s)`);
console.log(`entities: ${entities.length} -> ${nextEntities.length} (+${addedEntities}; ${correctionBundles} correction bundle(s) retained)`);
console.log(`events: ${events.length} -> ${nextEvents.length} (+${addedEvents})`);
console.log(`evidence: ${evidence.length} -> ${nextEvidence.length} (+${addedEvidence})`);
console.log(`unchanged existing bundle entries: ${unchangedEntries}`);
