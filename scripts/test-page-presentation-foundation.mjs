import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

function assert(condition, message) {
  if (!condition) throw new Error(`page presentation foundation test failed: ${message}`)
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
}

const pages = [
  'home',
  'dead',
  'active',
  'about',
  'methodology',
  'stats',
  'quality',
  'explore',
  'updates',
  'incidents',
  'monthly',
  'exchange',
]
const fields = ['title', 'description', 'eyebrow', 'heading', 'intro']
const en = readJson('src/i18n/locales/en/common.json')
const ja = readJson('src/i18n/locales/ja/common.json')

for (const page of pages) {
  for (const field of fields) {
    const key = `page.${page}.${field}`
    assert(typeof en[key] === 'string' && en[key].trim().length > 0, `missing English ${key}`)
    assert(typeof ja[key] === 'string' && ja[key].trim().length > 0, `missing Japanese ${key}`)
  }
}

for (const page of pages.filter((page) => page !== 'home')) {
  assert(en[`page.${page}.heading`] !== ja[`page.${page}.heading`], `Japanese heading unexpectedly matches English for ${page}`)
}

const helperSource = readText('src/lib/i18n/page-presentations.ts')
assert(helperSource.includes('PILOT_PAGE_KEYS'), 'typed pilot page key list missing')
assert(helperSource.includes('getPagePresentation'), 'page presentation accessor missing')
assert(helperSource.includes('buildLocalizedPageMetadata'), 'localized metadata helper missing')
assert(helperSource.includes('publicLocales.map'), 'metadata alternates are not derived from public locales')
assert(helperSource.includes('buildLocalePath(pathname, locale)'), 'canonical path is not locale-aware')
assert(helperSource.includes("locale === 'ja' ? 'ja_JP' : 'en_US'"), 'Open Graph locale mapping missing')

const routeContract = readJson('config/japanese-pilot-route-contract.json')
const expectedStaticPages = pages.filter((page) => !['exchange'].includes(page))
const pageToRoute = {
  home: '/ja/',
  dead: '/ja/dead/',
  active: '/ja/active/',
  about: '/ja/about/',
  methodology: '/ja/methodology/',
  stats: '/ja/stats/',
  quality: '/ja/quality/',
  explore: '/ja/explore/',
  updates: '/ja/updates/',
  incidents: '/ja/incidents/',
  monthly: '/ja/monthly/',
}

for (const page of expectedStaticPages) {
  assert(routeContract.required_static_routes.includes(pageToRoute[page]), `route contract missing page presentation route for ${page}`)
}
assert(routeContract.required_dynamic_route === '/ja/exchange/[slug]/', 'exchange page presentation lacks matching dynamic route contract')

console.log(`Page presentation foundation tests passed: ${pages.length} pilot surfaces × ${fields.length} required fields across English and Japanese.`)
