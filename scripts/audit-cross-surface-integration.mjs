import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { auditPublicNavigationDiscovery } from './audit-public-navigation-discovery.mjs'
import {
  canonicalizeExplorerQuery,
  parseExplorerQuery,
} from './lib/explorer-query-contract.mjs'

const root = process.cwd()
const origin = 'https://hei.badjoke-lab.com'
const defaultOutDir = path.join(root, 'out')
const defaultContractPath = path.join(root, 'config', 'cross-surface-integration-contract.json')

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function readJson(filePath) {
  assert(fs.existsSync(filePath), `missing ${filePath}`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function readText(filePath) {
  assert(fs.existsSync(filePath), `missing ${filePath}`)
  return fs.readFileSync(filePath, 'utf8')
}

function decodeHref(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function extractHrefs(html) {
  return [...html.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi)].map((match) => decodeHref(match[1]))
}

function internalUrl(href) {
  try {
    const url = new URL(href, origin)
    return url.origin === origin ? url : null
  } catch {
    return null
  }
}

function normalizeRoute(pathname) {
  if (pathname === '/') return '/'
  return `${pathname.replace(/\/+$/, '')}/`
}

function routeOutputFile(route, outDir) {
  if (route === '/') return path.join(outDir, 'index.html')
  return path.join(outDir, route.replace(/^\/+|\/+$/g, ''), 'index.html')
}

function allNavigationSurfaces(navigationConfig) {
  return [...new Set(Object.values(navigationConfig.layers).flat())]
}

function explorerLinks(html) {
  return extractHrefs(html)
    .map(internalUrl)
    .filter(Boolean)
    .filter((url) => normalizeRoute(url.pathname) === '/explore/')
}

function exchangeDossierLinks(html) {
  return extractHrefs(html)
    .map(internalUrl)
    .filter(Boolean)
    .filter((url) => /^\/exchange\/[^/]+\/?$/.test(url.pathname))
}

function queryKeySet(url) {
  return new Set([...url.searchParams.keys()].filter((key) => key !== 'view'))
}

function hasAllKeys(url, keys) {
  return keys.every((key) => url.searchParams.has(key))
}

function validateExplorerHref(url) {
  const findings = []
  if (!url.searchParams.has('view')) {
    findings.push({ type: 'explorer_view_not_explicit', href: `${url.pathname}${url.search}` })
    return findings
  }

  const originalQuery = url.searchParams.toString()
  const canonicalQuery = canonicalizeExplorerQuery(url.searchParams)
  if (originalQuery !== canonicalQuery) {
    findings.push({
      type: 'noncanonical_explorer_query',
      href: `${url.pathname}${url.search}`,
      canonical_query: canonicalQuery,
    })
  }

  const state = parseExplorerQuery(url.searchParams)
  if (!state.view) findings.push({ type: 'explorer_query_missing_parsed_view', href: `${url.pathname}${url.search}` })
  return findings
}

function auditExplorerSource(route, html, requirements) {
  const findings = []
  const links = explorerLinks(html)

  if (links.length === 0) {
    findings.push({ type: 'explorer_links_missing', route })
    return findings
  }

  for (const url of links) {
    for (const finding of validateExplorerHref(url)) findings.push({ ...finding, route })
  }

  const parsed = links.map((url) => ({ url, state: parseExplorerQuery(url.searchParams) }))
  for (const requiredView of requirements.required_views ?? []) {
    if (!parsed.some(({ state }) => state.view === requiredView)) {
      findings.push({ type: 'required_explorer_view_missing', route, view: requiredView })
    }
  }

  const entityLinks = parsed.filter(({ state }) => state.view === 'entities').map(({ url }) => url)
  const eventLinks = parsed.filter(({ state }) => state.view === 'events').map(({ url }) => url)
  const entityKeys = new Set(entityLinks.flatMap((url) => [...queryKeySet(url)]))
  const eventKeys = new Set(eventLinks.flatMap((url) => [...queryKeySet(url)]))

  for (const key of requirements.required_entity_keys ?? []) {
    if (!entityKeys.has(key)) findings.push({ type: 'required_entity_query_key_missing', route, key })
  }
  for (const key of requirements.required_event_keys ?? []) {
    if (!eventKeys.has(key)) findings.push({ type: 'required_event_query_key_missing', route, key })
  }

  for (const keys of requirements.required_compounds ?? []) {
    if (!entityLinks.some((url) => hasAllKeys(url, keys))) {
      findings.push({ type: 'required_compound_query_missing', route, keys })
    }
  }
  for (const keys of requirements.required_ranges ?? []) {
    if (!entityLinks.some((url) => hasAllKeys(url, keys))) {
      findings.push({ type: 'required_range_query_missing', route, keys })
    }
  }

  return findings
}

function auditBrokenCoreLinks(htmlByRoute, surfaces, outDir) {
  const findings = []
  const coreSet = new Set(surfaces)

  for (const [from, html] of htmlByRoute.entries()) {
    for (const href of extractHrefs(html)) {
      const url = internalUrl(href)
      if (!url) continue
      const route = normalizeRoute(url.pathname)
      const isCore = coreSet.has(route)
      const isDossier = /^\/exchange\/[^/]+\/$/.test(route)
      if (!isCore && !isDossier) continue

      if (!fs.existsSync(routeOutputFile(route, outDir))) {
        findings.push({ type: 'broken_core_cross_link', from, to: route, href })
      }
    }
  }

  return findings
}

function auditDossierReachability(contract, htmlByRoute, rootDir) {
  const findings = []

  for (const route of contract.dossier_sources) {
    const html = htmlByRoute.get(route)
    if (!html) {
      findings.push({ type: 'dossier_source_output_missing', route })
      continue
    }

    if (exchangeDossierLinks(html).length === 0) {
      const emptyMonthly = route === '/monthly/' && html.includes('No qualifying reviewed events recorded')
      if (!emptyMonthly) findings.push({ type: 'dossier_link_missing', route })
    }
  }

  for (const relativePath of contract.explorer_source_files) {
    const source = readText(path.join(rootDir, relativePath))
    if (!source.includes('/exchange/${')) {
      findings.push({ type: 'explorer_dossier_source_contract_missing', file: relativePath })
    }
  }

  return findings
}

function auditReviewedPublicBoundary(contract, htmlByRoute) {
  const findings = []
  const forbiddenHrefParts = [
    '/data-staging/',
    '/watchlists/',
    '/monitoring/',
    'candidate_class=',
    'unreviewed_candidate=',
  ]

  for (const route of contract.reviewed_public_only_sources) {
    const html = htmlByRoute.get(route)
    if (!html) continue
    for (const href of extractHrefs(html)) {
      if (forbiddenHrefParts.some((part) => href.includes(part))) {
        findings.push({ type: 'internal_or_unreviewed_link_exposed', route, href })
      }
    }
  }

  return findings
}

function auditChangeLayerSourceContracts(rootDir) {
  const findings = []
  const contracts = [
    {
      file: 'src/app/updates/page.tsx',
      markers: ["href=\"/explore/?view=events\"", '/exchange/${entity.slug}'],
    },
    {
      file: 'src/app/incidents/page.tsx',
      markers: ["params.set('view', 'events')", "params.set('event_type', eventType)", '/exchange/${entity.slug}'],
    },
    {
      file: 'src/app/monthly/page.tsx',
      markers: [
        "params.set('view', 'events')",
        "params.set('date_from', periodStart)",
        "params.set('date_to', periodEnd)",
        "params.set('event_type', eventType)",
        "params.set('impact_level', impact)",
        '/exchange/${entity.slug}',
      ],
    },
  ]

  for (const contract of contracts) {
    const source = readText(path.join(rootDir, contract.file))
    for (const marker of contract.markers) {
      if (!source.includes(marker)) findings.push({ type: 'change_layer_source_contract_missing', file: contract.file, marker })
    }
  }

  return findings
}

export function auditCrossSurfaceIntegration(
  outDir = defaultOutDir,
  contractPath = defaultContractPath,
  rootDir = root,
) {
  const contract = readJson(contractPath)
  assert(contract.version === 1, 'unsupported cross-surface integration contract version')

  const navigationPath = path.join(rootDir, contract.navigation_contract)
  const navigationConfig = readJson(navigationPath)
  const surfaces = allNavigationSurfaces(navigationConfig)
  const findings = []
  const htmlByRoute = new Map()

  const navigationResult = auditPublicNavigationDiscovery(outDir, navigationPath)
  for (const finding of navigationResult.findings) {
    findings.push({ type: 'navigation_contract_finding', finding })
  }

  for (const route of surfaces) {
    const outputFile = routeOutputFile(route, outDir)
    if (!fs.existsSync(outputFile)) {
      findings.push({ type: 'core_surface_output_missing', route })
      continue
    }
    htmlByRoute.set(route, fs.readFileSync(outputFile, 'utf8'))
  }

  for (const [route, requirements] of Object.entries(contract.explorer_link_sources)) {
    const html = htmlByRoute.get(route)
    if (!html) {
      findings.push({ type: 'explorer_link_source_output_missing', route })
      continue
    }
    findings.push(...auditExplorerSource(route, html, requirements))
  }

  findings.push(...auditBrokenCoreLinks(htmlByRoute, surfaces, outDir))
  findings.push(...auditDossierReachability(contract, htmlByRoute, rootDir))
  findings.push(...auditReviewedPublicBoundary(contract, htmlByRoute))
  findings.push(...auditChangeLayerSourceContracts(rootDir))

  return {
    coreSurfaces: surfaces.length,
    navigationFindings: navigationResult.findings.length,
    explorerSourceRoutes: Object.keys(contract.explorer_link_sources).length,
    dossierSourceRoutes: contract.dossier_sources.length,
    findings,
  }
}

function runSelfTest() {
  const canonical = new URL('https://hei.badjoke-lab.com/explore/?view=entities&status=dead&status=merged&archive_available=true')
  const canonicalFindings = validateExplorerHref(canonical)
  assert(canonicalFindings.length === 0, `canonical query unexpectedly failed: ${JSON.stringify(canonicalFindings)}`)

  const malformed = new URL('https://hei.badjoke-lab.com/explore/?status=dead&view=entities&unknown_key=x')
  const malformedFindings = validateExplorerHref(malformed)
  assert(malformedFindings.some((item) => item.type === 'noncanonical_explorer_query'), 'self-test did not detect noncanonical Explorer query')

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hei-g3-link-test-'))
  try {
    const route = '/about/'
    const target = routeOutputFile(route, tempDir)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, '<main>About</main>')
    const clean = auditBrokenCoreLinks(new Map([['/', '<a href="/about/">About</a>']]), ['/', '/about/'], tempDir)
    assert(clean.length === 0, `self-test clean core link failed: ${JSON.stringify(clean)}`)
    fs.rmSync(target)
    const broken = auditBrokenCoreLinks(new Map([['/', '<a href="/about/">About</a>']]), ['/', '/about/'], tempDir)
    assert(broken.some((item) => item.type === 'broken_core_cross_link'), 'self-test did not detect broken core cross-link')
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }

  console.log('Cross-surface integration audit self-test passed.')
}

if (process.argv.includes('--self-test')) {
  runSelfTest()
} else {
  const result = auditCrossSurfaceIntegration()
  console.log(`Cross-surface integration audit: ${result.coreSurfaces} core surfaces, ${result.explorerSourceRoutes} Explorer-link sources, ${result.dossierSourceRoutes} dossier-link sources.`)
  console.log(`Findings: ${result.findings.length}`)
  for (const finding of result.findings) console.log(JSON.stringify(finding))
  if (result.findings.length > 0) throw new Error(`cross-surface integration audit found ${result.findings.length} findings`)
  console.log('Cross-surface integration audit passed with 0 findings.')
}
