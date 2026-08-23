import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const prepareOnly = process.argv.includes('--prepare-only')
const v5WrapperPath = path.join(root, 'scripts', 'verify-ledger-series-phase9-stage6-current-production-v5.mjs')
const v6AuthorityPath = path.join(root, 'config', 'ledger-series-phase9-stage6-ai-generation-precondition-authority-2026-08-23.json')
const v6BaselinePath = path.join(root, 'config', 'ledger-series-phase9-stage6-v6-execution-baseline.json')
const generatedWrapperPath = path.join(root, '.stage6', 'phase9-stage6-v6-generated-wrapper.mjs')

function assert(condition, message) { if (!condition) throw new Error(message) }
function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')) }
function replaceOnce(source, needle, replacement, label) {
  const first = source.indexOf(needle)
  assert(first >= 0, `${label}: marker not found`)
  assert(source.indexOf(needle, first + needle.length) < 0, `${label}: marker is not unique`)
  return `${source.slice(0, first)}${replacement}${source.slice(first + needle.length)}`
}

const authority = readJson(v6AuthorityPath)
const baseline = readJson(v6BaselinePath)
const forbidden = new Set(authority.not_authorized || [])

assert(authority.authority_id === 'hei-ledger-series-phase9-stage6-ai-generation-precondition-correction-2026-08-23-v6', 'unexpected v6 authority id')
assert(authority.failed_v5_execution?.workflow_run === 32623941701, 'v6 authority must bind to consumed v5 run')
assert(authority.failed_v5_execution?.job === 97156272779, 'v6 authority v5 job binding changed')
assert(authority.failed_v5_execution?.artifact_id === 9489174795, 'v6 authority v5 artifact binding changed')
assert(authority.failed_v5_execution?.artifact_digest === 'sha256:95dd35f53932d3c4facb76b8bf9a2caf3be80b1ed16a9cd3fc8ee035fe1345b1', 'v6 authority v5 artifact digest changed')
assert(authority.failed_v5_execution?.consumed === true && authority.failed_v5_execution?.rerun_authorized === false, 'v5 consumption boundary changed')
assert(authority.reviewed_ai_contract?.reviewed_commit === '76ef103329813f0174db121117c932bff53fbf8e', 'v6 AI reviewed commit changed')
assert(authority.reviewed_ai_contract?.generation_network_io === false, 'v6 AI generation must remain local-only')
assert(authority.reviewed_ai_contract?.required_build_identity_env?.CF_PAGES_COMMIT_SHA === '76ef103329813f0174db121117c932bff53fbf8e', 'v6 AI build identity changed')
assert(Array.isArray(authority.authorized_next_changes) && authority.authorized_next_changes.some((x) => x.includes('execute exactly one new read-only eight-registry equality run')), 'v6 one-shot execution is not authorized')
for (const required of [
  'rerun of workflow run 32623941701',
  'production mutation',
  'any vertical repository mutation',
  'AI repository mutation',
  'canonical record or relationship mutation',
  'central descriptor resynchronization',
  'Cloudflare or DNS change',
  'deployment mutation',
  'silent latest-main acceptance',
  'automatic repair',
  'automatic retry or more than one new network execution',
  'Stage 7 continuation',
  'Stage 8 continuation',
  'Phase 10 continuation',
]) assert(forbidden.has(required), `v6 forbidden boundary missing: ${required}`)
assert(authority.stage6_current_production_acceptance === 'NOT_ACCEPTED' && authority.automatic_continuation === false, 'v6 authority must not pre-accept or auto-continue Stage 6')

assert(baseline.authority_id === authority.authority_id, 'v6 baseline authority mismatch')
assert(baseline.authority_merge === 'fa56be7993d4caa7b1ce8f058d124b331322d319', 'unexpected v6 authority merge')
assert(baseline.corrected_from_v5_execution?.workflow_run === 32623941701 && baseline.corrected_from_v5_execution?.consumed === true && baseline.corrected_from_v5_execution?.rerun_authorized === false, 'v6 baseline v5 consumption boundary changed')
assert(baseline.execution_count_authorized === 1 && baseline.automatic_baseline_refresh_authorized === false, 'v6 finite execution boundary changed')
assert(baseline.production_mutation_authorized === false && baseline.vertical_repository_mutation_authorized === false && baseline.ai_repository_mutation_authorized === false && baseline.canonical_record_or_relationship_mutation_authorized === false && baseline.central_descriptor_resync_authorized === false && baseline.cloudflare_dns_deployment_mutation_authorized === false, 'v6 mutation boundary weakened')
assert(Array.isArray(baseline.registries) && baseline.registries.length === 8, 'v6 baseline must cover eight registries')
assert(baseline.stage5_relationship_counts?.total === 244 && baseline.stage5_relationship_counts?.cross_registry === 0, 'Stage 5 relationship boundary changed')

const baselineById = new Map(baseline.registries.map((item) => [item.registry_id, item]))
const expectedMains = {
  'historical-exchange-index': 'fa56be7993d4caa7b1ce8f058d124b331322d319',
  'minted-and-gone': 'f917d5e25eedc7b2c48091c7343b7fa9cd203428',
  'stable-or-gone': 'e8663a8289033a3a6af7cb19fb31683b2545e61c',
  'crypto-yield-archive': 'e0079af51859cb1d006e686fceb29a25b7343ece',
  'bridge-incident-registry': '99405bc7d4e1b3d2aea62314a607dc00656e823b',
  'cryptocurrency-wallet-lifecycle-registry': '8192dedeb3777894f031dcbd13d95367f5f688de',
  'ai-tools-history-archive': '76ef103329813f0174db121117c932bff53fbf8e',
  'api-deprecation-archive': '641a6d4243d30f95f48436455d2cbc12a8aded53',
}
for (const [id, exact] of Object.entries(expectedMains)) {
  const item = baselineById.get(id)
  assert(item, `${id}: v6 baseline missing`)
  assert((item.reviewed_main ?? item.reviewed_main_before_implementation) === exact, `${id}: reviewed v6 main changed without explicit review`)
}
const cya = baselineById.get('crypto-yield-archive')
const bir = baselineById.get('bridge-incident-registry')
const ai = baselineById.get('ai-tools-history-archive')
assert(cya.expected_primary_records === 123 && JSON.stringify(cya.allowed_production_source_commits) === JSON.stringify(['e0079af51859cb1d006e686fceb29a25b7343ece']), 'v6 CYA canonical 123 boundary changed')
assert(bir.expected_native_counts?.bridges === 42 && bir.expected_native_counts?.incidents === 45 && bir.expected_native_counts?.events === 210 && bir.expected_native_counts?.evidence === 347, 'v6 BIR reviewed Oraichain count boundary changed')
assert(ai.local_generation?.native_generator === 'scripts/generate-machine-records.mjs' && ai.local_generation?.series_generator === 'scripts/generate-series-adapter.mjs' && ai.local_generation?.checker === 'scripts/check-series-origin.mjs', 'v6 AI local generation contract changed')
assert(ai.local_generation?.build_identity_env?.CF_PAGES_COMMIT_SHA === expectedMains['ai-tools-history-archive'] && ai.local_generation?.workspace_only === true && ai.local_generation?.network_io === false && ai.local_generation?.checker_source_mutation_authorized === false, 'v6 AI generation safety boundary changed')

let wrapper = fs.readFileSync(v5WrapperPath, 'utf8')
assert(wrapper.includes("hei-ledger-series-phase9-stage6-sog-checker-correction-2026-08-23-v5"), 'v5 wrapper authority marker missing')
assert(wrapper.includes("prepareSogV5TransientChecker"), 'v5 SOG transient correction missing')
assert(wrapper.includes("checker('AI Tools exact Series reviewed build'"), 'v5 AI checker marker missing')

wrapper = replaceOnce(
  wrapper,
  "const authorityPath = path.join(root, 'config', 'ledger-series-phase9-stage6-v5-sog-checker-correction-authority-2026-08-23.json')",
  "const authorityPath = path.join(root, 'config', 'ledger-series-phase9-stage6-ai-generation-precondition-authority-2026-08-23.json')",
  'v6 generated wrapper authority path',
)
wrapper = replaceOnce(
  wrapper,
  "const baselinePath = path.join(root, 'config', 'ledger-series-phase9-stage6-v5-execution-baseline.json')",
  "const baselinePath = path.join(root, 'config', 'ledger-series-phase9-stage6-v6-execution-baseline.json')",
  'v6 generated wrapper baseline path',
)
wrapper = replaceOnce(
  wrapper,
  "const runtimePath = path.join(root, '.stage6', 'phase9-stage6-v5-runtime-verifier.mjs')",
  "const runtimePath = path.join(root, '.stage6', 'phase9-stage6-v6-runtime-verifier.mjs')",
  'v6 runtime path',
)

const preambleStart = wrapper.indexOf('const authority = readJson(authorityPath)')
const preambleEnd = wrapper.indexOf('const repoRootExpr = "path.join(root, \' .stage6\', \'repos\')"'.replace("' .stage6'", "'.stage6'"), preambleStart)
assert(preambleStart >= 0 && preambleEnd > preambleStart, 'v5 wrapper preamble markers missing')
const generatedPreamble = `const authority = readJson(authorityPath)
const baseline = readJson(baselinePath)
const forbidden = new Set(authority.not_authorized || [])
assert(authority.authority_id === 'hei-ledger-series-phase9-stage6-ai-generation-precondition-correction-2026-08-23-v6', 'unexpected v6 authority id')
assert(authority.failed_v5_execution?.workflow_run === 32623941701 && authority.failed_v5_execution?.job === 97156272779 && authority.failed_v5_execution?.artifact_id === 9489174795 && authority.failed_v5_execution?.consumed === true && authority.failed_v5_execution?.rerun_authorized === false, 'v6 authority is not bound to consumed v5 execution')
assert(authority.reviewed_ai_contract?.reviewed_commit === '76ef103329813f0174db121117c932bff53fbf8e' && authority.reviewed_ai_contract?.generation_network_io === false, 'v6 AI reviewed contract changed')
assert(Array.isArray(authority.authorized_next_changes) && authority.authorized_next_changes.some((x) => x.includes('execute exactly one new read-only eight-registry equality run')), 'v6 one-shot not authorized')
for (const required of ['production mutation','any vertical repository mutation','AI repository mutation','canonical record or relationship mutation','central descriptor resynchronization','automatic retry or more than one new network execution','Stage 7 continuation','Stage 8 continuation','Phase 10 continuation']) assert(forbidden.has(required), 'v6 forbidden boundary missing: ' + required)
assert(authority.stage6_current_production_acceptance === 'NOT_ACCEPTED' && authority.automatic_continuation === false, 'v6 authority must remain not accepted')
assert(baseline.authority_id === authority.authority_id && baseline.authority_merge === 'fa56be7993d4caa7b1ce8f058d124b331322d319', 'v6 baseline authority binding changed')
assert(baseline.execution_count_authorized === 1 && baseline.automatic_baseline_refresh_authorized === false, 'v6 finite baseline changed')
assert(baseline.production_mutation_authorized === false && baseline.vertical_repository_mutation_authorized === false && baseline.ai_repository_mutation_authorized === false && baseline.canonical_record_or_relationship_mutation_authorized === false && baseline.central_descriptor_resync_authorized === false && baseline.cloudflare_dns_deployment_mutation_authorized === false, 'v6 baseline mutation boundary weakened')
assert(Array.isArray(baseline.registries) && baseline.registries.length === 8, 'v6 baseline must cover eight registries')
assert(baseline.stage5_relationship_counts?.total === 244 && baseline.stage5_relationship_counts?.cross_registry === 0, 'Stage 5 relationship boundary changed')
const byId = new Map(baseline.registries.map((item) => [item.registry_id, item]))
const expectedMains = ${JSON.stringify(expectedMains, null, 2)}
for (const [id, exact] of Object.entries(expectedMains)) {
  const item = byId.get(id)
  assert(item && (item.reviewed_main ?? item.reviewed_main_before_implementation) === exact, id + ': v6 reviewed main changed')
}
const heiBaseline = byId.get('historical-exchange-index')
const magBaseline = byId.get('minted-and-gone')
const sogBaseline = byId.get('stable-or-gone')
const cyaBaseline = byId.get('crypto-yield-archive')
const aiBaseline = byId.get('ai-tools-history-archive')
assert(heiBaseline.production_runtime_source === '932dea2acfee90a34d7c17390402b8b835bec621', 'v6 HEI reviewed runtime source changed')
assert(JSON.stringify(heiBaseline.allowed_preimplementation_build_commits) === JSON.stringify(['932dea2acfee90a34d7c17390402b8b835bec621','93352c7a3d63bdbdfaa74ba6bd4e631356e0f395','fa56be7993d4caa7b1ce8f058d124b331322d319']), 'v6 HEI build allowlist changed')
assert(magBaseline.production_runtime_source === magBaseline.reviewed_main, 'v6 MAG reviewed build changed')
assert(sogBaseline.expected_current_canonical_hash === 'sha256:bba93c1e3f0ea1b050cd395455327b70fb7c1920d37b18c300949bb49df53965' && sogBaseline.historical_stage5_authority_hash === 'sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798', 'v6 SOG correction boundary changed')
assert(cyaBaseline.expected_primary_records === 123 && JSON.stringify(cyaBaseline.allowed_production_source_commits) === JSON.stringify(['e0079af51859cb1d006e686fceb29a25b7343ece']), 'v6 CYA canonical 123 boundary changed')
assert(aiBaseline.local_generation?.build_identity_env?.CF_PAGES_COMMIT_SHA === '76ef103329813f0174db121117c932bff53fbf8e' && aiBaseline.local_generation?.workspace_only === true && aiBaseline.local_generation?.network_io === false, 'v6 AI local generation boundary changed')

`
wrapper = `${wrapper.slice(0, preambleStart)}${generatedPreamble}${wrapper.slice(preambleEnd)}`

const postPatchMarker = 'fs.mkdirSync(path.dirname(runtimePath), { recursive: true })'
const postPatch = `const v6RuntimeRows = baseline.registries.map((item) => {
  const reviewed = item.reviewed_main ?? item.reviewed_main_before_implementation
  return [item.registry_id, {
    repository: item.repository,
    origin: item.origin,
    main: item.registry_id === 'historical-exchange-index' ? '932dea2acfee90a34d7c17390402b8b835bec621' : reviewed,
    reviewed_main: reviewed,
  }]
})
source = replaceOnce(source,
  "assert(authority.authority_id === 'hei-ledger-series-phase9-stage6-sog-checker-correction-2026-08-23-v5', 'unexpected Stage 6 v5 authority')",
  "assert(authority.authority_id === 'hei-ledger-series-phase9-stage6-ai-generation-precondition-correction-2026-08-23-v6', 'unexpected Stage 6 v6 authority')",
  'v6 runtime authority id')
source = replaceOnce(source,
  "assert(authority.authorization?.network_read_only_reverification_authorized_after_v5_implementation_merge === true && authority.authorization?.network_execution_count_authorized === 1, 'Stage 6 v5 network execution is not authorized')",
  "assert(Array.isArray(authority.authorized_next_changes) && authority.authorized_next_changes.some((x) => x.includes('execute exactly one new read-only eight-registry equality run')), 'Stage 6 v6 network execution is not authorized')",
  'v6 runtime network authority')
source = replaceOnce(source,
  "assert(authority.authorization?.production_mutation_authorized === false && authority.authorization?.vertical_repository_mutation_authorized === false && authority.authorization?.sog_repository_mutation_authorized === false && authority.authorization?.canonical_record_mutation_authorized === false && authority.authorization?.relationship_mutation_authorized === false && authority.authorization?.central_descriptor_resync_authorized === false, 'Stage 6 v5 mutation boundary weakened')",
  "assert((authority.not_authorized || []).includes('production mutation') && (authority.not_authorized || []).includes('any vertical repository mutation') && (authority.not_authorized || []).includes('AI repository mutation') && (authority.not_authorized || []).includes('canonical record or relationship mutation') && (authority.not_authorized || []).includes('central descriptor resynchronization'), 'Stage 6 v6 mutation boundary weakened')",
  'v6 runtime mutation authority')
source = replaceOnce(source,
  "assert(authority.reviewed_repository_mains_at_authority_creation?.length === 8, 'Stage 6 v5 authority must cover eight registries')",
  "assert(authority.failed_v5_execution?.workflow_run === 32623941701 && authority.failed_v5_execution?.consumed === true && authority.failed_v5_execution?.rerun_authorized === false, 'Stage 6 v6 authority is not bound to consumed v5 execution')",
  'v6 runtime authority binding')
source = replaceOnce(source,
  "const byId = new Map(authority.reviewed_repository_mains_at_authority_creation.map((x) => [x.registry_id, { ...x, reviewed_main: x.main }]))",
  'const byId = new Map(' + JSON.stringify(v6RuntimeRows) + ')',
  'v6 runtime reviewed repository map')
source = replaceOnce(source, "schema_version: '1.5.0'", "schema_version: '1.6.0'", 'v6 report schema')
source = replaceOnce(source,
  "execution_kind: 'read_only_cross_registry_current_production_sog_checker_correction_v5'",
  "execution_kind: 'read_only_cross_registry_current_production_ai_generation_precondition_v6'",
  'v6 execution kind')
source = replaceOnce(source,
  "execution_baseline_id: 'hei-ledger-series-phase9-stage6-v5-execution-baseline-2026-08-23',\\n  corrected_from_v4_run_id: 32620749266,\\n  corrected_from_v4_artifact_id: 9488302977,",
  "execution_baseline_id: 'hei-ledger-series-phase9-stage6-v6-execution-baseline-2026-08-23',\\n  corrected_from_v5_run_id: 32623941701,\\n  corrected_from_v5_artifact_id: 9489174795,",
  'v6 report provenance')
const aiCheckerNeedle = \`  const ai = REVIEW['ai-tools-history-archive']
  checker('AI Tools exact Series reviewed build', 'ai-tools-history-archive', 'scripts/check-series-origin.mjs', [], {
    SERIES_ORIGIN: ai.origin, SERIES_EXPECTED_COMMIT: ai.production_revision, SERIES_VERIFY_ATTEMPTS: '3', SERIES_VERIFY_INTERVAL_MS: '5000',
  })\`
const aiCheckerReplacement = \`  const ai = REVIEW['ai-tools-history-archive']
  const aiGenerationEnv = { ...process.env, CF_PAGES_COMMIT_SHA: ai.repo_main, PUBLIC_SITE_URL: ai.origin }
  const aiGenerators = ['scripts/generate-machine-records.mjs', 'scripts/generate-series-adapter.mjs']
  for (const generator of aiGenerators) {
    const generated = spawnSync(process.execPath, [generator], { cwd: ai.local, env: aiGenerationEnv, encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024 })
    if (generated.error) throw new Error('AI v6 local generation ' + generator + ': ' + generated.error.message)
    if (generated.status !== 0) throw new Error('AI v6 local generation ' + generator + ' failed: ' + ((generated.stderr || generated.stdout || '').trim().slice(-3500) || 'exit ' + generated.status))
  }
  const aiLocalVersion = readJson(path.join(ai.local, 'public', 'version.json'))
  const aiLocalSeriesIndex = readJson(path.join(ai.local, 'public', 'data', 'series', 'index.json'))
  assert(aiLocalVersion.build_commit === ai.repo_main, 'AI v6 generated build_commit mismatch')
  assert(aiLocalSeriesIndex.registry_id === 'ai-tools-history-archive' && aiLocalSeriesIndex.record_count > 0 && Array.isArray(aiLocalSeriesIndex.records) && aiLocalSeriesIndex.records.length === aiLocalSeriesIndex.record_count, 'AI v6 generated Series index contract mismatch')
  report.ai_v6_local_generation = { source_commit: ai.repo_main, generators: aiGenerators, build_commit: aiLocalVersion.build_commit, record_count: aiLocalSeriesIndex.record_count, workspace_only: true, network_io: false, checker_source_mutated: false, status: 'PREPARED' }
  writeReport()
  checker('AI Tools exact Series reviewed build', 'ai-tools-history-archive', 'scripts/check-series-origin.mjs', [], {
    SERIES_ORIGIN: ai.origin, SERIES_EXPECTED_COMMIT: ai.production_revision, SERIES_VERIFY_ATTEMPTS: '3', SERIES_VERIFY_INTERVAL_MS: '5000',
  })\`
source = replaceOnce(source, aiCheckerNeedle, aiCheckerReplacement, 'v6 AI local generation precondition')
source = replaceOnce(source,
  "if (report.sog_v5_transient_checker) report.sog_v5_transient_checker.status = 'PASS'\\n  report.overall = 'PASS'",
  "if (report.sog_v5_transient_checker) report.sog_v5_transient_checker.status = 'PASS'\\n  if (report.ai_v6_local_generation) report.ai_v6_local_generation.status = 'PASS'\\n  report.overall = 'PASS'",
  'v6 PASS metadata')

${postPatchMarker}`
wrapper = replaceOnce(wrapper, postPatchMarker, postPatch, 'v6 runtime post-patch injection')

fs.mkdirSync(path.dirname(generatedWrapperPath), { recursive: true })
fs.writeFileSync(generatedWrapperPath, wrapper)
const generatedSyntax = spawnSync(process.execPath, ['--check', generatedWrapperPath], { cwd: root, encoding: 'utf8' })
if (generatedSyntax.status !== 0) {
  process.stderr.write(generatedSyntax.stderr || generatedSyntax.stdout || '')
  throw new Error(`v6 generated wrapper syntax check failed with ${generatedSyntax.status}`)
}

const args = prepareOnly ? ['--prepare-only'] : []
const run = spawnSync(process.execPath, [generatedWrapperPath, ...args], {
  cwd: root,
  env: process.env,
  stdio: 'inherit',
  timeout: prepareOnly ? 120000 : 22 * 60 * 1000,
})
if (run.error) throw run.error
if (run.status !== 0) process.exit(run.status ?? 1)

console.log(JSON.stringify({
  ok: true,
  generated_wrapper: path.relative(root, generatedWrapperPath),
  authority_id: authority.authority_id,
  execution_baseline_id: baseline.baseline_id,
  reviewed_cya_main: expectedMains['crypto-yield-archive'],
  reviewed_cya_primary_records: cya.expected_primary_records,
  reviewed_bir_main: expectedMains['bridge-incident-registry'],
  reviewed_ai_main: expectedMains['ai-tools-history-archive'],
  ai_local_generation_precondition: true,
  prepare_only: prepareOnly,
}, null, 2))
