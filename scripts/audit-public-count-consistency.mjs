import fs from 'node:fs'
import path from 'node:path'
import { loadReviewedBundles, mergeRecords } from './lib/reviewed-bundle-aggregation.mjs'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'

const root = process.cwd()
const outDir = path.join(root, 'out')
const productionOrigin = process.env.HEI_PRODUCTION_ORIGIN || 'https://hei.badjoke-lab.com'
const reportJsonPath = path.join(root, 'docs', 'audits', 'hei-public-count-consistency-2026-06-18.json')
const reportMdPath = path.join(root, 'docs', 'audits', 'hei-public-count-consistency-2026-06-18.md')

function readJson(relativePath, fallback = []) {
  const filePath = path.join(root, relativePath)
  return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : fallback
}

function readText(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null
}

function countBy(items, field) {
  return items.reduce((out, item) => {
    const key = item[field] ?? 'unknown'
    out[key] = (out[key] ?? 0) + 1
    return out
  }, {})
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractNumberAfterLabel(text, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = text.match(new RegExp(`${escaped}\\s*([0-9][0-9,]*)`, 'i'))
  return match ? Number(match[1].replace(/,/g, '')) : null
}

function extractMeta(html, key, attribute = 'name') {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const patterns = [
    new RegExp(`<meta[^>]+${attribute}=["']${escaped}["'][^>]+content=["']([^"']*)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attribute}=["']${escaped}["'][^>]*>`, 'i'),
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) return match[1]
  }
  return null
}

function extractLink(html, rel, type = null) {
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0])
  return links
    .filter((tag) => new RegExp(`rel=["'][^"']*\\b${rel}\\b[^"']*["']`, 'i').test(tag))
    .filter((tag) => !type || new RegExp(`type=["']${type.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'i').test(tag))
    .map((tag) => tag.match(/href=["']([^"']+)["']/i)?.[1] ?? null)
    .filter(Boolean)
}

function extractJsonLd(html) {
  return [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => {
      try {
        return JSON.parse(match[1])
      } catch {
        return { parse_error: true, raw_prefix: match[1].slice(0, 200) }
      }
    })
}

function routeToBuildPath(route) {
  if (route === '/') return path.join(outDir, 'index.html')
  if (route.endsWith('.json') || route.endsWith('.txt') || route.endsWith('.xml')) {
    return path.join(outDir, route.replace(/^\//, ''))
  }
  return path.join(outDir, route.replace(/^\//, '').replace(/\/$/, ''), 'index.html')
}

function inspectHtml(html, labels = []) {
  if (html === null) return { exists: false }
  const text = stripHtml(html)
  return {
    exists: true,
    counts: Object.fromEntries(labels.map((label) => [label, extractNumberAfterLabel(text, label)])),
    contains_386: /\b386\b/.test(text),
    canonical: extractLink(html, 'canonical')[0] ?? null,
    alternate_json: extractLink(html, 'alternate', 'application/json'),
    alternate_text: extractLink(html, 'alternate', 'text/plain'),
    description: extractMeta(html, 'description'),
    og_title: extractMeta(html, 'og:title', 'property'),
    og_description: extractMeta(html, 'og:description', 'property'),
    og_url: extractMeta(html, 'og:url', 'property'),
    json_ld: extractJsonLd(html),
    text_prefix: text.slice(0, 500),
  }
}

function inspectJson(text) {
  if (text === null) return { exists: false }
  try {
    const parsed = JSON.parse(text)
    return { exists: true, valid_json: true, parsed }
  } catch (error) {
    return { exists: true, valid_json: false, error: error.message, text_prefix: text.slice(0, 300) }
  }
}

function listFilesRecursive(dir) {
  if (!fs.existsSync(dir)) return []
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...listFilesRecursive(fullPath))
    else files.push(fullPath)
  }
  return files
}

async function fetchRoute(route) {
  const url = `${productionOrigin}${route}`
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: {
        'user-agent': 'HEI-Public-Count-Audit/1.0',
        accept: '*/*',
      },
    })
    const body = await response.text()
    return {
      requested_url: url,
      final_url: response.url,
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(
        ['content-type', 'cache-control', 'cf-cache-status', 'age', 'etag', 'last-modified', 'location', 'x-robots-tag']
          .map((name) => [name, response.headers.get(name)])
          .filter(([, value]) => value !== null),
      ),
      body,
    }
  } catch (error) {
    return {
      requested_url: url,
      final_url: null,
      status: null,
      ok: false,
      headers: {},
      body: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

const canonicalEntities = readJson('data/entities.json')
const canonicalEvents = readJson('data/events.json')
const canonicalEvidence = readJson('data/evidence.json')
const { all: reviewedBundles, newEntityBundles } = loadReviewedBundles(root, canonicalEntities)
const entities = [
  ...applyReviewedEntityCorrections(canonicalEntities, reviewedBundles),
  ...newEntityBundles.map(({ bundle }) => bundle.entity),
]
const events = mergeRecords(canonicalEvents, reviewedBundles, 'events', 'event')
const evidence = mergeRecords(canonicalEvidence, reviewedBundles, 'evidence', 'evidence')
const deadStatuses = new Set(['dead', 'merged', 'acquired', 'rebranded'])
const activeStatuses = new Set(['active', 'limited', 'inactive'])
const expected = {
  total: entities.length,
  dead_side: entities.filter((item) => deadStatuses.has(item.status)).length,
  active_side: entities.filter((item) => activeStatuses.has(item.status)).length,
  events: events.length,
  evidence: evidence.length,
  status: countBy(entities, 'status'),
}

const routes = [
  '/',
  '/dead/',
  '/active/',
  '/stats/',
  `/exchange/${entities[0]?.slug ?? 'mt-gox'}/`,
  '/version.json',
  '/data/manifest.json',
  '/data/entities.json',
  '/data/events.json',
  '/data/evidence.json',
  '/llms.txt',
  '/ai.txt',
  '/sitemap.xml',
  '/robots.txt',
  '/index.html',
  '/all/',
  '/registry/',
  '/exchanges/',
]

const build = {}
for (const route of routes) {
  const filePath = routeToBuildPath(route)
  const text = readText(filePath)
  if (route.endsWith('.json')) build[route] = inspectJson(text)
  else if (route.endsWith('.txt') || route.endsWith('.xml')) {
    build[route] = {
      exists: text !== null,
      contains_386: text ? /\b386\b/.test(text) : false,
      text_prefix: text?.slice(0, 1000) ?? null,
      text,
    }
  } else {
    const labels = route === '/'
      ? ['Total records', 'Dead-side', 'Active-side']
      : route === '/dead/'
        ? ['Dead-side total']
        : route === '/active/'
          ? ['Active-side total']
          : route === '/stats/'
            ? ['Total entities', 'Dead-side', 'Active-side', 'Total events', 'Total evidence']
            : []
    build[route] = inspectHtml(text, labels)
  }
  build[route].build_path = path.relative(root, filePath)
}

const buildFiles = listFilesRecursive(outDir)
const build386Files = buildFiles
  .filter((filePath) => {
    const buffer = fs.readFileSync(filePath)
    if (buffer.includes(0)) return false
    return /\b386\b/.test(buffer.toString('utf8'))
  })
  .map((filePath) => path.relative(root, filePath))

const productionResponses = await Promise.all(routes.map((route) => fetchRoute(route)))
const production = {}
for (let index = 0; index < routes.length; index += 1) {
  const route = routes[index]
  const response = productionResponses[index]
  const contentType = response.headers['content-type'] ?? ''
  let inspection
  if (route.endsWith('.json') || contentType.includes('application/json')) inspection = inspectJson(response.body)
  else if (route.endsWith('.txt') || route.endsWith('.xml') || contentType.includes('text/plain') || contentType.includes('xml')) {
    inspection = {
      exists: response.body !== null,
      contains_386: response.body ? /\b386\b/.test(response.body) : false,
      text_prefix: response.body?.slice(0, 1000) ?? null,
      text: response.body,
    }
  } else {
    const labels = route === '/'
      ? ['Total records', 'Dead-side', 'Active-side']
      : route === '/dead/'
        ? ['Dead-side total']
        : route === '/active/'
          ? ['Active-side total']
          : route === '/stats/'
            ? ['Total entities', 'Dead-side', 'Active-side', 'Total events', 'Total evidence']
            : []
    inspection = inspectHtml(response.body, labels)
  }
  production[route] = {
    ...response,
    body: undefined,
    inspection,
  }
}

function pickVersionCounts(entry) {
  return entry?.parsed?.data?.record_counts ?? null
}
function pickManifestCounts(entry) {
  return entry?.parsed?.record_counts ?? null
}
function pickBreakdown(entry) {
  return entry?.parsed?.record_count_breakdown ?? entry?.parsed?.data?.record_count_breakdown ?? null
}

const checks = {
  expected_matches_requested_baseline:
    expected.total === 412 && expected.dead_side === 189 && expected.active_side === 223,
  build_home_counts_match:
    build['/']?.counts?.['Total records'] === expected.total
      && build['/']?.counts?.['Dead-side'] === expected.dead_side
      && build['/']?.counts?.['Active-side'] === expected.active_side,
  build_dead_count_matches: build['/dead/']?.counts?.['Dead-side total'] === expected.dead_side,
  build_active_count_matches: build['/active/']?.counts?.['Active-side total'] === expected.active_side,
  build_version_counts_match:
    pickVersionCounts(build['/version.json'])?.primary_records === expected.total
      && pickVersionCounts(build['/version.json'])?.events === expected.events
      && pickVersionCounts(build['/version.json'])?.evidence === expected.evidence,
  build_manifest_counts_match:
    pickManifestCounts(build['/data/manifest.json'])?.primary_records === expected.total
      && pickManifestCounts(build['/data/manifest.json'])?.events === expected.events
      && pickManifestCounts(build['/data/manifest.json'])?.evidence === expected.evidence,
  build_manifest_breakdown_matches:
    pickBreakdown(build['/data/manifest.json'])?.dead_side === expected.dead_side
      && pickBreakdown(build['/data/manifest.json'])?.active_side === expected.active_side,
  build_has_no_386: build386Files.length === 0,
  production_home_counts_match:
    production['/']?.inspection?.counts?.['Total records'] === expected.total
      && production['/']?.inspection?.counts?.['Dead-side'] === expected.dead_side
      && production['/']?.inspection?.counts?.['Active-side'] === expected.active_side,
  production_dead_count_matches:
    production['/dead/']?.inspection?.counts?.['Dead-side total'] === expected.dead_side,
  production_active_count_matches:
    production['/active/']?.inspection?.counts?.['Active-side total'] === expected.active_side,
  production_version_counts_match:
    pickVersionCounts(production['/version.json']?.inspection)?.primary_records === expected.total,
  production_manifest_counts_match:
    pickManifestCounts(production['/data/manifest.json']?.inspection)?.primary_records === expected.total,
  production_manifest_breakdown_matches:
    pickBreakdown(production['/data/manifest.json']?.inspection)?.dead_side === expected.dead_side
      && pickBreakdown(production['/data/manifest.json']?.inspection)?.active_side === expected.active_side,
  production_has_no_386: Object.values(production).every((entry) => !entry.inspection?.contains_386),
}

const report = {
  generated_at: new Date().toISOString(),
  repository: {
    commit: process.env.GITHUB_SHA ?? null,
    branch: process.env.GITHUB_REF_NAME ?? null,
  },
  production_origin: productionOrigin,
  expected,
  source_of_truth: {
    canonical_entities: 'data/entities.json plus reviewed record-bundle entity corrections and genuinely new bundle entities',
    canonical_events: 'data/events.json plus all reviewed bundle events, deduplicated by ID',
    canonical_evidence: 'data/evidence.json plus all reviewed bundle evidence, deduplicated by ID',
  },
  checks,
  build,
  build_files_containing_386: build386Files,
  production,
}

fs.mkdirSync(path.dirname(reportJsonPath), { recursive: true })
fs.writeFileSync(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

const failures = Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name)
const urlRows = routes.map((route) => {
  const entry = production[route]
  const counts = entry.inspection?.counts ? JSON.stringify(entry.inspection.counts) : ''
  return `| \`${route}\` | ${entry.status ?? 'ERR'} | ${entry.final_url ?? '—'} | ${entry.headers['cf-cache-status'] ?? '—'} | ${counts || '—'} | ${entry.inspection?.contains_386 ? 'YES' : 'no'} |`
}).join('\n')

const markdown = `# HEI public count consistency audit\n\nGenerated: ${report.generated_at}\n\n## Expected reviewed registry\n\n- Total records: **${expected.total}**\n- Dead-side: **${expected.dead_side}**\n- Active-side: **${expected.active_side}**\n- Events: **${expected.events}**\n- Evidence: **${expected.evidence}**\n\n## Check result\n\n${Object.entries(checks).map(([name, passed]) => `- ${passed ? 'PASS' : 'FAIL'} — \`${name}\``).join('\n')}\n\n## Production URLs\n\n| Route | HTTP | Final URL | CF cache | Extracted counts | Contains 386 |\n|---|---:|---|---|---|---|\n${urlRows}\n\n## Build files containing literal 386\n\n${build386Files.length ? build386Files.map((item) => `- \`${item}\``).join('\n') : '- None'}\n\n## Failures requiring remediation\n\n${failures.length ? failures.map((item) => `- \`${item}\``).join('\n') : '- None'}\n\n## Source of truth\n\n- Entities: ${report.source_of_truth.canonical_entities}\n- Events: ${report.source_of_truth.canonical_events}\n- Evidence: ${report.source_of_truth.canonical_evidence}\n`
fs.writeFileSync(reportMdPath, markdown, 'utf8')

console.log(markdown)
if (process.argv.includes('--strict') && failures.length > 0) process.exit(1)
