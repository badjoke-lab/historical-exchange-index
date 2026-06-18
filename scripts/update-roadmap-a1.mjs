import fs from 'node:fs'

const file = 'docs/HEI_V1_EXECUTION_ROADMAP.md'
let text = fs.readFileSync(file, 'utf8')

const replacements = [
  [
    'Last confirmed main SHA: 23c0ea46c05df2e2ef607effe157e6ce04569c04\nLast merged implementation PR: #391 Normalize legacy evidence claim scopes',
    'Last confirmed main SHA before A1: 8882d248ac06f69876ddd03ae784bd9be813169c\nLast merged implementation PR: #392 Add HEI v1 execution roadmap',
  ],
  [
    'Roadmap checkpoint: R0\nState: roadmap file being placed in the repository\nImplementation work after roadmap: A1 official_url_status normalization\nActive implementation branch after this PR: none assumed; create from current main',
    'Roadmap checkpoint: A1\nState: official_url_status normalization completed in PR #393\nCount effect: no entity, event, or evidence count change\nValidation: 13 invalid values reduced to 0; strict CI gate added\nNext implementation item: A2 country_or_origin completion',
  ],
  [
    'Create the A1 branch from the then-current `main`, rerun the entity-quality audit, and normalize all invalid `official_url_status` values with record-specific decisions.',
    'Start A2 from the then-current `main`, re-audit missing `country_or_origin` values, and resolve OPNX and CryptoBridge without unsupported country guesses.',
  ],
]

for (const [before, after] of replacements) {
  if (!text.includes(before)) throw new Error(`Roadmap checkpoint text not found: ${before.slice(0, 40)}`)
  text = text.replace(before, after)
}

text = text.replace('Status: **IN PROGRESS**', 'Status: **COMPLETE**')
text = text.replace('Status: **NEXT**', 'Status: **COMPLETE**')

const a2Start = text.indexOf('## A2. Fill missing `country_or_origin`')
const a3Start = text.indexOf('## A3-A4.', a2Start)
if (a2Start < 0 || a3Start < 0) throw new Error('A2 section not found')
const a2 = text.slice(a2Start, a3Start).replace('Status: pending', 'Status: **NEXT**')
text = text.slice(0, a2Start) + a2 + text.slice(a3Start)

text = text.replace(
  '- machine-readable public layer and validation',
  '- machine-readable public layer and validation\n- repository-resident HEI v1 execution roadmap\n- A1 official URL status normalization and strict CI validation',
)

fs.writeFileSync(file, text, 'utf8')
console.log('Updated HEI v1 roadmap checkpoint for A1.')
