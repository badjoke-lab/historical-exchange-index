import explorerContract from '../../../config/explorer-query-contract.json'

export type ExplorerView = 'entities' | 'events'
export type ExplorerQueryValue = string | readonly string[] | undefined
export type ExplorerQueryInput = Record<string, ExplorerQueryValue>

type ParameterContract = {
  key: string
  kind: string
  cardinality: string
  values?: string[]
}

type ViewContract = {
  default_sort: string
  parameters: ParameterContract[]
}

const views = explorerContract.views as Record<ExplorerView, ViewContract>

function stableValues(values: readonly string[], parameter: ParameterContract): string[] {
  const unique = [...new Set(values)]
  if (parameter.kind !== 'enum' || !parameter.values) {
    return unique.sort((a, b) => a.localeCompare(b))
  }

  const order = new Map(parameter.values.map((value, index) => [value, index]))
  return unique.sort(
    (a, b) => (order.get(a) ?? Number.MAX_SAFE_INTEGER) - (order.get(b) ?? Number.MAX_SAFE_INTEGER),
  )
}

export function buildExplorerHref(view: ExplorerView, input: ExplorerQueryInput = {}): string {
  const viewContract = views[view]
  const params = new URLSearchParams()
  params.append('view', view)

  const q = input.q
  if (typeof q === 'string' && q.trim()) params.append('q', q.trim())

  for (const parameter of viewContract.parameters) {
    if (parameter.key === 'q' || parameter.key === 'sort') continue
    const value = input[parameter.key]
    if (value === undefined) continue

    if (Array.isArray(value)) {
      for (const item of stableValues(value, parameter)) params.append(parameter.key, item)
    } else {
      params.append(parameter.key, String(value))
    }
  }

  const sort = input.sort
  if (typeof sort === 'string' && sort !== viewContract.default_sort) {
    params.append('sort', sort)
  }

  return `${explorerContract.route}?${params.toString()}`
}

export function yearRangeParams(prefix: 'launch' | 'death' | 'date', year: number): ExplorerQueryInput {
  return {
    [`${prefix}_from`]: `${year}-01-01`,
    [`${prefix}_to`]: `${year}-12-31`,
  }
}
