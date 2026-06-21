import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import process from 'node:process'
import { MONITOR_NAMES } from './monitoring/core/constants.mjs'

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hei-monitoring-gate-'))
const runDir = path.join(root, '20260622')
fs.mkdirSync(runDir, { recursive: true })

function writeFixture({ critical = false } = {}) {
  const monitors = MONITOR_NAMES.map((name) => ({
    name,
    status: 'ok',
    findings_count: critical && name === MONITOR_NAMES[0] ? 1 : 0,
    candidate_count: 0,
    errors_count: 0,
  }))
  fs.writeFileSync(path.join(runDir, 'manifest.json'), `${JSON.stringify({
    run_id: 'self-test',
    mode: 'self-test',
    monitors,
    canonical_guard: { canonical_files_modified: false, modified_paths: [] },
  }, null, 2)}\n`)

  for (const name of MONITOR_NAMES) {
    const findings = critical && name === MONITOR_NAMES[0]
      ? [{ severity: 'critical', category: 'self_test_critical', title: 'Expected self-test failure' }]
      : []
    fs.writeFileSync(path.join(runDir, `${name}.json`), `${JSON.stringify({
      monitor: name,
      status: 'ok',
      findings,
      candidates: [],
      errors: [],
    }, null, 2)}\n`)
  }
}

function runGate() {
  return spawnSync(process.execPath, [
    path.resolve('scripts/check-monitoring-completion.mjs'),
    `--run-dir=${runDir}`,
  ], { encoding: 'utf8' })
}

try {
  writeFixture()
  const passing = runGate()
  if (passing.status !== 0) throw new Error(`passing fixture failed:\n${passing.stdout}\n${passing.stderr}`)

  writeFixture({ critical: true })
  const failing = runGate()
  if (failing.status === 0) throw new Error('critical fixture unexpectedly passed')

  console.log('Monitoring completion gate self-test: pass')
} finally {
  fs.rmSync(root, { recursive: true, force: true })
}
