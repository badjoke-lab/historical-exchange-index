import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'

const root = process.cwd()
const prepareOnly = process.argv.includes('--prepare-only')
const authorityPath = path.join(root, 'config', 'ledger-series-phase9-stage6-mag-checker-correction-authority-2026-08-23.json')
const baselinePath = path.join(root, 'config', 'ledger-series-phase9-stage6-v4-execution-baseline.json')
const legacyPath = path.join(root, 'scripts', 'verify-ledger-series-phase9-stage6-production-equality.mjs')
const runtimePath = path.join(root, '.stage6', 'phase9-stage6-v4-runtime-verifier.mjs')

function assert(condition, message) { if (!condition) throw new Error(message) }
function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')) }
function js(value) { return JSON.stringify(value) }
function replaceOnce(source, needle, replacement, label) {
  const first = source.indexOf(needle)
  assert(first >= 0, `${label}: marker not found`)
  assert(source.indexOf(needle, first + needle.length) < 0, `${label}: marker is not unique`)
  return `${source.slice(0, first)}${replacement}${source.slice(first + needle.length)}`
}

const authority = readJson(authorityPath)
const baseline = readJson(baselinePath)
const forbidden = new Set(authority.not_authorized || [])

assert(authority.authority_id === 'hei-ledger-series-phase9-stage6-mag-checker-correction-2026-08-23-v4', 'unexpected v4 authority id')
assert(authority.failed_v3_execution?.workflow_run === 32614056946, 'v4 authority must bind to the consumed v3 failure')
assert(authority.failed_v3_execution?.observed_live_mag_build_commit === 'f917d5e25eedc7b2c48091c7343b7fa9cd203428', 'unexpected reviewed MAG current build')
assert(authority.failed_v3_execution?.incorrect_historical_expected_commit_used_by_checker === '73dafdf78a2ca60e9329a4c6844315cafb8e55c0', 'unexpected historical MAG mismatch')
assert(Array.isArray(authority.authorized_next_changes) && authority.authorized_next_changes.some((x) => x.includes('execute exactly one new read-only eight-registry')), 'v4 one-shot not authorized')
for (const required of [
  'production mutation',
  'any vertical repository mutation',
  'canonical record or relationship mutation',
  'central descriptor resynchronization',
  'Cloudflare or DNS change',
  'silent latest-main acceptance',
  'automatic repair',
  'automatic retry or more than one new network execution',
  'Stage 7 continuation',
  'Stage 8 continuation',
  'Phase 10 continuation',
]) assert(forbidden.has(required), `v4 forbidden boundary missing: ${required}`)
assert(authority.stage6_current_production_acceptance === 'NOT_ACCEPTED', 'v4 authority must not pre-accept Stage 6')
assert(authority.automatic_continuation === false, 'v4 automatic continuation must remain disabled')

assert(baseline.authority_id === authority.authority_id, 'v4 execution baseline authority mismatch')
assert(baseline.authority_merge === '1d0a27dd5ac6a8bbb8276dda70ca53188c8e80a3', 'unexpected v4 authority merge')
assert(baseline.parallel_v31_execution?.workflow_run === 32619802741 && baseline.parallel_v31_execution?.consumed === true && baseline.parallel_v31_execution?.rerun_authorized === false, 'parallel v3.1 consumption boundary changed')
assert(baseline.execution_count_authorized === 1, 'v4 execution count must remain one')
assert(baseline.automatic_baseline_refresh_authorized === false, 'automatic baseline refresh must remain disabled')
assert(baseline.production_mutation_authorized === false && baseline.vertical_repository_mutation_authorized === false && baseline.canonical_record_or_relationship_mutation_authorized === false && baseline.central_descriptor_resync_authorized === false && baseline.cloudflare_dns_mutation_authorized === false, 'v4 mutation boundary weakened')
assert(Array.isArray(baseline.registries) && baseline.registries.length === 8, 'v4 execution baseline must cover eight registries')
assert(baseline.stage5_relationship_counts?.total === 244 && baseline.stage5_relationship_counts?.cross_registry === 0, 'Stage 5 relationship boundary changed')

const byId = new Map(baseline.registries.map((item) => [item.registry_id, item]))
const expectedMains = {
  'historical-exchange-index': 'ad4213829057a4a3561340e95ab29fc570aec057',
  'minted-and-gone': 'f917d5e25eedc7b2c48091c7343b7fa9cd203428',
  'stable-or-gone': 'e8663a8289033a3a6af7cb19fb31683b2545e61c',
  'crypto-yield-archive': 'fa35d291a67b2e367f8f7e759a635a0804116680',
  'bridge-incident-registry': '666d1f4f78b7ed12fa36e2741134523a140221c4',
  'cryptocurrency-wallet-lifecycle-registry': '8192dedeb3777894f031dcbd13d95367f5f688de',
  'ai-tools-history-archive': '76ef103329813f0174db121117c932bff53fbf8e',
  'api-deprecation-archive': '641a6d4243d30f95f48436455d2cbc12a8aded53',
}
for (const [id, exact] of Object.entries(expectedMains)) {
  const item = byId.get(id)
  assert(item, `${id}: v4 execution baseline missing`)
  assert((item.reviewed_main ?? item.reviewed_main_before_implementation) === exact, `${id}: reviewed v4 main changed without explicit code review`)
}
const heiBaseline = byId.get('historical-exchange-index')
const magBaseline = byId.get('minted-and-gone')
const cyaBaseline = byId.get('crypto-yield-archive')
assert(heiBaseline.production_runtime_source === '1a15bb26793541bf994c5cc9123b78d2236f0d76', 'unexpected HEI reviewed canonical runtime source')
assert(JSON.stringify(heiBaseline.allowed_preimplementation_build_commits) === JSON.stringify([
  '1d0a27dd5ac6a8bbb8276dda70ca53188c8e80a3',
  '1a15bb26793541bf994c5cc9123b78d2236f0d76',
  'ad4213829057a4a3561340e95ab29fc570aec057',
]), 'HEI reviewed build allowlist changed')
assert(magBaseline.production_runtime_source === magBaseline.reviewed_main && magBaseline.reviewed_main === 'f917d5e25eedc7b2c48091c7343b7fa9cd203428', 'MAG v4 current deployment correction changed')
assert(cyaBaseline.expected_primary_records === 122, 'CYA canonical count changed')
assert(JSON.stringify(cyaBaseline.allowed_production_source_commits) === JSON.stringify(['2f68c520bc1b502f351f22a71fa339b29d473ef7']), 'CYA canonical source allowlist changed')
assert(cyaBaseline.classification === 'reviewed_staging_only_drift_after_canonical_platform_122', 'CYA staging-only review classification changed')

const authorityById = new Map((authority.reviewed_repository_baselines || []).map((item) => [item.registry_id, item]))
assert(authorityById.size === 8, 'v4 authority must cover eight registries')
for (const [id, item] of byId) {
  const frozen = authorityById.get(id)
  assert(frozen, `${id}: missing v4 authority repository identity`)
  assert(frozen.repository === item.repository, `${id}: repository identity changed from v4 authority`)
  assert(frozen.origin === item.origin, `${id}: public origin changed from v4 authority`)
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
addReview('historical-exchange-index', 'root', heiBaseline.production_runtime_source, {
  allowed_build_commits: heiBaseline.allowed_preimplementation_build_commits,
})
addReview('minted-and-gone', `path.join(${repoRootExpr}, 'mag')`, magBaseline.production_runtime_source)
addReview('stable-or-gone', `path.join(${repoRootExpr}, 'sog')`, byId.get('stable-or-gone').production_runtime_source)
addReview('crypto-yield-archive', `path.join(${repoRootExpr}, 'cya')`, null, {
  allowed_source_commits: cyaBaseline.allowed_production_source_commits,
  expected_primary_records: cyaBaseline.expected_primary_records,
})
addReview('bridge-incident-registry', `path.join(${repoRootExpr}, 'bir')`)
addReview('cryptocurrency-wallet-lifecycle-registry', `path.join(${repoRootExpr}, 'wlr')`)
addReview('ai-tools-history-archive', `path.join(${repoRootExpr}, 'ai')`, byId.get('ai-tools-history-archive').production_runtime_source)
addReview('api-deprecation-archive', `path.join(${repoRootExpr}, 'api')`)

let source = fs.readFileSync(legacyPath, 'utf8')
const legacySha = createHash('sha256').update(source).digest('hex')
assert(source.includes("hei-ledger-series-phase9-stage6-production-equality-2026-08-21-v2"), 'legacy verifier no longer has expected v2 authority marker')
assert(source.includes("execution_kind: 'read_only_cross_registry_production_equality_corrected'"), 'legacy verifier execution marker changed')

source = replaceOnce(
  source,
  "config', 'ledger-series-phase9-stage6-production-equality-authority.json'",
  "config', 'ledger-series-phase9-stage6-mag-checker-correction-authority-2026-08-23.json'",
  'authority path',
)

const reviewStart = source.indexOf('const REVIEW = {')
const reviewEndMarker = '\n\nconst expectedRelationships ='
const reviewEnd = source.indexOf(reviewEndMarker, reviewStart)
assert(reviewStart >= 0 && reviewEnd > reviewStart, 'REVIEW block markers missing')
source = `${source.slice(0, reviewStart)}const REVIEW = {\n${reviewLines.join('\n')}\n}${source.slice(reviewEnd)}`

source = replaceOnce(
  source,
  "assert(authority.authority_id === 'hei-ledger-series-phase9-stage6-production-equality-2026-08-21-v2', 'unexpected Stage 6 authority')",
  "assert(authority.authority_id === 'hei-ledger-series-phase9-stage6-mag-checker-correction-2026-08-23-v4', 'unexpected Stage 6 v4 authority')",
  'authority id assertion',
)
source = replaceOnce(
  source,
  "assert(authority.network_read_only_verification_authorized_after_merge === true, 'Stage 6 network verification is not authorized')",
  "assert(Array.isArray(authority.authorized_next_changes) && authority.authorized_next_changes.some((x) => x.includes('execute exactly one new read-only eight-registry')), 'Stage 6 v4 network execution is not authorized')",
  'network authority assertion',
)
source = replaceOnce(
  source,
  "assert(authority.production_mutation_authorized === false && authority.vertical_repository_mutation_authorized === false && authority.central_descriptor_resync_authorized === false, 'Stage 6 mutation boundary weakened')",
  "assert(Array.isArray(authority.not_authorized) && authority.not_authorized.includes('production mutation') && authority.not_authorized.includes('any vertical repository mutation') && authority.not_authorized.includes('central descriptor resynchronization'), 'Stage 6 v4 mutation boundary weakened')",
  'mutation authority assertion',
)

const authorityLoopNeedle = `  const frozen = byId.get(id)\n  assert(frozen, \`${'${id}'}: missing frozen authority baseline\`)\n  assert(frozen.repository === review.repository, \`${'${id}'}: repository changed from authority\`)\n  review.origin = frozen.origin\n  review.verification_mode = frozen.verification_mode`
const authorityLoopReplacement = `  const frozen = byId.get(id)\n  assert(frozen, \`${'${id}'}: missing frozen authority baseline\`)\n  assert(frozen.repository === review.repository, \`${'${id}'}: repository changed from authority\`)\n  assert(frozen.origin === review.origin, \`${'${id}'}: origin changed from authority\`)`
source = replaceOnce(source, authorityLoopNeedle, authorityLoopReplacement, 'v4 authority identity loop')

source = replaceOnce(source, "schema_version: '1.1.0'", "schema_version: '1.4.0'", 'report schema version')
source = replaceOnce(
  source,
  "execution_kind: 'read_only_cross_registry_production_equality_corrected'",
  "execution_kind: 'read_only_cross_registry_current_production_correction_v4'",
  'execution kind',
)
source = replaceOnce(
  source,
  "      assert(githubSha && observed === githubSha, `HEI main moved: workflow ${githubSha || 'missing'}, observed ${observed}`)",
  "      const expectedHeiExecutionSha = (process.env.STAGE6_HEI_EXECUTION_SHA || githubSha || '').trim()\n      assert(expectedHeiExecutionSha && observed === expectedHeiExecutionSha, `HEI main moved: v4 execution ${expectedHeiExecutionSha || 'missing'}, observed ${observed}`)",
  'HEI execution SHA preflight',
)
source = replaceOnce(
  source,
  "HEI_PUBLIC_ORIGIN: hei.origin, EXPECTED_COMMIT: hei.production_revision, SMOKE_MAX_ATTEMPTS: '3', SMOKE_RETRY_DELAY_MS: '5000',",
  "HEI_PUBLIC_ORIGIN: hei.origin, EXPECTED_COMMIT: '', SMOKE_MAX_ATTEMPTS: '3', SMOKE_RETRY_DELAY_MS: '5000',",
  'HEI checker build semantics',
)
source = replaceOnce(
  source,
  "CYA_BASE_URL: cya.origin, CYA_EXPECTED_COMMIT: cya.production_revision, CYA_SMOKE_ATTEMPTS: '3', CYA_SMOKE_DELAY_MS: '5000',",
  "CYA_BASE_URL: cya.origin, CYA_EXPECTED_COMMIT: '', CYA_SMOKE_ATTEMPTS: '3', CYA_SMOKE_DELAY_MS: '5000',",
  'CYA checker commit semantics',
)

const heiNeedle = "  if (id === 'crypto-yield-archive') await verifyCyaDerivedCount(review, descriptor, index)"
const heiReplacement = `  if (id === 'historical-exchange-index') {
    const heiVersion = await live(review, '/version.json', 'HEI native version')
    assertSame(descriptor.verification?.build, heiVersion.build, 'HEI descriptor/native build')
    assertSame(index.verification?.build, heiVersion.build, 'HEI index/native build')
    const executionSha = (process.env.STAGE6_HEI_EXECUTION_SHA || '').trim()
    const allowed = new Set([...(review.allowed_build_commits || []), executionSha].filter(Boolean))
    assert(allowed.size > 0, 'HEI reviewed build allowlist missing')
    assert(allowed.has(heiVersion.build?.commit), 'HEI production build ' + heiVersion.build?.commit + ' is not a reviewed runtime/coordination build')
  }
  if (id === 'crypto-yield-archive') await verifyCyaDerivedCount(review, descriptor, index)`
source = replaceOnce(source, heiNeedle, heiReplacement, 'HEI v4 build verification')

const cyaNeedle = "  if (id === 'crypto-yield-archive') await verifyCyaDerivedCount(review, descriptor, index)"
const cyaReplacement = `  if (id === 'crypto-yield-archive') {
    await verifyCyaDerivedCount(review, descriptor, index)
    assert(
      descriptor.record_counts.primary_records === review.expected_primary_records,
      'CYA primary count: expected ' + review.expected_primary_records + ', observed ' + descriptor.record_counts.primary_records
    )
    const cyaVersion = await live(review, '/version.json', 'CYA native version')
    assertSame(descriptor.verification?.build, cyaVersion.build, 'CYA descriptor/native build')
    assertSame(index.verification?.build, cyaVersion.build, 'CYA index/native build')
    const allowed = new Set(review.allowed_source_commits || [])
    assert(allowed.size > 0, 'CYA reviewed source-commit allowlist missing')
    try {
      const cyaOrigin = review.origin.endsWith('/') ? review.origin.slice(0, -1) : review.origin
      const sourceCommit = (await fetchText(cyaOrigin + '/cya-source-commit.txt?stage6=' + nonce, 'CYA deployed source commit')).trim()
      assert(allowed.has(sourceCommit), 'CYA deployed source commit ' + sourceCommit + ' is not in reviewed execution allowlist')
    } catch (error) {
      if (!String(error?.message || error).includes('HTTP 404')) throw error
    }
  }`
source = replaceOnce(source, cyaNeedle, cyaReplacement, 'CYA v4 build/source verification')

source = replaceOnce(
  source,
  "  authority_id: authority.authority_id,",
  "  authority_id: authority.authority_id,\n  execution_baseline_id: 'hei-ledger-series-phase9-stage6-v4-execution-baseline-2026-08-23',\n  corrected_from_v3_run_id: 32614056946,\n  parallel_v31_consumed_run_id: 32619802741,",
  'report v4 metadata',
)
source = replaceOnce(
  source,
  "report.overall = 'PASS'",
  "report.legacy_verifier_sha256 = '" + legacySha + "'\n  report.overall = 'PASS'",
  'PASS report metadata',
)

fs.mkdirSync(path.dirname(runtimePath), { recursive: true })
fs.writeFileSync(runtimePath, source)

const syntax = spawnSync(process.execPath, ['--check', runtimePath], { cwd: root, encoding: 'utf8' })
if (syntax.status !== 0) {
  process.stderr.write(syntax.stderr || syntax.stdout || '')
  throw new Error(`v4 runtime verifier syntax check failed with ${syntax.status}`)
}

console.log(JSON.stringify({
  ok: true,
  prepared: runtimePath,
  legacy_verifier_sha256: legacySha,
  execution_baseline_id: baseline.baseline_id,
  corrected_mag_build: magBaseline.production_runtime_source,
  reviewed_cya_main: cyaBaseline.reviewed_main,
  reviewed_cya_canonical_source: cyaBaseline.allowed_production_source_commits[0],
  prepare_only: prepareOnly,
}, null, 2))

if (!prepareOnly) {
  const run = spawnSync(process.execPath, [runtimePath], {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
    timeout: 20 * 60 * 1000,
  })
  if (run.error) throw run.error
  if (run.status !== 0) process.exit(run.status ?? 1)
}
