import fs from 'node:fs'
import path from 'node:path'
import { loadCanonicalData } from './monitoring/core/load-canonical-data.mjs'
import {
  EVENT_TYPE_VALUES,
  EVENT_STATUS_EFFECT_VALUES,
  SOURCE_TYPE_VALUES,
  RELIABILITY_VALUES,
  CLAIM_SCOPE_VALUES,
} from './monitoring/core/constants.mjs'

const allowed = {
  event_type: new Set(EVENT_TYPE_VALUES),
  event_status_effect: new Set(EVENT_STATUS_EFFECT_VALUES),
  source_type: new Set(SOURCE_TYPE_VALUES),
  reliability: new Set(RELIABILITY_VALUES),
  claim_scope: new Set(CLAIM_SCOPE_VALUES),
}

const data = await loadCanonicalData()
const invalidEvents = data.events.filter((event) =>
  !allowed.event_type.has(event.event_type)
  || !allowed.event_status_effect.has(event.event_status_effect),
)
const invalidEvidence = data.evidence.filter((record) =>
  !allowed.source_type.has(record.source_type)
  || !allowed.reliability.has(record.reliability)
  || !allowed.claim_scope.has(record.claim_scope),
)

const report = {
  generated_at: new Date().toISOString(),
  projected_counts: {
    entities: data.entities.length,
    events: data.events.length,
    evidence: data.evidence.length,
  },
  invalid_event_count: invalidEvents.length,
  invalid_evidence_count: invalidEvidence.length,
  invalid_events: invalidEvents,
  invalid_evidence: invalidEvidence,
}

const output = path.resolve('audit-output/b1-projected-enum-debt.json')
fs.mkdirSync(path.dirname(output), { recursive: true })
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(`Projected invalid events: ${invalidEvents.length}`)
console.log(`Projected invalid evidence: ${invalidEvidence.length}`)
