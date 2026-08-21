import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const publicDir = path.join(root, 'public')
const nativeDir = path.join(publicDir, 'data', 'exchanges')
const seriesDir = path.join(publicDir, 'data', 'series')
const recordsDir = path.join(seriesDir, 'records')
const origin = 'https://hei.badjoke-lab.com'
const seriesSchemaVersion = '1.0.0'
const registryId = 'historical-exchange-index'
const nativeRecordType = 'exchange_entity'
const relationshipAuthorityPath = path.join(root, 'config', 'ledger-series-phase9-stage5-hei-local-authority.json')

function readJson(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`Ledger Series adapter missing required input: ${path.relative(root, filePath)}`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

function globalRecordKey(id) {
  return `${registryId}:${nativeRecordType}:${id}`
}

function parseGlobalKey(globalKey) {
  const parts = String(globalKey).split(':')
  if (parts.length !== 3 || parts.some((part) => !part)) throw new Error(`Ledger Series adapter invalid global key: ${globalKey}`)
  return {
    registry_id: parts[0],
    native_record_type: parts[1],
    native_record_id: parts[2],
  }
}

function relationshipId(relationType, sourceGlobalKey, targetGlobalKey) {
  const digest = createHash('sha256')
    .update(`${relationType}\n${sourceGlobalKey}\n${targetGlobalKey}`, 'utf8')
    .digest('hex')
  return `series_rel_${digest}`
}

const version = readJson(path.join(publicDir, 'version.json'))
const manifest = readJson(path.join(publicDir, 'data', 'manifest.json'))
const nativeIndex = readJson(path.join(nativeDir, 'index.json'))
const relationshipAuthority = readJson(relationshipAuthorityPath)

if (version.project_id !== registryId || manifest.project_id !== registryId || nativeIndex.project_id !== registryId) {
  throw new Error('Ledger Series adapter project identity mismatch')
}
if (nativeIndex.canonical_only !== true || manifest.data_safety?.canonical_only !== true) {
  throw new Error('Ledger Series adapter requires canonical-only native inputs')
}
if (!Array.isArray(nativeIndex.records) || nativeIndex.record_count !== nativeIndex.records.length) {
  throw new Error('Ledger Series adapter native index count mismatch')
}
if (relationshipAuthority.registry_id !== registryId || relationshipAuthority.reviewed_audit?.accepted_count !== 21) {
  throw new Error('Ledger Series adapter unexpected HEI Stage 5 relationship authority')
}
if (!Array.isArray(relationshipAuthority.finite_allowlist) || relationshipAuthority.finite_allowlist.length !== 21) {
  throw new Error('Ledger Series adapter HEI Stage 5 allowlist must contain exactly 21 rows')
}

fs.rmSync(seriesDir, { recursive: true, force: true })
fs.mkdirSync(recordsDir, { recursive: true })

const indexRecords = []
for (const item of [...nativeIndex.records].sort((a, b) => String(a.slug).localeCompare(String(b.slug)))) {
  const nativePath = path.join(nativeDir, `${item.slug}.json`)
  const native = readJson(nativePath)
  const entity = native.entity
  if (!entity || entity.id !== item.id || entity.slug !== item.slug) {
    throw new Error(`Ledger Series adapter native identity mismatch: ${item.slug}`)
  }
  if (native.canonical_only !== true) throw new Error(`Ledger Series adapter noncanonical native record: ${item.slug}`)

  const machineUrl = `${origin}/data/series/records/${item.slug}.json`
  const envelope = {
    series_schema_version: seriesSchemaVersion,
    object_type: 'record_envelope',
    registry_id: registryId,
    global_record_key: globalRecordKey(entity.id),
    record_key: {
      native_record_type: nativeRecordType,
      native_record_id: entity.id,
      slug: entity.slug,
    },
    identity: {
      name: entity.canonical_name,
      aliases: Array.isArray(entity.aliases) ? entity.aliases : [],
    },
    urls: {
      human: native.canonical_page_url,
      machine: machineUrl,
      native_machine: native.record_json_url,
    },
    current_state: {
      status: entity.status ?? null,
      native: {
        bundle: native,
      },
    },
    events: {
      records: native.events ?? [],
    },
    evidence: {
      records: native.evidence ?? [],
    },
    relationships: [],
    verification: {
      build: version.build,
      last_verified_at: native.verification?.last_verified_at ?? null,
      confidence: native.verification?.confidence ?? null,
    },
    provenance: {
      canonical_only: true,
      data_safety: manifest.data_safety,
      native_schema_version: native.schema_version,
      native_data_schema_version: native.data_schema_version,
      native_project_id: native.project_id,
    },
  }

  writeJson(path.join(recordsDir, `${item.slug}.json`), envelope)
  indexRecords.push({
    global_record_key: envelope.global_record_key,
    native_record_type: nativeRecordType,
    native_record_id: entity.id,
    slug: entity.slug,
    name: entity.canonical_name,
    current_state: entity.status ?? null,
    human_url: native.canonical_page_url,
    machine_url: machineUrl,
    native_machine_url: native.record_json_url,
    last_verified_at: native.verification?.last_verified_at ?? null,
  })
}

const availableGlobalKeys = new Set(indexRecords.map((record) => record.global_record_key))
const relationshipTuples = new Set()
const relationshipIds = new Set()
const relationshipRecords = relationshipAuthority.finite_allowlist.map((entry, index) => {
  if (!Array.isArray(entry) || entry.length !== 3) {
    throw new Error(`Ledger Series adapter relationship row ${index + 1} must be [relation_type, source, target]`)
  }
  const [relationType, sourceGlobalKey, targetGlobalKey] = entry
  if (!['predecessor_of', 'successor_of'].includes(relationType)) {
    throw new Error(`Ledger Series adapter relationship row ${index + 1} unauthorized type: ${relationType}`)
  }
  if (sourceGlobalKey === targetGlobalKey) throw new Error(`Ledger Series adapter relationship row ${index + 1} is a self-loop`)
  if (!availableGlobalKeys.has(sourceGlobalKey) || !availableGlobalKeys.has(targetGlobalKey)) {
    throw new Error(`Ledger Series adapter relationship row ${index + 1} references a missing Stage 3 endpoint`)
  }
  const tuple = `${relationType}\n${sourceGlobalKey}\n${targetGlobalKey}`
  if (relationshipTuples.has(tuple)) throw new Error(`Ledger Series adapter duplicate relationship tuple at row ${index + 1}`)
  relationshipTuples.add(tuple)

  const id = relationshipId(relationType, sourceGlobalKey, targetGlobalKey)
  if (relationshipIds.has(id)) throw new Error(`Ledger Series adapter relationship ID collision: ${id}`)
  relationshipIds.add(id)

  return {
    series_schema_version: seriesSchemaVersion,
    object_type: 'relationship_record',
    id,
    relation_type: relationType,
    source: parseGlobalKey(sourceGlobalKey),
    target: parseGlobalKey(targetGlobalKey),
    direction: 'directed',
    provenance: {
      basis: 'native_reviewed_relationship',
      native_evidence_refs: [],
    },
  }
})

const descriptor = {
  series_schema_version: seriesSchemaVersion,
  object_type: 'registry_descriptor',
  registry: {
    id: registryId,
    name: version.site_name,
    type: version.registry_type,
    origin,
    native_machine_schema_version: nativeIndex.schema_version,
    native_data_schema_version: nativeIndex.data_schema_version,
  },
  canonical_only: true,
  record_counts: {
    primary_records: nativeIndex.record_count,
    series_records: nativeIndex.record_count,
    relationships: relationshipRecords.length,
  },
  routes: {
    descriptor: '/data/series/registry.json',
    index: '/data/series/index.json',
    relationships: '/data/series/relationships.json',
    record_template: '/data/series/records/{slug}.json',
    native_record_template: '/data/exchanges/{slug}.json',
    search: '/explore/',
    compare: '/compare/',
    stats: '/stats/',
  },
  capabilities: {
    search: true,
    compare: true,
    stats: true,
    relationships: 'adapter',
  },
  data_safety: {
    ...manifest.data_safety,
    ai_generated_canonical_facts: false,
  },
  verification: {
    build: version.build,
    native_verification_marker: version.build?.verification_marker ?? null,
  },
}

const seriesIndex = {
  series_schema_version: seriesSchemaVersion,
  object_type: 'record_index',
  registry_id: registryId,
  canonical_only: true,
  record_count: indexRecords.length,
  record_counts: {
    exchange_entities: indexRecords.length,
  },
  verification: {
    build: version.build,
  },
  records: indexRecords,
}

writeJson(path.join(seriesDir, 'registry.json'), descriptor)
writeJson(path.join(seriesDir, 'index.json'), seriesIndex)
writeJson(path.join(seriesDir, 'relationships.json'), relationshipRecords)

console.log(`Built HEI Ledger Series Phase 9 adapter: ${indexRecords.length} canonical exchange envelopes, ${relationshipRecords.length} reviewed relationships.`)
