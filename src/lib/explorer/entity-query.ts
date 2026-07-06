import contractJson from '../../../config/explorer-query-contract.json'
import type { Confidence, DeathReason, EntityRecord, ExchangeStatus, ExchangeType, UrlStatus } from '../types/entity'

type EntitySort =
  | 'name_asc'
  | 'name_desc'
  | 'launch_oldest'
  | 'launch_newest'
  | 'death_oldest'
  | 'death_newest'
  | 'last_verified_newest'

export type ArchiveAvailable = '' | 'true' | 'false'

export interface EntityExplorerState {
  view: 'entities'
  q: string
  type: ExchangeType[]
  status: ExchangeStatus[]
  death_reason: Exclude<DeathReason, null>[]
  launch_from: string
  launch_to: string
  death_from: string
  death_to: string
  official_url_status: UrlStatus[]
  archive_available: ArchiveAvailable
  confidence: Confidence[]
  country_or_origin: string[]
  sort: EntitySort
}

type ParameterDefinition = {
  key: string
  kind: 'text' | 'enum' | 'date' | 'boolean' | 'reviewed_value'
  cardinality: 'single' | 'multi'
  values?: string[]
}

type QueryContract = {
  view_parameter: {
    key: string
    values: string[]
    default: string
  }
  text_search: {
    max_code_points: number
  }
  date_semantics: {
    from_year_expansion: string
    to_year_expansion: string
  }
  views: {
    entities: {
      default_sort: EntitySort
      parameters: ParameterDefinition[]
    }
  }
}

const contract = contractJson as QueryContract
const entityContract = contract.views.entities
const definitions = new Map(entityContract.parameters.map((parameter) => [parameter.key, parameter]))

export const ENTITY_DEFAULT_SORT = entityContract.default_sort

export const ENTITY_FILTER_VALUES = {
  type: getEnumValues<ExchangeType>('type'),
  status: getEnumValues<ExchangeStatus>('status'),
  death_reason: getEnumValues<Exclude<DeathReason, null>>('death_reason'),
  official_url_status: getEnumValues<UrlStatus>('official_url_status'),
  confidence: getEnumValues<Confidence>('confidence'),
  sort: getEnumValues<EntitySort>('sort'),
}

function getDefinition(key: string): ParameterDefinition {
  const definition = definitions.get(key)
  if (!definition) throw new Error(`Missing Entity Explorer parameter definition: ${key}`)
  return definition
}

function getEnumValues<T extends string>(key: string): T[] {
  const definition = getDefinition(key)
  return [...(definition.values ?? [])] as T[]
}

function codePointSlice(value: string, max: number) {
  return [...value].slice(0, max).join('')
}

export function normalizeEntitySearchText(value: string) {
  return codePointSlice(
    value.normalize('NFKC').trim().replace(/\s+/g, ' '),
    contract.text_search.max_code_points,
  )
}

function isValidIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) return false
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
}

function normalizeDate(value: string, key: string) {
  const raw = value.trim()
  if (/^\d{4}$/.test(raw)) {
    return key.endsWith('_from')
      ? contract.date_semantics.from_year_expansion.replace('YYYY', raw)
      : contract.date_semantics.to_year_expansion.replace('YYYY', raw)
  }
  return isValidIsoDate(raw) ? raw : ''
}

function paramsFrom(input: string | URLSearchParams) {
  if (input instanceof URLSearchParams) return new URLSearchParams(input)
  const query = input.includes('?') ? input.slice(input.indexOf('?') + 1) : input.replace(/^\?/, '')
  return new URLSearchParams(query)
}

function stableEnumValues<T extends string>(values: string[], key: string): T[] {
  const definition = getDefinition(key)
  const allowed = definition.values ?? []
  const allowedSet = new Set(allowed)
  const requested = new Set(values.filter((value) => allowedSet.has(value)))
  return allowed.filter((value) => requested.has(value)) as T[]
}

function stableReviewedValues(values: string[], reviewedOrigins: string[]) {
  const lookup = new Map(reviewedOrigins.map((origin) => [origin.toLocaleLowerCase('en-US'), origin]))
  const matched = values
    .map((value) => lookup.get(value.toLocaleLowerCase('en-US')))
    .filter((value): value is string => Boolean(value))
  return [...new Set(matched)].sort((a, b) => a.localeCompare(b))
}

function firstValidDate(params: URLSearchParams, key: string) {
  for (const raw of params.getAll(key)) {
    const normalized = normalizeDate(raw, key)
    if (normalized) return normalized
  }
  return ''
}

function firstValidBoolean(params: URLSearchParams, key: string): ArchiveAvailable {
  const allowed = new Set(getDefinition(key).values ?? [])
  for (const raw of params.getAll(key)) {
    if (allowed.has(raw)) return raw as ArchiveAvailable
  }
  return ''
}

function firstValidSort(params: URLSearchParams): EntitySort {
  const allowed = new Set(ENTITY_FILTER_VALUES.sort)
  for (const raw of params.getAll('sort')) {
    if (allowed.has(raw as EntitySort)) return raw as EntitySort
  }
  return ENTITY_DEFAULT_SORT
}

export function getExplorerView(input: string | URLSearchParams): 'entities' | 'events' {
  const params = paramsFrom(input)
  return params.get(contract.view_parameter.key) === 'events' ? 'events' : 'entities'
}

export function parseEntityExplorerState(
  input: string | URLSearchParams,
  reviewedOrigins: string[],
): EntityExplorerState {
  const params = paramsFrom(input)
  const q = normalizeEntitySearchText(params.get('q') ?? '')

  return {
    view: 'entities',
    q,
    type: stableEnumValues<ExchangeType>(params.getAll('type'), 'type'),
    status: stableEnumValues<ExchangeStatus>(params.getAll('status'), 'status'),
    death_reason: stableEnumValues<Exclude<DeathReason, null>>(params.getAll('death_reason'), 'death_reason'),
    launch_from: firstValidDate(params, 'launch_from'),
    launch_to: firstValidDate(params, 'launch_to'),
    death_from: firstValidDate(params, 'death_from'),
    death_to: firstValidDate(params, 'death_to'),
    official_url_status: stableEnumValues<UrlStatus>(params.getAll('official_url_status'), 'official_url_status'),
    archive_available: firstValidBoolean(params, 'archive_available'),
    confidence: stableEnumValues<Confidence>(params.getAll('confidence'), 'confidence'),
    country_or_origin: stableReviewedValues(params.getAll('country_or_origin'), reviewedOrigins),
    sort: firstValidSort(params),
  }
}

function appendMany(params: URLSearchParams, key: string, values: string[]) {
  for (const value of values) params.append(key, value)
}

export function serializeEntityExplorerState(state: EntityExplorerState, reviewedOrigins: string[]) {
  const normalized = parseEntityExplorerState(stateToParams(state), reviewedOrigins)
  const params = new URLSearchParams()

  params.append('view', 'entities')
  if (normalized.q) params.append('q', normalized.q)
  appendMany(params, 'type', normalized.type)
  appendMany(params, 'status', normalized.status)
  appendMany(params, 'death_reason', normalized.death_reason)
  if (normalized.launch_from) params.append('launch_from', normalized.launch_from)
  if (normalized.launch_to) params.append('launch_to', normalized.launch_to)
  if (normalized.death_from) params.append('death_from', normalized.death_from)
  if (normalized.death_to) params.append('death_to', normalized.death_to)
  appendMany(params, 'official_url_status', normalized.official_url_status)
  if (normalized.archive_available) params.append('archive_available', normalized.archive_available)
  appendMany(params, 'confidence', normalized.confidence)
  appendMany(params, 'country_or_origin', normalized.country_or_origin)
  if (normalized.sort !== ENTITY_DEFAULT_SORT) params.append('sort', normalized.sort)

  return params.toString()
}

function stateToParams(state: EntityExplorerState) {
  const params = new URLSearchParams()
  params.append('view', 'entities')
  if (state.q) params.append('q', state.q)
  appendMany(params, 'type', state.type)
  appendMany(params, 'status', state.status)
  appendMany(params, 'death_reason', state.death_reason)
  if (state.launch_from) params.append('launch_from', state.launch_from)
  if (state.launch_to) params.append('launch_to', state.launch_to)
  if (state.death_from) params.append('death_from', state.death_from)
  if (state.death_to) params.append('death_to', state.death_to)
  appendMany(params, 'official_url_status', state.official_url_status)
  if (state.archive_available) params.append('archive_available', state.archive_available)
  appendMany(params, 'confidence', state.confidence)
  appendMany(params, 'country_or_origin', state.country_or_origin)
  if (state.sort) params.append('sort', state.sort)
  return params
}

function includesNormalized(haystack: string, needle: string) {
  return haystack.normalize('NFKC').toLocaleLowerCase('en-US').includes(needle)
}

function matchesSearch(entity: EntityRecord, query: string) {
  if (!query) return true
  const needle = query.toLocaleLowerCase('en-US')
  const values = [
    entity.canonical_name,
    ...entity.aliases,
    entity.slug,
    entity.summary,
    entity.country_or_origin ?? '',
  ]
  return values.some((value) => includesNormalized(value, needle))
}

function inInclusiveRange(value: string | null, from: string, to: string) {
  if (!from && !to) return true
  if (!value) return false
  if (from && value < from) return false
  if (to && value > to) return false
  return true
}

function hasInvertedRange(from: string, to: string) {
  return Boolean(from && to && from > to)
}

function matchesAny<T extends string>(value: T | null, filters: T[]) {
  return filters.length === 0 || (value !== null && filters.includes(value))
}

export function filterEntityExplorerRecords(entities: EntityRecord[], state: EntityExplorerState) {
  if (hasInvertedRange(state.launch_from, state.launch_to)) return []
  if (hasInvertedRange(state.death_from, state.death_to)) return []

  return entities.filter((entity) => {
    if (!matchesSearch(entity, state.q)) return false
    if (!matchesAny(entity.type, state.type)) return false
    if (!matchesAny(entity.status, state.status)) return false
    if (!matchesAny(entity.death_reason, state.death_reason)) return false
    if (!inInclusiveRange(entity.launch_date, state.launch_from, state.launch_to)) return false
    if (!inInclusiveRange(entity.death_date, state.death_from, state.death_to)) return false
    if (!matchesAny(entity.official_url_status, state.official_url_status)) return false
    if (state.archive_available === 'true' && !entity.archived_url) return false
    if (state.archive_available === 'false' && entity.archived_url) return false
    if (!matchesAny(entity.confidence, state.confidence)) return false
    if (state.country_or_origin.length > 0 && !matchesAny(entity.country_or_origin, state.country_or_origin)) return false
    return true
  })
}

function compareNameAsc(a: EntityRecord, b: EntityRecord) {
  const name = a.canonical_name.localeCompare(b.canonical_name)
  return name !== 0 ? name : a.id.localeCompare(b.id)
}

function compareNameDesc(a: EntityRecord, b: EntityRecord) {
  const name = b.canonical_name.localeCompare(a.canonical_name)
  return name !== 0 ? name : a.id.localeCompare(b.id)
}

function compareKnownDate(a: string | null, b: string | null, direction: 'asc' | 'desc') {
  if (a && !b) return -1
  if (!a && b) return 1
  if (!a && !b) return 0
  if (a === b) return 0
  if (direction === 'asc') return a! < b! ? -1 : 1
  return a! > b! ? -1 : 1
}

export function sortEntityExplorerRecords(entities: EntityRecord[], sort: EntitySort) {
  return [...entities].sort((a, b) => {
    if (sort === 'name_desc') return compareNameDesc(a, b)
    if (sort === 'launch_oldest' || sort === 'launch_newest') {
      const date = compareKnownDate(a.launch_date, b.launch_date, sort === 'launch_oldest' ? 'asc' : 'desc')
      return date !== 0 ? date : compareNameAsc(a, b)
    }
    if (sort === 'death_oldest' || sort === 'death_newest') {
      const date = compareKnownDate(a.death_date, b.death_date, sort === 'death_oldest' ? 'asc' : 'desc')
      return date !== 0 ? date : compareNameAsc(a, b)
    }
    if (sort === 'last_verified_newest') {
      if (a.last_verified_at !== b.last_verified_at) return a.last_verified_at > b.last_verified_at ? -1 : 1
      return compareNameAsc(a, b)
    }
    return compareNameAsc(a, b)
  })
}

export function countEntityExplorerFilters(state: EntityExplorerState) {
  return state.type.length
    + state.status.length
    + state.death_reason.length
    + Number(Boolean(state.launch_from))
    + Number(Boolean(state.launch_to))
    + Number(Boolean(state.death_from))
    + Number(Boolean(state.death_to))
    + state.official_url_status.length
    + Number(Boolean(state.archive_available))
    + state.confidence.length
    + state.country_or_origin.length
    + Number(Boolean(state.q))
    + Number(state.sort !== ENTITY_DEFAULT_SORT)
}
