import fs from 'node:fs'
import { candidateKeyFromName } from './monitoring/core/candidate-identity.mjs'

const indexFile = 'data-staging/watchlists/resolution/index.json'
const index = JSON.parse(fs.readFileSync(indexFile, 'utf8'))
const byKey = new Map(index.entries.map((entry) => [entry.candidate_key, entry]))

function readCandidates(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'))
  return (data.candidates || []).map((item) => typeof item === 'string' ? item : item.name || item.canonical_name).filter(Boolean)
}

function add(name, { state, candidateClass, sourceFile, notes, targetEntityId = null, nextReviewAfter = null }) {
  const candidateKey = candidateKeyFromName(name)
  if (byKey.has(candidateKey)) return
  const entry = {
    candidate_key: candidateKey,
    canonical_name: name,
    aliases: [],
    candidate_class: candidateClass,
    state,
    first_seen_at: '2026-06-14',
    last_reviewed_at: '2026-06-14',
    target_entity_id: targetEntityId,
    source_files: [sourceFile],
    notes,
  }
  if (nextReviewAfter) entry.next_review_after = nextReviewAfter
  byKey.set(candidateKey, entry)
}

const outOfScopeFile = 'data-staging/watchlists/review/20260614-out-of-scope-candidates.json'
for (const name of readCandidates(outOfScopeFile)) {
  add(name, {
    state: 'out_of_scope',
    candidateClass: 'C',
    sourceFile: outOfScopeFile,
    notes: 'Reviewed in the initial 50-candidate classification and determined not to be a distinct HEI exchange entity.',
  })
}

const priorityFile = 'data-staging/watchlists/review/20260614-priority-research.json'
const priorityNames = new Set(readCandidates(priorityFile))
for (const name of priorityNames) {
  add(name, {
    state: 'needs_research',
    candidateClass: 'B',
    sourceFile: priorityFile,
    nextReviewAfter: '2026-07-01',
    notes: 'Priority research candidate. Requires entity-boundary, launch, current-status, duplicate, event, and evidence review before promotion.',
  })
}

for (const activeFile of [
  'data-staging/watchlists/review/20260614-active-later-01.json',
  'data-staging/watchlists/review/20260614-active-later-02.json',
]) {
  for (const name of readCandidates(activeFile)) {
    if (priorityNames.has(name)) continue
    add(name, {
      state: 'held',
      candidateClass: 'B',
      sourceFile: activeFile,
      nextReviewAfter: '2026-09-01',
      notes: 'Reviewed active candidate retained for later research when stronger official and independent evidence is available.',
    })
  }
}

add('GMX V2 Perps', {
  state: 'already_canonical',
  candidateClass: 'B',
  sourceFile: 'data-staging/watchlists/review/20260614-existing-candidates.json',
  targetEntityId: 'hei_ex_000244',
  notes: 'Reviewed as a GMX product or version rather than a separate exchange entity; represented by the canonical GMX record.',
})

index.entries = [...byKey.values()].sort((left, right) => left.candidate_key.localeCompare(right.candidate_key))
index.updated_at = '2026-06-22'
fs.writeFileSync(indexFile, `${JSON.stringify(index, null, 2)}\n`, 'utf8')
console.log(`Resolution index entries: ${index.entries.length}`)
console.log(`Added reviewed queue entries: ${index.entries.length - 17}`)
