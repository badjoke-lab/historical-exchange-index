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
  ['incidents', 'src/app/incidents/page.tsx'],
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

const explore = read('src/app/explore/page.tsx')
assert(explore.includes('name: presentation.heading'), 'explore JSON-LD name is not presentation-backed')
assert(explore.includes('description: presentation.description'), 'explore JSON-LD description is not presentation-backed')

const updates = read('src/app/updates/page.tsx')
assert(updates.includes("'application/feed+json': '/feeds/updates.json'"), 'updates JSON Feed alternate was lost')
assert(updates.includes("'application/rss+xml': '/feeds/updates.xml'"), 'updates RSS alternate was lost')

const monthly = read('src/app/monthly/page.tsx')
assert(monthly.includes('{snapshot.monthLabel}'), 'monthly dynamic month heading was lost')
assert(monthly.includes('{presentation.heading}'), 'monthly localized page heading context missing')

console.log('Secondary page presentation connection tests passed: Explorer, Quality, Updates, Incidents, and Monthly verified.')
