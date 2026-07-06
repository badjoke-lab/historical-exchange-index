import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const root = process.cwd()
const defaultOutDir = path.join(root, 'out')

const URL_STATUSES = [
  'live_verified',
  'live_unverified',
  'dead_domain',
  'redirected',
  'repurposed',
  'unsafe',
  'unknown',
]

const DEAD_SIDE = new Set(['dead', 'merged', 'acquired', 'rebranded'])

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

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function stripHtml(html) {
  return decodeHtml(html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim())
}

function hrefs(html) {
  return [...html.matchAll(/\bhref=["']([^"']+)["']/gi)].map((match) => decodeHtml(match[1]))
}

function normalizeUrl(value) {
  try {
    const url = new URL(value)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url
  } catch {
    return null
  }
}

function normalizeHost(host) {
  return host.toLowerCase().replace(/^www\./, '').replace(/\.$/, '')
}

function exactSet(actual, expected) {
  return JSON.stringify([...new Set(actual)].sort()) === JSON.stringify([...new Set(expected)].sort())
}

function policyContract(policy) {
  assert(policy.version === 1, 'URL display policy version must be 1')
  assert(Array.isArray(policy.clickable), 'policy clickable list missing')
  assert(Array.isArray(policy.plain_text), 'policy plain_text list missing')
  assert(Array.isArray(policy.archive_first), 'policy archive_first list missing')
  assert(exactSet([...policy.clickable, ...policy.plain_text], URL_STATUSES), 'clickable + plain_text must cover URL status enum exactly')
  assert(policy.clickable.every((value) => !policy.plain_text.includes(value)), 'clickable/plain_text policy groups overlap')
  assert(policy.archive_first.every((value) => policy.plain_text.includes(value)), 'archive_first must be a subset of plain_text')
  assert(policy.clickable.includes('live_verified') && policy.clickable.includes('live_unverified'), 'live URL statuses must be clickable policy values')
  for (const value of ['dead_domain', 'redirected', 'repurposed', 'unsafe', 'unknown']) {
    assert(policy.plain_text.includes(value), `${value} must be plain_text policy value`)
  }
}

function detailPath(outDir, slug) {
  return path.join(outDir, 'exchange', slug, 'index.html')
}

function auditDataAndDetails({ entities, outDir, policy }) {
  const findings = []
  const add = (severity, type, entity, detail = '') => findings.push({ severity, type, entity_id: entity.id, slug: entity.slug, url_status: entity.official_url_status, detail })
  const clickable = new Set(policy.clickable)
  const plainText = new Set(policy.plain_text)
  const archiveFirst = new Set(policy.archive_first)

  for (const entity of entities) {
    if (!URL_STATUSES.includes(entity.official_url_status)) {
      add('critical', 'unknown_url_status_value', entity, entity.official_url_status)
      continue
    }

    const originalUrl = entity.official_url_original
    const archivedUrl = entity.archived_url
    const originalParsed = originalUrl ? normalizeUrl(originalUrl) : null
    const archivedParsed = archivedUrl ? normalizeUrl(archivedUrl) : null

    if (originalUrl && !originalParsed) add('high', 'invalid_original_url', entity, originalUrl)
    if (archivedUrl && !archivedParsed) add('high', 'invalid_archive_url', entity, archivedUrl)

    if (originalParsed && entity.official_domain_original) {
      const host = normalizeHost(originalParsed.hostname)
      const expectedDomain = normalizeHost(entity.official_domain_original)
      if (host !== expectedDomain && !host.endsWith(`.${expectedDomain}`) && !expectedDomain.endsWith(`.${host}`)) {
        add('medium', 'original_url_domain_mismatch', entity, `${host} != ${expectedDomain}`)
      }
    }

    const filePath = detailPath(outDir, entity.slug)
    if (!fs.existsSync(filePath)) {
      add('critical', 'missing_detail_output', entity)
      continue
    }

    const html = fs.readFileSync(filePath, 'utf8')
    const pageHrefs = hrefs(html)
    const pageText = stripHtml(html)
    const originalLinked = Boolean(originalUrl && pageHrefs.includes(originalUrl))
    const archiveLinked = Boolean(archivedUrl && pageHrefs.includes(archivedUrl))

    if (clickable.has(entity.official_url_status)) {
      if (originalUrl && !originalLinked) add('medium', 'live_original_url_not_linked', entity, originalUrl)
    } else if (plainText.has(entity.official_url_status) && originalLinked) {
      const severity = entity.official_url_status === 'unsafe' || entity.official_url_status === 'repurposed' ? 'critical' : 'high'
      add(severity, 'non_clickable_original_url_linked', entity, originalUrl ?? '')
    }

    if (originalUrl && plainText.has(entity.official_url_status) && !pageText.includes(originalUrl)) {
      add('medium', 'historical_original_url_not_visible_as_text', entity, originalUrl)
    }

    if (archivedUrl && !archiveLinked) add('high', 'archive_url_not_linked', entity, archivedUrl)

    const shouldPreferArchive = DEAD_SIDE.has(entity.status) && Boolean(archivedUrl) && archiveFirst.has(entity.official_url_status)
    if (shouldPreferArchive && !pageText.includes('Use archived URL first for historical viewing.')) {
      add('high', 'archive_first_guidance_missing', entity)
    }

    if (!pageText.includes('URL status')) add('high', 'url_status_label_missing', entity)
  }

  return findings
}

function auditPublicExplanations(outDir) {
  const findings = []
  const methodology = stripHtml(readText(path.join(outDir, 'methodology', 'index.html')))
  const about = stripHtml(readText(path.join(outDir, 'about', 'index.html')))

  for (const value of URL_STATUSES) {
    if (!methodology.includes(value)) findings.push({ severity: 'high', type: 'methodology_url_status_missing', route: '/methodology/', detail: value })
  }

  if (!methodology.includes('old exchange domains are not always safe or authoritative today')) {
    findings.push({ severity: 'high', type: 'methodology_historical_domain_warning_missing', route: '/methodology/' })
  }
  if (!methodology.includes('may not always be clickable')) {
    findings.push({ severity: 'high', type: 'methodology_clickability_warning_missing', route: '/methodology/' })
  }
  if (!about.includes('assuming old live links are safe')) {
    findings.push({ severity: 'medium', type: 'about_archive_safety_explanation_missing', route: '/about/' })
  }

  return findings
}

function auditSourceContracts(rootDir, policy) {
  const findings = []
  const add = (severity, type, file, detail = '') => findings.push({ severity, type, file, detail })
  const detailSource = readText(path.join(rootDir, 'src', 'app', 'exchange', '[slug]', 'page.tsx'))
  const deadSource = readText(path.join(rootDir, 'src', 'components', 'registry', 'dead-explorer-client.tsx'))
  const activeSource = readText(path.join(rootDir, 'src', 'components', 'registry', 'active-explorer-client.tsx'))
  const explorerSource = readText(path.join(rootDir, 'src', 'components', 'explorer', 'entity-explorer-client.tsx'))
  const methodologySource = readText(path.join(rootDir, 'src', 'app', 'methodology', 'page.tsx'))

  for (const status of policy.clickable) {
    if (!detailSource.includes(`entity.official_url_status === '${status}'`)) {
      add('high', 'detail_clickable_allowlist_missing', 'src/app/exchange/[slug]/page.tsx', status)
    }
  }

  for (const [file, source] of [
    ['src/components/registry/dead-explorer-client.tsx', deadSource],
    ['src/components/registry/active-explorer-client.tsx', activeSource],
    ['src/components/explorer/entity-explorer-client.tsx', explorerSource],
  ]) {
    if (source.includes('href={entity.official_url_original}')) add('critical', 'original_url_linked_from_browse_surface', file)
    if (!source.includes('href={entity.archived_url}')) add('medium', 'archive_link_contract_missing', file)
  }

  if (!activeSource.includes('URL_STATUS_LABELS')) add('medium', 'active_list_url_status_text_missing', 'src/components/registry/active-explorer-client.tsx')
  if (!explorerSource.includes('URL_STATUS_LABELS')) add('medium', 'entity_explorer_url_status_text_missing', 'src/components/explorer/entity-explorer-client.tsx')
  if (!methodologySource.includes('urlStatusDefinitions')) add('high', 'methodology_url_status_definitions_source_missing', 'src/app/methodology/page.tsx')

  return findings
}

export function auditPublicUrlSafety(outDir = defaultOutDir, rootDir = root) {
  const policy = readJson(path.join(rootDir, 'config', 'url-display-policy.json'))
  policyContract(policy)
  const publicEntities = readJson(path.join(outDir, 'data', 'entities.json'))
  assert(publicEntities.canonical_only === true, 'public entities must be canonical_only')
  assert(Array.isArray(publicEntities.records), 'public entity records missing')

  const findings = [
    ...auditDataAndDetails({ entities: publicEntities.records, outDir, policy }),
    ...auditPublicExplanations(outDir),
    ...auditSourceContracts(rootDir, policy),
  ]

  return {
    entityCount: publicEntities.records.length,
    statusCoverage: URL_STATUSES,
    findings,
    critical: findings.filter((item) => item.severity === 'critical'),
    high: findings.filter((item) => item.severity === 'high'),
    medium: findings.filter((item) => item.severity === 'medium'),
    low: findings.filter((item) => item.severity === 'low'),
  }
}

function writeFile(rootDir, relativePath, content) {
  const filePath = path.join(rootDir, relativePath)
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content)
}

function fixtureEntity(status, index) {
  return {
    id: `hei_ex_${String(index + 1).padStart(6, '0')}`,
    slug: `exchange-${status}`,
    canonical_name: `Exchange ${status}`,
    status: status === 'live_verified' || status === 'live_unverified' ? 'active' : 'dead',
    official_url_original: `https://${status}.example.com/`,
    official_domain_original: `${status}.example.com`,
    official_url_status: status,
    archived_url: `https://web.archive.org/web/20200101/https://${status}.example.com/`,
  }
}

function runSelfTest() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hei-url-root-'))
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hei-url-out-'))

  try {
    const policy = {
      version: 1,
      clickable: ['live_verified', 'live_unverified'],
      plain_text: ['dead_domain', 'redirected', 'repurposed', 'unsafe', 'unknown'],
      archive_first: ['dead_domain', 'redirected', 'repurposed', 'unsafe'],
    }
    writeFile(rootDir, 'config/url-display-policy.json', JSON.stringify(policy))
    const entities = URL_STATUSES.map(fixtureEntity)
    writeFile(outDir, 'data/entities.json', JSON.stringify({ canonical_only: true, records: entities }))

    for (const entity of entities) {
      const clickable = policy.clickable.includes(entity.official_url_status)
      const archiveFirst = policy.archive_first.includes(entity.official_url_status)
      const original = clickable
        ? `<a href="${entity.official_url_original}">${entity.official_url_original}</a>`
        : entity.official_url_original
      const guidance = archiveFirst ? 'Use archived URL first for historical viewing.' : 'Use current URL handling based on status below.'
      writeFile(outDir, `exchange/${entity.slug}/index.html`, `<main><h2>${entity.canonical_name}</h2><div>URL status</div><div>${original}</div><a href="${entity.archived_url}">View archived site</a><p>${guidance}</p></main>`)
    }

    const methodologyText = `${URL_STATUSES.join(' ')} old exchange domains are not always safe or authoritative today may not always be clickable`
    writeFile(outDir, 'methodology/index.html', `<main>${methodologyText}</main>`)
    writeFile(outDir, 'about/index.html', '<main>Archive-aware: do not continue assuming old live links are safe.</main>')

    writeFile(rootDir, 'src/app/exchange/[slug]/page.tsx', "entity.official_url_status === 'live_verified' || entity.official_url_status === 'live_unverified'")
    writeFile(rootDir, 'src/components/registry/dead-explorer-client.tsx', 'href={entity.archived_url}')
    writeFile(rootDir, 'src/components/registry/active-explorer-client.tsx', 'URL_STATUS_LABELS href={entity.archived_url}')
    writeFile(rootDir, 'src/components/explorer/entity-explorer-client.tsx', 'URL_STATUS_LABELS href={entity.archived_url}')
    writeFile(rootDir, 'src/app/methodology/page.tsx', 'urlStatusDefinitions')

    const clean = auditPublicUrlSafety(outDir, rootDir)
    assert(clean.critical.length === 0 && clean.high.length === 0, `clean fixture blocked: ${JSON.stringify(clean.findings)}`)

    const unsafe = entities.find((entity) => entity.official_url_status === 'unsafe')
    writeFile(outDir, `exchange/${unsafe.slug}/index.html`, `<main><div>URL status</div><a href="${unsafe.official_url_original}">${unsafe.official_url_original}</a><a href="${unsafe.archived_url}">Archive</a><p>Use archived URL first for historical viewing.</p></main>`)
    const broken = auditPublicUrlSafety(outDir, rootDir)
    assert(broken.critical.some((item) => item.type === 'non_clickable_original_url_linked'), 'self-test did not detect clickable unsafe original URL')
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true })
    fs.rmSync(outDir, { recursive: true, force: true })
  }

  console.log('Public URL safety audit self-test passed.')
}

if (process.argv.includes('--self-test')) {
  runSelfTest()
} else {
  const result = auditPublicUrlSafety()
  console.log(`URL safety audit covered ${result.entityCount} public entity detail pages and ${result.statusCoverage.length} URL status values.`)
  console.log(`Findings: critical=${result.critical.length}, high=${result.high.length}, medium=${result.medium.length}, low=${result.low.length}`)
  for (const finding of result.findings) console.log(JSON.stringify(finding))
  if (result.critical.length > 0 || result.high.length > 0) {
    throw new Error(`URL safety audit blocked: ${result.critical.length} critical and ${result.high.length} high findings`)
  }
  console.log('Public URL safety audit passed with 0 critical and 0 high findings.')
}
