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

const version = readJson(path.join(publicDir, 'version.json'))
const manifest = readJson(path.join(publicDir, 'data', 'manifest.json'))
const nativeIndex = readJson(path.join(nativeDir, 'index.json'))

if (version.project_id !== registryId || manifest.project_id !== registryId || nativeIndex.project_id !== registryId) {
  throw new Error('Ledger Series adapter project identity mismatch')
}
if (nativeIndex.canonical_only !== true || manifest.data_safety?.canonical_only !== true) {
  throw new Error('Ledger Series adapter requires canonical-only native inputs')
}
if (!Array.isArray(nativeIndex.records) || nativeIndex.record_count !== nativeIndex.records.length) {
  throw new Error('Ledger Series adapter native index count mismatch')
}

fs.rmSync(seriesDir, { recursive: true, force: true })
fs.mkdirSync(recordsDir, { recursive: true })

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
  },
  routes: {
    descriptor: '/data/series/registry.json',
    index: '/data/series/index.json',
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
    typed_relationships: false,
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

console.log(`Built HEI Ledger Series Phase 9 adapter: ${indexRecords.length} canonical exchange envelopes.`)
