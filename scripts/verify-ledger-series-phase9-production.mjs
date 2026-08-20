import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const origin = 'https://hei.badjoke-lab.com'
const expectedCommit = process.env.HEI_EXPECTED_MAIN_COMMIT
if (!expectedCommit) throw new Error('HEI_EXPECTED_MAIN_COMMIT is required')

function assert(condition, message) {
  if (!condition) throw new Error(`HEI Series production verification failed: ${message}`)
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
}

function normalize(value) {
  if (Array.isArray(value)) return value.map(normalize)
  if (value && typeof value === 'object') {
    const out = {}
    for (const key of Object.keys(value).sort()) {
      if (key === 'generated_at') continue
      out[key] = normalize(value[key])
    }
    return out
  }
  return value
}

function stable(value) {
  return JSON.stringify(normalize(value))
}

async function fetchResponse(url) {
  const joiner = url.includes('?') ? '&' : '?'
  return fetch(`${url}${joiner}verify=${Date.now()}-${Math.random()}`, {
    cache: 'no-store',
    headers: { 'user-agent': 'hei-phase9-series-production-verifier' },
    signal: AbortSignal.timeout(20000),
  })
}

async function fetchJson(url) {
  const response = await fetchResponse(url)
  assert(response.ok, `${url} returned ${response.status}`)
  return response.json()
}

async function waitForExactProductionCommit() {
  let observed = null
  for (let attempt = 1; attempt <= 36; attempt += 1) {
    try {
      const version = await fetchJson(`${origin}/version.json`)
      observed = version.build?.commit ?? null
      if (observed === expectedCommit) return version
    } catch (error) {
      observed = `fetch-error:${error.message}`
    }
    console.log(`Production convergence attempt ${attempt}/36: observed ${observed}`)
    await new Promise((resolve) => setTimeout(resolve, 10000))
  }
  throw new Error(`production did not converge to ${expectedCommit}; last observed ${observed}`)
}

const localVersion = readJson('public/version.json')
assert(localVersion.build?.commit === expectedCommit, `local build commit is ${localVersion.build?.commit}`)

const productionVersion = await waitForExactProductionCommit()
assert(productionVersion.build?.commit === expectedCommit, 'production version commit mismatch after convergence')

const localDescriptor = readJson('public/data/series/registry.json')
const localIndex = readJson('public/data/series/index.json')
const productionDescriptor = await fetchJson(`${origin}/data/series/registry.json`)
const productionIndex = await fetchJson(`${origin}/data/series/index.json`)

assert(stable(productionDescriptor) === stable(localDescriptor), 'registry descriptor semantic mismatch')
assert(stable(productionIndex) === stable(localIndex), 'record index semantic mismatch')
assert(localIndex.record_count === localIndex.records.length, 'local index count mismatch')
assert(productionIndex.record_count === productionIndex.records.length, 'production index count mismatch')

const globalKeys = new Set()
for (const item of productionIndex.records) {
  assert(!globalKeys.has(item.global_record_key), `duplicate global key ${item.global_record_key}`)
  globalKeys.add(item.global_record_key)
}
assert(globalKeys.size === productionIndex.record_count, 'global key uniqueness count mismatch')

let verifiedRecords = 0
const chunkSize = 20
for (let offset = 0; offset < localIndex.records.length; offset += chunkSize) {
  const chunk = localIndex.records.slice(offset, offset + chunkSize)
  await Promise.all(chunk.map(async (item) => {
    const local = readJson(`public/data/series/records/${item.slug}.json`)
    const production = await fetchJson(`${origin}/data/series/records/${item.slug}.json`)
    assert(stable(production) === stable(local), `${item.slug} Series envelope semantic mismatch`)
    verifiedRecords += 1
  }))
  console.log(`Verified Series records: ${verifiedRecords}/${localIndex.record_count}`)
}

const representativeUrls = [
  `${origin}/explore/`,
  `${origin}/compare/`,
  `${origin}/stats/`,
]
const firstRecord = localIndex.records[0]
if (firstRecord?.human_url) representativeUrls.push(firstRecord.human_url)
const zedcex = localIndex.records.find((item) => item.slug === 'zedcex')
if (zedcex?.human_url) representativeUrls.push(zedcex.human_url)

for (const url of [...new Set(representativeUrls)]) {
  const response = await fetchResponse(url)
  assert(response.ok, `representative human route ${url} returned ${response.status}`)
}

console.log(JSON.stringify({
  ok: true,
  expected_main_commit: expectedCommit,
  production_commit: productionVersion.build?.commit,
  series_json_verified: verifiedRecords + 2,
  series_records_verified: verifiedRecords,
  global_keys_unique: globalKeys.size,
  representative_human_routes: [...new Set(representativeUrls)].length,
}, null, 2))
