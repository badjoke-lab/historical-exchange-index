import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

function assert(condition, message) {
  if (!condition) throw new Error(`secondary page presentation test failed: ${message}`)
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
}

function hasPresentationConnection(source, locale, page) {
  const pattern = new RegExp(`getPagePresentation\\(\\s*['"]${locale}['"]\\s*,\\s*['"]${page}['"]\\s*\\)`)
  return pattern.test(source)
}

const presentations = readText('src/lib/i18n/page-presentations.ts')
const requiredPages = [
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
]

for (const page of requiredPages) {
  assert(presentations.includes(`'${page}'`), `presentation registry is missing ${page}`)
}
for (const field of ['title', 'description', 'heading', 'intro', 'eyebrow']) {
  assert(presentations.includes(`'${field}'`), `presentation field registry is missing ${field}`)
}
assert(presentations.includes('`page.${page}.${field}`'), 'presentation keys are not generated from page and field')

const englishRenderConnections = [
  ['src/app/dead/page.tsx', 'dead'],
  ['src/app/active/page.tsx', 'active'],
  ['src/app/explore/page.tsx', 'explore'],
  ['src/app/quality/page.tsx', 'quality'],
  ['src/app/updates/page.tsx', 'updates'],
  ['src/components/incidents/incident-timeline-page.tsx', 'incidents'],
  ['src/app/monthly/page.tsx', 'monthly'],
  ['src/app/about/page.tsx', 'about'],
]

for (const [relativePath, page] of englishRenderConnections) {
  const source = readText(relativePath)
  assert(hasPresentationConnection(source, 'en', page), `${relativePath} does not use the ${page} presentation`)
}

const incidentIndexRoute = readText('src/app/incidents/page.tsx')
const incidentPaginationRoute = readText('src/app/incidents/page/[page]/page.tsx')
assert(/page:\s*['"]incidents['"]/.test(incidentIndexRoute), 'Incidents index route does not use centralized incidents metadata')
assert(/export\s+async\s+function\s+generateMetadata/.test(incidentPaginationRoute), 'paginated Incidents route does not expose page-specific metadata')
assert(/incidentPageHref\(\s*pageNumber\s*\)/.test(incidentPaginationRoute), 'paginated Incidents route does not use the shared canonical route helper')

const japaneseConnections = [
  ['src/app/ja/dead/page.tsx', 'dead'],
  ['src/app/ja/active/page.tsx', 'active'],
  ['src/app/ja/explore/page.tsx', 'explore'],
  ['src/app/ja/stats/page.tsx', 'stats'],
  ['src/app/ja/quality/page.tsx', 'quality'],
  ['src/app/ja/updates/page.tsx', 'updates'],
  ['src/app/ja/incidents/page.tsx', 'incidents'],
  ['src/app/ja/monthly/page.tsx', 'monthly'],
  ['src/app/ja/methodology/page.tsx', 'methodology'],
  ['src/app/ja/about/page.tsx', 'about'],
]

for (const [relativePath, page] of japaneseConnections) {
  const source = readText(relativePath)
  assert(hasPresentationConnection(source, 'ja', page), `${relativePath} does not use Japanese ${page} presentation`)
}

const methodologySource = readText('src/app/methodology/page.tsx')
const methodologyLayoutSource = readText('src/app/methodology/layout.tsx')
assert(/<h1(?:\s|>)/.test(methodologySource), 'English Methodology page must expose a page-specific h1')
assert(/title:\s*['"]Methodology['"]/.test(methodologyLayoutSource), 'English Methodology layout must retain centralized route metadata')

console.log(`Secondary page presentation tests passed for ${requiredPages.length} page families; dictionary keys and metadata remain covered by their dedicated validators.`)
