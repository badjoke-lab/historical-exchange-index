import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const recordsDir = path.join(root, 'records', 'exchanges')

const simpleReplacements = [
  ['"event_type": "listed_reference"', '"event_type": "other"', 60],
  ['"event_type": "rebrand"', '"event_type": "rebranded"', 1],
  ['"event_type": "legal_proceeding"', '"event_type": "bankruptcy_filed"', 1],
  ['"event_type": "recovery_or_settlement"', '"event_type": "other"', 1],
  ['"event_type": "acquisition_announced"', '"event_type": "other"', 1],
  ['"event_type": "launch_or_public_operation"', '"event_type": "launched"', 1],
  ['"event_status_effect": "inactive_or_unchanged"', '"event_status_effect": "none"', 2],
  ['"source_type": "archived_website"', '"source_type": "archive_capture"', 1],
  ['"source_type": "regulator_statement"', '"source_type": "regulatory_notice"', 1],
  ['"source_type": "secondary_report"', '"source_type": "news_article"', 20],
  ['"source_type": "news_report"', '"source_type": "news_article"', 8],
  ['"source_type": "regulatory_statement"', '"source_type": "regulatory_notice"', 3],
  ['"claim_scope": "background"', '"claim_scope": "entity"', 1],
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

for (const [before, , expected] of simpleReplacements) {
  const count = [...contents.values()].reduce((sum, text) => sum + countOccurrences(text, before), 0)
  if (count !== expected) throw new Error(`Expected ${expected} occurrences of ${before}, found ${count}`)
}

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

for (const item of special) {
  const matches = [...contents.entries()].filter(([, text]) => text.includes(`"id": "${item.id}"`))
  if (matches.length !== 1) throw new Error(`${item.id}: expected one containing file, found ${matches.length}`)
  const [file, text] = matches[0]
  if (countOccurrences(text, item.before) !== 1) throw new Error(`${item.id}: expected one ${item.before}`)
  contents.set(file, text.replace(item.before, item.after))
}

for (const [before, after] of simpleReplacements) {
  for (const [file, text] of contents) contents.set(file, text.split(before).join(after))
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
console.log('Event field changes: 69')
console.log('Evidence field changes: 36')
