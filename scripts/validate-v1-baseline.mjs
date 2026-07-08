import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'
import { loadReviewedBundles, mergeRecords } from './lib/reviewed-bundle-aggregation.mjs'

const root = process.cwd()
const contract = JSON.parse(fs.readFileSync(path.join(root, 'config/v1-baseline-contract.json'), 'utf8'))
const findings = []
const add = (category, type, detail = {}) => findings.push({ category, type, ...detail })
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'))
const readText = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const sameSet = (a, b) => JSON.stringify([...new Set(a)].sort()) === JSON.stringify([...new Set(b)].sort())
const sameOrder = (a, b) => JSON.stringify(a) === JSON.stringify(b)

function deriveCounts() {
  const entities = readJson('data/entities.json')
  const events = readJson('data/events.json')
  const evidence = readJson('data/evidence.json')
  const { all: bundles, newEntityBundles } = loadReviewedBundles(root, entities)
  const corrected = applyReviewedEntityCorrections(entities, bundles)
  return {
    entities: corrected.length + newEntityBundles.length,
    events: mergeRecords(events, bundles, 'events', 'event').length,
    evidence: mergeRecords(evidence, bundles, 'evidence', 'evidence').length,
  }
}

function checkBaselineSha() {
  try {
    const mergeBase = execFileSync('git', ['merge-base', 'HEAD', contract.baseline_main_sha], { cwd: root, encoding: 'utf8' }).trim()
    if (mergeBase !== contract.baseline_main_sha) add('baseline_identity', 'baseline_sha_not_ancestor', { mergeBase })
  } catch (error) {
    add('baseline_identity', 'baseline_sha_not_resolvable', { detail: error.message })
  }
}

function checkCounts() {
  const actual = deriveCounts()
  for (const key of ['entities', 'events', 'evidence']) {
    if (actual[key] < contract.reviewed_counts[key]) {
      add('count_mismatch', 'reviewed_count_below_v1_baseline', { key, actual: actual[key], baseline: contract.reviewed_counts[key] })
    }
  }
  return actual
}

function checkGeneratedPublic() {
  const version = readJson('public/version.json')
  const manifest = readJson('public/data/manifest.json')
  const feed = readJson('public/feeds/updates.json')
  if (version.schema_version !== contract.schema_versions.machine_schema_version) add('schema_mismatch', 'machine_schema_version_mismatch')
  if (version.data?.data_schema_version !== contract.schema_versions.data_schema_version) add('schema_mismatch', 'data_schema_version_mismatch')

  const currentRoutes = manifest.main_routes ?? []
  for (const route of contract.public_route_contract.routes) {
    if (!currentRoutes.includes(route)) add('route_contract_mismatch', 'baseline_route_missing', { route })
  }
  if (new Set(currentRoutes).size !== currentRoutes.length) add('route_contract_mismatch', 'duplicate_current_routes')

  if ((feed.items ?? []).length < contract.reviewed_counts.reviewed_update_feed_items) {
    add('count_mismatch', 'reviewed_update_feed_below_v1_baseline', {
      actual: (feed.items ?? []).length,
      baseline: contract.reviewed_counts.reviewed_update_feed_items,
    })
  }
  for (const publicPath of contract.machine_readable_file_contract) {
    if (!fs.existsSync(path.join(root, 'public', publicPath.replace(/^\//, '')))) add('machine_file_contract', 'machine_file_missing', { path: publicPath })
  }
}

function checkSitemap() {
  const xml = readText('out/sitemap.xml')
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  if (urls.length < contract.public_route_contract.sitemap_url_count) {
    add('route_contract_mismatch', 'sitemap_url_count_below_v1_baseline', {
      actual: urls.length,
      baseline: contract.public_route_contract.sitemap_url_count,
    })
  }
  if (new Set(urls).size !== urls.length) add('route_contract_mismatch', 'sitemap_duplicate_urls')
  if (!contract.public_route_contract.explorer_query_variants_in_sitemap && urls.some((url) => new URL(url).search)) add('route_contract_mismatch', 'query_variant_in_sitemap')

  const origin = 'https://hei.badjoke-lab.com'
  for (const route of contract.public_route_contract.routes.filter((route) => !route.includes('{slug}'))) {
    const expectedUrl = `${origin}${route}`
    if (!urls.includes(expectedUrl)) add('route_contract_mismatch', 'baseline_sitemap_route_missing', { route, expectedUrl })
  }
}

function checkExplorerAndI18n() {
  const explorer = readJson('config/explorer-query-contract.json')
  const i18n = readJson('config/i18n-locales.json')
  if (explorer.version !== contract.schema_versions.explorer_query_contract_version) add('explorer_contract_mismatch', 'explorer_version_mismatch')
  if (explorer.route !== contract.public_route_contract.explorer_query_canonical) add('explorer_contract_mismatch', 'explorer_route_mismatch')
  const expected = contract.localization_foundation
  if (i18n.version !== contract.schema_versions.i18n_locale_contract_version) add('localization_mismatch', 'i18n_version_mismatch')
  for (const key of ['default_locale', 'fallback_locale']) if (i18n[key] !== expected[key]) add('localization_mismatch', `${key}_mismatch`)
  for (const key of ['supported_locales', 'public_locales', 'pilot_locales']) if (!sameSet(i18n[key], expected[key])) add('localization_mismatch', `${key}_mismatch`)

  if (expected.japanese_public_pilot_min_reviewed_entities !== 750) add('localization_mismatch', 'japanese_pilot_gate_mismatch', { actual: expected.japanese_public_pilot_min_reviewed_entities })
  if (expected.third_language_gate_min_reviewed_entities !== 1000) add('localization_mismatch', 'third_language_gate_mismatch', { actual: expected.third_language_gate_min_reviewed_entities })
  if (expected.third_language_preselected !== false) add('localization_mismatch', 'third_language_preselection_mismatch')
  if (expected.max_new_language_pilots_at_once !== 1) add('localization_mismatch', 'language_pilot_concurrency_mismatch', { actual: expected.max_new_language_pilots_at_once })
}

function checkSafetyAndReports() {
  const monitoring = contract.monitoring_operations_separation
  for (const relative of [monitoring.monitoring_runner, monitoring.canonical_guard]) {
    if (!fs.existsSync(path.join(root, relative))) add('safety_boundary_mismatch', 'monitoring_control_missing', { path: relative })
  }
  const agents = readText('AGENTS.md')
  if (!agents.includes('Monitoring and ingestion automation must not publish unreviewed candidates directly')) add('safety_boundary_mismatch', 'agents_monitoring_boundary_missing')
  for (const [key, expected] of [
    ['raw_monitoring_public', false],
    ['unreviewed_candidates_public', false],
    ['monitoring_may_directly_change_canonical', false],
    ['public_surfaces_reviewed_only', true],
  ]) {
    if (monitoring[key] !== expected) add('safety_boundary_mismatch', 'monitoring_boundary_contract_mismatch', { key })
  }
  for (const [item, reportPath] of Object.entries(contract.phase_g_completion_reports)) {
    if (!fs.existsSync(path.join(root, reportPath))) add('phase_g_completion', 'phase_g_report_missing', { item, path: reportPath })
    else if (!readText(reportPath).includes('PASS')) add('phase_g_completion', 'phase_g_pass_marker_missing', { item })
  }
}

function checkProductionAndRoadmap() {
  const production = readJson(contract.production_verification.verification_contract)
  const report = readText(contract.production_verification.verification_report)
  if (production.expected_commit !== contract.baseline_main_sha) add('production_baseline_mismatch', 'production_expected_commit_mismatch', { actual: production.expected_commit })
  if (contract.production_verification.baseline_expected_commit !== contract.baseline_main_sha) add('production_baseline_mismatch', 'baseline_production_sha_mismatch')
  if (!report.includes('Overall result:           PASS')) add('production_baseline_mismatch', 'production_pass_record_missing')

  const roadmap = readText('docs/HEI_V1_EXECUTION_ROADMAP.md')
  if (!roadmap.includes('G-7 v1.0 Baseline Checkpoint')) add('roadmap_mismatch', 'g7_checkpoint_missing')
  if (!roadmap.includes(contract.next_phase)) add('roadmap_mismatch', 'next_phase_missing')
  for (const item of contract.post_v1_priority_sequence) {
    if (!roadmap.includes(item)) add('roadmap_mismatch', 'post_v1_item_missing', { item })
  }

  for (const authority of [contract.data_growth_authority, contract.localization_authority]) {
    if (!authority || !fs.existsSync(path.join(root, authority))) add('roadmap_mismatch', 'post_v1_authority_missing', { authority })
  }
}

function checkDeferredAndPriorityOrder() {
  const expectedDeferred = ['Compare v1', 'Japanese public pilot', 'additional languages', 'Discovery Log trial', 'NL Filter Translator', 'API expansion']
  if (!sameSet(contract.known_deferred_items, expectedDeferred)) add('deferred_contract_mismatch', 'deferred_item_set_mismatch')

  const expectedOrder = [
    'Phase H — Compare v1',
    'D-750 Reviewed Entity Milestone',
    'L-1 Japanese Pilot',
    'L-2 Localization Evaluation Gate',
    'D-1000 Reviewed Entity Milestone',
    'Language Selection Gate',
    'Phase I — Discovery Log Trial',
  ]
  if (!sameOrder(contract.post_v1_priority_sequence, expectedOrder)) {
    add('priority_order_mismatch', 'post_v1_priority_sequence_mismatch', { actual: contract.post_v1_priority_sequence, expected: expectedOrder })
  }
}

checkBaselineSha()
const reviewedCounts = checkCounts()
checkGeneratedPublic()
checkSitemap()
checkExplorerAndI18n()
checkSafetyAndReports()
checkProductionAndRoadmap()
checkDeferredAndPriorityOrder()

const categories = [
  'baseline_identity',
  'count_mismatch',
  'schema_mismatch',
  'route_contract_mismatch',
  'machine_file_contract',
  'explorer_contract_mismatch',
  'localization_mismatch',
  'safety_boundary_mismatch',
  'phase_g_completion',
  'production_baseline_mismatch',
  'deferred_contract_mismatch',
  'priority_order_mismatch',
  'roadmap_mismatch',
]

console.log(`HEI v1 baseline validation: ${contract.baseline_id}`)
console.log(`Baseline SHA: ${contract.baseline_main_sha}`)
console.log(`Current reviewed counts: ${JSON.stringify(reviewedCounts)}`)
console.log(`Baseline routes=${contract.public_route_contract.routes.length}, baseline sitemap=${contract.public_route_contract.sitemap_url_count}, machine_files=${contract.machine_readable_file_contract.length}, deferred=${contract.known_deferred_items.length}`)
console.log(`Post-v1 sequence=${contract.post_v1_priority_sequence.join(' -> ')}`)
console.log(`Categories: ${JSON.stringify(Object.fromEntries(categories.map((category) => [category, findings.filter((item) => item.category === category).length])))}`)
for (const item of findings) console.log(JSON.stringify(item))
if (findings.length > 0) throw new Error(`v1 baseline validation found ${findings.length} findings`)
console.log('HEI v1 baseline validation passed with 0 findings.')
