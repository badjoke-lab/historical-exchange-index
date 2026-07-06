import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { auditSitemapCanonicalRoutes } from './audit-sitemap-canonical-routes.mjs'

const root = process.cwd()
const defaultOutDir = path.join(root, 'out')
const defaultContractPath = path.join(root, 'config', 'machine-public-consistency-contract.json')

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function readJson(filePath) {
  assert(fs.existsSync(filePath), `missing ${filePath}`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function readText(filePath) {
  assert(fs.existsSync(filePath), `missing ${filePath}`)
  return fs.readFileSync(filePath, 'utf8')
}

function sorted(values) {
  return [...values].sort((a, b) => a.localeCompare(b))
}

function sameSet(actual, expected) {
  return JSON.stringify(sorted(new Set(actual))) === JSON.stringify(sorted(new Set(expected)))
}

function stableEqual(actual, expected) {
  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) return false
    return actual.every((item, index) => stableEqual(item, expected[index]))
  }
  if (actual && expected && typeof actual === 'object' && typeof expected === 'object') {
    const actualKeys = sorted(Object.keys(actual))
    const expectedKeys = sorted(Object.keys(expected))
    if (!stableEqual(actualKeys, expectedKeys)) return false
    return actualKeys.every((key) => stableEqual(actual[key], expected[key]))
  }
  return actual === expected
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractNumberAfterLabel(text, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = text.match(new RegExp(`${escaped}\\s*([0-9][0-9,]*)`, 'i'))
  return match ? Number(match[1].replace(/,/g, '')) : null
}

function routeOutputFile(route, outDir) {
  if (route === '/') return path.join(outDir, 'index.html')
  return path.join(outDir, route.replace(/^\/+|\/+$/g, ''), 'index.html')
}

function sitemapLocations(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
}

function rssGuids(xml) {
  return [...xml.matchAll(/<guid isPermaLink="false">([^<]+)<\/guid>/g)].map((match) => match[1])
}

function finding(category, type, detail = {}) {
  return { category, type, ...detail }
}

function expectedCountsFromMachine(publicEntities, publicEvents, publicEvidence) {
  const deadSide = new Set(['dead', 'merged', 'acquired', 'rebranded'])
  const activeSide = new Set(['active', 'limited', 'inactive'])
  return {
    primary_records: publicEntities.records.length,
    events: publicEvents.records.length,
    evidence: publicEvidence.records.length,
    dead_side: publicEntities.records.filter((entity) => deadSide.has(entity.status)).length,
    active_side: publicEntities.records.filter((entity) => activeSide.has(entity.status)).length,
  }
}

function evaluateCountConsistency({ version, manifest, entities, events, evidence }) {
  const findings = []
  const expected = expectedCountsFromMachine(entities, events, evidence)
  const sources = [
    ['version', version.data?.record_counts],
    ['manifest', manifest.record_counts],
  ]

  for (const [source, counts] of sources) {
    for (const key of ['primary_records', 'events', 'evidence']) {
      if (counts?.[key] !== expected[key]) {
        findings.push(finding('count_mismatch', 'record_count_mismatch', { source, key, actual: counts?.[key], expected: expected[key] }))
      }
    }
  }

  for (const [name, collection, expectedCount] of [
    ['entities', entities, expected.primary_records],
    ['events', events, expected.events],
    ['evidence', evidence, expected.evidence],
  ]) {
    if (collection.record_count !== expectedCount) {
      findings.push(finding('count_mismatch', 'collection_record_count_mismatch', { source: name, actual: collection.record_count, expected: expectedCount }))
    }
    if (collection.records.length !== expectedCount) {
      findings.push(finding('count_mismatch', 'collection_length_mismatch', { source: name, actual: collection.records.length, expected: expectedCount }))
    }
  }

  for (const [source, breakdown] of [
    ['version', version.data?.record_count_breakdown],
    ['manifest', manifest.record_count_breakdown],
  ]) {
    for (const key of ['dead_side', 'active_side']) {
      if (breakdown?.[key] !== expected[key]) {
        findings.push(finding('count_mismatch', 'side_count_mismatch', { source, key, actual: breakdown?.[key], expected: expected[key] }))
      }
    }
  }

  return { expected, findings }
}

function evaluateRouteConsistency({ contract, version, manifest, llms, ai }) {
  const findings = []
  const expected = contract.required_main_routes
  const manifestRoutes = manifest.main_routes ?? []
  const versionRoutes = Object.values(version.routes ?? {})

  if (!sameSet(manifestRoutes, expected)) {
    findings.push(finding('route_discovery_mismatch', 'manifest_route_set_mismatch', {
      missing: expected.filter((route) => !manifestRoutes.includes(route)),
      unexpected: manifestRoutes.filter((route) => !expected.includes(route)),
    }))
  }

  if (!sameSet(versionRoutes, expected)) {
    findings.push(finding('route_discovery_mismatch', 'version_route_set_mismatch', {
      missing: expected.filter((route) => !versionRoutes.includes(route)),
      unexpected: versionRoutes.filter((route) => !expected.includes(route)),
    }))
  }

  for (const route of expected) {
    if (!llms.includes(route)) findings.push(finding('route_discovery_mismatch', 'llms_route_missing', { route }))
    if (!ai.includes(route)) findings.push(finding('route_discovery_mismatch', 'ai_route_missing', { route }))
  }

  return findings
}

function evaluateTimestampConsistency({ version, manifest, entities, events, evidence }) {
  const findings = []
  const generated = [
    ['version.build', version.build?.generated_at],
    ['version.data', version.data?.generated_at],
    ['manifest', manifest.generated_at],
    ['entities', entities.generated_at],
    ['events', events.generated_at],
    ['evidence', evidence.generated_at],
  ]
  const generatedValues = new Set(generated.map(([, value]) => value))
  if (generatedValues.size !== 1 || [...generatedValues].some((value) => !value || Number.isNaN(Date.parse(value)))) {
    findings.push(finding('timestamp_mismatch', 'generated_at_mismatch', { values: Object.fromEntries(generated) }))
  }

  const reviewed = [
    ['version.data', version.data?.records_last_reviewed_at],
    ['manifest', manifest.records_last_reviewed_at],
    ['entities', entities.records_last_reviewed_at],
    ['events', events.records_last_reviewed_at],
    ['evidence', evidence.records_last_reviewed_at],
  ]
  if (new Set(reviewed.map(([, value]) => value)).size !== 1) {
    findings.push(finding('timestamp_mismatch', 'records_last_reviewed_at_mismatch', { values: Object.fromEntries(reviewed) }))
  }

  return findings
}

function evaluateSafetyBoundary({ contract, manifest, machineTexts, feedTexts, collections }) {
  const findings = []
  if (!stableEqual(manifest.data_safety, contract.public_safety.manifest_exact)) {
    findings.push(finding('public_safety_boundary_leak', 'manifest_data_safety_mismatch', {
      actual: manifest.data_safety,
      expected: contract.public_safety.manifest_exact,
    }))
  }

  for (const [name, collection] of Object.entries(collections)) {
    if (collection.canonical_only !== true) {
      findings.push(finding('public_safety_boundary_leak', 'collection_not_canonical_only', { source: name }))
    }
  }

  for (const [name, text] of Object.entries(machineTexts)) {
    for (const marker of contract.public_safety.forbidden_machine_markers) {
      if (text.includes(marker)) findings.push(finding('public_safety_boundary_leak', 'forbidden_machine_marker', { source: name, marker }))
    }
  }

  for (const [name, text] of Object.entries(feedTexts)) {
    for (const marker of contract.public_safety.forbidden_feed_markers) {
      if (text.includes(marker)) findings.push(finding('public_safety_boundary_leak', 'forbidden_feed_marker', { source: name, marker }))
    }
  }

  return findings
}

function evaluateFeedConsistency({ registryUpdates, jsonFeed, rssFeed }) {
  const findings = []
  const updates = [...registryUpdates.updates].sort((a, b) => {
    const dateOrder = b.date.localeCompare(a.date)
    return dateOrder !== 0 ? dateOrder : a.id.localeCompare(b.id)
  })
  const expectedIds = updates.map((update) => `urn:hei:registry-update:${update.id}`)
  const jsonIds = jsonFeed.items.map((item) => item.id)
  const rssIds = rssGuids(rssFeed)

  if (!stableEqual(jsonIds, expectedIds)) {
    findings.push(finding('feed_contract', 'json_feed_id_order_mismatch', { actual: jsonIds, expected: expectedIds }))
  }
  if (!stableEqual(rssIds, expectedIds)) {
    findings.push(finding('feed_contract', 'rss_feed_guid_order_mismatch', { actual: rssIds, expected: expectedIds }))
  }
  if (jsonFeed.items.some((item) => item._hei?.reviewed_public_only !== true)) {
    findings.push(finding('feed_contract', 'json_feed_reviewed_marker_missing'))
  }
  for (let index = 0; index < updates.length; index += 1) {
    const source = updates[index]
    const item = jsonFeed.items[index]
    if (!item) continue
    if (item.url !== `https://hei.badjoke-lab.com/updates/#${source.id}`) {
      findings.push(finding('feed_contract', 'json_feed_item_url_mismatch', { update_id: source.id, actual: item.url }))
    }
    if (item.date_published !== `${source.date}T00:00:00.000Z`) {
      findings.push(finding('feed_contract', 'json_feed_date_mismatch', { update_id: source.id, actual: item.date_published }))
    }
  }

  return findings
}

function evaluateRobots(contract, robots) {
  const findings = []
  const required = contract.robots
  if (!new RegExp(`User-agent:\\s*${required.required_user_agent.replace('*', '\\*')}`, 'i').test(robots)) {
    findings.push(finding('sitemap_robots', 'robots_user_agent_missing'))
  }
  if (!new RegExp(`Allow:\\s*${required.required_allow.replace('/', '\\/')}`, 'i').test(robots)) {
    findings.push(finding('sitemap_robots', 'robots_allow_missing'))
  }
  if (!robots.includes(`Sitemap: ${required.required_sitemap}`)) {
    findings.push(finding('sitemap_robots', 'robots_sitemap_missing'))
  }
  return findings
}

function evaluateSitemapContract(contract, sitemapResult, sitemapXml) {
  const findings = []
  for (const item of sitemapResult.findings) findings.push(finding('sitemap_robots', 'sitemap_audit_finding', { finding: item }))
  if (sitemapResult.staticRouteCount !== contract.sitemap.static_route_count) {
    findings.push(finding('sitemap_robots', 'static_route_count_mismatch', { actual: sitemapResult.staticRouteCount, expected: contract.sitemap.static_route_count }))
  }
  const locations = sitemapLocations(sitemapXml)
  const explorerBase = `${contract.canonical_origin}/explore/`
  const explorerBaseCount = locations.filter((url) => url === explorerBase).length
  if (explorerBaseCount !== contract.sitemap.explorer_base_route_exact_count) {
    findings.push(finding('sitemap_robots', 'explorer_base_sitemap_count_mismatch', { actual: explorerBaseCount, expected: contract.sitemap.explorer_base_route_exact_count }))
  }
  if (!contract.sitemap.query_variants_allowed && locations.some((url) => new URL(url).search)) {
    findings.push(finding('sitemap_robots', 'query_variant_in_sitemap'))
  }
  return findings
}

function evaluateHtmlCounts(contract, outDir, expected) {
  const findings = []
  const valueMap = {
    'Total records': expected.primary_records,
    'Total entities': expected.primary_records,
    'Dead-side': expected.dead_side,
    'Active-side': expected.active_side,
    'Total events': expected.events,
    'Total evidence': expected.evidence,
    'Entities': expected.primary_records,
    'Events': expected.events,
    'Evidence': expected.evidence,
  }

  for (const [route, labels] of Object.entries(contract.html_count_surfaces)) {
    const html = readText(routeOutputFile(route, outDir))
    const text = stripHtml(html)
    for (const label of labels) {
      const actual = extractNumberAfterLabel(text, label)
      const expectedValue = valueMap[label]
      if (actual !== expectedValue) {
        findings.push(finding('count_mismatch', 'html_count_mismatch', { route, label, actual, expected: expectedValue }))
      }
    }
  }

  return findings
}

function evaluateAiCountState({ llms, ai, expected }) {
  const findings = []
  const labels = [
    ['Total records', expected.primary_records],
    ['Dead-side', expected.dead_side],
    ['Active-side', expected.active_side],
    ['Events', expected.events],
    ['Evidence', expected.evidence],
  ]
  for (const [source, text] of [['llms.txt', llms], ['ai.txt', ai]]) {
    for (const [label, value] of labels) {
      if (!text.includes(`${label}: ${value}`)) {
        findings.push(finding('count_mismatch', 'ai_discovery_count_mismatch', { source, label, expected: value }))
      }
    }
  }
  return findings
}

export function auditMachinePublicConsistency(
  outDir = defaultOutDir,
  contractPath = defaultContractPath,
  rootDir = root,
) {
  const contract = readJson(contractPath)
  assert(contract.version === 1, 'unsupported machine/public consistency contract version')

  const files = {
    version: readJson(path.join(outDir, 'version.json')),
    manifest: readJson(path.join(outDir, 'data', 'manifest.json')),
    entities: readJson(path.join(outDir, 'data', 'entities.json')),
    events: readJson(path.join(outDir, 'data', 'events.json')),
    evidence: readJson(path.join(outDir, 'data', 'evidence.json')),
    jsonFeed: readJson(path.join(outDir, 'feeds', 'updates.json')),
    rssFeed: readText(path.join(outDir, 'feeds', 'updates.xml')),
    llms: readText(path.join(outDir, 'llms.txt')),
    ai: readText(path.join(outDir, 'ai.txt')),
    sitemap: readText(path.join(outDir, 'sitemap.xml')),
    robots: readText(path.join(outDir, 'robots.txt')),
  }
  const registryUpdates = readJson(path.join(rootDir, contract.reviewed_update_source))
  const findings = []

  for (const route of contract.required_machine_files) {
    const filePath = path.join(outDir, route.replace(/^\//, ''))
    if (!fs.existsSync(filePath)) findings.push(finding('route_discovery_mismatch', 'required_machine_file_missing', { route }))
  }

  const countResult = evaluateCountConsistency(files)
  findings.push(...countResult.findings)
  findings.push(...evaluateRouteConsistency({ contract, ...files }))
  findings.push(...evaluateTimestampConsistency(files))
  findings.push(...evaluateSafetyBoundary({
    contract,
    manifest: files.manifest,
    collections: { entities: files.entities, events: files.events, evidence: files.evidence },
    machineTexts: {
      entities: JSON.stringify(files.entities),
      events: JSON.stringify(files.events),
      evidence: JSON.stringify(files.evidence),
    },
    feedTexts: {
      json_feed: JSON.stringify(files.jsonFeed),
      rss_feed: files.rssFeed,
    },
  }))
  findings.push(...evaluateFeedConsistency({ registryUpdates, jsonFeed: files.jsonFeed, rssFeed: files.rssFeed }))

  const sitemapResult = auditSitemapCanonicalRoutes(outDir)
  findings.push(...evaluateSitemapContract(contract, sitemapResult, files.sitemap))
  findings.push(...evaluateRobots(contract, files.robots))
  findings.push(...evaluateHtmlCounts(contract, outDir, countResult.expected))
  findings.push(...evaluateAiCountState({ llms: files.llms, ai: files.ai, expected: countResult.expected }))

  const categories = Object.fromEntries([
    'count_mismatch',
    'route_discovery_mismatch',
    'public_safety_boundary_leak',
    'feed_contract',
    'timestamp_mismatch',
    'sitemap_robots',
  ].map((category) => [category, findings.filter((item) => item.category === category).length]))

  return {
    entityCount: files.entities.records.length,
    eventCount: files.events.records.length,
    evidenceCount: files.evidence.records.length,
    reviewedUpdateCount: registryUpdates.updates.length,
    sitemapUrlCount: sitemapResult.sitemapUrlCount,
    categories,
    findings,
  }
}

function runSelfTest() {
  const sample = {
    version: { data: { record_counts: { primary_records: 2, events: 1, evidence: 3 }, record_count_breakdown: { dead_side: 1, active_side: 1 } } },
    manifest: { record_counts: { primary_records: 2, events: 1, evidence: 3 }, record_count_breakdown: { dead_side: 1, active_side: 1 } },
    entities: { record_count: 2, records: [{ status: 'dead' }, { status: 'active' }] },
    events: { record_count: 1, records: [{}] },
    evidence: { record_count: 3, records: [{}, {}, {}] },
  }

  const clean = evaluateCountConsistency(sample)
  assert(clean.findings.length === 0, `clean count fixture failed: ${JSON.stringify(clean.findings)}`)

  const brokenCount = structuredClone(sample)
  brokenCount.manifest.record_counts.primary_records = 3
  assert(evaluateCountConsistency(brokenCount).findings.some((item) => item.category === 'count_mismatch'), 'self-test did not detect count mismatch')

  const routeContract = { required_main_routes: ['/', '/explore/'] }
  const cleanRoutes = evaluateRouteConsistency({
    contract: routeContract,
    version: { routes: { home: '/', explorer: '/explore/' } },
    manifest: { main_routes: ['/', '/explore/'] },
    llms: '/\n/explore/',
    ai: '/\n/explore/',
  })
  assert(cleanRoutes.length === 0, `clean route fixture failed: ${JSON.stringify(cleanRoutes)}`)
  const brokenRoutes = evaluateRouteConsistency({
    contract: routeContract,
    version: { routes: { home: '/' } },
    manifest: { main_routes: ['/'] },
    llms: '/',
    ai: '/',
  })
  assert(brokenRoutes.some((item) => item.category === 'route_discovery_mismatch'), 'self-test did not detect route mismatch')

  const safetyContract = {
    public_safety: {
      manifest_exact: { canonical_only: true, includes_unreviewed_candidates: false },
      forbidden_machine_markers: ['candidate_class'],
      forbidden_feed_markers: ['data-staging'],
    },
  }
  const safetyFindings = evaluateSafetyBoundary({
    contract: safetyContract,
    manifest: { data_safety: { canonical_only: true, includes_unreviewed_candidates: false } },
    collections: { entities: { canonical_only: true } },
    machineTexts: { entities: '{"candidate_class":"A"}' },
    feedTexts: { rss: 'safe' },
  })
  assert(safetyFindings.some((item) => item.category === 'public_safety_boundary_leak'), 'self-test did not detect safety leak')

  const updates = { updates: [{ id: 'hei_up_1', date: '2026-01-01' }] }
  const feedFindings = evaluateFeedConsistency({
    registryUpdates: updates,
    jsonFeed: { items: [{ id: 'wrong', url: 'wrong', date_published: 'wrong', _hei: { reviewed_public_only: false } }] },
    rssFeed: '<rss></rss>',
  })
  assert(feedFindings.some((item) => item.category === 'feed_contract'), 'self-test did not detect feed mismatch')

  const timestampFindings = evaluateTimestampConsistency({
    version: { build: { generated_at: '2026-01-01T00:00:00Z' }, data: { generated_at: '2026-01-02T00:00:00Z', records_last_reviewed_at: '2026-01-01' } },
    manifest: { generated_at: '2026-01-01T00:00:00Z', records_last_reviewed_at: '2026-01-01' },
    entities: { generated_at: '2026-01-01T00:00:00Z', records_last_reviewed_at: '2026-01-01' },
    events: { generated_at: '2026-01-01T00:00:00Z', records_last_reviewed_at: '2026-01-01' },
    evidence: { generated_at: '2026-01-01T00:00:00Z', records_last_reviewed_at: '2026-01-01' },
  })
  assert(timestampFindings.some((item) => item.category === 'timestamp_mismatch'), 'self-test did not detect timestamp mismatch')

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hei-g4-selftest-'))
  try {
    fs.writeFileSync(path.join(tempDir, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://hei.badjoke-lab.com/sitemap.xml\n')
    const robotsContract = {
      robots: {
        required_user_agent: '*',
        required_allow: '/',
        required_sitemap: 'https://hei.badjoke-lab.com/sitemap.xml',
      },
    }
    assert(evaluateRobots(robotsContract, readText(path.join(tempDir, 'robots.txt'))).length === 0, 'clean robots fixture failed')
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }

  console.log('Machine/public consistency audit self-test passed.')
}

if (process.argv.includes('--self-test')) {
  runSelfTest()
} else {
  const result = auditMachinePublicConsistency()
  console.log(`Machine/public consistency audit: ${result.entityCount} entities, ${result.eventCount} events, ${result.evidenceCount} evidence, ${result.reviewedUpdateCount} reviewed updates, ${result.sitemapUrlCount} sitemap URLs.`)
  console.log(`Categories: ${JSON.stringify(result.categories)}`)
  for (const item of result.findings) console.log(JSON.stringify(item))
  if (result.findings.length > 0) throw new Error(`machine/public consistency audit found ${result.findings.length} findings`)
  console.log('Machine/public consistency audit passed with 0 findings.')
}
