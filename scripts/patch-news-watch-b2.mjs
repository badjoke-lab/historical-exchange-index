import fs from 'node:fs'

const file = 'scripts/monitoring/monitors/news-and-event-watch.mjs'
let source = fs.readFileSync(file, 'utf8')

function replaceOnce(before, after, label) {
  const count = source.split(before).length - 1
  if (count !== 1) throw new Error(`${label}: expected one match, found ${count}`)
  source = source.replace(before, after)
}

replaceOnce(
  "import { classifyCandidate } from '../core/classify.mjs';\nimport { loadResolutionFiles, normalizeName } from '../core/load-watchlists.mjs';",
  "import { classifyCandidate } from '../core/classify.mjs';\nimport { candidateKeyFor } from '../core/candidate-identity.mjs';\nimport { loadResolutionFiles, loadWatchlists, normalizeName } from '../core/load-watchlists.mjs';",
  'imports',
)

replaceOnce(
  '  const duplicateCheck = duplicateCheckForCandidate(base, index);\n  const classification = classifyCandidate(base, duplicateCheck);',
  '  const candidateKey = candidateKeyFor(base);\n  const duplicateCheck = duplicateCheckForCandidate(base, index);\n  const classification = classifyCandidate(base, duplicateCheck);',
  'candidate key',
)

replaceOnce(
  '    candidate_id: base.candidate_id,\n    canonical_name: base.canonical_name,',
  '    candidate_id: candidateKey,\n    candidate_key: candidateKey,\n    canonical_name: base.canonical_name,',
  'candidate id',
)

replaceOnce(
  '  const resolutions = await loadResolutionFiles();',
  '  const [resolutions, history] = await Promise.all([loadResolutionFiles(), loadWatchlists()]);',
  'state loading',
)

replaceOnce(
  '  const allCandidates = rawCandidates.map((candidate, index) => toCandidateRecord(candidate, entityIndex, context?.runId, index + 1));\n  const candidates = allCandidates.filter((candidate) => isActionableNewsCandidate(candidate, resolutions) || isActionableRegulatoryCandidate(candidate, resolutions));',
  `  const allCandidates = rawCandidates
    .map((candidate, index) => toCandidateRecord(candidate, entityIndex, context?.runId, index + 1))
    .map((candidate) => {
      const historical = history.byKey.get(candidate.candidate_key) || null;
      const resolution = resolutions.match(candidate);
      return {
        ...candidate,
        first_seen_at: resolution?.first_seen_at || historical?.first_seen_at || new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
        seen_count: (historical?.occurrence_count || 0) + 1,
        is_new_candidate: !historical && !resolution,
        resolution_state: resolution?.state || null,
      };
    });
  const candidates = allCandidates.filter((candidate) => isActionableNewsCandidate(candidate, resolutions) || isActionableRegulatoryCandidate(candidate, resolutions));`,
  'candidate lifecycle',
)

replaceOnce(
  "      severity: 'medium',\n      category: candidate.source_category === 'regulatory_source' ? 'regulatory_actionable_candidate' : 'news_event_actionable_candidate',\n      title: `${candidate.source_category === 'regulatory_source' ? 'Regulatory' : 'News/event'} candidate: ${candidate.canonical_name}`,",
  "      severity: candidate.is_new_candidate ? 'medium' : 'low',\n      category: candidate.is_new_candidate ? (candidate.source_category === 'regulatory_source' ? 'regulatory_actionable_candidate_new' : 'news_event_actionable_candidate_new') : 'news_event_candidate_recurring',\n      title: `${candidate.is_new_candidate ? 'New' : 'Recurring'} ${candidate.source_category === 'regulatory_source' ? 'regulatory' : 'news/event'} candidate: ${candidate.canonical_name}`,",
  'finding lifecycle',
)

replaceOnce(
  '      dedupe_key: `${monitor}:actionable_candidate:${candidate.source_category}:${candidate.canonical_name.toLowerCase()}`,',
  '      dedupe_key: `${monitor}:actionable_candidate:${candidate.candidate_key}`,',
  'finding key',
)

replaceOnce(
  '        retained_candidates: candidates.length,\n        dropped_candidates: allCandidates.length - candidates.length,',
  '        retained_candidates: candidates.length,\n        new_candidates: candidates.filter((candidate) => candidate.is_new_candidate).length,\n        recurring_candidates: candidates.filter((candidate) => !candidate.is_new_candidate).length,\n        dropped_candidates: allCandidates.length - candidates.length,',
  'filter summary',
)

fs.writeFileSync(file, source, 'utf8')
console.log('News and event watch now uses stable candidate lifecycle state.')
