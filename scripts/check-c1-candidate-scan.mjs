import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { loadCanonicalData } from './monitoring/core/load-canonical-data.mjs'
import { normalizeCandidateName } from './monitoring/core/candidate-identity.mjs'

const root = process.cwd()
const scanPath = path.join(root, 'data-staging/candidate-scans/c1-scan-01.json')
const resolutionPath = path.join(root, 'data-staging/watchlists/resolution/index.json')
const outputArg = process.argv.find((arg) => arg.startsWith('--output='))
const selfTest = process.argv.includes('--self-test')
const allowedDispositions = new Set(['add_now', 'needs_research', 'pending_thin', 'out_of_scope_or_duplicate'])
const openStates = new Set(['needs_research', 'held'])
const terminalDuplicateStates = new Set(['already_canonical', 'duplicate', 'out_of_scope'])

function entityIdentityIndex(entities) {
  const index = new Map()
  for (const entity of entities) {
    for (const raw of [entity.canonical_name, entity.slug, ...(entity.aliases || [])]) {
      const identity = normalizeCandidateName(raw)
      if (!identity) continue
      const owners = index.get(identity) || []
      owners.push(entity)
      index.set(identity, owners)
    }
  }
  return index
}

function candidateMatches(item, identityIndex) {
  const matches = new Map()
  for (const raw of [
    item.canonical_name,
    item.proposed_canonical_name,
    ...(item.aliases || []),
    ...(item.proposed_aliases || []),
  ]) {
    const identity = normalizeCandidateName(raw)
    if (!identity) continue
    for (const entity of identityIndex.get(identity) || []) matches.set(entity.id, entity)
  }
  return [...matches.values()]
}

function validate(scan, resolution, projectedEntities) {
  const failures = []
  const fail = (message) => failures.push(message)
  if (scan.version !== 1 || scan.scan_id !== 'c1-scan-01') fail('unexpected scan version or id')
  if (!Array.isArray(scan.candidates)) fail('candidates must be an array')
  if (!Array.isArray(scan.first_growth_batch)) fail('first_growth_batch must be an array')

  const candidates = scan.candidates || []
  const keys = candidates.map((item) => item.candidate_key)
  if (new Set(keys).size !== keys.length) fail('candidate keys must be unique')
  const scanKeys = new Set(keys)
  const resolutionByKey = new Map((resolution.entries || []).map((entry) => [entry.candidate_key, entry]))
  const openResolutionEntries = (resolution.entries || []).filter((entry) => openStates.has(entry.state))
  for (const entry of openResolutionEntries) {
    if (!scanKeys.has(entry.candidate_key)) fail(`open resolution entry is missing from scan: ${entry.candidate_key}`)
  }

  const identityIndex = entityIdentityIndex(projectedEntities)
  const projectedById = new Map(projectedEntities.map((entity) => [entity.id, entity]))

  for (const item of candidates) {
    const resolutionEntry = resolutionByKey.get(item.candidate_key)
    if (!resolutionEntry) {
      fail(`${item.candidate_key}: missing resolution entry`)
      continue
    }
    const matches = candidateMatches(item, identityIndex)

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

    if (openStates.has(resolutionEntry.state) && matches.length > 0) {
      fail(`${item.candidate_key}: open candidate overlaps projected entity ${matches.map((entity) => entity.id).join(',')}`)
    }

    if (terminalDuplicateStates.has(resolutionEntry.state)) {
      if (item.scan_disposition !== 'out_of_scope_or_duplicate') {
        fail(`${item.candidate_key}: terminal ${resolutionEntry.state} resolution requires out_of_scope_or_duplicate disposition`)
      }
      if (resolutionEntry.state === 'already_canonical') {
        if (item.duplicate_status !== 'already_canonical') fail(`${item.candidate_key}: already_canonical resolution requires matching duplicate_status`)
        if (!resolutionEntry.target_entity_id || !projectedById.has(resolutionEntry.target_entity_id)) {
          fail(`${item.candidate_key}: already_canonical resolution requires a valid target_entity_id`)
        }
        if (!matches.some((entity) => entity.id === resolutionEntry.target_entity_id)) {
          fail(`${item.candidate_key}: candidate identities do not match target ${resolutionEntry.target_entity_id}`)
        }
      }
    }

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
      if (matches.length > 0 && resolutionEntry.state !== 'promoted') {
        fail(`${item.candidate_key}: add_now candidate already overlaps projected entity ${matches.map((entity) => entity.id).join(',')}`)
      }
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
  const entity = { id: 'hei_ex_1', slug: 'one', canonical_name: 'One', aliases: ['One DEX'] }
  const resolution = { entries: [{ candidate_key: 'candidate:one', canonical_name: 'One DEX', state: 'needs_research' }] }
  const base = {
    version: 1,
    scan_id: 'c1-scan-01',
    counts: { total: 1, needs_research: 1, pending_thin: 0, add_now: 0, out_of_scope_or_duplicate: 0 },
    first_growth_batch: [],
    candidates: [{
      candidate_key: 'candidate:one',
      canonical_name: 'One DEX',
      aliases: [],
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
  const overlap = validate(base, resolution, [entity])
  if (!overlap.failures.some((failure) => failure.includes('overlaps projected entity'))) throw new Error('open-overlap fixture did not fail')

  const corrected = structuredClone(base)
  corrected.candidates[0].scan_disposition = 'out_of_scope_or_duplicate'
  corrected.candidates[0].review_status = 'reviewed'
  corrected.candidates[0].duplicate_status = 'already_canonical'
  corrected.counts = { total: 1, needs_research: 0, pending_thin: 0, add_now: 0, out_of_scope_or_duplicate: 1 }
  const correctedResolution = { entries: [{ candidate_key: 'candidate:one', canonical_name: 'One DEX', state: 'already_canonical', target_entity_id: 'hei_ex_1' }] }
  const correctedResult = validate(corrected, correctedResolution, [entity])
  if (correctedResult.failures.some((failure) => !failure.includes('scan size'))) throw new Error(`corrected overlap fixture failed: ${correctedResult.failures.join('; ')}`)

  const addNow = structuredClone(base)
  addNow.candidates[0].canonical_name = 'Two'
  addNow.candidates[0].scan_disposition = 'add_now'
  addNow.candidates[0].review_status = 'reviewed'
  addNow.candidates[0].entity_boundary = 'distinct_entity'
  addNow.candidates[0].duplicate_status = 'clear'
  addNow.candidates[0].likely_type = 'dex'
  addNow.candidates[0].likely_status = 'active'
  addNow.candidates[0].assigned_batch = 'batch-1'
  addNow.candidates[0].confidence = 'high'
  addNow.counts = { total: 1, needs_research: 0, pending_thin: 0, add_now: 1, out_of_scope_or_duplicate: 0 }
  const addResult = validate(addNow, { entries: [{ candidate_key: 'candidate:one', state: 'needs_research' }] }, [entity])
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
const projected = await loadCanonicalData()
const result = validate(scan, resolution, projected.entities)
const report = {
  generated_at: new Date().toISOString(),
  scan_id: scan.scan_id,
  counts: result.derivedCounts,
  first_growth_batch_size: scan.first_growth_batch?.length || 0,
  projected_entities: projected.entities.length,
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
console.log(`Projected entities checked: ${report.projected_entities}`)
if (result.failures.length > 0) {
  for (const failure of result.failures) console.error(`- ${failure}`)
  process.exit(1)
}
console.log('C1 candidate scan gate: pass')
