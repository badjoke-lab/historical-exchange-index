import fs from 'node:fs';

const roadmapPath = 'docs/HEI_V1_EXECUTION_ROADMAP.md';
const workflowPath = '.github/workflows/update-a2-batch5-roadmap.yml';
const scriptPath = 'scripts/update-a2-batch5-roadmap.mjs';

let text = fs.readFileSync(roadmapPath, 'utf8');

const checkpoint = `## 3. Current checkpoint

### 3.1 Last confirmed baseline

\`\`\`text
Checkpoint date: 2026-06-20
Last confirmed main SHA: 76884f918035ff5ceef0c129e64b00ae7459e479
Last merged implementation PR: #403 Resolve A2 country origin gaps — Batch 4
Production verification workflow: 27858696613
Production verification result: success for earlier data baseline; post-Batch 5 verification required after merge
\`\`\`

### 3.2 Reviewed public counts

Confirmed on current \`main\`:

\`\`\`text
Entities:  412
Events:    687
Evidence: 1606
\`\`\`

Expected after the current Batch 5 PR:

\`\`\`text
Entities:  412
Events:    687
Evidence: 1608
\`\`\`

### 3.3 Maximum observed IDs

Expected after the current Batch 5 PR:

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
- A2 country/origin Batch 1 in PR #399;
- A2 country/origin Batch 2 in PR #400;
- roadmap checkpoint recovery and revised schedule in PR #401;
- A2 country/origin Batch 3 in PR #402;
- A2 country/origin Batch 4 in PR #403;
- production endpoint, commit, count, safety-flag, and route verification.

### 3.5 Active work item

\`\`\`text
Current phase: Phase A — Structural entity-quality debt
Current item: A2 — Fill missing country_or_origin
Current implementation: Batch 5 — OPNX and CryptoBridge guarded corrections
Expected A2 progress after merge: 21 of 21 true-missing values resolved
Expected true missing values remaining: 0
Expected explicit Unknown values awaiting review: 11
Next implementation item: explicit Unknown origin review
\`\`\`

Batch 5 decisions awaiting CI and merge:

- OPNX → \`Seychelles\`
- CryptoBridge → \`BitShares ecosystem\`

Expected explicit \`Unknown\` review queue:

- Coin-Swap
- AllCrypt
- McxNOW
- Crypto-Trade
- CoinedUp
- AidosMarket
- 55 Global Markets
- BCC Exchange (BitConnect Coin)
- Txbit
- Bitbaby
- BitStorage

### 3.6 Next action

Validate and merge A2 Batch 5. Then review all eleven explicit \`Unknown\` values, retain \`Unknown\` where evidence remains insufficient, enable the strict structural gate, and advance to A3 lineage review.

---`;

const sectionPattern = /## 3\. Current checkpoint[\s\S]*?---\n\n## 4\. Overall execution order/;
if (!sectionPattern.test(text)) throw new Error('Could not locate roadmap checkpoint section');
text = text.replace(sectionPattern, `${checkpoint}\n\n## 4. Overall execution order`);

text = text.replace(
  '4. Batch 4 — four active protocol and exchange records: implementation complete, CI pending.\n5. Batch 5 — historical canonical records OPNX and CryptoBridge.\n6. Explicit `Unknown` review — eleven records.\n7. Final strict-gate PR.',
  '4. Batch 4 — four active protocol and exchange records: completed in PR #403.\n5. Batch 5 — OPNX and CryptoBridge guarded corrections: implementation complete, CI pending.\n6. Explicit `Unknown` review — eleven records.\n7. Final strict-gate PR.'
);

text = text.replace(
  'Status: **IN PROGRESS — 2 true-missing values expected after Batch 4**',
  'Status: **IN PROGRESS — 0 true-missing values expected after Batch 5; Unknown review remains**'
);

fs.writeFileSync(roadmapPath, text);
for (const path of [workflowPath, scriptPath]) {
  if (fs.existsSync(path)) fs.rmSync(path);
}
