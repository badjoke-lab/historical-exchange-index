import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const publicDir = path.join(root, 'public')

function fail(message) {
  throw new Error(`machine-readable validation failed: ${message}`)
}

function assert(condition, message) {
  if (!condition) fail(message)
}

function readJson(relativePath) {
  const filePath = path.join(root, relativePath)
  assert(fs.existsSync(filePath), `missing ${relativePath}`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function readText(relativePath) {
  const filePath = path.join(root, relativePath)
  assert(fs.existsSync(filePath), `missing ${relativePath}`)
  return fs.readFileSync(filePath, 'utf8')
}

function normalizeIdentity(value) {
  if (!value) return null
  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
  return normalized || null
}

function entityIdentityKeys(entity) {
  return new Set(
    [
      entity.id,
      entity.slug,
      entity.canonical_name,
      entity.official_domain_original,
      entity.official_url_original,
      ...(entity.aliases ?? []),
    ]
      .map(normalizeIdentity)
      .filter(Boolean),
  )
}

function loadAcceptedBundles(canonicalEntities) {
  const recordsDir = path.join(root, 'records', 'exchanges')
  if (!fs.existsSync(recordsDir)) return []

  const seenIdentities = new Set(
    canonicalEntities.flatMap((entity) => [...entityIdentityKeys(entity)]),
  )
  const accepted = []

  for (const fileName of fs.readdirSync(recordsDir).filter((name) => name.endsWith('.json')).sort()) {
    const bundle = JSON.parse(fs.readFileSync(path.join(recordsDir, fileName), 'utf8'))
    assert(bundle.entity && Array.isArray(bundle.events) && Array.isArray(bundle.evidence), `${fileName} is not a valid record bundle`)

    const keys = entityIdentityKeys(bundle.entity)
    if ([...keys].some((key) => seenIdentities.has(key))) continue

    accepted.push({ fileName, bundle })
    for (const key of keys) seenIdentities.add(key)
  }

  return accepted
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}

function mergeRecords(canonicalRecords, acceptedBundles, field, label) {
  const canonicalIds = new Set()
  for (const record of canonicalRecords) {
    assert(record?.id, `canonical ${label} record is missing id`)
    assert(!canonicalIds.has(record.id), `duplicate canonical ${label} id ${record.id}`)
    canonicalIds.add(record.id)
  }

  const acceptedById = new Map()
  for (const { fileName, bundle } of acceptedBundles) {
    for (const record of bundle[field]) {
      assert(record?.id, `${fileName} contains ${label} without id`)
      if (canonicalIds.has(record.id)) continue

      const existing = acceptedById.get(record.id)
      if (!existing) {
        acceptedById.set(record.id, record)
        continue
      }

      assert(
        stableStringify(existing) === stableStringify(record),
        `${fileName} conflicts with another accepted bundle for ${label} id ${record.id}`,
      )
    }
  }

  return [...canonicalRecords, ...acceptedById.values()]
}

function countBy(items, key) {
  return items.reduce((counts, item) => {
    const value = item[key] ?? 'unknown'
    counts[value] = (counts[value] ?? 0) + 1
    return counts
  }, {})
}

function deepEqual(actual, expected, label) {
  assert(stableStringify(actual) === stableStringify(expected), `${label} does not match generated public data`)
}

function expectedCommit() {
  return process.env.CF_PAGES_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || 'unknown'
}

function expectedBranch() {
  return process.env.CF_PAGES_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.GITHUB_REF_NAME || 'main'
}

const version = readJson('public/version.json')
const manifest = readJson('public/data/manifest.json')
const llms = readText('public/llms.txt')
const ai = readText('public/ai.txt')

const canonicalEntities = readJson('data/entities.json')
const canonicalEvents = readJson('data/events.json')
const canonicalEvidence = readJson('data/evidence.json')
const acceptedBundles = loadAcceptedBundles(canonicalEntities)
const entities = [...canonicalEntities, ...acceptedBundles.map(({ bundle }) => bundle.entity)]
const events = mergeRecords(canonicalEvents, acceptedBundles, 'events', 'event')
const evidence = mergeRecords(canonicalEvidence, acceptedBundles, 'evidence', 'evidence')

const deadSideStatuses = new Set(['dead', 'merged', 'acquired', 'rebranded'])
const activeSideStatuses = new Set(['active', 'limited', 'inactive'])
const expectedCounts = {
  primary_records: entities.length,
  events: events.length,
  evidence: evidence.length,
}
const expectedBreakdown = {
  exchanges: entities.length,
  active_side: entities.filter((entity) => activeSideStatuses.has(entity.status)).length,
  dead_side: entities.filter((entity) => deadSideStatuses.has(entity.status)).length,
  status: countBy(entities, 'status'),
  type: countBy(entities, 'type'),
}
const reviewedDates = entities
  .map((entity) => entity.last_verified_at)
  .filter((value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value))
  .sort()
const expectedLastReviewedAt = reviewedDates.at(-1) ?? null

assert(version.schema_version === '1.0.0', 'version schema_version must be 1.0.0')
assert(version.project_id === 'historical-exchange-index', 'version project_id is incorrect')
assert(version.registry_family === 'badjoke-lab-ledger-series', 'version registry_family is incorrect')
assert(version.registry_type === 'historical_crypto_exchange_registry', 'version registry_type is incorrect')
assert(version.canonical_origin === 'https://hei.badjoke-lab.com', 'version canonical_origin is incorrect')
assert(version.build?.verification_marker === 'hei_machine_readable_layer_v1', 'verification marker is incorrect')
assert(version.build?.commit === expectedCommit(), 'build commit does not match deployment environment')
assert(version.build?.branch === expectedBranch(), 'build branch does not match deployment environment')
assert(!Number.isNaN(Date.parse(version.build?.generated_at)), 'build generated_at is not a valid timestamp')
assert(version.data?.generated_at === version.build.generated_at, 'version build/data timestamps differ')
assert(version.data?.data_schema_version === 'hei_entity_event_evidence_v1', 'data schema version is incorrect')
assert(version.data?.records_last_reviewed_at === expectedLastReviewedAt, 'records_last_reviewed_at is incorrect')
deepEqual(version.data?.record_counts, expectedCounts, 'version record_counts')
deepEqual(version.data?.record_count_breakdown, expectedBreakdown, 'version record_count_breakdown')

assert(manifest.schema_version === '1.0.0', 'manifest schema_version must be 1.0.0')
assert(manifest.project_id === version.project_id, 'manifest/version project_id mismatch')
assert(manifest.canonical_origin === version.canonical_origin, 'manifest/version canonical_origin mismatch')
assert(manifest.registry_family === version.registry_family, 'manifest/version registry_family mismatch')
assert(manifest.registry_type === version.registry_type, 'manifest/version registry_type mismatch')
assert(manifest.generated_at === version.build.generated_at, 'manifest/version generated_at mismatch')
deepEqual(manifest.record_counts, expectedCounts, 'manifest record_counts')
deepEqual(manifest.record_count_breakdown, expectedBreakdown, 'manifest record_count_breakdown')
deepEqual(manifest.data_safety, {
  canonical_only: true,
  includes_unreviewed_candidates: false,
  includes_internal_monitoring: false,
  includes_private_notes: false,
}, 'manifest data_safety')
deepEqual(manifest.public_files, {
  version: '/version.json',
  manifest: '/data/manifest.json',
  llms: '/llms.txt',
  ai: '/ai.txt',
}, 'manifest public_files')

const requiredRoutes = ['/', '/dead/', '/active/', '/exchange/{slug}/', '/stats/', '/methodology/', '/about/', '/donate/']
for (const route of requiredRoutes) {
  assert(manifest.main_routes?.includes(route), `manifest is missing route ${route}`)
  assert(llms.includes(route), `llms.txt is missing route ${route}`)
  assert(ai.includes(route), `ai.txt is missing route ${route}`)
}

for (const endpoint of ['/version.json', '/data/manifest.json', '/llms.txt', '/ai.txt']) {
  assert(llms.includes(endpoint) || endpoint === '/llms.txt', `llms.txt is missing endpoint ${endpoint}`)
  assert(ai.includes(endpoint) || endpoint === '/ai.txt', `ai.txt is missing endpoint ${endpoint}`)
}

assert(llms.includes('https://hei.badjoke-lab.com/'), 'llms.txt is missing canonical site')
assert(ai.includes('https://hei.badjoke-lab.com'), 'ai.txt is missing canonical origin')
assert(ai.includes('do not include unreviewed candidates'), 'ai.txt is missing public-data safety note')

console.log(`Validated HEI machine-readable public layer: ${entities.length} entities, ${events.length} events, ${evidence.length} evidence records.`)
