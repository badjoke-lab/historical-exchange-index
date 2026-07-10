import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

function assert(condition, message) {
  if (!condition) throw new Error(`copy overlay runtime test failed: ${message}`)
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
}

const localeConfig = readJson('config/i18n-locales.json')
const overlaySchema = readJson('config/i18n-overlay-schema.json')
const canonicalEntities = readJson('data/entities.json')
const japaneseEntities = readJson('data-i18n/ja/entities-copy.json')
const japaneseEvents = readJson('data-i18n/ja/events-copy.json')

const expectedSampleSlugs = ['mt-gox', 'ftx', 'quadrigacx', 'btc-e', 'cryptopia']
const actualSlugs = Object.keys(japaneseEntities.records).sort()
assert(JSON.stringify(actualSlugs) === JSON.stringify([...expectedSampleSlugs].sort()), 'Japanese entity sample slug set mismatch')
assert(Object.keys(japaneseEvents.records).length === 0, 'A1 must not add unreviewed Japanese event copy')

assert(JSON.stringify([...overlaySchema.public_locales].sort()) === JSON.stringify([...localeConfig.public_locales].sort()), 'overlay schema public locales are stale')
assert(localeConfig.public_locales.includes('ja'), 'Japanese is not public in active locale contract')

const bySlug = new Map(canonicalEntities.map((entity) => [entity.slug, entity]))
for (const slug of expectedSampleSlugs) {
  const canonical = bySlug.get(slug)
  const localized = japaneseEntities.records[slug]
  assert(canonical, `canonical entity missing for ${slug}`)
  assert(localized && typeof localized.summary === 'string' && localized.summary.trim(), `localized summary missing for ${slug}`)
  for (const key of Object.keys(localized)) {
    assert(overlaySchema.entity_overlay.allowed_fields.includes(key), `disallowed localized entity field ${slug}.${key}`)
    assert(!overlaySchema.entity_overlay.forbidden_fields.includes(key), `forbidden canonical field leaked into overlay ${slug}.${key}`)
  }
  assert(localized.summary !== canonical.summary, `${slug} localized summary unexpectedly equals canonical English summary`)
}

const dossierSource = readText('src/app/ja/exchange/[slug]/page.tsx')
const loaderSource = readText('src/lib/i18n/get-copy-overlays.ts')
const localeTypeSource = readText('src/i18n/config.ts')

assert(dossierSource.includes("getEntityCopy('ja', entity.slug)"), 'Japanese dossier does not load entity overlay copy')
assert(dossierSource.includes("getEventCopy('ja', event.id)"), 'Japanese dossier does not load event overlay copy')
assert(dossierSource.includes('mergeEntityCopy(entity'), 'Japanese dossier does not apply safe entity copy merge')
assert(dossierSource.includes('mergeEventCopy(event'), 'Japanese dossier does not apply safe event copy merge')
assert(dossierSource.includes('localizedEntity.summary'), 'Japanese dossier does not render localized entity summary')
assert(dossierSource.includes('localizedEvents.map'), 'Japanese dossier does not render localized event collection')

assert(loaderSource.includes('data-i18n/ja/entities-copy.json'), 'static Japanese entity overlay import missing')
assert(loaderSource.includes('data-i18n/ja/events-copy.json'), 'static Japanese event overlay import missing')
assert(loaderSource.includes('getEntityCopy'), 'entity copy loader missing')
assert(loaderSource.includes('getEventCopy'), 'event copy loader missing')
assert(localeTypeSource.includes("export type PublicLocale = 'en' | 'ja'"), 'PublicLocale type is stale')

const untranslatedSlug = canonicalEntities.find((entity) => !expectedSampleSlugs.includes(entity.slug))?.slug
assert(untranslatedSlug, 'could not find fallback sample entity')
assert(japaneseEntities.records[untranslatedSlug] === undefined, 'fallback sample unexpectedly has localized copy')

console.log(`L1-5 copy overlay runtime tests passed: ${expectedSampleSlugs.length} reviewed entity summaries, 0 event overlays, canonical-field isolation, static loader wiring, and fallback sample verified.`)
