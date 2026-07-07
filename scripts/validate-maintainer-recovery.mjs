import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

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

function commandScriptName(command) {
  return command.match(/^npm run ([^\s]+)$/)?.[1] ?? null
}

function validateAuthoritativePaths(rootDir, contract) {
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
  const bundleDir = path.join(rootDir, 'records', 'exchanges')
  if (!fs.existsSync(bundleDir)) {
    findings.push(finding('missing_authoritative_path', 'record_bundle_directory_missing', { path: 'records/exchanges' }))
  }
  return findings
}

function addIds(target, records, label, source) {
  assert(Array.isArray(records), `${source}: ${label} must be an array`)
  for (const record of records) {
    assert(record && typeof record.id === 'string', `${source}: ${label} record missing id`)
    target.add(record.id)
  }
}

function deriveReviewedCounts(rootDir, contract) {
  const [entityPath, eventPath, evidencePath] = contract.canonical_data_paths ?? []
  assert(entityPath && eventPath && evidencePath, 'canonical_data_paths must contain entity/event/evidence paths')

  const entityIds = new Set()
  const eventIds = new Set()
  const evidenceIds = new Set()
  const entities = readJson(path.join(rootDir, entityPath))
  const events = readJson(path.join(rootDir, eventPath))
  const evidence = readJson(path.join(rootDir, evidencePath))

  addIds(entityIds, entities, 'entities', entityPath)
  addIds(eventIds, events, 'events', eventPath)
  addIds(evidenceIds, evidence, 'evidence', evidencePath)

  const bundleDir = path.join(rootDir, 'records', 'exchanges')
  const bundleFiles = fs.existsSync(bundleDir)
    ? fs.readdirSync(bundleDir).filter((name) => name.endsWith('.json')).sort()
    : []

  for (const fileName of bundleFiles) {
    const relativePath = `records/exchanges/${fileName}`
    const bundle = readJson(path.join(bundleDir, fileName))
    assert(bundle?.entity?.id, `${relativePath}: missing entity.id`)
    assert(Array.isArray(bundle.events), `${relativePath}: events must be array`)
    assert(Array.isArray(bundle.evidence), `${relativePath}: evidence must be array`)
    entityIds.add(bundle.entity.id)
    addIds(eventIds, bundle.events, 'events', relativePath)
    addIds(evidenceIds, bundle.evidence, 'evidence', relativePath)
  }

  return {
    counts: {
      entities: entityIds.size,
      events: eventIds.size,
      evidence: evidenceIds.size,
    },
    baseCounts: {
      entities: entities.length,
      events: events.length,
      evidence: evidence.length,
    },
    bundleCount: bundleFiles.length,
  }
}

function validateCounts(rootDir, contract) {
  const findings = []
  const derived = deriveReviewedCounts(rootDir, contract)
  for (const [key, actual] of Object.entries(derived.counts)) {
    if (contract.reviewed_counts?.[key] !== actual) {
      findings.push(finding('stale_checkpoint', 'reviewed_count_mismatch', {
        key,
        contract: contract.reviewed_counts?.[key],
        actual,
      }))
    }
  }
  return { findings, derived }
}

function validateRoadmap(rootDir, contract) {
  const roadmap = readText(path.join(rootDir, contract.authoritative_paths.roadmap))
  if (roadmap === null) return [finding('missing_authoritative_path', 'roadmap_missing')]
  const findings = []
  for (const [type, value] of [
    ['current_phase_missing', contract.current_phase],
    ['current_item_missing', contract.current_item],
    ['next_item_missing', contract.next_item],
  ]) {
    if (!value || !roadmap.includes(value)) findings.push(finding('stale_checkpoint', type, { expected: value }))
  }
  for (const [key, value] of Object.entries(contract.reviewed_counts ?? {})) {
    if (!roadmap.includes(String(value))) findings.push(finding('stale_checkpoint', 'roadmap_count_missing', { key, expected: value }))
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

function validatePackageCommands(rootDir, contract) {
  const pkg = readJson(path.join(rootDir, 'package.json'))
  if (!pkg) return [finding('command_reference_incomplete', 'package_json_missing')]
  const findings = []
  for (const command of contract.required_validation_commands ?? []) {
    const script = commandScriptName(command)
    if (!script) {
      findings.push(finding('command_reference_incomplete', 'unsupported_command_shape', { command }))
    } else if (!pkg.scripts?.[script]) {
      findings.push(finding('command_reference_incomplete', 'package_script_missing', { command, script }))
    }
  }
  return findings
}

function validateDeploymentAuthority(rootDir, contract) {
  const deploymentPolicy = readText(path.join(rootDir, contract.authoritative_paths.deployment_policy))
  const projectPolicy = readJson(path.join(rootDir, contract.authoritative_paths.cloudflare_project_policy))
  if (deploymentPolicy === null) return [finding('deployment_authority_incomplete', 'deployment_policy_missing')]
  if (projectPolicy === null) return [finding('deployment_authority_incomplete', 'cloudflare_project_policy_missing')]

  const findings = []
  if (projectPolicy.production_branch !== contract.default_branch) {
    findings.push(finding('deployment_authority_incomplete', 'production_branch_mismatch', { expected: contract.default_branch, actual: projectPolicy.production_branch }))
  }
  if (projectPolicy.source_config?.production_deployments_enabled !== true) findings.push(finding('deployment_authority_incomplete', 'production_deployments_not_enabled'))
  if (projectPolicy.source_config?.preview_deployment_setting !== 'none') findings.push(finding('deployment_authority_incomplete', 'preview_deployment_setting_mismatch', { actual: projectPolicy.source_config?.preview_deployment_setting }))
  if (!deploymentPolicy.includes('/version.json') || !deploymentPolicy.includes('expected')) findings.push(finding('deployment_authority_incomplete', 'commit_first_production_rule_missing'))
  return findings
}

function validateProductionState(rootDir, contract) {
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

function validateAgentAuthorityChain(rootDir, contract) {
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
    ...validateAuthoritativePaths(rootDir, contract),
    ...countResult.findings,
    ...validateRoadmap(rootDir, contract),
    ...validateRunbook(rootDir, contract),
    ...validatePackageCommands(rootDir, contract),
    ...validateDeploymentAuthority(rootDir, contract),
    ...validateProductionState(rootDir, contract),
    ...validateAgentAuthorityChain(rootDir, contract),
    ...validateDynamicRules(contract),
  ]

  const categoryNames = [
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
    authoritativePathCount: Object.keys(contract.authoritative_paths ?? {}).length + (contract.canonical_data_paths ?? []).length + 1,
    requiredCommandCount: (contract.required_validation_commands ?? []).length,
    recoveryStepCount: (contract.recovery_sequence ?? []).length,
    categories: Object.fromEntries(categoryNames.map((category) => [category, findings.filter((item) => item.category === category).length])),
    findings,
  }
}

function writeFixtureFile(rootDir, relativePath, content) {
  const target = path.join(rootDir, relativePath)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, content)
}

function makeSelfTestFixture() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hei-recovery-test-'))
  const contract = {
    version: 1,
    repository: 'badjoke-lab/historical-exchange-index',
    default_branch: 'main',
    current_phase: 'Phase G',
    current_item: 'G-6 Recovery',
    next_item: 'G-7 Baseline',
    reviewed_counts: { entities: 2, events: 2, evidence: 2 },
    authoritative_paths: {
      agent_instructions: 'AGENTS.md',
      roadmap: 'docs/roadmap.md',
      phase_g_spec: 'docs/g.md',
      product_spec: 'docs/product.md',
      localization_spec: 'docs/i18n.md',
      deployment_policy: 'docs/deployment.md',
      cloudflare_project_policy: 'config/cloudflare.json',
      production_verification_contract: 'config/production.json',
      production_verification_report: 'docs/production.md',
      runbook: 'docs/runbook.md',
    },
    canonical_data_paths: ['data/entities.json', 'data/events.json', 'data/evidence.json'],
    required_validation_commands: ['npm run recovery:test', 'npm run recovery:validate'],
    dynamic_state_rules: {
      main_sha: 'derive dynamically; never hard-code',
      open_product_prs: 'derive dynamically; never hard-code',
      production_state: 'read production verification report',
    },
    recovery_sequence: [
      'confirm repository identity',
      'fetch current remote',
      'inspect open PRs',
      'read AGENTS + deployment',
      'read roadmap current',
      'read active phase',
      'derive canonical counts',
      'read latest production',
      'run recovery validator',
      'resume first incomplete',
      'repair stale checkpoint',
    ],
  }

  writeFixtureFile(rootDir, 'config/contract.json', JSON.stringify(contract))
  writeFixtureFile(rootDir, 'data/entities.json', JSON.stringify([{ id: 'e1' }]))
  writeFixtureFile(rootDir, 'data/events.json', JSON.stringify([{ id: 'v1' }]))
  writeFixtureFile(rootDir, 'data/evidence.json', JSON.stringify([{ id: 's1' }]))
  writeFixtureFile(rootDir, 'records/exchanges/extra.json', JSON.stringify({ entity: { id: 'e2' }, events: [{ id: 'v2' }], evidence: [{ id: 's2' }] }))
  writeFixtureFile(rootDir, 'docs/roadmap.md', 'Phase G\nG-6 Recovery\nG-7 Baseline\n2 2 2')
  const concepts = 'repository and default branch current origin/main SHA reviewed counts current phase current work item next work item active specifications open product PRs deployment policy production verification state validation commands recovery sequence'
  const sequenceText = contract.recovery_sequence.join('\n')
  writeFixtureFile(rootDir, 'docs/runbook.md', `${concepts}\n${sequenceText}\nrecords/exchanges build semantics\ngh pr list --state open\ngit rev-parse origin/main\nnpm run recovery:test\nnpm run recovery:validate`)
  writeFixtureFile(rootDir, 'package.json', JSON.stringify({ scripts: { 'recovery:test': 'node x --self-test', 'recovery:validate': 'node x' } }))
  writeFixtureFile(rootDir, 'config/cloudflare.json', JSON.stringify({ production_branch: 'main', source_config: { production_deployments_enabled: true, preview_deployment_setting: 'none' } }))
  writeFixtureFile(rootDir, 'docs/deployment.md', 'compare /version.json with expected commit')
  writeFixtureFile(rootDir, 'config/production.json', JSON.stringify({ expected_commit: 'abc123' }))
  writeFixtureFile(rootDir, 'docs/production.md', 'abc123\nCommit propagation:       MATCH\nOverall result:           PASS')
  writeFixtureFile(rootDir, 'AGENTS.md', 'docs/roadmap.md docs/g.md docs/deployment.md config/cloudflare.json Repository state is authoritative')
  for (const file of ['docs/g.md', 'docs/product.md', 'docs/i18n.md']) writeFixtureFile(rootDir, file, 'spec')

  return { rootDir, contractPath: path.join(rootDir, 'config', 'contract.json') }
}

function runSelfTest() {
  const fixture = makeSelfTestFixture()
  try {
    const clean = validateMaintainerRecovery(fixture.rootDir, fixture.contractPath)
    assert(clean.findings.length === 0, `clean recovery fixture failed: ${JSON.stringify(clean.findings)}`)

    fs.writeFileSync(path.join(fixture.rootDir, 'records', 'exchanges', 'extra.json'), JSON.stringify({ entity: { id: 'e3' }, events: [{ id: 'v2' }], evidence: [{ id: 's2' }] }))
    const countBroken = validateMaintainerRecovery(fixture.rootDir, fixture.contractPath)
    assert(countBroken.findings.some((item) => item.type === 'reviewed_count_mismatch'), 'self-test did not detect reviewed count mismatch')

    fs.writeFileSync(path.join(fixture.rootDir, 'records', 'exchanges', 'extra.json'), JSON.stringify({ entity: { id: 'e2' }, events: [{ id: 'v2' }], evidence: [{ id: 's2' }] }))
    fs.writeFileSync(path.join(fixture.rootDir, 'docs', 'roadmap.md'), 'Phase G\nG-7 Baseline\n2 2 2')
    const roadmapBroken = validateMaintainerRecovery(fixture.rootDir, fixture.contractPath)
    assert(roadmapBroken.findings.some((item) => item.type === 'current_item_missing'), 'self-test did not detect stale roadmap current item')

    fs.writeFileSync(path.join(fixture.rootDir, 'docs', 'roadmap.md'), 'Phase G\nG-6 Recovery\nG-7 Baseline\n2 2 2')
    fs.writeFileSync(path.join(fixture.rootDir, 'package.json'), JSON.stringify({ scripts: { 'recovery:test': 'node x --self-test' } }))
    const commandBroken = validateMaintainerRecovery(fixture.rootDir, fixture.contractPath)
    assert(commandBroken.findings.some((item) => item.type === 'package_script_missing'), 'self-test did not detect missing package command')
  } finally {
    fs.rmSync(fixture.rootDir, { recursive: true, force: true })
  }
  console.log('Maintainer recovery validator self-test passed.')
}

if (process.argv.includes('--self-test')) {
  runSelfTest()
} else {
  const result = validateMaintainerRecovery()
  console.log(`Maintainer recovery validation: ${result.authoritativePathCount} authoritative/canonical paths, ${result.requiredCommandCount} required commands, ${result.recoveryStepCount} recovery steps.`)
  console.log(`Current: ${result.currentPhase} -> ${result.currentItem}; next=${result.nextItem}`)
  console.log(`Reviewed counts: ${JSON.stringify(result.reviewedCounts)} (base data ${JSON.stringify(result.baseDataCounts)} + ${result.recordBundleCount} record bundle files under build semantics)`)
  console.log(`Categories: ${JSON.stringify(result.categories)}`)
  for (const item of result.findings) console.log(JSON.stringify(item))
  if (result.findings.length > 0) throw new Error(`maintainer recovery validation found ${result.findings.length} findings`)
  console.log('Maintainer recovery validation passed with 0 findings.')
}
