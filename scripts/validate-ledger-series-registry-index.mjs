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

function normalizeDescriptor(descriptorUrl, snapshot) {
  return {
    descriptor_url: descriptorUrl,
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

function assertDescriptor(descriptorUrl, snapshot, label) {
  assert(typeof descriptorUrl === 'string' && descriptorUrl.startsWith('https://'), `${label} descriptor URL must use HTTPS`)
  assert(descriptorUrl.endsWith('/data/series/registry.json'), `${label} descriptor URL path`)
  assert(snapshot?.series_schema_version === '1.0.0', `${label} Series schema`)
  assert(snapshot?.object_type === 'registry_descriptor', `${label} object_type`)
  assert(snapshot?.canonical_only === true, `${label} canonical_only`)
  assert(snapshot?.data_safety?.canonical_only === true, `${label} data safety canonical_only`)
  assert(typeof snapshot?.registry?.id === 'string' && snapshot.registry.id, `${label} registry id`)
  assert(typeof snapshot?.registry?.origin === 'string' && snapshot.registry.origin.startsWith('https://'), `${label} origin`)
  assert(descriptorUrl === `${snapshot.registry.origin}/data/series/registry.json`, `${label} descriptor/origin mismatch`)
  assert(Number.isInteger(snapshot?.record_counts?.primary_records) && snapshot.record_counts.primary_records >= 0, `${label} primary record count`)
  assert(snapshot.routes?.descriptor === '/data/series/registry.json', `${label} descriptor route`)
  assert(snapshot.routes?.index === '/data/series/index.json', `${label} index route`)
  assert(snapshot.capabilities && typeof snapshot.capabilities === 'object', `${label} capabilities`)
  assert(snapshot.verification && typeof snapshot.verification === 'object', `${label} verification`)
  assertNoCanonicalPayloads(snapshot)
}

const source = readJson('scripts/lib/ledger-series-registry-index-source.json')
const localDescriptor = readJson('public/data/series/registry.json')
const output = readJson('public/data/series/registries.json')

assert(source.schema_version === '1.1.0', 'source schema version')
assert(source.snapshot_type === 'ledger_series_registry_descriptor_lock', 'source snapshot type')
assert(source.semantic_owner === 'badjoke-lab-ledger-series', 'source semantic owner')
assert(source.registry_count === 8, 'source registry_count')
assert(source.remote_registry_count === 7, 'source remote_registry_count')
assert(Array.isArray(source.registries) && source.registries.length === 7, 'source remote registries length')
assert(source.local_host?.registry_id === 'historical-exchange-index', 'local host registry id')
assert(source.local_host?.descriptor_url === 'https://hei.badjoke-lab.com/data/series/registry.json', 'local host descriptor URL')
assert(source.local_host?.source === 'local_build_descriptor', 'local host source mode')
assert(source.local_host?.generated_input === 'public/data/series/registry.json', 'local host generated input')

assertDescriptor(source.local_host.descriptor_url, localDescriptor, 'local HEI descriptor')
assert(localDescriptor.registry.id === source.local_host.registry_id, 'local descriptor id must match local host')

const ids = new Set([localDescriptor.registry.id])
const origins = new Set([localDescriptor.registry.origin])
const descriptorUrls = new Set([source.local_host.descriptor_url])

for (const entry of source.registries) {
  assert(entry && typeof entry === 'object', 'invalid remote source entry')
  const snapshot = entry.snapshot
  assertDescriptor(entry.descriptor_url, snapshot, `remote ${snapshot?.registry?.id || entry.descriptor_url}`)
  assert(snapshot.registry.id !== source.local_host.registry_id, 'remote lock must not contain local HEI snapshot')
  assert(!ids.has(snapshot.registry.id), `duplicate registry id ${snapshot.registry.id}`)
  assert(!origins.has(snapshot.registry.origin), `duplicate origin ${snapshot.registry.origin}`)
  assert(!descriptorUrls.has(entry.descriptor_url), `duplicate descriptor URL ${entry.descriptor_url}`)
  ids.add(snapshot.registry.id)
  origins.add(snapshot.registry.origin)
  descriptorUrls.add(entry.descriptor_url)
}

assert(ids.size === 8, 'combined registry ids must be unique across eight registries')
assert(origins.size === 8, 'combined origins must be unique across eight registries')
assert(descriptorUrls.size === 8, 'combined descriptor URLs must be unique across eight registries')

assert(output.series_schema_version === '1.0.0', 'output schema version')
assert(output.object_type === 'registry_index', 'output object type')
assert(output.semantic_owner === 'badjoke-lab-ledger-series', 'output semantic owner')
assert(output.publication?.host_repository === 'badjoke-lab/historical-exchange-index', 'host repository')
assert(output.publication?.host_origin === 'https://hei.badjoke-lab.com', 'host origin')
assert(output.publication?.host_is_semantic_owner === false, 'host must not be semantic owner')
assert(output.publication?.portable_to_future_dedicated_repository === true, 'portable flag')
assert(output.snapshot?.collected_at === source.collected_at, 'remote snapshot collected_at')
assert(output.snapshot?.collector_run === source.collector_run, 'remote snapshot collector run')
assert(output.snapshot?.local_host_registry_id === source.local_host.registry_id, 'output local host id')
assert(output.snapshot?.local_host_source === source.local_host.source, 'output local host source mode')
assert(output.registry_count === 8, 'output registry count')
assert(Array.isArray(output.registries) && output.registries.length === 8, 'output registries length')

const expected = [
  normalizeDescriptor(source.local_host.descriptor_url, localDescriptor),
  ...source.registries.map((entry) => normalizeDescriptor(entry.descriptor_url, entry.snapshot)),
].sort((a, b) => String(a.registry.id).localeCompare(String(b.registry.id)))

assert(stable(output.registries) === stable(expected), 'public index is not a deterministic projection of local HEI descriptor plus reviewed remote lock')

const outputHei = output.registries.find((entry) => entry.registry?.id === source.local_host.registry_id)
assert(outputHei, 'missing public HEI row')
assert(stable(outputHei) === stable(normalizeDescriptor(source.local_host.descriptor_url, localDescriptor)), 'public HEI row must equal same-build local descriptor projection')

for (const remote of source.registries) {
  const actual = output.registries.find((entry) => entry.registry?.id === remote.snapshot.registry.id)
  assert(actual, `missing public remote row ${remote.snapshot.registry.id}`)
  assert(stable(actual) === stable(normalizeDescriptor(remote.descriptor_url, remote.snapshot)), `public remote row drift ${remote.snapshot.registry.id}`)
}

assertNoCanonicalPayloads(output)

const serialized = JSON.stringify(output)
for (const forbidden of ['data-staging', 'internal monitoring', 'private research note', 'candidate_class']) {
  assert(!serialized.includes(forbidden), `forbidden marker ${forbidden}`)
}

console.log(`Ledger Series registry index validation passed: 8 unique registry descriptors (7 reviewed remote + 1 same-build local HEI).`)
