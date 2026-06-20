import fs from 'node:fs'

const roadmapPath = 'docs/HEI_V1_EXECUTION_ROADMAP.md'
const workflowPath = '.github/workflows/update-a3-inventory-roadmap.yml'
const scriptPath = 'scripts/update-a3-inventory-roadmap.mjs'

let text = fs.readFileSync(roadmapPath, 'utf8')

const checkpoint = `## 3. Current checkpoint

### 3.1 Last confirmed baseline

\`\`\`text
Checkpoint date: 2026-06-20
Last confirmed main SHA: 3bcecfc46bc48151a9688d09ca735cc56fdc183b
Last merged implementation PR: #407 Enforce strict country origin gate
Current implementation PR: #408 Add A3 lineage inventory audit
Production verification workflow: 27858696613
Production verification result: success for earlier production baseline; Phase A work remains GitHub-only
\`\`\`

### 3.2 Reviewed public counts

Confirmed unchanged by the A3 read-only inventory:

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
- production endpoint, commit, count, safety-flag, and route verification.

### 3.5 Active work item

\`\`\`text
Current phase: Phase A — Structural entity-quality debt
Current item: A3 — Audit lineage candidates
Inventory implementation: PR #408
Structured review queue: 36
  linked_existing: 11
  link_now: 0
  document_only: 2
  unresolved: 23
Text-only watchlist: 52
Missing relationship targets: 0
Self relationships: 0
Non-reciprocal relationships: 9
Next implementation item: L1 review of the eleven existing relationships
\`\`\`

The 52 text-only matches remain a secondary watchlist. They are not part of the primary A3 closure queue unless stronger structured evidence is added.

### 3.6 Next action

Review the eleven existing predecessor/successor relationships. Classify each as \`keep_bidirectional\`, \`add_reciprocal\`, \`keep_one_way_documented\`, \`remove_to_event_only\`, or \`unresolved\`. Then review the twenty-five structured event/state candidates and commit a machine-readable disposition list.

---`

const checkpointPattern = /## 3\. Current checkpoint[\s\S]*?---\n\n## 4\. Overall execution order/
if (!checkpointPattern.test(text)) throw new Error('Could not locate checkpoint section')
text = text.replace(checkpointPattern, `${checkpoint}\n\n## 4. Overall execution order`)

text = text.replace(
  'Do not create thin successor entities only to fill lineage fields.\n\nStatus: **IN PROGRESS — inventory and classification are next**',
  `Do not create thin successor entities only to fill lineage fields.

Execution batches:

1. Inventory tooling and verified projected-public report: implemented in PR #408.
2. L1 — review eleven existing relationship records.
3. L2 — review twenty-five structured event/state candidates.
4. L3 — commit reviewed dispositions and close A3.

Verified inventory:

\`\`\`text
structured candidates = 36
text-only watchlist = 52
missing targets = 0
self relationships = 0
non-reciprocal relationships = 9
\`\`\`

Status: **IN PROGRESS — inventory verified; L1 classification is next**`
)

fs.writeFileSync(roadmapPath, text)
for (const file of [workflowPath, scriptPath]) {
  if (fs.existsSync(file)) fs.rmSync(file)
}
