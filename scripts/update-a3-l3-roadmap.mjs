import fs from 'node:fs'

const file = 'docs/HEI_V1_EXECUTION_ROADMAP.md'
const self = 'scripts/update-a3-l3-roadmap.mjs'
const workflow = '.github/workflows/update-a3-l3-roadmap.yml'
let text = fs.readFileSync(file, 'utf8')

const replacements = [
  ['Last confirmed main SHA: c187dab1f2c4ba441892de9247ae17ad2babf308', 'Last confirmed main SHA: d162cbf0b445aec3dcb7beb08cd78f302c844045'],
  ['Last merged implementation PR: #409 Review existing lineage relationships — L1', 'Last merged implementation PR: #410 Review structured lineage candidates — L2'],
  ['Current implementation PR: #410 Review structured lineage candidates — L2', 'Current implementation PR: #411 Close A3 lineage audit — L3'],
  ['Confirmed unchanged by the A3-L2 read-only review:', 'Confirmed unchanged by the complete A3 read-only audit:'],
  ['- A3-L2 review of all twenty-five structured event/state candidates in PR #410;', '- A3-L2 review of all twenty-five structured event/state candidates in PR #410;\n- A3-L3 consolidated closure gate and completion report in PR #411;'],
  ['Current item: A3 — Audit lineage candidates', 'Completed item: A3 — Audit lineage candidates'],
  ['Next implementation item: L3 consolidated closure gate and A3 completion report', 'Current item: A4 — Apply safe lineage links\nNext implementation item: apply reviewed A4 canonical-field changes with post-application validation'],
  ['Create the A3-L3 closure gate. It must prove that the eleven L1 edges and twenty-five L2 candidates form a complete thirty-six-item reviewed set, preserve the fifty-two text-only signals as a secondary watchlist, publish one consolidated closure report, and advance the roadmap to A4.', 'Create the A4 implementation PR. Apply only reviewed reciprocal, one-way, and removal actions; verify zero broken IDs and zero unintended relationships; and leave document-only and unresolved cases unchanged.'],
  ['4. L3 — consolidate reviewed dispositions and close A3.', '4. L3 — consolidate reviewed dispositions and close A3: completed in PR #411.'],
  ['Status: **IN PROGRESS — inventory, L1, and L2 verified; L3 closure is next**', 'Status: **COMPLETED in PR #411 — 36 / 36 structured candidates reviewed**'],
  ['Status: pending\n\n## A5. Permanent entity-quality audit', 'Status: **NEXT — reviewed A4 change queue is ready**\n\n## A5. Permanent entity-quality audit'],
]

for (const [from, to] of replacements) {
  if (!text.includes(from)) throw new Error(`roadmap target not found: ${from}`)
  text = text.replace(from, to)
}

fs.writeFileSync(file, text)
for (const target of [self, workflow]) if (fs.existsSync(target)) fs.rmSync(target)
