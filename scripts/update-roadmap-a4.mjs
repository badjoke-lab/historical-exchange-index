import fs from 'node:fs'
import path from 'node:path'

const file = path.resolve('docs/HEI_V1_EXECUTION_ROADMAP.md')
let text = fs.readFileSync(file, 'utf8')

const replacements = [
  [
`Checkpoint date: 2026-06-21
Last confirmed main SHA: d162cbf0b445aec3dcb7beb08cd78f302c844045
Last merged implementation PR: #410 Review structured lineage candidates — L2
Current implementation PR: #411 Close A3 lineage audit — L3
Production verification workflow: 27858696613
Production verification result: success for earlier production baseline; Phase A work remains GitHub-only`,
`Checkpoint date: 2026-06-22
Last confirmed main SHA: a34ef6a3898bda5d32d291e4660d44689230a011
Last merged implementation PR: #411 Close A3 lineage audit — L3
Current implementation PR: #412 Apply reviewed A4 lineage links
Production verification workflow: 27858696613
Production verification result: success for earlier production baseline; A4 remains GitHub-only and does not change Cloudflare or production settings`,
  ],
  [
`- A3-L3 consolidated closure gate and completion report in PR #411;
- production endpoint, commit, count, safety-flag, and route verification.`,
`- A3-L3 consolidated closure gate and completion report in PR #411;
- A4 reviewed lineage application, permanent validation, and frozen A3 baseline protection in PR #412;
- production endpoint, commit, count, safety-flag, and route verification.`,
  ],
  [
`Current phase: Phase A — Structural entity-quality debt
Completed item: A3 — Audit lineage candidates
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
Current item: A4 — Apply safe lineage links
Next implementation item: apply reviewed A4 canonical-field changes with post-application validation`,
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
  ],
  [
`No canonical relationship field has been changed during A3. The reviewed actions remain queued for A4.`,
`A3 changed no canonical relationship fields. PR #412 applies the fourteen reviewed A4 lineage-field changes while retaining document-only and unresolved cases outside canonical links.`,
  ],
  [
`Create the A4 implementation PR. Apply only reviewed reciprocal, one-way, and removal actions; verify zero broken IDs and zero unintended relationships; and leave document-only and unresolved cases unchanged.`,
`Proceed to A5 after PR #412: run the permanent entity-quality audit, convert the reusable checks into a CI or scheduled gate, and keep Cloudflare and production changes out of scope until the GitHub-side phase is complete.`,
  ],
  [
`Status: **NEXT — reviewed A4 change queue is ready**`,
`Status: **COMPLETED in PR #412 — 14 reviewed lineage field changes across 14 entities**`,
  ],
]

for (const [before, after] of replacements) {
  const count = text.split(before).length - 1
  if (count !== 1) throw new Error(`roadmap replacement expected once, found ${count}: ${before.slice(0, 80)}`)
  text = text.replace(before, after)
}

fs.writeFileSync(file, text, 'utf8')
console.log('Updated HEI roadmap checkpoint for A4 completion.')
