import fs from 'node:fs';

const roadmapPath = 'docs/HEI_V1_EXECUTION_ROADMAP.md';
const workflowPath = '.github/workflows/update-a2-u2-roadmap.yml';
const scriptPath = 'scripts/update-a2-u2-roadmap.mjs';

let text = fs.readFileSync(roadmapPath, 'utf8');

const checkpoint = `## 3. Current checkpoint

### 3.1 Last confirmed baseline

\`\`\`text
Checkpoint date: 2026-06-20
Last confirmed main SHA: cdcace0f9946f8a86f7b06ab1467670ee1e08171
Last merged implementation PR: #405 Review explicit Unknown origins — U1
Production verification workflow: 27858696613
Production verification result: success for earlier production baseline; current A2 work is GitHub-only
\`\`\`

### 3.2 Reviewed public counts

Confirmed on current \`main\` and unchanged by U2:

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
- structural \`country_or_origin\` omissions reduced to zero;
- explicit Unknown origin review U1 in PR #405;
- production endpoint, commit, count, safety-flag, and route verification.

### 3.5 Active work item

\`\`\`text
Current phase: Phase A — Structural entity-quality debt
Current item: A2 — Explicit Unknown origin review
Current implementation: U2 — remaining six records
True missing values: 0
Explicit Unknown values: 11
Expected reviewed Unknown values after merge: 11
Expected pending Unknown values after merge: 0
Next implementation item: A2 strict origin gate
\`\`\`

U2 decisions awaiting CI and merge:

- AidosMarket → retain \`Unknown\`
- 55 Global Markets → retain \`Unknown\`
- BCC Exchange (BitConnect Coin) → retain \`Unknown\`
- Txbit → retain \`Unknown\`
- Bitbaby → retain \`Unknown\`
- BitStorage → retain \`Unknown\`

### 3.6 Next action

Validate and merge U2. Then add a strict gate that rejects missing or null origins and requires the projected public explicit-Unknown set to match the reviewed allowlist exactly. After the gate passes, mark A2 complete and advance to A3 lineage review.

---`;

const sectionPattern = /## 3\. Current checkpoint[\s\S]*?---\n\n## 4\. Overall execution order/;
if (!sectionPattern.test(text)) throw new Error('Could not locate roadmap checkpoint section');
text = text.replace(sectionPattern, `${checkpoint}\n\n## 4. Overall execution order`);

text = text.replace(
  '6. Explicit `Unknown` U1 — five older canonical records: implementation complete, CI pending.\n7. Explicit `Unknown` U2 — six remaining records.\n8. Final strict-gate PR.',
  '6. Explicit `Unknown` U1 — five older canonical records: completed in PR #405.\n7. Explicit `Unknown` U2 — six remaining records: implementation complete, CI pending.\n8. Final strict-gate PR.'
);

text = text.replace(
  'Status: **IN PROGRESS — structural missing values are zero; 5 of 11 explicit Unknown values reviewed after U1**',
  'Status: **IN PROGRESS — origin research complete after U2; strict gate remains**'
);

fs.writeFileSync(roadmapPath, text);
for (const path of [workflowPath, scriptPath]) {
  if (fs.existsSync(path)) fs.rmSync(path);
}
