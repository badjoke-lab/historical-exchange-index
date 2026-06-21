import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const recordsDir = path.join(root, 'records', 'exchanges')

const simpleReplacements = [
  ['"event_type": "listed_reference"', '"event_type": "other"'],
  ['"event_type": "rebrand"', '"event_type": "rebranded"'],
  ['"event_type": "legal_proceeding"', '"event_type": "bankruptcy_filed"'],
  ['"event_type": "recovery_or_settlement"', '"event_type": "other"'],
  ['"event_type": "acquisition_announced"', '"event_type": "other"'],
  ['"event_type": "launch_or_public_operation"', '"event_type": "launched"'],
  ['"event_status_effect": "inactive_or_unchanged"', '"event_status_effect": "none"'],
  ['"source_type": "archived_website"', '"source_type": "archive_capture"'],
  ['"source_type": "regulator_statement"', '"source_type": "regulatory_notice"'],
  ['"source_type": "secondary_report"', '"source_type": "news_article"'],
  ['"source_type": "news_report"', '"source_type": "news_article"'],
  ['"source_type": "regulatory_statement"', '"source_type": "regulatory_notice"'],
  ['"claim_scope": "background"', '"claim_scope": "entity"'],
]

const special = [
  {
    id: 'hei_ev_000729',
    before: '"event_type": "security_breach"',
    after: '"event_type": "hack"',
  },
  {
    id: 'hei_ev_000734',
    before: '"event_type": "security_breach"',
    after: '"event_type": "exploit"',
  },
  {
    id: 'hei_src_001643',
    before: '"source_type": "legal_document"',
    after: '"source_type": "official_statement"',
  },
  {
    id: 'hei_src_001651',
    before: '"source_type": "legal_document"',
    after: '"source_type": "regulatory_notice"',
  },
]

function countOccurrences(text, needle) {
  return text.split(needle).length - 1
}

const files = fs.readdirSync(recordsDir)
  .filter((name) => name.endsWith('.json'))
  .sort()

const contents = new Map(files.map((name) => {
  const file = path.join(recordsDir, name)
  return [file, fs.readFileSync(file, 'utf8')]
}))

const replacementCounts = new Map()
for (const [before, after] of simpleReplacements) {
  let count = 0
  for (const [file, text] of contents) {
    const occurrences = countOccurrences(text, before)
    if (occurrences === 0) continue
    count += occurrences
    contents.set(file, text.split(before).join(after))
  }
  if (count === 0) throw new Error(`No source occurrences found for ${before}`)
  replacementCounts.set(before, count)
}

for (const item of special) {
  let changed = 0
  for (const [file, text] of contents) {
    if (!text.includes(`"id": "${item.id}"`)) continue
    const occurrences = countOccurrences(text, item.before)
    if (occurrences === 0) continue
    contents.set(file, text.replace(item.before, item.after))
    changed += 1
  }
  if (changed === 0) throw new Error(`${item.id}: no matching legacy value found`)
  replacementCounts.set(item.id, changed)
}

let changedFiles = 0
for (const [file, text] of contents) {
  const before = fs.readFileSync(file, 'utf8')
  if (before === text) continue
  fs.writeFileSync(file, text, 'utf8')
  changedFiles += 1
}

if (changedFiles === 0) throw new Error('No reviewed bundle files changed')
console.log(`Normalized reviewed bundle enums in ${changedFiles} file(s).`)
for (const [key, count] of replacementCounts) console.log(`${key}: ${count}`)
