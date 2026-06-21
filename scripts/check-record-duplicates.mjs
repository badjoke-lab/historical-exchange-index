import fs from 'node:fs'
import path from 'node:path'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'

const root = process.cwd()
const entitiesPath = path.join(root, 'data', 'entities.json')
const recordsDir = path.join(root, 'records', 'exchanges')

const allowedDuplicateEntityPairs = new Set([
  'hei_ex_000031|hei_ex_000397',
  'hei_ex_000127|hei_ex_000216',
  'hei_ex_000128|hei_ex_000302',
  'hei_ex_000285|hei_ex_000396',
])

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}

function normalizeIdentity(value) {
  if (!value || typeof value !== 'string') return null
  let normalized = value.trim().toLowerCase()
  if (normalized.startsWith('https://')) normalized = normalized.slice(8)
  if (normalized.startsWith('http://')) normalized = normalized.slice(7)
  if (normalized.startsWith('www.')) normalized = normalized.slice(4)
  if (normalized.endsWith('/')) normalized = normalized.slice(0, -1)
  return normalized.length > 0 ? normalized : null
}

function addKey(keys, kind, value) {
  const normalized = normalizeIdentity(value)
  if (normalized) keys.push({ kind, value: normalized })
}

function entityKeys(entity) {
  const keys = []
  addKey(keys, 'id', entity.id)
  addKey(keys, 'slug', entity.slug)
  addKey(keys, 'canonical_name', entity.canonical_name)
  addKey(keys, 'official_domain_original', entity.official_domain_original)
  addKey(keys, 'official_url_original', entity.official_url_original)
  for (const alias of entity.aliases || []) addKey(keys, 'alias', alias)
  return keys
}

function makeRecord(source, entity, filePath = null, bundle = null) {
  return {
    source,
    filePath,
    bundle,
    entity,
    id: entity.id,
    slug: entity.slug,
    canonical_name: entity.canonical_name,
    official_domain_original: entity.official_domain_original,
    official_url_original: entity.official_url_original,
    keys: entityKeys(entity),
  }
}

function recordPairKey(records) {
  const ids = [...new Set(records.map((record) => record.id).filter(Boolean))].sort()
  return ids.length === 2 ? ids.join('|') : null
}

function loadBundleEntries() {
  if (!fs.existsSync(recordsDir)) return []
  return fs.readdirSync(recordsDir)
    .filter((fileName) => fileName.endsWith('.json'))
    .sort((a, b) => a.localeCompare(b))
    .map((fileName) => {
      const filePath = path.join(recordsDir, fileName)
      return { fileName, filePath, bundle: readJson(filePath) }
    })
}

const canonicalEntities = readJson(entitiesPath)
const bundleEntries = loadBundleEntries()
const correctedCanonicalEntities = applyReviewedEntityCorrections(canonicalEntities, bundleEntries)
const originalCanonicalById = new Map(canonicalEntities.map((entity) => [entity.id, entity]))
const correctedCanonicalById = new Map(correctedCanonicalEntities.map((entity) => [entity.id, entity]))
const baseRecords = canonicalEntities.map((entity) => makeRecord('data/entities.json', entity))
const canonicalById = new Map(baseRecords.map((record) => [record.id, record]))
const bundleRecords = bundleEntries.map(({ filePath, bundle }) =>
  makeRecord('records/exchanges', bundle.entity, path.relative(root, filePath), bundle),
)
const allRecords = [...baseRecords, ...bundleRecords]
const byKey = new Map()

function isReviewedCanonicalMirror(record) {
  if (record.source !== 'records/exchanges' || !record.id) return false
  const canonical = canonicalById.get(record.id)
  if (!canonical) return false
  const reference = record.bundle?.entity_correction
    ? correctedCanonicalById.get(record.id)
    : originalCanonicalById.get(record.id)
  return Boolean(reference && stableStringify(reference) === stableStringify(record.entity))
}

for (const record of allRecords) {
  for (const key of record.keys) {
    const identity = `${key.kind}:${key.value}`
    const list = byKey.get(identity) || []
    list.push(record)
    byKey.set(identity, list)
  }
}

const duplicateGroups = []
const allowedGroups = []
const seenGroups = new Set()
let mirrorIdentityOccurrences = 0

for (const [identity, records] of byKey) {
  const logicalRecords = records.filter((record) => {
    if (!isReviewedCanonicalMirror(record)) return true
    mirrorIdentityOccurrences += 1
    return false
  })

  const uniqueRecordIds = [...new Set(logicalRecords.map((record) => `${record.source}:${record.filePath || record.id}`))]
  if (uniqueRecordIds.length < 2) continue
  if (!logicalRecords.some((record) => record.source === 'records/exchanges')) continue

  const groupKey = uniqueRecordIds.sort().join('|')
  if (seenGroups.has(groupKey)) continue
  seenGroups.add(groupKey)

  const pairKey = recordPairKey(logicalRecords)
  if (pairKey && allowedDuplicateEntityPairs.has(pairKey)) {
    allowedGroups.push({ identity, records: logicalRecords })
    continue
  }
  duplicateGroups.push({ identity, records: logicalRecords })
}

if (duplicateGroups.length === 0) {
  const notes = []
  if (mirrorIdentityOccurrences) notes.push(`${mirrorIdentityOccurrences} reviewed mirror identity occurrence(s) ignored`)
  if (allowedGroups.length) notes.push(`${allowedGroups.length} documented duplicate group(s) allowed`)
  const suffix = notes.length ? ` (${notes.join('; ')}).` : '.'
  console.log(`No record identity duplicates detected${suffix}`)
} else {
  console.error(`Detected ${duplicateGroups.length} record identity duplicate group(s):`)
  for (const group of duplicateGroups) {
    console.error(`\n- key: ${group.identity}`)
    for (const record of group.records) {
      console.error(`  - ${record.source}${record.filePath ? `/${record.filePath}` : ''} :: ${record.id} :: ${record.slug} :: ${record.canonical_name}`)
    }
  }
  process.exitCode = 1
}
