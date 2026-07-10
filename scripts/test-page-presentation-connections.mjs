import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

function assert(condition, message) {
  if (!condition) throw new Error(`page presentation connection test failed: ${message}`)
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
}

const home = read('src/app/page.tsx')
const dead = read('src/app/dead/page.tsx')
const active = read('src/app/active/page.tsx')
const about = read('src/app/about/page.tsx')
const header = read('src/components/layout/localized-page-header.tsx')

assert(home.includes("getPagePresentation('en', 'home')"), 'home metadata is not connected to page presentation data')
assert(home.includes("buildLocalizedPageMetadata({"), 'home metadata helper connection missing')

for (const [name, source, pageKey] of [
  ['dead', dead, 'dead'],
  ['active', active, 'active'],
  ['about', about, 'about'],
]) {
  assert(source.includes(`getPagePresentation('en', '${pageKey}')`), `${name} presentation lookup missing`)
  assert(source.includes('buildLocalizedPageMetadata({'), `${name} localized metadata helper missing`)
  assert(source.includes('<LocalizedPageHeader'), `${name} shared localized page header missing`)
}

assert(dead.includes('name: presentation.heading'), 'dead JSON-LD name is not presentation-backed')
assert(dead.includes('description: presentation.description'), 'dead JSON-LD description is not presentation-backed')
assert(active.includes('name: presentation.heading'), 'active JSON-LD name is not presentation-backed')
assert(active.includes('description: presentation.description'), 'active JSON-LD description is not presentation-backed')

for (const field of ['presentation.eyebrow', 'presentation.heading', 'presentation.intro']) {
  assert(header.includes(field), `shared header missing ${field}`)
}

assert(!dead.includes('>Dead-side registry</h2>'), 'dead page still contains duplicated hardcoded page heading')
assert(!active.includes('>Active-side registry</h2>'), 'active page still contains duplicated hardcoded page heading')
assert(!about.includes('>Why Historical Exchange Index exists</h2>'), 'about page still contains duplicated hardcoded page heading')

console.log('Page presentation connection tests passed: home metadata plus dead, active, and about renderer connections verified.')
