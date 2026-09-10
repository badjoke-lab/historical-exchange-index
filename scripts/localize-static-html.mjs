import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const selfTest = process.argv.includes('--self-test')
const canonicalOrigin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://hei.badjoke-lab.com').replace(/\/$/, '')

function assert(condition, message) {
  if (!condition) throw new Error(`static locale postprocess failed: ${message}`)
}

function localizeJapaneseHtml(html) {
  let output = html
  output = output.replace(/<html\s+lang=["']en["']/i, '<html lang="ja"')
  output = output.replaceAll('"inLanguage":"en"', '"inLanguage":"ja"')
  return output
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

function routeFromOutputFile(filePath, outRoot) {
  const relative = path.relative(outRoot, filePath).split(path.sep).join('/')
  if (relative === 'index.html') return '/'
  if (!relative.endsWith('/index.html')) return null
  return `/${relative.slice(0, -'index.html'.length)}`
}

function localizedRoutePair(route) {
  if (!route) return null
  if (route === '/ja/') return { en: '/', ja: '/ja/' }
  if (route.startsWith('/ja/')) return { en: route.slice(3), ja: route }
  if (route === '/') return { en: '/', ja: '/ja/' }
  return { en: route, ja: `/ja${route}` }
}

function routeToOutputFile(route, outRoot) {
  if (route === '/') return path.join(outRoot, 'index.html')
  const relative = route.replace(/^\//, '').replace(/\/$/, '')
  return path.join(outRoot, relative, 'index.html')
}

function ensureLocaleAlternates(html, pair) {
  if (!pair) return html

  let output = html
  const tags = [
    ['en', `${canonicalOrigin}${pair.en}`],
    ['ja', `${canonicalOrigin}${pair.ja}`],
  ]

  const additions = []
  for (const [locale, href] of tags) {
    const hasLocale = new RegExp(`hreflang=["']${locale}["']`, 'i').test(output)
    if (!hasLocale) additions.push(`<link rel="alternate" hreflang="${locale}" href="${href}"/>`)
  }

  if (additions.length > 0) {
    assert(/<\/head>/i.test(output), 'cannot inject hreflang without a closing head tag')
    output = output.replace(/<\/head>/i, `${additions.join('')}</head>`)
  }

  return output
}

function runSelfTest() {
  const sample = '<html lang="en"><head></head><body><script>{"inLanguage":"en"}</script><a hreflang="en">English</a></body></html>'
  const localized = localizeJapaneseHtml(sample)
  assert(localized.includes('<html lang="ja">'), 'html lang replacement failed')
  assert(localized.includes('"inLanguage":"ja"'), 'JSON-LD inLanguage replacement failed')
  assert(localized.includes('hreflang="en"'), 'existing hreflang must not be rewritten')

  const withAlternates = ensureLocaleAlternates('<html lang="en"><head></head><body></body></html>', {
    en: '/stats/',
    ja: '/ja/stats/',
  })
  assert(withAlternates.includes(`hreflang="en" href="${canonicalOrigin}/stats/"`), 'English hreflang injection failed')
  assert(withAlternates.includes(`hreflang="ja" href="${canonicalOrigin}/ja/stats/"`), 'Japanese hreflang injection failed')
  const idempotent = ensureLocaleAlternates(withAlternates, { en: '/stats/', ja: '/ja/stats/' })
  assert(idempotent === withAlternates, 'hreflang injection must be idempotent')

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hei-ja-html-'))
  fs.mkdirSync(path.join(tempRoot, 'nested'))
  fs.writeFileSync(path.join(tempRoot, 'index.html'), sample)
  fs.writeFileSync(path.join(tempRoot, 'nested', 'index.html'), sample)
  assert(listHtmlFiles(tempRoot).length === 2, 'recursive HTML discovery failed')
  assert(routeFromOutputFile(path.join(tempRoot, 'index.html'), tempRoot) === '/', 'root route mapping failed')
  assert(routeFromOutputFile(path.join(tempRoot, 'nested', 'index.html'), tempRoot) === '/nested/', 'nested route mapping failed')
  fs.rmSync(tempRoot, { recursive: true, force: true })

  console.log('Static locale postprocess self-test: pass')
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

const japaneseFiles = listHtmlFiles(jaRoot)
assert(japaneseFiles.length > 0, 'no Japanese HTML output files found')

let localizedChanged = 0
for (const filePath of japaneseFiles) {
  const before = fs.readFileSync(filePath, 'utf8')
  const after = localizeJapaneseHtml(before)
  assert(/<html\s+lang=["']ja["']/i.test(after), `${path.relative(root, filePath)} still lacks html lang=ja`)
  if (before !== after) {
    fs.writeFileSync(filePath, after)
    localizedChanged += 1
  }
}

assert(localizedChanged > 0, 'no Japanese HTML files required localization; verify build contract before removing this postprocessor')

const allFiles = listHtmlFiles(outRoot)
let alternateChanged = 0
let reciprocalPairs = 0
for (const filePath of allFiles) {
  const route = routeFromOutputFile(filePath, outRoot)
  const pair = localizedRoutePair(route)
  if (!pair) continue

  const enFile = routeToOutputFile(pair.en, outRoot)
  const jaFile = routeToOutputFile(pair.ja, outRoot)
  if (!fs.existsSync(enFile) || !fs.existsSync(jaFile)) continue

  reciprocalPairs += 1
  const before = fs.readFileSync(filePath, 'utf8')
  const after = ensureLocaleAlternates(before, pair)
  assert(/hreflang=["']en["']/i.test(after), `${path.relative(root, filePath)} lacks reciprocal hreflang=en`)
  assert(/hreflang=["']ja["']/i.test(after), `${path.relative(root, filePath)} lacks reciprocal hreflang=ja`)
  if (before !== after) {
    fs.writeFileSync(filePath, after)
    alternateChanged += 1
  }
}

assert(reciprocalPairs > 0, 'no reciprocal English/Japanese route pairs were found')
console.log(`Localized Japanese static HTML: ${localizedChanged}/${japaneseFiles.length} files updated.`)
console.log(`Ensured reciprocal locale alternates: ${reciprocalPairs} route outputs checked, ${alternateChanged} files updated.`)
