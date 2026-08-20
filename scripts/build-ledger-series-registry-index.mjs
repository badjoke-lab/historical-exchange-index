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

const source = readJson(sourcePath)
assert(source.schema_version === '1.0.0', 'source schema_version must be 1.0.0')
assert(source.snapshot_type === 'ledger_series_registry_descriptor_lock', 'unexpected source snapshot_type')
assert(source.semantic_owner === 'badjoke-lab-ledger-series', 'unexpected semantic owner')
assert(Array.isArray(source.registries), 'source registries must be an array')
assert(source.registry_count === 8 && source.registries.length === 8, 'source must contain exactly eight registries')

const registries = source.registries
  .map(normalizeEntry)
  .sort((a, b) => String(a.registry.id).localeCompare(String(b.registry.id)))

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
  },
  registry_count: registries.length,
  registries,
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
console.log(`Built Ledger Series registry index: ${registries.length} registry descriptors.`)
