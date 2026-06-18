import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const entities = JSON.parse(fs.readFileSync(path.join(root, 'data', 'entities.json'), 'utf8'))
const events = JSON.parse(fs.readFileSync(path.join(root, 'data', 'events.json'), 'utf8'))
const evidence = JSON.parse(fs.readFileSync(path.join(root, 'data', 'evidence.json'), 'utf8'))
const scope = process.argv.find((value) => value.startsWith('--scope='))?.split('=')[1] ?? 'all'
const strict = process.argv.includes('--strict')

const allowed = {
  official_url_status: new Set([
    'live_verified', 'live_unverified', 'dead_domain', 'redirected',
    'repurposed', 'unsafe', 'unknown',
  ]),
  event_type: new Set([
    'launched', 'rebranded', 'acquired', 'merged', 'hack', 'exploit',
    'withdrawal_suspended', 'deposit_suspended', 'trading_halted',
    'service_outage', 'regulatory_action', 'lawsuit', 'bankruptcy_filed',
    'insolvency_declared', 'shutdown_announced', 'shutdown_effective',
    'reopened', 'token_migration', 'chain_shutdown_impact', 'other',
  ]),
  source_type: new Set([
    'official_statement', 'official_blog', 'official_social', 'archive_capture',
    'news_article', 'court_document', 'regulatory_notice',
    'database_reference', 'community_reference', 'other',
  ]),
  claim_scope: new Set([
    'entity', 'event', 'status', 'death_reason', 'launch_date',
    'death_date', 'url_history', 'ownership',
  ]),
}

function summarize(items, field, idField = 'id') {
  const counts = new Map()
  const examples = new Map()
  for (const item of items) {
    const value = item[field] ?? null
    counts.set(value, (counts.get(value) ?? 0) + 1)
    if (!examples.has(value)) examples.set(value, [])
    if (examples.get(value).length < 10) examples.get(value).push(item[idField])
  }
  return [...counts.entries()]
    .sort(([a], [b]) => String(a).localeCompare(String(b)))
    .map(([value, count]) => ({
      value,
      count,
      allowed: allowed[field].has(value),
      examples: examples.get(value),
    }))
}

const report = {
  official_url_status: summarize(entities, 'official_url_status'),
  event_type: summarize(events, 'event_type'),
  source_type: summarize(evidence, 'source_type'),
  claim_scope: summarize(evidence, 'claim_scope'),
}
const fields = scope === 'all' ? Object.keys(report) : [scope]
if (fields.some((field) => !Object.hasOwn(report, field))) {
  throw new Error(`Unknown enum audit scope: ${scope}`)
}

let invalidTotal = 0
for (const field of fields) {
  const invalid = report[field].filter((entry) => !entry.allowed)
  const count = invalid.reduce((sum, entry) => sum + entry.count, 0)
  invalidTotal += count
  console.log(`${field}: ${count} invalid record(s)`)
  if (invalid.length > 0) console.log(JSON.stringify(invalid, null, 2))
}

if (strict && invalidTotal > 0) process.exit(1)
