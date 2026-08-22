import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'

const root = process.cwd()
const authority = JSON.parse(fs.readFileSync(path.join(root, 'config', 'ledger-series-phase9-stage6-production-equality-authority.json'), 'utf8'))
const repoRoot = process.env.STAGE6_REPO_ROOT || path.join(root, '.stage6', 'repos')
const resultPath = process.env.STAGE6_RESULT_PATH || path.join(root, '.stage6', 'phase9-stage6-production-equality-result.json')
const timeoutMs = Math.max(1000, Number(process.env.STAGE6_TIMEOUT_MS || 20000))
const concurrency = Math.max(1, Number(process.env.STAGE6_CONCURRENCY || 10))
const githubSha = (process.env.GITHUB_SHA || '').trim()
const githubToken = (process.env.GITHUB_TOKEN || '').trim()
const nonce = Date.now()

const REVIEW = {
  'historical-exchange-index': {
    repository: 'badjoke-lab/historical-exchange-index', repo_main: '7ec374c1dfd92fc1f53b6148a54904372c83d9ee', production_revision: '242e60a59147440207f5823c9af86fb65e85da54', local: root,
  },
  'minted-and-gone': {
    repository: 'badjoke-lab/mintedandgone', repo_main: 'f917d5e25eedc7b2c48091c7343b7fa9cd203428', production_revision: '73dafdf78a2ca60e9329a4c6844315cafb8e55c0', local: path.join(repoRoot, 'mag'),
  },
  'stable-or-gone': {
    repository: 'badjoke-lab/stable-or-gone', repo_main: '9a4f853cca85efff1c7ae4303b07c7af224e65bd', production_revision: 'a3cf1e51a00b70d867a6579ea9602343016ad58a', local: path.join(repoRoot, 'sog'),
  },
  'crypto-yield-archive': {
    repository: 'badjoke-lab/crypto-yield-archive', repo_main: 'de0f7cab8b519f745d153add3a04b16394ecb8b1', production_revision: '66b9ae8ac1fc8487d30f649f489f892b047f30e5', local: path.join(repoRoot, 'cya'),
  },
  'bridge-incident-registry': {
    repository: 'badjoke-lab/bridge-incident-registry', repo_main: 'ef2767ee5fb55339e530d90fcdf3eff88becbc41', production_revision: null, local: path.join(repoRoot, 'bir'),
  },
  'cryptocurrency-wallet-lifecycle-registry': {
    repository: 'badjoke-lab/cryptocurrency-wallet-lifecycle-registry', repo_main: '919a759a4f3077ffecac5464cbb61eae41cd1f0e', production_revision: null, local: path.join(repoRoot, 'wlr'),
  },
  'ai-tools-history-archive': {
    repository: 'badjoke-lab/ai-tools-history-archive', repo_main: '76ef103329813f0174db121117c932bff53fbf8e', production_revision: '76ef103329813f0174db121117c932bff53fbf8e', local: path.join(repoRoot, 'ai'),
  },
  'api-deprecation-archive': {
    repository: 'badjoke-lab/api-deprecation-archive', repo_main: '641a6d4243d30f95f48436455d2cbc12a8aded53', production_revision: null, local: path.join(repoRoot, 'api'),
  },
}

const expectedRelationships = {
  'historical-exchange-index': 21,
  'minted-and-gone': 17,
  'stable-or-gone': 1,
  'crypto-yield-archive': 0,
  'bridge-incident-registry': 44,
  'cryptocurrency-wallet-lifecycle-registry': 161,
  'ai-tools-history-archive': 0,
  'api-deprecation-archive': 0,
}

function assert(condition, message) { if (!condition) throw new Error(message) }
function stable(value) {
  if (Array.isArray(value)) return value.map(stable)
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]))
  return value
}
function same(a, b) { return JSON.stringify(stable(a)) === JSON.stringify(stable(b)) }
function assertSame(a, b, label) { if (!same(a, b)) throw new Error(`${label}: mismatch`) }
function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')) }
function endpointKey(endpoint) { return `${endpoint?.registry_id}:${endpoint?.native_record_type}:${endpoint?.native_record_id}` }
function relationshipId(type, source, target) { return `series_rel_${createHash('sha256').update(`${type}\n${source}\n${target}`, 'utf8').digest('hex')}` }
function urlPath(value) { return new URL(value).pathname }

assert(authority.authority_id === 'hei-ledger-series-phase9-stage6-production-equality-2026-08-21-v2', 'unexpected Stage 6 authority')
assert(authority.network_read_only_verification_authorized_after_merge === true, 'Stage 6 network verification is not authorized')
assert(authority.production_mutation_authorized === false && authority.vertical_repository_mutation_authorized === false && authority.central_descriptor_resync_authorized === false, 'Stage 6 mutation boundary weakened')
assert(authority.reviewed_repository_baselines?.length === 8, 'Stage 6 authority must cover eight registries')
assert(Object.keys(REVIEW).length === 8, 'superseding execution review must cover eight registries')
assert(Object.values(expectedRelationships).reduce((a, b) => a + b, 0) === 244, 'Stage 5 relationship total must remain 244')

const byId = new Map(authority.reviewed_repository_baselines.map((x) => [x.registry_id, x]))
for (const [id, review] of Object.entries(REVIEW)) {
  const frozen = byId.get(id)
  assert(frozen, `${id}: missing frozen authority baseline`)
  assert(frozen.repository === review.repository, `${id}: repository changed from authority`)
  review.origin = frozen.origin
  review.verification_mode = frozen.verification_mode
}

const report = {
  schema_version: '1.1.0', phase: 9, stage: 6,
  authority_id: authority.authority_id,
  execution_kind: 'read_only_cross_registry_production_equality_corrected',
  started_at: new Date().toISOString(), workflow_sha: githubSha || null,
  repository_preflight: [], checker_results: [], registries: [], central_descriptor: null,
  stage5_relationships: null, overall: 'RUNNING',
}
function writeReport() {
  fs.mkdirSync(path.dirname(resultPath), { recursive: true })
  fs.writeFileSync(resultPath, `${JSON.stringify(report, null, 2)}\n`)
}

async function fetchText(url, label) {
  const headers = { accept: '*/*', 'cache-control': 'no-cache', 'user-agent': 'HEI-Ledger-Series-Stage6-corrected/1.0' }
  if (url.startsWith('https://api.github.com/') && githubToken) headers.authorization = `Bearer ${githubToken}`
  const res = await fetch(url, { headers, redirect: 'follow', signal: AbortSignal.timeout(timeoutMs) })
  const text = await res.text()
  if (!res.ok) throw new Error(`${label}: HTTP ${res.status}`)
  return text
}
async function fetchJsonUrl(url, label) {
  const text = await fetchText(url, label)
  try { return JSON.parse(text) } catch (error) { throw new Error(`${label}: malformed JSON: ${error.message}`) }
}
async function live(review, route, label = route) {
  const origin = review.origin.replace(/\/$/, '')
  const sep = route.includes('?') ? '&' : '?'
  return fetchJsonUrl(`${origin}${route}${sep}stage6=${nonce}`, `${label} @ ${origin}`)
}

async function preflight() {
  for (const [id, review] of Object.entries(REVIEW)) {
    const branch = await fetchJsonUrl(`https://api.github.com/repos/${review.repository}/branches/main`, `${id} GitHub main`)
    const observed = branch?.commit?.sha
    if (id === 'historical-exchange-index') {
      assert(githubSha && observed === githubSha, `HEI main moved: workflow ${githubSha || 'missing'}, observed ${observed}`)
    } else {
      assert(observed === review.repo_main, `${id} main moved beyond reviewed execution baseline: expected ${review.repo_main}, observed ${observed}`)
    }
    report.repository_preflight.push({ registry_id: id, authority_audit_main: byId.get(id).reviewed_main, reviewed_execution_main: review.repo_main, observed_main: observed, production_revision: review.production_revision, status: 'PASS' })
  }
}

function checker(label, id, script, args = [], extraEnv = {}, maxMs = 210000) {
  const cwd = REVIEW[id].local
  assert(fs.existsSync(path.join(cwd, script)), `${label}: checker missing at reviewed checkout ${script}`)
  const env = { ...process.env, ...extraEnv }
  const proc = spawnSync(process.execPath, [script, ...args], { cwd, env, encoding: 'utf8', timeout: maxMs, maxBuffer: 8 * 1024 * 1024 })
  const item = { label, registry_id: id, script, status: proc.status === 0 ? 'PASS' : 'FAIL', exit_code: proc.status, stdout_tail: (proc.stdout || '').trim().slice(-3500), stderr_tail: (proc.stderr || '').trim().slice(-3500) }
  report.checker_results.push(item)
  if (proc.error) throw new Error(`${label}: ${proc.error.message}`)
  if (proc.status !== 0) throw new Error(`${label}: existing reviewed checker failed: ${item.stderr_tail || item.stdout_tail || `exit ${proc.status}`}`)
}

function runReviewedCheckers() {
  const hei = REVIEW['historical-exchange-index']
  checker('HEI native exact reviewed deployment', 'historical-exchange-index', 'scripts/check-record-level-machine-readable-production.mjs', [], {
    HEI_PUBLIC_ORIGIN: hei.origin, EXPECTED_COMMIT: hei.production_revision, SMOKE_MAX_ATTEMPTS: '3', SMOKE_RETRY_DELAY_MS: '5000',
  })
  checker('HEI Stage 5 relationships', 'historical-exchange-index', 'scripts/verify-ledger-series-stage5-production.mjs', [], {
    HEI_PRODUCTION_ORIGIN: hei.origin, HEI_STAGE5_PRODUCTION_ATTEMPTS: '3', HEI_STAGE5_PRODUCTION_DELAY_MS: '5000', HEI_STAGE5_PRODUCTION_TIMEOUT_MS: String(timeoutMs),
  })

  const mag = REVIEW['minted-and-gone']
  checker('MAG native exact reviewed deployment', 'minted-and-gone', 'scripts/check-phase5-production.mjs', [mag.production_revision], {
    MAG_PRODUCTION_ORIGIN: mag.origin, MAG_PRODUCTION_VERIFY_ATTEMPTS: '3', MAG_PRODUCTION_VERIFY_DELAY_MS: '5000',
  })

  const sog = REVIEW['stable-or-gone']
  checker('SOG exact commit + canonical hash', 'stable-or-gone', 'scripts/check-production-provenance.mjs', [], {
    SOG_BASE_URL: sog.origin, SOG_EXPECTED_COMMIT: sog.production_revision, SOG_SMOKE_ATTEMPTS: '3', SOG_SMOKE_DELAY_MS: '5000',
  })
  checker('SOG Stage 5 relationships', 'stable-or-gone', 'scripts/verify-stage5-production.mjs', [], {
    SOG_PRODUCTION_ORIGIN: sog.origin, SOG_STAGE5_PRODUCTION_ATTEMPTS: '3', SOG_STAGE5_PRODUCTION_DELAY_MS: '5000',
  })

  const cya = REVIEW['crypto-yield-archive']
  checker('CYA reviewed corpus-derived production equality', 'crypto-yield-archive', 'scripts/check-production.mjs', [], {
    CYA_BASE_URL: cya.origin, CYA_EXPECTED_COMMIT: cya.production_revision, CYA_SMOKE_ATTEMPTS: '3', CYA_SMOKE_DELAY_MS: '5000',
  })

  const bir = REVIEW['bridge-incident-registry']
  checker('BIR exact canonical-content production equality', 'bridge-incident-registry', 'scripts/verify-production.mjs', [], {
    PUBLIC_SITE_ORIGIN: bir.origin, BIR_PUBLICATION_ATTEMPTS: '3', BIR_PUBLICATION_DELAY_MS: '5000', BIR_PRODUCTION_TIMEOUT_MS: String(timeoutMs),
  }, 300000)
  checker('BIR Stage 5 relationships', 'bridge-incident-registry', 'scripts/verify-production-series-relationships.mjs', [], {
    PUBLIC_SITE_ORIGIN: bir.origin, BIR_PRODUCTION_TIMEOUT_MS: String(timeoutMs), BIR_RECORD_JSON_CONCURRENCY: String(concurrency),
  })

  const wlr = REVIEW['cryptocurrency-wallet-lifecycle-registry']
  checker('WLR Stage 5 relationships', 'cryptocurrency-wallet-lifecycle-registry', 'scripts/verify-stage5-production.mjs', [], {
    WLR_PRODUCTION_ORIGIN: wlr.origin, WLR_PRODUCTION_ATTEMPTS: '3', WLR_PRODUCTION_DELAY_MS: '5000', WLR_PRODUCTION_TIMEOUT_MS: String(timeoutMs),
  })

  const ai = REVIEW['ai-tools-history-archive']
  checker('AI Tools exact Series reviewed build', 'ai-tools-history-archive', 'scripts/check-series-origin.mjs', [], {
    SERIES_ORIGIN: ai.origin, SERIES_EXPECTED_COMMIT: ai.production_revision, SERIES_VERIFY_ATTEMPTS: '3', SERIES_VERIFY_INTERVAL_MS: '5000',
  })

  const api = REVIEW['api-deprecation-archive']
  checker('API native deterministic data revision', 'api-deprecation-archive', 'scripts/check-machine-origin.mjs', [], {
    API_DEP_ORIGIN: api.origin, API_DEP_VERIFY_ATTEMPTS: '3', API_DEP_VERIFY_INTERVAL_MS: '5000',
  })
  checker('API Series deterministic data revision', 'api-deprecation-archive', 'scripts/check-series-origin.mjs', [], {
    SERIES_ORIGIN: api.origin, SERIES_VERIFY_ATTEMPTS: '3', SERIES_VERIFY_INTERVAL_MS: '5000',
  })
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length); let next = 0
  async function worker() { while (true) { const i = next++; if (i >= items.length) return; out[i] = await fn(items[i], i) } }
  await Promise.all(Array.from({ length: Math.min(limit, Math.max(1, items.length)) }, worker))
  return out
}

function projectMag(dossier) {
  const m = dossier.marketplace ?? {}
  const r = dossier.relationships ?? {}
  return {
    status: m.status ?? null, category: m.category ?? null, marketplace_scope: m.marketplace_scope ?? null,
    chain_scope: m.chain_scope ?? [], frontend_status: m.frontend_status ?? null, contract_status: m.contract_status ?? null,
    asset_status: m.asset_status ?? null, closure_reason: m.closure_reason ?? null, review_status: m.review_status ?? null,
    record_quality_flags: m.record_quality_flags ?? [], predecessor_marketplace: r.predecessor_marketplace ?? null,
    successor_marketplace: r.successor_marketplace ?? null,
  }
}
function projectAi(d) {
  const r = d.record ?? {}
  return {
    status: r.status ?? null, entity_type: r.entity_type ?? null, operator: r.operator ?? null,
    confidence: r.confidence ?? null, last_reviewed_at: r.last_reviewed_at ?? null,
  }
}
function projectApi(d) {
  const e = d.entity ?? {}
  return {
    status: e.status ?? null, deprecation_stage: e.deprecation_stage ?? null, deadline_status: e.deadline_status ?? null,
    still_usable: e.still_usable ?? null, action_required: e.action_required ?? null, replacement: e.replacement ?? null,
    replacement_type: e.replacement_type ?? null,
  }
}
function projectWlr(d, nativeType) {
  if (nativeType === 'wlr.wallet-record.v1') {
    const e = d.entity ?? {}
    return {
      status: e.status ?? null, wallet_type: e.wallet_type ?? null, custody_model: e.custody_model ?? null,
      open_source_status: e.open_source_status ?? null, current_vendor: e.current_vendor ?? null,
      website_status: e.website_status ?? null, confidence: e.confidence ?? null,
      product_ids: (d.products ?? []).map((p) => p.id),
    }
  }
  const p = d.product ?? {}
  return {
    status: p.status ?? null,
    parent_entity: d.entity ?? null,
    launch_date: p.launch_date ?? null, launch_date_precision: p.launch_date_precision ?? null,
    product_type: p.product_type ?? null, support_status: p.support_status ?? null, sales_status: p.sales_status ?? null,
    predecessor_product_id: p.predecessor_product_id ?? null, successor_product_id: p.successor_product_id ?? null,
    confidence: p.confidence ?? null,
  }
}

async function verifyEnvelopeProjection(id, row, envelope, native) {
  assert(envelope.object_type === 'record_envelope' && envelope.registry_id === id, `${id}/${row.slug}: envelope identity mismatch`)
  assert(envelope.global_record_key === row.global_record_key, `${id}/${row.slug}: global key mismatch`)
  assert(Array.isArray(envelope.relationships) && envelope.relationships.length === 0, `${id}/${row.slug}: typed relationships leaked into envelope`)
  switch (id) {
    case 'historical-exchange-index':
      assertSame(envelope.current_state?.native?.bundle, native, `${id}/${row.slug} native bundle`)
      assertSame(envelope.events?.records ?? [], native.events ?? [], `${id}/${row.slug} events`)
      assertSame(envelope.evidence?.records ?? [], native.evidence ?? [], `${id}/${row.slug} evidence`)
      break
    case 'minted-and-gone':
      assertSame(envelope.current_state?.native, projectMag(native), `${id}/${row.slug} native projection`)
      assertSame(envelope.events?.records ?? [], native.events ?? [], `${id}/${row.slug} events`)
      assertSame(envelope.evidence?.records ?? [], native.evidence ?? [], `${id}/${row.slug} evidence`)
      break
    case 'stable-or-gone':
      assertSame(envelope.current_state?.native, { record: native.record, related: native.related, record_counts: native.record_counts }, `${id}/${row.slug} native projection`)
      assertSame(envelope.events?.records ?? [], native.related?.events ?? [], `${id}/${row.slug} events`)
      assertSame(envelope.evidence?.records ?? [], native.related?.evidence ?? [], `${id}/${row.slug} evidence`)
      assertSame(envelope.evidence?.relations ?? [], native.related?.evidence_relations ?? [], `${id}/${row.slug} evidence relations`)
      break
    case 'crypto-yield-archive':
      assertSame(envelope.current_state?.native?.record, native.record, `${id}/${row.slug} native record`)
      assertSame(envelope.current_state?.native?.supporting_records, native.supporting_records, `${id}/${row.slug} supporting records`)
      assertSame(envelope.current_state?.native?.related_record_counts, native.related_record_counts, `${id}/${row.slug} related counts`)
      assertSame(envelope.events?.records ?? [], native.supporting_records?.events ?? [], `${id}/${row.slug} events`)
      assertSame(envelope.evidence?.records ?? [], native.supporting_records?.evidence ?? [], `${id}/${row.slug} evidence`)
      break
    case 'bridge-incident-registry': {
      const expectedNative = row.native_record_type === 'bridge'
        ? { record: native.record, related_incident_ids: (native.related?.incidents ?? []).map((incident) => incident.id) }
        : {
            record: native.record,
            parent_bridge: native.bridge ? { id: native.bridge.id, slug: native.bridge.slug, canonical_name: native.bridge.canonical_name, status: native.bridge.status } : null,
          }
      assertSame(envelope.current_state?.native, expectedNative, `${id}/${row.slug} native projection`)
      assertSame(envelope.events?.records ?? [], native.related?.events ?? [], `${id}/${row.slug} events`)
      assertSame(envelope.evidence?.records ?? [], native.related?.evidence ?? [], `${id}/${row.slug} evidence`)
      break
    }
    case 'cryptocurrency-wallet-lifecycle-registry':
      assertSame(envelope.current_state?.native, projectWlr(native, row.native_record_type), `${id}/${row.slug} native projection`)
      assertSame(envelope.events?.records ?? [], native.events ?? [], `${id}/${row.slug} events`)
      assertSame(envelope.evidence?.records ?? [], native.evidence ?? [], `${id}/${row.slug} evidence`)
      break
    case 'ai-tools-history-archive':
      assertSame(envelope.current_state?.native, projectAi(native), `${id}/${row.slug} native projection`)
      assertSame(envelope.events?.records ?? [], native.record?.events ?? [], `${id}/${row.slug} events`)
      assertSame(envelope.evidence?.records ?? [], native.record?.evidence ?? [], `${id}/${row.slug} evidence`)
      break
    case 'api-deprecation-archive':
      assertSame(envelope.current_state?.native, projectApi(native), `${id}/${row.slug} native projection`)
      assertSame(envelope.events?.records ?? [], native.events ?? [], `${id}/${row.slug} events`)
      assertSame(envelope.evidence?.records ?? [], native.evidence ?? [], `${id}/${row.slug} evidence`)
      break
    default: throw new Error(`missing projection verifier for ${id}`)
  }
}

async function verifyWlrCanonical(review) {
  for (const name of ['entities.json','products.json','events.json','evidence.json']) {
    const expected = readJson(path.join(review.local, 'data', name))
    const actual = await live(review, `/data/${name}`, `WLR ${name}`)
    assertSame(actual, expected, `WLR reviewed canonical ${name}`)
  }
}

async function verifyCyaDerivedCount(review, descriptor, index) {
  const files = fs.readdirSync(path.join(review.local, 'data')).filter((name) => name === 'platforms.json' || /^platforms-batch-.*\.json$/.test(name)).sort()
  const count = files.flatMap((name) => readJson(path.join(review.local, 'data', name))).length
  assert(count > 0, 'CYA reviewed canonical platform count must be positive')
  assert(descriptor.record_counts?.primary_records === count, `CYA descriptor primary_records ${descriptor.record_counts?.primary_records} != reviewed corpus ${count}`)
  assert(index.record_count === count, `CYA Series index ${index.record_count} != reviewed corpus ${count}`)
  return count
}

const liveDescriptors = new Map()
let totalRelationships = 0
let crossRelationships = 0

async function verifyRegistry(id, review) {
  const started = Date.now()
  const [descriptor, index] = await Promise.all([
    live(review, '/data/series/registry.json', `${id} descriptor`),
    live(review, '/data/series/index.json', `${id} index`),
  ])
  assert(descriptor.object_type === 'registry_descriptor' && descriptor.registry?.id === id, `${id}: descriptor identity mismatch`)
  assert(descriptor.canonical_only === true && index.canonical_only === true, `${id}: canonical boundary mismatch`)
  const rows = Array.isArray(index.records) ? index.records : []
  assert(rows.length === index.record_count, `${id}: index count mismatch`)
  assert(descriptor.record_counts?.primary_records === index.record_count, `${id}: descriptor/index primary count mismatch`)

  if (id === 'crypto-yield-archive') await verifyCyaDerivedCount(review, descriptor, index)
  if (id === 'cryptocurrency-wallet-lifecycle-registry') await verifyWlrCanonical(review)
  if (id === 'ai-tools-history-archive') {
    const version = await live(review, '/version.json', 'AI version')
    assert(version.build_commit === review.production_revision, `AI native build_commit ${version.build_commit} != reviewed ${review.production_revision}`)
  }

  await mapLimit(rows, concurrency, async (row) => {
    const envelope = await live(review, urlPath(row.machine_url), `${id}/${row.slug} envelope`)
    const nativeUrl = envelope.urls?.native_machine || row.native_machine_url
    assert(typeof nativeUrl === 'string' && nativeUrl.startsWith(review.origin), `${id}/${row.slug}: native machine URL missing/outside origin`)
    const native = await live(review, urlPath(nativeUrl), `${id}/${row.slug} native`)
    await verifyEnvelopeProjection(id, row, envelope, native)
  })

  const expected = expectedRelationships[id]
  const observed = Number(descriptor.record_counts?.relationships ?? 0)
  assert(observed === expected, `${id}: relationship count ${observed} != ${expected}`)
  if (expected > 0) {
    assert(descriptor.routes?.relationships === '/data/series/relationships.json', `${id}: relationships route mismatch`)
    const relationships = await live(review, '/data/series/relationships.json', `${id} relationships`)
    assert(Array.isArray(relationships) && relationships.length === expected, `${id}: relationship transport count mismatch`)
    for (const relation of relationships) {
      assert(relation.object_type === 'relationship_record' && relation.direction === 'directed', `${id}: relationship contract mismatch`)
      const source = endpointKey(relation.source); const target = endpointKey(relation.target)
      assert(relation.source?.registry_id === id && relation.target?.registry_id === id, `${id}: cross-registry relationship observed`)
      assert(relation.id === relationshipId(relation.relation_type, source, target), `${id}: deterministic relationship ID mismatch`)
      if (relation.source?.registry_id !== relation.target?.registry_id) crossRelationships += 1
    }
    if (id === 'minted-and-gone') {
      const localAuthority = readJson(path.join(review.local, 'config', 'ledger-series-phase9-stage5-mag-local-authority.json'))
      const expectedSet = new Set(localAuthority.finite_allowlist.map(([type, source, target]) => `${type}\n${source}\n${target}`))
      const actualSet = new Set(relationships.map((r) => `${r.relation_type}\n${endpointKey(r.source)}\n${endpointKey(r.target)}`))
      assert(expectedSet.size === 17 && actualSet.size === 17 && [...expectedSet].every((x) => actualSet.has(x)), 'MAG relationship set != reviewed allowlist')
    }
  }
  totalRelationships += observed
  liveDescriptors.set(id, descriptor)
  report.registries.push({ registry_id: id, origin: review.origin, reviewed_execution_main: review.repo_main, production_revision: review.production_revision, primary_records: index.record_count, relationships: observed, envelopes_verified: rows.length, duration_ms: Date.now() - started, status: 'PASS' })
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

async function verifyCentralIndex() {
  const hei = REVIEW['historical-exchange-index']
  const central = await live(hei, '/data/series/registries.json', 'HEI central registry index')
  assert(central.object_type === 'registry_index' && central.registry_count === 8, 'central registry index identity/count mismatch')
  assert(Array.isArray(central.registries) && central.registries.length === 8, 'central registry array length mismatch')
  const expected = Object.entries(REVIEW).map(([id, review]) => normalizeDescriptor(`${review.origin.replace(/\/$/, '')}/data/series/registry.json`, liveDescriptors.get(id))).sort((a, b) => a.registry.id.localeCompare(b.registry.id))
  const actual = [...central.registries].sort((a, b) => a.registry.id.localeCompare(b.registry.id))
  assertSame(actual, expected, 'central registry index vs accepted live descriptors')
  report.central_descriptor = { status: 'PASS', registry_count: 8, source_commit: central.verification?.source_commit ?? null, collector_run: central.source_lock?.collector_run ?? null }
}

try {
  writeReport()
  await preflight()
  runReviewedCheckers()
  for (const [id, review] of Object.entries(REVIEW)) await verifyRegistry(id, review)
  assert(totalRelationships === 244, `Stage 5 relationship total ${totalRelationships} != 244`)
  assert(crossRelationships === 0, `cross-registry relationship count ${crossRelationships} != 0`)
  report.stage5_relationships = { expected: 244, observed: totalRelationships, cross_registry_observed: crossRelationships, status: 'PASS' }
  await verifyCentralIndex()
  report.overall = 'PASS'
  report.completed_at = new Date().toISOString()
  writeReport()
  console.log(`Stage 6 production equality PASS: 8 registries, ${totalRelationships} reviewed relationships, central descriptor equality.`)
} catch (error) {
  report.overall = 'FAIL'
  report.completed_at = new Date().toISOString()
  report.failure = error instanceof Error ? error.message : String(error)
  writeReport()
  console.error(`Stage 6 production equality FAIL: ${report.failure}`)
  process.exit(1)
}
