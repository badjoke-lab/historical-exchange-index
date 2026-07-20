import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

function assert(condition, message) {
  if (!condition) throw new Error(`secondary page presentation connection test failed: ${message}`)
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
}

const cases = [
  ['explore', 'src/app/explore/page.tsx'],
  ['quality', 'src/app/quality/page.tsx'],
  ['updates', 'src/app/updates/page.tsx'],
  ['monthly', 'src/app/monthly/page.tsx'],
]

for (const [pageKey, relativePath] of cases) {
  const source = read(relativePath)
  assert(source.includes(`getPagePresentation('en', '${pageKey}')`), `${pageKey}: presentation lookup missing`)
  assert(source.includes('buildLocalizedPageMetadata({'), `${pageKey}: localized metadata helper missing`)
  assert(source.includes('presentation.eyebrow'), `${pageKey}: eyebrow is not presentation-backed`)
  assert(source.includes('presentation.heading'), `${pageKey}: heading is not presentation-backed`)
  assert(source.includes('presentation.intro'), `${pageKey}: intro is not presentation-backed`)
}

const incidentsRoute = read('src/app/incidents/page.tsx')
const incidentsRenderer = read('src/components/incidents/incident-timeline-page.tsx')
const incidentsPaginationRoute = read('src/app/incidents/page/[page]/page.tsx')
assert(incidentsRoute.includes("page: 'incidents'"), 'incidents: centralized index metadata missing')
assert(incidentsRenderer.includes("getPagePresentation('en', 'incidents')"), 'incidents: shared renderer presentation lookup missing')
assert(incidentsRenderer.includes('presentation.eyebrow'), 'incidents: eyebrow is not presentation-backed')
assert(incidentsRenderer.includes('presentation.heading'), 'incidents: heading is not presentation-backed')
assert(incidentsRenderer.includes('presentation.intro'), 'incidents: intro is not presentation-backed')
assert(incidentsPaginationRoute.includes('generateMetadata'), 'incidents: paginated metadata generator missing')
assert(incidentsPaginationRoute.includes('incidentPageHref(pageNumber)'), 'incidents: paginated canonical helper missing')

const explore = read('src/app/explore/page.tsx')
assert(explore.includes('name: presentation.heading'), 'explore JSON-LD name is not presentation-backed')
assert(explore.includes('description: presentation.description'), 'explore JSON-LD description is not presentation-backed')

const updates = read('src/app/updates/page.tsx')
assert(updates.includes("'application/feed+json': '/feeds/updates.json'"), 'updates JSON Feed alternate was lost')
assert(updates.includes("'application/rss+xml': '/feeds/updates.xml'"), 'updates RSS alternate was lost')

const monthly = read('src/app/monthly/page.tsx')
assert(monthly.includes('{snapshot.monthLabel}'), 'monthly dynamic month heading was lost')
assert(monthly.includes('{presentation.heading}'), 'monthly localized page heading context missing')

console.log('Secondary page presentation connection tests passed: Explorer, Quality, Updates, split Incidents, and Monthly verified.')
