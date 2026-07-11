import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const contractPath = path.join(root, 'config/l2-localization-evaluation-contract.json')
const evidenceArg = process.argv.find((arg) => arg.startsWith('--evidence='))
const evidencePath = evidenceArg
  ? path.resolve(root, evidenceArg.slice('--evidence='.length))
  : path.join(root, 'data-evaluation/l2-localization-evidence.json')

function assert(condition, message) {
  if (!condition) throw new Error(`L2 localization evaluation failed: ${message}`)
}

function readJson(filePath) {
  assert(fs.existsSync(filePath), `missing ${path.relative(root, filePath)}`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function isMissing(value) {
  return value === null || value === undefined
}

function evaluate(contract, evidence) {
  assert(contract.version === 1, 'unsupported contract version')
  assert(evidence.version === 1, 'unsupported evidence version')
  assert(contract.phase === evidence.phase, 'phase mismatch between contract and evidence')
  assert(contract.third_language_authorization === false, 'L2 must not authorize a third language')

  for (const metric of contract.required_external_metrics) {
    assert(Object.hasOwn(evidence.external_metrics, metric), `missing external metric key ${metric}`)
  }

  for (const group of contract.required_signal_groups) {
    assert(Object.hasOwn(evidence.signals, group), `missing signal group ${group}`)
    assert(contract.signal_values.includes(evidence.signals[group]), `invalid signal value ${group}=${evidence.signals[group]}`)
  }

  const missingExternalMetrics = contract.required_external_metrics.filter((metric) => {
    return isMissing(evidence.external_metrics[metric])
  })
  const negativeSignals = contract.required_signal_groups.filter((group) => evidence.signals[group] === 'negative')
  const unknownSignals = contract.required_signal_groups.filter((group) => evidence.signals[group] === 'unknown')
  const reasons = []

  const criticalLocaleFailure = evidence.operational_metrics.critical_locale_failure === true
  const qualityNegative = evidence.signals.quality === 'negative'
  const pivotBySignalCount = negativeSignals.length >= contract.pivot_rule.negative_signal_count_at_least

  let decision
  if (
    (contract.pivot_rule.critical_locale_failure_immediate && criticalLocaleFailure)
    || (contract.pivot_rule.quality_negative_immediate && qualityNegative)
    || pivotBySignalCount
  ) {
    decision = 'PIVOT'
    if (criticalLocaleFailure) reasons.push('critical locale failure recorded')
    if (qualityNegative) reasons.push('quality signal is negative')
    if (pivotBySignalCount) reasons.push(`${negativeSignals.length} required signal groups are negative`)
  } else {
    if (evidence.window.observation_days < contract.minimum_observation_days) {
      reasons.push(`observation window ${evidence.window.observation_days}d < required ${contract.minimum_observation_days}d`)
    }
    if (missingExternalMetrics.length > 0) {
      reasons.push(`missing external metrics: ${missingExternalMetrics.join(', ')}`)
    }
    if (unknownSignals.length > 0) {
      reasons.push(`unknown required signals: ${unknownSignals.join(', ')}`)
    }
    const searchOrUsagePositive = evidence.signals.search_visibility === 'positive' || evidence.signals.usage === 'positive'
    if (!searchOrUsagePositive) reasons.push('neither search visibility nor usage is positive yet')

    decision = reasons.length > 0 ? 'HOLD' : 'GO'
  }

  assert(contract.decision_values.includes(decision), `invalid computed decision ${decision}`)

  return {
    decision,
    reasons,
    observation: {
      days: evidence.window.observation_days,
      minimum_days: contract.minimum_observation_days,
    },
    evidence_completeness: {
      missing_external_metrics: missingExternalMetrics,
      unknown_signals: unknownSignals,
      negative_signals: negativeSignals,
    },
  }
}

function deriveRepositoryMetrics() {
  const publicEntities = readJson(path.join(root, 'public/data/entities.json'))
  const jaEntityCopy = readJson(path.join(root, 'data-i18n/ja/entities-copy.json'))
  const jaEventCopy = readJson(path.join(root, 'data-i18n/ja/events-copy.json'))
  const reviewedEntities = publicEntities.record_count ?? publicEntities.records?.length ?? 0
  const entityOverlays = Object.keys(jaEntityCopy.records ?? {}).length
  const eventOverlays = Object.keys(jaEventCopy.records ?? {}).length

  return {
    reviewed_entities: reviewedEntities,
    japanese_entity_overlays: entityOverlays,
    japanese_event_overlays: eventOverlays,
    entity_copy_coverage_percent: reviewedEntities > 0
      ? Number(((entityOverlays / reviewedEntities) * 100).toFixed(2))
      : 0,
    entity_summary_fallback_percent: reviewedEntities > 0
      ? Number((((reviewedEntities - entityOverlays) / reviewedEntities) * 100).toFixed(2))
      : 0,
  }
}

function runSelfTest(contract) {
  const base = {
    version: 1,
    phase: contract.phase,
    window: { start_date: '2026-01-01', end_date: '2026-01-31', observation_days: 30 },
    external_metrics: {
      japanese_search_impressions: 100,
      japanese_search_clicks: 10,
      indexed_route_sample_pass_rate: 0.9,
      japanese_pageviews: 200,
      language_switch_events: 20,
    },
    operational_metrics: {
      broken_locale_links: 0,
      critical_locale_failure: false,
      translation_sync_incidents: 0,
      operator_qa_minutes_per_batch: 30,
      localization_ci_failures: 0,
      localization_ci_runs: 10,
    },
    signals: {
      search_visibility: 'positive',
      usage: 'neutral',
      quality: 'positive',
      operations: 'neutral',
    },
    evidence_notes: [],
  }

  assert(evaluate(contract, base).decision === 'GO', 'GO fixture did not produce GO')

  const hold = structuredClone(base)
  hold.window.observation_days = 2
  hold.external_metrics.japanese_search_impressions = null
  hold.signals.search_visibility = 'unknown'
  hold.signals.usage = 'unknown'
  assert(evaluate(contract, hold).decision === 'HOLD', 'HOLD fixture did not produce HOLD')

  const pivot = structuredClone(base)
  pivot.operational_metrics.critical_locale_failure = true
  assert(evaluate(contract, pivot).decision === 'PIVOT', 'PIVOT fixture did not produce PIVOT')

  console.log('L2 localization evaluation self-test passed: GO, HOLD, and PIVOT fixtures verified.')
}

const contract = readJson(contractPath)

if (process.argv.includes('--self-test')) {
  runSelfTest(contract)
  process.exit(0)
}

const evidence = readJson(evidencePath)
const evaluation = evaluate(contract, evidence)
const repositoryMetrics = deriveRepositoryMetrics()
const result = {
  phase: contract.phase,
  decision: evaluation.decision,
  reasons: evaluation.reasons,
  observation: evaluation.observation,
  evidence_completeness: evaluation.evidence_completeness,
  repository_metrics: repositoryMetrics,
  third_language_authorized: false,
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(result, null, 2))
} else {
  console.log(`L2 Localization Evaluation Gate: ${result.decision}`)
  console.log(`Observation: ${result.observation.days}/${result.observation.minimum_days} days`)
  console.log(`Repository metrics: ${JSON.stringify(result.repository_metrics)}`)
  for (const reason of result.reasons) console.log(`- ${reason}`)
  console.log('Third-language authorization: false')
}

const expectArg = process.argv.find((arg) => arg.startsWith('--expect='))
if (expectArg) {
  const expected = expectArg.slice('--expect='.length)
  assert(result.decision === expected, `expected decision ${expected}, got ${result.decision}`)
}
