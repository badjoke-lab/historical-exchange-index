import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

function assert(condition, message) {
  if (!condition) throw new Error(`secondary page presentation test failed: ${message}`)
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
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
  assert(presentations.includes(`'page.${page}.title'`), `metadata title connection is missing for ${page}`)
  assert(presentations.includes(`'page.${page}.description'`), `metadata description connection is missing for ${page}`)
  assert(presentations.includes(`'page.${page}.heading'`), `heading connection is missing for ${page}`)
  assert(presentations.includes(`'page.${page}.intro'`), `intro connection is missing for ${page}`)
  assert(presentations.includes(`'page.${page}.eyebrow'`), `eyebrow connection is missing for ${page}`)
}

const pageConnections = [
  ['src/app/dead/page.tsx', 'dead'],
  ['src/app/active/page.tsx', 'active'],
  ['src/app/explore/page.tsx', 'explore'],
  ['src/app/quality/page.tsx', 'quality'],
  ['src/app/updates/page.tsx', 'updates'],
  ['src/components/incidents/incident-timeline-page.tsx', 'incidents'],
  ['src/app/monthly/page.tsx', 'monthly'],
  ['src/app/about/page.tsx', 'about'],
]

for (const [relativePath, page] of pageConnections) {
  const source = readText(relativePath)
  assert(source.includes(`getPagePresentation('en', '${page}')`), `${relativePath} does not use the ${page} presentation`)
  assert(source.includes(`page: '${page}'`), `${relativePath} does not use centralized ${page} metadata`)
}

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
  assert(source.includes(`getPagePresentation('ja', '${page}')`), `${relativePath} does not use Japanese ${page} presentation`)
  assert(source.includes(`page: '${page}'`), `${relativePath} does not use centralized Japanese ${page} metadata`)
}

const methodologySource = readText('src/app/methodology/page.tsx')
const methodologyLayoutSource = readText('src/app/methodology/layout.tsx')
assert(methodologySource.includes('<h1'), 'English Methodology page must expose a page-specific h1')
assert(methodologyLayoutSource.includes("title: 'Methodology'"), 'English Methodology layout must retain centralized route metadata')

console.log(`Secondary page presentation tests passed for ${requiredPages.length} page families, including shared Incidents rendering.`)
