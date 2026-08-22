import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'

const root = process.cwd()
const prepareOnly = process.argv.includes('--prepare-only')
const authorityPath = path.join(root, 'config', 'ledger-series-phase9-stage6-current-production-reverification-authority-2026-08-23.json')
const baselinePath = path.join(root, 'config', 'ledger-series-phase9-stage6-v3-execution-baseline.json')
const legacyPath = path.join(root, 'scripts', 'verify-ledger-series-phase9-stage6-production-equality.mjs')
const runtimePath = path.join(root, '.stage6', 'phase9-stage6-v3-runtime-verifier.mjs')

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
assert(authority.authority_id === 'hei-ledger-series-phase9-stage6-current-production-reverification-2026-08-23-v3', 'unexpected v3 authority id')
assert(authority.production_mutation_authorized === false, 'production mutation boundary weakened')
assert(authority.vertical_repository_mutation_authorized === false, 'vertical mutation boundary weakened')
assert(authority.central_descriptor_resync_authorized === false, 'descriptor resync boundary weakened')
assert(authority.network_read_only_reverification_authorized_after_implementation_merge === true, 'network reverification not authorized')
assert(baseline.authority_id === authority.authority_id, 'execution baseline authority mismatch')
assert(baseline.execution_count_authorized === 1, 'execution count must remain one')
assert(baseline.automatic_baseline_refresh_authorized === false, 'automatic baseline refresh must remain disabled')
assert(Array.isArray(baseline.registries) && baseline.registries.length === 8, 'execution baseline must cover eight registries')
assert(baseline.stage5_relationship_counts?.total === 244 && baseline.stage5_relationship_counts?.cross_registry === 0, 'Stage 5 relationship boundary changed')

const byId = new Map(baseline.registries.map((item) => [item.registry_id, item]))
const required = ['historical-exchange-index','minted-and-gone','stable-or-gone','crypto-yield-archive','bridge-incident-registry','cryptocurrency-wallet-lifecycle-registry','ai-tools-history-archive','api-deprecation-archive']
for (const id of required) assert(byId.has(id), `${id}: execution baseline missing`)

const repoRootExpr = "path.join(root, '.stage6', 'repos')"
const reviewLines = []
function addReview(id, localExpr, productionRevision = null, extra = {}) {
  const item = byId.get(id)
  const repoMain = item.reviewed_main ?? item.reviewed_main_before_implementation
  reviewLines.push(`  ${js(id)}: {`)
  reviewLines.push(`    repository: ${js(item.repository)}, repo_main: ${js(repoMain)}, production_revision: ${productionRevision ? js(productionRevision) : 'null'}, local: ${localExpr},`)
  for (const [key, value] of Object.entries(extra)) reviewLines.push(`    ${key}: ${js(value)},`)
  reviewLines.push('  },')
}
addReview('historical-exchange-index', 'root', byId.get('historical-exchange-index').production_runtime_source)
addReview('minted-and-gone', `path.join(${repoRootExpr}, 'mag')`, byId.get('minted-and-gone').production_runtime_source)
addReview('stable-or-gone', `path.join(${repoRootExpr}, 'sog')`, byId.get('stable-or-gone').production_runtime_source)
addReview('crypto-yield-archive', `path.join(${repoRootExpr}, 'cya')`, null, {
  allowed_source_commits: byId.get('crypto-yield-archive').allowed_production_source_commits,
  expected_primary_records: byId.get('crypto-yield-archive').expected_primary_records,
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
  "config', 'ledger-series-phase9-stage6-current-production-reverification-authority-2026-08-23.json'",
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
  "assert(authority.authority_id === 'hei-ledger-series-phase9-stage6-current-production-reverification-2026-08-23-v3', 'unexpected Stage 6 v3 authority')",
  'authority id assertion',
)
source = replaceOnce(source, "schema_version: '1.1.0'", "schema_version: '1.2.0'", 'report schema version')
source = replaceOnce(
  source,
  "execution_kind: 'read_only_cross_registry_production_equality_corrected'",
  "execution_kind: 'read_only_cross_registry_current_production_reverification_v3'",
  'execution kind',
)
source = replaceOnce(
  source,
  "CYA_BASE_URL: cya.origin, CYA_EXPECTED_COMMIT: cya.production_revision, CYA_SMOKE_ATTEMPTS: '3', CYA_SMOKE_DELAY_MS: '5000',",
  "CYA_BASE_URL: cya.origin, CYA_EXPECTED_COMMIT: '', CYA_SMOKE_ATTEMPTS: '3', CYA_SMOKE_DELAY_MS: '5000',",
  'CYA checker commit semantics',
)

const cyaNeedle = "  if (id === 'crypto-yield-archive') await verifyCyaDerivedCount(review, descriptor.record_counts.primary_records)"
const cyaReplacement = `  if (id === 'crypto-yield-archive') {\n    await verifyCyaDerivedCount(review, descriptor.record_counts.primary_records)\n    assert(descriptor.record_counts.primary_records === review.expected_primary_records, \\`CYA primary count: expected \\${review.expected_primary_records}, observed \\${descriptor.record_counts.primary_records}\\`)\n    const cyaVersion = await live(review, '/version.json', 'CYA native version')\n    assertSame(descriptor.verification?.build, cyaVersion.build, 'CYA descriptor/native build')\n    assertSame(index.verification?.build, cyaVersion.build, 'CYA index/native build')\n    const allowed = new Set(review.allowed_source_commits || [])\n    assert(allowed.size > 0, 'CYA reviewed source-commit allowlist missing')\n    try {\n      const sourceCommit = (await fetchText(\\`\\${review.origin.replace(/\\\\/$/, '')}/cya-source-commit.txt?stage6=\\${nonce}\\`, 'CYA deployed source commit')).trim()\n      assert(allowed.has(sourceCommit), \\`CYA deployed source commit \\${sourceCommit} is not in reviewed execution allowlist\\`)\n    } catch (error) {\n      if (!String(error?.message || error).includes('HTTP 404')) throw error\n    }\n  }`
source = replaceOnce(source, cyaNeedle, cyaReplacement, 'CYA v3 build/source verification')

source = replaceOnce(
  source,
  "report.overall = 'PASS'",
  "report.execution_baseline_id = 'hei-ledger-series-phase9-stage6-v3-execution-baseline-2026-08-23'\n  report.legacy_verifier_sha256 = '" + legacySha + "'\n  report.overall = 'PASS'",
  'PASS report metadata',
)

fs.mkdirSync(path.dirname(runtimePath), { recursive: true })
fs.writeFileSync(runtimePath, source)

const syntax = spawnSync(process.execPath, ['--check', runtimePath], { cwd: root, encoding: 'utf8' })
if (syntax.status !== 0) {
  process.stderr.write(syntax.stderr || syntax.stdout || '')
  throw new Error(`v3 runtime verifier syntax check failed with ${syntax.status}`)
}

console.log(JSON.stringify({
  ok: true,
  prepared: runtimePath,
  legacy_verifier_sha256: legacySha,
  execution_baseline_id: baseline.baseline_id,
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
