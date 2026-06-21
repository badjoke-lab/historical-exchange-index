import fs from 'node:fs'

const file = 'scripts/check-lineage-l2-dispositions.mjs'
let source = fs.readFileSync(file, 'utf8')

const importBefore = "import { restorePreA4LineageEntities } from './lib/lineage-a4-baseline.mjs'"
const importAfter = `${importBefore}\nimport { restorePreB1LineageEvents } from './lib/lineage-a3-event-baseline.mjs'`
if (!source.includes("restorePreB1LineageEvents")) {
  if (!source.includes(importBefore)) throw new Error('L2 import anchor missing')
  source = source.replace(importBefore, importAfter)
}

const eventsBefore = "const events = mergeRecords(canonicalEvents, all, 'events', 'event', entityIdMap)"
const eventsAfter = "const events = restorePreB1LineageEvents(\n  mergeRecords(canonicalEvents, all, 'events', 'event', entityIdMap),\n)"
if (source.includes(eventsBefore)) source = source.replace(eventsBefore, eventsAfter)
else if (!source.includes(eventsAfter)) throw new Error('L2 events anchor missing')

const reportBefore = "  classification_counts: counts,\n  failures,"
const reportAfter = "  classification_counts: counts,\n  restored_pre_b1_event_types: 1,\n  failures,"
if (source.includes(reportBefore)) source = source.replace(reportBefore, reportAfter)
else if (!source.includes('restored_pre_b1_event_types: 1')) throw new Error('L2 report anchor missing')

fs.writeFileSync(file, source, 'utf8')
console.log('L2 now validates against the frozen pre-B1 event baseline.')
