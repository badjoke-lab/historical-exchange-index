import fs from 'node:fs'

function replaceOnce(source, before, after, label) {
  const count = source.split(before).length - 1
  if (count !== 1) throw new Error(`${label}: expected one match, found ${count}`)
  return source.replace(before, after)
}

const ciFile = '.github/workflows/ci.yml'
let ci = fs.readFileSync(ciFile, 'utf8')
const ciStart = ci.indexOf('      - name: Smoke test monitoring modules')
const ciEnd = ci.indexOf('      - name: Check production smoke script syntax')
if (ciStart < 0 || ciEnd < 0 || ciEnd <= ciStart) throw new Error('CI B1 block anchors missing')
ci = `${ci.slice(0, ciStart)}      - name: Validate projected public enums\n        run: npm run data:check-projected-enums\n\n      - name: Smoke test monitoring modules\n        run: npm run monitor:smoke\n\n${ci.slice(ciEnd)}`
fs.writeFileSync(ciFile, ci, 'utf8')

const monitorFile = '.github/workflows/hei-monitoring.yml'
let monitor = fs.readFileSync(monitorFile, 'utf8')
monitor = replaceOnce(
  monitor,
  '  push:\n    branches:\n      - b1-full-monitoring-run\n  pull_request:\n    branches:\n      - main\n',
  '',
  'temporary monitoring triggers',
)
monitor = replaceOnce(
  monitor,
  '          if [ "$GITHUB_EVENT_NAME" = "schedule" ] || [ "$GITHUB_REF_NAME" = "b1-full-monitoring-run" ] || [ "$GITHUB_HEAD_REF" = "b1-full-monitoring-run" ]; then',
  '          if [ "$GITHUB_EVENT_NAME" = "schedule" ]; then',
  'B1 full-run condition',
)
monitor = replaceOnce(
  monitor,
  '          npm run monitor\n\n      - name: Guard canonical data files',
  '          npm run monitor\n\n      - name: Validate monitoring completion\n        run: npm run monitor:check\n\n      - name: Guard canonical data files',
  'monitoring completion gate',
)
monitor = monitor.replace('      - name: Upload monitoring validation output', '      - name: Upload monitoring output')
fs.writeFileSync(monitorFile, monitor, 'utf8')

console.log('Converted B1 validation changes into permanent CI and monitoring gates.')
