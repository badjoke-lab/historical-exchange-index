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
    if (actual[key] !== contract.reviewed_counts[key]) add('count_mismatch', 'reviewed_count_mismatch', { key, actual: actual[key], expected: contract.reviewed_counts[key] })
  }
  return actual
}

function checkGeneratedPublic() {
  const version = readJson('public/version.json')
  const manifest = readJson('public/data/manifest.json')
  const feed = readJson('public/feeds/updates.json')
  if (version.schema_version !== contract.schema_versions.machine_schema_version) add('schema_mismatch', 'machine_schema_version_mismatch')
  if (version.data?.data_schema_version !== contract.schema_versions.data_schema_version) add('schema_mismatch', 'data_schema_version_mismatch')
  if (!sameSet(manifest.main_routes ?? [], contract.public_route_contract.routes)) add('route_contract_mismatch', 'manifest_route_set_mismatch')
  if ((feed.items ?? []).length !== contract.reviewed_counts.reviewed_update_feed_items) add('count_mismatch', 'reviewed_update_feed_count_mismatch')
  for (const publicPath of contract.machine_readable_file_contract) {
    if (!fs.existsSync(path.join(root, 'public', publicPath.replace(/^\//, '')))) add('machine_file_contract', 'machine_file_missing', { path: publicPath })
  }
}

function checkSitemap() {
  const xml = readText('out/sitemap.xml')
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  if (urls.length !== contract.public_route_contract.sitemap_url_count) add('route_contract_mismatch', 'sitemap_url_count_mismatch', { actual: urls.length })
  if (new Set(urls).size !== urls.length) add('route_contract_mismatch', 'sitemap_duplicate_urls')
  if (!contract.public_route_contract.explorer_query_variants_in_sitemap && urls.some((url) => new URL(url).search)) add('route_contract_mismatch', 'query_variant_in_sitemap')
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
}

function checkSafetyAndReports() {
  const monitoring = contract.monitoring_operations_separation
  for (const relative of [monitoring.monitoring_runner, monitoring.canonical_guard]) if (!fs.existsSync(path.join(root, relative))) add('safety_boundary_mismatch', 'monitoring_control_missing', { path: relative })
  const agents = readText('AGENTS.md')
  if (!agents.includes('Monitoring and ingestion automation must not publish unreviewed candidates directly into canonical data.')) add('safety_boundary_mismatch', 'agents_monitoring_boundary_missing')
  for (const [key, expected] of [['raw_monitoring_public', false], ['unreviewed_candidates_public', false], ['monitoring_may_directly_change_canonical', false], ['public_surfaces_reviewed_only', true]]) {
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
}

function checkDeferred() {
  const expected = ['Compare v1', 'Japanese public pilot', 'additional languages', 'Discovery Log trial', 'NL Filter Translator', 'API expansion']
  if (!sameSet(contract.known_deferred_items, expected)) add('deferred_contract_mismatch', 'deferred_item_set_mismatch')
}

checkBaselineSha()
const reviewedCounts = checkCounts()
checkGeneratedPublic()
checkSitemap()
checkExplorerAndI18n()
checkSafetyAndReports()
checkProductionAndRoadmap()
checkDeferred()

const categories = ['baseline_identity', 'count_mismatch', 'schema_mismatch', 'route_contract_mismatch', 'machine_file_contract', 'explorer_contract_mismatch', 'localization_mismatch', 'safety_boundary_mismatch', 'phase_g_completion', 'production_baseline_mismatch', 'deferred_contract_mismatch', 'roadmap_mismatch']
console.log(`HEI v1 baseline validation: ${contract.baseline_id}`)
console.log(`Baseline SHA: ${contract.baseline_main_sha}`)
console.log(`Reviewed counts: ${JSON.stringify(reviewedCounts)}`)
console.log(`Routes=${contract.public_route_contract.routes.length}, sitemap=${contract.public_route_contract.sitemap_url_count}, machine_files=${contract.machine_readable_file_contract.length}, deferred=${contract.known_deferred_items.length}`)
console.log(`Categories: ${JSON.stringify(Object.fromEntries(categories.map((category) => [category, findings.filter((item) => item.category === category).length])))}`)
for (const item of findings) console.log(JSON.stringify(item))
if (findings.length > 0) throw new Error(`v1 baseline validation found ${findings.length} findings`)
console.log('HEI v1 baseline validation passed with 0 findings.')
