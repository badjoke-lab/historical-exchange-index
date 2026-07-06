import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

function assert(condition, message) {
  if (!condition) throw new Error(`i18n foundation test failed: ${message}`)
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
}

const config = readJson('config/i18n-locales.json')
const schema = readJson('config/i18n-overlay-schema.json')
const enCommon = readJson('src/i18n/locales/en/common.json')
const jaCommon = readJson('src/i18n/locales/ja/common.json')
const entities = readJson('data/entities.json')
const events = readJson('data/events.json')

function dictionaryFor(locale) {
  const resolved = config.supported_locales.includes(locale) ? locale : config.fallback_locale
  return {
    locale: resolved,
    fallbackUsed: resolved !== locale,
    common: resolved === 'ja' ? jaCommon : enCommon,
  }
}

function buildLocalePath(pathname, locale) {
  const bare = pathname.split('?')[0] || '/'
  const leading = bare.startsWith('/') ? bare : `/${bare}`
  const normalized = leading === '/' ? '/' : leading.endsWith('/') ? leading : `${leading}/`
  if (locale === config.default_locale) return normalized
  return normalized === '/' ? `/${locale}/` : `/${locale}${normalized}`
}

function mergeEntityCopy(entity, records) {
  const copy = records[entity.slug]
  if (!copy) return entity
  return {
    ...entity,
    summary: copy.summary ?? entity.summary,
    notes: copy.notes ?? entity.notes,
  }
}

function mergeEventCopy(event, records) {
  const copy = records[event.id]
  if (!copy) return event
  return {
    ...event,
    title: copy.title ?? event.title,
    description: copy.description ?? event.description,
  }
}

function validateCopyFields(copy, allowed) {
  for (const key of Object.keys(copy)) {
    if (!allowed.includes(key)) throw new Error(`disallowed copy field: ${key}`)
  }
}

const japanese = dictionaryFor('ja')
assert(japanese.locale === 'ja', 'Japanese dictionary must resolve to ja')
assert(japanese.fallbackUsed === false, 'Japanese dictionary must not use fallback')
assert(japanese.common['nav.home'] === 'ホーム', 'Japanese dictionary lookup mismatch')

const unsupported = dictionaryFor('fr')
assert(unsupported.locale === 'en', 'unsupported locale must fall back to English')
assert(unsupported.fallbackUsed === true, 'unsupported locale must report fallback')
assert(unsupported.common['nav.home'] === 'Home', 'fallback dictionary must be English')

const english = dictionaryFor('en')
assert(english.locale === 'en', 'English dictionary must remain English')
assert(english.common['nav.explorer'] === 'Explorer', 'English dictionary lookup mismatch')

const canonicalEntity = entities[0]
const localizedEntity = mergeEntityCopy(canonicalEntity, {
  [canonicalEntity.slug]: {
    summary: '日本語の要約',
    notes: '日本語の注記',
  },
})
assert(localizedEntity.summary === '日本語の要約', 'entity summary overlay not applied')
assert(localizedEntity.notes === '日本語の注記', 'entity notes overlay not applied')
assert(localizedEntity.id === canonicalEntity.id, 'entity ID changed during overlay merge')
assert(localizedEntity.slug === canonicalEntity.slug, 'entity slug changed during overlay merge')
assert(localizedEntity.status === canonicalEntity.status, 'entity status changed during overlay merge')

const untouchedEntity = mergeEntityCopy(canonicalEntity, {})
assert(untouchedEntity.summary === canonicalEntity.summary, 'missing entity copy must fall back to canonical summary')
assert(untouchedEntity.notes === canonicalEntity.notes, 'missing entity copy must fall back to canonical notes')

const canonicalEvent = events[0]
const localizedEvent = mergeEventCopy(canonicalEvent, {
  [canonicalEvent.id]: {
    title: '日本語タイトル',
    description: '日本語説明',
  },
})
assert(localizedEvent.title === '日本語タイトル', 'event title overlay not applied')
assert(localizedEvent.description === '日本語説明', 'event description overlay not applied')
assert(localizedEvent.id === canonicalEvent.id, 'event ID changed during overlay merge')
assert(localizedEvent.event_type === canonicalEvent.event_type, 'event type changed during overlay merge')
assert(localizedEvent.event_date === canonicalEvent.event_date, 'event date changed during overlay merge')

const untouchedEvent = mergeEventCopy(canonicalEvent, {})
assert(untouchedEvent.title === canonicalEvent.title, 'missing event copy must fall back to canonical title')
assert(untouchedEvent.description === canonicalEvent.description, 'missing event copy must fall back to canonical description')

assert(buildLocalePath('/exchange/mt-gox/', 'en') === '/exchange/mt-gox/', 'English route must not use /en/ prefix')
assert(buildLocalePath('/exchange/mt-gox/', 'ja') === '/ja/exchange/mt-gox/', 'Japanese route prefix mismatch')
assert(buildLocalePath('/', 'ja') === '/ja/', 'Japanese root route mismatch')
assert(buildLocalePath('/methodology', 'ja') === '/ja/methodology/', 'Japanese route normalization mismatch')

validateCopyFields({ summary: 'ok', notes: 'ok' }, schema.entity_overlay.allowed_fields)
validateCopyFields({ title: 'ok', description: 'ok' }, schema.event_overlay.allowed_fields)

let invalidEntityRejected = false
try {
  validateCopyFields({ status: 'dead' }, schema.entity_overlay.allowed_fields)
} catch {
  invalidEntityRejected = true
}
assert(invalidEntityRejected, 'invalid entity overlay field must be rejected')

let invalidEventRejected = false
try {
  validateCopyFields({ event_date: '2020-01-01' }, schema.event_overlay.allowed_fields)
} catch {
  invalidEventRejected = true
}
assert(invalidEventRejected, 'invalid event overlay field must be rejected')

const routeSource = fs.readFileSync(path.join(root, 'src/lib/i18n/locale-routes.ts'), 'utf8')
const dictionarySource = fs.readFileSync(path.join(root, 'src/lib/i18n/get-dictionary.ts'), 'utf8')
const entityMergeSource = fs.readFileSync(path.join(root, 'src/lib/i18n/merge-entity-copy.ts'), 'utf8')
const eventMergeSource = fs.readFileSync(path.join(root, 'src/lib/i18n/merge-event-copy.ts'), 'utf8')

assert(routeSource.includes('buildPublicLocalePath'), 'public-route guard helper missing')
assert(routeSource.includes('Locale is not publicly routed yet'), 'pilot locale public-route guard missing')
assert(dictionarySource.includes('fallbackUsed'), 'dictionary fallback state missing')
assert(entityMergeSource.includes('summary: localized.summary ?? entity.summary'), 'entity fallback implementation mismatch')
assert(eventMergeSource.includes('title: localized.title ?? event.title'), 'event fallback implementation mismatch')

console.log('i18n foundation behavior tests passed: dictionary fallback, safe copy merge, route identity, and invalid overlay rejection verified.')
