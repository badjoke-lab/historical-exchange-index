import fs from 'node:fs';

const roadmapPath = 'docs/HEI_V1_EXECUTION_ROADMAP.md';
const workflowPath = '.github/workflows/update-a2-u1-roadmap.yml';
const scriptPath = 'scripts/update-a2-u1-roadmap.mjs';

let text = fs.readFileSync(roadmapPath, 'utf8');

const checkpoint = `## 3. Current checkpoint

### 3.1 Last confirmed baseline

\`\`\`text
Checkpoint date: 2026-06-20
Last confirmed main SHA: 2a78aadbd54c62b662defb884283a0bb1b4be75e
Last merged implementation PR: #404 Resolve A2 country origin gaps — Batch 5
Production verification workflow: 27858696613
Production verification result: success for earlier production baseline; current A2 work is GitHub-only
\`\`\`

### 3.2 Reviewed public counts

Confirmed on current \`main\` and unchanged by U1:

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
- A2 country/origin Batch 1 in PR #399;
- A2 country/origin Batch 2 in PR #400;
- roadmap checkpoint recovery and revised schedule in PR #401;
- A2 country/origin Batch 3 in PR #402;
- A2 country/origin Batch 4 in PR #403;
- A2 country/origin Batch 5 in PR #404;
- structural \`country_or_origin\` omissions reduced to zero;
- production endpoint, commit, count, safety-flag, and route verification.

### 3.5 Active work item

\`\`\`text
Current phase: Phase A — Structural entity-quality debt
Current item: A2 — Explicit Unknown origin review
Current implementation: U1 — five older canonical records
True missing values: 0
Explicit Unknown values: 11
Expected reviewed Unknown values after merge: 5
Expected pending Unknown values after merge: 6
Next implementation item: U2 — remaining six explicit Unknown records
\`\`\`

U1 decisions awaiting CI and merge:

- Coin-Swap → retain \`Unknown\`
- AllCrypt → retain \`Unknown\`
- McxNOW → retain \`Unknown\`
- Crypto-Trade → retain \`Unknown\`
- CoinedUp → retain \`Unknown\`

U2 queue:

- AidosMarket
- 55 Global Markets
- BCC Exchange (BitConnect Coin)
- Txbit
- Bitbaby
- BitStorage

### 3.6 Next action

Validate and merge U1. Then research and document the six U2 records. After all eleven explicit \`Unknown\` values have a reviewed disposition, add the strict origin gate and advance to A3 lineage review.

---`;

const sectionPattern = /## 3\. Current checkpoint[\s\S]*?---\n\n## 4\. Overall execution order/;
if (!sectionPattern.test(text)) throw new Error('Could not locate roadmap checkpoint section');
text = text.replace(sectionPattern, `${checkpoint}\n\n## 4. Overall execution order`);

text = text.replace(
  '5. Batch 5 — OPNX and CryptoBridge guarded corrections: implementation complete, CI pending.\n6. Explicit `Unknown` review — eleven records.\n7. Final strict-gate PR.',
  '5. Batch 5 — OPNX and CryptoBridge guarded corrections: completed in PR #404.\n6. Explicit `Unknown` U1 — five older canonical records: implementation complete, CI pending.\n7. Explicit `Unknown` U2 — six remaining records.\n8. Final strict-gate PR.'
);

text = text.replace(
  'Status: **IN PROGRESS — 0 true-missing values expected after Batch 5; Unknown review remains**',
  'Status: **IN PROGRESS — structural missing values are zero; 5 of 11 explicit Unknown values reviewed after U1**'
);

fs.writeFileSync(roadmapPath, text);
for (const path of [workflowPath, scriptPath]) {
  if (fs.existsSync(path)) fs.rmSync(path);
}
