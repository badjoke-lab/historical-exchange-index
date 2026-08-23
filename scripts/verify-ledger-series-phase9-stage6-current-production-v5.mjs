import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'

const root = process.cwd()
const prepareOnly = process.argv.includes('--prepare-only')
const authorityPath = path.join(root, 'config', 'ledger-series-phase9-stage6-v5-sog-checker-correction-authority-2026-08-23.json')
const baselinePath = path.join(root, 'config', 'ledger-series-phase9-stage6-v5-execution-baseline.json')
const legacyPath = path.join(root, 'scripts', 'verify-ledger-series-phase9-stage6-production-equality.mjs')
const runtimePath = path.join(root, '.stage6', 'phase9-stage6-v5-runtime-verifier.mjs')

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
const authorization = authority.authorization || {}

assert(authority.authority_id === 'hei-ledger-series-phase9-stage6-sog-checker-correction-2026-08-23-v5', 'unexpected v5 authority id')
assert(authority.failed_v4_execution?.workflow_run === 32620749266, 'v5 authority must bind to the consumed v4 failure')
assert(authority.failed_v4_execution?.job_id === 97148448800, 'v5 authority v4 job binding changed')
assert(authority.failed_v4_execution?.artifact_id === 9488302977, 'v5 authority v4 artifact binding changed')
assert(authority.failed_v4_execution?.artifact_digest === 'sha256:98fa5d88fd3e98b42802ca003d5abc1cf7f42a12ac566db8532ca26f813b0335', 'v5 authority v4 artifact digest changed')
assert(authority.sog_failure_review?.classification === 'stale_stage5_production_checker_hash_lock_after_reviewed_non_growth_canonical_maintenance', 'unexpected SOG failure classification')
assert(authority.sog_failure_review?.historical_stage5_authority_hash === 'sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798', 'historical SOG Stage 5 hash changed')
assert(authority.sog_failure_review?.current_reviewed_production_hash === 'sha256:bba93c1e3f0ea1b050cd395455327b70fb7c1920d37b18c300949bb49df53965', 'reviewed current SOG hash changed')
assert(authorization.v5_implementation_authorized === true && authorization.hei_verifier_only_correction_authorized === true && authorization.transient_sog_stage5_checker_derivation_authorized === true, 'v5 implementation boundary not authorized')
assert(authorization.network_read_only_reverification_authorized_after_v5_implementation_merge === true && authorization.network_execution_count_authorized === 1, 'v5 finite network execution not authorized')
assert(authorization.rerun_failed_v4_workflow_authorized === false && authorization.automatic_retry_authorized === false && authorization.automatic_repair_authorized === false && authorization.automatic_baseline_refresh_authorized === false, 'v5 retry/repair boundary weakened')
for (const [key, value] of Object.entries({
  production_mutation_authorized: false,
  vertical_repository_mutation_authorized: false,
  sog_repository_mutation_authorized: false,
  canonical_record_mutation_authorized: false,
  relationship_mutation_authorized: false,
  central_descriptor_resync_authorized: false,
  cloudflare_dns_deployment_mutation_authorized: false,
  stage7_continuation_authorized: false,
  stage8_continuation_authorized: false,
  phase10_continuation_authorized: false,
})) assert(authorization[key] === value, `v5 authority boundary changed: ${key}`)
assert(authority.stage6_current_production_acceptance === 'NOT_ACCEPTED' && authority.automatic_continuation === false, 'v5 authority must not pre-accept or auto-continue Stage 6')

const requiredSog = authority.required_v5_sog_contract || {}
assert(requiredSog.repository_main === 'e8663a8289033a3a6af7cb19fb31683b2545e61c', 'v5 SOG repository main changed')
assert(requiredSog.production_source_commit === requiredSog.repository_main, 'v5 SOG production source/repository identity changed')
assert(requiredSog.production_canonical_hash === 'sha256:bba93c1e3f0ea1b050cd395455327b70fb7c1920d37b18c300949bb49df53965', 'v5 SOG reviewed production hash changed')
assert(requiredSog.primary_records === 119 && requiredSog.series_records === 119 && requiredSog.relationships === 1, 'v5 SOG count contract changed')
assert(JSON.stringify(requiredSog.relationship_tuple) === JSON.stringify(['predecessor_of','stable-or-gone:stablecoin:sog_st_sai','stable-or-gone:stablecoin:sog_st_dai']), 'v5 SOG relationship tuple changed')
assert(requiredSog.relationship_direction === 'directed' && requiredSog.relationship_provenance_basis === 'native_reviewed_relationship' && requiredSog.record_envelope_relationship_arrays_remain_empty === true, 'v5 SOG relationship semantics changed')

assert(baseline.authority_id === authority.authority_id, 'v5 execution baseline authority mismatch')
assert(baseline.authority_merge === '8b4b7042edb154ce394e65b98dfb1a1a0bdd9951', 'unexpected v5 authority merge')
assert(baseline.corrected_from_v4_execution?.workflow_run === 32620749266 && baseline.corrected_from_v4_execution?.consumed === true && baseline.corrected_from_v4_execution?.rerun_authorized === false, 'v4 consumption boundary changed')
assert(baseline.execution_count_authorized === 1 && baseline.automatic_baseline_refresh_authorized === false, 'v5 execution boundary changed')
assert(baseline.production_mutation_authorized === false && baseline.vertical_repository_mutation_authorized === false && baseline.sog_repository_mutation_authorized === false && baseline.canonical_record_or_relationship_mutation_authorized === false && baseline.central_descriptor_resync_authorized === false && baseline.cloudflare_dns_mutation_authorized === false, 'v5 mutation boundary weakened')
assert(Array.isArray(baseline.registries) && baseline.registries.length === 8, 'v5 baseline must cover eight registries')
assert(baseline.stage5_relationship_counts?.total === 244 && baseline.stage5_relationship_counts?.cross_registry === 0, 'Stage 5 relationship boundary changed')

const byId = new Map(baseline.registries.map((item) => [item.registry_id, item]))
const expectedMains = {
  'historical-exchange-index': '8b4b7042edb154ce394e65b98dfb1a1a0bdd9951',
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
  assert(item, `${id}: v5 baseline missing`)
  assert((item.reviewed_main ?? item.reviewed_main_before_implementation) === exact, `${id}: reviewed v5 main changed without explicit review`)
}

const authorityMains = new Map((authority.reviewed_repository_mains_at_authority_creation || []).map((item) => [item.registry_id, item]))
assert(authorityMains.size === 8, 'v5 authority must record eight repository mains')
for (const [id, item] of byId) {
  const frozen = authorityMains.get(id)
  assert(frozen && frozen.repository === item.repository, `${id}: repository identity changed from v5 authority`)
  if (id === 'historical-exchange-index') {
    assert(frozen.main === '932dea2acfee90a34d7c17390402b8b835bec621', 'HEI authority-creation main changed')
  } else {
    assert(frozen.main === item.reviewed_main, `${id}: reviewed main changed from v5 authority creation`)
  }
}

const heiBaseline = byId.get('historical-exchange-index')
const magBaseline = byId.get('minted-and-gone')
const sogBaseline = byId.get('stable-or-gone')
const cyaBaseline = byId.get('crypto-yield-archive')
assert(heiBaseline.production_runtime_source === '932dea2acfee90a34d7c17390402b8b835bec621', 'unexpected HEI reviewed canonical runtime source')
assert(JSON.stringify(heiBaseline.allowed_preimplementation_build_commits) === JSON.stringify(['932dea2acfee90a34d7c17390402b8b835bec621','8b4b7042edb154ce394e65b98dfb1a1a0bdd9951']), 'HEI v5 reviewed build allowlist changed')
assert(magBaseline.production_runtime_source === magBaseline.reviewed_main && magBaseline.reviewed_main === 'f917d5e25eedc7b2c48091c7343b7fa9cd203428', 'MAG reviewed build changed')
assert(sogBaseline.production_runtime_source === sogBaseline.reviewed_main && sogBaseline.expected_current_canonical_hash === requiredSog.production_canonical_hash, 'SOG v5 baseline changed')
assert(sogBaseline.historical_stage5_authority_hash === authority.sog_failure_review.historical_stage5_authority_hash, 'SOG historical Stage 5 hash mismatch across authority/baseline')
assert(sogBaseline.expected_primary_records === 119 && sogBaseline.expected_series_records === 119 && sogBaseline.expected_relationships === 1, 'SOG v5 count baseline changed')
assert(cyaBaseline.expected_primary_records === 122 && JSON.stringify(cyaBaseline.allowed_production_source_commits) === JSON.stringify(['2f68c520bc1b502f351f22a71fa339b29d473ef7']), 'CYA canonical boundary changed')

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
addReview('stable-or-gone', `path.join(${repoRootExpr}, 'sog')`, sogBaseline.production_runtime_source, {
  expected_current_canonical_hash: sogBaseline.expected_current_canonical_hash,
  historical_stage5_authority_hash: sogBaseline.historical_stage5_authority_hash,
})
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
assert(source.includes("checker('SOG Stage 5 relationships', 'stable-or-gone', 'scripts/verify-stage5-production.mjs'"), 'legacy SOG Stage 5 checker invocation changed')

source = replaceOnce(
  source,
  "config', 'ledger-series-phase9-stage6-production-equality-authority.json'",
  "config', 'ledger-series-phase9-stage6-v5-sog-checker-correction-authority-2026-08-23.json'",
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
  "assert(authority.authority_id === 'hei-ledger-series-phase9-stage6-sog-checker-correction-2026-08-23-v5', 'unexpected Stage 6 v5 authority')",
  'authority id assertion',
)
source = replaceOnce(
  source,
  "assert(authority.network_read_only_verification_authorized_after_merge === true, 'Stage 6 network verification is not authorized')",
  "assert(authority.authorization?.network_read_only_reverification_authorized_after_v5_implementation_merge === true && authority.authorization?.network_execution_count_authorized === 1, 'Stage 6 v5 network execution is not authorized')",
  'network authority assertion',
)
source = replaceOnce(
  source,
  "assert(authority.production_mutation_authorized === false && authority.vertical_repository_mutation_authorized === false && authority.central_descriptor_resync_authorized === false, 'Stage 6 mutation boundary weakened')",
  "assert(authority.authorization?.production_mutation_authorized === false && authority.authorization?.vertical_repository_mutation_authorized === false && authority.authorization?.sog_repository_mutation_authorized === false && authority.authorization?.canonical_record_mutation_authorized === false && authority.authorization?.relationship_mutation_authorized === false && authority.authorization?.central_descriptor_resync_authorized === false, 'Stage 6 v5 mutation boundary weakened')",
  'mutation authority assertion',
)
source = replaceOnce(
  source,
  "assert(authority.reviewed_repository_baselines?.length === 8, 'Stage 6 authority must cover eight registries')",
  "assert(authority.reviewed_repository_mains_at_authority_creation?.length === 8, 'Stage 6 v5 authority must cover eight registries')",
  'authority repository list assertion',
)
source = replaceOnce(
  source,
  "const byId = new Map(authority.reviewed_repository_baselines.map((x) => [x.registry_id, x]))",
  "const byId = new Map(authority.reviewed_repository_mains_at_authority_creation.map((x) => [x.registry_id, { ...x, reviewed_main: x.main }]))",
  'authority repository map',
)
const authorityLoopNeedle = `  const frozen = byId.get(id)\n  assert(frozen, \`${'${id}'}: missing frozen authority baseline\`)\n  assert(frozen.repository === review.repository, \`${'${id}'}: repository changed from authority\`)\n  review.origin = frozen.origin\n  review.verification_mode = frozen.verification_mode`
const authorityLoopReplacement = `  const frozen = byId.get(id)\n  assert(frozen, \`${'${id}'}: missing frozen v5 authority baseline\`)\n  assert(frozen.repository === review.repository, \`${'${id}'}: repository changed from v5 authority\`)\n  if (id === 'historical-exchange-index') {\n    assert(frozen.main === '932dea2acfee90a34d7c17390402b8b835bec621', 'HEI v5 authority-creation main changed')\n  } else {\n    assert(frozen.main === review.repo_main, \`${'${id}'}: reviewed main changed from v5 authority\`)\n  }`
source = replaceOnce(source, authorityLoopNeedle, authorityLoopReplacement, 'v5 authority identity loop')

source = replaceOnce(source, "schema_version: '1.1.0'", "schema_version: '1.5.0'", 'report schema version')
source = replaceOnce(
  source,
  "execution_kind: 'read_only_cross_registry_production_equality_corrected'",
  "execution_kind: 'read_only_cross_registry_current_production_sog_checker_correction_v5'",
  'execution kind',
)
source = replaceOnce(
  source,
  "      assert(githubSha && observed === githubSha, `HEI main moved: workflow ${githubSha || 'missing'}, observed ${observed}`)",
  "      const expectedHeiExecutionSha = (process.env.STAGE6_HEI_EXECUTION_SHA || githubSha || '').trim()\n      assert(expectedHeiExecutionSha && observed === expectedHeiExecutionSha, `HEI main moved: v5 execution ${expectedHeiExecutionSha || 'missing'}, observed ${observed}`)",
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
  "CYA_BASE_URL: cya.origin, CYA_EXPECTED_COMMIT: '', CYA_SMOKE_ATTEMPTS: '3', CYA_SMOKE_RETRY_DELAY_MS: '5000',",
  'CYA checker commit semantics',
)

const sogTransientFunction = `function prepareSogV5TransientChecker() {
  const sog = REVIEW['stable-or-gone']
  const sourcePath = path.join(sog.local, 'scripts', 'verify-stage5-production.mjs')
  assert(fs.existsSync(sourcePath), 'SOG v5 reviewed Stage 5 checker missing')
  let checkerSource = fs.readFileSync(sourcePath, 'utf8')
  const sourceSha256 = createHash('sha256').update(checkerSource).digest('hex')
  const historicalHash = 'sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798'
  const currentHash = 'sha256:bba93c1e3f0ea1b050cd395455327b70fb7c1920d37b18c300949bb49df53965'
  const expectedTupleMarker = "const expectedTuple = ['predecessor_of', 'stable-or-gone:stablecoin:sog_st_sai', 'stable-or-gone:stablecoin:sog_st_dai'];"
  const requiredMarkers = [
    "if (!Array.isArray(authority.finite_allowlist) || authority.finite_allowlist.length !== 1)",
    "if (manifest?.record_counts?.primary_records !== 119)",
    "if (descriptor?.record_counts?.relationships !== 1)",
    "if (descriptor?.routes?.relationships !== '/data/series/relationships.json')",
    "if (descriptor?.capabilities?.relationships !== 'adapter')",
    "if (index?.record_count !== 119 || rows.length !== 119)",
    "if (relationship.relation_type !== expectedTuple[0] || source !== expectedTuple[1] || target !== expectedTuple[2])",
    "if (relationship.direction !== 'directed')",
    "if (relationship.provenance?.basis !== 'native_reviewed_relationship')",
    "if (relationship.id !== relationshipId(relationship.relation_type, source, target))",
    "if (!Array.isArray(envelope.relationships) || envelope.relationships.length !== 0)",
  ]
  assert(checkerSource.includes(expectedTupleMarker), 'SOG v5 reviewed tuple marker changed')
  for (const marker of requiredMarkers) assert(checkerSource.includes(marker), 'SOG v5 relationship checker marker changed: ' + marker)
  function patchOnce(text, needle, replacement, label) {
    const first = text.indexOf(needle)
    assert(first >= 0, label + ': marker not found')
    assert(text.indexOf(needle, first + needle.length) < 0, label + ': marker not unique')
    return text.slice(0, first) + replacement + text.slice(first + needle.length)
  }
  checkerSource = patchOnce(
    checkerSource,
    "const expectedCanonicalHash = '" + historicalHash + "';",
    "const expectedCanonicalHash = '" + currentHash + "';",
    'SOG current canonical hash patch'
  )
  checkerSource = patchOnce(
    checkerSource,
    "  if (authority.canonical_boundary?.canonical_hash !== expectedCanonicalHash) fail('authority canonical hash mismatch');",
    "  if (authority.canonical_boundary?.canonical_hash !== '" + historicalHash + "') fail('historical Stage 5 authority hash changed');",
    'SOG historical authority hash decoupling'
  )
  assert(!checkerSource.includes("authority.canonical_boundary?.canonical_hash !== expectedCanonicalHash"), 'SOG obsolete authority/current hash coupling survived v5 derivation')
  assert(checkerSource.includes("manifest?.build?.canonical_data_hash !== expectedCanonicalHash"), 'SOG current manifest hash assertion was removed')
  const transientName = '.stage6-v5-verify-stage5-production.mjs'
  const transientPath = path.join(sog.local, transientName)
  fs.writeFileSync(transientPath, checkerSource)
  const transientSha256 = createHash('sha256').update(checkerSource).digest('hex')
  report.sog_v5_transient_checker = {
    source_commit: sog.repo_main,
    source_path: 'scripts/verify-stage5-production.mjs',
    source_sha256: sourceSha256,
    transient_sha256: transientSha256,
    historical_stage5_authority_hash: historicalHash,
    reviewed_current_canonical_hash: currentHash,
    patch_count: 2,
    remote_repository_write: false,
    status: 'PREPARED',
  }
  writeReport()
  return transientName
}

function runReviewedCheckers() {
  const sogV5Script = prepareSogV5TransientChecker()`
source = replaceOnce(source, 'function runReviewedCheckers() {', sogTransientFunction, 'SOG v5 transient checker injection')
source = replaceOnce(
  source,
  "checker('SOG Stage 5 relationships', 'stable-or-gone', 'scripts/verify-stage5-production.mjs', [], {",
  "checker('SOG Stage 5 relationships v5 transient', 'stable-or-gone', sogV5Script, [], {",
  'SOG v5 transient checker invocation',
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
source = replaceOnce(source, heiNeedle, heiReplacement, 'HEI v5 build verification')

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
source = replaceOnce(source, cyaNeedle, cyaReplacement, 'CYA v5 build/source verification')

source = replaceOnce(
  source,
  "  authority_id: authority.authority_id,",
  "  authority_id: authority.authority_id,\n  execution_baseline_id: 'hei-ledger-series-phase9-stage6-v5-execution-baseline-2026-08-23',\n  corrected_from_v4_run_id: 32620749266,\n  corrected_from_v4_artifact_id: 9488302977,",
  'report v5 metadata',
)
source = replaceOnce(
  source,
  "report.overall = 'PASS'",
  "report.legacy_verifier_sha256 = '" + legacySha + "'\n  if (report.sog_v5_transient_checker) report.sog_v5_transient_checker.status = 'PASS'\n  report.overall = 'PASS'",
  'PASS report metadata',
)

fs.mkdirSync(path.dirname(runtimePath), { recursive: true })
fs.writeFileSync(runtimePath, source)

const syntax = spawnSync(process.execPath, ['--check', runtimePath], { cwd: root, encoding: 'utf8' })
if (syntax.status !== 0) {
  process.stderr.write(syntax.stderr || syntax.stdout || '')
  throw new Error(`v5 runtime verifier syntax check failed with ${syntax.status}`)
}

console.log(JSON.stringify({
  ok: true,
  prepared: runtimePath,
  legacy_verifier_sha256: legacySha,
  execution_baseline_id: baseline.baseline_id,
  corrected_from_v4_run_id: 32620749266,
  reviewed_sog_main: sogBaseline.reviewed_main,
  reviewed_sog_current_canonical_hash: sogBaseline.expected_current_canonical_hash,
  historical_sog_stage5_authority_hash: sogBaseline.historical_stage5_authority_hash,
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
