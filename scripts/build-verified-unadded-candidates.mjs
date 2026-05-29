import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const outDir = path.join(root, 'tmp', 'verified-unadded-candidates')
const entitiesPath = path.join(root, 'data', 'entities.json')
const recordsDir = path.join(root, 'records', 'exchanges')

fs.mkdirSync(outDir, { recursive: true })

function normalize(value) {
  if (!value || typeof value !== 'string') return null
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '') || null
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function domainFromUrl(value) {
  if (!value || typeof value !== 'string') return null
  try {
    const url = value.startsWith('http') ? new URL(value) : new URL(`https://${value}`)
    return normalize(url.hostname)
  } catch {
    return normalize(value)
  }
}

function addKey(keys, value) {
  const normalized = normalize(value)
  if (normalized) keys.add(normalized)
}

function loadExistingKeys() {
  const keys = new Set()
  const entities = JSON.parse(fs.readFileSync(entitiesPath, 'utf8'))

  for (const entity of entities) {
    addKey(keys, entity.id)
    addKey(keys, entity.slug)
    addKey(keys, entity.canonical_name)
    addKey(keys, entity.official_domain_original)
    addKey(keys, entity.official_url_original)
    for (const alias of entity.aliases || []) addKey(keys, alias)
  }

  if (fs.existsSync(recordsDir)) {
    for (const fileName of fs.readdirSync(recordsDir).filter((fileName) => fileName.endsWith('.json'))) {
      const bundle = JSON.parse(fs.readFileSync(path.join(recordsDir, fileName), 'utf8'))
      const entity = bundle.entity
      addKey(keys, entity.id)
      addKey(keys, entity.slug)
      addKey(keys, entity.canonical_name)
      addKey(keys, entity.official_domain_original)
      addKey(keys, entity.official_url_original)
      for (const alias of entity.aliases || []) addKey(keys, alias)
    }
  }

  return keys
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      'accept': 'application/json',
      'user-agent': 'HEI candidate collector (research backlog)'
    }
  })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`)
  return response.json()
}

function pushCandidate(candidates, input) {
  const name = input.name?.trim()
  if (!name) return
  const slug = slugify(input.slug || name)
  const domain = domainFromUrl(input.url || input.domain || '')
  candidates.push({
    name,
    slug,
    domain: domain || '',
    source: input.source,
    source_url: input.source_url,
    source_id: input.source_id || '',
    type_guess: input.type_guess || '',
    status_guess: input.status_guess || '',
    notes: input.notes || '',
  })
}

async function collectCoinPaprika(candidates, errors) {
  const sourceUrl = 'https://api.coinpaprika.com/v1/exchanges'
  try {
    const rows = await fetchJson(sourceUrl)
    for (const row of rows) {
      pushCandidate(candidates, {
        name: row.name,
        slug: row.id || row.name,
        url: row.website || '',
        source: 'coinpaprika_exchanges',
        source_url: sourceUrl,
        source_id: row.id || '',
        type_guess: 'cex_or_exchange_like',
        status_guess: row.active === false ? 'inactive_or_dead' : 'active_or_unknown',
        notes: `CoinPaprika rank=${row.rank ?? ''}; active=${row.active ?? ''}`,
      })
    }
  } catch (error) {
    errors.push(`coinpaprika_exchanges: ${error.message}`)
  }
}

async function collectCoinGecko(candidates, errors) {
  for (let page = 1; page <= 10; page += 1) {
    const sourceUrl = `https://api.coingecko.com/api/v3/exchanges?per_page=250&page=${page}`
    try {
      const rows = await fetchJson(sourceUrl)
      if (!Array.isArray(rows) || rows.length === 0) break
      for (const row of rows) {
        pushCandidate(candidates, {
          name: row.name,
          slug: row.id || row.name,
          url: row.url || '',
          source: 'coingecko_exchanges',
          source_url: sourceUrl,
          source_id: row.id || '',
          type_guess: 'cex_or_exchange_like',
          status_guess: 'active_or_unknown',
          notes: `CoinGecko trust_score_rank=${row.trust_score_rank ?? ''}`,
        })
      }
    } catch (error) {
      errors.push(`coingecko_exchanges_page_${page}: ${error.message}`)
      break
    }
  }
}

async function collectDefiLlamaDexs(candidates, errors) {
  const sourceUrl = 'https://api.llama.fi/overview/dexs?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyVolume'
  try {
    const data = await fetchJson(sourceUrl)
    const rows = Array.isArray(data.protocols) ? data.protocols : []
    for (const row of rows) {
      pushCandidate(candidates, {
        name: row.name,
        slug: row.slug || row.name,
        url: row.url || '',
        source: 'defillama_dexs',
        source_url: sourceUrl,
        source_id: row.slug || '',
        type_guess: 'dex_or_protocol',
        status_guess: 'active_or_unknown',
        notes: `DefiLlama category=${row.category || ''}; chains=${Array.isArray(row.chains) ? row.chains.join('|') : ''}`,
      })
    }
  } catch (error) {
    errors.push(`defillama_dexs: ${error.message}`)
  }
}

async function collectCcxt(candidates, errors) {
  const sourceUrl = 'https://raw.githubusercontent.com/ccxt/ccxt/master/js/ccxt.js'
  try {
    const response = await fetch(sourceUrl, { headers: { 'user-agent': 'HEI candidate collector' } })
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
    const text = await response.text()
    const importRe = /^import\s+([a-zA-Z0-9_]+)\s+from\s+'\.\/src\/([a-zA-Z0-9_]+)\.js';/gm
    for (const match of text.matchAll(importRe)) {
      const id = match[2]
      if (['base', 'pro'].includes(id)) continue
      pushCandidate(candidates, {
        name: id,
        slug: id,
        source: 'ccxt_supported_exchanges',
        source_url: sourceUrl,
        source_id: id,
        type_guess: 'cex_or_exchange_like',
        status_guess: 'active_or_unknown',
        notes: 'Imported from CCXT generated exchange list.',
      })
    }
  } catch (error) {
    errors.push(`ccxt_supported_exchanges: ${error.message}`)
  }
}

function isExisting(candidate, existingKeys) {
  const candidateKeys = [candidate.name, candidate.slug, candidate.domain].filter(Boolean)
  return candidateKeys.some((key) => existingKeys.has(normalize(key)))
}

function csvEscape(value) {
  const raw = String(value ?? '')
  if (/[",\n]/.test(raw)) return `"${raw.replace(/"/g, '""')}"`
  return raw
}

const existingKeys = loadExistingKeys()
const candidates = []
const errors = []

await collectCoinPaprika(candidates, errors)
await collectCoinGecko(candidates, errors)
await collectDefiLlamaDexs(candidates, errors)
await collectCcxt(candidates, errors)

const byIdentity = new Map()
for (const candidate of candidates) {
  const identity = normalize(candidate.domain) || normalize(candidate.slug) || normalize(candidate.name)
  if (!identity) continue
  if (!byIdentity.has(identity)) byIdentity.set(identity, candidate)
}

const uniqueCandidates = [...byIdentity.values()]
const unadded = uniqueCandidates
  .filter((candidate) => !isExisting(candidate, existingKeys))
  .sort((a, b) => a.name.localeCompare(b.name))

const limited = unadded.slice(0, 1000)
const generatedAt = new Date().toISOString()

const jsonlPath = path.join(outDir, 'unadded-candidates-verified-v1.jsonl')
const csvPath = path.join(outDir, 'unadded-candidates-verified-v1.csv')
const summaryPath = path.join(outDir, 'SUMMARY.md')

const enriched = limited.map((candidate, index) => ({
  candidate_id: `hei_unadded_${String(index + 1).padStart(4, '0')}`,
  ...candidate,
  hei_existing_check: 'not_found_by_name_slug_domain_in_repo_data',
  decision: 'candidate_needs_evidence_review',
  generated_at: generatedAt,
}))

fs.writeFileSync(jsonlPath, enriched.map((row) => JSON.stringify(row)).join('\n') + '\n')
const headers = ['candidate_id', 'name', 'slug', 'domain', 'source', 'source_url', 'source_id', 'type_guess', 'status_guess', 'hei_existing_check', 'decision', 'notes', 'generated_at']
fs.writeFileSync(csvPath, [headers.join(','), ...enriched.map((row) => headers.map((key) => csvEscape(row[key])).join(','))].join('\n') + '\n')

const sourceCounts = candidates.reduce((acc, candidate) => {
  acc[candidate.source] = (acc[candidate.source] || 0) + 1
  return acc
}, {})

fs.writeFileSync(summaryPath, `# Verified unadded candidate generation v1\n\nGenerated: ${generatedAt}\n\n## Counts\n\n- raw_candidates_collected: ${candidates.length}\n- unique_candidates_after_source_dedupe: ${uniqueCandidates.length}\n- existing_filtered_out_by_repo_identity: ${uniqueCandidates.length - unadded.length}\n- unadded_candidates_available: ${unadded.length}\n- unadded_candidates_written: ${limited.length}\n- requested_target: 1000\n- target_met: ${limited.length >= 1000 ? 'yes' : 'no'}\n\n## Source counts\n\n${Object.entries(sourceCounts).map(([source, count]) => `- ${source}: ${count}`).join('\n')}\n\n## Source errors\n\n${errors.length ? errors.map((error) => `- ${error}`).join('\n') : '- none'}\n\n## Important\n\nThese are not ready-to-merge records. They are real-name candidates not found in current HEI repo data by name/slug/domain matching. Each candidate still needs public-site check, source evidence review, scope review, and ID assignment before any record PR.\n`)

console.log(`raw_candidates_collected=${candidates.length}`)
console.log(`unique_candidates_after_source_dedupe=${uniqueCandidates.length}`)
console.log(`existing_filtered_out_by_repo_identity=${uniqueCandidates.length - unadded.length}`)
console.log(`unadded_candidates_available=${unadded.length}`)
console.log(`unadded_candidates_written=${limited.length}`)
console.log(`target_met=${limited.length >= 1000 ? 'yes' : 'no'}`)
if (errors.length) {
  console.log('source_errors=')
  for (const error of errors) console.log(`- ${error}`)
}
