import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const root = process.cwd()
const defaultOutDir = path.join(root, 'out')
const origin = 'https://hei.badjoke-lab.com'

const STATIC_ROUTES = [
  '/',
  '/dead/',
  '/active/',
  '/explore/',
  '/compare/',
  '/stats/',
  '/quality/',
  '/updates/',
  '/incidents/',
  '/monthly/',
  '/methodology/',
  '/about/',
  '/donate/',
]

const OBSOLETE_PREFIXES = ['/all', '/registry', '/exchanges']
const FEED_URLS = [`${origin}/feeds/updates.json`, `${origin}/feeds/updates.xml`]

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

function sitemapLocations(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
}

function canonicalHref(html) {
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0])
  const canonicals = []
  for (const tag of links) {
    const rel = tag.match(/\brel\s*=\s*["']([^"']+)["']/i)?.[1] ?? ''
    if (!rel.split(/\s+/).includes('canonical')) continue
    const href = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1]
    if (href) canonicals.push(href.replace(/&amp;/g, '&'))
  }
  return canonicals
}

function routeOutputFile(url, outDir) {
  const pathname = new URL(url).pathname
  if (pathname === '/') return path.join(outDir, 'index.html')
  return path.join(outDir, pathname.replace(/^\/+|\/+$/g, ''), 'index.html')
}

function expectedUrls(publicEntities) {
  const staticUrls = STATIC_ROUTES.map((route) => `${origin}${route}`)
  const entityUrls = publicEntities.records.map((entity) => `${origin}/exchange/${entity.slug}/`)
  return [...staticUrls, ...entityUrls]
}

function sorted(values) {
  return [...values].sort((a, b) => a.localeCompare(b))
}

function exactSetDiff(actual, expected) {
  const actualSet = new Set(actual)
  const expectedSet = new Set(expected)
  return {
    missing: sorted([...expectedSet].filter((value) => !actualSet.has(value))),
    unexpected: sorted([...actualSet].filter((value) => !expectedSet.has(value))),
  }
}

function assertRedirects(redirects) {
  const lines = redirects
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  for (const prefix of OBSOLETE_PREFIXES) {
    for (const source of [prefix, `${prefix}/`, `${prefix}/*`]) {
      const expected = `${source} / 301`
      assert(lines.includes(expected), `missing obsolete-route redirect: ${expected}`)
    }
  }
}

export function auditSitemapCanonicalRoutes(outDir = defaultOutDir) {
  const sitemap = readText(path.join(outDir, 'sitemap.xml'))
  const redirects = readText(path.join(outDir, '_redirects'))
  const publicEntities = readJson(path.join(outDir, 'data', 'entities.json'))
  const actual = sitemapLocations(sitemap)
  const expected = expectedUrls(publicEntities)
  const findings = []

  const duplicates = sorted([...new Set(actual.filter((url, index) => actual.indexOf(url) !== index))])
  if (duplicates.length > 0) findings.push({ type: 'duplicate_sitemap_urls', urls: duplicates })

  const diff = exactSetDiff(actual, expected)
  if (diff.missing.length > 0) findings.push({ type: 'missing_sitemap_urls', urls: diff.missing })
  if (diff.unexpected.length > 0) findings.push({ type: 'unexpected_sitemap_urls', urls: diff.unexpected })

  for (const url of actual) {
    const parsed = new URL(url)
    if (parsed.origin !== origin) findings.push({ type: 'wrong_origin', url })
    if (parsed.pathname !== '/' && !parsed.pathname.endsWith('/')) {
      findings.push({ type: 'sitemap_trailing_slash_mismatch', url })
    }
    if (FEED_URLS.includes(url)) findings.push({ type: 'feed_in_page_sitemap', url })
    if (OBSOLETE_PREFIXES.some((prefix) => parsed.pathname === prefix || parsed.pathname.startsWith(`${prefix}/`))) {
      findings.push({ type: 'obsolete_route_in_sitemap', url })
    }

    const outputFile = routeOutputFile(url, outDir)
    if (!fs.existsSync(outputFile)) {
      findings.push({ type: 'missing_route_output', url, output: path.relative(outDir, outputFile) })
      continue
    }

    const html = fs.readFileSync(outputFile, 'utf8')
    const canonicals = canonicalHref(html)
    if (canonicals.length !== 1) {
      findings.push({ type: 'canonical_count', url, count: canonicals.length, values: canonicals })
    } else if (canonicals[0] !== url) {
      findings.push({ type: 'canonical_sitemap_mismatch', url, canonical: canonicals[0] })
    }
  }

  try {
    assertRedirects(redirects)
  } catch (error) {
    findings.push({ type: 'obsolete_redirect_contract', message: error instanceof Error ? error.message : String(error) })
  }

  const entityUrls = actual.filter((url) => new URL(url).pathname.startsWith('/exchange/'))
  if (entityUrls.length !== publicEntities.records.length) {
    findings.push({
      type: 'entity_route_count_mismatch',
      sitemap_entity_routes: entityUrls.length,
      public_entities: publicEntities.records.length,
    })
  }

  return {
    sitemapUrlCount: actual.length,
    expectedUrlCount: expected.length,
    publicEntityCount: publicEntities.records.length,
    staticRouteCount: STATIC_ROUTES.length,
    findings,
  }
}

function writePage(outDir, route, canonical) {
  const target = route === '/'
    ? path.join(outDir, 'index.html')
    : path.join(outDir, route.replace(/^\/+|\/+$/g, ''), 'index.html')
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, `<!doctype html><link rel="canonical" href="${canonical}">`)
}

function runSelfTest() {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hei-sitemap-audit-'))
  try {
    fs.mkdirSync(path.join(outDir, 'data'), { recursive: true })
    const records = [{ slug: 'alpha' }, { slug: 'beta' }]
    fs.writeFileSync(path.join(outDir, 'data', 'entities.json'), JSON.stringify({ records }))

    const urls = [
      ...STATIC_ROUTES.map((route) => `${origin}${route}`),
      `${origin}/exchange/alpha/`,
      `${origin}/exchange/beta/`,
    ]
    fs.writeFileSync(path.join(outDir, 'sitemap.xml'), `<urlset>${urls.map((url) => `<url><loc>${url}</loc></url>`).join('')}</urlset>`)
    fs.writeFileSync(path.join(outDir, '_redirects'), [
      '/all / 301', '/all/ / 301', '/all/* / 301',
      '/registry / 301', '/registry/ / 301', '/registry/* / 301',
      '/exchanges / 301', '/exchanges/ / 301', '/exchanges/* / 301',
    ].join('\n'))

    for (const url of urls) writePage(outDir, new URL(url).pathname, url)

    const clean = auditSitemapCanonicalRoutes(outDir)
    assert(clean.findings.length === 0, `self-test expected no findings: ${JSON.stringify(clean.findings)}`)

    fs.writeFileSync(path.join(outDir, 'sitemap.xml'), `<urlset>${urls.slice(0, -1).map((url) => `<url><loc>${url}</loc></url>`).join('')}<url><loc>${FEED_URLS[0]}</loc></url></urlset>`)
    const broken = auditSitemapCanonicalRoutes(outDir)
    assert(broken.findings.some((item) => item.type === 'missing_sitemap_urls'), 'self-test did not detect missing URL')
    assert(broken.findings.some((item) => item.type === 'feed_in_page_sitemap'), 'self-test did not detect feed URL')
  } finally {
    fs.rmSync(outDir, { recursive: true, force: true })
  }

  console.log('Sitemap and canonical route audit self-test passed.')
}

if (process.argv.includes('--self-test')) {
  runSelfTest()
} else {
  const result = auditSitemapCanonicalRoutes()
  console.log(`Sitemap route audit: ${result.sitemapUrlCount} URLs = ${result.staticRouteCount} static + ${result.publicEntityCount} exchange routes.`)
  if (result.findings.length > 0) {
    for (const finding of result.findings) console.error(JSON.stringify(finding))
    throw new Error(`sitemap and canonical route audit found ${result.findings.length} findings`)
  }
  console.log('Sitemap and canonical route audit passed with 0 findings.')
}
