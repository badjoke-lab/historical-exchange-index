import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const backlogPath = path.join(root, 'docs', 'backlog', 'hei-unadded-candidate-backlog-1000-v0.md')
const entitiesPath = path.join(root, 'data', 'entities.json')
const recordsDir = path.join(root, 'records', 'exchanges')

function normalize(value) {
  if (!value || typeof value !== 'string') return null
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
  return normalized || null
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function addKey(map, key, record) {
  const normalized = normalize(key)
  if (!normalized) return
  if (!map.has(normalized)) map.set(normalized, [])
  map.get(normalized).push(record)
}

function addEntityKeys(map, entity, source, filePath = null) {
  const record = {
    source,
    filePath,
    id: entity.id,
    slug: entity.slug,
    canonical_name: entity.canonical_name,
  }
  addKey(map, entity.id, record)
  addKey(map, entity.slug, record)
  addKey(map, entity.canonical_name, record)
  addKey(map, entity.official_domain_original, record)
  addKey(map, entity.official_url_original, record)
  for (const alias of entity.aliases || []) addKey(map, alias, record)
}

function loadRecords() {
  const map = new Map()
  const entities = JSON.parse(fs.readFileSync(entitiesPath, 'utf8'))
  for (const entity of entities) addEntityKeys(map, entity, 'data/entities.json')

  if (fs.existsSync(recordsDir)) {
    for (const fileName of fs.readdirSync(recordsDir).filter((fileName) => fileName.endsWith('.json'))) {
      const filePath = path.join(recordsDir, fileName)
      const bundle = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      addEntityKeys(map, bundle.entity, 'records/exchanges', path.relative(root, filePath))
    }
  }

  return map
}

function parseNamedRows(markdown) {
  const rows = []
  const lineRe = /^(hei_cand_\d{4}),([^,]+),([^,]+),seed_name_list,([^,]+),([^,]+),(.+)$/
  for (const line of markdown.split('\n')) {
    const match = line.match(lineRe)
    if (!match) continue
    rows.push({
      id: match[1],
      name: match[2],
      slug: match[3],
      existingDecision: match[4],
      priority: match[5],
      notes: match[6],
    })
  }
  return rows
}

const existing = loadRecords()
const backlog = fs.readFileSync(backlogPath, 'utf8')
const namedRows = parseNamedRows(backlog)
const totalRows = 1000
const sourceSlots = totalRows - namedRows.length

const results = []
for (const row of namedRows) {
  const keys = [row.slug, row.name, slugify(row.name)]
  const hits = []
  for (const key of keys) {
    const normalized = normalize(key)
    if (normalized && existing.has(normalized)) {
      hits.push(...existing.get(normalized))
    }
  }
  const uniqueHits = [...new Map(hits.map((hit) => [`${hit.source}:${hit.filePath || hit.id}`, hit])).values()]
  const status = uniqueHits.length > 0 ? 'existing' : 'not_found_in_repo_data'
  results.push({ row, status, hits: uniqueHits })
}

const existingCount = results.filter((result) => result.status === 'existing').length
const notFoundCount = results.filter((result) => result.status === 'not_found_in_repo_data').length

console.log('HEI backlog dedupe check result')
console.log(`total_backlog_rows=${totalRows}`)
console.log(`named_rows_checked=${namedRows.length}`)
console.log(`source_slots_without_identity=${sourceSlots}`)
console.log(`existing_named_rows=${existingCount}`)
console.log(`not_found_named_rows=${notFoundCount}`)
console.log('')
console.log('| id | name | result | matched existing |')
console.log('|---|---|---|---|')
for (const result of results) {
  const matched = result.hits
    .map((hit) => `${hit.id}/${hit.slug}/${hit.canonical_name}`)
    .join('; ')
  console.log(`| ${result.row.id} | ${result.row.name} | ${result.status} | ${matched || '-'} |`)
}

if (sourceSlots > 0) {
  console.log('')
  console.log(`Note: ${sourceSlots} source-acquisition slots have no concrete name/domain identity yet, so they cannot be duplicate-checked as exchange candidates until fetched and normalized.`)
}
