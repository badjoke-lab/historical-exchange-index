import fs from 'node:fs'
import process from 'node:process'
import { loadResolutionFiles } from './monitoring/core/load-watchlists.mjs'

function readCandidates(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'))
  return (data.candidates || []).map((item) => typeof item === 'string' ? item : item.name || item.canonical_name).filter(Boolean)
}

const resolutions = await loadResolutionFiles()
const failures = []

function requireState(name, states, sourceFile) {
  const entry = resolutions.match({ canonical_name: name })
  if (!entry) {
    failures.push(`${sourceFile}: missing indexed candidate ${name}`)
    return
  }
  if (!states.includes(entry.state)) failures.push(`${sourceFile}: ${name} state=${entry.state}, expected ${states.join('|')}`)
}

const existingFile = 'data-staging/watchlists/review/20260614-existing-candidates.json'
for (const name of readCandidates(existingFile)) requireState(name, ['promoted', 'already_canonical'], existingFile)

const outOfScopeFile = 'data-staging/watchlists/review/20260614-out-of-scope-candidates.json'
for (const name of readCandidates(outOfScopeFile)) requireState(name, ['out_of_scope'], outOfScopeFile)

const priorityFile = 'data-staging/watchlists/review/20260614-priority-research.json'
for (const name of readCandidates(priorityFile)) requireState(name, ['needs_research'], priorityFile)

for (const activeFile of [
  'data-staging/watchlists/review/20260614-active-later-01.json',
  'data-staging/watchlists/review/20260614-active-later-02.json',
]) {
  for (const name of readCandidates(activeFile)) requireState(name, ['held', 'needs_research'], activeFile)
}

const summary = {
  existing_reviewed: readCandidates(existingFile).length,
  out_of_scope_reviewed: readCandidates(outOfScopeFile).length,
  priority_research_reviewed: readCandidates(priorityFile).length,
  active_later_reviewed: [
    'data-staging/watchlists/review/20260614-active-later-01.json',
    'data-staging/watchlists/review/20260614-active-later-02.json',
  ].flatMap(readCandidates).length,
  failures: failures.length,
}

console.log(`Reviewed queue coverage: ${JSON.stringify(summary)}`)
if (failures.length > 0) {
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}
console.log('Reviewed queue coverage: pass')
