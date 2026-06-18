import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const events = JSON.parse(fs.readFileSync(path.join(root, 'data', 'events.json'), 'utf8'))
const evidence = JSON.parse(fs.readFileSync(path.join(root, 'data', 'evidence.json'), 'utf8'))

const allowed = {
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
  generated_at: new Date().toISOString(),
  event_type: summarize(events, 'event_type'),
  source_type: summarize(evidence, 'source_type'),
  claim_scope: summarize(evidence, 'claim_scope'),
}

for (const field of Object.keys(report).filter((key) => key !== 'generated_at')) {
  const invalid = report[field].filter((entry) => !entry.allowed)
  console.log(`\n${field}: ${invalid.reduce((sum, entry) => sum + entry.count, 0)} invalid record(s)`)
  console.log(JSON.stringify(invalid, null, 2))
}

console.log('\nFULL_ENUM_AUDIT')
console.log(JSON.stringify(report, null, 2))
