import fs from 'node:fs'

const roadmapPath = 'docs/HEI_V1_EXECUTION_ROADMAP.md'
const auditPath = 'docs/audits/HEI_A2_EXPLICIT_UNKNOWN_REVIEW_2026-06-20.md'
const workflowPath = '.github/workflows/finalize-a2-strict-gate-docs.yml'
const scriptPath = 'scripts/finalize-a2-strict-gate-docs.mjs'

let audit = fs.readFileSync(auditPath, 'utf8')
audit = audit.replace('## U2 decisions\n', '## U2 decisions — PR #406\n')

const auditFinal = `## Verified completed-review state

GitHub CI run \`27865450962\` and strict-gate run \`27865450969\` confirmed:

\`\`\`text
Projected public entities:       412
Projected public events:         687
Projected public evidence:      1608
True missing origin values:        0
Invalid origin types:               0
Explicit Unknown values:          11
Reviewed allowlist values:        11
Reviewed explicit Unknown values: 11
Pending explicit Unknown review:   0
Noncanonical Unknown tokens:        0
Stale allowlist entries:            0
Allowlist metadata mismatches:      0
Allowlist validation errors:        0
Strict gate passes:              true
\`\`\`

## Reviewed explicit-Unknown allowlist

The machine-readable source of truth is:

\`\`\`text
config/reviewed-unknown-origins.json
\`\`\`

It contains exactly:

\`\`\`text
hei_ex_000212  Coin-Swap
hei_ex_000215  AllCrypt
hei_ex_000218  McxNOW
hei_ex_000246  Crypto-Trade
hei_ex_000250  CoinedUp
hei_ex_000296  AidosMarket
hei_ex_000297  55 Global Markets
hei_ex_000300  BCC Exchange (BitConnect Coin)
hei_ex_000312  Txbit
hei_ex_000382  Bitbaby
hei_ex_000394  BitStorage
\`\`\`

## Strict gate — PR #407

The permanent gate consists of:

- \`scripts/check-country-or-origin-strict.mjs\`
- \`config/reviewed-unknown-origins.json\`
- \`.github/workflows/country-origin-strict.yml\`
- retained artifact \`country-origin-strict-report\`

The checker runs against the projected public entity layer after guarded corrections and reviewed bundles are applied. It fails when:

1. \`country_or_origin\` is missing, null, empty, or an invalid type;
2. an Unknown-like token is not the canonical value \`Unknown\`;
3. a projected public Unknown entity is absent from the reviewed allowlist;
4. an allowlisted entity is missing or no longer has \`Unknown\`;
5. allowlist slug or canonical-name metadata drifts;
6. the allowlist is malformed or contains duplicate IDs or slugs.

The workflow also executes negative self-tests for missing values, unreviewed Unknown values, stale entries, noncanonical tokens, and metadata mismatch.

## A2 result

A2 is complete:

- structural missing values are zero;
- all eleven explicit Unknown values have documented dispositions;
- the actual Unknown set and reviewed allowlist match exactly;
- future unreviewed or missing origin values fail CI;
- no unsupported country assignment was introduced.

The next roadmap item is A3 lineage-candidate audit.
`

const auditPattern = /## Expected completed-review state[\s\S]*$/
if (!auditPattern.test(audit)) throw new Error('Could not locate audit final section')
audit = audit.replace(auditPattern, auditFinal)
fs.writeFileSync(auditPath, audit)

let roadmap = fs.readFileSync(roadmapPath, 'utf8')
const checkpoint = `## 3. Current checkpoint

### 3.1 Last confirmed baseline

\`\`\`text
Checkpoint date: 2026-06-20
Last confirmed main SHA: 7c898aab0d5b6ef74f67696775e65d7cdeba8181
Last merged implementation PR: #406 Review explicit Unknown origins — U2
Current implementation PR: #407 Enforce strict country origin gate
Production verification workflow: 27858696613
Production verification result: success for earlier production baseline; Phase A work remains GitHub-only
\`\`\`

### 3.2 Reviewed public counts

Confirmed unchanged by the A2 strict gate:

\`\`\`text
Entities:  412
Events:    687
Evidence: 1608
\`\`\`

### 3.3 Maximum observed IDs

\`\`\`text
Maximum entity ID:    hei_ex_000525
Maximum event ID:     hei_ev_002079
Maximum evidence ID:  hei_src_003197
\`\`\`

### 3.4 Completed execution items

- guarded reviewed entity-correction mechanism;
- Coinone launch-date correction and launch evidence;
- legacy \`event_type\`, \`source_type\`, and \`claim_scope\` normalization with strict gates;
- weekly monitoring implementation;
- monthly read-only review workflow and 2026-05 backfill;
- machine-readable public layer and validation;
- public HTML / JSON / metadata count unification;
- A1 official URL status normalization in PR #394;
- reproducible Cloudflare Pages deployment controls in PR #397;
- Cloudflare policy applied: production from \`main\`, preview deployments disabled;
- A2 country/origin Batches 1-5 in PRs #399, #400, #402, #403, and #404;
- explicit Unknown reviews U1 and U2 in PRs #405 and #406;
- structural origin omissions reduced to zero;
- reviewed Unknown allowlist fixed at eleven entities;
- A2 strict country/origin checker and CI gate verified in PR #407;
- production endpoint, commit, count, safety-flag, and route verification.

### 3.5 Active work item

\`\`\`text
Current phase: Phase A — Structural entity-quality debt
Current item: A3 — Audit lineage candidates
A2 status: complete
True missing country_or_origin: 0
Reviewed explicit Unknown: 11
Pending origin review: 0
Strict origin gate: passing
Next implementation item: lineage candidate inventory and classification
\`\`\`

A3 must classify acquisition, merger, rebrand, migration, predecessor, and successor candidates as:

- \`link_now\`
- \`document_only\`
- \`unresolved\`

### 3.6 Next action

Generate a projected-public lineage inventory from existing relationship fields, lifecycle statuses, and acquisition / merger / rebrand / migration events. Identify asymmetric, missing-target, and evidence-thin candidates. Do not create thin successor entities merely to fill relationship fields.

---`

const checkpointPattern = /## 3\. Current checkpoint[\s\S]*?---\n\n## 4\. Overall execution order/
if (!checkpointPattern.test(roadmap)) throw new Error('Could not locate roadmap checkpoint')
roadmap = roadmap.replace(checkpointPattern, `${checkpoint}\n\n## 4. Overall execution order`)

roadmap = roadmap.replace(
  '7. Explicit `Unknown` U2 — six remaining records: implementation complete, CI pending.\n8. Final strict-gate PR.',
  '7. Explicit `Unknown` U2 — six remaining records: completed in PR #406.\n8. Final strict-gate PR: completed in PR #407.'
)
roadmap = roadmap.replace(
  'Status: **IN PROGRESS — origin research complete after U2; strict gate remains**',
  'Status: **COMPLETED in PR #407**'
)
roadmap = roadmap.replace(
  /(## A3\. Audit lineage candidates[\s\S]*?Do not create thin successor entities only to fill lineage fields\.\n\n)Status: pending/,
  '$1Status: **IN PROGRESS — inventory and classification are next**'
)
fs.writeFileSync(roadmapPath, roadmap)

for (const file of [workflowPath, scriptPath]) {
  if (fs.existsSync(file)) fs.rmSync(file)
}
