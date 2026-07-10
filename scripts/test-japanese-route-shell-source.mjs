import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

function assert(condition, message) {
  if (!condition) throw new Error(`Japanese route shell source test failed: ${message}`)
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath))
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
}

const staticRoutes = [
  'src/app/ja/page.tsx',
  'src/app/ja/dead/page.tsx',
  'src/app/ja/active/page.tsx',
  'src/app/ja/about/page.tsx',
  'src/app/ja/methodology/page.tsx',
  'src/app/ja/stats/page.tsx',
  'src/app/ja/quality/page.tsx',
  'src/app/ja/explore/page.tsx',
  'src/app/ja/updates/page.tsx',
  'src/app/ja/incidents/page.tsx',
  'src/app/ja/monthly/page.tsx',
]

for (const route of staticRoutes) assert(exists(route), `missing route source ${route}`)
assert(exists('src/app/ja/exchange/[slug]/page.tsx'), 'missing Japanese exchange dossier route source')

const config = JSON.parse(read('config/i18n-locales.json'))
assert(config.public_locales.includes('en'), 'English public locale missing')
assert(config.public_locales.includes('ja'), 'Japanese public pilot locale missing')
assert(config.pilot_locales.includes('ja'), 'Japanese pilot marker missing')

const layout = read('src/app/layout.tsx')
const localeChrome = read('src/components/layout/locale-aware-site-chrome.tsx')
const dossier = read('src/app/ja/exchange/[slug]/page.tsx')
const sitemap = read('src/app/sitemap.ts')
const packageJson = JSON.parse(read('package.json'))
const staticHtml = read('scripts/localize-static-html.mjs')

assert(layout.includes('<LocaleAwareSiteChrome>'), 'root layout is not using locale-aware site chrome')
assert(localeChrome.includes('stripLocalePrefix(pathname)'), 'locale-aware chrome does not derive locale from pathname')
assert(dossier.includes('generateStaticParams()'), 'Japanese dossier route does not statically enumerate reviewed entities')
assert(dossier.includes('loadEntities().map'), 'Japanese dossier route params are not derived from canonical entities')
assert(dossier.includes('safeOriginalUrl'), 'Japanese dossier route lacks URL safety helper')
assert(dossier.includes('entity.archived_url'), 'Japanese dossier route lacks archive-first access path')
assert(sitemap.includes('japaneseStaticPaths'), 'Japanese static sitemap routes missing')
assert(sitemap.includes('japaneseEntityRoutes'), 'Japanese dossier sitemap routes missing')
assert(packageJson.scripts.build.includes('localize-static-html.mjs'), 'build does not run Japanese HTML language postprocessor')
assert(staticHtml.includes('out', 'ja'), 'static HTML postprocessor does not target Japanese output')
assert(staticHtml.includes('lang="ja"'), 'static HTML postprocessor lacks Japanese language output contract')

console.log(`Japanese route shell source tests passed: ${staticRoutes.length} static routes, dynamic dossier family, public locale activation, sitemap, chrome, and static HTML contract verified.`)
