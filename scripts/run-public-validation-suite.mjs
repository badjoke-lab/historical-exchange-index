import { spawnSync } from 'node:child_process'

const checks = [
  ['public output consistency', ['scripts/validate-public-output-consistency.mjs']],
  ['reviewed update feed export', ['scripts/validate-reviewed-update-feed-export.mjs']],
  ['internal links self-test', ['scripts/audit-internal-links.mjs', '--self-test']],
  ['internal links', ['scripts/audit-internal-links.mjs']],
  ['public metadata self-test', ['scripts/audit-public-metadata.mjs', '--self-test']],
  ['public metadata', ['scripts/audit-public-metadata.mjs']],
  ['sitemap canonical self-test', ['scripts/audit-sitemap-canonical-routes.mjs', '--self-test']],
  ['sitemap canonical routes', ['scripts/audit-sitemap-canonical-routes.mjs']],
  ['navigation discovery self-test', ['scripts/audit-public-navigation-discovery.mjs', '--self-test']],
  ['navigation discovery', ['scripts/audit-public-navigation-discovery.mjs']],
  ['Stats Explorer handoff', ['scripts/validate-stats-explorer-handoff.mjs']],
  ['Explorer handoff', ['scripts/test-explorer-handoff.mjs']],
  ['Explorer query contract', ['scripts/validate-explorer-query-contract.mjs']],
  ['Compare public surface', ['scripts/audit-compare-public-surface.mjs']],
  ['i18n foundation', ['scripts/test-i18n-foundation.mjs']],
  ['accessibility self-test', ['scripts/audit-public-accessibility.mjs', '--self-test']],
  ['accessibility', ['scripts/audit-public-accessibility.mjs']],
  ['URL safety self-test', ['scripts/audit-public-url-safety.mjs', '--self-test']],
  ['URL safety', ['scripts/audit-public-url-safety.mjs']],
  ['cross-surface integration self-test', ['scripts/audit-cross-surface-integration.mjs', '--self-test']],
  ['cross-surface integration', ['scripts/audit-cross-surface-integration.mjs']],
  ['machine/public consistency self-test', ['scripts/audit-machine-public-consistency.mjs', '--self-test']],
  ['machine/public consistency', ['scripts/audit-machine-public-consistency.mjs']],
]

const failures = []

for (const [name, args] of checks) {
  const result = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: process.env,
    maxBuffer: 32 * 1024 * 1024,
  })

  if (result.status === 0) {
    console.log(`[pass] ${name}`)
    continue
  }

  const stdout = String(result.stdout || '').trim()
  const stderr = String(result.stderr || '').trim()
  failures.push({ name, status: result.status, signal: result.signal, stdout, stderr })
  console.error(`[fail] ${name}`)
  if (stdout) console.error(stdout)
  if (stderr) console.error(stderr)
}

if (failures.length > 0) {
  console.error(`Public validation failed: ${failures.length}/${checks.length} checks failed.`)
  console.error(JSON.stringify(failures.map(({ name, status, signal }) => ({ name, status, signal })), null, 2))
  process.exit(1)
}

console.log(`Public validation passed: ${checks.length}/${checks.length} checks.`)
