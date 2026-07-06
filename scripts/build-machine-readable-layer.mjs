import fs from 'node:fs'
import path from 'node:path'
import { buildBundleEntityIdMap, loadReviewedBundles, mergeRecords } from './lib/reviewed-bundle-aggregation.mjs'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'
import { buildReviewedUpdateFeeds } from './lib/reviewed-update-feeds.mjs'

const root = process.cwd()
const publicDir = path.join(root, 'public')
const canonicalOrigin = 'https://hei.badjoke-lab.com'
const mainRoutes = ['/', '/dead/', '/active/', '/exchange/{slug}/', '/stats/', '/quality/', '/updates/', '/incidents/', '/monthly/', '/methodology/', '/about/', '/donate/']

function readJson(relativePath, fallback = []) {
  const filePath = path.join(root, relativePath)
  return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : fallback
}

function countBy(items, key) {
  return items.reduce((counts, item) => {
    const value = item[key] ?? 'unknown'
    counts[value] = (counts[value] ?? 0) + 1
    return counts
  }, {})
}

function latestReviewedAt(entities) {
  return entities.map((entity) => entity.last_verified_at)
    .filter((value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value))
    .sort().at(-1) ?? null
}

function writeJson(relativePath, value) {
  const filePath = path.join(publicDir, relativePath)
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

function writeText(relativePath, value) {
  const filePath = path.join(publicDir, relativePath)
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, `${value.trimEnd()}\n`, 'utf8')
}

const canonicalEntities = readJson('data/entities.json')
const canonicalEvents = readJson('data/events.json')
const canonicalEvidence = readJson('data/evidence.json')
const registryUpdateFile = readJson('data/registry-updates.json', { version: 1, updates: [] })
const reviewedUpdateFeeds = buildReviewedUpdateFeeds(registryUpdateFile, { origin: canonicalOrigin })
const { all: reviewedBundles, newEntityBundles } = loadReviewedBundles(root, canonicalEntities)
const correctedCanonicalEntities = applyReviewedEntityCorrections(canonicalEntities, reviewedBundles)
const entities = [...correctedCanonicalEntities, ...newEntityBundles.map(({ bundle }) => bundle.entity)]
const bundleEntityIdMap = buildBundleEntityIdMap(correctedCanonicalEntities, reviewedBundles)
const events = mergeRecords(canonicalEvents, reviewedBundles, 'events', 'event')
const evidence = mergeRecords(canonicalEvidence, reviewedBundles, 'evidence', 'evidence')
const generatedAt = new Date().toISOString()
const recordsLastReviewedAt = latestReviewedAt(entities)
const activeSide = new Set(['active', 'limited', 'inactive'])
const deadSide = new Set(['dead', 'merged', 'acquired', 'rebranded'])
const entityById = new Map(entities.map((entity) => [entity.id, entity]))
const canonicalExchangeId = (exchangeId) => bundleEntityIdMap.get(exchangeId) ?? exchangeId
const canonicalPageUrl = (exchangeId) => {
  const entity = entityById.get(canonicalExchangeId(exchangeId))
  return entity ? `${canonicalOrigin}/exchange/${entity.slug}/` : null
}
const publicEntities = entities.map((entity) => ({
  ...entity,
  record_type: 'exchange_entity',
  canonical_page_url: `${canonicalOrigin}/exchange/${entity.slug}/`,
}))
const publicEvents = events.map((event) => {
  const exchangeId = canonicalExchangeId(event.exchange_id)
  return {
    ...event,
    exchange_id: exchangeId,
    record_type: 'exchange_event',
    exchange_slug: entityById.get(exchangeId)?.slug ?? null,
    canonical_page_url: canonicalPageUrl(exchangeId),
  }
})
const publicEvidence = evidence.map((item) => {
  const exchangeId = canonicalExchangeId(item.exchange_id)
  return {
    ...item,
    exchange_id: exchangeId,
    record_type: 'exchange_evidence',
    exchange_slug: entityById.get(exchangeId)?.slug ?? null,
    canonical_page_url: canonicalPageUrl(exchangeId),
  }
})
const recordCounts = { primary_records: entities.length, events: events.length, evidence: evidence.length }
const recordCountBreakdown = {
  exchanges: entities.length,
  active_side: entities.filter((entity) => activeSide.has(entity.status)).length,
  dead_side: entities.filter((entity) => deadSide.has(entity.status)).length,
  status: countBy(entities, 'status'),
  type: countBy(entities, 'type'),
}
const dataSafety = {
  canonical_only: true,
  includes_unreviewed_candidates: false,
  includes_internal_monitoring: false,
  includes_private_notes: false,
}
const project = {
  schema_version: '1.0.0',
  project_id: 'historical-exchange-index',
  site_name: 'Historical Exchange Index',
  registry_family: 'badjoke-lab-ledger-series',
  registry_type: 'historical_crypto_exchange_registry',
  data_schema_version: 'hei_entity_event_evidence_v1',
  verification_marker: 'hei_machine_readable_layer_v1',
}
const commit = process.env.CF_PAGES_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || 'unknown'
const branch = process.env.CF_PAGES_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.GITHUB_REF_NAME || 'main'
const publicFiles = {
  version: '/version.json',
  manifest: '/data/manifest.json',
  entities: '/data/entities.json',
  events: '/data/events.json',
  evidence: '/data/evidence.json',
  updates_json_feed: '/feeds/updates.json',
  updates_rss_feed: '/feeds/updates.xml',
  llms: '/llms.txt',
  ai: '/ai.txt',
}

writeJson('version.json', {
  schema_version: project.schema_version,
  project_id: project.project_id,
  site_name: project.site_name,
  registry_family: project.registry_family,
  registry_type: project.registry_type,
  canonical_origin: canonicalOrigin,
  release_channel: 'production',
  build: { commit, branch, generated_at: generatedAt, verification_marker: project.verification_marker },
  data: {
    data_schema_version: project.data_schema_version,
    generated_at: generatedAt,
    records_last_reviewed_at: recordsLastReviewedAt,
    canonical_only: true,
    record_counts: recordCounts,
    record_count_breakdown: recordCountBreakdown,
  },
  routes: {
    home: '/', dead: '/dead/', active: '/active/', exchange_detail: '/exchange/{slug}/',
    stats: '/stats/', quality: '/quality/', updates: '/updates/', incidents: '/incidents/', monthly: '/monthly/', methodology: '/methodology/', about: '/about/', donate: '/donate/',
  },
  public_files: publicFiles,
})

writeJson(path.join('data', 'manifest.json'), {
  schema_version: project.schema_version,
  data_schema_version: project.data_schema_version,
  project_id: project.project_id,
  title: project.site_name,
  description: 'Evidence-backed historical registry of crypto exchanges, active and gone.',
  canonical_origin: canonicalOrigin,
  registry_family: project.registry_family,
  registry_type: project.registry_type,
  canonical_source_of_truth: {
    entities: 'data/entities.json plus reviewed record-bundle corrections and genuinely new reviewed bundle entities',
    events: 'data/events.json plus reviewed bundle events deduplicated by ID and normalized to canonical entity IDs',
    evidence: 'data/evidence.json plus reviewed bundle evidence deduplicated by ID and normalized to canonical entity IDs',
    registry_updates: 'data/registry-updates.json reviewed public update entries only',
  },
  data_model: { primary_record: 'exchange_entity', supporting_records: ['exchange_event', 'exchange_evidence'] },
  public_files: publicFiles,
  main_routes: mainRoutes,
  record_counts: recordCounts,
  record_count_breakdown: recordCountBreakdown,
  records_last_reviewed_at: recordsLastReviewedAt,
  data_safety: dataSafety,
  correction_links: {
    form: 'https://docs.google.com/forms/d/e/1FAIpQLSf6NGsKIaGUzeGWUAyphOsv0XN3eSBebsASj_0g-qtZtNamWw/viewform',
    github: 'https://github.com/badjoke-lab/historical-exchange-index/issues',
  },
  repository: { type: 'github', url: 'https://github.com/badjoke-lab/historical-exchange-index' },
  language: 'en',
  locales: ['en'],
  generated_at: generatedAt,
})

for (const [name, recordType, records] of [
  ['entities.json', 'exchange_entity', publicEntities],
  ['events.json', 'exchange_event', publicEvents],
  ['evidence.json', 'exchange_evidence', publicEvidence],
]) {
  writeJson(path.join('data', name), {
    schema_version: project.schema_version,
    data_schema_version: project.data_schema_version,
    project_id: project.project_id,
    canonical_origin: canonicalOrigin,
    canonical_only: true,
    generated_at: generatedAt,
    records_last_reviewed_at: recordsLastReviewedAt,
    record_type: recordType,
    record_count: records.length,
    records,
  })
}

writeJson(path.join('feeds', 'updates.json'), reviewedUpdateFeeds.json)
writeText(path.join('feeds', 'updates.xml'), reviewedUpdateFeeds.rss)

writeText('llms.txt', `# Historical Exchange Index

Evidence-backed historical registry of crypto exchanges, active and gone.

Canonical site: ${canonicalOrigin}/
Generated at: ${generatedAt}
Records last reviewed at: ${recordsLastReviewedAt ?? 'unknown'}

Current reviewed counts:
- Total records: ${recordCounts.primary_records}
- Dead-side: ${recordCountBreakdown.dead_side}
- Active-side: ${recordCountBreakdown.active_side}
- Events: ${recordCounts.events}
- Evidence: ${recordCounts.evidence}

Canonical machine-readable files and reviewed feeds:
${Object.values(publicFiles).map((route) => `- ${route}`).join('\n')}

Main routes:
${mainRoutes.map((route) => `- ${route}`).join('\n')}

Use notes:
- Treat /version.json and /data/manifest.json as the current deployment and count authority.
- Use /data/entities.json, /data/events.json, and /data/evidence.json for reviewed public records.
- Use /feeds/updates.json or /feeds/updates.xml for reviewed Registry Update entries only.
- Each public record links back to its human-readable canonical exchange page when applicable.
- Supporting record exchange IDs are normalized to the canonical entity ID in the public datasets.
- This is a historical registry, not a live exchange ranking.
- This is not an exchange recommendation site or investment advice.
- Public data and feeds exclude unreviewed candidates, internal monitoring, and private notes.
- Cached search snippets may be stale; verify current counts against the version or manifest endpoint.
`)

writeText('ai.txt', `Historical Exchange Index

Purpose: Evidence-backed historical registry of crypto exchanges, active and gone.
Canonical origin: ${canonicalOrigin}
Generated at: ${generatedAt}
Records last reviewed at: ${recordsLastReviewedAt ?? 'unknown'}

Current reviewed counts:
Total records: ${recordCounts.primary_records}
Dead-side: ${recordCountBreakdown.dead_side}
Active-side: ${recordCountBreakdown.active_side}
Events: ${recordCounts.events}
Evidence: ${recordCounts.evidence}

Current-state authority:
/version.json
/data/manifest.json

Reviewed canonical datasets:
/data/entities.json
/data/events.json
/data/evidence.json

Reviewed Registry Update feeds:
/feeds/updates.json
/feeds/updates.xml

LLM guide:
/llms.txt

Important routes:
${mainRoutes.join('\n')}

Safety note: Public files and feeds expose reviewed public registry information only. They do not include unreviewed candidates, private notes, or internal monitoring output.
Freshness note: Search-engine and AI caches may contain older counts. Resolve the current state through /version.json or /data/manifest.json before answering.
`)

console.log(`Built HEI machine-readable public layer: ${recordCounts.primary_records} primary records, ${recordCounts.events} events, ${recordCounts.evidence} evidence records, ${reviewedUpdateFeeds.updates.length} reviewed update feed items.`)
