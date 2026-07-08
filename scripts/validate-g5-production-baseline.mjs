import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const baseline = JSON.parse(fs.readFileSync(path.join(root, 'config/v1-baseline-contract.json'), 'utf8'))
const production = JSON.parse(fs.readFileSync(path.join(root, baseline.production_verification.verification_contract), 'utf8'))
const report = fs.readFileSync(path.join(root, baseline.production_verification.verification_report), 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`G-5 production baseline validation failed: ${message}`)
}

assert(
  production.expected_commit === baseline.baseline_main_sha,
  `production contract commit ${production.expected_commit} differs from baseline ${baseline.baseline_main_sha}`,
)
assert(
  baseline.production_verification.baseline_expected_commit === baseline.baseline_main_sha,
  'baseline production expected commit differs from baseline SHA',
)
assert(report.includes('Overall result:           PASS'), 'G-5 production verification report has no PASS marker')
assert(report.includes(baseline.baseline_main_sha), 'G-5 report does not preserve the baseline deployment commit')

console.log(`G-5 production baseline validated: ${baseline.baseline_main_sha}`)
