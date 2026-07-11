import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const root = process.cwd()
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hei-recovery-blackbox-'))

function copy(relativePath) {
  const source = path.join(root, relativePath)
  const target = path.join(tempRoot, relativePath)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.cpSync(source, target, { recursive: true })
}

function runValidator(expectSuccess, expectedMarker = '') {
  const result = spawnSync(process.execPath, ['scripts/validate-maintainer-recovery.mjs'], {
    cwd: tempRoot,
    encoding: 'utf8',
  })
  const output = `${result.stdout}\n${result.stderr}`

  if (expectSuccess && result.status !== 0) {
    throw new Error(`clean recovery fixture failed:\n${output}`)
  }
  if (!expectSuccess && result.status === 0) {
    throw new Error(`broken recovery fixture unexpectedly passed; expected marker ${expectedMarker}`)
  }
  if (expectedMarker && !output.includes(expectedMarker)) {
    throw new Error(`expected marker ${expectedMarker} not found:\n${output}`)
  }
}

try {
  for (const relativePath of [
    'AGENTS.md',
    'package.json',
    'docs',
    'config',
    'data',
    'data-evaluation',
    'records/exchanges',
    'scripts/validate-maintainer-recovery.mjs',
    'scripts/evaluate-l2-localization-gate.mjs',
    'scripts/validate-v1-baseline.mjs',
    'scripts/lib/entity-corrections.mjs',
    'scripts/lib/reviewed-bundle-aggregation.mjs',
  ]) {
    copy(relativePath)
  }

  const contractPath = path.join(tempRoot, 'config', 'maintainer-recovery-contract.json')
  const packagePath = path.join(tempRoot, 'package.json')

  const originalContract = fs.readFileSync(contractPath, 'utf8')
  const parsedContract = JSON.parse(originalContract)
  const activePlanRelative = parsedContract.authoritative_paths.l2_evaluation_plan
    ?? parsedContract.authoritative_paths.l1_implementation_plan
  const activePlanPath = path.join(tempRoot, activePlanRelative)
  const originalActivePlan = fs.readFileSync(activePlanPath, 'utf8')
  const originalPackage = fs.readFileSync(packagePath, 'utf8')

  runValidator(true)

  const countBroken = JSON.parse(originalContract)
  countBroken.reviewed_counts.entities += 1
  fs.writeFileSync(contractPath, `${JSON.stringify(countBroken, null, 2)}\n`)
  runValidator(false, 'reviewed_count_mismatch')
  fs.writeFileSync(contractPath, originalContract)

  const currentItem = parsedContract.current_item
  fs.writeFileSync(activePlanPath, originalActivePlan.replaceAll(currentItem, 'CURRENT ITEM REMOVED FOR SELF-TEST'))
  runValidator(false, 'current_item_missing')
  fs.writeFileSync(activePlanPath, originalActivePlan)

  const commandBroken = JSON.parse(originalPackage)
  delete commandBroken.scripts['recovery:validate']
  fs.writeFileSync(packagePath, `${JSON.stringify(commandBroken, null, 2)}\n`)
  runValidator(false, 'package_script_missing')
  fs.writeFileSync(packagePath, originalPackage)

  console.log('Maintainer recovery validator black-box self-test passed.')
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true })
}
