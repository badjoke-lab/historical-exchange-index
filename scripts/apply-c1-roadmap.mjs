import fs from 'node:fs'

const file = 'docs/HEI_V1_EXECUTION_ROADMAP.md'
let source = fs.readFileSync(file, 'utf8')

function replaceOnce(before, after, label) {
  const count = source.split(before).length - 1
  if (count !== 1) throw new Error(`${label}: expected one match, found ${count}`)
  source = source.replace(before, after)
}

replaceOnce(
`Last confirmed main SHA: 50457980fa1c28a0e95620244a478152520e6716
Last merged implementation PR: #416 Reorganize watchlist and candidate resolutions
Current implementation PR: #417 Add count semantics regression gate
Current phase: Phase C — Reviewed registry growth
Completed item: B3 — Count-semantics regression tests
Current item: C1 — Candidate scans and growth queue selection`,
`Last confirmed main SHA: 3816647b6e7dcd30fea3286bfc3d15fdc4171d38
Last merged implementation PR: #417 Add count semantics regression gate
Current implementation PR: #418 Classify the first Phase C candidate scan
Current phase: Phase C — Reviewed registry growth
Completed item: C1 — Candidate scans and growth queue selection
Current item: C2 — Draft the first growth batch of eight entities`,
'checkpoint',
)

replaceOnce(
`\`docs/audits/HEI_B3_COUNT_SEMANTICS_2026-06-22.md\`

### Known non-blocking queue`,
`\`docs/audits/HEI_B3_COUNT_SEMANTICS_2026-06-22.md\`

### C1 completion result

\`\`\`text
Candidates reviewed:        42
Add now:                    10
Needs further research:      1
Pending thin:               31
Out of scope or duplicate:   0
First growth batch:          8
Second growth batch:         2
\`\`\`

First growth batch:

\`\`\`text
Curve Finance
DX.Exchange
dYdX
LFJ
Orca
Osmosis
QuickSwap
THORChain
\`\`\`

Second growth batch:

\`\`\`text
Aevo
gTrade
\`\`\`

Jupiter Perpetuals remains in research because its entity boundary versus the wider Jupiter platform is unresolved.

Audit:

\`docs/audits/HEI_C1_CANDIDATE_SCAN_01_2026-06-22.md\`

### Known non-blocking queue`,
'C1 checkpoint result',
)

replaceOnce(
`Estimated remaining effort from the B3 completion checkpoint:

\`\`\`text
Implementation PRs: approximately 32-44
Working days: approximately 34-53
Calendar estimate: approximately 8-12 weeks
\`\`\``,
`Estimated remaining effort from the C1 completion checkpoint:

\`\`\`text
Implementation PRs: approximately 31-43
Working days: approximately 33-52
Calendar estimate: approximately 8-12 weeks
\`\`\``,
'estimate',
)

replaceOnce(
`## C1. Candidate scans and queue selection

Status: **CURRENT**

Scan 30-50 candidates per block and classify:

\`\`\`text
add_now
needs_research
pending_thin
out_of_scope_or_duplicate
\`\`\`

Only \`add_now\` enters record PRs.

Required outputs:

- stable candidate key;
- entity-boundary decision;
- duplicate and alias result;
- likely type and status;
- official and independent source coverage;
- minimum event/evidence shape;
- confidence and unresolved questions;
- selected batch assignment.

Completion gate:

\`\`\`text
at least 30 candidates reviewed
all candidates have one disposition
add_now candidates meet minimum source shape
no terminally resolved candidate returns as new
first growth batch is fixed
\`\`\``,
`## C1. Candidate scans and queue selection

Status: **COMPLETED in PR #418**

The first scan reviewed all 42 open B2 candidates:

\`\`\`text
add_now:                    10
needs_research:              1
pending_thin:               31
out_of_scope_or_duplicate:   0
\`\`\`

Completed work:

- fixed stable candidate keys and one disposition for every open candidate;
- reviewed the eleven priority candidates against official and independent sources;
- corrected product-style names to canonical entity identities;
- retained Jupiter Perpetuals for entity-boundary research;
- fixed an eight-entity first growth batch and a two-entity second batch;
- added a permanent candidate-scan schema and evidence-shape gate.

Completion gate:

\`\`\`text
42 candidates reviewed
all candidates have one disposition
10 add_now candidates meet minimum source shape
no terminally resolved candidate returned as new
first growth batch fixed at 8 entities
\`\`\``,
'C1 section',
)

replaceOnce(
`## C2-C3. Repair thin active CEX records

Improve existing active records lacking clear identity, launch evidence, current-status evidence, original domain, origin, or normal evidence depth.`,
`## C2. First growth batch record drafting

Status: **CURRENT**

Draft reviewed record bundles for:

\`\`\`text
Curve Finance
DX.Exchange
dYdX
LFJ
Orca
Osmosis
QuickSwap
THORChain
\`\`\`

The batch may be split into smaller implementation PRs, but the selected identities and naming decisions are fixed by C1.

## C3. Repair thin active CEX records

Improve existing active records lacking clear identity, launch evidence, current-status evidence, original domain, origin, or normal evidence depth.`,
'C2/C3 section',
)

fs.writeFileSync(file, source, 'utf8')
console.log('Advanced roadmap from C1 to first growth-batch drafting.')
