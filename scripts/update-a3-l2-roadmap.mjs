import fs from 'node:fs'

const roadmapPath = 'docs/HEI_V1_EXECUTION_ROADMAP.md'
const scriptPath = 'scripts/update-a3-l2-roadmap.mjs'
const workflowPath = '.github/workflows/update-a3-l2-roadmap.yml'
let text = fs.readFileSync(roadmapPath, 'utf8')

const checkpoint = `## 3. Current checkpoint

### 3.1 Last confirmed baseline

\`\`\`text
Checkpoint date: 2026-06-21
Last confirmed main SHA: c187dab1f2c4ba441892de9247ae17ad2babf308
Last merged implementation PR: #409 Review existing lineage relationships — L1
Current implementation PR: #410 Review structured lineage candidates — L2
Production verification workflow: 27858696613
Production verification result: success for earlier production baseline; Phase A work remains GitHub-only
\`\`\`

### 3.2 Reviewed public counts

Confirmed unchanged by the A3-L2 read-only review:

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
- A3-L2 review of all twenty-five structured event/state candidates in PR #410;
- production endpoint, commit, count, safety-flag, and route verification.

### 3.5 Active work item

\`\`\`text
Current phase: Phase A — Structural entity-quality debt
Current item: A3 — Audit lineage candidates
Inventory implementation: PR #408
L1 existing-edge review: PR #409
L2 structured candidate review: PR #410
L1 dispositions: 11
  keep_one_way_documented: 4
  add_reciprocal: 3
  keep_bidirectional: 2
  remove_to_event_only: 2
L2 dispositions: 25
  link_now: 7
  document_only: 8
  unresolved: 10
Total structured dispositions: 36 / 36
Text-only watchlist: 52
Next implementation item: L3 consolidated closure gate and A3 completion report
\`\`\`

No canonical relationship field has been changed during A3. The reviewed actions remain queued for A4.

### 3.6 Next action

Create the A3-L3 closure gate. It must prove that the eleven L1 edges and twenty-five L2 candidates form a complete thirty-six-item reviewed set, preserve the fifty-two text-only signals as a secondary watchlist, publish one consolidated closure report, and advance the roadmap to A4.

---`

const checkpointPattern = /## 3\. Current checkpoint[\s\S]*?---\n\n## 4\. Overall execution order/
if (!checkpointPattern.test(text)) throw new Error('Current checkpoint section not found')
text = text.replace(checkpointPattern, `${checkpoint}\n\n## 4. Overall execution order`)
text = text.replace(
  '3. L2 — review twenty-five structured event/state candidates.\n4. L3 — commit reviewed dispositions and close A3.',
  '3. L2 — review twenty-five structured event/state candidates: completed in PR #410.\n4. L3 — consolidate reviewed dispositions and close A3.'
)
text = text.replace(
  'Status: **IN PROGRESS — inventory and L1 verified; L2 classification is next**',
  'Status: **IN PROGRESS — inventory, L1, and L2 verified; L3 closure is next**'
)

fs.writeFileSync(roadmapPath, text)
for (const file of [scriptPath, workflowPath]) {
  if (fs.existsSync(file)) fs.rmSync(file)
}
