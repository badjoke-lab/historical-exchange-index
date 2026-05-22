import fs from 'node:fs';
import path from 'node:path';

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

const entityPath = path.join(DATA_DIR, 'entities.json');
const eventPath = path.join(DATA_DIR, 'events.json');
const evidencePath = path.join(DATA_DIR, 'evidence.json');

const entities = readJson(entityPath);
const events = readJson(eventPath);
const evidence = readJson(evidencePath);

const entityById = new Map(entities.map((entity) => [entity.id, entity]));
const eventById = new Map(events.map((event) => [event.id, event]));
const evidenceById = new Map(evidence.map((source) => [source.id, source]));

let bundleCount = 0;
for (const filePath of listRecordFiles()) {
  const bundle = readJson(filePath);
  bundleCount += 1;

  if (!bundle.entity || !Array.isArray(bundle.events) || !Array.isArray(bundle.evidence)) {
    throw new Error(`${filePath}: expected { entity, events, evidence }`);
  }

  if (entityById.has(bundle.entity.id)) {
    throw new Error(`${filePath}: entity id already exists in data/entities.json: ${bundle.entity.id}`);
  }
  entityById.set(bundle.entity.id, bundle.entity);

  for (const event of bundle.events) {
    if (eventById.has(event.id)) {
      throw new Error(`${filePath}: event id already exists in data/events.json: ${event.id}`);
    }
    eventById.set(event.id, event);
  }

  for (const source of bundle.evidence) {
    if (evidenceById.has(source.id)) {
      throw new Error(`${filePath}: evidence id already exists in data/evidence.json: ${source.id}`);
    }
    evidenceById.set(source.id, source);
  }
}

const nextEntities = [...entityById.values()].sort((a, b) => idNumber(a.id) - idNumber(b.id));
const nextEvents = [...eventById.values()].sort((a, b) => idNumber(a.id) - idNumber(b.id));
const nextEvidence = [...evidenceById.values()].sort((a, b) => idNumber(a.id) - idNumber(b.id));

writeJson(entityPath, nextEntities);
writeJson(eventPath, nextEvents);
writeJson(evidencePath, nextEvidence);

console.log(`built data from ${bundleCount} record bundle(s)`);
console.log(`entities: ${entities.length} -> ${nextEntities.length}`);
console.log(`events: ${events.length} -> ${nextEvents.length}`);
console.log(`evidence: ${evidence.length} -> ${nextEvidence.length}`);
