import fs from 'node:fs'
import path from 'node:path'

const file = path.resolve('docs/HEI_V1_EXECUTION_ROADMAP.md')
let text = fs.readFileSync(file, 'utf8')

const replacements = [
  [
`Checkpoint date: 2026-06-22
Last confirmed main SHA: a34ef6a3898bda5d32d291e4660d44689230a011
Last merged implementation PR: #411 Close A3 lineage audit — L3
Current implementation PR: #412 Apply reviewed A4 lineage links
Production verification workflow: 27858696613
Production verification result: success for earlier production baseline; A4 remains GitHub-only and does not change Cloudflare or production settings`,
`Checkpoint date: 2026-06-22
Last confirmed main SHA: cf190972c4994fb6667267086fc14e23bae44873
Last merged implementation PR: #412 Apply reviewed A4 lineage links
Current implementation PR: #413 Add permanent entity quality audit
Production verification workflow: 27858696613
Production verification result: success for earlier production baseline; A5 remains GitHub-only and does not change Cloudflare or production settings`,
  ],
  [
`- A4 reviewed lineage application, permanent validation, and frozen A3 baseline protection in PR #412;
- production endpoint, commit, count, safety-flag, and route verification.`,
`- A4 reviewed lineage application, permanent validation, and frozen A3 baseline protection in PR #412;
- A5 permanent projected-public entity-quality audit and pull-request/main gate in PR #413;
- production endpoint, commit, count, safety-flag, and route verification.`,
  ],
  [
`Current phase: Phase A — Structural entity-quality debt
Completed item: A4 — Apply safe lineage links
A3 inventory implementation: PR #408
A3 L1 existing-edge review: PR #409
A3 L2 structured candidate review: PR #410
A3 closure: PR #411
A4 implementation: PR #412
Reviewed A4 lineage field changes: 14
Affected entities: 14
Projected public counts: 412 entities / 687 events / 1608 evidence
Missing lineage targets: 0
Self relationships: 0
Frozen A3 baseline retained for review-integrity checks
Current item: A5 — Permanent entity-quality audit
Next implementation item: add the permanent entity-quality audit and CI or scheduled gate`,
`Current phase: Phase B — Monitoring and count regression guarantees
Completed item: A5 — Permanent entity-quality audit
A4 implementation: PR #412
A5 implementation: PR #413
Projected public counts: 412 entities / 687 events / 1608 evidence
A5 projected entities audited: 412
Critical structural findings: 0
Remaining quality queue: 2 high / 1 medium / 30 low
Reusable audit command: data:check-entity-quality
Permanent pull-request/main quality gate: enabled
Current item: B1 — Full monitoring run after structural cleanup
Next implementation item: run all monitoring groups, confirm the canonical guard, and verify that closed Phase A debt is not rediscovered`,
  ],
  [
`A3 changed no canonical relationship fields. PR #412 applies the fourteen reviewed A4 lineage-field changes while retaining document-only and unresolved cases outside canonical links.`,
`Phase A is complete after PR #413. A4 applied the fourteen reviewed lineage changes, and A5 now checks the full projected-public entity set while preserving non-critical quality findings as an improvement queue.`,
  ],
  [
`Proceed to A5 after PR #412: run the permanent entity-quality audit, convert the reusable checks into a CI or scheduled gate, and keep Cloudflare and production changes out of scope until the GitHub-side phase is complete.`,
`Proceed to B1 after PR #413: run all monitoring groups against the structurally cleaned projected-public dataset, verify the canonical guard, and keep Cloudflare and production changes out of scope.`,
  ],
  [
`Status: pending

---

# Phase B — Monitoring and count regression guarantees`,
`Status: **COMPLETED in PR #413 — 412 projected entities audited, critical findings = 0**

Remaining non-blocking queue from the A5 baseline:

- high: 2 active-side URL-status conflicts;
- medium: 1 missing original domain;
- low: 30 lineage-text review signals.

---

# Phase B — Monitoring and count regression guarantees`,
  ],
]

for (const [before, after] of replacements) {
  const count = text.split(before).length - 1
  if (count !== 1) throw new Error(`roadmap replacement expected once, found ${count}: ${before.slice(0, 80)}`)
  text = text.replace(before, after)
}

fs.writeFileSync(file, text, 'utf8')
console.log('Updated HEI roadmap checkpoint for A5 completion.')
