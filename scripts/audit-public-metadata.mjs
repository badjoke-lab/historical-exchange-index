import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const root = process.cwd()
const defaultOutDir = path.join(root, 'out')
const canonicalOrigin = 'https://hei.badjoke-lab.com'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function walk(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(fullPath) : [fullPath]
  })
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function attributes(tag) {
  const result = new Map()
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*["']([^"']*)["']/g)) {
    result.set(match[1].toLowerCase(), decodeHtml(match[2].trim()))
  }
  return result
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((match) => match[0])
}

function metaValues(html, keyType, keyValue) {
  return tags(html, 'meta')
    .map(attributes)
    .filter((attrs) => attrs.get(keyType) === keyValue)
    .map((attrs) => attrs.get('content') ?? '')
}

function linkValues(html, rel, type = null) {
  return tags(html, 'link')
    .map(attributes)
    .filter((attrs) => (attrs.get('rel') ?? '').split(/\s+/).includes(rel))
    .filter((attrs) => type === null || attrs.get('type') === type)
    .map((attrs) => attrs.get('href') ?? '')
}

function titleValues(html) {
  return [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)].map((match) => decodeHtml(match[1].trim()))
}

export function routeForHtmlFile(filePath, outDir = defaultOutDir) {
  const relative = path.relative(outDir, filePath).split(path.sep).join('/')
  if (relative === 'index.html') return '/'
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`
  return `/${relative}`
}

function isAuditableHtml(filePath, outDir) {
  const relative = path.relative(outDir, filePath).split(path.sep).join('/')
  if (!relative.endsWith('.html')) return false
  return !['404.html', '_not-found.html'].includes(relative)
    && !relative.startsWith('_not-found/')
}

function expectedCanonical(route, origin = canonicalOrigin) {
  return `${origin}${route}`
}

function pushCountFinding(findings, route, field, values) {
  if (values.length !== 1) {
    findings.push({ type: 'metadata_count', route, field, count: values.length, values })
    return false
  }
  if (!values[0].trim()) {
    findings.push({ type: 'metadata_empty', route, field })
    return false
  }
  return true
}

export function auditPublicMetadata(outDir = defaultOutDir, origin = canonicalOrigin) {
  assert(fs.existsSync(outDir), `metadata audit requires generated output at ${outDir}`)

  const htmlFiles = walk(outDir).filter((filePath) => isAuditableHtml(filePath, outDir))
  const findings = []
  const canonicalOwners = new Map()

  for (const filePath of htmlFiles) {
    const route = routeForHtmlFile(filePath, outDir)
    const html = fs.readFileSync(filePath, 'utf8')

    const titles = titleValues(html)
    const descriptions = metaValues(html, 'name', 'description')
    const canonicals = linkValues(html, 'canonical')
    const ogTitles = metaValues(html, 'property', 'og:title')
    const ogDescriptions = metaValues(html, 'property', 'og:description')
    const ogUrls = metaValues(html, 'property', 'og:url')
    const ogImages = metaValues(html, 'property', 'og:image')
    const twitterCards = metaValues(html, 'name', 'twitter:card')
    const twitterTitles = metaValues(html, 'name', 'twitter:title')
    const twitterDescriptions = metaValues(html, 'name', 'twitter:description')
    const twitterImages = metaValues(html, 'name', 'twitter:image')

    pushCountFinding(findings, route, 'title', titles)
    pushCountFinding(findings, route, 'description', descriptions)
    const canonicalValid = pushCountFinding(findings, route, 'canonical', canonicals)
    pushCountFinding(findings, route, 'og:title', ogTitles)
    pushCountFinding(findings, route, 'og:description', ogDescriptions)
    const ogUrlValid = pushCountFinding(findings, route, 'og:url', ogUrls)
    pushCountFinding(findings, route, 'og:image', ogImages)
    pushCountFinding(findings, route, 'twitter:card', twitterCards)
    pushCountFinding(findings, route, 'twitter:title', twitterTitles)
    pushCountFinding(findings, route, 'twitter:description', twitterDescriptions)
    pushCountFinding(findings, route, 'twitter:image', twitterImages)

    const expected = expectedCanonical(route, origin)
    if (canonicalValid && canonicals[0] !== expected) {
      findings.push({ type: 'canonical_mismatch', route, expected, actual: canonicals[0] })
    }
    if (ogUrlValid && ogUrls[0] !== expected) {
      findings.push({ type: 'og_url_mismatch', route, expected, actual: ogUrls[0] })
    }

    if (canonicalValid) {
      const owners = canonicalOwners.get(canonicals[0]) ?? []
      owners.push(route)
      canonicalOwners.set(canonicals[0], owners)
    }

    if (route === '/updates/') {
      const jsonFeedAlternates = linkValues(html, 'alternate', 'application/feed+json')
      const rssAlternates = linkValues(html, 'alternate', 'application/rss+xml')
      if (jsonFeedAlternates.length !== 1 || jsonFeedAlternates[0] !== '/feeds/updates.json') {
        findings.push({ type: 'feed_alternate_mismatch', route, feed: 'json', values: jsonFeedAlternates })
      }
      if (rssAlternates.length !== 1 || rssAlternates[0] !== '/feeds/updates.xml') {
        findings.push({ type: 'feed_alternate_mismatch', route, feed: 'rss', values: rssAlternates })
      }
    }
  }

  for (const [canonical, routes] of canonicalOwners) {
    if (routes.length > 1) findings.push({ type: 'duplicate_canonical_owner', canonical, routes })
  }

  return {
    pages: htmlFiles.length,
    findings,
  }
}

function writePage(outDir, route, metadata) {
  const targetDir = route === '/' ? outDir : path.join(outDir, route.replace(/^\/+|\/+$/g, ''))
  fs.mkdirSync(targetDir, { recursive: true })
  const canonical = `${canonicalOrigin}${route}`
  const html = `<!doctype html><html><head>
<title>${metadata.title ?? 'Page'}</title>
<meta name="description" content="${metadata.description ?? 'Description'}">
<link rel="canonical" href="${metadata.canonical ?? canonical}">
<meta property="og:title" content="Page">
<meta property="og:description" content="Description">
<meta property="og:url" content="${metadata.ogUrl ?? canonical}">
<meta property="og:image" content="${canonicalOrigin}/opengraph-image">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page">
<meta name="twitter:description" content="Description">
<meta name="twitter:image" content="${canonicalOrigin}/twitter-image">
${metadata.feedAlternates ?? ''}
</head><body></body></html>`
  fs.writeFileSync(path.join(targetDir, 'index.html'), html)
}

function runSelfTest() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hei-metadata-audit-'))
  try {
    writePage(tempDir, '/', {})
    writePage(tempDir, '/updates/', {
      feedAlternates: '<link rel="alternate" type="application/feed+json" href="/feeds/updates.json"><link rel="alternate" type="application/rss+xml" href="/feeds/updates.xml">',
    })
    const clean = auditPublicMetadata(tempDir)
    assert(clean.findings.length === 0, `self-test expected 0 findings: ${JSON.stringify(clean.findings)}`)

    writePage(tempDir, '/broken/', { canonical: `${canonicalOrigin}/wrong/`, ogUrl: `${canonicalOrigin}/wrong/` })
    const broken = auditPublicMetadata(tempDir)
    assert(broken.findings.some((item) => item.type === 'canonical_mismatch'), 'self-test did not detect canonical mismatch')
    assert(broken.findings.some((item) => item.type === 'og_url_mismatch'), 'self-test did not detect OG URL mismatch')
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
  console.log('Public metadata audit self-test passed.')
}

if (process.argv.includes('--self-test')) {
  runSelfTest()
} else {
  const result = auditPublicMetadata()
  console.log(`Public metadata audit: ${result.pages} HTML pages.`)
  if (result.findings.length > 0) {
    for (const finding of result.findings) console.error(JSON.stringify(finding))
    throw new Error(`public metadata audit found ${result.findings.length} findings`)
  }
  console.log('Public metadata audit passed with 0 findings.')
}
