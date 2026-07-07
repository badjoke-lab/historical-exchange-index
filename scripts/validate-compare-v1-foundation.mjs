import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const contract = JSON.parse(fs.readFileSync(path.join(root, 'config/compare-v1-contract.json'), 'utf8'))
const findings = []
const add = (type, detail = {}) => findings.push({ type, ...detail })

function text(relativePath) {
  const target = path.join(root, relativePath)
  if (!fs.existsSync(target)) {
    add('required_path_missing', { path: relativePath })
    return ''
  }
  return fs.readFileSync(target, 'utf8')
}

if (contract.version !== 1) add('contract_version_mismatch')
if (contract.route !== '/compare/') add('route_mismatch')
if (contract.selection?.parameter !== 'exchange') add('parameter_mismatch')
if (contract.selection?.minimum_meaningful_selection !== 2) add('minimum_mismatch')
if (contract.selection?.maximum_selection !== 4) add('maximum_mismatch')
if (contract.selection?.order_semantics !== 'preserve_first_valid_url_order') add('order_semantics_mismatch')
if (contract.selection?.duplicate_semantics !== 'keep_first_occurrence') add('duplicate_semantics_mismatch')
if (contract.crawl_policy?.canonical_for_all_query_variants !== '/compare/') add('canonical_mismatch')
if (contract.crawl_policy?.query_variants_in_sitemap !== false) add('sitemap_policy_mismatch')
if (contract.data_authority?.reviewed_public_only !== true) add('reviewed_boundary_mismatch')
if (contract.lifespan?.current_clock_dependency !== false) add('lifespan_clock_mismatch')
if (contract.major_events?.maximum_per_entity !== 3) add('major_event_limit_mismatch')
if (contract.major_events?.generated_summary_allowed !== false) add('major_event_summary_policy_mismatch')

const expectedOrder = [
  'H-1 Compare contract and deterministic data view',
  'H-2 Compare route and UI',
  'H-3 Discovery and dossier handoff',
  'H-4 Final audit and production verification',
]
if (JSON.stringify(contract.implementation_order) !== JSON.stringify(expectedOrder)) {
  add('implementation_order_mismatch')
}

for (const requiredPath of [
  'docs/HEI_COMPARE_V1_SPEC.md',
  'src/lib/types/compare.ts',
  'src/lib/compare/compare-query.ts',
  'src/lib/compare/compare-core.ts',
  'src/lib/compare/build-compare-view.ts',
  'scripts/test-compare-v1-foundation.mjs',
]) {
  text(requiredPath)
}

const spec = text('docs/HEI_COMPARE_V1_SPEC.md')
for (const marker of ['/compare/', 'D-750 Reviewed Entity Milestone', 'H-1 Compare contract and deterministic data view', 'H-4 Final audit and production verification']) {
  if (!spec.includes(marker)) add('spec_marker_missing', { marker })
}

const querySource = text('src/lib/compare/compare-query.ts')
for (const marker of ['getAll(COMPARE_PARAMETER)', 'duplicateSlugs', 'omittedValidSlugs', 'URLSearchParams']) {
  if (!querySource.includes(marker)) add('query_marker_missing', { marker })
}

const coreSource = text('src/lib/compare/compare-core.ts')
if (coreSource.includes('Date.now(') || coreSource.includes('new Date()')) add('clock_dependency_found')
for (const marker of ['critical: 4', 'high: 3', 'medium: 2', 'low: 1', '.slice(0, 3)']) {
  if (!coreSource.includes(marker)) add('major_event_marker_missing', { marker })
}

const builderSource = text('src/lib/compare/build-compare-view.ts')
for (const loader of ['loadEntities', 'loadEvents', 'loadEvidence']) {
  if (!builderSource.includes(loader)) add('reviewed_loader_missing', { loader })
}

console.log(`Compare v1 foundation validation: route=${contract.route}, selection=${contract.selection.minimum_meaningful_selection}-${contract.selection.maximum_selection}, fields=${contract.comparison_fields.length}`)
for (const finding of findings) console.log(JSON.stringify(finding))
if (findings.length > 0) throw new Error(`Compare v1 foundation validation found ${findings.length} findings`)
console.log('Compare v1 foundation validation passed with 0 findings.')
