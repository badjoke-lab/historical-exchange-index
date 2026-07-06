import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const outDir = path.join(root, 'out')
const origin = 'https://hei.badjoke-lab.com'
const artifactDir = path.join(root, 'artifacts')
const artifactPath = path.join(artifactDir, 'public-metadata-audit.json')

function fail(message) {
  throw new Error(`metadata audit failed: ${message}`)
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}

function attrs(tag) {
  const result = new Map()
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*["']([^"']*)["']/g)) {
    result.set(match[1].toLowerCase(), match[2].replace(/&amp;/g, '&'))
  }
  return result
}

function meta(html, kind, key) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => attrs(match[0]))
    .filter((item) => item.get(kind) === key)
    .map((item) => item.get('content') ?? '')
}

function links(html, rel, type = null) {
  return [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => attrs(match[0]))
    .filter((item) => (item.get('rel') ?? '').split(/\s+/).includes(rel))
    .filter((item) => type === null || item.get('type') === type)
    .map((item) => item.get('href') ?? '')
}

function titles(html) {
  return [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)].map((match) => match[1].trim())
}

function routeFor(file) {
  const relative = path.relative(outDir, file).split(path.sep).join('/')
  if (relative === 'index.html') return '/'
  return `/${relative.replace(/index\.html$/, '')}`
}

function normalizeUrl(value) {
  const url = new URL(value, origin)
  const pathname = url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '')
  return `${url.origin}${pathname}`
}

function sameRoute(a, b) {
  return normalizeUrl(a) === normalizeUrl(b)
}

function requireOne(findings, route, field, values) {
  if (values.length !== 1 || !values[0]?.trim()) {
    findings.push({ type: 'metadata_count_or_empty', route, field, count: values.length, values })
    return false
  }
  return true
}

const pages = walk(outDir).filter((file) => {
  const relative = path.relative(outDir, file).split(path.sep).join('/')
  return relative.endsWith('.html')
    && relative !== '404.html'
    && relative !== '_not-found.html'
    && !relative.startsWith('_not-found/')
})

const findings = []
const canonicalOwners = new Map()

for (const file of pages) {
  const route = routeFor(file)
  const html = fs.readFileSync(file, 'utf8')
  const expected = `${origin}${route}`
  const canonical = links(html, 'canonical')
  const ogUrl = meta(html, 'property', 'og:url')

  requireOne(findings, route, 'title', titles(html))
  requireOne(findings, route, 'description', meta(html, 'name', 'description'))
  const canonicalOk = requireOne(findings, route, 'canonical', canonical)
  requireOne(findings, route, 'og:title', meta(html, 'property', 'og:title'))
  requireOne(findings, route, 'og:description', meta(html, 'property', 'og:description'))
  const ogUrlOk = requireOne(findings, route, 'og:url', ogUrl)
  requireOne(findings, route, 'og:image', meta(html, 'property', 'og:image'))
  requireOne(findings, route, 'twitter:card', meta(html, 'name', 'twitter:card'))
  requireOne(findings, route, 'twitter:title', meta(html, 'name', 'twitter:title'))
  requireOne(findings, route, 'twitter:description', meta(html, 'name', 'twitter:description'))
  requireOne(findings, route, 'twitter:image', meta(html, 'name', 'twitter:image'))

  if (canonicalOk && !sameRoute(canonical[0], expected)) {
    findings.push({ type: 'canonical_mismatch', route, expected, actual: canonical[0] })
  }
  if (ogUrlOk && !sameRoute(ogUrl[0], expected)) {
    findings.push({ type: 'og_url_mismatch', route, expected, actual: ogUrl[0] })
  }

  if (canonicalOk) {
    const normalized = normalizeUrl(canonical[0])
    const owners = canonicalOwners.get(normalized) ?? []
    owners.push(route)
    canonicalOwners.set(normalized, owners)
  }

  if (route === '/updates/') {
    const jsonFeed = links(html, 'alternate', 'application/feed+json')
    const rss = links(html, 'alternate', 'application/rss+xml')
    if (jsonFeed.length !== 1 || !sameRoute(jsonFeed[0], '/feeds/updates.json')) {
      findings.push({ type: 'feed_alternate_mismatch', route, feed: 'json', values: jsonFeed })
    }
    if (rss.length !== 1 || !sameRoute(rss[0], '/feeds/updates.xml')) {
      findings.push({ type: 'feed_alternate_mismatch', route, feed: 'rss', values: rss })
    }
  }
}

for (const [canonical, routes] of canonicalOwners) {
  if (routes.length > 1) findings.push({ type: 'duplicate_canonical_owner', canonical, routes })
}

const report = {
  generated_at: new Date().toISOString(),
  page_count: pages.length,
  finding_count: findings.length,
  findings,
}
fs.mkdirSync(artifactDir, { recursive: true })
fs.writeFileSync(artifactPath, `${JSON.stringify(report, null, 2)}\n`)

console.log(`Public metadata audit: ${pages.length} HTML pages.`)
if (findings.length > 0) {
  for (const finding of findings) console.error(JSON.stringify(finding))
  fail(`${findings.length} findings`)
}
console.log('Public metadata audit passed with 0 findings.')
