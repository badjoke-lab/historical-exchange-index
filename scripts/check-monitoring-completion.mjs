import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { MONITOR_NAMES, OUTPUT_ROOT } from './monitoring/core/constants.mjs'

const root = process.cwd()
const runDirArg = process.argv.find((arg) => arg.startsWith('--run-dir='))
const outputArg = process.argv.find((arg) => arg.startsWith('--output='))

function load(relativePath) {
  return JSON.parse(fs.readFileSync(path.resolve(root, relativePath), 'utf8'))
}

function resolveRunDir() {
  if (runDirArg) return runDirArg.slice('--run-dir='.length)
  const outputRoot = path.resolve(root, OUTPUT_ROOT)
  const directories = fs.readdirSync(outputRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{8}$/.test(entry.name))
    .map((entry) => entry.name)
    .sort()
  if (directories.length === 0) throw new Error('No monitoring run directories found')
  return path.join(OUTPUT_ROOT, directories.at(-1))
}

const runDir = resolveRunDir()
const manifest = load(path.join(runDir, 'manifest.json'))
const failures = []
const monitorReports = []

const fail = (message) => failures.push(message)
const manifestByName = new Map((manifest.monitors ?? []).map((item) => [item.name, item]))

for (const name of MONITOR_NAMES) {
  const manifestEntry = manifestByName.get(name)
  if (!manifestEntry) {
    fail(`manifest missing monitor: ${name}`)
    continue
  }
  if (manifestEntry.status !== 'ok') fail(`${name}: status=${manifestEntry.status}`)
  if (manifestEntry.errors_count !== 0) fail(`${name}: errors_count=${manifestEntry.errors_count}`)

  const reportPath = path.join(runDir, `${name}.json`)
  if (!fs.existsSync(path.resolve(root, reportPath))) {
    fail(`missing monitor report: ${reportPath}`)
    continue
  }
  const report = load(reportPath)
  monitorReports.push(report)
  if (report.status !== 'ok') fail(`${name}: report status=${report.status}`)
  if ((report.errors ?? []).length !== 0) fail(`${name}: report contains ${(report.errors ?? []).length} error(s)`)
}

for (const name of manifestByName.keys()) {
  if (!MONITOR_NAMES.includes(name)) fail(`unexpected monitor in manifest: ${name}`)
}

if (manifest.canonical_guard?.canonical_files_modified !== false) {
  fail('canonical guard reports modified canonical files')
}
if ((manifest.canonical_guard?.modified_paths ?? []).length !== 0) {
  fail(`canonical guard has modified paths: ${(manifest.canonical_guard.modified_paths ?? []).join(', ')}`)
}

let criticalFindings = 0
const forbiddenFindings = []
const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 }
const forbiddenCategories = new Set([
  'event_missing_entity_reference',
  'evidence_missing_entity_reference',
])

for (const report of monitorReports) {
  for (const finding of report.findings ?? []) {
    if (Object.hasOwn(severityCounts, finding.severity)) severityCounts[finding.severity] += 1
    if (finding.severity === 'critical') criticalFindings += 1
    if (String(finding.category ?? '').startsWith('legacy_') || forbiddenCategories.has(finding.category)) {
      forbiddenFindings.push({ monitor: report.monitor, category: finding.category, title: finding.title })
    }
  }
}

if (criticalFindings !== 0) fail(`critical monitoring findings=${criticalFindings}`)
if (forbiddenFindings.length !== 0) fail(`closed structural debt rediscovered=${forbiddenFindings.length}`)

const result = {
  generated_at: new Date().toISOString(),
  run_dir: runDir,
  run_id: manifest.run_id ?? null,
  mode: manifest.mode ?? null,
  expected_monitors: MONITOR_NAMES.length,
  completed_monitors: monitorReports.length,
  monitor_errors: monitorReports.reduce((sum, report) => sum + (report.errors ?? []).length, 0),
  canonical_files_modified: manifest.canonical_guard?.canonical_files_modified ?? null,
  findings_by_severity: severityCounts,
  forbidden_findings: forbiddenFindings,
  failures,
  status: failures.length === 0 ? 'pass' : 'fail',
}

if (outputArg) {
  const outputPath = path.resolve(root, outputArg.slice('--output='.length))
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8')
}

console.log(`Monitoring run: ${result.run_id}`)
console.log(`Completed monitors: ${result.completed_monitors}/${result.expected_monitors}`)
console.log(`Monitor errors: ${result.monitor_errors}`)
console.log(`Canonical files modified: ${result.canonical_files_modified}`)
console.log(`Findings by severity: ${JSON.stringify(result.findings_by_severity)}`)
console.log(`Closed structural debt rediscovered: ${result.forbidden_findings.length}`)
if (failures.length > 0) {
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}
console.log('Monitoring completion gate: pass')
