import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'

const root = process.cwd()
const prepareOnly = process.argv.includes('--prepare-only')
const authorityPath = path.join(root, 'config', 'ledger-series-phase9-stage6-v8-authority-semantic-sog-native-2026-08-23.json')
const baselinePath = path.join(root, 'config', 'ledger-series-phase9-stage6-v8-execution-baseline.json')
const originalVerifierPath = path.join(root, 'scripts', 'verify-ledger-series-phase9-stage6-production-equality.mjs')
const runtimePath = path.join(root, '.stage6', 'phase9-stage6-v8-runtime-verifier.mjs')
const resultPath = process.env.STAGE6_RESULT_PATH || path.join(root, '.stage6', 'phase9-stage6-v8-current-production-result.json')

function assert(condition, message) { if (!condition) throw new Error(message) }
function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')) }
function js(value) { return JSON.stringify(value) }
function replaceOnce(source, needle, replacement, label) {
  const first = source.indexOf(needle)
  assert(first >= 0, `${label}: marker not found`)
  assert(source.indexOf(needle, first + needle.length) < 0, `${label}: marker is not unique`)
  return `${source.slice(0, first)}${replacement}${source.slice(first + needle.length)}`
}

if (!prepareOnly) {
  fs.mkdirSync(path.dirname(resultPath), { recursive: true })
  fs.writeFileSync(resultPath, `${JSON.stringify({
    schema_version: '1.8.0',
    phase: 9,
    stage: 6,
    execution_kind: 'read_only_cross_registry_current_production_semantic_sog_native_v8',
    authority_id: 'hei-ledger-series-phase9-stage6-authority-semantic-sog-native-correction-2026-08-23-v8',
    execution_baseline_id: 'hei-ledger-series-phase9-stage6-v8-execution-baseline-2026-08-23',
    started_at: new Date().toISOString(),
    overall: 'WRAPPER_STARTED',
  }, null, 2)}\n`)
}

const authority = readJson(authorityPath)
const baseline = readJson(baselinePath)
const forbidden = new Set(authority.not_authorized || [])
const authorityId = 'hei-ledger-series-phase9-stage6-authority-semantic-sog-native-correction-2026-08-23-v8'

assert(authority.authority_id === authorityId, 'unexpected v8 authority id')
assert(authority.failed_v7_execution?.workflow_run === 32631652830 && authority.failed_v7_execution?.job === 97175265879, 'v8 authority consumed-v7 run/job binding changed')
assert(authority.failed_v7_execution?.implementation_merge === 'ca13950e1b43cc6842e70d1a2038a7ff1c7af5f0', 'v8 authority consumed-v7 implementation merge changed')
assert(authority.failed_v7_execution?.artifact_available === false && authority.failed_v7_execution?.consumed === true && authority.failed_v7_execution?.rerun_authorized === false, 'v8 authority v7 consumption boundary changed')
assert(authority.failure_review?.defect_class === 'verifier_authority_semantic_compatibility_defect', 'unexpected v8 failure classification')
assert(authority.failed_v7_execution?.production_equality_assertions_started === false && authority.failed_v7_execution?.production_drift_observed === false, 'v8 must remain a verifier-only correction')
assert(Array.isArray(authority.authorized_next_changes) && authority.authorized_next_changes.some((x) => x.includes('execute exactly one new read-only eight-registry equality run')), 'v8 one-shot network execution is not authorized')
assert(authority.authorized_next_changes.some((x) => x.includes('corrected native scripts/verify-stage5-production.mjs')), 'v8 native SOG checker use is not authorized')
assert(authority.authorized_next_changes.some((x) => x.includes('workspace-local generation precondition')), 'v8 AI local generation is not authorized')
for (const required of [
  'rerun of workflow run 32631652830',
  'production mutation',
  'any vertical repository mutation',
  'AI repository mutation',
  'SOG repository mutation',
  'canonical record mutation',
  'relationship mutation',
  'central descriptor resynchronization',
  'Cloudflare or DNS change',
  'deployment mutation',
  'silent latest-main acceptance',
  'automatic baseline refresh',
  'automatic repair',
  'automatic retry or more than one new network execution',
  'Stage 7 continuation',
  'Stage 8 continuation',
  'Phase 10 continuation',
]) assert(forbidden.has(required), `v8 forbidden boundary missing: ${required}`)
assert(authority.stage6_current_production_acceptance === 'NOT_ACCEPTED' && authority.automatic_continuation === false, 'v8 authority must not pre-accept Stage 6')

assert(baseline.authority_id === authorityId && baseline.authority_merge === 'ade94505a7af45223a98340cf7b0c3a2bf1b5fed', 'v8 baseline authority binding changed')
assert(baseline.corrected_from_v7_execution?.workflow_run === 32631652830 && baseline.corrected_from_v7_execution?.artifact_available === false && baseline.corrected_from_v7_execution?.consumed === true && baseline.corrected_from_v7_execution?.rerun_authorized === false, 'v8 baseline v7 consumption boundary changed')
assert(baseline.execution_count_authorized === 1 && baseline.automatic_baseline_refresh_authorized === false, 'v8 finite execution boundary changed')
assert(baseline.production_mutation_authorized === false && baseline.vertical_repository_mutation_authorized === false && baseline.ai_repository_mutation_authorized === false && baseline.sog_repository_mutation_authorized === false && baseline.canonical_record_mutation_authorized === false && baseline.relationship_mutation_authorized === false && baseline.central_descriptor_resync_authorized === false && baseline.cloudflare_dns_deployment_mutation_authorized === false, 'v8 baseline mutation boundary weakened')
assert(Array.isArray(baseline.registries) && baseline.registries.length === 8, 'v8 baseline must cover eight registries')
assert(baseline.stage5_relationship_counts?.total === 244 && baseline.stage5_relationship_counts?.cross_registry === 0, 'Stage 5 relationship boundary changed')

const byId = new Map(baseline.registries.map((item) => [item.registry_id, item]))
const expectedMains = {
  'historical-exchange-index': '9f21ab16e17bb3840827714c72483bf8e5764d3c',
  'minted-and-gone': 'f917d5e25eedc7b2c48091c7343b7fa9cd203428',
  'stable-or-gone': 'ceb30f76c4af2182c866e6966872176b2150c7da',
  'crypto-yield-archive': 'c1291cc891350a8105ffeb53f61522e3c822b7c5',
  'bridge-incident-registry': '0e1769e75a9647be4ead61fafefde2bd6dc49e60',
  'cryptocurrency-wallet-lifecycle-registry': 'f6b542a0f724d4243a77c08b5b1febdb8585a148',
  'ai-tools-history-archive': '76ef103329813f0174db121117c932bff53fbf8e',
  'api-deprecation-archive': '641a6d4243d30f95f48436455d2cbc12a8aded53',
}
for (const [id, exact] of Object.entries(expectedMains)) {
  const item = byId.get(id)
  assert(item && (item.reviewed_main ?? item.reviewed_main_before_implementation) === exact, `${id}: reviewed v8 main changed`)
}
const heiBaseline = byId.get('historical-exchange-index')
const sogBaseline = byId.get('stable-or-gone')
const cyaBaseline = byId.get('crypto-yield-archive')
const birBaseline = byId.get('bridge-incident-registry')
const aiBaseline = byId.get('ai-tools-history-archive')
assert(heiBaseline.canonical_content_through === '9f21ab16e17bb3840827714c72483bf8e5764d3c', 'v8 HEI canonical boundary changed')
assert(JSON.stringify(heiBaseline.allowed_production_build_commits) === JSON.stringify(['23636622b1a1f6e5514c3bba36583149868b6af2','ade94505a7af45223a98340cf7b0c3a2bf1b5fed','9f21ab16e17bb3840827714c72483bf8e5764d3c']), 'v8 HEI allowed production builds changed')
assert(sogBaseline.native_checker_fix_through === 'd26d50eba858b3528fdd5713814068ab55956913', 'v8 SOG native checker fix boundary changed')
assert(sogBaseline.expected_current_canonical_hash === 'sha256:bba93c1e3f0ea1b050cd395455327b70fb7c1920d37b18c300949bb49df53965' && sogBaseline.expected_primary_records === 119 && sogBaseline.expected_relationships === 1, 'v8 SOG current canonical boundary changed')
assert(JSON.stringify(sogBaseline.allowed_production_build_commits) === JSON.stringify(['e8663a8289033a3a6af7cb19fb31683b2545e61c','d26d50eba858b3528fdd5713814068ab55956913','ceb30f76c4af2182c866e6966872176b2150c7da']), 'v8 SOG allowed production builds changed')
assert(cyaBaseline.expected_primary_records === 124 && JSON.stringify(cyaBaseline.allowed_production_source_commits) === JSON.stringify(['34c543ae2dec344e334d308344d1413beb6fe20b','c1291cc891350a8105ffeb53f61522e3c822b7c5']), 'v8 CYA canonical 124 boundary changed')
assert(JSON.stringify(birBaseline.expected_native_counts) === JSON.stringify({ bridges: 42, incidents: 45, events: 210, evidence: 347 }), 'v8 BIR reviewed boundary changed')
assert(aiBaseline.local_generation?.native_generator === 'scripts/generate-machine-records.mjs' && aiBaseline.local_generation?.series_generator === 'scripts/generate-series-adapter.mjs' && aiBaseline.local_generation?.checker === 'scripts/check-series-origin.mjs', 'v8 AI generation contract changed')
assert(aiBaseline.local_generation?.build_identity_env?.CF_PAGES_COMMIT_SHA === expectedMains['ai-tools-history-archive'] && aiBaseline.local_generation?.workspace_only === true && aiBaseline.local_generation?.network_io === false && aiBaseline.local_generation?.checker_source_mutation_authorized === false, 'v8 AI generation safety boundary changed')

const authorityMains = new Map((authority.reviewed_repository_mains_at_authority_creation || []).map((item) => [item.registry_id, item]))
assert(authorityMains.size === 8, 'v8 authority must record eight creation-time mains')
for (const [id, item] of byId) {
  const frozen = authorityMains.get(id)
  assert(frozen && frozen.repository === item.repository, `${id}: repository identity changed from v8 authority`)
  if (id === 'historical-exchange-index') assert(frozen.main === '23636622b1a1f6e5514c3bba36583149868b6af2', 'HEI v8 authority-creation main changed')
  else if (id === 'stable-or-gone') assert(frozen.main === 'd26d50eba858b3528fdd5713814068ab55956913', 'SOG v8 authority-creation main changed')
  else assert(frozen.main === (item.reviewed_main ?? item.reviewed_main_before_implementation), `${id}: v8 authority-creation main mismatch`)
}

const repoRootExpr = "path.join(root, '.stage6', 'repos')"
const reviewLines = []
function addReview(id, localExpr, productionRevision = null, extra = {}) {
  const item = byId.get(id)
  const repoMain = item.reviewed_main ?? item.reviewed_main_before_implementation
  reviewLines.push(`  ${js(id)}: {`)
  reviewLines.push(`    repository: ${js(item.repository)}, repo_main: ${js(repoMain)}, production_revision: ${productionRevision ? js(productionRevision) : 'null'}, origin: ${js(item.origin)}, local: ${localExpr},`)
  for (const [key, value] of Object.entries(extra)) reviewLines.push(`    ${key}: ${js(value)},`)
  reviewLines.push('  },')
}
addReview('historical-exchange-index', 'root', null, { allowed_build_commits: heiBaseline.allowed_production_build_commits })
addReview('minted-and-gone', `path.join(${repoRootExpr}, 'mag')`, byId.get('minted-and-gone').production_runtime_source)
addReview('stable-or-gone', `path.join(${repoRootExpr}, 'sog')`, null, {
  allowed_build_commits: sogBaseline.allowed_production_build_commits,
  expected_current_canonical_hash: sogBaseline.expected_current_canonical_hash,
  expected_primary_records: sogBaseline.expected_primary_records,
})
addReview('crypto-yield-archive', `path.join(${repoRootExpr}, 'cya')`, null, {
  allowed_source_commits: cyaBaseline.allowed_production_source_commits,
  expected_primary_records: cyaBaseline.expected_primary_records,
})
addReview('bridge-incident-registry', `path.join(${repoRootExpr}, 'bir')`)
addReview('cryptocurrency-wallet-lifecycle-registry', `path.join(${repoRootExpr}, 'wlr')`)
addReview('ai-tools-history-archive', `path.join(${repoRootExpr}, 'ai')`, aiBaseline.production_runtime_source)
addReview('api-deprecation-archive', `path.join(${repoRootExpr}, 'api')`)

let source = fs.readFileSync(originalVerifierPath, 'utf8')
const originalSha = createHash('sha256').update(source).digest('hex')
assert(source.includes("hei-ledger-series-phase9-stage6-production-equality-2026-08-21-v2"), 'original verifier authority marker changed')
assert(source.includes("execution_kind: 'read_only_cross_registry_production_equality_corrected'"), 'original verifier execution marker changed')
assert(source.includes("checker('SOG Stage 5 relationships', 'stable-or-gone', 'scripts/verify-stage5-production.mjs'"), 'original native SOG Stage 5 checker invocation changed')
assert(!source.includes('prepareSogV5TransientChecker') && !source.includes('sog_v5_transient_checker'), 'original verifier unexpectedly contains transient SOG patch')

source = replaceOnce(
  source,
  "config', 'ledger-series-phase9-stage6-production-equality-authority.json'",
  "config', 'ledger-series-phase9-stage6-v8-authority-semantic-sog-native-2026-08-23.json'",
  'v8 authority path',
)
const reviewStart = source.indexOf('const REVIEW = {')
const reviewEndMarker = '\n\nconst expectedRelationships ='
const reviewEnd = source.indexOf(reviewEndMarker, reviewStart)
assert(reviewStart >= 0 && reviewEnd > reviewStart, 'original REVIEW block markers missing')
source = `${source.slice(0, reviewStart)}const REVIEW = {\n${reviewLines.join('\n')}\n}${source.slice(reviewEnd)}`
source = replaceOnce(
  source,
  "assert(authority.authority_id === 'hei-ledger-series-phase9-stage6-production-equality-2026-08-21-v2', 'unexpected Stage 6 authority')",
  `assert(authority.authority_id === '${authorityId}', 'unexpected Stage 6 v8 authority')`,
  'v8 runtime authority id',
)
source = replaceOnce(
  source,
  "assert(authority.network_read_only_verification_authorized_after_merge === true, 'Stage 6 network verification is not authorized')",
  "assert(Array.isArray(authority.authorized_next_changes) && authority.authorized_next_changes.some((x) => x.includes('execute exactly one new read-only eight-registry equality run')), 'Stage 6 v8 network verification is not authorized')",
  'v8 runtime network authority',
)
source = replaceOnce(
  source,
  "assert(authority.production_mutation_authorized === false && authority.vertical_repository_mutation_authorized === false && authority.central_descriptor_resync_authorized === false, 'Stage 6 mutation boundary weakened')",
  "const runtimeForbidden = new Set(authority.not_authorized || [])\nfor (const required of ['production mutation','any vertical repository mutation','canonical record mutation','relationship mutation','central descriptor resynchronization']) assert(runtimeForbidden.has(required), 'Stage 6 v8 mutation boundary weakened: ' + required)",
  'v8 runtime mutation authority',
)
source = replaceOnce(
  source,
  "assert(authority.reviewed_repository_baselines?.length === 8, 'Stage 6 authority must cover eight registries')",
  "assert(authority.reviewed_repository_mains_at_authority_creation?.length === 8, 'Stage 6 v8 authority must cover eight registries')",
  'v8 runtime authority registry list',
)
const oldAuthorityLoop = `const byId = new Map(authority.reviewed_repository_baselines.map((x) => [x.registry_id, x]))
for (const [id, review] of Object.entries(REVIEW)) {
  const frozen = byId.get(id)
  assert(frozen, \`${'${id}'}: missing frozen authority baseline\`)
  assert(frozen.repository === review.repository, \`${'${id}'}: repository changed from authority\`)
  review.origin = frozen.origin
  review.verification_mode = frozen.verification_mode
}`
const newAuthorityLoop = `const byId = new Map(authority.reviewed_repository_mains_at_authority_creation.map((x) => [x.registry_id, x]))
for (const [id, review] of Object.entries(REVIEW)) {
  const frozen = byId.get(id)
  assert(frozen, \`${'${id}'}: missing frozen v8 authority baseline\`)
  assert(frozen.repository === review.repository, \`${'${id}'}: repository changed from v8 authority\`)
  if (id === 'historical-exchange-index') assert(frozen.main === '23636622b1a1f6e5514c3bba36583149868b6af2', 'HEI v8 authority-creation main changed')
  else if (id === 'stable-or-gone') assert(frozen.main === 'd26d50eba858b3528fdd5713814068ab55956913', 'SOG v8 authority-creation main changed')
  else assert(frozen.main === review.repo_main, \`${'${id}'}: reviewed main changed from v8 authority creation\`)
}`
source = replaceOnce(source, oldAuthorityLoop, newAuthorityLoop, 'v8 runtime authority identity loop')
source = replaceOnce(source, "schema_version: '1.1.0'", "schema_version: '1.8.0'", 'v8 report schema')
source = replaceOnce(source, "execution_kind: 'read_only_cross_registry_production_equality_corrected'", "execution_kind: 'read_only_cross_registry_current_production_semantic_sog_native_v8'", 'v8 execution kind')
source = replaceOnce(
  source,
  "  authority_id: authority.authority_id,",
  "  authority_id: authority.authority_id,\n  execution_baseline_id: 'hei-ledger-series-phase9-stage6-v8-execution-baseline-2026-08-23',\n  corrected_from_v7_run_id: 32631652830,\n  corrected_from_v7_job_id: 97175265879,\n  corrected_from_v7_artifact_available: false,\n  original_verifier_sha256: '" + originalSha + "',",
  'v8 report provenance',
)
source = replaceOnce(
  source,
  "      assert(githubSha && observed === githubSha, `HEI main moved: workflow ${githubSha || 'missing'}, observed ${observed}`)",
  "      const expectedHeiExecutionSha = (process.env.STAGE6_HEI_EXECUTION_SHA || githubSha || '').trim()\n      assert(expectedHeiExecutionSha && observed === expectedHeiExecutionSha, `HEI main moved: v8 execution ${expectedHeiExecutionSha || 'missing'}, observed ${observed}`)",
  'v8 HEI execution SHA preflight',
)
source = replaceOnce(
  source,
  "HEI_PUBLIC_ORIGIN: hei.origin, EXPECTED_COMMIT: hei.production_revision, SMOKE_MAX_ATTEMPTS: '3', SMOKE_RETRY_DELAY_MS: '5000',",
  "HEI_PUBLIC_ORIGIN: hei.origin, EXPECTED_COMMIT: '', SMOKE_MAX_ATTEMPTS: '3', SMOKE_RETRY_DELAY_MS: '5000',",
  'v8 HEI checker build semantics',
)
source = replaceOnce(
  source,
  "SOG_BASE_URL: sog.origin, SOG_EXPECTED_COMMIT: sog.production_revision, SOG_SMOKE_ATTEMPTS: '3', SOG_SMOKE_DELAY_MS: '5000',",
  "SOG_BASE_URL: sog.origin, SOG_EXPECTED_COMMIT: '', GITHUB_SHA: '', SOG_SMOKE_ATTEMPTS: '3', SOG_SMOKE_DELAY_MS: '5000',",
  'v8 SOG checker build semantics',
)
source = replaceOnce(
  source,
  "CYA_BASE_URL: cya.origin, CYA_EXPECTED_COMMIT: cya.production_revision, CYA_SMOKE_ATTEMPTS: '3', CYA_SMOKE_DELAY_MS: '5000',",
  "CYA_BASE_URL: cya.origin, CYA_EXPECTED_COMMIT: '', CYA_SMOKE_ATTEMPTS: '3', CYA_SMOKE_DELAY_MS: '5000',",
  'v8 CYA checker commit semantics',
)

const aiCheckerBlock = `  const ai = REVIEW['ai-tools-history-archive']
  checker('AI Tools exact Series reviewed build', 'ai-tools-history-archive', 'scripts/check-series-origin.mjs', [], {
    SERIES_ORIGIN: ai.origin, SERIES_EXPECTED_COMMIT: ai.production_revision, SERIES_VERIFY_ATTEMPTS: '3', SERIES_VERIFY_INTERVAL_MS: '5000',
  })`
const aiGenerationBlock = `  const ai = REVIEW['ai-tools-history-archive']
  const aiCheckerPath = path.join(ai.local, 'scripts', 'check-series-origin.mjs')
  const aiCheckerBefore = createHash('sha256').update(fs.readFileSync(aiCheckerPath)).digest('hex')
  const aiGenerationEnv = { CF_PAGES_COMMIT_SHA: ai.production_revision }
  checker('AI Tools workspace-local native generation', 'ai-tools-history-archive', 'scripts/generate-machine-records.mjs', [], aiGenerationEnv)
  checker('AI Tools workspace-local Series generation', 'ai-tools-history-archive', 'scripts/generate-series-adapter.mjs', [], aiGenerationEnv)
  const aiCheckerAfter = createHash('sha256').update(fs.readFileSync(aiCheckerPath)).digest('hex')
  assert(aiCheckerAfter === aiCheckerBefore, 'AI checker source changed during workspace-local generation')
  report.ai_v8_local_generation = { native_generator: 'scripts/generate-machine-records.mjs', series_generator: 'scripts/generate-series-adapter.mjs', build_identity_commit: ai.production_revision, workspace_only: true, network_io: false, checker_source_sha256: aiCheckerAfter, status: 'PASS' }
  writeReport()
  checker('AI Tools exact Series reviewed build', 'ai-tools-history-archive', 'scripts/check-series-origin.mjs', [], {
    SERIES_ORIGIN: ai.origin, SERIES_EXPECTED_COMMIT: ai.production_revision, SERIES_VERIFY_ATTEMPTS: '3', SERIES_VERIFY_INTERVAL_MS: '5000',
  })`
source = replaceOnce(source, aiCheckerBlock, aiGenerationBlock, 'v8 AI local generation precondition')

const registryBoundaryNeedle = `  if (id === 'crypto-yield-archive') await verifyCyaDerivedCount(review, descriptor, index)
  if (id === 'cryptocurrency-wallet-lifecycle-registry') await verifyWlrCanonical(review)`
const registryBoundaryReplacement = `  if (id === 'historical-exchange-index') {
    const localHeiCount = fs.readdirSync(path.join(root, 'records', 'exchanges')).filter((name) => name.endsWith('.json')).length
    assert(localHeiCount > 0, 'HEI local canonical record count is empty')
    assert(descriptor.record_counts?.primary_records === localHeiCount, 'HEI descriptor primary count ' + descriptor.record_counts?.primary_records + ' != reviewed local canonical ' + localHeiCount)
    assert(index.record_count === localHeiCount, 'HEI Series index ' + index.record_count + ' != reviewed local canonical ' + localHeiCount)
    const heiVersion = await live(review, '/version.json', 'HEI native version')
    assertSame(descriptor.verification?.build, heiVersion.build, 'HEI descriptor/native build')
    assertSame(index.verification?.build, heiVersion.build, 'HEI index/native build')
    const executionSha = (process.env.STAGE6_HEI_EXECUTION_SHA || '').trim()
    const allowed = new Set([...(review.allowed_build_commits || []), executionSha].filter(Boolean))
    assert(allowed.has(heiVersion.build?.commit), 'HEI production build ' + heiVersion.build?.commit + ' is outside reviewed v8 build allowlist')
  }
  if (id === 'stable-or-gone') {
    assert(descriptor.record_counts?.primary_records === review.expected_primary_records, 'SOG primary count changed from reviewed 119 boundary')
    const sogVersion = await live(review, '/version.json', 'SOG native version')
    assertSame(descriptor.verification?.build, sogVersion.build, 'SOG descriptor/native build')
    assertSame(index.verification?.build, sogVersion.build, 'SOG index/native build')
    const allowed = new Set(review.allowed_build_commits || [])
    assert(allowed.has(sogVersion.build?.commit), 'SOG production build ' + sogVersion.build?.commit + ' is outside reviewed v8 build allowlist')
    assert(sogVersion.build?.canonical_data_hash === review.expected_current_canonical_hash, 'SOG production canonical hash changed from reviewed v8 boundary')
  }
  if (id === 'crypto-yield-archive') {
    await verifyCyaDerivedCount(review, descriptor, index)
    assert(descriptor.record_counts?.primary_records === review.expected_primary_records, 'CYA primary count: expected ' + review.expected_primary_records + ', observed ' + descriptor.record_counts?.primary_records)
    const cyaVersion = await live(review, '/version.json', 'CYA native version')
    assertSame(descriptor.verification?.build, cyaVersion.build, 'CYA descriptor/native build')
    assertSame(index.verification?.build, cyaVersion.build, 'CYA index/native build')
    const allowed = new Set(review.allowed_source_commits || [])
    assert(allowed.size > 0, 'CYA reviewed source-commit allowlist missing')
    try {
      const cyaOrigin = review.origin.endsWith('/') ? review.origin.slice(0, -1) : review.origin
      const sourceCommit = (await fetchText(cyaOrigin + '/cya-source-commit.txt?stage6=' + nonce, 'CYA deployed source commit')).trim()
      assert(allowed.has(sourceCommit), 'CYA deployed source commit ' + sourceCommit + ' is outside reviewed v8 allowlist')
    } catch (error) {
      if (!String(error?.message || error).includes('HTTP 404')) throw error
    }
  }
  if (id === 'cryptocurrency-wallet-lifecycle-registry') await verifyWlrCanonical(review)`
source = replaceOnce(source, registryBoundaryNeedle, registryBoundaryReplacement, 'v8 reviewed current-content boundaries')

assert(!source.includes('ledger-series-phase9-stage6-v5-sog-checker-correction-authority') && !source.includes('ledger-series-phase9-stage6-ai-generation-precondition-authority') && !source.includes('ledger-series-phase9-stage6-v7-runtime-authority-path-correction-authority'), 'v8 runtime retained obsolete authority reference')
assert(!source.includes('prepareSogV5TransientChecker') && !source.includes('sog_v5_transient_checker'), 'v8 runtime retained transient SOG checker logic')
assert(source.includes("checker('SOG Stage 5 relationships', 'stable-or-gone', 'scripts/verify-stage5-production.mjs'"), 'v8 runtime does not invoke native SOG Stage 5 checker')
assert(source.includes("SOG_EXPECTED_COMMIT: '', GITHUB_SHA: ''"), 'v8 runtime does not isolate SOG checker from HEI workflow SHA')
assert(source.includes('AI Tools workspace-local native generation') && source.includes('AI Tools workspace-local Series generation'), 'v8 runtime lost AI local generation')
assert(source.includes("'canonical record mutation','relationship mutation'"), 'v8 runtime does not enforce separated mutation prohibitions')
assert(source.includes("repo_main: \"9f21ab16e17bb3840827714c72483bf8e5764d3c\""), 'v8 runtime HEI reviewed main mismatch')
assert(source.includes("repo_main: \"ceb30f76c4af2182c866e6966872176b2150c7da\""), 'v8 runtime SOG reviewed main mismatch')
assert(source.includes("repo_main: \"c1291cc891350a8105ffeb53f61522e3c822b7c5\""), 'v8 runtime CYA reviewed main mismatch')
assert(source.includes("repo_main: \"f6b542a0f724d4243a77c08b5b1febdb8585a148\""), 'v8 runtime WLR reviewed main mismatch')

fs.mkdirSync(path.dirname(runtimePath), { recursive: true })
fs.writeFileSync(runtimePath, source)
const syntax = spawnSync(process.execPath, ['--check', runtimePath], { cwd: root, encoding: 'utf8' })
if (syntax.status !== 0) {
  process.stderr.write(syntax.stderr || syntax.stdout || '')
  throw new Error(`v8 runtime syntax check failed with ${syntax.status}`)
}

console.log(JSON.stringify({
  ok: true,
  prepared: path.relative(root, runtimePath),
  authority_id: authority.authority_id,
  execution_baseline_id: baseline.baseline_id,
  original_verifier_sha256: originalSha,
  corrected_from_v7_run_id: 32631652830,
  reviewed_hei_main: expectedMains['historical-exchange-index'],
  reviewed_sog_main: expectedMains['stable-or-gone'],
  reviewed_cya_main: expectedMains['crypto-yield-archive'],
  reviewed_wlr_main: expectedMains['cryptocurrency-wallet-lifecycle-registry'],
  native_sog_checker: true,
  sog_github_sha_isolated: true,
  ai_workspace_local_generation: true,
  prepare_only: prepareOnly,
}, null, 2))

if (!prepareOnly) {
  const run = spawnSync(process.execPath, [runtimePath], {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
    timeout: 22 * 60 * 1000,
  })
  if (run.error) throw run.error
  if (run.status !== 0) process.exit(run.status ?? 1)
}
