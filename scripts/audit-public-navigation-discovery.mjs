import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const root = process.cwd()
const defaultOutDir = path.join(root, 'out')
const defaultConfigPath = path.join(root, 'config', 'public-navigation-surfaces.json')
const origin = 'https://hei.badjoke-lab.com'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function readJson(filePath) {
  assert(fs.existsSync(filePath), `missing ${filePath}`)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function normalizeRoute(value) {
  const url = new URL(value, origin)
  if (url.origin !== origin) return null
  if (url.pathname === '/') return '/'
  return `${url.pathname.replace(/\/+$/, '')}/`
}

function routeOutputFile(route, outDir) {
  if (route === '/') return path.join(outDir, 'index.html')
  return path.join(outDir, route.replace(/^\/+|\/+$/g, ''), 'index.html')
}

function extractHrefs(html) {
  return [...html.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1].replace(/&amp;/g, '&'))
}

function internalRouteSet(html) {
  return new Set(extractHrefs(html).map(normalizeRoute).filter(Boolean))
}

function extractFirstBlock(html, regex, label) {
  const match = html.match(regex)
  assert(match, `missing ${label} block`)
  return match[0]
}

function headerRoutes(html) {
  const nav = extractFirstBlock(html, /<nav\b[^>]*class=["'][^"']*\bnav\b[^"']*["'][^>]*>[\s\S]*?<\/nav>/i, 'header nav')
  return internalRouteSet(nav)
}

function footerRoutes(html) {
  const footer = extractFirstBlock(html, /<footer\b[^>]*class=["'][^"']*\bfooter\b[^"']*["'][^>]*>[\s\S]*?<\/footer>/i, 'footer')
  return internalRouteSet(footer)
}

function contextualRoutes(html) {
  const routes = new Set()
  const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0] ?? ''
  for (const route of internalRouteSet(main)) routes.add(route)

  for (const match of html.matchAll(/<nav\b[^>]*aria-label=["']Related HEI surfaces["'][^>]*>[\s\S]*?<\/nav>/gi)) {
    for (const route of internalRouteSet(match[0])) routes.add(route)
  }

  return routes
}

function sorted(values) {
  return [...values].sort((a, b) => a.localeCompare(b))
}

function setDiff(actual, expected) {
  const actualSet = new Set(actual)
  const expectedSet = new Set(expected)
  return {
    missing: sorted([...expectedSet].filter((value) => !actualSet.has(value))),
    unexpected: sorted([...actualSet].filter((value) => !expectedSet.has(value))),
  }
}

function allSurfaceRoutes(config) {
  return [...new Set(Object.values(config.layers).flat())]
}

export function auditPublicNavigationDiscovery(
  outDir = defaultOutDir,
  configPath = defaultConfigPath,
) {
  const config = readJson(configPath)
  assert(config.version === 1, 'unsupported navigation contract version')

  const surfaces = allSurfaceRoutes(config)
  const findings = []
  const htmlByRoute = new Map()

  for (const route of surfaces) {
    const outputFile = routeOutputFile(route, outDir)
    if (!fs.existsSync(outputFile)) {
      findings.push({ type: 'missing_surface_output', route })
      continue
    }
    htmlByRoute.set(route, fs.readFileSync(outputFile, 'utf8'))
  }

  const homeHtml = htmlByRoute.get('/')
  if (!homeHtml) {
    findings.push({ type: 'missing_home_output' })
    return { surfaces: surfaces.length, findings }
  }

  const actualHeader = headerRoutes(homeHtml)
  const actualFooter = footerRoutes(homeHtml)
  const headerDiff = setDiff(actualHeader, config.header_routes)
  const footerDiff = setDiff(actualFooter, config.footer_routes)

  if (headerDiff.missing.length > 0 || headerDiff.unexpected.length > 0) {
    findings.push({ type: 'header_route_set_mismatch', ...headerDiff })
  }
  if (footerDiff.missing.length > 0 || footerDiff.unexpected.length > 0) {
    findings.push({ type: 'footer_route_set_mismatch', ...footerDiff })
  }
  if (actualHeader.size > config.header_internal_route_limit) {
    findings.push({
      type: 'header_route_limit_exceeded',
      actual: actualHeader.size,
      limit: config.header_internal_route_limit,
    })
  }

  const graph = new Map(surfaces.map((route) => [route, new Set()]))
  for (const route of actualHeader) graph.get('/')?.add(route)
  for (const route of actualFooter) graph.get('/')?.add(route)

  for (const [from, to] of config.contextual_edges) {
    const html = htmlByRoute.get(from)
    if (!html) {
      findings.push({ type: 'context_source_missing', from, to })
      continue
    }
    const routes = contextualRoutes(html)
    if (!routes.has(to)) {
      findings.push({ type: 'missing_contextual_edge', from, to })
    } else {
      graph.get(from)?.add(to)
    }
  }

  const reachable = new Set(['/'])
  const queue = ['/']
  while (queue.length > 0) {
    const current = queue.shift()
    for (const next of graph.get(current) ?? []) {
      if (!reachable.has(next)) {
        reachable.add(next)
        queue.push(next)
      }
    }
  }

  const unreachable = sorted(surfaces.filter((route) => !reachable.has(route)))
  if (unreachable.length > 0) findings.push({ type: 'unreachable_surfaces', routes: unreachable })

  const inbound = new Map(surfaces.map((route) => [route, 0]))
  for (const targets of graph.values()) {
    for (const target of targets) inbound.set(target, (inbound.get(target) ?? 0) + 1)
  }
  const orphans = sorted(surfaces.filter((route) => route !== '/' && (inbound.get(route) ?? 0) === 0))
  if (orphans.length > 0) findings.push({ type: 'orphan_surfaces', routes: orphans })

  const layerRouteCount = Object.fromEntries(
    Object.entries(config.layers).map(([layer, routes]) => [layer, routes.length]),
  )

  return {
    surfaces: surfaces.length,
    headerRoutes: actualHeader.size,
    footerRoutes: actualFooter.size,
    contextualEdges: config.contextual_edges.length,
    reachableSurfaces: reachable.size,
    layerRouteCount,
    findings,
  }
}

function pageHtml(header, footer, context = []) {
  const links = (routes) => routes.map((route) => `<a href="${route}">${route}</a>`).join('')
  return `<!doctype html><header><nav class="nav">${links(header)}</nav></header><nav aria-label="Related HEI surfaces">${links(context)}</nav><main></main><footer class="footer">${links(footer)}</footer>`
}

function runSelfTest() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hei-navigation-audit-'))
  const outDir = path.join(tempRoot, 'out')
  const configPath = path.join(tempRoot, 'navigation.json')
  const config = {
    version: 1,
    layers: {
      registry: ['/'],
      analysis: ['/stats/', '/quality/'],
      change: ['/updates/'],
      trust: [],
      support: [],
    },
    header_routes: ['/', '/stats/', '/updates/'],
    footer_routes: ['/quality/', '/stats/'],
    header_internal_route_limit: 3,
    contextual_edges: [['/stats/', '/quality/'], ['/quality/', '/stats/']],
  }

  try {
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(configPath, JSON.stringify(config))
    const surfaces = allSurfaceRoutes(config)
    for (const route of surfaces) {
      const filePath = routeOutputFile(route, outDir)
      fs.mkdirSync(path.dirname(filePath), { recursive: true })
      const context = route === '/stats/' ? ['/quality/'] : route === '/quality/' ? ['/stats/'] : []
      fs.writeFileSync(filePath, pageHtml(config.header_routes, config.footer_routes, context))
    }

    const clean = auditPublicNavigationDiscovery(outDir, configPath)
    assert(clean.findings.length === 0, `self-test expected 0 findings: ${JSON.stringify(clean.findings)}`)

    const statsFile = routeOutputFile('/stats/', outDir)
    fs.writeFileSync(statsFile, pageHtml(config.header_routes, config.footer_routes, []))
    const broken = auditPublicNavigationDiscovery(outDir, configPath)
    assert(broken.findings.some((item) => item.type === 'missing_contextual_edge'), 'self-test did not detect missing contextual edge')
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true })
  }

  console.log('Public navigation discovery audit self-test passed.')
}

if (process.argv.includes('--self-test')) {
  runSelfTest()
} else {
  const result = auditPublicNavigationDiscovery()
  console.log(`Public navigation audit: ${result.surfaces} surfaces, ${result.headerRoutes} header routes, ${result.footerRoutes} footer routes, ${result.contextualEdges} contextual edges.`)
  if (result.findings.length > 0) {
    for (const finding of result.findings) console.error(JSON.stringify(finding))
    throw new Error(`public navigation discovery audit found ${result.findings.length} findings`)
  }
  console.log('Public navigation discovery audit passed with 0 findings.')
}
