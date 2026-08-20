import fs from 'node:fs'

const origin = process.env.HEI_PRODUCTION_ORIGIN || 'https://hei.badjoke-lab.com'
const expectedCommit = process.env.HEI_EXPECTED_PRODUCTION_COMMIT
if (!expectedCommit) throw new Error('HEI_EXPECTED_PRODUCTION_COMMIT is required')

const source = JSON.parse(fs.readFileSync('scripts/lib/ledger-series-registry-index-source.json', 'utf8'))
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function assert(condition, message) {
  if (!condition) throw new Error(`Ledger Series Stage 4 production verification failed: ${message}`)
}

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`
  }
  return JSON.stringify(value)
}

function normalizeDescriptor(snapshot, descriptorUrl) {
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

function assertDescriptor(raw, descriptorUrl, label) {
  assert(raw?.series_schema_version === '1.0.0', `${label} Series schema`)
  assert(raw?.object_type === 'registry_descriptor', `${label} object_type`)
  assert(raw?.canonical_only === true, `${label} canonical_only`)
  assert(raw?.data_safety?.canonical_only === true, `${label} data safety canonical_only`)
  assert(typeof raw?.registry?.id === 'string' && raw.registry.id, `${label} registry id`)
  assert(typeof raw?.registry?.origin === 'string' && raw.registry.origin.startsWith('https://'), `${label} origin`)
  assert(descriptorUrl === `${raw.registry.origin}/data/series/registry.json`, `${label} descriptor/origin mismatch`)
  assert(Number.isInteger(raw?.record_counts?.primary_records) && raw.record_counts.primary_records >= 0, `${label} primary count`)
}

async function fetchJson(url) {
  const separator = url.includes('?') ? '&' : '?'
  const response = await fetch(`${url}${separator}hei_stage4_verify=${encodeURIComponent(expectedCommit)}-${Date.now()}`, {
    headers: {
      'user-agent': 'HEI-Ledger-Series-Stage4-Production-Verification/1.1',
      'cache-control': 'no-cache',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(20_000),
  })
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`)
  return response.json()
}

async function waitForExpectedCommit() {
  let lastCommit = null
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    const version = await fetchJson(`${origin}/version.json`)
    lastCommit = version.build?.commit ?? null
    console.log(`commit propagation attempt ${attempt}: ${lastCommit}`)
    if (lastCommit === expectedCommit) return version
    await sleep(10_000)
  }
  throw new Error(`production commit mismatch after polling: expected ${expectedCommit}, got ${lastCommit}`)
}

assert(source.schema_version === '1.1.0', `source schema_version=${source.schema_version}`)
assert(source.snapshot_type === 'ledger_series_registry_descriptor_lock', 'source snapshot type')
assert(source.semantic_owner === 'badjoke-lab-ledger-series', 'source semantic owner')
assert(source.registry_count === 8, `source registry_count=${source.registry_count}`)
assert(source.remote_registry_count === 7, `source remote_registry_count=${source.remote_registry_count}`)
assert(Array.isArray(source.registries) && source.registries.length === 7, 'source must contain seven remote registries')
assert(source.local_host?.registry_id === 'historical-exchange-index', 'local host registry id')
assert(source.local_host?.descriptor_url === `${origin}/data/series/registry.json`, 'local host descriptor URL')
assert(source.local_host?.source === 'local_build_descriptor', 'local host source mode')

const version = await waitForExpectedCommit()
const publicIndex = await fetchJson(`${origin}/data/series/registries.json`)
const liveHost = await fetchJson(source.local_host.descriptor_url)

assert(version.build?.commit === expectedCommit, 'version.json exact-main mismatch')
assertDescriptor(liveHost, source.local_host.descriptor_url, 'live HEI descriptor')
assert(liveHost.registry.id === source.local_host.registry_id, 'live HEI descriptor id mismatch')
assert(liveHost.verification?.build?.commit === expectedCommit, `live HEI descriptor build mismatch: ${liveHost.verification?.build?.commit}`)

assert(publicIndex.series_schema_version === '1.0.0', 'public index schema')
assert(publicIndex.object_type === 'registry_index', 'public index object type')
assert(publicIndex.semantic_owner === 'badjoke-lab-ledger-series', 'public index semantic owner')
assert(publicIndex.publication?.host_repository === 'badjoke-lab/historical-exchange-index', 'public host repository')
assert(publicIndex.publication?.host_origin === origin, 'public host origin')
assert(publicIndex.publication?.host_is_semantic_owner === false, 'HEI must not be semantic owner')
assert(publicIndex.registry_count === 8, `public registry_count=${publicIndex.registry_count}`)
assert(Array.isArray(publicIndex.registries) && publicIndex.registries.length === 8, 'public registries length')
assert(publicIndex.snapshot?.collected_at === source.collected_at, 'public remote snapshot collected_at mismatch')
assert(publicIndex.snapshot?.collector_run === source.collector_run, 'public remote snapshot collector_run mismatch')
assert(publicIndex.snapshot?.local_host_registry_id === source.local_host.registry_id, 'public local host id mismatch')
assert(publicIndex.snapshot?.local_host_source === source.local_host.source, 'public local host mode mismatch')

const expectedFromReviewedInputs = [
  normalizeDescriptor(liveHost, source.local_host.descriptor_url),
  ...source.registries.map((entry) => normalizeDescriptor(entry.snapshot, entry.descriptor_url)),
].sort((a, b) => String(a.registry.id).localeCompare(String(b.registry.id)))
const publicSorted = [...publicIndex.registries]
  .sort((a, b) => String(a.registry.id).localeCompare(String(b.registry.id)))
assert(stable(publicSorted) === stable(expectedFromReviewedInputs), 'public index differs from same-build HEI descriptor plus reviewed seven-registry lock')

const liveResults = []
const publishedHost = publicIndex.registries.find((item) => item.registry?.id === liveHost.registry.id)
assert(publishedHost, 'public index missing live HEI registry')
assert(stable(publishedHost) === stable(normalizeDescriptor(liveHost, source.local_host.descriptor_url)), 'public HEI row differs from live same-build HEI descriptor')
liveResults.push({
  registry_id: liveHost.registry.id,
  origin: liveHost.registry.origin,
  primary_records: liveHost.record_counts.primary_records,
  source_mode: 'same_build_live_host',
  result: 'PASS',
})

for (const entry of source.registries) {
  const live = await fetchJson(entry.descriptor_url)
  assertDescriptor(live, entry.descriptor_url, `live ${entry.snapshot?.registry?.id || entry.descriptor_url}`)
  const normalizedLive = normalizeDescriptor(live, entry.descriptor_url)
  const normalizedLock = normalizeDescriptor(entry.snapshot, entry.descriptor_url)
  const published = publicIndex.registries.find((item) => item.registry?.id === live.registry?.id)
  assert(published, `public index missing live registry ${live.registry?.id ?? entry.descriptor_url}`)
  assert(stable(normalizedLive) === stable(normalizedLock), `reviewed remote descriptor lock drift for ${live.registry?.id}`)
  assert(stable(published) === stable(normalizedLive), `public/live descriptor drift for ${live.registry?.id}`)
  liveResults.push({
    registry_id: live.registry.id,
    origin: live.registry.origin,
    primary_records: live.record_counts.primary_records,
    source_mode: 'reviewed_remote_lock',
    result: 'PASS',
  })
}

assert(new Set(liveResults.map((item) => item.registry_id)).size === 8, 'live registry ids must be unique')
assert(new Set(liveResults.map((item) => item.origin)).size === 8, 'live registry origins must be unique')

const report = {
  result: 'PASS',
  expected_commit: expectedCommit,
  deployed_commit: version.build.commit,
  verified_at: new Date().toISOString(),
  host_origin: origin,
  registry_count: publicIndex.registry_count,
  reviewed_remote_snapshot_collected_at: source.collected_at,
  reviewed_remote_snapshot_collector_run: source.collector_run,
  reviewed_remote_registry_count: source.remote_registry_count,
  local_host_registry_id: source.local_host.registry_id,
  local_host_same_build_sync: 'PASS',
  public_index_vs_reviewed_inputs: 'PASS',
  live_descriptor_sync: 'PASS',
  registries: liveResults,
}

console.log(JSON.stringify(report, null, 2))
