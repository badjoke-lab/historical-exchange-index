const origin = process.env.HEI_PRODUCTION_ORIGIN || 'https://hei.badjoke-lab.com'
const expectedCommit = process.env.HEI_EXPECTED_PRODUCTION_COMMIT

if (!expectedCommit) {
  throw new Error('HEI_EXPECTED_PRODUCTION_COMMIT is required')
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchText(pathname) {
  const response = await fetch(`${origin}${pathname}`, {
    headers: { 'user-agent': 'HEI-Compare-Production-Verification/1.0' },
    redirect: 'follow',
  })
  if (!response.ok) throw new Error(`${pathname} returned HTTP ${response.status}`)
  return response.text()
}

async function fetchJson(pathname) {
  return JSON.parse(await fetchText(pathname))
}

async function waitForExpectedCommit() {
  let lastCommit = null
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    const version = await fetchJson('/version.json')
    lastCommit = version.build?.commit ?? null
    console.log(`commit propagation attempt ${attempt}: ${lastCommit}`)
    if (lastCommit === expectedCommit) return version
    await sleep(10_000)
  }
  throw new Error(`production commit mismatch after polling: expected ${expectedCommit}, got ${lastCommit}`)
}

function assert(condition, message) {
  if (!condition) throw new Error(`Compare production verification failed: ${message}`)
}

const version = await waitForExpectedCommit()
const manifest = await fetchJson('/data/manifest.json')
const entitiesFile = await fetchJson('/data/entities.json')
const sitemap = await fetchText('/sitemap.xml')
const llms = await fetchText('/llms.txt')
const ai = await fetchText('/ai.txt')
const compareBase = await fetchText('/compare/')
const explorer = await fetchText('/explore/')

const records = entitiesFile.records ?? []
assert(records.length >= 4, 'public reviewed entity dataset has fewer than four records')
const sample = records.slice(0, 4)
const slugs = sample.map((record) => record.slug)
const names = sample.map((record) => record.canonical_name)

const query2 = `/compare/?exchange=${encodeURIComponent(slugs[0])}&exchange=${encodeURIComponent(slugs[1])}`
const query4 = `/compare/?${slugs.map((slug) => `exchange=${encodeURIComponent(slug)}`).join('&')}`
const compare2 = await fetchText(query2)
const compare4 = await fetchText(query4)
const dossier = await fetchText(`/exchange/${encodeURIComponent(slugs[0])}/`)

assert(version.build?.commit === expectedCommit, 'version commit does not match expected H-5 merge commit')
assert(version.routes?.compare === '/compare/', 'version route map does not expose Compare')
assert(manifest.main_routes?.includes('/compare/'), 'manifest main_routes does not expose Compare')
assert(llms.includes('/compare/'), 'llms.txt does not expose Compare')
assert(ai.includes('/compare/'), 'ai.txt does not expose Compare')

assert(compareBase.includes('Compare'), 'Compare base route does not contain Compare surface marker')
assert(compare2.includes('Compare'), 'representative 2-entity Compare query does not return Compare surface')
assert(compare4.includes('Compare'), 'representative 4-entity Compare query does not return Compare surface')

const compareBaseUrl = `${origin}/compare/`
const compareLocMatches = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
  .map((match) => match[1])
  .filter((url) => url === compareBaseUrl)
assert(compareLocMatches.length === 1, `sitemap Compare base count is ${compareLocMatches.length}, expected 1`)
assert(!sitemap.includes('/compare/?'), 'sitemap contains Compare query variant')

assert(dossier.includes('/compare/?exchange='), 'representative dossier does not expose Compare handoff')
assert(explorer.includes('/compare/'), 'Explorer does not expose Compare discovery link')

const report = {
  expected_commit: expectedCommit,
  deployed_commit: version.build.commit,
  result: 'PASS',
  verified_at: new Date().toISOString(),
  origin,
  routes: {
    compare_base: 'PASS',
    compare_query_2: 'PASS',
    compare_query_4: 'PASS',
    representative_dossier_handoff: 'PASS',
    explorer_discovery: 'PASS',
  },
  discovery: {
    version: 'PASS',
    manifest: 'PASS',
    llms: 'PASS',
    ai: 'PASS',
    sitemap: 'PASS',
  },
  sample: { slugs, names },
}

console.log(JSON.stringify(report, null, 2))
