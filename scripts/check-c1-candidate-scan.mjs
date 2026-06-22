import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const scanPath = path.join(root, 'data-staging/candidate-scans/c1-scan-01.json')
const resolutionPath = path.join(root, 'data-staging/watchlists/resolution/index.json')
const outputArg = process.argv.find((arg) => arg.startsWith('--output='))
const selfTest = process.argv.includes('--self-test')
const allowedDispositions = new Set(['add_now', 'needs_research', 'pending_thin', 'out_of_scope_or_duplicate'])

function validate(scan, resolution) {
  const failures = []
  const fail = (message) => failures.push(message)
  if (scan.version !== 1 || scan.scan_id !== 'c1-scan-01') fail('unexpected scan version or id')
  if (!Array.isArray(scan.candidates)) fail('candidates must be an array')
  if (!Array.isArray(scan.first_growth_batch)) fail('first_growth_batch must be an array')

  const candidates = scan.candidates || []
  const keys = candidates.map((item) => item.candidate_key)
  if (new Set(keys).size !== keys.length) fail('candidate keys must be unique')

  const openResolutionEntries = (resolution.entries || []).filter((entry) => ['needs_research', 'held'].includes(entry.state))
  const openKeys = new Set(openResolutionEntries.map((entry) => entry.candidate_key))
  const scanKeys = new Set(keys)
  if (openKeys.size !== scanKeys.size || [...openKeys].some((key) => !scanKeys.has(key))) {
    fail('scan candidates must exactly match all open resolution entries')
  }

  for (const item of candidates) {
    if (!allowedDispositions.has(item.scan_disposition)) fail(`${item.candidate_key}: invalid scan_disposition`)
    if (!['queued', 'in_review', 'reviewed'].includes(item.review_status)) fail(`${item.candidate_key}: invalid review_status`)
    if (!['priority', 'normal'].includes(item.research_priority)) fail(`${item.candidate_key}: invalid research_priority`)
    if (!['unknown', 'distinct_entity', 'product_or_version', 'protocol_not_exchange'].includes(item.entity_boundary)) {
      fail(`${item.candidate_key}: invalid entity_boundary`)
    }
    if (!['pending', 'clear', 'duplicate', 'already_canonical'].includes(item.duplicate_status)) {
      fail(`${item.candidate_key}: invalid duplicate_status`)
    }
    if (!Array.isArray(item.official_sources) || !Array.isArray(item.independent_sources)) {
      fail(`${item.candidate_key}: source arrays are required`)
    }
    if (!Array.isArray(item.unresolved_questions)) fail(`${item.candidate_key}: unresolved_questions must be an array`)
    if (item.scan_disposition === 'add_now') {
      if (item.review_status !== 'reviewed') fail(`${item.candidate_key}: add_now must be reviewed`)
      if (item.entity_boundary !== 'distinct_entity') fail(`${item.candidate_key}: add_now requires distinct_entity boundary`)
      if (item.duplicate_status !== 'clear') fail(`${item.candidate_key}: add_now requires clear duplicate status`)
      if (!['cex', 'dex', 'hybrid'].includes(item.likely_type)) fail(`${item.candidate_key}: add_now requires likely_type`)
      if (!item.likely_status) fail(`${item.candidate_key}: add_now requires likely_status`)
      if (item.official_sources.length < 1) fail(`${item.candidate_key}: add_now requires an official source`)
      if (item.independent_sources.length < 1) fail(`${item.candidate_key}: add_now requires an independent source`)
      if ((item.minimum_record_shape?.meaningful_events || 0) < 1) fail(`${item.candidate_key}: add_now requires a meaningful event`)
      if ((item.minimum_record_shape?.evidence_records || 0) < 2) fail(`${item.candidate_key}: add_now requires at least two evidence records`)
      if (!['medium', 'high'].includes(item.confidence)) fail(`${item.candidate_key}: add_now requires medium or high confidence`)
      if (!item.assigned_batch) fail(`${item.candidate_key}: add_now requires assigned_batch`)
    }
  }

  for (const key of scan.first_growth_batch || []) {
    const item = candidates.find((candidate) => candidate.candidate_key === key)
    if (!item) fail(`first_growth_batch references missing candidate: ${key}`)
    else if (item.scan_disposition !== 'add_now') fail(`first_growth_batch candidate is not add_now: ${key}`)
  }

  const derivedCounts = {
    total: candidates.length,
    needs_research: candidates.filter((item) => item.scan_disposition === 'needs_research').length,
    pending_thin: candidates.filter((item) => item.scan_disposition === 'pending_thin').length,
    add_now: candidates.filter((item) => item.scan_disposition === 'add_now').length,
    out_of_scope_or_duplicate: candidates.filter((item) => item.scan_disposition === 'out_of_scope_or_duplicate').length,
  }
  if (JSON.stringify(scan.counts) !== JSON.stringify(derivedCounts)) fail('stored scan counts do not match candidate dispositions')
  if (derivedCounts.total < 30 || derivedCounts.total > 50) fail(`scan size must be 30-50, got ${derivedCounts.total}`)

  return { failures, derivedCounts }
}

function runSelfTest() {
  const resolution = { entries: [{ candidate_key: 'candidate:one', state: 'needs_research' }] }
  const base = {
    version: 1,
    scan_id: 'c1-scan-01',
    counts: { total: 1, needs_research: 1, pending_thin: 0, add_now: 0, out_of_scope_or_duplicate: 0 },
    first_growth_batch: [],
    candidates: [{
      candidate_key: 'candidate:one',
      scan_disposition: 'needs_research',
      review_status: 'queued',
      research_priority: 'priority',
      entity_boundary: 'unknown',
      duplicate_status: 'pending',
      official_sources: [],
      independent_sources: [],
      unresolved_questions: [],
      minimum_record_shape: { meaningful_events: 0, evidence_records: 0 },
    }],
  }
  const result = validate(base, resolution)
  if (!result.failures.some((failure) => failure.includes('scan size'))) throw new Error('small-scan fixture did not fail')
  const addNow = structuredClone(base)
  addNow.candidates[0].scan_disposition = 'add_now'
  addNow.counts = { total: 1, needs_research: 0, pending_thin: 0, add_now: 1, out_of_scope_or_duplicate: 0 }
  const addResult = validate(addNow, resolution)
  if (!addResult.failures.some((failure) => failure.includes('official source'))) throw new Error('thin add_now fixture did not fail')
  console.log('C1 candidate scan self-test: pass')
}

if (selfTest) {
  runSelfTest()
  process.exit(0)
}

if (!fs.existsSync(scanPath)) throw new Error('missing data-staging/candidate-scans/c1-scan-01.json')
const scan = JSON.parse(fs.readFileSync(scanPath, 'utf8'))
const resolution = JSON.parse(fs.readFileSync(resolutionPath, 'utf8'))
const result = validate(scan, resolution)
const report = {
  generated_at: new Date().toISOString(),
  scan_id: scan.scan_id,
  counts: result.derivedCounts,
  first_growth_batch_size: scan.first_growth_batch?.length || 0,
  failures: result.failures,
  status: result.failures.length === 0 ? 'pass' : 'fail',
}
if (outputArg) {
  const outputPath = path.resolve(root, outputArg.slice('--output='.length))
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}
console.log(`C1 scan candidates: ${report.counts.total}`)
console.log(`Dispositions: ${JSON.stringify(report.counts)}`)
console.log(`First growth batch: ${report.first_growth_batch_size}`)
if (result.failures.length > 0) {
  for (const failure of result.failures) console.error(`- ${failure}`)
  process.exit(1)
}
console.log('C1 candidate scan gate: pass')
