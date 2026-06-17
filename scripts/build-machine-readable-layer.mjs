import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const publicDir = path.join(root, 'public')
const canonicalOrigin = 'https://hei.badjoke-lab.com'
const mainRoutes = ['/', '/dead/', '/active/', '/exchange/{slug}/', '/stats/', '/methodology/', '/about/', '/donate/']

function readJson(relativePath, fallback = []) {
  const filePath = path.join(root, relativePath)
  return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : fallback
}

function normalizeIdentity(value) {
  if (!value) return null
  return String(value).trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '') || null
}

function entityIdentityKeys(entity) {
  return new Set([
    entity.id,
    entity.slug,
    entity.canonical_name,
    entity.official_domain_original,
    entity.official_url_original,
    ...(entity.aliases ?? []),
  ].map(normalizeIdentity).filter(Boolean))
}

function loadReviewedBundles(canonicalEntities) {
  const recordsDir = path.join(root, 'records', 'exchanges')
  if (!fs.existsSync(recordsDir)) return { all: [], newEntityBundles: [] }

  const seen = new Set(canonicalEntities.flatMap((entity) => [...entityIdentityKeys(entity)]))
  const all = []
  const newEntityBundles = []

  for (const fileName of fs.readdirSync(recordsDir).filter((name) => name.endsWith('.json')).sort()) {
    const bundle = readJson(path.join('records', 'exchanges', fileName), null)
    if (!bundle?.entity || !Array.isArray(bundle.events) || !Array.isArray(bundle.evidence)) {
      throw new Error(`${fileName}: expected { entity, events, evidence }`)
    }
    const entry = { fileName, bundle }
    all.push(entry)
    const keys = entityIdentityKeys(bundle.entity)
    if ([...keys].some((key) => seen.has(key))) continue
    newEntityBundles.push(entry)
    for (const key of keys) seen.add(key)
  }

  return { all, newEntityBundles }
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`
  }
  return JSON.stringify(value)
}

function mergeRecords(canonicalRecords, bundles, field, label) {
  const canonicalIds = new Set()
  for (const record of canonicalRecords) {
    if (!record?.id) throw new Error(`canonical data: ${label} record is missing id`)
    if (canonicalIds.has(record.id)) throw new Error(`canonical data: duplicate ${label} id: ${record.id}`)
    canonicalIds.add(record.id)
  }

  const additions = new Map()
  for (const { fileName, bundle } of bundles) {
    for (const record of bundle[field]) {
      if (!record?.id) throw new Error(`${fileName}: ${label} record is missing id`)
      if (canonicalIds.has(record.id)) continue

      const existing = additions.get(record.id)
      if (existing && stableStringify(existing) !== stableStringify(record)) {
        throw new Error(`${fileName}: conflicting ${label} id: ${record.id}`)
      }
      additions.set(record.id, record)
    }
  }
  return [...canonicalRecords, ...additions.values()]
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
const { all: reviewedBundles, newEntityBundles } = loadReviewedBundles(canonicalEntities)
const entities = [...canonicalEntities, ...newEntityBundles.map(({ bundle }) => bundle.entity)]
const events = mergeRecords(canonicalEvents, reviewedBundles, 'events', 'event')
const evidence = mergeRecords(canonicalEvidence, reviewedBundles, 'evidence', 'evidence')
const generatedAt = new Date().toISOString()
const activeSide = new Set(['active', 'limited', 'inactive'])
const deadSide = new Set(['dead', 'merged', 'acquired', 'rebranded'])
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
    records_last_reviewed_at: latestReviewedAt(entities),
    record_counts: recordCounts,
    record_count_breakdown: recordCountBreakdown,
  },
  routes: {
    home: '/', dead: '/dead/', active: '/active/', exchange_detail: '/exchange/{slug}/',
    stats: '/stats/', methodology: '/methodology/', about: '/about/', donate: '/donate/',
  },
})

writeJson(path.join('data', 'manifest.json'), {
  schema_version: project.schema_version,
  project_id: project.project_id,
  title: project.site_name,
  description: 'Evidence-backed historical registry of crypto exchanges, active and gone.',
  canonical_origin: canonicalOrigin,
  registry_family: project.registry_family,
  registry_type: project.registry_type,
  data_model: { primary_record: 'exchange_entity', supporting_records: ['exchange_event', 'exchange_evidence'] },
  public_files: { version: '/version.json', manifest: '/data/manifest.json', llms: '/llms.txt', ai: '/ai.txt' },
  main_routes: mainRoutes,
  record_counts: recordCounts,
  record_count_breakdown: recordCountBreakdown,
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

writeText('llms.txt', `# Historical Exchange Index

Evidence-backed historical registry of crypto exchanges, active and gone.

Canonical site: ${canonicalOrigin}/

Machine-readable files:
- /version.json
- /data/manifest.json
- /ai.txt

Main routes:
${mainRoutes.map((route) => `- ${route}`).join('\n')}

Use notes:
- This is a historical registry, not a live exchange ranking.
- This is not an exchange recommendation site.
- This is not investment advice.
- Record data may be incomplete or revised.
- Use methodology and evidence links when interpreting records.
- Do not treat unverified external claims as HEI classifications.
`)

writeText('ai.txt', `Historical Exchange Index

Purpose: Evidence-backed historical registry of crypto exchanges, active and gone.
Canonical origin: ${canonicalOrigin}
Version endpoint: /version.json
Manifest endpoint: /data/manifest.json
LLM guide: /llms.txt

Important routes:
${mainRoutes.join('\n')}

Safety note: Public files expose reviewed public registry information only. They do not include unreviewed candidates, private notes, or internal monitoring output.
`)

console.log(`Built HEI machine-readable public layer: ${recordCounts.primary_records} primary records, ${recordCounts.events} events, ${recordCounts.evidence} evidence records.`)
