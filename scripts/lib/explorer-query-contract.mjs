import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const moduleDir = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(moduleDir, '..', '..')
const defaultContractPath = path.join(root, 'config', 'explorer-query-contract.json')
const defaultEntitiesPath = path.join(root, 'data', 'entities.json')

export function loadExplorerQueryContract(contractPath = defaultContractPath) {
  return JSON.parse(fs.readFileSync(contractPath, 'utf8'))
}

export function loadReviewedQueryValues(entitiesPath = defaultEntitiesPath) {
  const entities = JSON.parse(fs.readFileSync(entitiesPath, 'utf8'))
  const countryOrOrigin = [...new Set(entities.map((entity) => entity.country_or_origin).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b))

  return {
    entities: {
      country_or_origin: countryOrOrigin,
    },
    events: {},
  }
}

function asSearchParams(input) {
  if (input instanceof URLSearchParams) return new URLSearchParams(input)
  if (typeof input === 'string') {
    const query = input.includes('?') ? input.slice(input.indexOf('?') + 1) : input.replace(/^\?/, '')
    return new URLSearchParams(query)
  }
  if (input && typeof input === 'object') {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(input)) {
      if (Array.isArray(value)) {
        for (const item of value) params.append(key, String(item))
      } else if (value !== undefined && value !== null) {
        params.append(key, String(value))
      }
    }
    return params
  }
  return new URLSearchParams()
}

function codePointSlice(value, max) {
  return [...value].slice(0, max).join('')
}

export function normalizeExplorerSearchText(value, maxCodePoints = 160) {
  return codePointSlice(
    String(value)
      .normalize('NFKC')
      .trim()
      .replace(/\s+/g, ' '),
    maxCodePoints,
  )
}

function isValidIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) return false
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
}

export function normalizeExplorerDate(value, key, contract) {
  const raw = String(value).trim()
  if (/^\d{4}$/.test(raw)) {
    return key.endsWith('_from')
      ? contract.date_semantics.from_year_expansion.replace('YYYY', raw)
      : contract.date_semantics.to_year_expansion.replace('YYYY', raw)
  }
  return isValidIsoDate(raw) ? raw : null
}

function parameterMap(viewContract) {
  return new Map(viewContract.parameters.map((parameter) => [parameter.key, parameter]))
}

function enumOrder(parameter) {
  return new Map((parameter.values ?? []).map((value, index) => [value, index]))
}

function stableMultiValues(values, parameter) {
  const unique = [...new Set(values)]
  if (parameter.kind === 'enum') {
    const order = enumOrder(parameter)
    return unique.sort((a, b) => (order.get(a) ?? Number.MAX_SAFE_INTEGER) - (order.get(b) ?? Number.MAX_SAFE_INTEGER))
  }
  return unique.sort((a, b) => a.localeCompare(b))
}

function reviewedCanonicalLookup(values) {
  return new Map((values ?? []).map((value) => [value.toLocaleLowerCase('en-US'), value]))
}

function parseParameterValues(params, parameter, contract, view, reviewedValues) {
  const rawValues = params.getAll(parameter.key)
  if (rawValues.length === 0) return undefined

  if (parameter.kind === 'text') {
    const normalized = normalizeExplorerSearchText(rawValues[0], contract.text_search.max_code_points)
    return normalized || undefined
  }

  if (parameter.kind === 'date') {
    for (const raw of rawValues) {
      const normalized = normalizeExplorerDate(raw, parameter.key, contract)
      if (normalized) return normalized
    }
    return undefined
  }

  if (parameter.kind === 'boolean') {
    for (const raw of rawValues) {
      if (parameter.values.includes(raw)) return raw
    }
    return undefined
  }

  if (parameter.kind === 'enum') {
    const allowed = new Set(parameter.values)
    if (parameter.cardinality === 'single') {
      return rawValues.find((value) => allowed.has(value))
    }
    const values = rawValues.filter((value) => allowed.has(value))
    return values.length > 0 ? stableMultiValues(values, parameter) : undefined
  }

  if (parameter.kind === 'reviewed_value') {
    const lookup = reviewedCanonicalLookup(reviewedValues?.[view]?.[parameter.key])
    const values = rawValues
      .map((value) => lookup.get(value.toLocaleLowerCase('en-US')))
      .filter(Boolean)
    if (parameter.cardinality === 'single') return values[0]
    return values.length > 0 ? stableMultiValues(values, parameter) : undefined
  }

  return undefined
}

export function parseExplorerQuery(
  input,
  contract = loadExplorerQueryContract(),
  reviewedValues = loadReviewedQueryValues(),
) {
  const params = asSearchParams(input)
  const viewParameter = contract.view_parameter
  const requestedView = params.get(viewParameter.key)
  const view = viewParameter.values.includes(requestedView) ? requestedView : viewParameter.default
  const viewContract = contract.views[view]
  const state = { view }

  for (const parameter of viewContract.parameters) {
    const value = parseParameterValues(params, parameter, contract, view, reviewedValues)
    if (value === undefined) continue
    if (parameter.key === 'sort' && value === viewContract.default_sort) continue
    state[parameter.key] = value
  }

  return state
}

function appendStateParameter(params, key, value, parameter) {
  if (Array.isArray(value)) {
    for (const item of stableMultiValues(value, parameter)) params.append(key, item)
    return
  }
  params.append(key, value)
}

export function serializeExplorerQuery(
  state,
  contract = loadExplorerQueryContract(),
  reviewedValues = loadReviewedQueryValues(),
) {
  const normalized = parseExplorerQuery(state, contract, reviewedValues)
  const view = normalized.view
  const viewContract = contract.views[view]
  const definitions = parameterMap(viewContract)
  const params = new URLSearchParams()

  params.append(contract.view_parameter.key, view)

  if (normalized.q) params.append('q', normalized.q)

  for (const parameter of viewContract.parameters) {
    if (parameter.key === 'q' || parameter.key === 'sort') continue
    const value = normalized[parameter.key]
    if (value === undefined) continue
    appendStateParameter(params, parameter.key, value, definitions.get(parameter.key))
  }

  if (normalized.sort && normalized.sort !== viewContract.default_sort) {
    params.append('sort', normalized.sort)
  }

  return params.toString()
}

export function canonicalizeExplorerQuery(
  input,
  contract = loadExplorerQueryContract(),
  reviewedValues = loadReviewedQueryValues(),
) {
  return serializeExplorerQuery(parseExplorerQuery(input, contract, reviewedValues), contract, reviewedValues)
}

export function explorerQueryHref(
  input,
  contract = loadExplorerQueryContract(),
  reviewedValues = loadReviewedQueryValues(),
) {
  const query = canonicalizeExplorerQuery(input, contract, reviewedValues)
  return `${contract.route}?${query}`
}
