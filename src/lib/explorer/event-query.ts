import contractJson from '../../../config/explorer-query-contract.json'
import type { Confidence, EntityRecord, ExchangeStatus, ExchangeType } from '../types/entity'
import type { EventRecord, EventStatusEffect, EventType, ImpactLevel } from '../types/event'

export type EventSort = 'date_newest' | 'date_oldest' | 'entity_name_asc'

export interface EventExplorerState {
  view: 'events'
  q: string
  event_type: EventType[]
  date_from: string
  date_to: string
  impact_level: ImpactLevel[]
  event_status_effect: EventStatusEffect[]
  confidence: Confidence[]
  entity_type: ExchangeType[]
  entity_status: ExchangeStatus[]
  sort: EventSort
}

type ParameterDefinition = {
  key: string
  kind: 'text' | 'enum' | 'date'
  cardinality: 'single' | 'multi'
  values?: string[]
}

type QueryContract = {
  text_search: { max_code_points: number }
  date_semantics: { from_year_expansion: string; to_year_expansion: string }
  views: {
    events: {
      default_sort: EventSort
      parameters: ParameterDefinition[]
    }
  }
}

const contract = contractJson as QueryContract
const eventContract = contract.views.events
const definitions = new Map(eventContract.parameters.map((parameter) => [parameter.key, parameter]))

export const EVENT_DEFAULT_SORT = eventContract.default_sort

function enumValues<T extends string>(key: string): T[] {
  return [...(definitions.get(key)?.values ?? [])] as T[]
}

export const EVENT_FILTER_VALUES = {
  event_type: enumValues<EventType>('event_type'),
  impact_level: enumValues<ImpactLevel>('impact_level'),
  event_status_effect: enumValues<EventStatusEffect>('event_status_effect'),
  confidence: enumValues<Confidence>('confidence'),
  entity_type: enumValues<ExchangeType>('entity_type'),
  entity_status: enumValues<ExchangeStatus>('entity_status'),
  sort: enumValues<EventSort>('sort'),
}

function paramsFrom(input: string | URLSearchParams) {
  if (input instanceof URLSearchParams) return new URLSearchParams(input)
  const query = input.includes('?') ? input.slice(input.indexOf('?') + 1) : input.replace(/^\?/, '')
  return new URLSearchParams(query)
}

function normalizeSearch(value: string) {
  return [...value.normalize('NFKC').trim().replace(/\s+/g, ' ')]
    .slice(0, contract.text_search.max_code_points)
    .join('')
}

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

function normalizeDate(value: string, key: string) {
  const raw = value.trim()
  if (/^\d{4}$/.test(raw)) {
    return key.endsWith('_from')
      ? contract.date_semantics.from_year_expansion.replace('YYYY', raw)
      : contract.date_semantics.to_year_expansion.replace('YYYY', raw)
  }
  return isIsoDate(raw) ? raw : ''
}

function firstValidDate(params: URLSearchParams, key: string) {
  for (const value of params.getAll(key)) {
    const normalized = normalizeDate(value, key)
    if (normalized) return normalized
  }
  return ''
}

function stableEnum<T extends string>(params: URLSearchParams, key: string): T[] {
  const allowed = enumValues<T>(key)
  const requested = new Set(params.getAll(key))
  return allowed.filter((value) => requested.has(value))
}

function firstValidSort(params: URLSearchParams): EventSort {
  const allowed = new Set(EVENT_FILTER_VALUES.sort)
  for (const value of params.getAll('sort')) {
    if (allowed.has(value as EventSort)) return value as EventSort
  }
  return EVENT_DEFAULT_SORT
}

export function parseEventExplorerState(input: string | URLSearchParams): EventExplorerState {
  const params = paramsFrom(input)
  return {
    view: 'events',
    q: normalizeSearch(params.get('q') ?? ''),
    event_type: stableEnum<EventType>(params, 'event_type'),
    date_from: firstValidDate(params, 'date_from'),
    date_to: firstValidDate(params, 'date_to'),
    impact_level: stableEnum<ImpactLevel>(params, 'impact_level'),
    event_status_effect: stableEnum<EventStatusEffect>(params, 'event_status_effect'),
    confidence: stableEnum<Confidence>(params, 'confidence'),
    entity_type: stableEnum<ExchangeType>(params, 'entity_type'),
    entity_status: stableEnum<ExchangeStatus>(params, 'entity_status'),
    sort: firstValidSort(params),
  }
}

function appendMany(params: URLSearchParams, key: string, values: string[]) {
  for (const value of values) params.append(key, value)
}

export function serializeEventExplorerState(state: EventExplorerState) {
  const params = new URLSearchParams()
  params.append('view', 'events')
  if (state.q) params.append('q', normalizeSearch(state.q))
  appendMany(params, 'event_type', state.event_type)
  if (state.date_from) params.append('date_from', normalizeDate(state.date_from, 'date_from'))
  if (state.date_to) params.append('date_to', normalizeDate(state.date_to, 'date_to'))
  appendMany(params, 'impact_level', state.impact_level)
  appendMany(params, 'event_status_effect', state.event_status_effect)
  appendMany(params, 'confidence', state.confidence)
  appendMany(params, 'entity_type', state.entity_type)
  appendMany(params, 'entity_status', state.entity_status)
  if (state.sort !== EVENT_DEFAULT_SORT) params.append('sort', state.sort)
  return params.toString()
}

function includesNormalized(value: string, needle: string) {
  return value.normalize('NFKC').toLocaleLowerCase('en-US').includes(needle)
}

function eventMatchesSearch(event: EventRecord, parent: EntityRecord | undefined, query: string) {
  if (!query) return true
  const needle = query.toLocaleLowerCase('en-US')
  const values = [
    event.title,
    event.description,
    parent?.canonical_name ?? '',
    ...(parent?.aliases ?? []),
    parent?.slug ?? '',
    parent?.country_or_origin ?? '',
  ]
  return values.some((value) => includesNormalized(value, needle))
}

function matchesAny<T extends string>(value: T, filters: T[]) {
  return filters.length === 0 || filters.includes(value)
}

function rangeMatches(value: string | null, from: string, to: string) {
  if (!from && !to) return true
  if (!value) return false
  if (from && value < from) return false
  if (to && value > to) return false
  return true
}

export function filterEventExplorerRecords(
  events: EventRecord[],
  entityById: Map<string, EntityRecord>,
  state: EventExplorerState,
) {
  if (state.date_from && state.date_to && state.date_from > state.date_to) return []

  return events.filter((event) => {
    const parent = entityById.get(event.exchange_id)
    if (!parent) return false
    if (!eventMatchesSearch(event, parent, state.q)) return false
    if (!matchesAny(event.event_type, state.event_type)) return false
    if (!rangeMatches(event.event_date, state.date_from, state.date_to)) return false
    if (!matchesAny(event.impact_level, state.impact_level)) return false
    if (!matchesAny(event.event_status_effect, state.event_status_effect)) return false
    if (!matchesAny(event.confidence, state.confidence)) return false
    if (!matchesAny(parent.type, state.entity_type)) return false
    if (!matchesAny(parent.status, state.entity_status)) return false
    return true
  })
}

function dateCompare(a: string | null, b: string | null, direction: 'asc' | 'desc') {
  if (a && !b) return -1
  if (!a && b) return 1
  if (!a && !b) return 0
  if (a === b) return 0
  return direction === 'asc' ? (a! < b! ? -1 : 1) : (a! > b! ? -1 : 1)
}

export function sortEventExplorerRecords(
  events: EventRecord[],
  entityById: Map<string, EntityRecord>,
  sort: EventSort,
) {
  return [...events].sort((a, b) => {
    if (sort === 'entity_name_asc') {
      const aName = entityById.get(a.exchange_id)?.canonical_name ?? ''
      const bName = entityById.get(b.exchange_id)?.canonical_name ?? ''
      const name = aName.localeCompare(bName)
      if (name !== 0) return name
      const date = dateCompare(a.event_date, b.event_date, 'desc')
      return date !== 0 ? date : a.id.localeCompare(b.id)
    }

    const direction = sort === 'date_oldest' ? 'asc' : 'desc'
    const date = dateCompare(a.event_date, b.event_date, direction)
    if (date !== 0) return date
    if (a.sort_order !== b.sort_order) {
      return direction === 'asc' ? a.sort_order - b.sort_order : b.sort_order - a.sort_order
    }
    return a.id.localeCompare(b.id)
  })
}

export function countEventExplorerFilters(state: EventExplorerState) {
  return Number(Boolean(state.q))
    + state.event_type.length
    + Number(Boolean(state.date_from))
    + Number(Boolean(state.date_to))
    + state.impact_level.length
    + state.event_status_effect.length
    + state.confidence.length
    + state.entity_type.length
    + state.entity_status.length
    + Number(state.sort !== EVENT_DEFAULT_SORT)
}
