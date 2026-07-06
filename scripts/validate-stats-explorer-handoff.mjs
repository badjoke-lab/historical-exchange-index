import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const mapPath = path.join(root, 'config', 'stats-explorer-deep-link-map.json')
const entitiesPath = path.join(root, 'data', 'entities.json')
const eventsPath = path.join(root, 'data', 'events.json')

function assert(condition, message) {
  if (!condition) throw new Error(`stats explorer handoff validation failed: ${message}`)
}

function readJson(filePath) {
  assert(fs.existsSync(filePath), `missing ${path.relative(root, filePath)}`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

const ENTITY_QUERY_KEYS = new Set(['q','type','status','death_reason','launch_from','launch_to','death_from','death_to','official_url_status','archive_available','confidence','country_or_origin','sort'])
const EVENT_QUERY_KEYS = new Set(['q','event_type','date_from','date_to','impact_level','event_status_effect','confidence','entity_type','entity_status','sort'])
const ALLOWED_KINDS = new Set(['direct','range_candidate','compound_candidate','derived_non_filter','aggregate_non_filter','deferred'])
const ALLOWED_VIEWS = new Set(['entities','events','deferred_evidence','none'])
const REQUIRED_STATS_PATHS = new Set([
  'snapshot.by_status','snapshot.by_type','snapshot.dead_reason',
  'snapshot.active_analysis.status_breakdown','snapshot.active_analysis.url_status_breakdown','snapshot.active_analysis.launch_year_histogram','snapshot.active_analysis.age_bands','snapshot.active_analysis.type_breakdown','snapshot.active_analysis.confidence_breakdown','snapshot.active_analysis.evidence_depth','snapshot.active_analysis.last_verified_recency',
  'snapshot.dead_analysis.status_breakdown','snapshot.dead_analysis.death_reason_breakdown','snapshot.dead_analysis.death_year_histogram','snapshot.dead_analysis.evidence_depth','snapshot.dead_analysis.archive_coverage','snapshot.dead_analysis.average_lifespan_years',
  'snapshot.quality.confidence_breakdown','snapshot.quality.unknown_field_rates','snapshot.quality.last_verified_recency',
  'snapshot.coverage.archive','snapshot.coverage.url_status_breakdown','snapshot.coverage.date_known',
  'snapshot.country_origin.strict_countries','snapshot.country_origin.origin_buckets','snapshot.country_origin.status_rows','snapshot.country_origin.type_rows','snapshot.country_origin.completeness',
  'snapshot.events.event_type_breakdown','snapshot.events.impact_level_breakdown','snapshot.events.status_effect_breakdown','snapshot.events.averages',
  'snapshot.evidence.source_type_breakdown','snapshot.evidence.reliability_breakdown','snapshot.evidence.claim_scope_breakdown','snapshot.evidence.averages',
  'snapshot.completeness','history.snapshots','history.launch_year_counts','history.death_year_counts',
])

const map = readJson(mapPath)
const entities = readJson(entitiesPath)
const events = readJson(eventsPath)

assert(map.version === 1, 'unsupported mapping version')
assert(map.status === 'deep_links_enabled_on_fixed_explorer_v1_contract', 'handoff status is incorrect')
assert(map.explorer_route === '/explore/', 'explorer route is incorrect')
assert(map.rules?.url_contract_finalized === true, 'Explorer URL contract must be finalized')
assert(map.rules?.stats_links_enabled === true, 'Stats links must be enabled at E5-4')
assert(map.rules?.evidence_explorer_in_v1 === false, 'Evidence Explorer must remain outside v1')
assert(map.rules?.reviewed_public_data_only === true, 'reviewed public data boundary is missing')
assert(Array.isArray(map.dimensions) && map.dimensions.length > 0, 'dimensions are missing')

const ids = new Set()
const seenPaths = new Map()
const directSources = new Set()

for (const dimension of map.dimensions) {
  assert(typeof dimension.id === 'string' && dimension.id.length > 0, 'dimension id is missing')
  assert(!ids.has(dimension.id), `duplicate dimension id: ${dimension.id}`)
  ids.add(dimension.id)
  assert(ALLOWED_KINDS.has(dimension.mapping_kind), `unsupported mapping kind: ${dimension.id}:${dimension.mapping_kind}`)
  assert(ALLOWED_VIEWS.has(dimension.destination_view), `unsupported destination view: ${dimension.id}:${dimension.destination_view}`)
  assert(Array.isArray(dimension.stats_paths) && dimension.stats_paths.length > 0, `stats paths missing: ${dimension.id}`)
  assert(Array.isArray(dimension.query_keys), `query keys missing: ${dimension.id}`)
  assert(typeof dimension.value_source === 'string' && dimension.value_source.length > 0, `value source missing: ${dimension.id}`)

  const allowedQueryKeys = dimension.destination_view === 'entities'
    ? ENTITY_QUERY_KEYS
    : dimension.destination_view === 'events'
      ? EVENT_QUERY_KEYS
      : new Set()

  for (const key of dimension.query_keys) assert(allowedQueryKeys.has(key), `query key outside product specification: ${dimension.id}:${key}`)

  if (['direct','range_candidate','compound_candidate'].includes(dimension.mapping_kind)) {
    assert(dimension.destination_view === 'entities' || dimension.destination_view === 'events', `filter candidate has invalid destination: ${dimension.id}`)
    assert(dimension.query_keys.length > 0, `filter candidate has no query key: ${dimension.id}`)
  }

  if (['derived_non_filter','aggregate_non_filter','deferred'].includes(dimension.mapping_kind)) {
    assert(dimension.query_keys.length === 0, `non-filter mapping exposes query keys: ${dimension.id}`)
  }

  if (dimension.destination_view === 'deferred_evidence') assert(dimension.mapping_kind === 'deferred', `evidence destination must be deferred: ${dimension.id}`)
  if (dimension.mapping_kind === 'direct') directSources.add(dimension.value_source)

  for (const statsPath of dimension.stats_paths) {
    assert(REQUIRED_STATS_PATHS.has(statsPath), `unknown Stats path: ${statsPath}`)
    const owner = seenPaths.get(statsPath)
    assert(!owner, `Stats path mapped more than once: ${statsPath} (${owner}, ${dimension.id})`)
    seenPaths.set(statsPath, dimension.id)
  }
}

const missingPaths = [...REQUIRED_STATS_PATHS].filter((statsPath) => !seenPaths.has(statsPath))
assert(missingPaths.length === 0, `unmapped Stats paths: ${missingPaths.join(', ')}`)

const entityValueSources = {
  'entity.status': new Set(entities.map((entity) => entity.status)),
  'entity.type': new Set(entities.map((entity) => entity.type)),
  'entity.death_reason': new Set(entities.map((entity) => entity.death_reason).filter((value) => value !== null)),
  'entity.official_url_status': new Set(entities.map((entity) => entity.official_url_status)),
  'entity.confidence': new Set(entities.map((entity) => entity.confidence)),
  'entity.country_or_origin': new Set(entities.map((entity) => entity.country_or_origin).filter(Boolean)),
}
const eventValueSources = {
  'event.event_type': new Set(events.map((event) => event.event_type)),
  'event.impact_level': new Set(events.map((event) => event.impact_level)),
  'event.event_status_effect': new Set(events.map((event) => event.event_status_effect)),
}

for (const source of directSources) {
  const values = entityValueSources[source] ?? eventValueSources[source]
  assert(values instanceof Set, `direct value source is not validated against reviewed data: ${source}`)
  assert(values.size > 0, `direct value source has no reviewed values: ${source}`)
}

const evidenceDimension = map.dimensions.find((dimension) => dimension.id === 'evidence_dimensions')
assert(evidenceDimension, 'evidence dimension handoff is missing')
assert(evidenceDimension.destination_view === 'deferred_evidence', 'evidence dimensions must remain deferred')
assert(evidenceDimension.query_keys.length === 0, 'evidence dimensions must not expose v1 query keys')

console.log(`Validated enabled Stats Explorer links: ${map.dimensions.length} dimensions, ${seenPaths.size} Stats paths, ${directSources.size} direct reviewed-data sources.`)
