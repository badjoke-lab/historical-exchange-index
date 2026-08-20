import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const origin = 'https://hei.badjoke-lab.com'
const registryId = 'historical-exchange-index'
const nativeRecordType = 'exchange_entity'

function assert(condition, message) {
  if (!condition) throw new Error(`HEI Ledger Series adapter validation failed: ${message}`)
}

function readJson(relativePath) {
  const filePath = path.join(root, relativePath)
  assert(fs.existsSync(filePath), `missing ${relativePath}`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`
  }
  return JSON.stringify(value)
}

const version = readJson('public/version.json')
const manifest = readJson('public/data/manifest.json')
const nativeIndex = readJson('public/data/exchanges/index.json')
const descriptor = readJson('public/data/series/registry.json')
const seriesIndex = readJson('public/data/series/index.json')

assert(descriptor.series_schema_version === '1.0.0', 'descriptor schema version')
assert(descriptor.object_type === 'registry_descriptor', 'descriptor object type')
assert(descriptor.registry?.id === registryId, 'descriptor registry id')
assert(descriptor.registry?.origin === origin, 'descriptor origin')
assert(descriptor.canonical_only === true, 'descriptor canonical_only')
assert(descriptor.record_counts?.primary_records === nativeIndex.record_count, 'descriptor primary count')
assert(descriptor.record_counts?.series_records === nativeIndex.record_count, 'descriptor series count')
assert(descriptor.routes?.native_record_template === '/data/exchanges/{slug}.json', 'native record template')
assert(descriptor.routes?.search === '/explore/', 'search route')
assert(descriptor.routes?.compare === '/compare/', 'compare route')
assert(descriptor.routes?.stats === '/stats/', 'stats route')
assert(descriptor.capabilities?.typed_relationships === false, 'typed relationships must remain disabled')
assert(stable(descriptor.verification?.build) === stable(version.build), 'descriptor build metadata mismatch')
assert(stable(descriptor.data_safety) === stable({ ...manifest.data_safety, ai_generated_canonical_facts: false }), 'descriptor data safety mismatch')

assert(seriesIndex.series_schema_version === '1.0.0', 'index schema version')
assert(seriesIndex.object_type === 'record_index', 'index object type')
assert(seriesIndex.registry_id === registryId, 'index registry id')
assert(seriesIndex.canonical_only === true, 'index canonical_only')
assert(seriesIndex.record_count === nativeIndex.record_count, 'index count')
assert(seriesIndex.records.length === nativeIndex.records.length, 'index records length')
assert(stable(seriesIndex.verification?.build) === stable(version.build), 'index build metadata mismatch')

const nativeBySlug = new Map(nativeIndex.records.map((item) => [item.slug, item]))
const globalKeys = new Set()

for (const item of seriesIndex.records) {
  const nativeIndexItem = nativeBySlug.get(item.slug)
  assert(nativeIndexItem, `series index slug missing from native index: ${item.slug}`)
  assert(item.native_record_type === nativeRecordType, `${item.slug} native record type`)
  assert(item.native_record_id === nativeIndexItem.id, `${item.slug} native id`)
  assert(item.human_url === nativeIndexItem.canonical_page_url, `${item.slug} human url`)
  assert(item.native_machine_url === nativeIndexItem.record_json_url, `${item.slug} native machine url`)
  assert(item.machine_url === `${origin}/data/series/records/${item.slug}.json`, `${item.slug} series machine url`)
  assert(!globalKeys.has(item.global_record_key), `${item.slug} duplicate global key`)
  globalKeys.add(item.global_record_key)

  const native = readJson(`public/data/exchanges/${item.slug}.json`)
  const envelope = readJson(`public/data/series/records/${item.slug}.json`)
  const expectedKey = `${registryId}:${nativeRecordType}:${native.entity.id}`

  assert(envelope.series_schema_version === '1.0.0', `${item.slug} envelope schema version`)
  assert(envelope.object_type === 'record_envelope', `${item.slug} envelope object type`)
  assert(envelope.registry_id === registryId, `${item.slug} registry id`)
  assert(envelope.global_record_key === expectedKey, `${item.slug} global key`)
  assert(envelope.record_key?.native_record_type === nativeRecordType, `${item.slug} record type`)
  assert(envelope.record_key?.native_record_id === native.entity.id, `${item.slug} record id`)
  assert(envelope.record_key?.slug === native.entity.slug, `${item.slug} record slug`)
  assert(envelope.urls?.human === native.canonical_page_url, `${item.slug} human url mismatch`)
  assert(envelope.urls?.native_machine === native.record_json_url, `${item.slug} native machine mismatch`)
  assert(envelope.urls?.machine === `${origin}/data/series/records/${item.slug}.json`, `${item.slug} machine url mismatch`)
  assert(envelope.current_state?.status === (native.entity.status ?? null), `${item.slug} current status`)
  assert(stable(envelope.current_state?.native?.bundle) === stable(native), `${item.slug} native bundle not lossless`)
  assert(stable(envelope.events?.records) === stable(native.events ?? []), `${item.slug} events mismatch`)
  assert(stable(envelope.evidence?.records) === stable(native.evidence ?? []), `${item.slug} evidence mismatch`)
  assert(Array.isArray(envelope.relationships) && envelope.relationships.length === 0, `${item.slug} typed relationships must be empty`)
  assert(stable(envelope.verification?.build) === stable(version.build), `${item.slug} build metadata mismatch`)
  assert(envelope.verification?.last_verified_at === (native.verification?.last_verified_at ?? null), `${item.slug} last verified mismatch`)
  assert(envelope.verification?.confidence === (native.verification?.confidence ?? null), `${item.slug} confidence mismatch`)
  assert(envelope.provenance?.canonical_only === true, `${item.slug} provenance canonical_only`)
  assert(stable(envelope.provenance?.data_safety) === stable(manifest.data_safety), `${item.slug} provenance data safety`)
  assert(envelope.provenance?.native_schema_version === native.schema_version, `${item.slug} native schema version`)
  assert(envelope.provenance?.native_data_schema_version === native.data_schema_version, `${item.slug} native data schema version`)
  assert(envelope.provenance?.native_project_id === native.project_id, `${item.slug} native project id`)

  const serialized = JSON.stringify(envelope)
  for (const forbidden of ['candidate_class', 'data-staging', 'internal monitoring', 'private research note']) {
    assert(!serialized.includes(forbidden), `${item.slug} contains forbidden marker ${forbidden}`)
  }
}

const seriesFiles = fs.readdirSync(path.join(root, 'public', 'data', 'series', 'records')).filter((name) => name.endsWith('.json'))
assert(seriesFiles.length === nativeIndex.record_count, 'stale or missing Series record files')
assert(globalKeys.size === nativeIndex.record_count, 'global key uniqueness count mismatch')

console.log(`HEI Ledger Series Phase 9 adapter validation passed: ${nativeIndex.record_count} canonical exchange envelopes.`)
console.log(`Build commit: ${version.build?.commit ?? 'unknown'}`)
