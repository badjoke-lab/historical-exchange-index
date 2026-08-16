import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const contractPath = path.join(root, 'config', 'explorer-query-contract.json')
const handoffPath = path.join(root, 'config', 'stats-explorer-deep-link-map.json')

function assert(condition, message) {
  if (!condition) throw new Error(`Explorer query contract validation failed: ${message}`)
}

function readJson(filePath) {
  assert(fs.existsSync(filePath), `missing ${path.relative(root, filePath)}`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

const contract = readJson(contractPath)
const handoff = readJson(handoffPath)

assert(contract.version === 2, 'contract version must be 2 after the AI-era provenance extension')
assert(contract.status === 'extended_for_ai_era_stage_d', 'contract status is not the AI-era Stage D extension')
assert(contract.route === '/explore/', 'Explorer route must be /explore/')
assert(contract.view_parameter?.key === 'view', 'view parameter key must be view')
assert(contract.view_parameter?.default === 'entities', 'default view must be entities')
assert(JSON.stringify(contract.view_parameter?.values) === JSON.stringify(['entities', 'events']), 'view values must be entities/events')
assert(contract.view_parameter?.always_serialize === true, 'view must always serialize')

assert(contract.combination_semantics?.same_key_multiple_values === 'or', 'same-key values must use OR semantics')
assert(contract.combination_semantics?.different_keys === 'and', 'different keys must use AND semantics')
assert(contract.combination_semantics?.repeated_parameter_encoding === true, 'multi-value encoding must use repeated parameters')
assert(contract.combination_semantics?.deduplicate_repeated_values === true, 'multi-value dedupe must be enabled')
assert(contract.combination_semantics?.evidence_filter_scope === 'all active evidence filters must match the same reviewed evidence item', 'evidence filter scope changed')

assert(contract.invalid_input?.unknown_parameter === 'ignore', 'unknown parameters must be ignored')
assert(contract.invalid_input?.cross_view_parameter === 'ignore', 'cross-view parameters must be ignored')
assert(contract.invalid_input?.inverted_valid_range === 'preserve_and_return_empty_results', 'inverted valid ranges must be preserved')

assert(contract.text_search?.parameter === 'q', 'text search parameter must be q')
assert(contract.text_search?.max_code_points === 160, 'text search max length must be 160 code points')
assert(Array.isArray(contract.text_search?.entity_fields) && contract.text_search.entity_fields.length > 0, 'entity search fields missing')
assert(Array.isArray(contract.text_search?.event_fields) && contract.text_search.event_fields.length > 0, 'event search fields missing')

assert(JSON.stringify(contract.date_semantics?.accepted_input_formats) === JSON.stringify(['YYYY', 'YYYY-MM-DD']), 'accepted date formats changed')
assert(contract.date_semantics?.from_year_expansion === 'YYYY-01-01', 'from-year expansion changed')
assert(contract.date_semantics?.to_year_expansion === 'YYYY-12-31', 'to-year expansion changed')
assert(contract.date_semantics?.comparison === 'inclusive', 'date comparisons must be inclusive')

assert(Array.isArray(contract.serialization?.stable_parameter_order), 'stable parameter order missing')
assert(contract.serialization?.omit_default_sort === true, 'default sort must be omitted')
assert(contract.serialization?.omit_empty_text === true, 'empty text must be omitted')

for (const viewName of contract.view_parameter.values) {
  const view = contract.views?.[viewName]
  assert(view, `missing view contract: ${viewName}`)
  assert(typeof view.default_sort === 'string' && view.default_sort.length > 0, `default sort missing: ${viewName}`)
  assert(Array.isArray(view.parameters) && view.parameters.length > 0, `parameters missing: ${viewName}`)
  const keys = view.parameters.map((parameter) => parameter.key)
  assert(new Set(keys).size === keys.length, `duplicate parameter key in ${viewName}`)
  assert(keys[0] === 'q', `q must be first view parameter in ${viewName}`)
  assert(keys[keys.length - 1] === 'sort', `sort must be last view parameter in ${viewName}`)
  for (const parameter of view.parameters) {
    assert(['text','enum','date','boolean','reviewed_value'].includes(parameter.kind), `unsupported kind ${viewName}:${parameter.key}`)
    assert(['single','multi'].includes(parameter.cardinality), `unsupported cardinality ${viewName}:${parameter.key}`)
    if (parameter.cardinality === 'multi') assert(['enum','reviewed_value'].includes(parameter.kind), `multi cardinality only supported for enum/reviewed_value: ${viewName}:${parameter.key}`)
    if (parameter.kind === 'enum' || parameter.kind === 'boolean') {
      assert(Array.isArray(parameter.values) && parameter.values.length > 0, `values missing: ${viewName}:${parameter.key}`)
      assert(new Set(parameter.values).size === parameter.values.length, `duplicate values: ${viewName}:${parameter.key}`)
    }
  }
  const sort = view.parameters.find((parameter) => parameter.key === 'sort')
  assert(sort?.kind === 'enum', `sort must be enum: ${viewName}`)
  assert(sort?.cardinality === 'single', `sort must be single: ${viewName}`)
  assert(sort.values.includes(view.default_sort), `default sort not allowed: ${viewName}:${view.default_sort}`)
  assert(view.sort_semantics?.[view.default_sort], `default sort semantics missing: ${viewName}:${view.default_sort}`)
  for (const value of sort.values) assert(Array.isArray(view.sort_semantics?.[value]) && view.sort_semantics[value].length > 0, `sort semantics missing: ${viewName}:${value}`)
}

const entityKeys = new Set(contract.views.entities.parameters.map((parameter) => parameter.key))
for (const key of ['verified_from', 'verified_to', 'evidence_source_type', 'evidence_reliability', 'evidence_archive_available']) {
  assert(entityKeys.has(key), `AI-era entity provenance key missing: ${key}`)
}
const eventKeys = new Set(contract.views.events.parameters.map((parameter) => parameter.key))
for (const key of ['evidence_source_type', 'evidence_reliability', 'evidence_archive_available']) {
  assert(eventKeys.has(key), `AI-era event provenance key missing: ${key}`)
}
const sourceTypes = contract.views.entities.parameters.find((parameter) => parameter.key === 'evidence_source_type')?.values
assert(JSON.stringify(sourceTypes) === JSON.stringify(contract.views.events.parameters.find((parameter) => parameter.key === 'evidence_source_type')?.values), 'entity/event source-type filters differ')
const reliabilities = contract.views.entities.parameters.find((parameter) => parameter.key === 'evidence_reliability')?.values
assert(JSON.stringify(reliabilities) === JSON.stringify(['high', 'medium', 'low']), 'evidence reliability filter values changed')
assert(JSON.stringify(reliabilities) === JSON.stringify(contract.views.events.parameters.find((parameter) => parameter.key === 'evidence_reliability')?.values), 'entity/event reliability filters differ')

assert(contract.crawl_policy?.base_route_indexable === true, 'base Explorer route must be indexable')
assert(contract.crawl_policy?.canonical_for_all_query_variants === '/explore/', 'query variant canonical must point to /explore/')
assert(contract.crawl_policy?.query_variants_in_sitemap === false, 'query variants must stay out of sitemap')
assert(contract.crawl_policy?.generated_filter_landing_pages === false, 'generated filter landing pages must remain disabled')
assert(contract.compatibility?.stage_d_additive_keys === 'backward_compatible_old_urls_unchanged', 'Stage D compatibility marker missing')

assert(handoff.status === 'deep_links_enabled_on_fixed_explorer_v1_contract', 'Stats handoff status is not enabled')
assert(handoff.explorer_route === contract.route, 'Stats handoff route differs from query contract')
assert(handoff.rules?.url_contract_finalized === true, 'Stats handoff must mark URL contract finalized')
assert(handoff.rules?.stats_links_enabled === true, 'Stats Explorer links must be enabled')
assert(handoff.rules?.evidence_explorer_in_v1 === false, 'Evidence Explorer must remain outside v1')
assert(handoff.rules?.reviewed_public_data_only === true, 'reviewed public data boundary missing')

const keysByView = Object.fromEntries(Object.entries(contract.views).map(([viewName, view]) => [viewName, new Set(view.parameters.map((parameter) => parameter.key))]))
for (const dimension of handoff.dimensions) {
  if (dimension.destination_view === 'entities' || dimension.destination_view === 'events') {
    for (const key of dimension.query_keys) assert(keysByView[dimension.destination_view].has(key), `Stats handoff query key absent from fixed contract: ${dimension.id}:${key}`)
  } else {
    assert(dimension.query_keys.length === 0, `non-Explorer destination exposes query keys: ${dimension.id}`)
  }
}

const evidenceDimension = handoff.dimensions.find((dimension) => dimension.id === 'evidence_dimensions')
assert(evidenceDimension?.destination_view === 'deferred_evidence', 'Evidence dimensions remain outside a dedicated Evidence Explorer')
assert(evidenceDimension?.query_keys.length === 0, 'Stats evidence dimensions remain unlinked until separately authorized')

console.log(`Validated Explorer query contract v${contract.version}: AI-era provenance filters enabled; ${handoff.dimensions.length} existing Stats mappings remain compatible.`)
