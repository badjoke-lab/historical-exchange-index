import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

function assert(condition, message) {
  if (!condition) throw new Error(`secondary page presentation test failed: ${message}`)
}

function readText(relativePath) {
  const absolutePath = path.join(root, relativePath)
  assert(fs.existsSync(absolutePath), `missing ${relativePath}`)
  return fs.readFileSync(absolutePath, 'utf8')
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

const requiredSurfaceFiles = [
  'src/app/dead/page.tsx',
  'src/app/active/page.tsx',
  'src/app/explore/page.tsx',
  'src/app/quality/page.tsx',
  'src/app/updates/page.tsx',
  'src/components/incidents/incident-timeline-page.tsx',
  'src/app/incidents/page.tsx',
  'src/app/incidents/page/[page]/page.tsx',
  'src/app/monthly/page.tsx',
  'src/app/about/page.tsx',
  'src/app/ja/dead/page.tsx',
  'src/app/ja/active/page.tsx',
  'src/app/ja/explore/page.tsx',
  'src/app/ja/stats/page.tsx',
  'src/app/ja/quality/page.tsx',
  'src/app/ja/updates/page.tsx',
  'src/app/ja/incidents/page.tsx',
  'src/app/ja/monthly/page.tsx',
  'src/app/ja/methodology/page.tsx',
  'src/app/ja/about/page.tsx',
]

for (const relativePath of requiredSurfaceFiles) readText(relativePath)

const incidentRenderer = readText('src/components/incidents/incident-timeline-page.tsx')
const incidentIndexRoute = readText('src/app/incidents/page.tsx')
const incidentPaginationRoute = readText('src/app/incidents/page/[page]/page.tsx')
assert(incidentRenderer.includes('getPagePresentation'), 'shared Incidents renderer is not presentation-backed')
assert(incidentIndexRoute.includes("page: 'incidents'"), 'Incidents index route does not use centralized incidents metadata')
assert(incidentPaginationRoute.includes('generateMetadata'), 'paginated Incidents route does not expose page-specific metadata')
assert(incidentPaginationRoute.includes('incidentPageHref(pageNumber)'), 'paginated Incidents route does not use the shared canonical route helper')

const methodologySource = readText('src/app/methodology/page.tsx')
const methodologyLayoutSource = readText('src/app/methodology/layout.tsx')
assert(methodologySource.includes('<h1'), 'English Methodology page must expose a page-specific h1')
assert(methodologyLayoutSource.includes("title: 'Methodology'"), 'English Methodology layout must retain centralized route metadata')

console.log(`Secondary page presentation structure passed for ${requiredPages.length} page families; runtime dictionaries, metadata, and rendered connectivity remain covered by their dedicated validators and public build.`)
