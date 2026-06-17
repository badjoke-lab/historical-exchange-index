import fs from 'node:fs'
import path from 'node:path'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'

const root = process.cwd()
const entitiesPath = path.join(root, 'data', 'entities.json')
const recordsDir = path.join(root, 'records', 'exchanges')

const allowedEntityOverlapPairs = new Set([
  'hei_ex_000031|hei_ex_000397',
  'hei_ex_000285|hei_ex_000396',
])

function pairKey(left, right) {
  return [left.entity.id, right.entity.id].sort().join('|')
}

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

function normalizeText(value) {
  if (!value || typeof value !== 'string') return null
  const normalized = value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '')
  return normalized.length >= 3 ? normalized : null
}

function normalizeDomain(value) {
  if (!value || typeof value !== 'string') return null
  try {
    const candidate = /^[a-z]+:\/\//i.test(value) ? value : `https://${value}`
    return new URL(candidate).hostname.toLowerCase().replace(/^www\./, '') || null
  } catch {
    return value
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]
      .replace(/\.$/, '') || null
  }
}

function identitySet(entity) {
  const names = new Set()
  for (const value of [entity.canonical_name, ...(entity.aliases || [])]) {
    const normalized = normalizeText(value)
    if (normalized) names.add(normalized)
  }

  const domains = new Set()
  for (const value of [entity.official_domain_original, entity.official_url_original]) {
    const normalized = normalizeDomain(value)
    if (normalized) domains.add(normalized)
  }

  return {
    id: entity.id || null,
    slug: normalizeText(entity.slug),
    names,
    domains,
  }
}

function loadBundleEntries() {
  if (!fs.existsSync(recordsDir)) return []
  return fs.readdirSync(recordsDir)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((fileName) => {
      const filePath = path.join(recordsDir, fileName)
      return { fileName, bundle: readJson(filePath), filePath }
    })
}

const canonicalEntities = readJson(entitiesPath)
const bundleEntries = loadBundleEntries()
const correctedCanonicalEntities = applyReviewedEntityCorrections(canonicalEntities, bundleEntries)
const originalCanonicalById = new Map(canonicalEntities.map((entity) => [entity.id, entity]))
const correctedCanonicalById = new Map(correctedCanonicalEntities.map((entity) => [entity.id, entity]))

function loadRecords() {
  const records = canonicalEntities.map((entity) => ({
    source: 'data/entities.json',
    file: null,
    entity,
    bundle: null,
    identity: identitySet(entity),
  }))

  for (const entry of bundleEntries) {
    if (!entry.bundle.entity) continue
    records.push({
      source: 'records/exchanges',
      file: path.relative(root, entry.filePath),
      entity: entry.bundle.entity,
      bundle: entry.bundle,
      identity: identitySet(entry.bundle.entity),
    })
  }

  return records
}

function isAllowedCanonicalMirrorPair(left, right) {
  const canonical = left.source === 'data/entities.json' ? left : right.source === 'data/entities.json' ? right : null
  const bundleRecord = left.source === 'records/exchanges' ? left : right.source === 'records/exchanges' ? right : null
  if (!canonical || !bundleRecord || !canonical.entity.id || canonical.entity.id !== bundleRecord.entity.id) return false

  const reference = bundleRecord.bundle?.entity_correction
    ? correctedCanonicalById.get(bundleRecord.entity.id)
    : originalCanonicalById.get(bundleRecord.entity.id)
  return Boolean(reference && stableStringify(reference) === stableStringify(bundleRecord.entity))
}

function intersections(left, right) {
  return [...left].filter((value) => right.has(value))
}

function compare(left, right) {
  const reasons = []
  if (left.identity.id && left.identity.id === right.identity.id) reasons.push(`id:${left.identity.id}`)
  if (left.identity.slug && left.identity.slug === right.identity.slug) reasons.push(`slug:${left.identity.slug}`)
  for (const value of intersections(left.identity.names, right.identity.names)) reasons.push(`name-or-alias:${value}`)
  for (const value of intersections(left.identity.domains, right.identity.domains)) reasons.push(`domain:${value}`)
  return [...new Set(reasons)]
}

const records = loadRecords()
const collisions = []
const allowedCollisions = []
let allowedMirrorPairs = 0

for (let i = 0; i < records.length; i += 1) {
  for (let j = i + 1; j < records.length; j += 1) {
    const left = records[i]
    const right = records[j]
    if (left.source !== 'records/exchanges' && right.source !== 'records/exchanges') continue

    if (isAllowedCanonicalMirrorPair(left, right)) {
      allowedMirrorPairs += 1
      continue
    }

    const reasons = compare(left, right)
    if (reasons.length === 0) continue
    const collision = { left, right, reasons }
    if (allowedEntityOverlapPairs.has(pairKey(left, right))) {
      allowedCollisions.push(collision)
      continue
    }
    collisions.push(collision)
  }
}

if (collisions.length === 0) {
  const notes = []
  if (allowedMirrorPairs) notes.push(`${allowedMirrorPairs} reviewed canonical mirror pair(s) allowed`)
  if (allowedCollisions.length) notes.push(`${allowedCollisions.length} documented overlap pair(s) allowed`)
  const suffix = notes.length ? ` (${notes.join('; ')}).` : '.'
  console.log(`No blocking entity overlaps detected across ${records.length} canonical and bundle records${suffix}`)
  process.exit(0)
}

console.error(`Detected ${collisions.length} blocking entity overlap pair(s):`)
for (const collision of collisions) {
  const { left, right, reasons } = collision
  console.error('\n---')
  console.error(`reasons: ${reasons.join(', ')}`)
  console.error(`left: ${left.source}${left.file ? `/${left.file}` : ''} :: ${left.entity.id} :: ${left.entity.slug} :: ${left.entity.canonical_name}`)
  console.error(`right: ${right.source}${right.file ? `/${right.file}` : ''} :: ${right.entity.id} :: ${right.entity.slug} :: ${right.entity.canonical_name}`)
}

process.exit(1)
