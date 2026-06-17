import fs from 'node:fs';
import path from 'node:path';
import { stableStringify } from './lib/reviewed-bundle-aggregation.mjs';
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs';

const ROOT = process.cwd();
const RECORD_DIR = path.join(ROOT, 'records', 'exchanges');
const ENTITY_PATH = path.join(ROOT, 'data', 'entities.json');

const REQUIRED_ENTITY_FIELDS = [
  'id',
  'slug',
  'canonical_name',
  'aliases',
  'type',
  'status',
  'death_reason',
  'launch_date',
  'death_date',
  'country_or_origin',
  'summary',
  'official_url_original',
  'official_domain_original',
  'official_url_status',
  'archived_url',
  'confidence',
  'last_verified_at',
  'notes',
];

const REQUIRED_EVENT_FIELDS = [
  'id',
  'exchange_id',
  'event_type',
  'event_date',
  'title',
  'description',
  'confidence',
  'impact_level',
  'event_status_effect',
  'source_count',
  'sort_order',
  'notes',
];

const REQUIRED_EVIDENCE_FIELDS = [
  'id',
  'exchange_id',
  'event_id',
  'source_type',
  'title',
  'url',
  'publisher',
  'published_at',
  'archived_url',
  'accessed_at',
  'reliability',
  'claim_scope',
  'notes',
];

function fail(message) {
  throw new Error(message);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`${filePath}: invalid JSON: ${error.message}`);
  }
}

function requireObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail(`${label}: expected object`);
  }
}

function requireArray(value, label) {
  if (!Array.isArray(value)) {
    fail(`${label}: expected array`);
  }
}

function requireFields(value, fields, label) {
  for (const field of fields) {
    if (!(field in value)) {
      fail(`${label}: missing required field ${field}`);
    }
  }
}

function requireId(value, prefix, label) {
  if (typeof value !== 'string' || !value.startsWith(prefix)) {
    fail(`${label}: expected id starting with ${prefix}`);
  }
}

function listRecordFiles() {
  if (!fs.existsSync(RECORD_DIR)) return [];
  return fs
    .readdirSync(RECORD_DIR)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => path.join(RECORD_DIR, name));
}

const files = listRecordFiles();
const canonicalEntities = readJson(ENTITY_PATH);
const entries = [];
const allIds = new Set();
let checked = 0;

for (const filePath of files) {
  const bundle = readJson(filePath);
  const fileName = path.basename(filePath);
  entries.push({ fileName, bundle });
  requireObject(bundle, filePath);
  requireObject(bundle.entity, `${filePath}.entity`);
  requireArray(bundle.events, `${filePath}.events`);
  requireArray(bundle.evidence, `${filePath}.evidence`);

  const { entity, events, evidence } = bundle;
  requireFields(entity, REQUIRED_ENTITY_FIELDS, `${filePath}.entity`);
  requireId(entity.id, 'hei_ex_', `${filePath}.entity.id`);

  const expectedFileName = `${entity.slug}.json`;
  if (path.basename(filePath) !== expectedFileName) {
    fail(`${filePath}: filename must match entity.slug (${expectedFileName})`);
  }

  if (bundle.entity_correction !== undefined) {
    requireObject(bundle.entity_correction, `${filePath}.entity_correction`);
    requireObject(bundle.entity_correction.expected, `${filePath}.entity_correction.expected`);
    requireObject(bundle.entity_correction.changes, `${filePath}.entity_correction.changes`);
    for (const [field, value] of Object.entries(bundle.entity_correction.changes)) {
      if (stableStringify(entity[field]) !== stableStringify(value)) {
        fail(`${filePath}: bundle.entity.${field} must match entity_correction.changes.${field}`);
      }
    }
  }

  for (const id of [entity.id, ...events.map((event) => event.id), ...evidence.map((source) => source.id)]) {
    if (allIds.has(id)) fail(`${filePath}: duplicate id in record bundles: ${id}`);
    allIds.add(id);
  }

  const eventIds = new Set(events.map((event) => event.id));

  events.forEach((event, index) => {
    const label = `${filePath}.events[${index}]`;
    requireFields(event, REQUIRED_EVENT_FIELDS, label);
    requireId(event.id, 'hei_ev_', `${label}.id`);
    if (event.exchange_id !== entity.id) fail(`${label}: exchange_id must be ${entity.id}`);
    const actualSourceCount = evidence.filter((source) => source.event_id === event.id).length;
    if (event.source_count !== actualSourceCount) {
      fail(`${label}: source_count ${event.source_count} != actual evidence count ${actualSourceCount}`);
    }
  });

  evidence.forEach((source, index) => {
    const label = `${filePath}.evidence[${index}]`;
    requireFields(source, REQUIRED_EVIDENCE_FIELDS, label);
    requireId(source.id, 'hei_src_', `${label}.id`);
    if (source.exchange_id !== entity.id) fail(`${label}: exchange_id must be ${entity.id}`);
    if (source.event_id !== null && !eventIds.has(source.event_id)) {
      fail(`${label}: event_id does not exist in this bundle: ${source.event_id}`);
    }
  });

  checked += 1;
}

const correctedEntities = applyReviewedEntityCorrections(canonicalEntities, entries);
const correctedById = new Map(correctedEntities.map((entity) => [entity.id, entity]));
for (const { fileName, bundle } of entries) {
  if (!bundle.entity_correction) continue;
  const corrected = correctedById.get(bundle.entity.id);
  if (!corrected || stableStringify(corrected) !== stableStringify(bundle.entity)) {
    fail(`${fileName}: correction bundle entity must exactly match the corrected canonical entity`);
  }
}

console.log(`record bundle validation passed: ${checked} bundle(s)`);
