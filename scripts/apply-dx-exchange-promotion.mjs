import fs from 'node:fs'

const resolutionFile = 'data-staging/watchlists/resolution/index.json'
const scanFile = 'data-staging/candidate-scans/c1-scan-01.json'
const roadmapFile = 'docs/HEI_V1_EXECUTION_ROADMAP.md'

const resolution = JSON.parse(fs.readFileSync(resolutionFile, 'utf8'))
const scan = JSON.parse(fs.readFileSync(scanFile, 'utf8'))
let roadmap = fs.readFileSync(roadmapFile, 'utf8')

const resolutionEntry = resolution.entries.find((entry) => entry.candidate_key === 'candidate:dx-exchange')
if (!resolutionEntry) throw new Error('DX.Exchange resolution entry is missing')
if (!['needs_research', 'promoted'].includes(resolutionEntry.state)) {
  throw new Error(`Unexpected DX.Exchange resolution state: ${resolutionEntry.state}`)
}
resolutionEntry.state = 'promoted'
resolutionEntry.target_entity_id = 'hei_ex_000526'
resolutionEntry.last_reviewed_at = '2026-06-22'
delete resolutionEntry.next_review_after
resolutionEntry.source_files = [...new Set([
  ...(resolutionEntry.source_files || []),
  'records/exchanges/dx-exchange.json',
])]
resolutionEntry.notes = 'Promoted to the reviewed public registry as DX.Exchange (hei_ex_000526) in PR #422 after launch, operating-company insolvency, and service-shutdown evidence review.'
resolution.updated_at = '2026-06-22'

const scanEntry = scan.candidates.find((entry) => entry.candidate_key === 'candidate:dx-exchange')
if (!scanEntry) throw new Error('DX.Exchange scan entry is missing')
if (scanEntry.scan_disposition !== 'add_now') throw new Error(`DX.Exchange scan disposition changed unexpectedly: ${scanEntry.scan_disposition}`)
scanEntry.target_entity_id = 'hei_ex_000526'
scanEntry.matched_entity_name = 'DX.Exchange'
scanEntry.matched_entity_slug = 'dx-exchange'
scanEntry.promoted_at = '2026-06-22'
scanEntry.promotion_pr = 422
scanEntry.review_status = 'reviewed'
scanEntry.last_reviewed_at = '2026-06-22'
scanEntry.review_notes = 'Promoted as DX.Exchange (hei_ex_000526) after direct projected-public duplicate recheck and full historical record drafting.'
scan.updated_at = '2026-06-22'

function replaceOnce(before, after, label) {
  const count = roadmap.split(before).length - 1
  if (count !== 1) throw new Error(`${label}: expected one match, found ${count}`)
  roadmap = roadmap.replace(before, after)
}

replaceOnce(
`Last confirmed main SHA: b9893b78d9e1f20b1d02e6f16747cc206fb66ccd
Last merged implementation PR: #418 Classify the first Phase C candidate scan
Current implementation PR: #419 Correct stale open candidate resolutions
Current phase: Phase C — Reviewed registry growth
Completed item: C1 — Candidate scan corrected against projected public entities
Current item: C2 — Draft the DX.Exchange reviewed record bundle`,
`Last confirmed main SHA: 61581e49b5b0ee6aadd600341f8d2e21eeb2baac
Last merged implementation PR: #421 Allow reviewed candidate states to advance
Current implementation PR: #422 Add DX.Exchange historical record
Current phase: Phase C — Reviewed registry growth
Completed item: C2 — Add the DX.Exchange reviewed record bundle
Current item: C3 — Repair thin active CEX records`,
'current checkpoint',
)

replaceOnce(
`Entities:  412
Events:    691
Evidence: 1620`,
`Entities:  413
Events:    695
Evidence: 1627`,
'current reviewed counts',
)

replaceOnce(
`Maximum entity ID:    hei_ex_000525
Maximum event ID:     hei_ev_002083
Maximum evidence ID:  hei_src_003209`,
`Maximum entity ID:    hei_ex_000526
Maximum event ID:     hei_ev_002087
Maximum evidence ID:  hei_src_003216`,
'maximum ids',
)

replaceOnce(
`Reviewed bundles: 152
New-entity bundles: 106
Repair bundles:      46`,
`Reviewed bundles: 153
New-entity bundles: 107
Repair bundles:      46`,
'count composition',
)

replaceOnce(
`Required net additions: at least 138`,
`Required net additions from the original 412 baseline: at least 138  
Remaining additions after C2: at least 137`,
'phase C target',
)

replaceOnce(
`## C2. First growth record drafting

Status: **CURRENT**

Draft and validate one reviewed record bundle:

\`\`\`text
DX.Exchange
\`\`\`

Before selecting any later growth batch, run the strict projected-public overlap gate against all remaining pending-thin candidates.`,
`## C2. First growth record drafting

Status: **COMPLETED in PR #422**

Added one reviewed historical exchange record:

\`\`\`text
DX.Exchange
Entity:   hei_ex_000526
Events:   hei_ev_002084–hei_ev_002087
Evidence: hei_src_003210–hei_src_003216
\`\`\`

Count impact:

\`\`\`text
Entities:  412 -> 413
Events:    691 -> 695
Evidence: 1620 -> 1627
\`\`\`

The candidate resolution advanced from \`needs_research\` to \`promoted\`. The strict projected-public overlap gate remains mandatory before selecting later growth batches.`,
'C2 section',
)

fs.writeFileSync(resolutionFile, `${JSON.stringify(resolution, null, 2)}\n`, 'utf8')
fs.writeFileSync(scanFile, `${JSON.stringify(scan, null, 2)}\n`, 'utf8')
fs.writeFileSync(roadmapFile, roadmap, 'utf8')

const stateCounts = resolution.entries.reduce((counts, entry) => {
  counts[entry.state] = (counts[entry.state] || 0) + 1
  return counts
}, {})
if (stateCounts.promoted !== 15 || stateCounts.held !== 29 || stateCounts.already_canonical !== 14 || stateCounts.needs_research) {
  throw new Error(`Unexpected resolution counts after DX promotion: ${JSON.stringify(stateCounts)}`)
}
console.log(`DX.Exchange promoted: ${JSON.stringify(stateCounts)}`)
