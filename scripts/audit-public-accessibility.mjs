import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const root = process.cwd()
const defaultOutDir = path.join(root, 'out')

const CORE_ROUTES = [
  '/',
  '/dead/',
  '/active/',
  '/explore/',
  '/stats/',
  '/quality/',
  '/updates/',
  '/incidents/',
  '/monthly/',
  '/methodology/',
  '/about/',
  '/donate/',
]

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function stripTags(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

function attr(tag, name) {
  return tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1] ?? null
}

function routeOutputFile(route, outDir) {
  if (route === '/') return path.join(outDir, 'index.html')
  return path.join(outDir, route.replace(/^\/+|\/+$/g, ''), 'index.html')
}

function elementMatches(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>[\\s\\S]*?<\\/${tagName}>`, 'gi'))].map((match) => match[0])
}

function openingTags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))].map((match) => match[0])
}

function hasAccessibleElementText(element) {
  const opening = element.match(/^<[^>]+>/)?.[0] ?? ''
  if (attr(opening, 'aria-label')) return true
  if (attr(opening, 'aria-labelledby')) return true
  if (attr(opening, 'title')) return true
  const img = element.match(/<img\b[^>]*>/i)?.[0]
  if (img && attr(img, 'alt')) return true
  return stripTags(element).length > 0
}

function controlHasName(html, tag, index) {
  const ariaLabel = attr(tag, 'aria-label')
  const ariaLabelledBy = attr(tag, 'aria-labelledby')
  const title = attr(tag, 'title')
  if (ariaLabel || ariaLabelledBy || title) return true

  const id = attr(tag, 'id')
  if (id) {
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const labelFor = new RegExp(`<label\\b[^>]*\\bfor=["']${escaped}["'][^>]*>`, 'i')
    if (labelFor.test(html)) return true
  }

  const before = html.slice(0, index)
  const lastOpen = before.lastIndexOf('<label')
  const lastClose = before.lastIndexOf('</label>')
  return lastOpen > lastClose
}

function findDuplicateIds(html) {
  const ids = openingTags(html, '[a-zA-Z][a-zA-Z0-9:-]*')
    .map((tag) => attr(tag, 'id'))
    .filter(Boolean)
  const seen = new Set()
  const duplicates = new Set()
  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id)
    seen.add(id)
  }
  return [...duplicates].sort()
}

function auditHtml(route, html) {
  const findings = []
  const add = (severity, type, detail = '') => findings.push({ severity, route, type, detail })

  if (!/<html\b[^>]*\blang=["'][^"']+["']/i.test(html)) add('high', 'missing_document_language')

  const mainCount = openingTags(html, 'main').length
  if (mainCount !== 1) add('high', 'main_landmark_count', String(mainCount))

  const navCount = openingTags(html, 'nav').length
  if (navCount < 1) add('medium', 'missing_navigation_landmark')

  if (!/<h[1-6]\b[^>]*>/i.test(html)) add('high', 'missing_heading')

  for (const img of openingTags(html, 'img')) {
    if (attr(img, 'alt') === null) add('high', 'image_missing_alt', img.slice(0, 160))
  }

  for (const button of elementMatches(html, 'button')) {
    if (!hasAccessibleElementText(button)) add('high', 'button_missing_accessible_name', button.slice(0, 180))
  }

  for (const link of elementMatches(html, 'a')) {
    const opening = link.match(/^<a\b[^>]*>/i)?.[0] ?? ''
    const href = attr(opening, 'href')
    if (!href) continue
    if (!hasAccessibleElementText(link)) add('high', 'link_missing_accessible_name', opening.slice(0, 180))
  }

  const controls = [...html.matchAll(/<(input|select|textarea)\b[^>]*>/gi)]
  for (const match of controls) {
    const tag = match[0]
    const type = attr(tag, 'type')
    if (type === 'hidden') continue
    if (!controlHasName(html, tag, match.index ?? 0)) {
      add('high', 'form_control_missing_accessible_name', tag.slice(0, 180))
    }
  }

  for (const table of elementMatches(html, 'table')) {
    if (!/<th\b[^>]*>/i.test(table)) add('high', 'table_missing_header_cells')
  }

  const duplicateIds = findDuplicateIds(html)
  if (duplicateIds.length > 0) add('high', 'duplicate_static_ids', duplicateIds.join(','))

  return findings
}

function readRequired(filePath) {
  assert(fs.existsSync(filePath), `missing ${filePath}`)
  return fs.readFileSync(filePath, 'utf8')
}

function auditSourceContracts(rootDir = root) {
  const findings = []
  const add = (severity, type, detail = '') => findings.push({ severity, route: 'source-contract', type, detail })

  const globals = readRequired(path.join(rootDir, 'src', 'app', 'globals.css'))
  const explorerCss = readRequired(path.join(rootDir, 'src', 'components', 'explorer', 'entity-explorer-client.module.css'))
  const entityExplorer = readRequired(path.join(rootDir, 'src', 'components', 'explorer', 'entity-explorer-client.tsx'))
  const eventExplorer = readRequired(path.join(rootDir, 'src', 'components', 'explorer', 'event-explorer-panel.tsx'))
  const layout = readRequired(path.join(rootDir, 'src', 'app', 'layout.tsx'))

  if (!globals.includes(':focus-visible')) add('high', 'global_focus_visible_contract_missing')
  if (!explorerCss.includes(':focus-visible')) add('high', 'explorer_focus_visible_contract_missing')
  if (!explorerCss.includes('@media(max-width:1023px)')) add('medium', 'explorer_tablet_breakpoint_missing')
  if (!explorerCss.includes('@media(max-width:720px)')) add('high', 'explorer_mobile_breakpoint_missing')

  for (const marker of [
    'aria-label="Explorer views"',
    'aria-label="Search reviewed entities"',
    'aria-label="Archive availability"',
    'aria-label="Sort entities"',
    'aria-label="Country or origin values"',
    'type="checkbox"',
    'type="date"',
    'type="button"',
    '<details',
    '<summary',
  ]) {
    if (!entityExplorer.includes(marker)) add('high', 'entity_explorer_interaction_marker_missing', marker)
  }

  for (const marker of [
    'aria-label="Search reviewed events"',
    'aria-label="Sort events"',
    'type="checkbox"',
    'type="date"',
    'type="button"',
  ]) {
    if (!eventExplorer.includes(marker)) add('high', 'event_explorer_interaction_marker_missing', marker)
  }

  if (!layout.includes('<nav')) add('high', 'global_navigation_landmark_source_missing')
  if (!layout.includes('aria-label="Primary navigation"')) add('medium', 'primary_navigation_name_missing')

  const statusLabelSources = [
    path.join(rootDir, 'src', 'lib', 'utils', 'status-meta.ts'),
    path.join(rootDir, 'src', 'i18n', 'locales', 'en', 'enums.json'),
  ]
  for (const filePath of statusLabelSources) {
    const content = readRequired(filePath)
    if (!content.includes('active') || !content.includes('dead')) add('high', 'text_status_labels_missing', path.relative(rootDir, filePath))
  }

  return findings
}

export function auditPublicAccessibility(outDir = defaultOutDir, rootDir = root) {
  const findings = []
  const routes = [...CORE_ROUTES]

  const entitiesFile = path.join(outDir, 'data', 'entities.json')
  if (fs.existsSync(entitiesFile)) {
    const publicEntities = JSON.parse(fs.readFileSync(entitiesFile, 'utf8'))
    const slug = publicEntities.records?.[0]?.slug
    if (slug) routes.push(`/exchange/${slug}/`)
  }

  for (const route of routes) {
    const filePath = routeOutputFile(route, outDir)
    assert(fs.existsSync(filePath), `missing generated route output: ${route}`)
    findings.push(...auditHtml(route, fs.readFileSync(filePath, 'utf8')))
  }

  findings.push(...auditSourceContracts(rootDir))

  return {
    routeCount: routes.length,
    findings,
    critical: findings.filter((item) => item.severity === 'critical'),
    high: findings.filter((item) => item.severity === 'high'),
    medium: findings.filter((item) => item.severity === 'medium'),
    low: findings.filter((item) => item.severity === 'low'),
  }
}

function writeFixture(rootDir, relativePath, content) {
  const filePath = path.join(rootDir, relativePath)
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content)
}

function runSelfTest() {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hei-a11y-root-'))
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hei-a11y-out-'))

  try {
    const cleanHtml = '<!doctype html><html lang="en"><body><nav aria-label="Primary navigation"><a href="/">Home</a></nav><main><h2>Page</h2><label>Query<input type="text"></label><button type="button">Run</button><table><thead><tr><th>Name</th></tr></thead><tbody><tr><td>A</td></tr></tbody></table></main></body></html>'
    for (const route of CORE_ROUTES) {
      const filePath = routeOutputFile(route, outDir)
      fs.mkdirSync(path.dirname(filePath), { recursive: true })
      fs.writeFileSync(filePath, cleanHtml)
    }
    fs.mkdirSync(path.join(outDir, 'data'), { recursive: true })
    fs.writeFileSync(path.join(outDir, 'data', 'entities.json'), JSON.stringify({ records: [] }))

    writeFixture(fixtureRoot, 'src/app/globals.css', 'a:focus-visible{outline:2px solid} .chip{display:inline-flex}')
    writeFixture(fixtureRoot, 'src/components/explorer/entity-explorer-client.module.css', '.viewTab:focus-visible{outline:2px solid}@media(max-width:1023px){}@media(max-width:720px){}')
    writeFixture(fixtureRoot, 'src/components/explorer/entity-explorer-client.tsx', '<nav aria-label="Explorer views"></nav><input aria-label="Search reviewed entities"/><select aria-label="Archive availability"></select><select aria-label="Sort entities"></select><select aria-label="Country or origin values"></select><input type="checkbox"/><input type="date"/><button type="button"></button><details><summary>Filter</summary></details>')
    writeFixture(fixtureRoot, 'src/components/explorer/event-explorer-panel.tsx', '<input aria-label="Search reviewed events"/><select aria-label="Sort events"></select><input type="checkbox"/><input type="date"/><button type="button"></button>')
    writeFixture(fixtureRoot, 'src/app/layout.tsx', '<nav aria-label="Primary navigation"></nav>')
    writeFixture(fixtureRoot, 'src/lib/utils/status-meta.ts', 'active dead')
    writeFixture(fixtureRoot, 'src/i18n/locales/en/enums.json', '{"status.active":"Active","status.dead":"Dead"}')

    const clean = auditPublicAccessibility(outDir, fixtureRoot)
    assert(clean.high.length === 0, `self-test clean fixture has high findings: ${JSON.stringify(clean.high)}`)

    const brokenHome = '<!doctype html><html><body><main><button></button><img src="x.png"><input type="text"><table><tr><td>x</td></tr></table><div id="dup"></div><span id="dup"></span></main></body></html>'
    fs.writeFileSync(path.join(outDir, 'index.html'), brokenHome)
    const broken = auditPublicAccessibility(outDir, fixtureRoot)
    const types = new Set(broken.findings.map((item) => item.type))
    for (const expected of ['missing_document_language', 'button_missing_accessible_name', 'image_missing_alt', 'form_control_missing_accessible_name', 'table_missing_header_cells', 'duplicate_static_ids']) {
      assert(types.has(expected), `self-test did not detect ${expected}`)
    }
  } finally {
    fs.rmSync(fixtureRoot, { recursive: true, force: true })
    fs.rmSync(outDir, { recursive: true, force: true })
  }

  console.log('Public accessibility audit self-test passed.')
}

if (process.argv.includes('--self-test')) {
  runSelfTest()
} else {
  const result = auditPublicAccessibility()
  console.log(`Accessibility audit covered ${result.routeCount} generated routes.`)
  console.log(`Findings: critical=${result.critical.length}, high=${result.high.length}, medium=${result.medium.length}, low=${result.low.length}`)
  for (const finding of result.findings) console.log(JSON.stringify(finding))
  if (result.critical.length > 0 || result.high.length > 0) {
    throw new Error(`accessibility audit blocked: ${result.critical.length} critical and ${result.high.length} high findings`)
  }
  console.log('Public accessibility audit passed with 0 critical and 0 high findings.')
}
