import { readJsonFile } from './fs-utils.mjs';

const ENTITIES_PATH = 'data/entities.json';
const EVENTS_PATH = 'data/events.json';
const EVIDENCE_PATH = 'data/evidence.json';

function normalizeArray(value, path) {
  if (Array.isArray(value)) {
    return value;
  }

  throw new Error(`${path} must contain a JSON array`);
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
  const [entities, events, evidence] = await Promise.all([
    loadEntities(),
    loadEvents(),
    loadEvidence(),
  ]);

  return {
    entities,
    events,
    evidence,
    paths: {
      entities: ENTITIES_PATH,
      events: EVENTS_PATH,
      evidence: EVIDENCE_PATH,
    },
  };
}
