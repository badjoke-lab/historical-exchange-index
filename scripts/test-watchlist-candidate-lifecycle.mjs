import { spawnSync } from 'node:child_process'
import process from 'node:process'

function run(args = []) {
  return spawnSync(process.execPath, [
    'scripts/monitoring/promote-candidate-to-staging.mjs',
    '--dry-run=true',
    ...args,
  ], { encoding: 'utf8' })
}

const resolved = run(['--candidate-name=CoinDCX'])
if (resolved.status === 0) {
  throw new Error('A terminally resolved candidate was available for staging')
}
if (!`${resolved.stdout}\n${resolved.stderr}`.includes('No unresolved matching candidate found')) {
  throw new Error(`Resolved-candidate rejection was unexpected:\n${resolved.stdout}\n${resolved.stderr}`)
}

const unresolved = run()
if (unresolved.status !== 0) {
  throw new Error(`No unresolved candidate was available for staging:\n${unresolved.stdout}\n${unresolved.stderr}`)
}
if (!unresolved.stdout.includes('monitoring_candidate_staging_draft')) {
  throw new Error('Unresolved candidate dry-run did not produce a staging draft')
}
if (!unresolved.stdout.includes('candidate_key')) {
  throw new Error('Unresolved candidate draft did not preserve a stable candidate key')
}

console.log('Watchlist candidate lifecycle self-test: pass')
