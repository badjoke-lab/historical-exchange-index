import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const publicDir = path.join(root, 'public')
const publicDataDir = path.join(publicDir, 'data')

const PROJECT = {
  schemaVersion: '1.0.0',
  projectId: 'historical-exchange-index',
  siteName: 'Historical Exchange Index',
  title: 'Historical Exchange Index',
  description: 'Evidence-backed historical registry of crypto exchanges, active and gone.',
  registryFamily: 'badjoke-lab-ledger-series',
  registryType: 'historical_crypto_exchange_registry',
  canonicalOrigin: 'https://hei.badjoke-lab.com',
  releaseChannel: 'production',
  dataSchemaVersion: 'hei_entity_event_evidence_v1',
  verificationMarker: 'hei_machine_readable_layer_v1',
}

const MAIN_ROUTES = [
  '/',
  '/dead/',
  '/active/',
  '/exchange/{slug}/',
  '/stats/',
  '/methodology/',
  '/about/',
  '/donate/',
]

const ROUTES = {
  home: '/',
  dead: '/dead/',
  active: '/active/',
  exchange_detail: '/exchange/{slug}/',
  stats: '/stats/',
  methodology: '/methodology/',
  about: '/about/',
  donate: '/donate/',
}

function readJson(relativePath, fallback) {
  const filePath = path.join(root, relativePath)
  if (!fs.existsSync(filePath)) return fallback
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function normalizeIdentity(value) {
  if (!value) return null
  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')

  return normalized.length > 0 ? normalized : null
}

function addIdentityKey(keys, value) {
  const normalized = normalizeIdentity(value)
  if (normalized) keys.add(normalized)
}

function getEntityIdentityKeys(entity) {
  const keys = new Set()
  addIdentityKey(keys, entity.id)
  addIdentityKey(keys, entity.slug)
  addIdentityKey(keys, entity.canonical_name)
  addIdentityKey(keys, entity.official_domain_original)
  addIdentityKey(keys, entity.official_url_original)

  for (const alias of entity.aliases ?? []) {
    addIdentityKey(keys, alias)
  }

  return keys
}

function loadExchangeRecordBundles() {
  const recordsDir = path.join(root, 'records', 'exchanges')
  if (!fs.existsSync(recordsDir)) return []

  return fs
    .readdirSync(recordsDir)
    .filter((fileName) => fileName.endsWith('.json'))
    .sort((a, b) => a.localeCompare(b))
    .map((fileName) => ({
      fileName,
      bundle: readJson(path.join('records', 'exchanges', fileName), null),
    }))
    .filter(({ bundle }) => Boolean(bundle))
}

function filterNewExchangeRecordBundles(bundleEntries, baseEntities) {
  const seenIdentityKeys = new Set()

  for (const entity of baseEntities) {
    for (const key of getEntityIdentityKeys(entity)) {
      seenIdentityKeys.add(key)
    }
  }

  const acceptedEntries = []

  for (const entry of bundleEntries) {
    const { fileName, bundle } = entry
    if (!bundle.entity || !Array.isArray(bundle.events) || !Array.isArray(bundle.evidence)) {
      throw new Error(`${fileName}: expected { entity, events, evidence }`)
    }

    const bundleKeys = getEntityIdentityKeys(bundle.entity)
    const hasExistingIdentity = [...bundleKeys].some((key) => seenIdentityKeys.has(key))

    if (hasExistingIdentity) continue

    acceptedEntries.push(entry)

    for (const key of bundleKeys) {
      seenIdentityKeys.add(key)
    }
  }

  return acceptedEntries
}

function appendUniqueBundleRecords(canonicalRecords, acceptedEntries, field, label) {
  const seenIds = new Set()

  for (const record of canonicalRecords) {
    if (!record?.id) throw new Error(`canonical ${label} record is missing id`)
    if (seenIds.has(record.id)) throw new Error(`duplicate canonical ${label} id: ${record.id}`)
    seenIds.add(record.id)
  }

  const combined = [...canonicalRecords]

  for (const { fileName, bundle } of acceptedEntries) {
    for (const record of bundle[field]) {
      if (!record?.id) throw new Error(`${fileName}: ${label} record is missing id`)
      if (seenIds.has(record.id)) {
        throw new Error(`${fileName}: duplicate ${label} id across canonical data or accepted bundles: ${record.id}`)
      }
      seenIds.add(record.id)
      combined.push(record)
    }
  }

  return combined
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] ?? 'unknown'
    acc[value] = (acc[value] ?? 0) + 1
    return acc
  }, {})
}

function getGitCommit() {
  return (
    process.env.CF_PAGES_COMMIT_SHA ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.GITHUB_SHA ||
    'unknown'
  )
}

function getGitBranch() {
  return (
    process.env.CF_PAGES_BRANCH ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.GITHUB_REF_NAME ||
    'main'
  )
}

function latestReviewedAt(entities) {
  const dates = entities
    .map((entity) => entity.last_verified_at)
    .filter((value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value))
    .sort()

  return dates.at(-1) ?? null
}

function writeJson(relativePath, value) {
  const filePath = path.join(publicDir, relativePath)
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

function writeText(relativePath, value) {
  const filePath = path.join(publicDir, relativePath)
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, value.trimEnd() + '\n', 'utf8')
}

fs.mkdirSync(publicDataDir, { recursive: true })

const canonicalEntities = readJson('data/entities.json', [])
const canonicalEvents = readJson('data/events.json', [])
const canonicalEvidence = readJson('data/evidence.json', [])
const acceptedEntries = filterNewExchangeRecordBundles(loadExchangeRecordBundles(), canonicalEntities)

const entities = [...canonicalEntities, ...acceptedEntries.map(({ bundle }) => bundle.entity)]
const events = appendUniqueBundleRecords(canonicalEvents, acceptedEntries, 'events', 'event')
const evidence = appendUniqueBundleRecords(canonicalEvidence, acceptedEntries, 'evidence', 'evidence')

const deadSideStatuses = new Set(['dead', 'merged', 'acquired', 'rebranded'])
const activeSideStatuses = new Set(['active', 'limited', 'inactive'])
const buildGeneratedAt = new Date().toISOString()

const recordCounts = {
  primary_records: entities.length,
  events: events.length,
  evidence: evidence.length,
}

const recordCountBreakdown = {
  exchanges: entities.length,
  active_side: entities.filter((item) => activeSideStatuses.has(item.status)).length,
  dead_side: entities.filter((item) => deadSideStatuses.has(item.status)).length,
  status: countBy(entities, 'status'),
  type: countBy(entities, 'type'),
}

const dataSafety = {
  canonical_only: true,
  includes_unreviewed_candidates: false,
  includes_internal_monitoring: false,
  includes_private_notes: false,
}

const version = {
  schema_version: PROJECT.schemaVersion,
  project_id: PROJECT.projectId,
  site_name: PROJECT.siteName,
  registry_family: PROJECT.registryFamily,
  registry_type: PROJECT.registryType,
  canonical_origin: PROJECT.canonicalOrigin,
  release_channel: PROJECT.releaseChannel,
  build: {
    commit: getGitCommit(),
    branch: getGitBranch(),
    generated_at: buildGeneratedAt,
    verification_marker: PROJECT.verificationMarker,
  },
  data: {
    data_schema_version: PROJECT.dataSchemaVersion,
    generated_at: buildGeneratedAt,
    records_last_reviewed_at: latestReviewedAt(entities),
    record_counts: recordCounts,
    record_count_breakdown: recordCountBreakdown,
  },
  routes: ROUTES,
}

const manifest = {
  schema_version: PROJECT.schemaVersion,
  project_id: PROJECT.projectId,
  title: PROJECT.title,
  description: PROJECT.description,
  canonical_origin: PROJECT.canonicalOrigin,
  registry_family: PROJECT.registryFamily,
  registry_type: PROJECT.registryType,
  data_model: {
    primary_record: 'exchange_entity',
    supporting_records: ['exchange_event', 'exchange_evidence'],
  },
  public_files: {
    version: '/version.json',
    manifest: '/data/manifest.json',
    llms: '/llms.txt',
    ai: '/ai.txt',
  },
  main_routes: MAIN_ROUTES,
  record_counts: recordCounts,
  record_count_breakdown: recordCountBreakdown,
  data_safety: dataSafety,
  correction_links: {
    form: 'https://docs.google.com/forms/d/e/1FAIpQLSf6NGsKIaGUzeGWUAyphOsv0XN3eSBebsASj_0g-qtZtNamWw/viewform',
    github: 'https://github.com/badjoke-lab/historical-exchange-index/issues',
  },
  repository: {
    type: 'github',
    url: 'https://github.com/badjoke-lab/historical-exchange-index',
  },
  language: 'en',
  locales: ['en'],
  generated_at: buildGeneratedAt,
}

const llms = `# Historical Exchange Index

Evidence-backed historical registry of crypto exchanges, active and gone.

Canonical site: https://hei.badjoke-lab.com/

Machine-readable files:
- /version.json
- /data/manifest.json
- /ai.txt

Main routes:
- /
- /dead/
- /active/
- /exchange/{slug}/
- /stats/
- /methodology/
- /about/
- /donate/

Use notes:
- This is a historical registry, not a live exchange ranking.
- This is not an exchange recommendation site.
- This is not investment advice.
- Record data may be incomplete or revised.
- Use methodology and evidence links when interpreting records.
- Do not treat unverified external claims as HEI classifications.
`

const ai = `Historical Exchange Index

Purpose: Evidence-backed historical registry of crypto exchanges, active and gone.
Canonical origin: https://hei.badjoke-lab.com
Version endpoint: /version.json
Manifest endpoint: /data/manifest.json
LLM guide: /llms.txt

Important routes:
/
/dead/
/active/
/exchange/{slug}/
/stats/
/methodology/
/about/
/donate/

Safety note: Public files expose reviewed public registry information only. They do not include unreviewed candidates, private notes, or internal monitoring output.
`

writeJson('version.json', version)
writeJson(path.join('data', 'manifest.json'), manifest)
writeText('llms.txt', llms)
writeText('ai.txt', ai)

console.log(`Built HEI machine-readable public layer: ${recordCounts.primary_records} primary records, ${recordCounts.events} events, ${recordCounts.evidence} evidence records.`)
