import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const prepareOnly = process.argv.includes('--prepare-only')
const authorityPath = path.join(root, 'config', 'ledger-series-phase9-stage6-v7-runtime-authority-path-correction-authority-2026-08-23.json')
const baselinePath = path.join(root, 'config', 'ledger-series-phase9-stage6-v7-execution-baseline.json')
const v6WrapperPath = path.join(root, 'scripts', 'verify-ledger-series-phase9-stage6-current-production-v6.mjs')
const v6RuntimePath = path.join(root, '.stage6', 'phase9-stage6-v6-runtime-verifier.mjs')
const v7RuntimePath = path.join(root, '.stage6', 'phase9-stage6-v7-runtime-verifier.mjs')

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

const authority = readJson(authorityPath)
const baseline = readJson(baselinePath)
const forbidden = new Set(authority.not_authorized || [])
const v7AuthorityId = 'hei-ledger-series-phase9-stage6-runtime-authority-path-correction-2026-08-23-v7'
const v7AuthorityFile = 'ledger-series-phase9-stage6-v7-runtime-authority-path-correction-authority-2026-08-23.json'
const oldV5AuthorityFile = 'ledger-series-phase9-stage6-v5-sog-checker-correction-authority-2026-08-23.json'
const oldV6AuthorityFile = 'ledger-series-phase9-stage6-ai-generation-precondition-authority-2026-08-23.json'

assert(authority.authority_id === v7AuthorityId, 'unexpected v7 authority id')
assert(authority.failed_v6_execution?.workflow_run === 32629752295 && authority.failed_v6_execution?.job === 97170593916, 'v7 authority consumed-v6 run/job binding changed')
assert(authority.failed_v6_execution?.implementation_merge === '10198d4dc12ea16a598ae50d33489bbe187bd6ff', 'v7 authority consumed-v6 merge binding changed')
assert(authority.failed_v6_execution?.artifact_available === false && authority.failed_v6_execution?.consumed === true && authority.failed_v6_execution?.rerun_authorized === false, 'v7 authority v6 consumption boundary changed')
assert(authority.failure_review?.defect_class === 'verifier_implementation_defect' && authority.failure_review?.production_equality_assertions_started === false && authority.failure_review?.production_drift_observed === false, 'v7 must remain a verifier-only defect correction')
assert(Array.isArray(authority.authorized_next_changes) && authority.authorized_next_changes.some((x) => x.includes('v7 authority JSON')), 'v7 authority-file correction not authorized')
assert(authority.authorized_next_changes.some((x) => x.includes('execute exactly one new read-only eight-registry equality run')), 'v7 finite network execution not authorized')
for (const required of [
  'rerun of workflow run 32629752295', 'production mutation', 'any vertical repository mutation', 'AI repository mutation',
  'SOG repository mutation', 'canonical record mutation', 'relationship mutation', 'central descriptor resynchronization',
  'Cloudflare or DNS change', 'deployment mutation', 'silent latest-main acceptance', 'automatic baseline refresh',
  'automatic repair', 'automatic retry or more than one new network execution', 'Stage 7 continuation', 'Stage 8 continuation', 'Phase 10 continuation',
]) assert(forbidden.has(required), `v7 forbidden boundary missing: ${required}`)
assert(authority.stage6_current_production_acceptance === 'NOT_ACCEPTED' && authority.automatic_continuation === false, 'v7 authority must not pre-accept Stage 6')

assert(baseline.authority_id === v7AuthorityId && baseline.authority_merge === 'fcc854f952a23e020327e2138a219eb621fb44c2', 'v7 baseline authority binding changed')
assert(baseline.corrected_from_v6_execution?.workflow_run === 32629752295 && baseline.corrected_from_v6_execution?.artifact_available === false && baseline.corrected_from_v6_execution?.consumed === true && baseline.corrected_from_v6_execution?.rerun_authorized === false, 'v7 baseline v6 consumption boundary changed')
assert(baseline.execution_count_authorized === 1 && baseline.automatic_baseline_refresh_authorized === false, 'v7 finite execution boundary changed')
assert(baseline.production_mutation_authorized === false && baseline.vertical_repository_mutation_authorized === false && baseline.ai_repository_mutation_authorized === false && baseline.canonical_record_or_relationship_mutation_authorized === false && baseline.central_descriptor_resync_authorized === false && baseline.cloudflare_dns_deployment_mutation_authorized === false, 'v7 mutation boundary weakened')
assert(Array.isArray(baseline.registries) && baseline.registries.length === 8, 'v7 baseline must cover eight registries')
assert(baseline.stage5_relationship_counts?.total === 244 && baseline.stage5_relationship_counts?.cross_registry === 0, 'Stage 5 relationship boundary changed')

const byId = new Map(baseline.registries.map((item) => [item.registry_id, item]))
const expectedMains = {
  'historical-exchange-index': 'ceaad483b8ffc148ed2642a24d6f54b50aaff8de',
  'minted-and-gone': 'f917d5e25eedc7b2c48091c7343b7fa9cd203428',
  'stable-or-gone': 'e8663a8289033a3a6af7cb19fb31683b2545e61c',
  'crypto-yield-archive': 'e0079af51859cb1d006e686fceb29a25b7343ece',
  'bridge-incident-registry': '99405bc7d4e1b3d2aea62314a607dc00656e823b',
  'cryptocurrency-wallet-lifecycle-registry': '8192dedeb3777894f031dcbd13d95367f5f688de',
  'ai-tools-history-archive': '76ef103329813f0174db121117c932bff53fbf8e',
  'api-deprecation-archive': '641a6d4243d30f95f48436455d2cbc12a8aded53',
}
for (const [id, exact] of Object.entries(expectedMains)) {
  const item = byId.get(id)
  assert(item && (item.reviewed_main ?? item.reviewed_main_before_implementation) === exact, `${id}: reviewed v7 main changed`)
}
const expectedHeiAllowedBuilds = [
  '932dea2acfee90a34d7c17390402b8b835bec621',
  '93352c7a3d63bdbdfaa74ba6bd4e631356e0f395',
  'fa56be7993d4caa7b1ce8f058d124b331322d319',
  '10198d4dc12ea16a598ae50d33489bbe187bd6ff',
  'fcc854f952a23e020327e2138a219eb621fb44c2',
  'ceaad483b8ffc148ed2642a24d6f54b50aaff8de',
]
assert(JSON.stringify(byId.get('historical-exchange-index').allowed_preimplementation_build_commits) === JSON.stringify(expectedHeiAllowedBuilds), 'v7 HEI build allowlist changed')
assert(byId.get('stable-or-gone').expected_current_canonical_hash === 'sha256:bba93c1e3f0ea1b050cd395455327b70fb7c1920d37b18c300949bb49df53965' && byId.get('stable-or-gone').expected_relationships === 1, 'v7 SOG correction boundary changed')
assert(byId.get('crypto-yield-archive').expected_primary_records === 123, 'v7 CYA canonical 123 boundary changed')
assert(JSON.stringify(byId.get('bridge-incident-registry').expected_native_counts) === JSON.stringify({ bridges: 42, incidents: 45, events: 210, evidence: 347 }), 'v7 BIR reviewed boundary changed')
const ai = byId.get('ai-tools-history-archive')
assert(ai.local_generation?.native_generator === 'scripts/generate-machine-records.mjs' && ai.local_generation?.series_generator === 'scripts/generate-series-adapter.mjs' && ai.local_generation?.checker === 'scripts/check-series-origin.mjs', 'v7 AI generation contract changed')
assert(ai.local_generation?.build_identity_env?.CF_PAGES_COMMIT_SHA === expectedMains['ai-tools-history-archive'] && ai.local_generation?.workspace_only === true && ai.local_generation?.network_io === false && ai.local_generation?.checker_source_mutation_authorized === false, 'v7 AI generation safety boundary changed')

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

assert(source.includes('prepareSogV5TransientChecker') && source.includes('sog_v5_transient_checker'), 'v7 source lost v5 SOG transient correction')
assert(source.includes('ai_v6_local_generation') && source.includes('scripts/generate-machine-records.mjs') && source.includes('scripts/generate-series-adapter.mjs') && source.includes("checker('AI Tools exact Series reviewed build'"), 'v7 source lost v6 AI local-generation/checker semantics')
assert(source.includes('central_descriptor') && source.includes('stage5_relationships'), 'v7 source lost Stage 6 closeout assertions')

const authorityLoadPattern = /JSON\.parse\(fs\.readFileSync\(path\.join\(root, 'config', '([^']+)'\), 'utf8'\)\)/g
const beforeAuthorityLoads = [...source.matchAll(authorityLoadPattern)]
assert(beforeAuthorityLoads.length === 1, `v7 pre-correction runtime must have one direct authority load, observed ${beforeAuthorityLoads.length}`)
assert(beforeAuthorityLoads[0][1] === oldV5AuthorityFile, `v7 expected inherited v5 authority file, observed ${beforeAuthorityLoads[0][1]}`)
assert(source.split(oldV5AuthorityFile).length - 1 === 1, 'v7 inherited v5 authority filename must occur exactly once')
source = source.replace(oldV5AuthorityFile, v7AuthorityFile)
source = replaceOnce(
  source,
  "assert(authority.authority_id === 'hei-ledger-series-phase9-stage6-ai-generation-precondition-correction-2026-08-23-v6', 'unexpected Stage 6 v6 authority')",
  `assert(authority.authority_id === '${v7AuthorityId}', 'unexpected Stage 6 v7 authority')`,
  'v7 runtime authority id',
)
source = replaceOnce(
  source,
  "assert(authority.failed_v5_execution?.workflow_run === 32623941701 && authority.failed_v5_execution?.consumed === true && authority.failed_v5_execution?.rerun_authorized === false, 'Stage 6 v6 authority is not bound to consumed v5 execution')",
  "assert(authority.failed_v6_execution?.workflow_run === 32629752295 && authority.failed_v6_execution?.job === 97170593916 && authority.failed_v6_execution?.implementation_merge === '10198d4dc12ea16a598ae50d33489bbe187bd6ff' && authority.failed_v6_execution?.artifact_available === false && authority.failed_v6_execution?.consumed === true && authority.failed_v6_execution?.rerun_authorized === false, 'Stage 6 v7 authority is not bound to consumed v6 execution')",
  'v7 runtime consumed-v6 binding',
)
source = replaceRegexOnce(source, /allowed_build_commits:\s*\[[^\]]*\]/, `allowed_build_commits: ${JSON.stringify(expectedHeiAllowedBuilds)}`, 'v7 HEI build allowlist')
source = replaceOnce(source, "schema_version: '1.6.0'", "schema_version: '1.7.0'", 'v7 report schema')
source = replaceOnce(source, "execution_kind: 'read_only_cross_registry_current_production_ai_generation_precondition_v6'", "execution_kind: 'read_only_cross_registry_current_production_runtime_authority_path_correction_v7'", 'v7 execution kind')
source = replaceOnce(
  source,
  "execution_baseline_id: 'hei-ledger-series-phase9-stage6-v6-execution-baseline-2026-08-23',\n  corrected_from_v5_run_id: 32623941701,\n  corrected_from_v5_artifact_id: 9489174795,",
  "execution_baseline_id: 'hei-ledger-series-phase9-stage6-v7-execution-baseline-2026-08-23',\n  corrected_from_v6_run_id: 32629752295,\n  corrected_from_v6_job_id: 97170593916,\n  corrected_from_v6_artifact_available: false,",
  'v7 report provenance',
)

const afterAuthorityLoads = [...source.matchAll(authorityLoadPattern)]
assert(afterAuthorityLoads.length === 1, `v7 runtime must have one direct authority load, observed ${afterAuthorityLoads.length}`)
assert(afterAuthorityLoads[0][1] === v7AuthorityFile, `v7 runtime authority load points to ${afterAuthorityLoads[0][1]}`)
assert(!source.includes(oldV5AuthorityFile) && !source.includes(oldV6AuthorityFile), 'v7 runtime retained obsolete authority file reference')
assert(source.includes(`authority.authority_id === '${v7AuthorityId}'`) && !source.includes("authority.authority_id === 'hei-ledger-series-phase9-stage6-ai-generation-precondition-correction-2026-08-23-v6'"), 'v7 runtime authority-id correction incomplete')
assert(source.includes('authority.failed_v6_execution?.workflow_run === 32629752295') && !source.includes('authority.failed_v5_execution?.workflow_run === 32623941701'), 'v7 runtime consumed-v6 correction incomplete')
assert(source.includes(`allowed_build_commits: ${JSON.stringify(expectedHeiAllowedBuilds)}`), 'v7 runtime HEI build allowlist correction missing')

fs.mkdirSync(path.dirname(v7RuntimePath), { recursive: true })
fs.writeFileSync(v7RuntimePath, source)
const syntax = spawnSync(process.execPath, ['--check', v7RuntimePath], { cwd: root, encoding: 'utf8' })
if (syntax.status !== 0) {
  process.stderr.write(syntax.stderr || syntax.stdout || '')
  throw new Error(`v7 runtime syntax check failed with ${syntax.status}`)
}
const runtimeAuthority = readJson(authorityPath)
assert(runtimeAuthority.authority_id === v7AuthorityId, 'v7 parsed runtime authority id mismatch before network execution')

console.log(JSON.stringify({
  ok: true,
  prepared: path.relative(root, v7RuntimePath),
  authority_file: afterAuthorityLoads[0][1],
  authority_id: runtimeAuthority.authority_id,
  execution_baseline_id: baseline.baseline_id,
  corrected_from_v6_run_id: 32629752295,
  preserved_sog_v5_transient_checker: true,
  preserved_ai_v6_local_generation: true,
  prepare_only: prepareOnly,
}, null, 2))

if (!prepareOnly) {
  const run = spawnSync(process.execPath, [v7RuntimePath], { cwd: root, env: process.env, stdio: 'inherit', timeout: 22 * 60 * 1000 })
  if (run.error) throw run.error
  if (run.status !== 0) process.exit(run.status ?? 1)
}
