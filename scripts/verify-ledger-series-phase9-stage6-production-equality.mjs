import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const authority = JSON.parse(fs.readFileSync(path.join(root, 'config', 'ledger-series-phase9-stage6-production-equality-authority.json'), 'utf8'))
const timeoutMs = Math.max(1000, Number(process.env.STAGE6_TIMEOUT_MS ?? 20000))
const concurrency = Math.max(1, Number(process.env.STAGE6_CONCURRENCY ?? 12))
const resultPath = process.env.STAGE6_RESULT_PATH || path.join(root, '.stage6', 'phase9-stage6-production-equality-result.json')
const githubToken = process.env.GITHUB_TOKEN?.trim() || null
const githubSha = process.env.GITHUB_SHA?.trim() || null
const cacheNonce = `${Date.now()}`

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]))
  }
  return value
}

function same(left, right) {
  return JSON.stringify(stable(left)) === JSON.stringify(stable(right))
}

function assertSame(actual, expected, label) {
  if (!same(actual, expected)) throw new Error(`${label}: live/reviewed mismatch`)
}

function normalizeRoute(route) {
  return route.startsWith('/') ? route : `/${route}`
}

function rawPath(prefix, route) {
  const normalized = normalizeRoute(route).replace(/^\//, '')
  return prefix ? `${prefix.replace(/\/$/, '')}/${normalized}` : normalized
}

function rawUrl(repository, sha, sourcePath) {
  return `https://raw.githubusercontent.com/${repository}/${sha}/${sourcePath.split('/').map(encodeURIComponent).join('/')}`
}

function productionUrl(origin, route) {
  const normalizedOrigin = origin.replace(/\/$/, '')
  const normalizedRoute = normalizeRoute(route)
  const separator = normalizedRoute.includes('?') ? '&' : '?'
  return `${normalizedOrigin}${normalizedRoute}${separator}stage6_verify=${cacheNonce}`
}

const jsonCache = new Map()

async function fetchJson(url, label, options = {}) {
  const key = `${url}|${options.githubApi ? 'github' : 'json'}`
  if (jsonCache.has(key)) return jsonCache.get(key)
  const headers = {
    accept: 'application/json',
    'cache-control': 'no-cache',
    'user-agent': 'HEI-Ledger-Series-Stage6-verifier/1.0',
  }
  if (options.githubApi && githubToken) headers.authorization = `Bearer ${githubToken}`
  const response = await fetch(url, {
    headers,
    redirect: 'follow',
    signal: AbortSignal.timeout(timeoutMs),
  })
  const text = await response.text()
  if (!response.ok) throw new Error(`${label}: HTTP ${response.status}`)
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch (error) {
    throw new Error(`${label}: malformed JSON (${error.message})`)
  }
  jsonCache.set(key, parsed)
  return parsed
}

async function fetchProductionJson(registry, route, label = route) {
  return fetchJson(productionUrl(registry.origin, route), `${registry.registry_id} ${label}`)
}

async function fetchReviewedJson(registry, route, label = route) {
  const sourcePath = rawPath(registry.source_prefix, route)
  return fetchJson(rawUrl(registry.repository, registry.reviewed_main, sourcePath), `${registry.registry_id} reviewed ${label}`)
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length)
  let next = 0
  async function runner() {
    while (true) {
      const index = next
      next += 1
      if (index >= items.length) return
      results[index] = await worker(items[index], index)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length || 1) }, () => runner()))
  return results
}

function normalizeDescriptor(descriptorUrl, snapshot) {
  return {
    descriptor_url: descriptorUrl,
    series_schema_version: snapshot.series_schema_version,
    canonical_only: snapshot.canonical_only,
    registry: snapshot.registry,
    ...(snapshot.native_contract ? { native_contract: snapshot.native_contract } : {}),
    record_counts: snapshot.record_counts,
    ...(snapshot.record_types ? { record_types: snapshot.record_types } : {}),
    routes: snapshot.routes,
    capabilities: snapshot.capabilities,
    verification: snapshot.verification,
    data_safety: snapshot.data_safety,
  }
}

const registryConfigs = {
  'historical-exchange-index': {
    source_prefix: 'public',
    native_routes: ['/version.json', '/data/manifest.json', '/data/entities.json', '/data/events.json', '/data/evidence.json'],
  },
  'minted-and-gone': {
    source_prefix: 'public',
    native_routes: ['/version.json', '/data/manifest.json', '/data/marketplaces.json'],
  },
  'stable-or-gone': {
    source_prefix: 'public',
    native_routes: ['/version.json', '/data/manifest.json'],
  },
  'crypto-yield-archive': {
    source_prefix: 'public',
    native_routes: ['/version.json', '/data/manifest.json'],
  },
  'bridge-incident-registry': {
    source_prefix: 'public',
    native_routes: ['/version.json', '/data/manifest.json', '/data/bridges.json', '/data/incidents.json', '/data/events.json', '/data/evidence.json'],
  },
  'cryptocurrency-wallet-lifecycle-registry': {
    source_prefix: 'public',
    native_routes: ['/version.json', '/data/manifest.json', '/data/wallet-index.json', '/data/product-index.json'],
  },
  'ai-tools-history-archive': {
    source_prefix: 'public',
    native_routes: ['/version.json', '/data/records/index.json'],
  },
  'api-deprecation-archive': {
    source_prefix: '',
    native_routes: ['/version.json', '/data/machine/manifest.json', '/data/machine/index.json'],
  },
}

const reviewed = authority.reviewed_repository_baselines.map((entry) => ({
  ...entry,
  ...registryConfigs[entry.registry_id],
  expected_relationships: authority.frozen_stage5_relationship_counts[entry.registry_id] ?? 0,
}))

assert(authority.authority_id === 'hei-ledger-series-phase9-stage6-production-equality-2026-08-21-v2', 'unexpected Stage 6 authority id')
assert(reviewed.length === 8, `Stage 6 verifier requires exactly eight registries, found ${reviewed.length}`)
assert(reviewed.every((entry) => entry.source_prefix !== undefined && Array.isArray(entry.native_routes)), 'missing registry verifier configuration')

const report = {
  schema_version: '1.0.0',
  phase: 9,
  stage: 6,
  authority_id: authority.authority_id,
  execution_kind: 'read_only_cross_registry_production_equality',
  started_at: new Date().toISOString(),
  github_workflow_sha: githubSha,
  repository_preflight: [],
  registries: [],
  central_descriptor: null,
  stage5_relationships: null,
  overall: 'RUNNING',
}

function writeReport() {
  fs.mkdirSync(path.dirname(resultPath), { recursive: true })
  fs.writeFileSync(resultPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}

async function readRepositoryMain(registry) {
  const branch = await fetchJson(
    `https://api.github.com/repos/${registry.repository}/branches/main`,
    `${registry.registry_id} GitHub main`,
    { githubApi: true },
  )
  return branch?.commit?.sha ?? null
}

async function preflightRepositoryMains() {
  const failures = []
  for (const registry of reviewed) {
    try {
      const observed = await readRepositoryMain(registry)
      if (registry.registry_id === 'historical-exchange-index') {
        assert(githubSha, 'HEI execution requires GITHUB_SHA')
        assert(observed === githubSha, `HEI main moved after execution checkout: expected workflow SHA ${githubSha}, observed ${observed}`)
        report.repository_preflight.push({
          registry_id: registry.registry_id,
          reviewed_main: registry.reviewed_main,
          observed_main: observed,
          status: 'PASS',
          note: 'HEI coordination main equals the exact reviewed verifier implementation workflow SHA; native production still uses the audit-reviewed expected revision.',
        })
      } else {
        assert(observed === registry.reviewed_main, `repository main advanced beyond reviewed baseline ${registry.reviewed_main}: observed ${observed}`)
        report.repository_preflight.push({ registry_id: registry.registry_id, reviewed_main: registry.reviewed_main, observed_main: observed, status: 'PASS' })
      }
    } catch (error) {
      failures.push(`${registry.registry_id}: ${error.message}`)
      report.repository_preflight.push({ registry_id: registry.registry_id, reviewed_main: registry.reviewed_main, status: 'FAIL', error: error.message })
    }
  }
  if (failures.length) throw new Error(`repository preflight failed: ${failures.join(' | ')}`)
}

async function verifyExactRoute(registry, route) {
  const [live, expected] = await Promise.all([
    fetchProductionJson(registry, route),
    fetchReviewedJson(registry, route),
  ])
  assertSame(live, expected, `${registry.registry_id} ${route}`)
  return live
}

async function verifyNativeRoutes(registry) {
  const values = new Map()
  for (const route of registry.native_routes) {
    values.set(route, await verifyExactRoute(registry, route))
  }
  return values
}

async function verifySeries(registry) {
  const [liveDescriptor, reviewedDescriptor, liveIndex, reviewedIndex] = await Promise.all([
    fetchProductionJson(registry, '/data/series/registry.json', 'Series descriptor'),
    fetchReviewedJson(registry, '/data/series/registry.json', 'Series descriptor'),
    fetchProductionJson(registry, '/data/series/index.json', 'Series index'),
    fetchReviewedJson(registry, '/data/series/index.json', 'Series index'),
  ])

  assertSame(liveDescriptor, reviewedDescriptor, `${registry.registry_id} Series descriptor`)
  assertSame(liveIndex, reviewedIndex, `${registry.registry_id} Series index`)
  assert(liveDescriptor?.canonical_only === true, 'Series descriptor canonical_only is not true')
  assert(liveIndex?.canonical_only === true, 'Series index canonical_only is not true')

  const liveRelationshipCount = Number(liveDescriptor?.record_counts?.relationships ?? 0)
  assert(liveRelationshipCount === registry.expected_relationships, `relationship count expected ${registry.expected_relationships}, observed ${liveRelationshipCount}`)

  let liveRelationships = []
  if (registry.expected_relationships > 0) {
    const route = liveDescriptor?.routes?.relationships
    assert(route === '/data/series/relationships.json', `unexpected relationships route ${route}`)
    const [live, expected] = await Promise.all([
      fetchProductionJson(registry, route, 'Series relationships'),
      fetchReviewedJson(registry, route, 'Series relationships'),
    ])
    assertSame(live, expected, `${registry.registry_id} Series relationships`)
    assert(Array.isArray(live) && live.length === registry.expected_relationships, `relationship transport count mismatch`)
    for (const relationship of live) {
      assert(relationship?.source?.registry_id === registry.registry_id, `relationship source escaped registry boundary`)
      assert(relationship?.target?.registry_id === registry.registry_id, `cross-registry relationship observed`)
    }
    liveRelationships = live
  }

  const rows = Array.isArray(reviewedIndex?.records) ? reviewedIndex.records : []
  assert(rows.length === reviewedIndex.record_count, `reviewed Series index record_count mismatch`)

  const envelopeResults = await mapLimit(rows, concurrency, async (row) => {
    const machinePath = new URL(row.machine_url).pathname
    const [liveEnvelope, reviewedEnvelope] = await Promise.all([
      fetchProductionJson(registry, machinePath, `Series envelope ${row.global_record_key}`),
      fetchReviewedJson(registry, machinePath, `Series envelope ${row.global_record_key}`),
    ])
    assertSame(liveEnvelope, reviewedEnvelope, `${registry.registry_id} Series envelope ${row.global_record_key}`)
    assert(liveEnvelope.global_record_key === row.global_record_key, `Series envelope global key mismatch ${row.global_record_key}`)
    assert(Array.isArray(liveEnvelope.relationships) && liveEnvelope.relationships.length === 0, `record-envelope relationships must remain empty ${row.global_record_key}`)

    let nativePath = null
    if (typeof reviewedEnvelope?.urls?.native_machine === 'string') {
      nativePath = new URL(reviewedEnvelope.urls.native_machine, registry.origin).pathname
      const [liveNative, reviewedNative] = await Promise.all([
        fetchProductionJson(registry, nativePath, `native dossier ${row.global_record_key}`),
        fetchReviewedJson(registry, nativePath, `native dossier ${row.global_record_key}`),
      ])
      assertSame(liveNative, reviewedNative, `${registry.registry_id} native dossier ${row.global_record_key}`)
    }
    return { global_record_key: row.global_record_key, native_path: nativePath }
  })

  return {
    descriptor: liveDescriptor,
    index: liveIndex,
    relationships: liveRelationships,
    envelope_count: envelopeResults.length,
    native_dossier_count: envelopeResults.filter((entry) => entry.native_path).length,
  }
}

function verifyRevisionContract(registry, native, series) {
  const version = native.get('/version.json')
  const manifest = native.get('/data/manifest.json') ?? native.get('/data/machine/manifest.json')
  switch (registry.registry_id) {
    case 'historical-exchange-index':
      assert(version?.build?.commit === registry.reviewed_main, `HEI native build.commit expected ${registry.reviewed_main}, observed ${version?.build?.commit}`)
      assert(series.descriptor?.verification?.build?.commit === version.build.commit, 'HEI Series/native build commit mismatch')
      assert(series.index?.verification?.build?.commit === version.build.commit, 'HEI Series index/native build commit mismatch')
      break
    case 'minted-and-gone':
      assert(series.descriptor?.verification?.build_commit === registry.reviewed_main, `MAG descriptor build_commit mismatch`)
      assert(series.index?.build_commit === registry.reviewed_main, `MAG index build_commit mismatch`)
      break
    case 'stable-or-gone':
      assert(series.descriptor?.verification?.build?.commit === registry.reviewed_main, `SOG descriptor build commit mismatch`)
      assert(typeof series.descriptor?.verification?.build?.canonical_data_hash === 'string', 'SOG canonical_data_hash missing')
      if (manifest?.build?.canonical_data_hash) {
        assert(series.descriptor.verification.build.canonical_data_hash === manifest.build.canonical_data_hash, 'SOG Series/native canonical_data_hash mismatch')
      }
      break
    case 'crypto-yield-archive':
      assert(series.descriptor?.verification?.build?.commit === registry.reviewed_main, `CYA descriptor build commit mismatch`)
      assert(manifest?.build?.commit === registry.reviewed_main, `CYA native manifest build commit mismatch`)
      assertSame(series.descriptor.verification.build, manifest.build, 'CYA Series/native build object')
      break
    case 'bridge-incident-registry':
      assert(!series.descriptor?.verification?.build_commit, 'BIR must not invent build_commit')
      assert(!series.descriptor?.verification?.data_revision, 'BIR must not invent data_revision')
      break
    case 'cryptocurrency-wallet-lifecycle-registry':
      assert(!('build_commit' in (series.descriptor?.verification ?? {})), 'WLR must not invent build_commit')
      assert(series.descriptor?.verification?.last_verified_at === manifest?.last_verified_at, 'WLR last_verified_at mismatch')
      break
    case 'ai-tools-history-archive':
      assert(version?.build_commit === registry.reviewed_main, `AI Tools native build_commit mismatch`)
      assert(series.descriptor?.verification?.build_commit === registry.reviewed_main, `AI Tools descriptor build_commit mismatch`)
      assert(series.index?.build_commit === registry.reviewed_main, `AI Tools index build_commit mismatch`)
      break
    case 'api-deprecation-archive': {
      const revision = version?.data_revision
      assert(typeof revision === 'string' && revision.length > 0, 'API Deprecation data_revision missing')
      assert(manifest?.data_revision === revision, 'API Deprecation native manifest data_revision mismatch')
      assert(series.descriptor?.verification?.data_revision === revision, 'API Deprecation Series descriptor data_revision mismatch')
      assert(series.index?.data_revision === revision || series.index?.verification?.data_revision === revision, 'API Deprecation Series index data_revision mismatch')
      break
    }
    default:
      throw new Error(`missing revision verifier for ${registry.registry_id}`)
  }
}

const liveDescriptors = new Map()
const relationshipCounts = new Map()

async function verifyRegistry(registry) {
  const started = Date.now()
  const record = {
    registry_id: registry.registry_id,
    repository: registry.repository,
    reviewed_main: registry.reviewed_main,
    origin: registry.origin,
    verification_mode: registry.verification_mode,
    status: 'RUNNING',
  }
  report.registries.push(record)
  try {
    const native = await verifyNativeRoutes(registry)
    const series = await verifySeries(registry)
    liveDescriptors.set(registry.registry_id, series.descriptor)
    relationshipCounts.set(registry.registry_id, series.relationships.length)
    verifyRevisionContract(registry, native, series)
    record.status = 'PASS'
    record.series_record_count = series.index.record_count
    record.series_envelope_count = series.envelope_count
    record.native_dossier_count = series.native_dossier_count
    record.relationship_count = series.relationships.length
    record.duration_ms = Date.now() - started
  } catch (error) {
    record.status = 'FAIL'
    record.error = error.message
    record.duration_ms = Date.now() - started
    try {
      if (!liveDescriptors.has(registry.registry_id)) {
        liveDescriptors.set(registry.registry_id, await fetchProductionJson(registry, '/data/series/registry.json', 'Series descriptor for central check'))
      }
    } catch {
      // Missing descriptor is already a registry failure and will also make the central check fail.
    }
  }
}

async function verifyCentralDescriptorIndex() {
  const started = Date.now()
  const central = {
    status: 'RUNNING',
    origin: 'https://hei.badjoke-lab.com',
    route: '/data/series/registries.json',
  }
  report.central_descriptor = central
  try {
    const liveCentral = await fetchJson(productionUrl('https://hei.badjoke-lab.com', '/data/series/registries.json'), 'HEI central registry index')
    assert(liveCentral?.series_schema_version === '1.0.0', 'central Series schema mismatch')
    assert(liveCentral?.object_type === 'registry_index', 'central object type mismatch')
    assert(liveCentral?.semantic_owner === 'badjoke-lab-ledger-series', 'central semantic owner mismatch')
    assert(liveCentral?.registry_count === 8, `central registry_count expected 8, observed ${liveCentral?.registry_count}`)
    assert(Array.isArray(liveCentral?.registries) && liveCentral.registries.length === 8, 'central registries array must contain eight entries')

    const centralById = new Map(liveCentral.registries.map((entry) => [entry?.registry?.id, entry]))
    for (const registry of reviewed) {
      const liveDescriptor = liveDescriptors.get(registry.registry_id)
      assert(liveDescriptor, `${registry.registry_id}: live descriptor unavailable for central comparison`)
      const centralEntry = centralById.get(registry.registry_id)
      assert(centralEntry, `${registry.registry_id}: missing from central registry index`)
      const expected = normalizeDescriptor(`${registry.origin.replace(/\/$/, '')}/data/series/registry.json`, liveDescriptor)
      assertSame(centralEntry, expected, `${registry.registry_id} central descriptor`)
    }
    central.status = 'PASS'
    central.registry_count = 8
    central.collector_run = liveCentral?.snapshot?.collector_run ?? null
    central.collected_at = liveCentral?.snapshot?.collected_at ?? null
    central.duration_ms = Date.now() - started
  } catch (error) {
    central.status = 'FAIL'
    central.error = error.message
    central.duration_ms = Date.now() - started
  }
}

function finalizeRelationships() {
  const expectedByRegistry = Object.fromEntries(reviewed.map((registry) => [registry.registry_id, registry.expected_relationships]))
  const observedByRegistry = Object.fromEntries(reviewed.map((registry) => [registry.registry_id, relationshipCounts.get(registry.registry_id) ?? null]))
  const observedKnown = [...relationshipCounts.values()].reduce((sum, value) => sum + value, 0)
  const allKnown = relationshipCounts.size === reviewed.length
  const expectedTotal = authority.frozen_stage5_relationship_counts.total
  report.stage5_relationships = {
    expected_by_registry: expectedByRegistry,
    observed_by_registry: observedByRegistry,
    expected_total: expectedTotal,
    observed_total: allKnown ? observedKnown : null,
    expected_cross_registry: authority.frozen_stage5_relationship_counts.cross_registry,
    observed_cross_registry: 0,
    status: allKnown && observedKnown === expectedTotal ? 'PASS' : 'FAIL',
  }
}

try {
  await preflightRepositoryMains()
} catch (error) {
  report.overall = 'FAIL'
  report.preflight_error = error.message
  report.finished_at = new Date().toISOString()
  writeReport()
  console.error(error.message)
  process.exit(1)
}

for (const registry of reviewed) await verifyRegistry(registry)
await verifyCentralDescriptorIndex()
finalizeRelationships()

const failedRegistries = report.registries.filter((entry) => entry.status !== 'PASS')
const centralFailed = report.central_descriptor?.status !== 'PASS'
const relationshipsFailed = report.stage5_relationships?.status !== 'PASS'
report.overall = failedRegistries.length || centralFailed || relationshipsFailed ? 'FAIL' : 'PASS'
report.finished_at = new Date().toISOString()
writeReport()

console.log(JSON.stringify({
  overall: report.overall,
  registries: report.registries.map((entry) => ({ registry_id: entry.registry_id, status: entry.status, error: entry.error ?? null })),
  central_descriptor: report.central_descriptor,
  stage5_relationships: report.stage5_relationships,
  result_path: path.relative(root, resultPath),
}, null, 2))

if (report.overall !== 'PASS') process.exit(1)
