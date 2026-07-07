import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const contractPath = path.join(root, 'config', 'production-verification-contract.json')
const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'))
const origin = contract.origin.replace(/\/$/, '')
const maxAttempts = Number(process.env.PRODUCTION_VERIFY_MAX_ATTEMPTS || 6)
const retryDelayMs = Number(process.env.PRODUCTION_VERIFY_RETRY_DELAY_MS || 15000)

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchText(relativePath, expectedContentType) {
  const separator = relativePath.includes('?') ? '&' : '?'
  const url = `${origin}${relativePath}${separator}hei_g5=${Date.now()}`
  const response = await fetch(url, {
    headers: {
      accept: expectedContentType,
      'cache-control': 'no-cache',
      'user-agent': 'HEI G-5 production integration verifier',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(20000),
  })

  assert(response.ok, `${relativePath} returned HTTP ${response.status}`)
  const contentType = response.headers.get('content-type') || ''
  assert(contentType.toLowerCase().includes(expectedContentType), `${relativePath} returned unexpected content-type ${contentType}`)
  return {
    text: await response.text(),
    finalUrl: response.url,
    contentType,
  }
}

async function waitForExpectedDeployment() {
  let lastError
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const { text } = await fetchText('/version.json', 'application/json')
      const version = JSON.parse(text)
      const deployedCommit = version.build?.commit
      assert(deployedCommit, 'production version.json does not contain build.commit')
      assert(version.build?.branch === 'main', `production branch is ${version.build?.branch}, expected main`)
      assert(
        deployedCommit === contract.expected_commit,
        `deployment commit mismatch: expected ${contract.expected_commit}, received ${deployedCommit}`,
      )
      return { version, deployedCommit, attempt }
    } catch (error) {
      lastError = error
      console.error(`Deployment check ${attempt}/${maxAttempts}: ${error instanceof Error ? error.message : error}`)
      if (attempt < maxAttempts) await sleep(retryDelayMs)
    }
  }
  throw lastError
}

function extractCanonical(html) {
  const match = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)
    || html.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i)
  return match?.[1] ?? null
}

function extractTitle(html) {
  return html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() ?? null
}

function sitemapLocations(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
}

async function verifyCoreRoutes() {
  const results = []
  for (const route of contract.core_routes) {
    const response = await fetchText(route, 'text/html')
    const canonical = extractCanonical(response.text)
    const title = extractTitle(response.text)
    assert(title, `${route} has no HTML title`)
    assert(canonical, `${route} has no canonical link`)
    results.push({ route, title, canonical, final_url: response.finalUrl })
  }
  return results
}

async function verifyExplorerQueries(paths) {
  const results = []
  for (const relativePath of paths) {
    const response = await fetchText(relativePath, 'text/html')
    const canonical = extractCanonical(response.text)
    assert(canonical === contract.explorer_canonical, `${relativePath} canonical is ${canonical}, expected ${contract.explorer_canonical}`)
    assert(response.text.includes('Explorer'), `${relativePath} does not contain Explorer surface marker`)
    results.push({ path: relativePath, canonical, final_url: response.finalUrl })
  }
  return results
}

async function verifyMachineFiles() {
  const results = []
  for (const relativePath of contract.machine_files) {
    const expectedType = relativePath.endsWith('.json')
      ? 'application/json'
      : relativePath.endsWith('.xml')
        ? 'xml'
        : relativePath.endsWith('.txt')
          ? 'text/plain'
          : 'xml'
    const response = await fetchText(relativePath, expectedType)
    assert(response.text.length > 0, `${relativePath} returned an empty body`)
    results.push({ path: relativePath, content_type: response.contentType, bytes: Buffer.byteLength(response.text) })
  }
  return results
}

async function verifySitemapAndRobots() {
  const sitemap = await fetchText('/sitemap.xml', 'xml')
  const robots = await fetchText('/robots.txt', 'text/plain')
  const locations = sitemapLocations(sitemap.text)
  assert(locations.length === 562, `production sitemap URL count is ${locations.length}, expected 562`)
  assert(new Set(locations).size === locations.length, 'production sitemap contains duplicate URLs')
  assert(locations.filter((url) => url === contract.explorer_canonical).length === 1, 'Explorer base route must appear exactly once in sitemap')
  assert(!locations.some((url) => new URL(url).search), 'production sitemap contains query variants')
  assert(/^User-agent:\s*\*\s*$/im.test(robots.text), 'robots.txt missing User-agent: *')
  assert(/^Allow:\s*\/\s*$/im.test(robots.text), 'robots.txt missing Allow: /')
  assert(new RegExp(`^Sitemap:\\s*${contract.sitemap_url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'im').test(robots.text), 'robots.txt missing canonical sitemap declaration')
  return { sitemap_url_count: locations.length, explorer_base_count: 1, robots_ok: true }
}

async function verifyRepresentativeDossier() {
  const entitiesResponse = await fetchText('/data/entities.json', 'application/json')
  const entities = JSON.parse(entitiesResponse.text)
  assert(Array.isArray(entities.records) && entities.records.length > 0, 'production entities.json has no records')

  const representative = entities.records.find((entity) => entity.slug === 'mt-gox') || entities.records[0]
  assert(representative?.slug, 'representative entity has no slug')
  const route = `/exchange/${representative.slug}/`
  const response = await fetchText(route, 'text/html')
  const canonical = extractCanonical(response.text)
  assert(canonical === `${origin}${route}`, `representative dossier canonical mismatch: ${canonical}`)
  assert(response.text.includes(representative.canonical_name), `representative dossier does not contain ${representative.canonical_name}`)
  return { entity_id: representative.id, slug: representative.slug, route, canonical }
}

async function main() {
  assert(contract.version === 1, 'unsupported production verification contract version')
  assert(contract.expected_commit, 'production verification contract has no expected_commit')

  const deployment = await waitForExpectedDeployment()
  console.log(`Deployment commit verified after attempt ${deployment.attempt}: ${deployment.deployedCommit}`)

  const coreRoutes = await verifyCoreRoutes()
  const explorerQueries = await verifyExplorerQueries(contract.explorer_queries)
  const deepLinks = await verifyExplorerQueries(contract.representative_deep_links)
  const machineFiles = await verifyMachineFiles()
  const crawl = await verifySitemapAndRobots()
  const dossier = await verifyRepresentativeDossier()

  const result = {
    checked_at: new Date().toISOString(),
    origin,
    expected_commit: contract.expected_commit,
    deployed_commit: deployment.deployedCommit,
    deployment_attempt: deployment.attempt,
    core_routes: coreRoutes,
    explorer_queries: explorerQueries,
    representative_deep_links: deepLinks,
    machine_files: machineFiles,
    crawl,
    representative_dossier: dossier,
    result: 'PASS',
  }

  const reportPath = process.env.PRODUCTION_VERIFY_REPORT || 'production-integration-verification.json'
  fs.writeFileSync(reportPath, `${JSON.stringify(result, null, 2)}\n`)

  console.log(`Production integration verification passed at ${origin}`)
  console.log(`core_routes=${coreRoutes.length}, explorer_queries=${explorerQueries.length}, deep_links=${deepLinks.length}, machine_files=${machineFiles.length}, sitemap_urls=${crawl.sitemap_url_count}`)
  console.log(`representative_dossier=${dossier.route}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error)
  process.exit(1)
})
