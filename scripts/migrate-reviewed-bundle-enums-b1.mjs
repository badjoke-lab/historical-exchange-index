import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const recordsDir = path.join(root, 'records', 'exchanges')

const eventTypeMap = new Map([
  ['listed_reference', 'other'],
  ['rebrand', 'rebranded'],
  ['legal_proceeding', 'bankruptcy_filed'],
  ['security_breach', 'other'],
  ['recovery_or_settlement', 'other'],
  ['acquisition_announced', 'other'],
  ['launch_or_public_operation', 'launched'],
])

const sourceTypeMap = new Map([
  ['archived_website', 'archive_capture'],
  ['regulator_statement', 'regulatory_notice'],
  ['secondary_report', 'news_article'],
  ['news_report', 'news_article'],
  ['regulatory_statement', 'regulatory_notice'],
  ['legal_document', 'court_document'],
])

const files = fs.readdirSync(recordsDir)
  .filter((name) => name.endsWith('.json'))
  .sort()

let changedFiles = 0
let eventTypeChanges = 0
let eventStatusEffectChanges = 0
let sourceTypeChanges = 0
let claimScopeChanges = 0

for (const name of files) {
  const file = path.join(recordsDir, name)
  const bundle = JSON.parse(fs.readFileSync(file, 'utf8'))
  let changed = false

  for (const event of bundle.events ?? []) {
    const nextType = eventTypeMap.get(event.event_type)
    if (nextType && nextType !== event.event_type) {
      event.event_type = nextType
      eventTypeChanges += 1
      changed = true
    }
    if (event.event_status_effect === 'inactive_or_unchanged') {
      event.event_status_effect = 'none'
      eventStatusEffectChanges += 1
      changed = true
    }
  }

  for (const record of bundle.evidence ?? []) {
    const nextType = sourceTypeMap.get(record.source_type)
    if (nextType && nextType !== record.source_type) {
      record.source_type = nextType
      sourceTypeChanges += 1
      changed = true
    }
    if (record.claim_scope === 'background') {
      record.claim_scope = 'entity'
      claimScopeChanges += 1
      changed = true
    }
  }

  if (!changed) continue
  fs.writeFileSync(file, `${JSON.stringify(bundle, null, 2)}\n`, 'utf8')
  changedFiles += 1
}

for (const name of files) {
  const file = path.join(recordsDir, name)
  const bundle = JSON.parse(fs.readFileSync(file, 'utf8'))
  for (const event of bundle.events ?? []) {
    if (eventTypeMap.has(event.event_type)) throw new Error(`${name}: legacy event_type remains on ${event.id}`)
    if (event.event_status_effect === 'inactive_or_unchanged') throw new Error(`${name}: legacy event_status_effect remains on ${event.id}`)
  }
  for (const record of bundle.evidence ?? []) {
    if (sourceTypeMap.has(record.source_type)) throw new Error(`${name}: legacy source_type remains on ${record.id}`)
    if (record.claim_scope === 'background') throw new Error(`${name}: legacy claim_scope remains on ${record.id}`)
  }
}

console.log(`Normalized reviewed bundle enums in ${changedFiles} file(s).`)
console.log(`Event type changes: ${eventTypeChanges}`)
console.log(`Event status-effect changes: ${eventStatusEffectChanges}`)
console.log(`Evidence source-type changes: ${sourceTypeChanges}`)
console.log(`Evidence claim-scope changes: ${claimScopeChanges}`)
if (changedFiles === 0) console.log('Reviewed bundle enum migration is already complete.')
