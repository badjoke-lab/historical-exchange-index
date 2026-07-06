import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const outDir = path.join(root, 'out')
const origin = 'https://hei.badjoke-lab.com'

function assert(condition, message) {
  if (!condition) throw new Error(`Explorer final audit failed: ${message}`)
}

function read(relativePath) {
  const filePath = path.join(root, relativePath)
  assert(fs.existsSync(filePath), `missing ${relativePath}`)
  return fs.readFileSync(filePath, 'utf8')
}

function readOut(relativePath) {
  const filePath = path.join(outDir, relativePath)
  assert(fs.existsSync(filePath), `missing out/${relativePath}`)
  return fs.readFileSync(filePath, 'utf8')
}

function decode(value) {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
}

function hrefs(html) {
  return [...html.matchAll(/\bhref=["']([^"']+)["']/gi)].map((match) => decode(match[1]))
}

const contract = JSON.parse(read('config/explorer-query-contract.json'))
const entityKeys = new Set(contract.views.entities.parameters.map((parameter) => parameter.key))
const eventKeys = new Set(contract.views.events.parameters.map((parameter) => parameter.key))
const allowedViews = new Set(contract.view_parameter.values)

const exploreHtml = readOut(path.join('explore', 'index.html'))
const sitemap = readOut('sitemap.xml')
const robots = readOut('robots.txt')
const version = JSON.parse(readOut('version.json'))
const manifest = JSON.parse(readOut(path.join('data', 'manifest.json')))

assert(exploreHtml.includes('aria-label="Explorer views"'), 'Explorer view navigation lacks aria-label')
assert(exploreHtml.includes('aria-label="Search reviewed entities"'), 'Entity search input lacks accessible name')
assert(exploreHtml.includes('type="checkbox"'), 'Entity filter checkboxes are missing from generated Explorer output')
assert(exploreHtml.includes('<label'), 'Explorer filter controls lack label elements')
assert(exploreHtml.includes('<summary>'), 'Explorer filter groups are not native keyboard-operable details/summary controls')

const canonicalMatches = [...exploreHtml.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/gi)]
assert(canonicalMatches.length === 1, `Explorer canonical count is ${canonicalMatches.length}`)
assert(canonicalMatches[0][1] === `${origin}/explore/`, `Explorer canonical mismatch: ${canonicalMatches[0][1]}`)

const sitemapLocations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
assert(sitemapLocations.filter((url) => url === `${origin}/explore/`).length === 1, 'Explorer base route must appear exactly once in sitemap')
assert(!sitemapLocations.some((url) => url.includes('/explore/?') || url.includes('/explore?')), 'Explorer query variants must not appear in sitemap')
assert(robots.includes('Allow: /'), 'robots.txt must allow the Explorer base route through the site-wide allow rule')
assert(robots.includes(`${origin}/sitemap.xml`), 'robots.txt sitemap declaration mismatch')

assert(version.routes?.explorer === '/explore/', 'version.json route map missing Explorer')
assert(manifest.main_routes?.includes('/explore/'), 'manifest main_routes missing Explorer')
assert(manifest.data_safety?.canonical_only === true, 'manifest canonical_only boundary missing')
assert(manifest.data_safety?.includes_unreviewed_candidates === false, 'manifest exposes unreviewed candidates')

const sourcePages = [
  ['Stats', readOut(path.join('stats', 'index.html'))],
  ['Updates', readOut(path.join('updates', 'index.html'))],
  ['Incidents', readOut(path.join('incidents', 'index.html'))],
  ['Monthly', readOut(path.join('monthly', 'index.html'))],
]

let queryLinkCount = 0
for (const [label, html] of sourcePages) {
  const explorerLinks = hrefs(html).filter((href) => href.startsWith('/explore/?') || href.startsWith(`${origin}/explore/?`))
  assert(explorerLinks.length > 0, `${label} has no Explorer query links`)
  queryLinkCount += explorerLinks.length

  for (const href of explorerLinks) {
    const url = new URL(href, origin)
    const view = url.searchParams.get('view') ?? contract.view_parameter.default
    assert(allowedViews.has(view), `${label} link has invalid view=${view}`)
    const allowedKeys = view === 'events' ? eventKeys : entityKeys
    for (const key of url.searchParams.keys()) {
      if (key === 'view') continue
      assert(allowedKeys.has(key), `${label} link uses cross-view or unknown key ${key} for ${view}`)
    }
    assert(!url.searchParams.has('candidate_class'), `${label} link exposes candidate_class`)
    assert(!url.searchParams.has('risk_score'), `${label} link exposes risk_score`)
  }
}

const entitySource = read('src/components/explorer/entity-explorer-client.tsx')
const eventSource = read('src/components/explorer/event-explorer-panel.tsx')
const explorerCss = read('src/components/explorer/entity-explorer-client.module.css')

for (const marker of [
  'aria-label="Explorer views"',
  'aria-label="Search reviewed entities"',
  'aria-label="Archive availability"',
  'aria-label="Sort entities"',
  'aria-label="Country or origin values"',
  'type="date"',
  'type="checkbox"',
  'type="button"',
]) {
  assert(entitySource.includes(marker), `Entity Explorer accessibility marker missing: ${marker}`)
}

for (const marker of [
  'aria-label="Search reviewed events"',
  'aria-label="Sort events"',
  'type="date"',
  'type="checkbox"',
  'type="button"',
]) {
  assert(eventSource.includes(marker), `Event Explorer accessibility marker missing: ${marker}`)
}

assert(explorerCss.includes('@media(max-width:1023px)'), 'Explorer tablet responsive rule missing')
assert(explorerCss.includes('@media(max-width:720px)'), 'Explorer mobile responsive rule missing')
assert(entitySource.includes('serializeEntityExplorerState'), 'Entity URL serialization not wired to UI')
assert(eventSource.includes('serializeEventExplorerState'), 'Event URL serialization not wired to UI')
assert(entitySource.includes('getExplorerView'), 'Explorer view parser not wired to UI')
assert(!exploreHtml.includes('data-staging'), 'Explorer output leaks staging path')
assert(!exploreHtml.includes('candidate_class'), 'Explorer output leaks candidate fields')

console.log(`Explorer final audit passed: base route crawl policy fixed, ${queryLinkCount} Stats/Change query links validated, accessibility and mobile source contracts present.`)
