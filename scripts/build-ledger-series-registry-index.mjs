import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const sourcePath = path.join(root, 'scripts', 'lib', 'ledger-series-registry-index-source.json')
const outputPath = path.join(root, 'public', 'data', 'series', 'registries.json')

function readJson(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`Ledger Series registry index missing source: ${path.relative(root, filePath)}`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function assert(condition, message) {
  if (!condition) throw new Error(`Ledger Series registry index build failed: ${message}`)
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

const source = readJson(sourcePath)
assert(source.schema_version === '1.1.0', 'source schema_version must be 1.1.0')
assert(source.snapshot_type === 'ledger_series_registry_descriptor_lock', 'unexpected source snapshot_type')
assert(source.semantic_owner === 'badjoke-lab-ledger-series', 'unexpected semantic owner')
assert(source.registry_count === 8, 'source registry_count must be eight')
assert(source.remote_registry_count === 7, 'source remote_registry_count must be seven')
assert(Array.isArray(source.registries) && source.registries.length === 7, 'source must contain exactly seven remote registries')
assert(source.local_host?.registry_id === 'historical-exchange-index', 'unexpected local host registry id')
assert(source.local_host?.source === 'local_build_descriptor', 'unexpected local host source mode')
assert(source.local_host?.descriptor_url === 'https://hei.badjoke-lab.com/data/series/registry.json', 'unexpected local host descriptor URL')
assert(typeof source.local_host?.generated_input === 'string' && source.local_host.generated_input, 'missing local host generated input')

const localDescriptorPath = path.join(root, source.local_host.generated_input)
const localDescriptor = readJson(localDescriptorPath)
assert(localDescriptor.series_schema_version === '1.0.0', 'local HEI Series schema mismatch')
assert(localDescriptor.object_type === 'registry_descriptor', 'local HEI object_type mismatch')
assert(localDescriptor.registry?.id === source.local_host.registry_id, 'local HEI registry id mismatch')
assert(localDescriptor.registry?.origin === 'https://hei.badjoke-lab.com', 'local HEI origin mismatch')
assert(localDescriptor.canonical_only === true, 'local HEI descriptor must be canonical-only')
assert(localDescriptor.data_safety?.canonical_only === true, 'local HEI data safety must be canonical-only')

const remoteIds = new Set()
for (const entry of source.registries) {
  assert(entry?.snapshot?.registry?.id, 'remote source entry missing registry id')
  assert(entry.snapshot.registry.id !== source.local_host.registry_id, 'remote lock must not contain local HEI snapshot')
  assert(!remoteIds.has(entry.snapshot.registry.id), `duplicate remote registry id ${entry.snapshot.registry.id}`)
  remoteIds.add(entry.snapshot.registry.id)
}

const registries = [
  normalizeDescriptor(source.local_host.descriptor_url, localDescriptor),
  ...source.registries.map((entry) => normalizeDescriptor(entry.descriptor_url, entry.snapshot)),
].sort((a, b) => String(a.registry.id).localeCompare(String(b.registry.id)))

assert(registries.length === 8, 'combined registry index must contain eight registries')

const output = {
  series_schema_version: '1.0.0',
  object_type: 'registry_index',
  semantic_owner: 'badjoke-lab-ledger-series',
  publication: {
    host_repository: 'badjoke-lab/historical-exchange-index',
    host_origin: 'https://hei.badjoke-lab.com',
    host_is_semantic_owner: false,
    portable_to_future_dedicated_repository: true,
  },
  snapshot: {
    collected_at: source.collected_at,
    collector_run: source.collector_run,
    local_host_registry_id: source.local_host.registry_id,
    local_host_source: source.local_host.source,
  },
  registry_count: registries.length,
  registries,
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
console.log(`Built Ledger Series registry index: ${registries.length} registry descriptors (${source.remote_registry_count} reviewed remote + 1 local host).`)
