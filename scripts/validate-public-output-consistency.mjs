import fs from 'node:fs'
import path from 'node:path'
import { loadReviewedBundles, mergeRecords } from './lib/reviewed-bundle-aggregation.mjs'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'

const root = process.cwd()
const outDir = path.join(root, 'out')
const origin = 'https://hei.badjoke-lab.com'

function fail(message) { throw new Error(`public output validation failed: ${message}`) }
function assert(condition, message) { if (!condition) fail(message) }
function percent(count, total) { return total > 0 ? Math.round((count / total) * 100) : 0 }
function pad(value) { return String(value).padStart(2, '0') }
function previousCompletedUtcMonth(now = new Date()) {
  const previous = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))
  return `${previous.getUTCFullYear()}-${pad(previous.getUTCMonth() + 1)}`
}
function readJson(relativePath) {
  const filePath = path.join(root, relativePath)
  assert(fs.existsSync(filePath), `missing ${relativePath}`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}
function readOut(relativePath) {
  const filePath = path.join(outDir, relativePath)
  assert(fs.existsSync(filePath), `missing out/${relativePath}`)
  return fs.readFileSync(filePath, 'utf8')
}
function stripHtml(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
}
function assertTextCount(html, label, count, route) {
  const text = stripHtml(html)
  assert(text.includes(`${label} ${count}`), `${route} does not expose ${label} ${count} in static HTML`)
}
function assertTextValue(html, label, value, route) {
  const text = stripHtml(html)
  assert(text.includes(`${label} ${value}`), `${route} does not expose ${label} ${value} in static HTML`)
}
function assertCanonical(html, expected, route) {
  const escaped = expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  assert(new RegExp(`<link[^>]+rel=["']canonical["'][^>]+href=["']${escaped}["']`, 'i').test(html) || new RegExp(`<link[^>]+href=["']${escaped}["'][^>]+rel=["']canonical["']`, 'i').test(html), `${route} canonical link is missing or incorrect`)
}
function assertDiscovery(html, route) {
  assert(html.includes('/data/manifest.json'), `${route} is missing JSON discovery link`)
  assert(html.includes('/llms.txt'), `${route} is missing text discovery link`)
}
function walk(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(fullPath) : [fullPath]
  })
}

const canonicalEntities = readJson('data/entities.json')
const canonicalEvents = readJson('data/events.json')
const canonicalEvidence = readJson('data/evidence.json')
const { all: reviewedBundles, newEntityBundles, entityIdMap } = loadReviewedBundles(root, canonicalEntities)
const entities = [...applyReviewedEntityCorrections(canonicalEntities, reviewedBundles), ...newEntityBundles.map(({ bundle }) => bundle.entity)]
const events = mergeRecords(canonicalEvents, reviewedBundles, 'events', 'event', entityIdMap)
const evidence = mergeRecords(canonicalEvidence, reviewedBundles, 'evidence', 'evidence', entityIdMap)
const deadSideStatuses = new Set(['dead', 'merged', 'acquired', 'rebranded'])
const activeSideStatuses = new Set(['active', 'limited', 'inactive'])
const incidentEventTypes = new Set(['hack','exploit','withdrawal_suspended','deposit_suspended','trading_halted','service_outage','regulatory_action','lawsuit','bankruptcy_filed','insolvency_declared','shutdown_announced','shutdown_effective','chain_shutdown_impact'])
const monthlyEventTypes = new Set(['rebranded','acquired','merged','hack','exploit','withdrawal_suspended','deposit_suspended','trading_halted','service_outage','regulatory_action','lawsuit','bankruptcy_filed','insolvency_declared','shutdown_announced','shutdown_effective','reopened','token_migration','chain_shutdown_impact'])
const evidenceCountsByExchange = new Map()
const evidenceCountsByEvent = new Map()
for (const item of evidence) {
  evidenceCountsByExchange.set(item.exchange_id, (evidenceCountsByExchange.get(item.exchange_id) ?? 0) + 1)
  if (item.event_id) evidenceCountsByEvent.set(item.event_id, (evidenceCountsByEvent.get(item.event_id) ?? 0) + 1)
}
const archivedEntityCount = entities.filter((entity) => Boolean(entity.archived_url)).length
const highConfidenceEntityCount = entities.filter((entity) => entity.confidence === 'high').length
const highReliabilityEvidenceCount = evidence.filter((item) => item.reliability === 'high').length
const zeroEvidenceEntityCount = entities.filter((entity) => (evidenceCountsByExchange.get(entity.id) ?? 0) === 0).length
const monthlyMonth = previousCompletedUtcMonth()
const monthlyEvents = events.filter((event) => Boolean(event.event_date?.startsWith(monthlyMonth)) && monthlyEventTypes.has(event.event_type))
const expected = {
  total: entities.length,
  deadSide: entities.filter((entity) => deadSideStatuses.has(entity.status)).length,
  activeSide: entities.filter((entity) => activeSideStatuses.has(entity.status)).length,
  events: events.length,
  evidence: evidence.length,
  incidents: events.filter((event) => event.event_date && incidentEventTypes.has(event.event_type)).length,
  archiveCoverage: percent(archivedEntityCount, entities.length),
  highConfidenceShare: percent(highConfidenceEntityCount, entities.length),
  highReliabilityEvidenceShare: percent(highReliabilityEvidenceCount, evidence.length),
  zeroEvidenceEntities: zeroEvidenceEntityCount,
  monthlyMonth,
  monthlyEvents: monthlyEvents.length,
  monthlyAffectedExchanges: new Set(monthlyEvents.map((event) => event.exchange_id)).size,
  monthlyCriticalOrHigh: monthlyEvents.filter((event) => event.impact_level === 'critical' || event.impact_level === 'high').length,
  monthlyEventLinkedEvidence: monthlyEvents.reduce((sum, event) => sum + (evidenceCountsByEvent.get(event.id) ?? 0), 0),
}
assert(expected.deadSide + expected.activeSide === expected.total, 'active/dead-side counts do not cover all reviewed entities')

const home = readOut('index.html')
const dead = readOut(path.join('dead', 'index.html'))
const active = readOut(path.join('active', 'index.html'))
const explore = readOut(path.join('explore', 'index.html'))
const compare = readOut(path.join('compare', 'index.html'))
const stats = readOut(path.join('stats', 'index.html'))
const quality = readOut(path.join('quality', 'index.html'))
const updates = readOut(path.join('updates', 'index.html'))
const incidents = readOut(path.join('incidents', 'index.html'))
const monthly = readOut(path.join('monthly', 'index.html'))
const firstEntity = entities[0]
const detail = readOut(path.join('exchange', firstEntity.slug, 'index.html'))

assertTextCount(home, 'Total records', expected.total, '/')
assertTextCount(home, 'Dead-side', expected.deadSide, '/')
assertTextCount(home, 'Active-side', expected.activeSide, '/')
assertTextCount(dead, 'Dead-side total:', expected.deadSide, '/dead/')
assertTextCount(active, 'Active-side total:', expected.activeSide, '/active/')
assert(stripHtml(explore).includes('Explorer'), '/explore/ does not expose Explorer heading')
assert(stripHtml(compare).includes('Compare'), '/compare/ does not expose Compare heading')
assertTextCount(stats, 'Total entities', expected.total, '/stats/')
assertTextCount(stats, 'Dead-side', expected.deadSide, '/stats/')
assertTextCount(stats, 'Active-side', expected.activeSide, '/stats/')
assertTextCount(stats, 'Total events', expected.events, '/stats/')
assertTextCount(stats, 'Total evidence', expected.evidence, '/stats/')
assert(stripHtml(quality).includes('Evidence Health & Data Quality'), '/quality/ does not expose Evidence Health & Data Quality heading')
assertTextCount(quality, 'Entities', expected.total, '/quality/')
assertTextCount(quality, 'Events', expected.events, '/quality/')
assertTextCount(quality, 'Evidence', expected.evidence, '/quality/')
assertTextValue(quality, 'Entity archive coverage', `${expected.archiveCoverage}%`, '/quality/')
assertTextValue(quality, 'High-confidence entities', `${expected.highConfidenceShare}%`, '/quality/')
assertTextValue(quality, 'High-reliability evidence', `${expected.highReliabilityEvidenceShare}%`, '/quality/')
assertTextCount(quality, 'Entities with 0 evidence', expected.zeroEvidenceEntities, '/quality/')
assert(stripHtml(updates).includes('Registry Updates'), '/updates/ does not expose Registry Updates heading')
assert(stripHtml(incidents).includes('Exchange Incident Timeline'), '/incidents/ does not expose Exchange Incident Timeline heading')
assertTextCount(incidents, 'Timeline events', expected.incidents, '/incidents/')
assert(stripHtml(monthly).includes('Monthly Historical Exchange Snapshot'), '/monthly/ does not expose Monthly Historical Exchange Snapshot heading')
assert(stripHtml(monthly).includes(expected.monthlyMonth), `/monthly/ does not expose review month ${expected.monthlyMonth}`)
assertTextCount(monthly, 'Recorded events', expected.monthlyEvents, '/monthly/')
assertTextCount(monthly, 'Affected exchanges', expected.monthlyAffectedExchanges, '/monthly/')
assertTextCount(monthly, 'Critical / high', expected.monthlyCriticalOrHigh, '/monthly/')
assertTextCount(monthly, 'Event-linked evidence', expected.monthlyEventLinkedEvidence, '/monthly/')

for (const [route, html, canonical] of [
  ['/', home, `${origin}/`],
  ['/dead/', dead, `${origin}/dead/`],
  ['/active/', active, `${origin}/active/`],
  ['/explore/', explore, `${origin}/explore/`],
  ['/compare/', compare, `${origin}/compare/`],
  ['/stats/', stats, `${origin}/stats/`],
  ['/quality/', quality, `${origin}/quality/`],
  ['/updates/', updates, `${origin}/updates/`],
  ['/incidents/', incidents, `${origin}/incidents/`],
  ['/monthly/', monthly, `${origin}/monthly/`],
  [`/exchange/${firstEntity.slug}/`, detail, `${origin}/exchange/${firstEntity.slug}/`],
]) {
  assertCanonical(html, canonical, route)
  assertDiscovery(html, route)
  assert(!/\b(?:Total records|Total entities|Entities)\s+386\b/.test(stripHtml(html)), `${route} contains obsolete total count 386`)
}

assert(home.includes('"@type":"Dataset"') || home.includes('&quot;@type&quot;:&quot;Dataset&quot;'), 'home Dataset JSON-LD is missing')
assert(explore.includes('application/ld+json'), 'Explorer JSON-LD is missing')
assert(compare.includes('application/ld+json'), 'Compare JSON-LD is missing')
assert(detail.includes('application/ld+json'), 'detail JSON-LD is missing')

const version = JSON.parse(readOut('version.json'))
const manifest = JSON.parse(readOut(path.join('data', 'manifest.json')))
const publicEntities = JSON.parse(readOut(path.join('data', 'entities.json')))
const publicEvents = JSON.parse(readOut(path.join('data', 'events.json')))
const publicEvidence = JSON.parse(readOut(path.join('data', 'evidence.json')))
const llms = readOut('llms.txt')
const ai = readOut('ai.txt')

assert(version.data.record_counts.primary_records === expected.total, 'version entity count mismatch')
assert(version.data.record_counts.events === expected.events, 'version event count mismatch')
assert(version.data.record_counts.evidence === expected.evidence, 'version evidence count mismatch')
assert(version.data.record_count_breakdown.dead_side === expected.deadSide, 'version dead-side mismatch')
assert(version.data.record_count_breakdown.active_side === expected.activeSide, 'version active-side mismatch')
assert(version.routes.explorer === '/explore/', 'version route map is missing Explorer')
assert(version.routes.compare === '/compare/', 'version route map is missing Compare')
assert(version.routes.quality === '/quality/', 'version route map is missing quality')
assert(version.routes.incidents === '/incidents/', 'version route map is missing incidents')
assert(version.routes.monthly === '/monthly/', 'version route map is missing monthly')
assert(manifest.record_counts.primary_records === expected.total, 'manifest entity count mismatch')
assert(manifest.record_count_breakdown.dead_side === expected.deadSide, 'manifest dead-side mismatch')
assert(manifest.record_count_breakdown.active_side === expected.activeSide, 'manifest active-side mismatch')
assert(manifest.main_routes.includes('/explore/'), 'manifest main_routes is missing Explorer')
assert(manifest.main_routes.includes('/compare/'), 'manifest main_routes is missing Compare')
assert(manifest.main_routes.includes('/quality/'), 'manifest main_routes is missing quality')
assert(manifest.main_routes.includes('/incidents/'), 'manifest main_routes is missing incidents')
assert(manifest.main_routes.includes('/monthly/'), 'manifest main_routes is missing monthly')
assert(manifest.data_safety.canonical_only === true, 'manifest canonical_only must be true')
assert(manifest.data_safety.includes_unreviewed_candidates === false, 'manifest must exclude unreviewed candidates')

for (const [name, collection, count] of [['entities', publicEntities, expected.total], ['events', publicEvents, expected.events], ['evidence', publicEvidence, expected.evidence]]) {
  assert(collection.canonical_only === true, `${name} canonical_only must be true`)
  assert(collection.record_count === count, `${name} record_count mismatch`)
  assert(collection.records.length === count, `${name} records length mismatch`)
  assert(collection.generated_at === version.build.generated_at, `${name} generated_at mismatch`)
  assert(collection.records.every((record) => typeof record.canonical_page_url === 'string' && record.canonical_page_url.startsWith(`${origin}/exchange/`)), `${name} canonical_page_url is missing`)
  const serialized = JSON.stringify(collection)
  assert(!serialized.includes('candidate_class'), `${name} contains staging candidate fields`)
  assert(!serialized.includes('data-staging'), `${name} contains internal staging paths`)
}

assert(publicEntities.records.every((record) => record.last_verified_at && record.confidence), 'entity identification fields are incomplete')
assert(publicEvents.records.every((record) => record.confidence), 'event confidence is incomplete')
assert(publicEvidence.records.every((record) => record.reliability), 'evidence reliability is incomplete')

for (const endpoint of ['/version.json','/data/manifest.json','/data/entities.json','/data/events.json','/data/evidence.json','/llms.txt','/ai.txt']) {
  assert(Object.values(manifest.public_files).includes(endpoint), `manifest public_files is missing ${endpoint}`)
  assert(llms.includes(endpoint), `llms.txt is missing ${endpoint}`)
  assert(ai.includes(endpoint) || endpoint === '/ai.txt', `ai.txt is missing ${endpoint}`)
}
for (const [label, count] of [['Total records', expected.total],['Dead-side', expected.deadSide],['Active-side', expected.activeSide],['Events', expected.events],['Evidence', expected.evidence]]) {
  assert(llms.includes(`${label}: ${count}`), `llms.txt is missing ${label}: ${count}`)
  assert(ai.includes(`${label}: ${count}`), `ai.txt is missing ${label}: ${count}`)
}

const sitemap = readOut('sitemap.xml')
const sitemapLocations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
assert(sitemapLocations.length === entities.length + 13, `sitemap URL count mismatch: ${sitemapLocations.length}`)
assert(sitemapLocations.includes(`${origin}/explore/`), 'sitemap is missing /explore/')
assert(sitemapLocations.includes(`${origin}/compare/`), 'sitemap is missing /compare/')
assert(!sitemapLocations.some((url) => url.includes('?')), 'sitemap contains query variants')
assert(sitemapLocations.includes(`${origin}/quality/`), 'sitemap is missing /quality/')
assert(sitemapLocations.includes(`${origin}/updates/`), 'sitemap is missing /updates/')
assert(sitemapLocations.includes(`${origin}/incidents/`), 'sitemap is missing /incidents/')
assert(sitemapLocations.includes(`${origin}/monthly/`), 'sitemap is missing /monthly/')
for (const entity of entities) assert(sitemapLocations.includes(`${origin}/exchange/${entity.slug}/`), `sitemap missing ${entity.slug}`)
assert(!sitemap.includes('/all/'), 'sitemap includes obsolete /all/ route')
assert(!sitemap.includes('/registry/'), 'sitemap includes obsolete /registry/ route')
assert(!sitemap.includes('/exchanges/'), 'sitemap includes obsolete /exchanges/ route')

const robots = readOut('robots.txt')
assert(robots.includes(`${origin}/sitemap.xml`), 'robots.txt sitemap is incorrect')
const redirects = readOut('_redirects')
for (const obsolete of ['/index.html','/all','/registry','/exchanges']) assert(redirects.includes(`${obsolete} / 301`), `_redirects is missing ${obsolete}`)

const textFiles = walk(outDir).filter((filePath) => ['.html','.json','.txt','.xml'].includes(path.extname(filePath)))
const staleFiles = textFiles.filter((filePath) => /\b386\b/.test(fs.readFileSync(filePath, 'utf8')))
assert(staleFiles.length === 0, `obsolete count 386 found in ${staleFiles.map((filePath) => path.relative(root, filePath)).join(', ')}`)
for (const obsoleteDir of ['all','registry','exchanges']) assert(!fs.existsSync(path.join(outDir, obsoleteDir, 'index.html')), `obsolete route output still exists: /${obsoleteDir}/`)

console.log(`Validated public output consistency: ${expected.total} entities, ${expected.deadSide} dead-side, ${expected.activeSide} active-side, ${expected.events} events, ${expected.evidence} evidence, Explorer and Compare routes and crawl contracts checked.`)
