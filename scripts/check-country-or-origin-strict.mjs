import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { loadReviewedBundles } from './lib/reviewed-bundle-aggregation.mjs'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'

const UNKNOWN_TOKENS = new Set(['unknown', 'tbd', 'n/a', 'na', 'unset'])
const CANONICAL_UNKNOWN = 'unknown'

const isObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value)
const isNonEmptyString = (value) => typeof value === 'string' && value.trim() !== ''
const normalizeToken = (value) => typeof value === 'string' ? value.trim().toLowerCase() : null
const isMissing = (value) => value === null || value === undefined || (typeof value === 'string' && value.trim() === '')
const isUnknownToken = (value) => UNKNOWN_TOKENS.has(normalizeToken(value))

const summarizeEntity = (entity, canonicalIds = new Set()) => ({
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

export function validateAllowlistDocument(document) {
  const errors = []
  const entries = []

  if (!isObject(document)) {
    return { entries, errors: ['allowlist root must be an object'] }
  }

  if (document.schema_version !== 1) errors.push('allowlist schema_version must be 1')
  if (!isNonEmptyString(document.reviewed_at)) errors.push('allowlist reviewed_at must be a non-empty string')
  if (!isNonEmptyString(document.audit_document)) errors.push('allowlist audit_document must be a non-empty string')
  if (!Array.isArray(document.entities)) {
    errors.push('allowlist entities must be an array')
    return { entries, errors }
  }

  const seenIds = new Set()
  const seenSlugs = new Set()

  document.entities.forEach((entry, index) => {
    const label = `allowlist entities[${index}]`
    if (!isObject(entry)) {
      errors.push(`${label} must be an object`)
      return
    }

    if (!isNonEmptyString(entry.id) || !/^hei_ex_\d{6}$/.test(entry.id)) {
      errors.push(`${label}.id must match hei_ex_######`)
    }
    if (!isNonEmptyString(entry.slug)) errors.push(`${label}.slug must be a non-empty string`)
    if (!isNonEmptyString(entry.canonical_name)) errors.push(`${label}.canonical_name must be a non-empty string`)

    if (isNonEmptyString(entry.id)) {
      if (seenIds.has(entry.id)) errors.push(`duplicate allowlist id: ${entry.id}`)
      seenIds.add(entry.id)
    }
    if (isNonEmptyString(entry.slug)) {
      if (seenSlugs.has(entry.slug)) errors.push(`duplicate allowlist slug: ${entry.slug}`)
      seenSlugs.add(entry.slug)
    }

    entries.push({
      id: entry.id,
      slug: entry.slug,
      canonical_name: entry.canonical_name,
    })
  })

  return { entries, errors }
}

export function evaluateCountryOriginGate({ entities, canonicalIds = new Set(), allowlistDocument }) {
  const { entries: allowlistEntries, errors: allowlistErrors } = validateAllowlistDocument(allowlistDocument)
  const entityById = new Map(entities.map((entity) => [entity.id, entity]))
  const allowlistById = new Map(allowlistEntries.map((entry) => [entry.id, entry]))

  const missing = entities.filter((entity) => isMissing(entity.country_or_origin)).map((entity) => summarizeEntity(entity, canonicalIds))
  const invalidType = entities
    .filter((entity) => !isMissing(entity.country_or_origin) && typeof entity.country_or_origin !== 'string')
    .map((entity) => ({
      id: entity.id,
      source_layer: canonicalIds.has(entity.id) ? 'canonical' : 'reviewed_bundle',
      canonical_name: entity.canonical_name,
      value: entity.country_or_origin,
    }))
  const explicitUnknown = entities.filter((entity) => isUnknownToken(entity.country_or_origin))
  const nonCanonicalUnknownTokens = explicitUnknown
    .filter((entity) => normalizeToken(entity.country_or_origin) !== CANONICAL_UNKNOWN)
    .map((entity) => summarizeEntity(entity, canonicalIds))

  const unreviewedUnknown = explicitUnknown
    .filter((entity) => !allowlistById.has(entity.id))
    .map((entity) => summarizeEntity(entity, canonicalIds))

  const staleAllowlist = allowlistEntries
    .filter((entry) => {
      const entity = entityById.get(entry.id)
      return !entity || normalizeToken(entity.country_or_origin) !== CANONICAL_UNKNOWN
    })
    .map((entry) => {
      const entity = entityById.get(entry.id)
      return {
        ...entry,
        actual_country_or_origin: entity?.country_or_origin ?? null,
        reason: entity ? 'allowlisted entity is no longer canonical Unknown' : 'allowlisted entity is missing',
      }
    })

  const allowlistMetadataMismatches = allowlistEntries
    .flatMap((entry) => {
      const entity = entityById.get(entry.id)
      if (!entity) return []
      const mismatches = []
      if (entity.slug !== entry.slug) {
        mismatches.push({ id: entry.id, field: 'slug', expected: entry.slug, actual: entity.slug })
      }
      if (entity.canonical_name !== entry.canonical_name) {
        mismatches.push({ id: entry.id, field: 'canonical_name', expected: entry.canonical_name, actual: entity.canonical_name })
      }
      return mismatches
    })

  const reviewedUnknown = explicitUnknown
    .filter((entity) => allowlistById.has(entity.id) && normalizeToken(entity.country_or_origin) === CANONICAL_UNKNOWN)
    .map((entity) => summarizeEntity(entity, canonicalIds))

  const pendingReviewTotal =
    missing.length
    + invalidType.length
    + nonCanonicalUnknownTokens.length
    + unreviewedUnknown.length
    + staleAllowlist.length
    + allowlistMetadataMismatches.length
    + allowlistErrors.length

  const strictGatePasses = pendingReviewTotal === 0

  return {
    generated_at: new Date().toISOString(),
    projected_public_entities: entities.length,
    missing_country_or_origin: missing.length,
    invalid_type: invalidType.length,
    explicit_unknown_country_or_origin: explicitUnknown.length,
    reviewed_unknown_allowlist_count: allowlistEntries.length,
    reviewed_explicit_unknown: reviewedUnknown.length,
    pending_explicit_unknown_review: unreviewedUnknown.length,
    noncanonical_unknown_tokens: nonCanonicalUnknownTokens.length,
    stale_allowlist_entries: staleAllowlist.length,
    allowlist_metadata_mismatches: allowlistMetadataMismatches.length,
    allowlist_validation_errors: allowlistErrors.length,
    pending_review_total: pendingReviewTotal,
    strict_gate_passes: strictGatePasses,
    missing,
    invalid_type_records: invalidType,
    explicit_unknown: explicitUnknown.map((entity) => summarizeEntity(entity, canonicalIds)),
    reviewed_unknown: reviewedUnknown,
    unreviewed_unknown: unreviewedUnknown,
    noncanonical_unknown_token_records: nonCanonicalUnknownTokens,
    stale_allowlist: staleAllowlist,
    metadata_mismatches: allowlistMetadataMismatches,
    allowlist_errors: allowlistErrors,
  }
}

function assertSelfTest(condition, message) {
  if (!condition) throw new Error(`country/origin strict gate self-test failed: ${message}`)
}

function runSelfTest() {
  const baseEntity = {
    id: 'hei_ex_000001',
    slug: 'example',
    canonical_name: 'Example',
    type: 'cex',
    status: 'inactive',
    country_or_origin: 'Unknown',
  }
  const allowlist = {
    schema_version: 1,
    reviewed_at: '2026-06-20',
    audit_document: 'docs/audit.md',
    entities: [{ id: baseEntity.id, slug: baseEntity.slug, canonical_name: baseEntity.canonical_name }],
  }

  const valid = evaluateCountryOriginGate({ entities: [baseEntity], allowlistDocument: allowlist })
  assertSelfTest(valid.strict_gate_passes, 'valid reviewed Unknown should pass')

  const missing = evaluateCountryOriginGate({ entities: [{ ...baseEntity, country_or_origin: null }], allowlistDocument: { ...allowlist, entities: [] } })
  assertSelfTest(!missing.strict_gate_passes && missing.missing_country_or_origin === 1, 'missing origin should fail')

  const unreviewed = evaluateCountryOriginGate({ entities: [baseEntity], allowlistDocument: { ...allowlist, entities: [] } })
  assertSelfTest(!unreviewed.strict_gate_passes && unreviewed.pending_explicit_unknown_review === 1, 'unreviewed Unknown should fail')

  const stale = evaluateCountryOriginGate({ entities: [{ ...baseEntity, country_or_origin: 'Japan' }], allowlistDocument: allowlist })
  assertSelfTest(!stale.strict_gate_passes && stale.stale_allowlist_entries === 1, 'stale allowlist entry should fail')

  const token = evaluateCountryOriginGate({ entities: [{ ...baseEntity, country_or_origin: 'TBD' }], allowlistDocument: allowlist })
  assertSelfTest(!token.strict_gate_passes && token.noncanonical_unknown_tokens === 1, 'noncanonical Unknown token should fail')

  const metadata = evaluateCountryOriginGate({
    entities: [baseEntity],
    allowlistDocument: { ...allowlist, entities: [{ ...allowlist.entities[0], slug: 'wrong' }] },
  })
  assertSelfTest(!metadata.strict_gate_passes && metadata.allowlist_metadata_mismatches === 1, 'allowlist metadata mismatch should fail')

  console.log('country/origin strict gate self-test passed')
}

function loadJson(filePath, label) {
  if (!fs.existsSync(filePath)) throw new Error(`Missing ${label}: ${path.relative(process.cwd(), filePath)}`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function main() {
  if (process.argv.includes('--self-test')) {
    runSelfTest()
    return
  }

  const root = process.cwd()
  const entitiesPath = path.join(root, 'data/entities.json')
  const allowlistArg = process.argv.find((arg) => arg.startsWith('--allowlist='))
  const allowlistPath = allowlistArg
    ? path.resolve(root, allowlistArg.slice('--allowlist='.length))
    : path.join(root, 'config/reviewed-unknown-origins.json')
  const outputArg = process.argv.find((arg) => arg.startsWith('--output='))
  const outputPath = outputArg ? path.resolve(root, outputArg.slice('--output='.length)) : null

  const canonicalEntities = loadJson(entitiesPath, 'data/entities.json')
  const canonicalIds = new Set(canonicalEntities.map((entity) => entity.id))
  const { all: reviewedBundles, newEntityBundles } = loadReviewedBundles(root, canonicalEntities)
  const correctedCanonicalEntities = applyReviewedEntityCorrections(canonicalEntities, reviewedBundles)
  const entities = [
    ...correctedCanonicalEntities,
    ...newEntityBundles.map(({ bundle }) => bundle.entity),
  ]
  const allowlistDocument = loadJson(allowlistPath, 'reviewed Unknown origin allowlist')

  const report = {
    allowlist_path: path.relative(root, allowlistPath),
    ...evaluateCountryOriginGate({ entities, canonicalIds, allowlistDocument }),
  }
  const serialized = `${JSON.stringify(report, null, 2)}\n`

  if (outputPath) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, serialized, 'utf8')
    console.log(`Wrote strict country/origin report to ${path.relative(root, outputPath)}`)
  }

  if (process.argv.includes('--json')) {
    console.log(serialized.trimEnd())
  } else {
    console.log(`Projected public entities: ${report.projected_public_entities}`)
    console.log(`Missing country_or_origin: ${report.missing_country_or_origin}`)
    console.log(`Invalid country_or_origin type: ${report.invalid_type}`)
    console.log(`Explicit Unknown country_or_origin: ${report.explicit_unknown_country_or_origin}`)
    console.log(`Reviewed Unknown allowlist: ${report.reviewed_unknown_allowlist_count}`)
    console.log(`Reviewed explicit Unknown: ${report.reviewed_explicit_unknown}`)
    console.log(`Pending explicit Unknown review: ${report.pending_explicit_unknown_review}`)
    console.log(`Noncanonical Unknown tokens: ${report.noncanonical_unknown_tokens}`)
    console.log(`Stale allowlist entries: ${report.stale_allowlist_entries}`)
    console.log(`Allowlist metadata mismatches: ${report.allowlist_metadata_mismatches}`)
    console.log(`Allowlist validation errors: ${report.allowlist_validation_errors}`)
    console.log(`Strict gate passes: ${report.strict_gate_passes}`)
  }

  if (!report.strict_gate_passes) process.exit(1)
}

main()
