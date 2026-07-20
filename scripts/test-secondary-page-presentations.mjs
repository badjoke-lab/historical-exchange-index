import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

function assert(condition, message) {
  if (!condition) throw new Error(`secondary page presentation test failed: ${message}`)
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
}

function assertPresentationConnection(relativePath, locale, page) {
  const source = readText(relativePath)
  assert(source.includes('getPagePresentation'), `${relativePath} does not call getPagePresentation`)
  assert(
    source.includes(`'${locale}'`) || source.includes(`"${locale}"`),
    `${relativePath} does not reference locale ${locale}`,
  )
  assert(
    source.includes(`'${page}'`) || source.includes(`"${page}"`),
    `${relativePath} does not reference page presentation ${page}`,
  )
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
assert(presentations.includes('page.${page}.${field}'), 'presentation keys are not generated from page and field')

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
  assertPresentationConnection(relativePath, 'en', page)
}

const incidentIndexRoute = readText('src/app/incidents/page.tsx')
const incidentPaginationRoute = readText('src/app/incidents/page/[page]/page.tsx')
assert(incidentIndexRoute.includes("page: 'incidents'"), 'Incidents index route does not use centralized incidents metadata')
assert(incidentPaginationRoute.includes('generateMetadata'), 'paginated Incidents route does not expose page-specific metadata')
assert(incidentPaginationRoute.includes('incidentPageHref(pageNumber)'), 'paginated Incidents route does not use the shared canonical route helper')

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
  assertPresentationConnection(relativePath, 'ja', page)
}

const methodologySource = readText('src/app/methodology/page.tsx')
const methodologyLayoutSource = readText('src/app/methodology/layout.tsx')
assert(methodologySource.includes('<h1'), 'English Methodology page must expose a page-specific h1')
assert(methodologyLayoutSource.includes("title: 'Methodology'"), 'English Methodology layout must retain centralized route metadata')

console.log(`Secondary page presentation tests passed for ${requiredPages.length} page families; dictionary keys and metadata remain covered by their dedicated validators.`)
