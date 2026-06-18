import fs from 'node:fs'

const file = 'docs/HEI_V1_EXECUTION_ROADMAP.md'
let text = fs.readFileSync(file, 'utf8')

function replaceOnce(before, after) {
  if (text.includes(after)) return
  if (!text.includes(before)) throw new Error('Expected roadmap text was not found')
  text = text.replace(before, after)
}

replaceOnce(
  'Last confirmed main SHA: cb3d80e4b5751537b7589d140821262a740bb491\nLast merged implementation PR: #393 Unify public HTML and machine-readable registry state',
  'Last confirmed main SHA: 40353a503c64d4f24af449d989b6cbd70192cb03\nLast merged implementation PR: #394 Normalize canonical official URL statuses',
)
replaceOnce(
  'Roadmap checkpoint: A1 complete / A2 next\nState: A1 implementation completed in PR #394\nNext implementation item: A2 fill missing country_or_origin\nInterrupt fix baseline: PR #393 / cb3d80e4b5751537b7589d140821262a740bb491',
  'Roadmap checkpoint: deployment output repair\nState: explicit build contract in PR #396\nPaused next implementation item: A2 fill missing country_or_origin\nBaseline: PR #394 / 40353a503c64d4f24af449d989b6cbd70192cb03',
)
replaceOnce(
  'Begin A2 country-of-origin completion from the post-PR #394 main branch, preserving the fixed official URL status enum and strict CI gate.',
  'Complete PR #396, verify preview and public machine-readable endpoints, record the audit, then resume A2 country-of-origin completion.',
)

fs.writeFileSync(file, text)
