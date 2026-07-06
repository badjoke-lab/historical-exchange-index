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

function decodeHtmlAttribute(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

export function routeForHtmlFile(filePath, outDir = defaultOutDir) {
  const relative = path.relative(outDir, filePath).split(path.sep).join('/')
  if (relative === 'index.html') return '/'
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`
  return `/${relative}`
}

function extractHrefs(html) {
  return [...html.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi)]
    .map((match) => decodeHtmlAttribute(match[1].trim()))
    .filter(Boolean)
}

function extractAnchors(html) {
  const values = new Set()
  for (const pattern of [/\bid\s*=\s*["']([^"']+)["']/gi, /\bname\s*=\s*["']([^"']+)["']/gi]) {
    for (const match of html.matchAll(pattern)) values.add(decodeHtmlAttribute(match[1]))
  }
  return values
}

function isIgnoredScheme(href) {
  return /^(?:mailto|tel|javascript|data):/i.test(href)
}

export function resolveInternalHref(href, sourceRoute, origin = canonicalOrigin) {
  if (!href || isIgnoredScheme(href)) return null
  if (href.startsWith('//')) {
    const protocolRelative = new URL(`https:${href}`)
    if (protocolRelative.origin !== origin) return null
  }

  let url
  try {
    url = new URL(href, new URL(sourceRoute, origin))
  } catch {
    return { error: 'invalid_url', href }
  }

  if (url.origin !== origin) return null

  let fragment = ''
  if (url.hash.length > 1) {
    try {
      fragment = decodeURIComponent(url.hash.slice(1))
    } catch {
      fragment = url.hash.slice(1)
    }
  }

  return {
    pathname: decodeURIComponent(url.pathname),
    fragment,
    href,
  }
}

export function outputCandidatesForPathname(pathname, outDir = defaultOutDir) {
  const clean = pathname.replace(/^\/+/, '')
  if (!clean) return [path.join(outDir, 'index.html')]

  const exact = path.join(outDir, clean)
  const withoutTrailing = clean.replace(/\/+$/, '')
  const indexFile = path.join(outDir, withoutTrailing, 'index.html')
  const htmlFile = path.join(outDir, `${withoutTrailing}.html`)

  return [...new Set([exact, indexFile, htmlFile])]
}

function resolveOutputFile(pathname, outDir) {
  return outputCandidatesForPathname(pathname, outDir).find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) ?? null
}

export function auditInternalLinks(outDir = defaultOutDir) {
  assert(fs.existsSync(outDir), `internal link audit requires generated output at ${outDir}`)

  const htmlFiles = walk(outDir).filter((filePath) => filePath.endsWith('.html'))
  const htmlCache = new Map(htmlFiles.map((filePath) => [filePath, fs.readFileSync(filePath, 'utf8')]))
  const anchorCache = new Map()
  const findings = []
  let checkedLinks = 0
  let checkedFragments = 0
  let externalOrIgnored = 0

  for (const [sourceFile, html] of htmlCache) {
    const sourceRoute = routeForHtmlFile(sourceFile, outDir)
    for (const href of extractHrefs(html)) {
      const resolved = resolveInternalHref(href, sourceRoute)
      if (resolved === null) {
        externalOrIgnored += 1
        continue
      }
      if (resolved.error) {
        findings.push({ type: resolved.error, sourceRoute, href })
        continue
      }

      checkedLinks += 1
      const targetFile = resolveOutputFile(resolved.pathname, outDir)
      if (!targetFile) {
        findings.push({ type: 'missing_target', sourceRoute, href, pathname: resolved.pathname })
        continue
      }

      if (resolved.fragment && targetFile.endsWith('.html')) {
        checkedFragments += 1
        if (!anchorCache.has(targetFile)) {
          anchorCache.set(targetFile, extractAnchors(htmlCache.get(targetFile) ?? fs.readFileSync(targetFile, 'utf8')))
        }
        if (!anchorCache.get(targetFile).has(resolved.fragment)) {
          findings.push({
            type: 'missing_fragment',
            sourceRoute,
            href,
            pathname: resolved.pathname,
            fragment: resolved.fragment,
          })
        }
      }
    }
  }

  return {
    pages: htmlFiles.length,
    checkedLinks,
    checkedFragments,
    externalOrIgnored,
    findings,
  }
}

function runSelfTest() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hei-link-audit-'))
  try {
    fs.mkdirSync(path.join(tempDir, 'alpha'), { recursive: true })
    fs.mkdirSync(path.join(tempDir, 'beta'), { recursive: true })
    fs.mkdirSync(path.join(tempDir, 'feeds'), { recursive: true })
    fs.writeFileSync(path.join(tempDir, 'index.html'), '<a href="/alpha/">A</a><a href="https://example.com/x">X</a>')
    fs.writeFileSync(path.join(tempDir, 'alpha', 'index.html'), '<div id="point"></div><a href="../beta/#target">B</a>')
    fs.writeFileSync(path.join(tempDir, 'beta', 'index.html'), '<div id="target"></div><a href="/alpha/#point">A point</a>')
    fs.writeFileSync(path.join(tempDir, 'feeds', 'updates.xml'), '<rss></rss>')

    const result = auditInternalLinks(tempDir)
    assert(result.findings.length === 0, `self-test expected no findings: ${JSON.stringify(result.findings)}`)

    fs.writeFileSync(path.join(tempDir, 'beta', 'index.html'), '<a href="/missing/">Missing</a><a href="/alpha/#absent">Bad fragment</a>')
    const broken = auditInternalLinks(tempDir)
    assert(broken.findings.some((item) => item.type === 'missing_target'), 'self-test did not detect missing target')
    assert(broken.findings.some((item) => item.type === 'missing_fragment'), 'self-test did not detect missing fragment')
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }

  console.log('Internal link audit self-test passed.')
}

if (process.argv.includes('--self-test')) {
  runSelfTest()
} else {
  const result = auditInternalLinks()
  console.log(`Internal link audit: ${result.pages} pages, ${result.checkedLinks} internal links, ${result.checkedFragments} fragments, ${result.externalOrIgnored} external/ignored links.`)
  if (result.findings.length > 0) {
    for (const finding of result.findings) console.error(JSON.stringify(finding))
    throw new Error(`internal link audit found ${result.findings.length} broken links or fragments`)
  }
  console.log('Internal link audit passed with 0 findings.')
}
