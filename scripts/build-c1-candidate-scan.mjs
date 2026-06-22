import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const sourcePath = path.join(root, 'data-staging/watchlists/resolution/index.json')
const outputPath = path.join(root, 'data-staging/candidate-scans/c1-scan-01.json')
const index = JSON.parse(fs.readFileSync(sourcePath, 'utf8'))

const openStates = new Set(['needs_research', 'held'])
const priorityOrder = { needs_research: 0, held: 1 }
const openEntries = (index.entries || [])
  .filter((entry) => openStates.has(entry.state))
  .sort((left, right) => {
    const priority = priorityOrder[left.state] - priorityOrder[right.state]
    return priority || left.canonical_name.localeCompare(right.canonical_name)
  })

const candidates = openEntries.map((entry) => ({
  candidate_key: entry.candidate_key,
  canonical_name: entry.canonical_name,
  aliases: entry.aliases || [],
  source_resolution_state: entry.state,
  scan_disposition: entry.state === 'needs_research' ? 'needs_research' : 'pending_thin',
  review_status: 'queued',
  research_priority: entry.state === 'needs_research' ? 'priority' : 'normal',
  entity_boundary: 'unknown',
  duplicate_status: 'pending',
  likely_type: null,
  likely_status: null,
  official_sources: [],
  independent_sources: [],
  minimum_record_shape: {
    meaningful_events: 0,
    evidence_records: 0,
  },
  confidence: 'unreviewed',
  unresolved_questions: [
    'Confirm HEI entity boundary and whether this is a distinct exchange identity.',
    'Confirm launch or operating-era evidence.',
    'Confirm current or terminal status evidence.',
    'Check canonical names, aliases, domains, and product-version overlap.',
  ],
  source_files: entry.source_files || [],
  first_seen_at: entry.first_seen_at || null,
  last_reviewed_at: entry.last_reviewed_at || null,
  next_review_after: entry.next_review_after || null,
  assigned_batch: null,
  notes: entry.notes || '',
}))

const counts = {
  total: candidates.length,
  needs_research: candidates.filter((item) => item.scan_disposition === 'needs_research').length,
  pending_thin: candidates.filter((item) => item.scan_disposition === 'pending_thin').length,
  add_now: candidates.filter((item) => item.scan_disposition === 'add_now').length,
  out_of_scope_or_duplicate: candidates.filter((item) => item.scan_disposition === 'out_of_scope_or_duplicate').length,
}

if (counts.total !== 42 || counts.needs_research !== 11 || counts.pending_thin !== 31) {
  throw new Error(`Unexpected C1 scan composition: ${JSON.stringify(counts)}`)
}

const manifest = {
  version: 1,
  scan_id: 'c1-scan-01',
  created_at: '2026-06-22',
  updated_at: '2026-06-22',
  source: 'data-staging/watchlists/resolution/index.json',
  purpose: 'First Phase C scan of all open B2 candidate resolutions. This is internal reviewed-work metadata and is not canonical public data.',
  allowed_dispositions: [
    'add_now',
    'needs_research',
    'pending_thin',
    'out_of_scope_or_duplicate',
  ],
  counts,
  first_growth_batch: [],
  candidates,
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
console.log(`Wrote ${path.relative(root, outputPath)} with ${counts.total} candidates.`)
console.log(`Priority research: ${counts.needs_research}; pending thin: ${counts.pending_thin}`)
