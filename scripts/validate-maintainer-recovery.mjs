import fs from 'node:fs'
import path from 'node:path'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'
import { loadReviewedBundles, mergeRecords } from './lib/reviewed-bundle-aggregation.mjs'

const root = process.cwd()
const defaultContractPath = path.join(root, 'config', 'maintainer-recovery-contract.json')

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function readText(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null
}

function readJson(filePath) {
  const text = readText(filePath)
  return text === null ? null : JSON.parse(text)
}

function finding(category, type, detail = {}) {
  return { category, type, ...detail }
}

function deriveReviewedCounts(rootDir, contract) {
  const [entityPath, eventPath, evidencePath] = contract.canonical_data_paths ?? []
  assert(entityPath && eventPath && evidencePath, 'canonical_data_paths must contain entity/event/evidence paths')

  const canonicalEntities = readJson(path.join(rootDir, entityPath))
  const canonicalEvents = readJson(path.join(rootDir, eventPath))
  const canonicalEvidence = readJson(path.join(rootDir, evidencePath))
  assert(Array.isArray(canonicalEntities), `${entityPath} must be an array`)
  assert(Array.isArray(canonicalEvents), `${eventPath} must be an array`)
  assert(Array.isArray(canonicalEvidence), `${evidencePath} must be an array`)

  const { all: reviewedBundles, newEntityBundles } = loadReviewedBundles(rootDir, canonicalEntities)
  const correctedCanonicalEntities = applyReviewedEntityCorrections(canonicalEntities, reviewedBundles)
  const entities = [
    ...correctedCanonicalEntities,
    ...newEntityBundles.map(({ bundle }) => bundle.entity),
  ]
  const events = mergeRecords(canonicalEvents, reviewedBundles, 'events', 'event')
  const evidence = mergeRecords(canonicalEvidence, reviewedBundles, 'evidence', 'evidence')

  return {
    counts: {
      entities: entities.length,
      events: events.length,
      evidence: evidence.length,
    },
    baseCounts: {
      entities: canonicalEntities.length,
      events: canonicalEvents.length,
      evidence: canonicalEvidence.length,
    },
    bundleCount: reviewedBundles.length,
    newEntityBundleCount: newEntityBundles.length,
    correctionBundleCount: reviewedBundles.filter(({ bundle }) => bundle.entity_correction !== undefined).length,
  }
}

function validatePaths(rootDir, contract) {
  const findings = []
  for (const [name, relativePath] of Object.entries(contract.authoritative_paths ?? {})) {
    if (!fs.existsSync(path.join(rootDir, relativePath))) {
      findings.push(finding('missing_authoritative_path', 'path_missing', { name, path: relativePath }))
    }
  }
  for (const relativePath of contract.canonical_data_paths ?? []) {
    if (!fs.existsSync(path.join(rootDir, relativePath))) {
      findings.push(finding('missing_authoritative_path', 'canonical_path_missing', { path: relativePath }))
    }
  }
  if (!fs.existsSync(path.join(rootDir, 'records', 'exchanges'))) {
    findings.push(finding('missing_authoritative_path', 'record_bundle_directory_missing', { path: 'records/exchanges' }))
  }
  return findings
}

function validateCounts(rootDir, contract) {
  const derived = deriveReviewedCounts(rootDir, contract)
  const findings = []
  for (const [key, actual] of Object.entries(derived.counts)) {
    if (contract.reviewed_counts?.[key] !== actual) {
      findings.push(finding('stale_checkpoint', 'reviewed_count_mismatch', {
        key,
        contract: contract.reviewed_counts?.[key],
        actual,
      }))
    }
  }
  return { derived, findings }
}

function validateRoadmap(rootDir, contract) {
  const roadmap = readText(path.join(rootDir, contract.authoritative_paths.roadmap))
  if (roadmap === null) return [finding('missing_authoritative_path', 'roadmap_missing')]

  const milestoneReport = contract.authoritative_paths.d750_completion_report
    ? readText(path.join(rootDir, contract.authoritative_paths.d750_completion_report))
    : ''
  const l1Plan = contract.authoritative_paths.l1_implementation_plan
    ? readText(path.join(rootDir, contract.authoritative_paths.l1_implementation_plan))
    : ''
  const l2Plan = contract.authoritative_paths.l2_evaluation_plan
    ? readText(path.join(rootDir, contract.authoritative_paths.l2_evaluation_plan))
    : ''
  const authorityText = [roadmap, milestoneReport ?? '', l1Plan ?? '', l2Plan ?? ''].join('\n')
  const findings = []

  for (const [type, expected] of [
    ['current_phase_missing', contract.current_phase],
    ['current_item_missing', contract.current_item],
    ['next_item_missing', contract.next_item],
  ]) {
    if (!expected || !authorityText.includes(expected)) findings.push(finding('stale_checkpoint', type, { expected }))
  }
  for (const [key, expected] of Object.entries(contract.reviewed_counts ?? {})) {
    if (!authorityText.includes(String(expected))) findings.push(finding('stale_checkpoint', 'authority_count_missing', { key, expected }))
  }
  return findings
}

function validateRunbook(rootDir, contract) {
  const runbook = readText(path.join(rootDir, contract.authoritative_paths.runbook))
  if (runbook === null) return [finding('missing_authoritative_path', 'runbook_missing')]
  const findings = []
  const concepts = [
    'repository and default branch',
    'current origin/main SHA',
    'reviewed counts',
    'current phase',
    'current work item',
    'next work item',
    'active specifications',
    'open product PRs',
    'deployment policy',
    'production verification state',
    'validation commands',
    'recovery sequence',
  ]
  for (const concept of concepts) {
    if (!runbook.toLowerCase().includes(concept.toLowerCase())) {
      findings.push(finding('runbook_incomplete', 'required_concept_missing', { concept }))
    }
  }
  for (const command of contract.required_validation_commands ?? []) {
    if (!runbook.includes(command)) findings.push(finding('command_reference_incomplete', 'runbook_command_missing', { command }))
  }
  for (const step of contract.recovery_sequence ?? []) {
    const anchor = step.split(' ').slice(0, 3).join(' ')
    if (!runbook.toLowerCase().includes(anchor.toLowerCase())) {
      findings.push(finding('runbook_incomplete', 'recovery_step_anchor_missing', { step, anchor }))
    }
  }
  if (!runbook.includes('gh pr list --state open')) findings.push(finding('runbook_incomplete', 'dynamic_open_pr_command_missing'))
  if (!runbook.includes('git rev-parse origin/main')) findings.push(finding('runbook_incomplete', 'dynamic_main_sha_command_missing'))
  if (!runbook.includes('records/exchanges')) findings.push(finding('runbook_incomplete', 'record_bundle_count_source_missing'))
  if (!runbook.includes('build semantics')) findings.push(finding('runbook_incomplete', 'reviewed_count_build_semantics_missing'))
  return findings
}

function validateCommands(rootDir, contract) {
  const pkg = readJson(path.join(rootDir, 'package.json'))
  if (!pkg) return [finding('command_reference_incomplete', 'package_json_missing')]
  const findings = []
  for (const command of contract.required_validation_commands ?? []) {
    const script = command.match(/^npm run ([^\s]+)$/)?.[1]
    if (!script) {
      findings.push(finding('command_reference_incomplete', 'unsupported_command_shape', { command }))
    } else if (!pkg.scripts?.[script]) {
      findings.push(finding('command_reference_incomplete', 'package_script_missing', { command, script }))
    }
  }
  return findings
}

function validateDeployment(rootDir, contract) {
  const deployment = readText(path.join(rootDir, contract.authoritative_paths.deployment_policy))
  const project = readJson(path.join(rootDir, contract.authoritative_paths.cloudflare_project_policy))
  if (deployment === null) return [finding('deployment_authority_incomplete', 'deployment_policy_missing')]
  if (project === null) return [finding('deployment_authority_incomplete', 'cloudflare_project_policy_missing')]
  const findings = []
  if (project.production_branch !== contract.default_branch) findings.push(finding('deployment_authority_incomplete', 'production_branch_mismatch', { expected: contract.default_branch, actual: project.production_branch }))
  if (project.source_config?.production_deployments_enabled !== true) findings.push(finding('deployment_authority_incomplete', 'production_deployments_not_enabled'))
  if (project.source_config?.preview_deployment_setting !== 'none') findings.push(finding('deployment_authority_incomplete', 'preview_deployment_setting_mismatch', { actual: project.source_config?.preview_deployment_setting }))
  if (!deployment.includes('/version.json') || !deployment.includes('expected')) findings.push(finding('deployment_authority_incomplete', 'commit_first_production_rule_missing'))
  return findings
}

function validateProduction(rootDir, contract) {
  const report = readText(path.join(rootDir, contract.authoritative_paths.production_verification_report))
  const productionContract = readJson(path.join(rootDir, contract.authoritative_paths.production_verification_contract))
  if (report === null) return [finding('production_state_incomplete', 'production_report_missing')]
  if (productionContract === null) return [finding('production_state_incomplete', 'production_contract_missing')]
  const findings = []
  if (!report.includes('Overall result:           PASS')) findings.push(finding('production_state_incomplete', 'production_pass_marker_missing'))
  if (!productionContract.expected_commit || !report.includes(productionContract.expected_commit)) findings.push(finding('production_state_incomplete', 'verified_commit_reference_missing', { expected_commit: productionContract.expected_commit }))
  if (!report.includes('Commit propagation:       MATCH')) findings.push(finding('production_state_incomplete', 'commit_match_marker_missing'))
  return findings
}

function validateAgents(rootDir, contract) {
  const agents = readText(path.join(rootDir, contract.authoritative_paths.agent_instructions))
  if (agents === null) return [finding('authority_chain_incomplete', 'agents_missing')]
  const findings = []
  for (const key of ['roadmap', 'phase_g_spec', 'deployment_policy', 'cloudflare_project_policy']) {
    const relativePath = contract.authoritative_paths[key]
    if (relativePath && !agents.includes(relativePath)) findings.push(finding('authority_chain_incomplete', 'agents_reference_missing', { key, path: relativePath }))
  }
  if (!agents.includes('Repository state is authoritative')) findings.push(finding('authority_chain_incomplete', 'repository_authority_rule_missing'))
  return findings
}

function validateDynamicRules(contract) {
  const findings = []
  const rules = contract.dynamic_state_rules ?? {}
  if (!String(rules.main_sha ?? '').includes('never hard-code')) findings.push(finding('recovery_state_mismatch', 'main_sha_dynamic_rule_missing'))
  if (!String(rules.open_product_prs ?? '').includes('never hard-code')) findings.push(finding('recovery_state_mismatch', 'open_pr_dynamic_rule_missing'))
  if (!String(rules.production_state ?? '').includes('production verification report')) findings.push(finding('recovery_state_mismatch', 'production_state_dynamic_rule_missing'))
  if ((contract.recovery_sequence ?? []).length < 10) findings.push(finding('runbook_incomplete', 'recovery_sequence_too_short', { actual: contract.recovery_sequence?.length ?? 0 }))
  return findings
}

export function validateMaintainerRecovery(rootDir = root, contractPath = defaultContractPath) {
  const contract = readJson(contractPath)
  assert(contract, `missing recovery contract ${contractPath}`)
  assert(contract.version === 1, 'unsupported recovery contract version')
  assert(contract.repository === 'badjoke-lab/historical-exchange-index', 'unexpected recovery repository identity')
  assert(contract.default_branch === 'main', 'unexpected recovery default branch')

  const countResult = validateCounts(rootDir, contract)
  const findings = [
    ...validatePaths(rootDir, contract),
    ...countResult.findings,
    ...validateRoadmap(rootDir, contract),
    ...validateRunbook(rootDir, contract),
    ...validateCommands(rootDir, contract),
    ...validateDeployment(rootDir, contract),
    ...validateProduction(rootDir, contract),
    ...validateAgents(rootDir, contract),
    ...validateDynamicRules(contract),
  ]
  const categories = [
    'missing_authoritative_path',
    'stale_checkpoint',
    'recovery_state_mismatch',
    'runbook_incomplete',
    'command_reference_incomplete',
    'deployment_authority_incomplete',
    'production_state_incomplete',
    'authority_chain_incomplete',
  ]

  return {
    repository: contract.repository,
    defaultBranch: contract.default_branch,
    currentPhase: contract.current_phase,
    currentItem: contract.current_item,
    nextItem: contract.next_item,
    reviewedCounts: countResult.derived.counts,
    baseDataCounts: countResult.derived.baseCounts,
    recordBundleCount: countResult.derived.bundleCount,
    newEntityBundleCount: countResult.derived.newEntityBundleCount,
    correctionBundleCount: countResult.derived.correctionBundleCount,
    authoritativePathCount: Object.keys(contract.authoritative_paths ?? {}).length + (contract.canonical_data_paths ?? []).length + 1,
    requiredCommandCount: (contract.required_validation_commands ?? []).length,
    recoveryStepCount: (contract.recovery_sequence ?? []).length,
    categories: Object.fromEntries(categories.map((category) => [category, findings.filter((item) => item.category === category).length])),
    findings,
  }
}

if (process.argv.includes('--self-test')) {
  console.error('Use npm run recovery:test for black-box validator tests.')
  process.exit(2)
}

const result = validateMaintainerRecovery()
console.log(`Maintainer recovery validation: ${result.authoritativePathCount} authoritative/canonical paths, ${result.requiredCommandCount} required commands, ${result.recoveryStepCount} recovery steps.`)
console.log(`Current: ${result.currentPhase} -> ${result.currentItem}; next=${result.nextItem}`)
console.log(`Reviewed counts: ${JSON.stringify(result.reviewedCounts)} (base data ${JSON.stringify(result.baseDataCounts)} + ${result.recordBundleCount} reviewed bundle files, ${result.newEntityBundleCount} genuinely new entity bundles, ${result.correctionBundleCount} correction bundle(s), using public build aggregation semantics)`)
console.log(`Categories: ${JSON.stringify(result.categories)}`)
for (const item of result.findings) console.log(JSON.stringify(item))
if (result.findings.length > 0) throw new Error(`maintainer recovery validation found ${result.findings.length} findings`)
console.log('Maintainer recovery validation passed with 0 findings.')
