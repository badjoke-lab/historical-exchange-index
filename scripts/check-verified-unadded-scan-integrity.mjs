import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const scansDir = path.join(root, 'docs/backlog/scans')
const allowedDispositions = new Set([
  'add_now',
  'needs_research',
  'pending_thin',
  'out_of_scope_or_duplicate',
])

function gitBlobSha(content) {
  const body = Buffer.from(content, 'utf8')
  const header = Buffer.from(`blob ${body.length}\0`, 'utf8')
  return crypto.createHash('sha1').update(Buffer.concat([header, body])).digest('hex')
}

function parseJsonl(content, sourcePath) {
  const rows = []
  const seen = new Set()
  for (const [index, rawLine] of content.split(/\r?\n/).entries()) {
    const line = rawLine.trim()
    if (!line) continue
    let row
    try {
      row = JSON.parse(line)
    } catch (error) {
      throw new Error(`${sourcePath}:${index + 1}: invalid JSONL: ${error.message}`)
    }
    if (!row.candidate_id) throw new Error(`${sourcePath}:${index + 1}: candidate_id is required`)
    if (seen.has(row.candidate_id)) throw new Error(`${sourcePath}:${index + 1}: duplicate candidate_id ${row.candidate_id}`)
    seen.add(row.candidate_id)
    rows.push(row)
  }
  return rows
}

function numericCandidateId(value) {
  const match = /^hei_unadded_(\d{4})$/.exec(value || '')
  if (!match) throw new Error(`invalid candidate id: ${value}`)
  return Number(match[1])
}

function deriveCounts(entries) {
  const counts = {
    add_now: 0,
    needs_research: 0,
    pending_thin: 0,
    out_of_scope_or_duplicate: 0,
  }
  for (const entry of entries) {
    if (!allowedDispositions.has(entry.disposition)) {
      throw new Error(`${entry.candidate_id}: invalid disposition ${entry.disposition}`)
    }
    counts[entry.disposition] += 1
  }
  return counts
}

function validateManifest(manifest, sourceContent, manifestPath) {
  const failures = []
  const fail = (message) => failures.push(`${manifestPath}: ${message}`)

  if (manifest.version !== 1) fail('version must be 1')
  if (!manifest.scan_id) fail('scan_id is required')
  if (!manifest.source_path) fail('source_path is required')
  if (!manifest.source_blob_sha) fail('source_blob_sha is required')
  if (!manifest.range?.start || !manifest.range?.end) fail('range start/end are required')
  if (!Array.isArray(manifest.entries)) fail('entries must be an array')
  if (failures.length > 0) return failures

  const actualBlobSha = gitBlobSha(sourceContent)
  if (manifest.source_blob_sha !== actualBlobSha) {
    fail(`source blob drift: stored ${manifest.source_blob_sha}, actual ${actualBlobSha}`)
  }

  let sourceRows
  try {
    sourceRows = parseJsonl(sourceContent, manifest.source_path)
  } catch (error) {
    fail(error.message)
    return failures
  }
  const sourceById = new Map(sourceRows.map((row) => [row.candidate_id, row]))

  const start = numericCandidateId(manifest.range.start)
  const end = numericCandidateId(manifest.range.end)
  const expectedIds = []
  for (let value = start; value <= end; value += 1) {
    expectedIds.push(`hei_unadded_${String(value).padStart(4, '0')}`)
  }

  if (manifest.range.record_count !== expectedIds.length) {
    fail(`range.record_count must be ${expectedIds.length}`)
  }
  if (manifest.entries.length !== expectedIds.length) {
    fail(`entries length must be ${expectedIds.length}, got ${manifest.entries.length}`)
  }

  const manifestIds = manifest.entries.map((entry) => entry.candidate_id)
  if (new Set(manifestIds).size !== manifestIds.length) fail('manifest candidate IDs must be unique')
  if (JSON.stringify(manifestIds) !== JSON.stringify(expectedIds)) {
    fail('manifest entries must cover the full range in candidate-id order')
  }

  for (const entry of manifest.entries) {
    const source = sourceById.get(entry.candidate_id)
    if (!source) {
      fail(`${entry.candidate_id}: missing from source JSONL`)
      continue
    }
    if (entry.name !== source.name) {
      fail(`${entry.candidate_id}: name drift: stored "${entry.name}", source "${source.name}"`)
    }
    if (entry.slug !== source.slug) {
      fail(`${entry.candidate_id}: slug drift: stored "${entry.slug}", source "${source.slug}"`)
    }
  }

  let derivedCounts
  try {
    derivedCounts = deriveCounts(manifest.entries)
  } catch (error) {
    fail(error.message)
    return failures
  }
  if (JSON.stringify(manifest.counts) !== JSON.stringify(derivedCounts)) {
    fail(`stored counts do not match entries: expected ${JSON.stringify(derivedCounts)}`)
  }

  return failures
}

function runSelfTest() {
  const source = [
    JSON.stringify({ candidate_id: 'hei_unadded_0001', name: 'One', slug: 'one' }),
    JSON.stringify({ candidate_id: 'hei_unadded_0002', name: 'Two', slug: 'two' }),
    '',
  ].join('\n')
  const manifest = {
    version: 1,
    scan_id: 'test',
    source_path: 'test.jsonl',
    source_blob_sha: gitBlobSha(source),
    range: { start: 'hei_unadded_0001', end: 'hei_unadded_0002', record_count: 2 },
    counts: { add_now: 0, needs_research: 1, pending_thin: 1, out_of_scope_or_duplicate: 0 },
    entries: [
      { candidate_id: 'hei_unadded_0001', name: 'One', slug: 'one', disposition: 'needs_research' },
      { candidate_id: 'hei_unadded_0002', name: 'Two', slug: 'two', disposition: 'pending_thin' },
    ],
  }
  const pass = validateManifest(manifest, source, 'test-scan.json')
  if (pass.length > 0) throw new Error(`valid fixture failed: ${pass.join('; ')}`)

  const drifted = structuredClone(manifest)
  drifted.entries[1].name = 'Wrong'
  const failures = validateManifest(drifted, source, 'test-scan.json')
  if (!failures.some((failure) => failure.includes('name drift'))) {
    throw new Error('name-drift fixture did not fail')
  }
  console.log('Verified-unadded scan integrity self-test: pass')
}

if (process.argv.includes('--self-test')) {
  runSelfTest()
  process.exit(0)
}

if (!fs.existsSync(scansDir)) throw new Error('missing docs/backlog/scans directory')
const manifestFiles = fs.readdirSync(scansDir)
  .filter((name) => /^hei_unadded_\d{4}-\d{4}-scan\.json$/.test(name))
  .sort()

if (manifestFiles.length === 0) throw new Error('no machine-readable verified-unadded scan manifests found')

const allFailures = []
for (const name of manifestFiles) {
  const manifestPath = path.join(scansDir, name)
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  const sourcePath = path.join(root, manifest.source_path)
  if (!fs.existsSync(sourcePath)) {
    allFailures.push(`${manifestPath}: source file does not exist: ${manifest.source_path}`)
    continue
  }
  const sourceContent = fs.readFileSync(sourcePath, 'utf8')
  allFailures.push(...validateManifest(manifest, sourceContent, path.relative(root, manifestPath)))
}

console.log(`Verified-unadded scan manifests checked: ${manifestFiles.length}`)
if (allFailures.length > 0) {
  for (const failure of allFailures) console.error(`- ${failure}`)
  process.exit(1)
}
console.log('Verified-unadded scan integrity: pass')
