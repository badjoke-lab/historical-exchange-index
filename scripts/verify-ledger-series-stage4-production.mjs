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

async function fetchJson(url) {
  const separator = url.includes('?') ? '&' : '?'
  const response = await fetch(`${url}${separator}hei_stage4_verify=${encodeURIComponent(expectedCommit)}-${Date.now()}`, {
    headers: {
      'user-agent': 'HEI-Ledger-Series-Stage4-Production-Verification/1.0',
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

const version = await waitForExpectedCommit()
const publicIndex = await fetchJson(`${origin}/data/series/registries.json`)

assert(version.build?.commit === expectedCommit, 'version.json exact-main mismatch')
assert(publicIndex.series_schema_version === '1.0.0', 'public index schema')
assert(publicIndex.object_type === 'registry_index', 'public index object type')
assert(publicIndex.semantic_owner === 'badjoke-lab-ledger-series', 'public index semantic owner')
assert(publicIndex.registry_count === 8, `public registry_count=${publicIndex.registry_count}`)
assert(Array.isArray(publicIndex.registries) && publicIndex.registries.length === 8, 'public registries length')

const expectedFromLock = source.registries
  .map((entry) => normalizeDescriptor(entry.snapshot, entry.descriptor_url))
  .sort((a, b) => String(a.registry.id).localeCompare(String(b.registry.id)))
const publicSorted = [...publicIndex.registries]
  .sort((a, b) => String(a.registry.id).localeCompare(String(b.registry.id)))
assert(stable(publicSorted) === stable(expectedFromLock), 'public index differs from reviewed source lock projection')

const liveResults = []
for (const entry of source.registries) {
  const live = await fetchJson(entry.descriptor_url)
  const normalized = normalizeDescriptor(live, entry.descriptor_url)
  const published = publicIndex.registries.find((item) => item.registry?.id === live.registry?.id)
  assert(published, `public index missing live registry ${live.registry?.id ?? entry.descriptor_url}`)
  assert(stable(published) === stable(normalized), `live descriptor drift for ${live.registry?.id}`)
  liveResults.push({
    registry_id: live.registry.id,
    origin: live.registry.origin,
    primary_records: live.record_counts.primary_records,
    result: 'PASS',
  })
}

const report = {
  result: 'PASS',
  expected_commit: expectedCommit,
  deployed_commit: version.build.commit,
  verified_at: new Date().toISOString(),
  host_origin: origin,
  registry_count: publicIndex.registry_count,
  reviewed_snapshot_collected_at: source.collected_at,
  reviewed_snapshot_collector_run: source.collector_run,
  public_index_vs_lock: 'PASS',
  live_descriptor_sync: 'PASS',
  registries: liveResults,
}

console.log(JSON.stringify(report, null, 2))
