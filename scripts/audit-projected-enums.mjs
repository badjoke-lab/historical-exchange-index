import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { loadCanonicalData } from './monitoring/core/load-canonical-data.mjs'
import {
  EVENT_TYPE_VALUES,
  IMPACT_LEVEL_VALUES,
  EVENT_STATUS_EFFECT_VALUES,
  SOURCE_TYPE_VALUES,
  RELIABILITY_VALUES,
  CLAIM_SCOPE_VALUES,
} from './monitoring/core/constants.mjs'

const root = process.cwd()
const strict = process.argv.includes('--strict')
const outputArg = process.argv.find((arg) => arg.startsWith('--output='))

const allowed = {
  event_type: new Set(EVENT_TYPE_VALUES),
  impact_level: new Set(IMPACT_LEVEL_VALUES),
  event_status_effect: new Set(EVENT_STATUS_EFFECT_VALUES),
  source_type: new Set(SOURCE_TYPE_VALUES),
  reliability: new Set(RELIABILITY_VALUES),
  claim_scope: new Set(CLAIM_SCOPE_VALUES),
}

const data = await loadCanonicalData()
const invalidEvents = []
const invalidEvidence = []

for (const event of data.events) {
  for (const field of ['event_type', 'impact_level', 'event_status_effect']) {
    if (!allowed[field].has(event[field])) {
      invalidEvents.push({ id: event.id, exchange_id: event.exchange_id, field, value: event[field] ?? null })
    }
  }
}

for (const record of data.evidence) {
  for (const field of ['source_type', 'reliability', 'claim_scope']) {
    if (!allowed[field].has(record[field])) {
      invalidEvidence.push({ id: record.id, exchange_id: record.exchange_id, event_id: record.event_id ?? null, field, value: record[field] ?? null })
    }
  }
}

const report = {
  generated_at: new Date().toISOString(),
  projected_counts: {
    entities: data.entities.length,
    events: data.events.length,
    evidence: data.evidence.length,
  },
  invalid_event_fields: invalidEvents.length,
  invalid_evidence_fields: invalidEvidence.length,
  invalid_events: invalidEvents,
  invalid_evidence: invalidEvidence,
  status: invalidEvents.length === 0 && invalidEvidence.length === 0 ? 'pass' : 'fail',
}

if (outputArg) {
  const outputPath = path.resolve(root, outputArg.slice('--output='.length))
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}

console.log(`Projected entities: ${report.projected_counts.entities}`)
console.log(`Projected events: ${report.projected_counts.events}`)
console.log(`Projected evidence: ${report.projected_counts.evidence}`)
console.log(`Invalid projected event fields: ${report.invalid_event_fields}`)
console.log(`Invalid projected evidence fields: ${report.invalid_evidence_fields}`)

if (strict && report.status !== 'pass') process.exit(1)
