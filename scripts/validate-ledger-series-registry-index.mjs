import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

function assert(condition, message) {
  if (!condition) throw new Error(`Ledger Series registry index validation failed: ${message}`)
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

function normalizeEntry(entry) {
  const snapshot = entry.snapshot
  return {
    descriptor_url: entry.descriptor_url,
    series_schema_version: snapshot.series_schema_version,
    canonical_only: snapshot.canonical_only,
    registry: snapshot.registry,
    ...(snapshot.native_contract ? { native_contract: snapshot.native_contract } : {}),
    record_counts: snapshot.record_counts,
    ...(snapshot.record_types ? { record_types: snapshot.record_types } : {}),
    routes: snapshot.routes,
    capabilities: snapshot.capabilities,
    verification: snapshot.verification,
    data_safety: snapshot.data_safety,
  }
}

function assertNoCanonicalPayloads(value, pathParts = []) {
  if (Array.isArray(value)) {
    const key = pathParts.at(-1)
    if (['records', 'events', 'evidence', 'entities', 'marketplaces', 'stablecoins', 'bridges', 'incidents', 'products'].includes(key)) {
      throw new Error(`Ledger Series registry index validation failed: canonical payload array forbidden at ${pathParts.join('.')}`)
    }
    value.forEach((item, index) => assertNoCanonicalPayloads(item, [...pathParts, String(index)]))
    return
  }
  if (!value || typeof value !== 'object') return
  for (const [key, child] of Object.entries(value)) {
    if (['record', 'entity', 'canonical_record', 'supporting_records'].includes(key) && child && typeof child === 'object') {
      throw new Error(`Ledger Series registry index validation failed: canonical payload object forbidden at ${[...pathParts, key].join('.')}`)
    }
    assertNoCanonicalPayloads(child, [...pathParts, key])
  }
}

const source = readJson('scripts/lib/ledger-series-registry-index-source.json')
const output = readJson('public/data/series/registries.json')

assert(source.schema_version === '1.0.0', 'source schema version')
assert(source.snapshot_type === 'ledger_series_registry_descriptor_lock', 'source snapshot type')
assert(source.semantic_owner === 'badjoke-lab-ledger-series', 'source semantic owner')
assert(source.registry_count === 8, 'source registry_count')
assert(Array.isArray(source.registries) && source.registries.length === 8, 'source registries length')

const ids = new Set()
const origins = new Set()
const descriptorUrls = new Set()

for (const entry of source.registries) {
  assert(entry && typeof entry === 'object', 'invalid source entry')
  assert(typeof entry.descriptor_url === 'string' && entry.descriptor_url.startsWith('https://'), 'descriptor URL must use HTTPS')
  assert(entry.descriptor_url.endsWith('/data/series/registry.json'), `descriptor URL path: ${entry.descriptor_url}`)
  const snapshot = entry.snapshot
  assert(snapshot?.series_schema_version === '1.0.0', `${entry.descriptor_url} Series schema`)
  assert(snapshot?.object_type === 'registry_descriptor', `${entry.descriptor_url} object_type`)
  assert(snapshot?.canonical_only === true, `${entry.descriptor_url} canonical_only`)
  assert(snapshot?.data_safety?.canonical_only === true, `${entry.descriptor_url} data safety canonical_only`)
  assert(typeof snapshot?.registry?.id === 'string' && snapshot.registry.id, `${entry.descriptor_url} registry id`)
  assert(typeof snapshot?.registry?.origin === 'string' && snapshot.registry.origin.startsWith('https://'), `${entry.descriptor_url} origin`)
  assert(entry.descriptor_url === `${snapshot.registry.origin}/data/series/registry.json`, `${snapshot.registry.id} descriptor/origin mismatch`)
  assert(Number.isInteger(snapshot?.record_counts?.primary_records) && snapshot.record_counts.primary_records >= 0, `${snapshot.registry.id} primary record count`)
  assert(snapshot.routes?.descriptor === '/data/series/registry.json', `${snapshot.registry.id} descriptor route`)
  assert(snapshot.routes?.index === '/data/series/index.json', `${snapshot.registry.id} index route`)
  assert(snapshot.capabilities && typeof snapshot.capabilities === 'object', `${snapshot.registry.id} capabilities`)
  assert(snapshot.verification && typeof snapshot.verification === 'object', `${snapshot.registry.id} verification`)
  assert(!ids.has(snapshot.registry.id), `duplicate registry id ${snapshot.registry.id}`)
  assert(!origins.has(snapshot.registry.origin), `duplicate origin ${snapshot.registry.origin}`)
  assert(!descriptorUrls.has(entry.descriptor_url), `duplicate descriptor URL ${entry.descriptor_url}`)
  ids.add(snapshot.registry.id)
  origins.add(snapshot.registry.origin)
  descriptorUrls.add(entry.descriptor_url)
  assertNoCanonicalPayloads(snapshot)
}

assert(output.series_schema_version === '1.0.0', 'output schema version')
assert(output.object_type === 'registry_index', 'output object type')
assert(output.semantic_owner === 'badjoke-lab-ledger-series', 'output semantic owner')
assert(output.publication?.host_repository === 'badjoke-lab/historical-exchange-index', 'host repository')
assert(output.publication?.host_origin === 'https://hei.badjoke-lab.com', 'host origin')
assert(output.publication?.host_is_semantic_owner === false, 'host must not be semantic owner')
assert(output.publication?.portable_to_future_dedicated_repository === true, 'portable flag')
assert(output.snapshot?.collected_at === source.collected_at, 'snapshot collected_at')
assert(output.snapshot?.collector_run === source.collector_run, 'snapshot collector run')
assert(output.registry_count === 8, 'output registry count')
assert(Array.isArray(output.registries) && output.registries.length === 8, 'output registries length')

const expected = source.registries
  .map(normalizeEntry)
  .sort((a, b) => String(a.registry.id).localeCompare(String(b.registry.id)))
assert(stable(output.registries) === stable(expected), 'public index is not a deterministic projection of the reviewed source lock')
assertNoCanonicalPayloads(output)

const serialized = JSON.stringify(output)
for (const forbidden of ['data-staging', 'internal monitoring', 'private research note', 'candidate_class']) {
  assert(!serialized.includes(forbidden), `forbidden marker ${forbidden}`)
}

console.log(`Ledger Series registry index validation passed: ${output.registry_count} unique registry descriptors.`)
