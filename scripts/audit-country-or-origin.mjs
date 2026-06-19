import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { loadReviewedBundles } from './lib/reviewed-bundle-aggregation.mjs'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'

const root = process.cwd()
const entitiesPath = path.join(root, 'data/entities.json')
const strict = process.argv.includes('--strict')
const strictUnknown = process.argv.includes('--strict-unknown')
const jsonOutput = process.argv.includes('--json')
const outputArg = process.argv.find((arg) => arg.startsWith('--output='))
const outputPath = outputArg ? path.resolve(root, outputArg.slice('--output='.length)) : null

if (!fs.existsSync(entitiesPath)) {
  console.error('Missing data/entities.json')
  process.exit(1)
}

const canonicalEntities = JSON.parse(fs.readFileSync(entitiesPath, 'utf8'))
const canonicalIds = new Set(canonicalEntities.map((entity) => entity.id))
const { all: reviewedBundles, newEntityBundles } = loadReviewedBundles(root, canonicalEntities)
const correctedCanonicalEntities = applyReviewedEntityCorrections(canonicalEntities, reviewedBundles)
const entities = [
  ...correctedCanonicalEntities,
  ...newEntityBundles.map(({ bundle }) => bundle.entity),
]

const explicitUnknownTokens = new Set(['unknown', 'tbd', 'n/a', 'na', 'unset'])

const isMissing = (value) => {
  if (value === null || value === undefined) return true
  if (typeof value !== 'string') return false
  return value.trim() === ''
}

const isExplicitUnknown = (value) => {
  if (typeof value !== 'string') return false
  return explicitUnknownTokens.has(value.trim().toLowerCase())
}

const summarizeEntity = (entity) => ({
  id: entity.id,
  source_layer: canonicalIds.has(entity.id) ? 'canonical' : 'reviewed_bundle',
  slug: entity.slug,
  canonical_name: entity.canonical_name,
  type: entity.type,
  status: entity.status,
  country_or_origin: entity.country_or_origin ?? null,
  confidence: entity.confidence ?? null,
  last_verified_at: entity.last_verified_at ?? null,
  official_domain_original: entity.official_domain_original ?? null,
})

const missing = entities.filter((entity) => isMissing(entity.country_or_origin)).map(summarizeEntity)
const explicitUnknown = entities.filter((entity) => isExplicitUnknown(entity.country_or_origin)).map(summarizeEntity)

const invalidType = entities
  .filter((entity) => entity.country_or_origin !== null && entity.country_or_origin !== undefined && typeof entity.country_or_origin !== 'string')
  .map((entity) => ({
    id: entity.id,
    source_layer: canonicalIds.has(entity.id) ? 'canonical' : 'reviewed_bundle',
    canonical_name: entity.canonical_name,
    value: entity.country_or_origin,
  }))

const countBy = (items, field) => items.reduce((counts, entity) => {
  const key = entity[field] ?? 'unknown'
  counts[key] = (counts[key] ?? 0) + 1
  return counts
}, {})

const result = {
  generated_at: new Date().toISOString(),
  canonical_entities: canonicalEntities.length,
  reviewed_bundle_entities: newEntityBundles.length,
  projected_public_entities: entities.length,
  missing_country_or_origin: missing.length,
  explicit_unknown_country_or_origin: explicitUnknown.length,
  review_queue_total: missing.length + explicitUnknown.length + invalidType.length,
  invalid_type: invalidType.length,
  missing_status_counts: countBy(missing, 'status'),
  missing_source_layer_counts: countBy(missing, 'source_layer'),
  explicit_unknown_status_counts: countBy(explicitUnknown, 'status'),
  missing,
  explicit_unknown: explicitUnknown,
  invalid_type_records: invalidType,
}

const serialized = `${JSON.stringify(result, null, 2)}\n`

if (outputPath) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, serialized, 'utf8')
  console.log(`Wrote country_or_origin audit to ${path.relative(root, outputPath)}`)
}

if (jsonOutput) {
  console.log(serialized.trimEnd())
} else {
  console.log(`Canonical entities: ${result.canonical_entities}`)
  console.log(`Reviewed-bundle entities: ${result.reviewed_bundle_entities}`)
  console.log(`Projected public entities: ${result.projected_public_entities}`)
  console.log(`Missing country_or_origin: ${result.missing_country_or_origin}`)
  console.log(`Explicit Unknown country_or_origin: ${result.explicit_unknown_country_or_origin}`)
  console.log(`Invalid country_or_origin type: ${result.invalid_type}`)
  console.log(`Review queue total: ${result.review_queue_total}`)
  console.log(`Missing by status: ${JSON.stringify(result.missing_status_counts)}`)
  console.log(`Missing by source layer: ${JSON.stringify(result.missing_source_layer_counts)}`)
  for (const entity of missing) {
    console.log([
      'MISSING',
      entity.id,
      entity.source_layer,
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
  for (const entity of explicitUnknown) {
    console.log([
      'EXPLICIT_UNKNOWN',
      entity.id,
      entity.source_layer,
      entity.slug,
      entity.canonical_name,
      entity.type,
      entity.status,
      entity.country_or_origin,
      entity.confidence ?? '<null>',
      entity.last_verified_at ?? '<null>',
      entity.official_domain_original ?? '<null>',
    ].join('\t'))
  }
}

const strictFailure = missing.length > 0 || invalidType.length > 0 || (strictUnknown && explicitUnknown.length > 0)
if (strict && strictFailure) process.exit(1)
