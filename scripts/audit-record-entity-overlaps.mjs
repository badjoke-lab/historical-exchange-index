import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const entitiesPath = path.join(root, 'data', 'entities.json')
const recordsDir = path.join(root, 'records', 'exchanges')

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
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

function loadRecords() {
  const records = []
  for (const entity of readJson(entitiesPath)) {
    records.push({
      source: 'data/entities.json',
      file: null,
      entity,
      identity: identitySet(entity),
    })
  }

  if (fs.existsSync(recordsDir)) {
    for (const fileName of fs.readdirSync(recordsDir).filter((name) => name.endsWith('.json')).sort()) {
      const filePath = path.join(recordsDir, fileName)
      const bundle = readJson(filePath)
      if (!bundle.entity) continue
      records.push({
        source: 'records/exchanges',
        file: path.relative(root, filePath),
        entity: bundle.entity,
        identity: identitySet(bundle.entity),
      })
    }
  }

  return records
}

function intersections(left, right) {
  return [...left].filter((value) => right.has(value))
}

function compare(left, right) {
  const reasons = []

  if (left.identity.id && left.identity.id === right.identity.id) reasons.push(`id:${left.identity.id}`)
  if (left.identity.slug && left.identity.slug === right.identity.slug) reasons.push(`slug:${left.identity.slug}`)

  for (const value of intersections(left.identity.names, right.identity.names)) {
    reasons.push(`name-or-alias:${value}`)
  }
  for (const value of intersections(left.identity.domains, right.identity.domains)) {
    reasons.push(`domain:${value}`)
  }

  return [...new Set(reasons)]
}

const records = loadRecords()
const collisions = []

for (let i = 0; i < records.length; i += 1) {
  for (let j = i + 1; j < records.length; j += 1) {
    const left = records[i]
    const right = records[j]

    if (left.source !== 'records/exchanges' && right.source !== 'records/exchanges') continue

    const reasons = compare(left, right)
    if (reasons.length === 0) continue
    collisions.push({ left, right, reasons })
  }
}

if (collisions.length === 0) {
  console.log(`No entity overlaps detected across ${records.length} canonical and bundle records.`)
  process.exit(0)
}

console.error(`Detected ${collisions.length} entity overlap pair(s):`)
for (const collision of collisions) {
  const { left, right, reasons } = collision
  console.error('\n---')
  console.error(`reasons: ${reasons.join(', ')}`)
  console.error(
    `left: ${left.source}${left.file ? `/${left.file}` : ''} :: ${left.entity.id} :: ${left.entity.slug} :: ${left.entity.canonical_name}`,
  )
  console.error(
    `right: ${right.source}${right.file ? `/${right.file}` : ''} :: ${right.entity.id} :: ${right.entity.slug} :: ${right.entity.canonical_name}`,
  )
}

process.exit(1)
