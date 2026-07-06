import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

function fail(message) {
  throw new Error(`i18n foundation validation failed: ${message}`)
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

function sorted(values) {
  return [...values].sort((a, b) => a.localeCompare(b))
}

function sameStringSet(actual, expected, label) {
  const actualSorted = sorted(actual)
  const expectedSorted = sorted(expected)
  assert(
    JSON.stringify(actualSorted) === JSON.stringify(expectedSorted),
    `${label} mismatch: actual=${JSON.stringify(actualSorted)} expected=${JSON.stringify(expectedSorted)}`,
  )
}

function extractUnionValues(source, typeName) {
  const pattern = new RegExp(`export type ${typeName}\\s*=([\\s\\S]*?)(?:\\n\\n|export interface)`)
  const match = source.match(pattern)
  assert(match, `cannot find type union ${typeName}`)
  return [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1])
}

function expectedEnumKeys() {
  const entitySource = readText('src/lib/types/entity.ts')
  const eventSource = readText('src/lib/types/event.ts')

  const exchangeTypes = extractUnionValues(entitySource, 'ExchangeType')
  const statuses = extractUnionValues(entitySource, 'ExchangeStatus')
  const deathReasons = extractUnionValues(entitySource, 'DeathReason')
  const urlStatuses = extractUnionValues(entitySource, 'UrlStatus')
  const confidence = extractUnionValues(entitySource, 'Confidence')
  const eventTypes = extractUnionValues(eventSource, 'EventType')
  const impactLevels = extractUnionValues(eventSource, 'ImpactLevel')

  return [
    ...exchangeTypes.map((value) => `exchangeType.${value}`),
    ...statuses.map((value) => `status.${value}`),
    ...deathReasons.map((value) => `deathReason.${value}`),
    ...urlStatuses.map((value) => `officialUrlStatus.${value}`),
    ...confidence.map((value) => `confidence.${value}`),
    ...eventTypes.map((value) => `eventType.${value}`),
    ...impactLevels.map((value) => `impactLevel.${value}`),
    'eventStatusEffect.none',
    ...statuses.map((value) => `eventStatusEffect.${value}`),
  ]
}

function validateOverlay({ locale, kind, overlay, schema, canonicalIds }) {
  assert(overlay.schema_version === schema.version, `${locale}/${kind} schema_version mismatch`)
  assert(overlay.locale === locale, `${locale}/${kind} locale metadata mismatch`)
  assert(overlay.records && typeof overlay.records === 'object' && !Array.isArray(overlay.records), `${locale}/${kind} records must be an object`)

  const contract = kind === 'entities-copy' ? schema.entity_overlay : schema.event_overlay
  const allowed = new Set(contract.allowed_fields)
  const forbidden = new Set(contract.forbidden_fields)

  for (const [recordId, copy] of Object.entries(overlay.records)) {
    assert(canonicalIds.has(recordId), `${locale}/${kind} unknown canonical identifier: ${recordId}`)
    assert(copy && typeof copy === 'object' && !Array.isArray(copy), `${locale}/${kind}:${recordId} copy must be an object`)

    for (const [field, value] of Object.entries(copy)) {
      assert(allowed.has(field), `${locale}/${kind}:${recordId} disallowed field: ${field}`)
      assert(!forbidden.has(field), `${locale}/${kind}:${recordId} forbidden canonical field: ${field}`)
      assert(typeof value === 'string' && value.trim().length > 0, `${locale}/${kind}:${recordId}:${field} must be a non-empty string`)
    }
  }
}

const localeConfig = readJson('config/i18n-locales.json')
const overlaySchema = readJson('config/i18n-overlay-schema.json')
const entities = readJson('data/entities.json')
const events = readJson('data/events.json')

assert(localeConfig.version === 1, 'locale config version must be 1')
assert(localeConfig.default_locale === 'en', 'default locale must be en')
assert(localeConfig.fallback_locale === 'en', 'fallback locale must be en')
sameStringSet(localeConfig.supported_locales, ['en', 'ja'], 'supported locales')
sameStringSet(localeConfig.public_locales, ['en'], 'public locales in F-1')
sameStringSet(localeConfig.pilot_locales, ['ja'], 'pilot locales in F-1')

for (const locale of localeConfig.public_locales) {
  assert(localeConfig.supported_locales.includes(locale), `public locale is not supported: ${locale}`)
}
for (const locale of localeConfig.pilot_locales) {
  assert(localeConfig.supported_locales.includes(locale), `pilot locale is not supported: ${locale}`)
  assert(!localeConfig.public_locales.includes(locale), `pilot locale must not be public during F-1: ${locale}`)
}

assert(overlaySchema.version === 1, 'overlay schema version must be 1')
assert(overlaySchema.default_locale === localeConfig.default_locale, 'overlay/default locale mismatch')
assert(overlaySchema.fallback_locale === undefined || overlaySchema.fallback_locale === localeConfig.fallback_locale, 'overlay/fallback locale mismatch')
sameStringSet(overlaySchema.supported_locales, localeConfig.supported_locales, 'overlay supported locales')
sameStringSet(overlaySchema.entity_overlay.allowed_fields, ['summary', 'notes'], 'entity overlay allowed fields')
sameStringSet(overlaySchema.event_overlay.allowed_fields, ['title', 'description'], 'event overlay allowed fields')

const entitySlugs = new Set(entities.map((entity) => entity.slug))
const eventIds = new Set(events.map((event) => event.id))
const expectedEnums = expectedEnumKeys()
const defaultCommon = readJson('src/i18n/locales/en/common.json')
const defaultEnums = readJson('src/i18n/locales/en/enums.json')

sameStringSet(Object.keys(defaultEnums), expectedEnums, 'English enum dictionary keys')

for (const locale of localeConfig.supported_locales) {
  const common = readJson(`src/i18n/locales/${locale}/common.json`)
  const enums = readJson(`src/i18n/locales/${locale}/enums.json`)
  sameStringSet(Object.keys(common), Object.keys(defaultCommon), `${locale} common dictionary keys`)
  sameStringSet(Object.keys(enums), Object.keys(defaultEnums), `${locale} enum dictionary keys`)

  for (const [key, value] of Object.entries(common)) {
    assert(typeof value === 'string' && value.trim().length > 0, `${locale} common dictionary has empty value: ${key}`)
  }
  for (const [key, value] of Object.entries(enums)) {
    assert(typeof value === 'string' && value.trim().length > 0, `${locale} enum dictionary has empty value: ${key}`)
  }

  const entityOverlay = readJson(`data-i18n/${locale}/entities-copy.json`)
  const eventOverlay = readJson(`data-i18n/${locale}/events-copy.json`)
  validateOverlay({ locale, kind: 'entities-copy', overlay: entityOverlay, schema: overlaySchema, canonicalIds: entitySlugs })
  validateOverlay({ locale, kind: 'events-copy', overlay: eventOverlay, schema: overlaySchema, canonicalIds: eventIds })
}

const configSource = readText('src/i18n/config.ts')
assert(configSource.includes("../../config/i18n-locales.json"), 'TypeScript locale config must read shared JSON contract')
assert(configSource.includes('publicLocales'), 'TypeScript locale config must distinguish public locales')
assert(configSource.includes('pilotLocales'), 'TypeScript locale config must distinguish pilot locales')

const entityMergeSource = readText('src/lib/i18n/merge-entity-copy.ts')
const eventMergeSource = readText('src/lib/i18n/merge-event-copy.ts')
for (const forbidden of overlaySchema.entity_overlay.forbidden_fields) {
  assert(!entityMergeSource.includes(`localized.${forbidden}`), `entity merge utility may override forbidden field: ${forbidden}`)
}
for (const forbidden of overlaySchema.event_overlay.forbidden_fields) {
  assert(!eventMergeSource.includes(`localized.${forbidden}`), `event merge utility may override forbidden field: ${forbidden}`)
}

console.log(`Validated i18n foundation: ${localeConfig.supported_locales.length} supported locales, ${localeConfig.public_locales.length} public locale, ${localeConfig.pilot_locales.length} pilot locale, ${expectedEnums.length} enum labels, safe empty overlay seeds.`)
