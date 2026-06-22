import fs from 'node:fs'

const file = 'docs/HEI_V1_EXECUTION_ROADMAP.md'
let source = fs.readFileSync(file, 'utf8')

function replaceOnce(before, after, label) {
  const count = source.split(before).length - 1
  if (count !== 1) throw new Error(`${label}: expected one match, found ${count}`)
  source = source.replace(before, after)
}

replaceOnce(
`Last confirmed main SHA: 3816647b6e7dcd30fea3286bfc3d15fdc4171d38
Last merged implementation PR: #417 Add count semantics regression gate
Current implementation PR: #418 Classify the first Phase C candidate scan
Current phase: Phase C — Reviewed registry growth
Completed item: C1 — Candidate scans and growth queue selection
Current item: C2 — Draft the first growth batch of eight entities`,
`Last confirmed main SHA: b9893b78d9e1f20b1d02e6f16747cc206fb66ccd
Last merged implementation PR: #418 Classify the first Phase C candidate scan
Current implementation PR: #419 Correct stale open candidate resolutions
Current phase: Phase C — Reviewed registry growth
Completed item: C1 — Candidate scan corrected against projected public entities
Current item: C2 — Draft the DX.Exchange reviewed record bundle`,
'checkpoint',
)

replaceOnce(
`### C1 completion result

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

Jupiter Perpetuals remains in research because its entity boundary versus the wider Jupiter platform is unresolved.`,
`### C1 completion result — corrected before C2

The initial C1 duplicate decisions were revalidated against the projected public registry. Twelve supposedly open candidates were already represented by reviewed HEI entities.

\`\`\`text
Candidates reviewed:             42
Add now:                          1
Needs further research:           0
Pending thin:                    29
Already canonical / duplicate:   12
First growth batch:               1
\`\`\`

Corrected first growth batch:

\`\`\`text
DX.Exchange
\`\`\`

Already-canonical corrections:

\`\`\`text
Aevo Perps / Byte Exchange / Curve DEX / dYdX V3 / dYdX V4
Gains Network / Joe DEX / Jupiter Perpetual Exchange
Orca DEX / Osmosis DEX / Quickswap Dex / Thorchain DEX
\`\`\`

The resolution index now points each corrected candidate to its projected entity ID.`,
'C1 result',
)

replaceOnce(
`Estimated remaining effort from the C1 completion checkpoint:

\`\`\`text
Implementation PRs: approximately 31-43
Working days: approximately 33-52
Calendar estimate: approximately 8-12 weeks
\`\`\``,
`Estimated remaining effort after the C1 overlap correction:

\`\`\`text
Implementation PRs: approximately 32-44
Working days: approximately 34-53
Calendar estimate: approximately 8-12 weeks
\`\`\``,
'estimate',
)

replaceOnce(
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
`## C1. Candidate scans and queue selection

Status: **COMPLETED in PR #418, corrected in PR #419**

The scan reviewed 42 candidates. A projected-public overlap audit then found 12 stale open resolutions already represented by reviewed HEI entities.

\`\`\`text
add_now:                          1
needs_research:                   0
pending_thin:                    29
out_of_scope_or_duplicate:       12
\`\`\`

Completed work:

- fixed stable candidate keys and one disposition for every scanned candidate;
- independently rechecked candidate names, proposed names, aliases, and product/version labels against projected entities;
- moved 12 stale open entries to \`already_canonical\` with target entity IDs;
- reduced the first growth batch to DX.Exchange;
- added strict open-candidate overlap validation to the resolution and candidate-scan gates.

Completion gate:

\`\`\`text
42 candidates retained in the historical scan
all current open resolution entries remain covered
12 already-canonical overlaps corrected
no open candidate overlaps a projected entity
first growth batch fixed at DX.Exchange
\`\`\``,
'C1 section',
)

replaceOnce(
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

The batch may be split into smaller implementation PRs, but the selected identities and naming decisions are fixed by C1.`,
`## C2. First growth record drafting

Status: **CURRENT**

Draft and validate one reviewed record bundle:

\`\`\`text
DX.Exchange
\`\`\`

Before selecting any later growth batch, run the strict projected-public overlap gate against all remaining pending-thin candidates.`,
'C2 section',
)

fs.writeFileSync(file, source, 'utf8')
console.log('Corrected the roadmap after the projected-public candidate overlap audit.')
