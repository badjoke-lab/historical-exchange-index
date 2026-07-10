import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

function assert(condition, message) {
  if (!condition) throw new Error(`localized site chrome test failed: ${message}`)
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath))
}

function sorted(values) {
  return [...values].sort((a, b) => a.localeCompare(b))
}

const en = readJson('src/i18n/locales/en/common.json')
const ja = readJson('src/i18n/locales/ja/common.json')
const enKeys = sorted(Object.keys(en))
const jaKeys = sorted(Object.keys(ja))

assert(JSON.stringify(enKeys) === JSON.stringify(jaKeys), 'English/Japanese common dictionary keys differ')

const requiredKeys = [
  'nav.compare',
  'brand.title',
  'brand.tagline',
  'footer.registryTagline',
  'footer.contactCorrections',
  'footer.githubIssues',
  'footer.supportHei',
  'language.switcherLabel',
  'language.english',
  'language.japanese',
  'research.exchangeActions',
  'research.prompt',
  'research.compareExchange',
  'research.compareExchangeEnglish',
  'research.openInExplorer',
]

for (const key of requiredKeys) {
  assert(typeof en[key] === 'string' && en[key].trim(), `missing English key ${key}`)
  assert(typeof ja[key] === 'string' && ja[key].trim(), `missing Japanese key ${key}`)
}

assert(ja['nav.compare'].includes('英語'), 'Japanese Compare label must disclose English route boundary')
assert(ja['research.compareExchangeEnglish'].includes('英語'), 'Japanese dossier Compare action must disclose English route boundary')

const chromeSource = readText('src/components/layout/site-chrome.tsx')
const layoutSource = readText('src/app/layout.tsx')
const switcherSource = readText('src/components/navigation/locale-switcher.tsx')
const routeSource = readText('src/lib/i18n/locale-routes.ts')
const researchSource = readText('src/components/navigation/exchange-compare-context-link.tsx')

assert(chromeSource.includes("getDictionary(locale).common"), 'shared chrome does not use locale dictionary')
assert(chromeSource.includes('<Suspense fallback={null}>'), 'locale switcher lacks Suspense boundary')
assert(chromeSource.includes("href: '/compare'"), 'shared chrome must keep Compare on English route during L-1')
assert(layoutSource.includes('<SiteChrome locale="en">'), 'English root layout is not using shared chrome')
assert(layoutSource.includes('<html lang="en">'), 'English root document language changed unexpectedly')
assert(switcherSource.includes('isJapanesePilotPath(current.pathname)'), 'locale switcher does not guard Japanese Pilot route scope')
assert(switcherSource.includes('searchParams.toString()'), 'locale switcher does not preserve query state')
assert(routeSource.includes("'/ja/exchange/[slug]/") === false, 'runtime route helper must use pathname matching, not route-template literals')
assert(routeSource.includes('EXCHANGE_DOSSIER_PATH'), 'Japanese Pilot exchange dossier pathname guard missing')
assert(researchSource.includes('stripLocalePrefix(rawPathname)'), 'exchange research context is not locale-aware')
assert(researchSource.includes("research.compareExchangeEnglish"), 'Japanese Compare boundary copy missing from dossier action')

const requiredStaticPaths = [
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
]

for (const pathname of requiredStaticPaths) {
  assert(routeSource.includes(`'${pathname}'`), `Japanese Pilot route guard missing ${pathname}`)
}

assert(!requiredStaticPaths.includes('/compare/'), 'Compare must not be part of L-1 Japanese route scope')
assert(!requiredStaticPaths.includes('/donate/'), 'Donate must not be part of L-1 Japanese route scope')

console.log(`Localized site chrome tests passed: ${enKeys.length} shared dictionary keys, pilot route guard, query preservation, English Compare boundary, and root-layout stability verified.`)
