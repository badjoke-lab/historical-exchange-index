import fs from 'node:fs'

const roadmapPath = 'docs/HEI_V1_EXECUTION_ROADMAP.md'
const scriptPath = 'scripts/update-a3-l1-roadmap.mjs'
const workflowPath = '.github/workflows/update-a3-l1-roadmap.yml'
let text = fs.readFileSync(roadmapPath, 'utf8')

const checkpoint = `## 3. Current checkpoint

### 3.1 Last confirmed baseline

\`\`\`text
Checkpoint date: 2026-06-21
Last confirmed main SHA: 6bfe9aafd8488feaaebefa3beb3a88820ca2c175
Last merged implementation PR: #408 Add A3 lineage inventory audit
Current implementation PR: #409 Review existing lineage relationships — L1
Production verification workflow: 27858696613
Production verification result: success for earlier production baseline; Phase A work remains GitHub-only
\`\`\`

### 3.2 Reviewed public counts

Confirmed unchanged by the A3-L1 read-only review:

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
- A2 strict country/origin checker and CI gate in PR #407;
- A3 projected-public lineage inventory verified in PR #408;
- A3-L1 review of all eleven existing relationship edges in PR #409;
- production endpoint, commit, count, safety-flag, and route verification.

### 3.5 Active work item

\`\`\`text
Current phase: Phase A — Structural entity-quality debt
Current item: A3 — Audit lineage candidates
Inventory implementation: PR #408
L1 existing-edge review: PR #409
L1 dispositions:
  keep_one_way_documented: 4
  add_reciprocal: 3
  keep_bidirectional: 2
  remove_to_event_only: 2
L2 structured event/state queue: 25
Text-only watchlist: 52
Next implementation item: L2 review of the twenty-five structured candidates
\`\`\`

The L1 review does not change canonical relationship fields. A4 will apply only reviewed actions after A3 closes.

### 3.6 Next action

Review the twenty-five structured event/state candidates without existing relationship fields. Record each as \`link_now\`, \`document_only\`, or \`unresolved\`, including target identity, direction, and supporting event/evidence IDs. Then commit the complete A3 disposition set and close A3.

---`

const checkpointPattern = /## 3\. Current checkpoint[\s\S]*?---\n\n## 4\. Overall execution order/
if (!checkpointPattern.test(text)) throw new Error('Current checkpoint section not found')
text = text.replace(checkpointPattern, `${checkpoint}\n\n## 4. Overall execution order`)
text = text.replace(
  '2. L1 — review eleven existing relationship records.\n3. L2 — review twenty-five structured event/state candidates.',
  '2. L1 — review eleven existing relationship records: completed in PR #409.\n3. L2 — review twenty-five structured event/state candidates.'
)
text = text.replace(
  'Status: **IN PROGRESS — inventory verified; L1 classification is next**',
  'Status: **IN PROGRESS — inventory and L1 verified; L2 classification is next**'
)

fs.writeFileSync(roadmapPath, text)
for (const file of [scriptPath, workflowPath]) {
  if (fs.existsSync(file)) fs.rmSync(file)
}
