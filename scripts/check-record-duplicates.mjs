import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const entitiesPath = path.join(root, 'data', 'entities.json')
const recordsDir = path.join(root, 'records', 'exchanges')

const allowedDuplicateEntityPairs = new Set([
  'hei_ex_000031|hei_ex_000397',
  'hei_ex_000285|hei_ex_000396',
])

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
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

  for (const alias of entity.aliases || []) {
    addKey(keys, 'alias', alias)
  }

  return keys
}

function makeRecord(source, entity, filePath = null) {
  return {
    source,
    filePath,
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

function loadBundleRecords() {
  if (!fs.existsSync(recordsDir)) return []

  return fs
    .readdirSync(recordsDir)
    .filter((fileName) => fileName.endsWith('.json'))
    .sort((a, b) => a.localeCompare(b))
    .map((fileName) => {
      const filePath = path.join(recordsDir, fileName)
      const bundle = readJson(filePath)
      return makeRecord('records/exchanges', bundle.entity, path.relative(root, filePath))
    })
}

const baseRecords = readJson(entitiesPath).map((entity) => makeRecord('data/entities.json', entity))
const bundleRecords = loadBundleRecords()
const allRecords = [...baseRecords, ...bundleRecords]
const byKey = new Map()

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

for (const [identity, records] of byKey) {
  const uniqueRecordIds = [...new Set(records.map((record) => `${record.source}:${record.filePath || record.id}`))]
  if (uniqueRecordIds.length < 2) continue

  const hasBundle = records.some((record) => record.source === 'records/exchanges')
  if (!hasBundle) continue

  const groupKey = uniqueRecordIds.sort().join('|')
  if (seenGroups.has(groupKey)) continue
  seenGroups.add(groupKey)

  const pairKey = recordPairKey(records)
  if (pairKey && allowedDuplicateEntityPairs.has(pairKey)) {
    allowedGroups.push({ identity, records })
    continue
  }

  duplicateGroups.push({ identity, records })
}

if (duplicateGroups.length === 0) {
  const allowedSuffix = allowedGroups.length ? ` (${allowedGroups.length} documented duplicate group(s) allowed).` : '.'
  console.log(`No record identity duplicates detected${allowedSuffix}`)
} else {
  console.error(`Detected ${duplicateGroups.length} record identity duplicate group(s):`)

  for (const group of duplicateGroups) {
    console.error(`\n- key: ${group.identity}`)
    for (const record of group.records) {
      console.error(
        `  - ${record.source}${record.filePath ? `/${record.filePath}` : ''} :: ${record.id} :: ${record.slug} :: ${record.canonical_name}`,
      )
    }
  }

  process.exitCode = 1
}
