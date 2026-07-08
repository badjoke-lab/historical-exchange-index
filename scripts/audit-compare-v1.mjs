import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const outDir = path.join(root, 'out')
const origin = 'https://hei.badjoke-lab.com'
const reportDir = path.join(root, 'artifacts')
const reportPath = path.join(reportDir, 'compare-v1-audit.json')

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8')
}

function canonicalHrefs(html) {
  return [...html.matchAll(/<link\b[^>]*rel=["'][^"']*canonical[^"']*["'][^>]*>/gi)]
    .map((match) => match[0].match(/href=["']([^"']+)["']/i)?.[1])
    .filter(Boolean)
}

function sitemapLocations(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
}

function finding(type, detail = {}) {
  return { type, ...detail }
}

function runContractSelfTest(contract) {
  const reviewed = new Set(['ftx', 'mt-gox', 'binance', 'kraken', 'coinbase'])
  const pattern = new RegExp(contract.slug_syntax.pattern)
  const seen = new Set()
  const result = []
  const raw = [' FTX ', 'ftx', 'bad!', 'unknown', 'mt-gox', 'binance', 'kraken', 'coinbase']

  for (const value of raw) {
    const normalized = value.trim().toLowerCase()
    if (!normalized || [...normalized].length > contract.slug_syntax.max_code_points || !pattern.test(normalized)) continue
    if (!reviewed.has(normalized) || seen.has(normalized)) continue
    seen.add(normalized)
    result.push(normalized)
    if (result.length >= contract.selection_parameter.comparison_ready_max) break
  }

  const expected = ['ftx', 'mt-gox', 'binance', 'kraken']
  if (JSON.stringify(result) !== JSON.stringify(expected)) {
    throw new Error(`Compare state self-test failed: ${JSON.stringify(result)}`)
  }

  if (contract.route !== '/compare/') throw new Error('Compare route contract changed')
  if (contract.selection_parameter.key !== 'exchange') throw new Error('Compare selection key changed')
  if (contract.selection_parameter.comparison_ready_min !== 2) throw new Error('Compare minimum changed')
  if (contract.selection_parameter.comparison_ready_max !== 4) throw new Error('Compare maximum changed')
  if (contract.selection_parameter.selection_order !== 'preserve_input_order') throw new Error('Compare selection ordering changed')
  if (contract.selection_parameter.reviewed_public_only !== true) throw new Error('Compare reviewed-public boundary missing')
}

export function auditCompareV1() {
  const contract = readJson('config/compare-v1-contract.json')
  const version = readJson('public/version.json')
  const manifest = readJson('public/data/manifest.json')
  const nav = readJson('config/public-navigation-surfaces.json')
  const llms = readText('public/llms.txt')
  const ai = readText('public/ai.txt')
  const sitemap = readText('out/sitemap.xml')
  const compareHtmlPath = path.join(outDir, 'compare', 'index.html')
  const exploreHtmlPath = path.join(outDir, 'explore', 'index.html')
  const compareHtml = fs.existsSync(compareHtmlPath) ? fs.readFileSync(compareHtmlPath, 'utf8') : ''
  const exploreHtml = fs.existsSync(exploreHtmlPath) ? fs.readFileSync(exploreHtmlPath, 'utf8') : ''
  const compareStateSource = readText('src/lib/compare/compare-state.ts')
  const compareClientSource = readText('src/components/compare/compare-client.tsx')
  const dossierContextSource = readText('src/components/navigation/exchange-compare-context-link.tsx')
  const findings = []

  try {
    runContractSelfTest(contract)
  } catch (error) {
    findings.push(finding('contract_self_test_failure', { message: error instanceof Error ? error.message : String(error) }))
  }

  if (!compareHtml) findings.push(finding('compare_output_missing'))
  if (!exploreHtml) findings.push(finding('explorer_output_missing'))

  if (compareHtml) {
    const canonicals = canonicalHrefs(compareHtml)
    if (canonicals.length !== 1 || canonicals[0] !== `${origin}/compare/`) {
      findings.push(finding('compare_canonical_mismatch', { canonicals }))
    }
    if (!compareHtml.includes('/explore/')) findings.push(finding('compare_to_explorer_edge_missing'))
    for (const forbidden of ['candidate_class', 'data-staging', 'watchlists/auto', 'private_notes']) {
      if (compareHtml.includes(forbidden)) findings.push(finding('compare_public_safety_leak', { marker: forbidden }))
    }
  }

  if (exploreHtml && !exploreHtml.includes('/compare/')) findings.push(finding('explorer_to_compare_edge_missing'))

  const locations = sitemapLocations(sitemap)
  const compareBase = `${origin}/compare/`
  if (locations.filter((url) => url === compareBase).length !== 1) {
    findings.push(finding('compare_sitemap_base_count_mismatch'))
  }
  if (locations.some((url) => new URL(url).pathname === '/compare/' && new URL(url).search)) {
    findings.push(finding('compare_query_variant_in_sitemap'))
  }

  if (version.routes?.compare !== '/compare/') findings.push(finding('version_compare_route_missing'))
  if (!manifest.main_routes?.includes('/compare/')) findings.push(finding('manifest_compare_route_missing'))
  if (!llms.includes('/compare/')) findings.push(finding('llms_compare_route_missing'))
  if (!ai.includes('/compare/')) findings.push(finding('ai_compare_route_missing'))

  if (!nav.layers?.research?.includes('/compare/')) findings.push(finding('navigation_research_layer_missing_compare'))
  if (!nav.header_routes?.includes('/compare/')) findings.push(finding('navigation_header_missing_compare'))
  if (!nav.footer_routes?.includes('/compare/')) findings.push(finding('navigation_footer_missing_compare'))

  for (const [from, to] of [['/explore/', '/compare/'], ['/compare/', '/explore/']]) {
    if (!nav.contextual_edges?.some((edge) => edge[0] === from && edge[1] === to)) {
      findings.push(finding('navigation_contextual_edge_missing', { from, to }))
    }
  }

  if (!compareStateSource.includes('COMPARE_MIN = 2') || !compareStateSource.includes('COMPARE_MAX = 4')) {
    findings.push(finding('compare_source_limit_contract_missing'))
  }
  if (!compareClientSource.includes('serializeCompareState(state)')) findings.push(finding('normalized_share_serialization_missing'))
  if (!compareClientSource.includes('navigator.clipboard.writeText')) findings.push(finding('share_clipboard_action_missing'))
  if (!dossierContextSource.includes('/compare/?exchange=')) findings.push(finding('dossier_compare_handoff_missing'))

  const report = {
    generated_at: new Date().toISOString(),
    contract_version: contract.version,
    finding_count: findings.length,
    findings,
  }
  fs.mkdirSync(reportDir, { recursive: true })
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
  return report
}

const contract = readJson('config/compare-v1-contract.json')
if (process.argv.includes('--self-test')) {
  runContractSelfTest(contract)
  console.log('Compare v1 contract self-test passed.')
} else {
  const report = auditCompareV1()
  console.log(`Compare v1 audit: ${report.finding_count} findings.`)
  if (report.finding_count > 0) {
    for (const item of report.findings) console.error(JSON.stringify(item))
    throw new Error(`Compare v1 audit found ${report.finding_count} findings`)
  }
  console.log('Compare v1 audit passed with 0 findings.')
}
