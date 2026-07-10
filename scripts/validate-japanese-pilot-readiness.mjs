import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const selfTest = process.argv.includes('--self-test')

function assert(condition, message) {
  if (!condition) throw new Error(`Japanese Pilot readiness validation failed: ${message}`)
}

function readJson(relativePath) {
  const filePath = path.join(root, relativePath)
  assert(fs.existsSync(filePath), `missing ${relativePath}`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function normalizeRoute(route) {
  assert(typeof route === 'string' && route.startsWith('/'), `invalid route: ${route}`)
  if (route === '/') return '/'
  return route.endsWith('/') ? route : `${route}/`
}

function routeToOutFile(route) {
  const normalized = normalizeRoute(route)
  if (normalized === '/') return path.join(root, 'out', 'index.html')
  return path.join(root, 'out', normalized.slice(1), 'index.html')
}

function hasHtmlLang(html, lang) {
  return new RegExp(`<html[^>]*\\blang=["']${lang}["']`, 'i').test(html)
}

function hasCanonical(html, href) {
  const tags = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0])
  return tags.some((tag) => /\brel=["']canonical["']/i.test(tag) && tag.includes(`href="${href}"`) || /\brel=["']canonical["']/i.test(tag) && tag.includes(`href='${href}'`))
}

function hasHreflang(html, locale) {
  const tags = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0])
  return tags.some((tag) => new RegExp(`\\bhreflang=["']${locale}["']`, 'i').test(tag) && /\brel=["']alternate["']/i.test(tag))
}

function hasOgLocale(html, locale) {
  const tags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0])
  return tags.some((tag) => /\bproperty=["']og:locale["']/i.test(tag) && new RegExp(`\\bcontent=["']${locale}["']`, 'i').test(tag))
}

function countExchangeDetailPages(exchangeRoot) {
  if (!fs.existsSync(exchangeRoot)) return 0
  return fs.readdirSync(exchangeRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(exchangeRoot, entry.name, 'index.html')))
    .length
}

function runSelfTest() {
  assert(normalizeRoute('/ja') === '/ja/', 'route normalization failed')
  assert(normalizeRoute('/ja/dead/') === '/ja/dead/', 'normalized route changed unexpectedly')
  assert(routeToOutFile('/ja/').endsWith(path.join('out', 'ja', 'index.html')), 'Japanese root output mapping failed')
  assert(routeToOutFile('/ja/dead/').endsWith(path.join('out', 'ja', 'dead', 'index.html')), 'Japanese nested output mapping failed')

  const sample = '<html lang="ja"><head><link rel="canonical" href="https://hei.badjoke-lab.com/ja/"><link rel="alternate" hreflang="en" href="https://hei.badjoke-lab.com/"><link rel="alternate" hreflang="ja" href="https://hei.badjoke-lab.com/ja/"><meta property="og:locale" content="ja_JP"></head></html>'
  assert(hasHtmlLang(sample, 'ja'), 'HTML lang detection failed')
  assert(hasCanonical(sample, 'https://hei.badjoke-lab.com/ja/'), 'canonical detection failed')
  assert(hasHreflang(sample, 'en') && hasHreflang(sample, 'ja'), 'hreflang detection failed')
  assert(hasOgLocale(sample, 'ja_JP'), 'Open Graph locale detection failed')

  console.log('Japanese Pilot readiness self-test: pass')
}

if (selfTest) {
  runSelfTest()
  process.exit(0)
}

const contract = readJson('config/japanese-pilot-route-contract.json')
const localeConfig = readJson('config/i18n-locales.json')

assert(contract.version === 1, 'contract version must be 1')
assert(contract.locale === 'ja', 'pilot locale must be ja')
assert(contract.path_prefix === '/ja/', 'pilot path prefix must be /ja/')
assert(contract.minimum_reviewed_entities >= 750, 'minimum reviewed entity gate must be at least 750')
assert(Array.isArray(contract.required_static_routes) && contract.required_static_routes.length === 11, 'required static route set must contain 11 routes')
assert(new Set(contract.required_static_routes).size === contract.required_static_routes.length, 'required static routes contain duplicates')
assert(contract.required_static_routes.every((route) => normalizeRoute(route).startsWith('/ja/')), 'all required static routes must use /ja/ prefix')
assert(contract.required_dynamic_route === '/ja/exchange/[slug]/', 'dynamic exchange route contract mismatch')
assert(contract.representative_exchange_slug, 'representative exchange slug is required')
assert(fs.existsSync(path.join(root, contract.completion_audit_path)), 'D-750 completion audit is missing')

assert(localeConfig.default_locale === contract.fallback.default_locale, 'default locale mismatch')
assert(localeConfig.fallback_locale === contract.fallback.record_copy_fallback, 'record-copy fallback mismatch')
assert(localeConfig.supported_locales.includes(contract.locale), 'Japanese locale is not supported')
assert(localeConfig.pilot_locales.includes(contract.locale), 'Japanese locale is not registered as pilot')

const activated = localeConfig.public_locales.includes(contract.locale)
const jaOutputRoot = path.join(root, 'out', 'ja')

if (!activated) {
  assert(!fs.existsSync(path.join(jaOutputRoot, 'index.html')), 'Japanese root was built before pilot activation')
  console.log(`Japanese Pilot readiness: pre-activation pass; ${contract.required_static_routes.length} static routes + exchange dossier family remain gated.`)
  process.exit(0)
}

const manifest = readJson('out/data/manifest.json')
const reviewedEntities = manifest?.record_counts?.primary_records
assert(Number.isInteger(reviewedEntities), 'built manifest reviewed entity count is missing')
assert(reviewedEntities >= contract.minimum_reviewed_entities, `reviewed entity gate not met: ${reviewedEntities}`)

for (const route of contract.required_static_routes) {
  const filePath = routeToOutFile(route)
  assert(fs.existsSync(filePath), `missing built Japanese route: ${route}`)
}

const representativeRoute = `/ja/exchange/${contract.representative_exchange_slug}/`
const representativeFile = routeToOutFile(representativeRoute)
assert(fs.existsSync(representativeFile), `missing representative Japanese exchange route: ${representativeRoute}`)

const jaExchangeRoot = path.join(root, 'out', 'ja', 'exchange')
const jaDetailPages = countExchangeDetailPages(jaExchangeRoot)
assert(jaDetailPages === reviewedEntities, `Japanese exchange detail route count mismatch: ${jaDetailPages} != ${reviewedEntities}`)

const representativeChecks = [
  { route: '/ja/', file: routeToOutFile('/ja/') },
  { route: '/ja/methodology/', file: routeToOutFile('/ja/methodology/') },
  { route: representativeRoute, file: representativeFile },
]

for (const item of representativeChecks) {
  const html = fs.readFileSync(item.file, 'utf8')
  const canonical = `https://hei.badjoke-lab.com${item.route}`
  assert(hasHtmlLang(html, contract.required_metadata.html_lang), `${item.route}: html lang is not ja`)
  assert(hasCanonical(html, canonical), `${item.route}: canonical mismatch`)
  for (const locale of contract.required_metadata.alternate_locales) {
    assert(hasHreflang(html, locale), `${item.route}: missing hreflang ${locale}`)
  }
  assert(hasOgLocale(html, contract.required_metadata.og_locale), `${item.route}: Open Graph locale mismatch`)
}

const sitemapPath = path.join(root, 'out', 'sitemap.xml')
assert(fs.existsSync(sitemapPath), 'missing built sitemap')
const sitemap = fs.readFileSync(sitemapPath, 'utf8')
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
assert(!locations.some((location) => location.includes('?')), 'sitemap contains query variants')

for (const route of contract.required_static_routes) {
  assert(locations.includes(`https://hei.badjoke-lab.com${route}`), `sitemap missing Japanese route: ${route}`)
}

const jaEntityLocations = locations.filter((location) => location.includes('/ja/exchange/'))
assert(jaEntityLocations.length === reviewedEntities, `Japanese sitemap entity route count mismatch: ${jaEntityLocations.length} != ${reviewedEntities}`)

console.log(`Japanese Pilot readiness: public activation pass; ${reviewedEntities} reviewed entities, ${contract.required_static_routes.length} static Japanese routes, ${jaDetailPages} Japanese dossier routes.`)
