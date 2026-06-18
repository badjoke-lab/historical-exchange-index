const origin = 'https://hei.badjoke-lab.com'
const expectedCommit = '40353a503c64d4f24af449d989b6cbd70192cb03'
const expected = { total: 412, deadSide: 189, activeSide: 223, events: 687, evidence: 1594 }
const maxAttempts = 18
const retryDelayMs = 20000

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
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

async function fetchText(path, expectedType, cacheKey, redirect = 'follow') {
  const separator = path.includes('?') ? '&' : '?'
  const response = await fetch(`${origin}${path}${separator}post394=${encodeURIComponent(cacheKey)}`, {
    headers: { accept: expectedType, 'user-agent': 'HEI post-394 production audit' },
    redirect,
    signal: AbortSignal.timeout(25000),
  })
  if (redirect === 'follow') {
    assert(response.ok, `${path} returned HTTP ${response.status}`)
    const contentType = (response.headers.get('content-type') || '').toLowerCase()
    assert(contentType.includes(expectedType), `${path} returned ${contentType}, expected ${expectedType}`)
  }
  return { response, text: await response.text() }
}

function assertCanonical(html, expectedUrl, route) {
  const escaped = expectedUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const canonical = new RegExp(`<link[^>]+rel=["']canonical["'][^>]+href=["']${escaped}["']`, 'i')
    .test(html)
    || new RegExp(`<link[^>]+href=["']${escaped}["'][^>]+rel=["']canonical["']`, 'i').test(html)
  assert(canonical, `${route} canonical link is missing or incorrect`)
}

function assertHtmlMetadata(html, route, canonicalUrl) {
  assertCanonical(html, canonicalUrl, route)
  assert(html.includes('/data/manifest.json'), `${route} is missing manifest discovery`)
  assert(html.includes('/llms.txt'), `${route} is missing llms discovery`)
  assert(/<meta[^>]+name=["']description["']/i.test(html), `${route} is missing meta description`)
  assert(/<meta[^>]+property=["']og:(title|description)["']/i.test(html), `${route} is missing OGP metadata`)
  assert(!/\b386\b/.test(stripHtml(html)), `${route} contains obsolete count 386`)
}

function assertDataset(name, dataset, count, generatedAt) {
  assert(dataset.canonical_only === true, `${name} canonical_only is not true`)
  assert(dataset.record_count === count, `${name} record_count mismatch`)
  assert(dataset.records.length === count, `${name} records length mismatch`)
  assert(dataset.generated_at === generatedAt, `${name} generated_at mismatch`)
  assert(dataset.records.every((record) => typeof record.canonical_page_url === 'string'
    && record.canonical_page_url.startsWith(`${origin}/exchange/`)), `${name} has missing canonical_page_url`)
  const serialized = JSON.stringify(dataset)
  assert(!serialized.includes('candidate_class'), `${name} contains staging candidate fields`)
  assert(!serialized.includes('data-staging'), `${name} contains internal staging paths`)
  assert(!/\b386\b/.test(serialized), `${name} contains obsolete count 386`)
}

async function auditOnce() {
  const cacheKey = `${expectedCommit}-${Date.now()}`
  const paths = [
    ['/version.json', 'application/json'],
    ['/data/manifest.json', 'application/json'],
    ['/data/entities.json', 'application/json'],
    ['/data/events.json', 'application/json'],
    ['/data/evidence.json', 'application/json'],
    ['/llms.txt', 'text/plain'],
    ['/ai.txt', 'text/plain'],
    ['/', 'text/html'],
    ['/dead/', 'text/html'],
    ['/active/', 'text/html'],
    ['/stats/', 'text/html'],
    ['/sitemap.xml', 'application/xml'],
    ['/robots.txt', 'text/plain'],
  ]
  const fetched = new Map()
  await Promise.all(paths.map(async ([path, type]) => fetched.set(path, await fetchText(path, type, cacheKey))))

  const version = JSON.parse(fetched.get('/version.json').text)
  const manifest = JSON.parse(fetched.get('/data/manifest.json').text)
  const entities = JSON.parse(fetched.get('/data/entities.json').text)
  const events = JSON.parse(fetched.get('/data/events.json').text)
  const evidence = JSON.parse(fetched.get('/data/evidence.json').text)
  const llms = fetched.get('/llms.txt').text
  const ai = fetched.get('/ai.txt').text
  const home = fetched.get('/').text
  const dead = fetched.get('/dead/').text
  const active = fetched.get('/active/').text
  const stats = fetched.get('/stats/').text
  const sitemap = fetched.get('/sitemap.xml').text
  const robots = fetched.get('/robots.txt').text

  assert(version.build?.commit === expectedCommit,
    `deployment commit mismatch: expected ${expectedCommit}, received ${version.build?.commit}`)
  assert(version.build?.branch === 'main', `deployment branch is ${version.build?.branch}`)
  assert(version.schema_version === '1.0.0', 'version schema_version mismatch')
  assert(version.data?.canonical_only === true, 'version canonical_only is not true')
  assert(version.data?.record_counts?.primary_records === expected.total, 'version total mismatch')
  assert(version.data?.record_counts?.events === expected.events, 'version event count mismatch')
  assert(version.data?.record_counts?.evidence === expected.evidence, 'version evidence count mismatch')
  assert(version.data?.record_count_breakdown?.dead_side === expected.deadSide, 'version dead-side mismatch')
  assert(version.data?.record_count_breakdown?.active_side === expected.activeSide, 'version active-side mismatch')
  assert(expected.deadSide + expected.activeSide === expected.total, 'expected side totals are invalid')

  assert(manifest.record_counts.primary_records === expected.total, 'manifest total mismatch')
  assert(manifest.record_counts.events === expected.events, 'manifest events mismatch')
  assert(manifest.record_counts.evidence === expected.evidence, 'manifest evidence mismatch')
  assert(manifest.record_count_breakdown.dead_side === expected.deadSide, 'manifest dead-side mismatch')
  assert(manifest.record_count_breakdown.active_side === expected.activeSide, 'manifest active-side mismatch')
  assert(manifest.generated_at === version.build.generated_at, 'manifest/version generated_at mismatch')
  assert(manifest.data_safety.canonical_only === true, 'manifest canonical_only is not true')
  assert(manifest.data_safety.includes_unreviewed_candidates === false, 'manifest includes candidates')
  assert(manifest.data_safety.includes_internal_monitoring === false, 'manifest includes monitoring')
  assert(manifest.data_safety.includes_private_notes === false, 'manifest includes private notes')

  assertDataset('entities', entities, expected.total, version.build.generated_at)
  assertDataset('events', events, expected.events, version.build.generated_at)
  assertDataset('evidence', evidence, expected.evidence, version.build.generated_at)
  assert(entities.records.every((record) => record.last_verified_at && record.confidence), 'entity identity fields incomplete')
  assert(events.records.every((record) => record.confidence), 'event confidence incomplete')
  assert(evidence.records.every((record) => record.reliability), 'evidence reliability incomplete')

  for (const [label, count] of [
    ['Total records', expected.total],
    ['Dead-side', expected.deadSide],
    ['Active-side', expected.activeSide],
    ['Events', expected.events],
    ['Evidence', expected.evidence],
  ]) {
    assert(llms.includes(`${label}: ${count}`), `llms.txt missing ${label}: ${count}`)
    assert(ai.includes(`${label}: ${count}`), `ai.txt missing ${label}: ${count}`)
  }
  assert(!/\b386\b/.test(llms), 'llms.txt contains obsolete count 386')
  assert(!/\b386\b/.test(ai), 'ai.txt contains obsolete count 386')

  assertHtmlMetadata(home, '/', `${origin}/`)
  assertHtmlMetadata(dead, '/dead/', `${origin}/dead/`)
  assertHtmlMetadata(active, '/active/', `${origin}/active/`)
  assertHtmlMetadata(stats, '/stats/', `${origin}/stats/`)
  const homeText = stripHtml(home)
  const deadText = stripHtml(dead)
  const activeText = stripHtml(active)
  const statsText = stripHtml(stats)
  assert(homeText.includes(`Total records ${expected.total}`), 'home total count mismatch')
  assert(homeText.includes(`Dead-side ${expected.deadSide}`), 'home dead-side mismatch')
  assert(homeText.includes(`Active-side ${expected.activeSide}`), 'home active-side mismatch')
  assert(deadText.includes(`Dead-side total: ${expected.deadSide}`), 'dead page total mismatch')
  assert(activeText.includes(`Active-side total: ${expected.activeSide}`), 'active page total mismatch')
  assert(statsText.includes(`Total entities ${expected.total}`), 'stats total mismatch')
  assert(statsText.includes(`Total events ${expected.events}`), 'stats events mismatch')
  assert(statsText.includes(`Total evidence ${expected.evidence}`), 'stats evidence mismatch')
  assert(home.includes('"@type":"Dataset"') || home.includes('&quot;@type&quot;:&quot;Dataset&quot;'), 'home Dataset JSON-LD missing')
  assert(dead.includes(`"numberOfItems":${expected.deadSide}`), 'dead JSON-LD count missing')
  assert(active.includes(`"numberOfItems":${expected.activeSide}`), 'active JSON-LD count missing')

  const sample = entities.records[0]
  const detailPath = `/exchange/${sample.slug}/`
  const detail = (await fetchText(detailPath, 'text/html', cacheKey)).text
  assertHtmlMetadata(detail, detailPath, `${origin}${detailPath}`)
  assert(detail.includes('application/ld+json'), 'detail JSON-LD missing')

  const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
  assert(locations.length === expected.total + 7, `sitemap URL count mismatch: ${locations.length}`)
  assert(locations.includes(`${origin}/`), 'sitemap missing home')
  assert(locations.includes(`${origin}/dead/`), 'sitemap missing dead')
  assert(locations.includes(`${origin}/active/`), 'sitemap missing active')
  assert(locations.includes(`${origin}/stats/`), 'sitemap missing stats')
  assert(locations.includes(`${origin}${detailPath}`), 'sitemap missing sample detail')
  assert(!sitemap.includes('/all/'), 'sitemap includes obsolete /all/')
  assert(!sitemap.includes('/registry/'), 'sitemap includes obsolete /registry/')
  assert(!sitemap.includes('/exchanges/'), 'sitemap includes obsolete /exchanges/')
  assert(robots.includes(`${origin}/sitemap.xml`), 'robots sitemap line mismatch')

  for (const obsolete of ['/index.html', '/all', '/registry', '/exchanges']) {
    const { response } = await fetchText(obsolete, 'text/html', cacheKey, 'manual')
    assert([301, 302, 307, 308].includes(response.status), `${obsolete} returned ${response.status}, expected redirect`)
    const location = response.headers.get('location') || ''
    assert(location === '/' || location === `${origin}/`, `${obsolete} redirects to ${location}`)
  }

  console.log('POST_394_PRODUCTION_AUDIT=PASS')
  console.log(`commit=${version.build.commit}`)
  console.log(`generated_at=${version.build.generated_at}`)
  console.log(`counts=${expected.total}/${expected.deadSide}/${expected.activeSide}/${expected.events}/${expected.evidence}`)
  console.log(`sitemap_urls=${locations.length}`)
  console.log(`sample_detail=${detailPath}`)
  console.log('checked=/,/dead/,/active/,/stats/,sample detail,version,manifest,entities,events,evidence,llms,ai,sitemap,robots,legacy redirects')
}

let lastError
for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  try {
    console.log(`audit attempt ${attempt}/${maxAttempts}`)
    await auditOnce()
    process.exit(0)
  } catch (error) {
    lastError = error
    console.error(error instanceof Error ? error.message : error)
    if (attempt < maxAttempts) await sleep(retryDelayMs)
  }
}
throw lastError
