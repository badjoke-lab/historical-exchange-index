import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const prepareOnly = process.argv.includes('--prepare-only')
const authorityPath = path.join(root, 'config', 'ledger-series-phase9-stage6-v8-authority-semantic-sog-native-2026-08-23.json')
const baselinePath = path.join(root, 'config', 'ledger-series-phase9-stage6-v8-execution-baseline.json')
const v6WrapperPath = path.join(root, 'scripts', 'verify-ledger-series-phase9-stage6-current-production-v6.mjs')
const v6RuntimePath = path.join(root, '.stage6', 'phase9-stage6-v6-runtime-verifier.mjs')
const v8RuntimePath = path.join(root, '.stage6', 'phase9-stage6-v8-runtime-verifier.mjs')

function assert(condition, message) { if (!condition) throw new Error(message) }
function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')) }
function replaceOnce(source, needle, replacement, label) {
  const first = source.indexOf(needle)
  assert(first >= 0, `${label}: marker not found`)
  assert(source.indexOf(needle, first + needle.length) < 0, `${label}: marker is not unique`)
  return `${source.slice(0, first)}${replacement}${source.slice(first + needle.length)}`
}
function replaceRegexOnce(source, regex, replacement, label) {
  const flags = regex.flags.includes('g') ? regex.flags : `${regex.flags}g`
  const matches = [...source.matchAll(new RegExp(regex.source, flags))]
  assert(matches.length === 1, `${label}: expected exactly one match, observed ${matches.length}`)
  return source.replace(regex, replacement)
}
function replaceBlock(source, startMarker, endMarker, replacement, label) {
  const start = source.indexOf(startMarker)
  const end = source.indexOf(endMarker, start)
  assert(start >= 0 && end > start, `${label}: block markers missing`)
  return `${source.slice(0, start)}${replacement}${source.slice(end)}`
}

const authority = readJson(authorityPath)
const baseline = readJson(baselinePath)
const forbidden = new Set(authority.not_authorized || [])
const v8AuthorityId = 'hei-ledger-series-phase9-stage6-authority-semantic-sog-native-correction-2026-08-23-v8'
const v8AuthorityFile = 'ledger-series-phase9-stage6-v8-authority-semantic-sog-native-2026-08-23.json'
const oldV5AuthorityFile = 'ledger-series-phase9-stage6-v5-sog-checker-correction-authority-2026-08-23.json'

assert(authority.authority_id === v8AuthorityId, 'unexpected v8 authority id')
assert(authority.failed_v7_execution?.workflow_run === 32631652830 && authority.failed_v7_execution?.job === 97175265879, 'v8 authority consumed-v7 run/job binding changed')
assert(authority.failed_v7_execution?.implementation_merge === 'ca13950e1b43cc6842e70d1a2038a7ff1c7af5f0', 'v8 authority consumed-v7 merge binding changed')
assert(authority.failed_v7_execution?.artifact_available === false && authority.failed_v7_execution?.consumed === true && authority.failed_v7_execution?.rerun_authorized === false, 'v8 authority v7 consumption boundary changed')
assert(authority.failure_review?.defect_class === 'verifier_authority_semantic_compatibility_defect' && authority.failed_v7_execution?.production_equality_assertions_started === false && authority.failed_v7_execution?.production_drift_observed === false, 'v8 must remain a verifier-only correction')
assert(Array.isArray(authority.authorized_next_changes) && authority.authorized_next_changes.some((x) => x.includes('execute exactly one new read-only eight-registry equality run')), 'v8 finite network execution not authorized')
for (const required of [
  'rerun of workflow run 32631652830', 'production mutation', 'any vertical repository mutation', 'AI repository mutation',
  'SOG repository mutation', 'canonical record mutation', 'relationship mutation', 'central descriptor resynchronization',
  'Cloudflare or DNS change', 'deployment mutation', 'silent latest-main acceptance', 'automatic baseline refresh',
  'automatic repair', 'automatic retry or more than one new network execution', 'Stage 7 continuation', 'Stage 8 continuation', 'Phase 10 continuation',
]) assert(forbidden.has(required), `v8 forbidden boundary missing: ${required}`)
assert(authority.stage6_current_production_acceptance === 'NOT_ACCEPTED' && authority.automatic_continuation === false, 'v8 authority must not pre-accept Stage 6')

assert(baseline.authority_id === v8AuthorityId && baseline.authority_merge === 'ade94505a7af45223a98340cf7b0c3a2bf1b5fed', 'v8 baseline authority binding changed')
assert(baseline.corrected_from_v7_execution?.workflow_run === 32631652830 && baseline.corrected_from_v7_execution?.artifact_available === false && baseline.corrected_from_v7_execution?.consumed === true && baseline.corrected_from_v7_execution?.rerun_authorized === false, 'v8 baseline v7 consumption boundary changed')
assert(baseline.execution_count_authorized === 1 && baseline.automatic_baseline_refresh_authorized === false, 'v8 finite execution boundary changed')
assert(baseline.production_mutation_authorized === false && baseline.vertical_repository_mutation_authorized === false && baseline.ai_repository_mutation_authorized === false && baseline.sog_repository_mutation_authorized === false && baseline.canonical_record_mutation_authorized === false && baseline.relationship_mutation_authorized === false && baseline.central_descriptor_resync_authorized === false && baseline.cloudflare_dns_deployment_mutation_authorized === false, 'v8 mutation boundary weakened')
assert(Array.isArray(baseline.registries) && baseline.registries.length === 8, 'v8 baseline must cover eight registries')
assert(baseline.stage5_relationship_counts?.total === 244 && baseline.stage5_relationship_counts?.cross_registry === 0, 'Stage 5 relationship boundary changed')

const baselineById = new Map(baseline.registries.map((item) => [item.registry_id, item]))
const expectedMains = {
  'historical-exchange-index': 'ade94505a7af45223a98340cf7b0c3a2bf1b5fed',
  'minted-and-gone': 'f917d5e25eedc7b2c48091c7343b7fa9cd203428',
  'stable-or-gone': 'd26d50eba858b3528fdd5713814068ab55956913',
  'crypto-yield-archive': 'c1291cc891350a8105ffeb53f61522e3c822b7c5',
  'bridge-incident-registry': '0e1769e75a9647be4ead61fafefde2bd6dc49e60',
  'cryptocurrency-wallet-lifecycle-registry': 'f6b542a0f724d4243a77c08b5b1febdb8585a148',
  'ai-tools-history-archive': '76ef103329813f0174db121117c932bff53fbf8e',
  'api-deprecation-archive': '641a6d4243d30f95f48436455d2cbc12a8aded53',
}
for (const [id, exact] of Object.entries(expectedMains)) {
  const item = baselineById.get(id)
  const reviewed = item?.reviewed_main ?? item?.reviewed_main_before_implementation
  assert(item && reviewed === exact, `${id}: reviewed v8 main changed`)
}
assert(baselineById.get('crypto-yield-archive').expected_primary_records === 124, 'v8 CYA canonical 124 boundary changed')
assert(JSON.stringify(baselineById.get('bridge-incident-registry').expected_native_counts) === JSON.stringify({ bridges: 42, incidents: 45, events: 210, evidence: 347 }), 'v8 BIR reviewed boundary changed')
assert(baselineById.get('cryptocurrency-wallet-lifecycle-registry').expected_stage5_relationships === 161, 'v8 WLR Stage 5 relationship boundary changed')
assert(baselineById.get('stable-or-gone').native_checker === 'scripts/verify-stage5-production.mjs' && baselineById.get('stable-or-gone').reviewed_main === 'd26d50eba858b3528fdd5713814068ab55956913', 'v8 SOG native checker boundary changed')
const ai = baselineById.get('ai-tools-history-archive')
assert(ai.local_generation?.native_generator === 'scripts/generate-machine-records.mjs' && ai.local_generation?.series_generator === 'scripts/generate-series-adapter.mjs' && ai.local_generation?.checker === 'scripts/check-series-origin.mjs', 'v8 AI generation contract changed')
assert(ai.local_generation?.build_identity_env?.CF_PAGES_COMMIT_SHA === expectedMains['ai-tools-history-archive'] && ai.local_generation?.workspace_only === true && ai.local_generation?.network_io === false && ai.local_generation?.checker_source_mutation_authorized === false, 'v8 AI generation safety boundary changed')

const prepareV6 = spawnSync(process.execPath, [v6WrapperPath, '--prepare-only'], {
  cwd: root, env: process.env, encoding: 'utf8', timeout: 120000, maxBuffer: 16 * 1024 * 1024,
})
if (prepareV6.error) throw prepareV6.error
if (prepareV6.status !== 0) {
  process.stderr.write(prepareV6.stderr || prepareV6.stdout || '')
  throw new Error(`v6 offline runtime generation failed with ${prepareV6.status}`)
}
assert(fs.existsSync(v6RuntimePath), 'v6 generated runtime missing after offline prepare')
let source = fs.readFileSync(v6RuntimePath, 'utf8')

assert(source.includes('ai_v6_local_generation') && source.includes('scripts/generate-machine-records.mjs') && source.includes('scripts/generate-series-adapter.mjs'), 'v8 source lost AI local-generation semantics')
assert(source.includes('prepareSogV5TransientChecker') && source.includes("checker('SOG Stage 5 relationships v5 transient'"), 'v8 source no longer has expected inherited SOG transient path to remove')
assert(source.includes('central_descriptor') && source.includes('stage5_relationships'), 'v8 source lost Stage 6 closeout assertions')

const authorityLoadPattern = /JSON\.parse\(fs\.readFileSync\(path\.join\(root, 'config', '([^']+)'\), 'utf8'\)\)/g
const beforeAuthorityLoads = [...source.matchAll(authorityLoadPattern)]
assert(beforeAuthorityLoads.length === 1 && beforeAuthorityLoads[0][1] === oldV5AuthorityFile, `v8 expected inherited v5 authority load, observed ${beforeAuthorityLoads.map((m) => m[1]).join(',')}`)
assert(source.split(oldV5AuthorityFile).length - 1 === 1, 'v8 inherited v5 authority filename must occur exactly once')
source = source.replace(oldV5AuthorityFile, v8AuthorityFile)

source = replaceOnce(
  source,
  "assert(authority.authority_id === 'hei-ledger-series-phase9-stage6-ai-generation-precondition-correction-2026-08-23-v6', 'unexpected Stage 6 v6 authority')",
  `assert(authority.authority_id === '${v8AuthorityId}', 'unexpected Stage 6 v8 authority')`,
  'v8 runtime authority id',
)
source = replaceOnce(
  source,
  "assert(Array.isArray(authority.authorized_next_changes) && authority.authorized_next_changes.some((x) => x.includes('execute exactly one new read-only eight-registry equality run')), 'Stage 6 v6 network execution is not authorized')",
  "assert(Array.isArray(authority.authorized_next_changes) && authority.authorized_next_changes.some((x) => x.includes('execute exactly one new read-only eight-registry equality run')), 'Stage 6 v8 network execution is not authorized')",
  'v8 runtime network authority',
)
source = replaceOnce(
  source,
  "assert((authority.not_authorized || []).includes('production mutation') && (authority.not_authorized || []).includes('any vertical repository mutation') && (authority.not_authorized || []).includes('AI repository mutation') && (authority.not_authorized || []).includes('canonical record or relationship mutation') && (authority.not_authorized || []).includes('central descriptor resynchronization'), 'Stage 6 v6 mutation boundary weakened')",
  "assert((authority.not_authorized || []).includes('production mutation') && (authority.not_authorized || []).includes('any vertical repository mutation') && (authority.not_authorized || []).includes('AI repository mutation') && (authority.not_authorized || []).includes('SOG repository mutation') && (authority.not_authorized || []).includes('canonical record mutation') && (authority.not_authorized || []).includes('relationship mutation') && (authority.not_authorized || []).includes('central descriptor resynchronization'), 'Stage 6 v8 mutation boundary weakened')",
  'v8 runtime mutation authority',
)
source = replaceOnce(
  source,
  "assert(authority.failed_v5_execution?.workflow_run === 32623941701 && authority.failed_v5_execution?.consumed === true && authority.failed_v5_execution?.rerun_authorized === false, 'Stage 6 v6 authority is not bound to consumed v5 execution')",
  "assert(authority.failed_v7_execution?.workflow_run === 32631652830 && authority.failed_v7_execution?.job === 97175265879 && authority.failed_v7_execution?.implementation_merge === 'ca13950e1b43cc6842e70d1a2038a7ff1c7af5f0' && authority.failed_v7_execution?.artifact_available === false && authority.failed_v7_execution?.consumed === true && authority.failed_v7_execution?.rerun_authorized === false, 'Stage 6 v8 authority is not bound to consumed v7 execution')",
  'v8 runtime consumed-v7 binding',
)

const runtimeRows = baseline.registries.map((item) => {
  const reviewed = item.reviewed_main ?? item.reviewed_main_before_implementation
  return [item.registry_id, { repository: item.repository, origin: item.origin, main: reviewed, reviewed_main: reviewed }]
})
source = replaceRegexOnce(source, /const byId = new Map\(\[.*\]\)/, `const byId = new Map(${JSON.stringify(runtimeRows)})`, 'v8 runtime reviewed repository map')
source = replaceOnce(source, "assert(frozen.main === '932dea2acfee90a34d7c17390402b8b835bec621', 'HEI v5 authority-creation main changed')", "assert(frozen.main === 'ade94505a7af45223a98340cf7b0c3a2bf1b5fed', 'HEI v8 reviewed authority main changed')", 'v8 HEI runtime authority row')

const reviewBlock = `const REVIEW = {
  'historical-exchange-index': {
    repository: 'badjoke-lab/historical-exchange-index', repo_main: 'ade94505a7af45223a98340cf7b0c3a2bf1b5fed', production_revision: null, origin: 'https://hei.badjoke-lab.com', local: root,
    allowed_build_commits: ['23636622b1a1f6e5514c3bba36583149868b6af2','ade94505a7af45223a98340cf7b0c3a2bf1b5fed'],
  },
  'minted-and-gone': {
    repository: 'badjoke-lab/mintedandgone', repo_main: 'f917d5e25eedc7b2c48091c7343b7fa9cd203428', production_revision: 'f917d5e25eedc7b2c48091c7343b7fa9cd203428', origin: 'https://mag.badjoke-lab.com', local: path.join(repoRoot, 'mag'),
  },
  'stable-or-gone': {
    repository: 'badjoke-lab/stable-or-gone', repo_main: 'd26d50eba858b3528fdd5713814068ab55956913', production_revision: 'd26d50eba858b3528fdd5713814068ab55956913', origin: 'https://www.stableorgone.com', local: path.join(repoRoot, 'sog'),
    expected_current_canonical_hash: 'sha256:bba93c1e3f0ea1b050cd395455327b70fb7c1920d37b18c300949bb49df53965', historical_stage5_authority_hash: 'sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798',
  },
  'crypto-yield-archive': {
    repository: 'badjoke-lab/crypto-yield-archive', repo_main: 'c1291cc891350a8105ffeb53f61522e3c822b7c5', production_revision: null, origin: 'https://cya.badjoke-lab.com', local: path.join(repoRoot, 'cya'),
    allowed_source_commits: ['34c543ae2dec344e334d308344d1413beb6fe20b','c1291cc891350a8105ffeb53f61522e3c822b7c5'], expected_primary_records: 124,
  },
  'bridge-incident-registry': {
    repository: 'badjoke-lab/bridge-incident-registry', repo_main: '0e1769e75a9647be4ead61fafefde2bd6dc49e60', production_revision: null, origin: 'https://bir.badjoke-lab.com', local: path.join(repoRoot, 'bir'),
  },
  'cryptocurrency-wallet-lifecycle-registry': {
    repository: 'badjoke-lab/cryptocurrency-wallet-lifecycle-registry', repo_main: 'f6b542a0f724d4243a77c08b5b1febdb8585a148', production_revision: null, origin: 'https://wlr.badjoke-lab.com', local: path.join(repoRoot, 'wlr'),
  },
  'ai-tools-history-archive': {
    repository: 'badjoke-lab/ai-tools-history-archive', repo_main: '76ef103329813f0174db121117c932bff53fbf8e', production_revision: '76ef103329813f0174db121117c932bff53fbf8e', origin: 'https://ai-tools-history-archive.pages.dev', local: path.join(repoRoot, 'ai'),
  },
  'api-deprecation-archive': {
    repository: 'badjoke-lab/api-deprecation-archive', repo_main: '641a6d4243d30f95f48436455d2cbc12a8aded53', production_revision: null, origin: 'https://api-deprecation-archive.pages.dev', local: path.join(repoRoot, 'api'),
  },
}`
source = replaceBlock(source, 'const REVIEW = {', '\n\nconst expectedRelationships =', reviewBlock, 'v8 REVIEW')

source = replaceOnce(source, "  const sogV5Script = prepareSogV5TransientChecker()\n", '', 'disable inherited SOG transient preparation')
source = replaceOnce(
  source,
  "checker('SOG Stage 5 relationships v5 transient', 'stable-or-gone', sogV5Script, [], {",
  "checker('SOG Stage 5 relationships', 'stable-or-gone', 'scripts/verify-stage5-production.mjs', [], {",
  'restore corrected SOG native checker',
)

source = replaceOnce(source, "schema_version: '1.6.0'", "schema_version: '1.8.0'", 'v8 report schema')
source = replaceOnce(source, "execution_kind: 'read_only_cross_registry_current_production_ai_generation_precondition_v6'", "execution_kind: 'read_only_cross_registry_current_production_semantic_sog_native_correction_v8'", 'v8 execution kind')
source = replaceOnce(
  source,
  "execution_baseline_id: 'hei-ledger-series-phase9-stage6-v6-execution-baseline-2026-08-23',\n  corrected_from_v5_run_id: 32623941701,\n  corrected_from_v5_artifact_id: 9489174795,",
  "execution_baseline_id: 'hei-ledger-series-phase9-stage6-v8-execution-baseline-2026-08-23',\n  corrected_from_v7_run_id: 32631652830,\n  corrected_from_v7_job_id: 97175265879,\n  corrected_from_v7_artifact_available: false,",
  'v8 report provenance',
)

const authorityExpectedMains = {
  ...expectedMains,
  'historical-exchange-index': '23636622b1a1f6e5514c3bba36583149868b6af2',
}
const authorityRows = Object.entries(authorityExpectedMains).map(([registry_id, main]) => ({ registry_id, main }))
const authorityGuard = `const v8AuthorityRows = ${JSON.stringify(authorityRows)}
const v8AuthorityMains = new Map((authority.reviewed_repository_mains_at_authority_creation || []).map((item) => [item.registry_id, item.main]))
assert(v8AuthorityMains.size === 8, 'Stage 6 v8 authority must cover eight registry mains')
for (const row of v8AuthorityRows) assert(v8AuthorityMains.get(row.registry_id) === row.main, row.registry_id + ': Stage 6 v8 authority reviewed main changed')
`
source = replaceOnce(source, 'const report = {', `${authorityGuard}\nconst report = {`, 'v8 authority reviewed-main guard')

source = replaceOnce(
  source,
  "try {\n  writeReport()\n  await preflight()",
  "try {\n  writeReport()\n  if (process.env.STAGE6_V8_AUTHORITY_ONLY === '1') {\n    report.authority_only = { status: 'PASS', network_io: false }\n    writeReport()\n    console.log('Stage 6 v8 authority-only runtime assertions passed without network I/O')\n    process.exit(0)\n  }\n  await preflight()",
  'v8 offline authority-only gate',
)

const afterAuthorityLoads = [...source.matchAll(authorityLoadPattern)]
assert(afterAuthorityLoads.length === 1 && afterAuthorityLoads[0][1] === v8AuthorityFile, `v8 runtime authority load points to ${afterAuthorityLoads.map((m) => m[1]).join(',')}`)
assert(!source.includes("canonical record or relationship mutation') &&") && source.includes("includes('canonical record mutation')") && source.includes("includes('relationship mutation')"), 'v8 runtime mutation-boundary semantic correction incomplete')
assert(source.includes("checker('SOG Stage 5 relationships', 'stable-or-gone', 'scripts/verify-stage5-production.mjs'") && !source.includes('const sogV5Script = prepareSogV5TransientChecker()'), 'v8 runtime did not restore corrected SOG native checker')
assert(source.includes('ai_v6_local_generation') && source.includes('CF_PAGES_COMMIT_SHA'), 'v8 runtime lost AI local generation')
for (const exact of Object.values(expectedMains)) assert(source.includes(exact), `v8 runtime missing reviewed main ${exact}`)

fs.mkdirSync(path.dirname(v8RuntimePath), { recursive: true })
fs.writeFileSync(v8RuntimePath, source)
const syntax = spawnSync(process.execPath, ['--check', v8RuntimePath], { cwd: root, encoding: 'utf8' })
if (syntax.status !== 0) {
  process.stderr.write(syntax.stderr || syntax.stdout || '')
  throw new Error(`v8 runtime syntax check failed with ${syntax.status}`)
}

const authoritySmokePath = path.join(root, '.stage6', 'phase9-stage6-v8-authority-only-result.json')
const authoritySmoke = spawnSync(process.execPath, [v8RuntimePath], {
  cwd: root,
  env: { ...process.env, STAGE6_V8_AUTHORITY_ONLY: '1', STAGE6_RESULT_PATH: authoritySmokePath },
  encoding: 'utf8', timeout: 120000, maxBuffer: 16 * 1024 * 1024,
})
if (authoritySmoke.error) throw authoritySmoke.error
if (authoritySmoke.status !== 0) {
  process.stderr.write(authoritySmoke.stderr || authoritySmoke.stdout || '')
  throw new Error(`v8 authority-only runtime smoke failed with ${authoritySmoke.status}`)
}
const smoke = readJson(authoritySmokePath)
assert(smoke.authority_only?.status === 'PASS' && smoke.authority_only?.network_io === false, 'v8 authority-only runtime smoke did not prove no-network PASS')

console.log(JSON.stringify({
  ok: true,
  prepared: path.relative(root, v8RuntimePath),
  authority_file: afterAuthorityLoads[0][1],
  authority_id: authority.authority_id,
  execution_baseline_id: baseline.baseline_id,
  corrected_from_v7_run_id: 32631652830,
  corrected_mutation_boundary_semantics: true,
  restored_sog_native_checker: true,
  preserved_ai_v6_local_generation: true,
  authority_only_runtime_smoke: 'PASS',
  prepare_only: prepareOnly,
}, null, 2))

if (!prepareOnly) {
  const run = spawnSync(process.execPath, [v8RuntimePath], { cwd: root, env: process.env, stdio: 'inherit', timeout: 22 * 60 * 1000 })
  if (run.error) throw run.error
  if (run.status !== 0) process.exit(run.status ?? 1)
}
