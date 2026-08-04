import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const selfTest = process.argv.includes('--self-test')
const SITE_ORIGIN = 'https://hei.badjoke-lab.com'

function assert(condition, message) {
  if (!condition) throw new Error(`static HTML postprocess failed: ${message}`)
}

function localizeJapaneseHtml(html) {
  let output = html
  output = output.replace(/<html\s+lang=["']en["']/i, '<html lang="ja"')
  output = output.replaceAll('"inLanguage":"en"', '"inLanguage":"ja"')
  return output
}

function normalizeCanonicalRouteUrls(html) {
  const routePattern = [
    'exchange/[a-z0-9]+(?:-[a-z0-9]+)*',
    'ja/exchange/[a-z0-9]+(?:-[a-z0-9]+)*',
    'compare',
    'dead',
    'active',
    'explore',
    'stats',
    'quality',
    'updates',
    'incidents',
    'monthly',
    'methodology',
    'about',
    'donate',
    'ja',
    'ja/(?:dead|active|explore|stats|quality|updates|incidents|monthly|methodology|about|donate)',
  ].join('|')
  const absoluteRoute = new RegExp(`(${SITE_ORIGIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/(?:${routePattern}))(?=["'<\\s])`, 'g')
  return html.replace(absoluteRoute, '$1/')
}

function ensureEnglishExchangeAlternates(html, relativePath) {
  const normalized = relativePath.replaceAll(path.sep, '/')
  const match = normalized.match(/^exchange\/([a-z0-9]+(?:-[a-z0-9]+)*)\/index\.html$/)
  if (!match) return html

  const slug = match[1]
  const canonical = `${SITE_ORIGIN}/exchange/${slug}/`
  const alternates = [
    `<link rel="alternate" hreflang="en" href="${canonical}"/>`,
    `<link rel="alternate" hreflang="ja" href="${SITE_ORIGIN}/ja/exchange/${slug}/"/>`,
    `<link rel="alternate" hreflang="x-default" href="${canonical}"/>`,
  ].join('')

  if (html.includes(`hreflang="ja" href="${SITE_ORIGIN}/ja/exchange/${slug}/"`)) return html
  return html.replace('</head>', `${alternates}</head>`)
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

function runSelfTest() {
  const sample = `<html lang="en"><head><link rel="canonical" href="${SITE_ORIGIN}/exchange/example"><meta property="og:url" content="${SITE_ORIGIN}/exchange/example"><script>{"url":"${SITE_ORIGIN}/exchange/example","item":"${SITE_ORIGIN}/dead"}</script></head><body><a hreflang="en">English</a></body></html>`
  const localized = localizeJapaneseHtml(sample.replace('<body>', '<body><script>{"inLanguage":"en"}</script>'))
  assert(localized.includes('<html lang="ja">'), 'html lang replacement failed')
  assert(localized.includes('"inLanguage":"ja"'), 'JSON-LD inLanguage replacement failed')
  assert(localized.includes('hreflang="en"'), 'existing hreflang must not be rewritten')

  const normalized = normalizeCanonicalRouteUrls(sample)
  assert(normalized.includes(`${SITE_ORIGIN}/exchange/example"`) === false, 'exchange URL still lacks trailing slash')
  assert(normalized.includes(`${SITE_ORIGIN}/dead"`) === false, 'section URL still lacks trailing slash')

  const withAlternates = ensureEnglishExchangeAlternates(normalized, 'exchange/example/index.html')
  assert(withAlternates.includes('hreflang="en"'), 'English alternate missing')
  assert(withAlternates.includes('hreflang="ja"'), 'Japanese alternate missing')
  assert(withAlternates.includes('hreflang="x-default"'), 'x-default alternate missing')

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hei-static-html-'))
  fs.mkdirSync(path.join(tempRoot, 'nested'))
  fs.writeFileSync(path.join(tempRoot, 'index.html'), sample)
  fs.writeFileSync(path.join(tempRoot, 'nested', 'index.html'), sample)
  assert(listHtmlFiles(tempRoot).length === 2, 'recursive HTML discovery failed')
  fs.rmSync(tempRoot, { recursive: true, force: true })

  console.log('Static HTML postprocess self-test: pass')
}

if (selfTest) {
  runSelfTest()
  process.exit(0)
}

const outRoot = path.join(root, 'out')
const jaRoot = path.join(outRoot, 'ja')
assert(fs.existsSync(jaRoot), 'out/ja does not exist; Japanese public route family was not built')
assert(fs.existsSync(path.join(jaRoot, 'index.html')), 'Japanese root output is missing')

const files = listHtmlFiles(outRoot)
assert(files.length > 0, 'no static HTML output files found')

let changed = 0
let japaneseFiles = 0
let englishExchangeFiles = 0
for (const filePath of files) {
  const relativePath = path.relative(outRoot, filePath)
  const before = fs.readFileSync(filePath, 'utf8')
  let after = normalizeCanonicalRouteUrls(before)

  if (relativePath === 'ja/index.html' || relativePath.startsWith(`ja${path.sep}`)) {
    after = localizeJapaneseHtml(after)
    japaneseFiles += 1
    assert(/<html\s+lang=["']ja["']/i.test(after), `${relativePath} still lacks html lang=ja`)
  }

  const alternateOutput = ensureEnglishExchangeAlternates(after, relativePath)
  if (alternateOutput !== after) englishExchangeFiles += 1
  after = alternateOutput

  if (before !== after) {
    fs.writeFileSync(filePath, after)
    changed += 1
  }
}

assert(japaneseFiles > 0, 'no Japanese HTML files were processed')
assert(englishExchangeFiles > 0, 'no English exchange detail files received reciprocal hreflang')
console.log(`Static HTML postprocess: ${changed}/${files.length} files updated; ${japaneseFiles} Japanese files; ${englishExchangeFiles} English exchange hreflang files.`)
