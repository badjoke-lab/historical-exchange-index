import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const selfTest = process.argv.includes('--self-test')
const SITE_URL = 'https://hei.badjoke-lab.com'

const JAPANESE_STATIC_PATHS = new Set([
  '/',
  '/dead/',
  '/active/',
  '/about/',
  '/methodology/',
  '/stats/',
  '/quality/',
  '/explore/',
  '/updates/',
  '/incidents/',
  '/monthly/',
  '/donate/',
])
const EXCHANGE_PATH = /^\/exchange\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/

function assert(condition, message) {
  if (!condition) throw new Error(`static HTML postprocess failed: ${message}`)
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function listHtmlFiles(directory) {
  const files = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...listHtmlFiles(absolute))
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(absolute)
  }
  return files
}

function pathnameForOutput(filePath, outRoot) {
  const relative = path.relative(outRoot, filePath).split(path.sep).join('/')
  if (relative === 'index.html') return '/'
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`
  return `/${relative}`
}

function baseEnglishPath(pathname) {
  if (pathname === '/ja/') return '/'
  if (pathname.startsWith('/ja/')) return `/${pathname.slice('/ja/'.length)}`
  return pathname
}

function hasJapaneseCounterpart(pathname) {
  const englishPath = baseEnglishPath(pathname)
  return JAPANESE_STATIC_PATHS.has(englishPath) || EXCHANGE_PATH.test(englishPath)
}

function localeAlternates(pathname) {
  if (!hasJapaneseCounterpart(pathname)) return null
  const englishPath = baseEnglishPath(pathname)
  const japanesePath = englishPath === '/' ? '/ja/' : `/ja${englishPath}`
  return {
    en: `${SITE_URL}${englishPath}`,
    ja: `${SITE_URL}${japanesePath}`,
    default: `${SITE_URL}${englishPath}`,
  }
}

function replaceOrInsertHeadTag(html, matcher, tag) {
  if (matcher.test(html)) return html.replace(matcher, tag)
  return html.replace('</head>', `${tag}</head>`)
}

function normalizePageHtml(html, pathname) {
  const canonicalUrl = `${SITE_URL}${pathname}`
  let output = replaceOrInsertHeadTag(
    html,
    /<link\s+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${canonicalUrl}"/>`,
  )
  output = replaceOrInsertHeadTag(
    output,
    /<meta\s+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${canonicalUrl}"/>`,
  )

  if (pathname !== '/') {
    const noSlashUrl = canonicalUrl.slice(0, -1)
    const noSlashPattern = new RegExp(`${escapeRegExp(noSlashUrl)}(?!/)`, 'g')
    output = output.replace(noSlashPattern, canonicalUrl)
  }

  const alternates = localeAlternates(pathname)
  if (alternates) {
    output = output.replace(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["'][^"']+["'][^>]*>/gi, '')
    const tags = [
      `<link rel="alternate" hreflang="en" href="${alternates.en}"/>`,
      `<link rel="alternate" hreflang="ja" href="${alternates.ja}"/>`,
      `<link rel="alternate" hreflang="x-default" href="${alternates.default}"/>`,
    ].join('')
    output = output.replace('</head>', `${tags}</head>`)
  }

  return output
}

function localizeJapaneseHtml(html) {
  let output = html
  output = output.replace(/<html\s+lang=["']en["']/i, '<html lang="ja"')
  output = output.replaceAll('"inLanguage":"en"', '"inLanguage":"ja"')
  return output
}

function runSelfTest() {
  const sample = '<html lang="en"><head><link rel="canonical" href="https://hei.badjoke-lab.com/exchange/demo"><meta property="og:url" content="https://hei.badjoke-lab.com/exchange/demo"></head><body><script>{"url":"https://hei.badjoke-lab.com/exchange/demo","inLanguage":"en"}</script></body></html>'
  const normalized = normalizePageHtml(sample, '/exchange/demo/')
  assert(normalized.includes('href="https://hei.badjoke-lab.com/exchange/demo/"'), 'canonical slash normalization failed')
  assert(normalized.includes('content="https://hei.badjoke-lab.com/exchange/demo/"'), 'Open Graph URL normalization failed')
  assert(normalized.includes('hreflang="ja" href="https://hei.badjoke-lab.com/ja/exchange/demo/"'), 'Japanese alternate injection failed')
  assert(normalized.includes('hreflang="x-default"'), 'x-default alternate injection failed')
  assert(normalized.includes('"url":"https://hei.badjoke-lab.com/exchange/demo/"'), 'structured URL normalization failed')
  assert(!normalized.includes('/exchange/demo//'), 'canonical normalization introduced a double slash')

  const localized = localizeJapaneseHtml(normalized)
  assert(localized.includes('<html lang="ja">'), 'html lang replacement failed')
  assert(localized.includes('"inLanguage":"ja"'), 'JSON-LD inLanguage replacement failed')

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hei-html-'))
  fs.mkdirSync(path.join(tempRoot, 'nested'))
  fs.writeFileSync(path.join(tempRoot, 'index.html'), sample)
  fs.writeFileSync(path.join(tempRoot, 'nested', 'index.html'), sample)
  assert(listHtmlFiles(tempRoot).length === 2, 'recursive HTML discovery failed')
  assert(pathnameForOutput(path.join(tempRoot, 'nested', 'index.html'), tempRoot) === '/nested/', 'output pathname resolution failed')
  fs.rmSync(tempRoot, { recursive: true, force: true })

  console.log('Static HTML postprocess self-test: pass')
}

if (selfTest) {
  runSelfTest()
  process.exit(0)
}

const outRoot = path.join(root, 'out')
const jaRoot = path.join(outRoot, 'ja')
assert(fs.existsSync(outRoot), 'out does not exist; static site was not built')
assert(fs.existsSync(jaRoot), 'out/ja does not exist; Japanese public route family was not built')
assert(fs.existsSync(path.join(jaRoot, 'index.html')), 'Japanese root output is missing')

const files = listHtmlFiles(outRoot)
assert(files.length > 0, 'no static HTML output files found')

let changed = 0
let japaneseFiles = 0
let routeFiles = 0
for (const filePath of files) {
  if (path.basename(filePath) !== 'index.html') continue
  routeFiles += 1
  const pathname = pathnameForOutput(filePath, outRoot)
  const before = fs.readFileSync(filePath, 'utf8')
  let after = normalizePageHtml(before, pathname)
  if (pathname.startsWith('/ja/')) {
    after = localizeJapaneseHtml(after)
    japaneseFiles += 1
    assert(/<html\s+lang=["']ja["']/i.test(after), `${path.relative(root, filePath)} still lacks html lang=ja`)
  }
  if (before !== after) {
    fs.writeFileSync(filePath, after)
    changed += 1
  }
}

assert(routeFiles > 0, 'no route index HTML files were found')
assert(japaneseFiles > 0, 'no Japanese HTML output files were found')
assert(changed > 0, 'no static HTML files required SEO or locale normalization')
console.log(`Postprocessed static route HTML: ${changed}/${routeFiles} files updated; Japanese files: ${japaneseFiles}.`)
