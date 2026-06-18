import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const events = JSON.parse(fs.readFileSync(path.join(root, 'data', 'events.json'), 'utf8'))
const evidence = JSON.parse(fs.readFileSync(path.join(root, 'data', 'evidence.json'), 'utf8'))

const allowedEventTypes = new Set([
  'launched', 'rebranded', 'acquired', 'merged', 'hack', 'exploit',
  'withdrawal_suspended', 'deposit_suspended', 'trading_halted',
  'service_outage', 'regulatory_action', 'lawsuit', 'bankruptcy_filed',
  'insolvency_declared', 'shutdown_announced', 'shutdown_effective',
  'reopened', 'token_migration', 'chain_shutdown_impact', 'other',
])
const allowedSourceTypes = new Set([
  'official_statement', 'official_blog', 'official_social', 'archive_capture',
  'news_article', 'court_document', 'regulatory_notice',
  'database_reference', 'community_reference', 'other',
])
const allowedClaimScopes = new Set([
  'entity', 'event', 'status', 'death_reason', 'launch_date',
  'death_date', 'url_history', 'ownership',
])

const output = {
  invalid_events: events.filter((item) => !allowedEventTypes.has(item.event_type)),
  invalid_source_type_evidence: evidence.filter((item) => !allowedSourceTypes.has(item.source_type)),
  invalid_claim_scope_evidence: evidence.filter((item) => !allowedClaimScopes.has(item.claim_scope)),
}

const filePath = path.join(root, 'data-staging', 'audits', 'invalid-enum-records.json')
fs.mkdirSync(path.dirname(filePath), { recursive: true })
fs.writeFileSync(filePath, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
console.log(`Exported ${output.invalid_events.length} events, ${output.invalid_source_type_evidence.length} source types, and ${output.invalid_claim_scope_evidence.length} claim scopes.`)
