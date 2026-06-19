import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const entitiesPath = path.join(root, 'data/entities.json')
const strict = process.argv.includes('--strict')
const jsonOutput = process.argv.includes('--json')

if (!fs.existsSync(entitiesPath)) {
  console.error('Missing data/entities.json')
  process.exit(1)
}

const entities = JSON.parse(fs.readFileSync(entitiesPath, 'utf8'))
const missingTokens = new Set(['', 'unknown', 'tbd', 'n/a', 'na', 'unset'])

const isMissing = (value) => {
  if (value === null || value === undefined) return true
  if (typeof value !== 'string') return true
  return missingTokens.has(value.trim().toLowerCase())
}

const missing = entities
  .filter((entity) => isMissing(entity.country_or_origin))
  .map((entity) => ({
    id: entity.id,
    slug: entity.slug,
    canonical_name: entity.canonical_name,
    type: entity.type,
    status: entity.status,
    country_or_origin: entity.country_or_origin ?? null,
    confidence: entity.confidence ?? null,
    last_verified_at: entity.last_verified_at ?? null,
    official_domain_original: entity.official_domain_original ?? null,
  }))

const invalidType = entities
  .filter((entity) => entity.country_or_origin !== null && entity.country_or_origin !== undefined && typeof entity.country_or_origin !== 'string')
  .map((entity) => ({
    id: entity.id,
    canonical_name: entity.canonical_name,
    value: entity.country_or_origin,
  }))

const statusCounts = missing.reduce((counts, entity) => {
  const key = entity.status ?? 'unknown'
  counts[key] = (counts[key] ?? 0) + 1
  return counts
}, {})

const result = {
  entities: entities.length,
  missing_country_or_origin: missing.length,
  invalid_type: invalidType.length,
  status_counts: statusCounts,
  missing,
  invalid_type_records: invalidType,
}

if (jsonOutput) {
  console.log(JSON.stringify(result, null, 2))
} else {
  console.log(`Entities: ${result.entities}`)
  console.log(`Missing country_or_origin: ${result.missing_country_or_origin}`)
  console.log(`Invalid country_or_origin type: ${result.invalid_type}`)
  console.log(`Missing by status: ${JSON.stringify(result.status_counts)}`)
  for (const entity of missing) {
    console.log([
      entity.id,
      entity.slug,
      entity.canonical_name,
      entity.type,
      entity.status,
      entity.country_or_origin ?? '<null>',
      entity.confidence ?? '<null>',
      entity.last_verified_at ?? '<null>',
      entity.official_domain_original ?? '<null>',
    ].join('\t'))
  }
}

if (strict && (missing.length > 0 || invalidType.length > 0)) {
  process.exit(1)
}
