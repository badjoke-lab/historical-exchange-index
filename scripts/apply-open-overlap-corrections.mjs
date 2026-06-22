import fs from 'node:fs'

const resolutionFile = 'data-staging/watchlists/resolution/index.json'
const scanFile = 'data-staging/candidate-scans/c1-scan-01.json'
const resolution = JSON.parse(fs.readFileSync(resolutionFile, 'utf8'))
const scan = JSON.parse(fs.readFileSync(scanFile, 'utf8'))

const corrections = new Map([
  ['candidate:aevo-perps', { entity_id: 'hei_ex_000519', entity_name: 'Aevo', entity_slug: 'aevo', record_file: 'records/exchanges/aevo.json', boundary: 'product_or_version' }],
  ['candidate:byte-exchange', { entity_id: 'hei_ex_000416', entity_name: 'Byte Exchange', entity_slug: 'byte-exchange', record_file: 'records/exchanges/byte-exchange.json', boundary: 'distinct_entity' }],
  ['candidate:curve-dex', { entity_id: 'hei_ex_000511', entity_name: 'Curve Finance', entity_slug: 'curve-finance', record_file: 'records/exchanges/curve-finance.json', boundary: 'distinct_entity' }],
  ['candidate:dydx-v3', { entity_id: 'hei_ex_000517', entity_name: 'dYdX', entity_slug: 'dydx', record_file: 'records/exchanges/dydx.json', boundary: 'product_or_version' }],
  ['candidate:dydx-v4', { entity_id: 'hei_ex_000517', entity_name: 'dYdX', entity_slug: 'dydx', record_file: 'records/exchanges/dydx.json', boundary: 'product_or_version' }],
  ['candidate:gains-network', { entity_id: 'hei_ex_000515', entity_name: 'gTrade', entity_slug: 'gtrade', record_file: 'records/exchanges/gtrade.json', boundary: 'product_or_version' }],
  ['candidate:joe-dex', { entity_id: 'hei_ex_000520', entity_name: 'LFJ', entity_slug: 'lfj', record_file: 'records/exchanges/lfj.json', boundary: 'product_or_version' }],
  ['candidate:jupiter-perpetual-exchange', { entity_id: 'hei_ex_000518', entity_name: 'Jupiter', entity_slug: 'jupiter', record_file: 'records/exchanges/jupiter.json', boundary: 'product_or_version' }],
  ['candidate:orca-dex', { entity_id: 'hei_ex_000513', entity_name: 'Orca', entity_slug: 'orca', record_file: 'records/exchanges/orca.json', boundary: 'distinct_entity' }],
  ['candidate:osmosis-dex', { entity_id: 'hei_ex_000514', entity_name: 'Osmosis', entity_slug: 'osmosis', record_file: 'records/exchanges/osmosis.json', boundary: 'distinct_entity' }],
  ['candidate:quickswap-dex', { entity_id: 'hei_ex_000512', entity_name: 'QuickSwap', entity_slug: 'quickswap', record_file: 'records/exchanges/quickswap.json', boundary: 'distinct_entity' }],
  ['candidate:thorchain-dex', { entity_id: 'hei_ex_000516', entity_name: 'THORChain', entity_slug: 'thorchain', record_file: 'records/exchanges/thorchain.json', boundary: 'distinct_entity' }],
])

let correctedResolutions = 0
for (const entry of resolution.entries || []) {
  const correction = corrections.get(entry.candidate_key)
  if (!correction) continue
  entry.state = 'already_canonical'
  entry.target_entity_id = correction.entity_id
  entry.last_reviewed_at = '2026-06-22'
  delete entry.next_review_after
  entry.source_files = [...new Set([...(entry.source_files || []), correction.record_file])]
  entry.notes = `Projected-public overlap audit confirmed this candidate is already represented by ${correction.entity_name} (${correction.entity_id}). The candidate must not return as open research or new growth work.`
  correctedResolutions += 1
}

let correctedScanEntries = 0
for (const candidate of scan.candidates || []) {
  const correction = corrections.get(candidate.candidate_key)
  if (!correction) continue
  candidate.scan_disposition = 'out_of_scope_or_duplicate'
  candidate.review_status = 'reviewed'
  candidate.entity_boundary = correction.boundary
  candidate.duplicate_status = 'already_canonical'
  candidate.target_entity_id = correction.entity_id
  candidate.matched_entity_name = correction.entity_name
  candidate.matched_entity_slug = correction.entity_slug
  candidate.assigned_batch = null
  candidate.confidence = 'high'
  candidate.unresolved_questions = []
  candidate.last_reviewed_at = '2026-06-22'
  candidate.review_notes = `Corrected after projected-public overlap audit: the candidate identity is already represented by ${correction.entity_name} (${correction.entity_id}).`
  correctedScanEntries += 1
}

scan.first_growth_batch = ['candidate:dx-exchange']
scan.updated_at = '2026-06-22'
scan.correction = {
  corrected_at: '2026-06-22',
  reason: 'C1 duplicate decisions were revalidated against the projected public registry after C2 record drafting found existing reviewed bundles.',
  already_canonical_candidates: [...corrections.keys()].sort(),
}
scan.counts = {
  total: scan.candidates.length,
  needs_research: scan.candidates.filter((item) => item.scan_disposition === 'needs_research').length,
  pending_thin: scan.candidates.filter((item) => item.scan_disposition === 'pending_thin').length,
  add_now: scan.candidates.filter((item) => item.scan_disposition === 'add_now').length,
  out_of_scope_or_duplicate: scan.candidates.filter((item) => item.scan_disposition === 'out_of_scope_or_duplicate').length,
}

resolution.updated_at = '2026-06-22'

if (correctedResolutions !== 12 || correctedScanEntries !== 12) {
  throw new Error(`Expected 12 corrections, got resolution=${correctedResolutions}, scan=${correctedScanEntries}`)
}
if (scan.counts.total !== 42 || scan.counts.add_now !== 1 || scan.counts.needs_research !== 0 || scan.counts.pending_thin !== 29 || scan.counts.out_of_scope_or_duplicate !== 12) {
  throw new Error(`Unexpected corrected scan counts: ${JSON.stringify(scan.counts)}`)
}
if (scan.first_growth_batch.length !== 1 || scan.first_growth_batch[0] !== 'candidate:dx-exchange') {
  throw new Error('Corrected first growth batch must contain only DX.Exchange')
}

const stateCounts = resolution.entries.reduce((counts, entry) => {
  counts[entry.state] = (counts[entry.state] || 0) + 1
  return counts
}, {})
const expectedStateCounts = {
  promoted: 14,
  held: 29,
  out_of_scope: 8,
  duplicate: 0,
  already_canonical: 14,
  needs_research: 1,
}
for (const [state, expected] of Object.entries(expectedStateCounts)) {
  if ((stateCounts[state] || 0) !== expected) throw new Error(`${state}: expected ${expected}, got ${stateCounts[state] || 0}`)
}

fs.writeFileSync(resolutionFile, `${JSON.stringify(resolution, null, 2)}\n`, 'utf8')
fs.writeFileSync(scanFile, `${JSON.stringify(scan, null, 2)}\n`, 'utf8')
console.log(`Corrected resolution entries: ${correctedResolutions}`)
console.log(`Corrected scan entries: ${correctedScanEntries}`)
console.log(`Resolution states: ${JSON.stringify(stateCounts)}`)
console.log(`Scan counts: ${JSON.stringify(scan.counts)}`)
