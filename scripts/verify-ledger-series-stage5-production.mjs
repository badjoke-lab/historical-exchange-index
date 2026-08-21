import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const authority = JSON.parse(fs.readFileSync(path.join(root, 'config', 'ledger-series-phase9-stage5-hei-local-authority.json'), 'utf8'))
const origin = (process.env.HEI_PRODUCTION_ORIGIN ?? 'https://hei.badjoke-lab.com').replace(/\/$/, '')
const attempts = Math.max(1, Number(process.env.HEI_STAGE5_PRODUCTION_ATTEMPTS ?? 20))
const delayMs = Math.max(0, Number(process.env.HEI_STAGE5_PRODUCTION_DELAY_MS ?? 30000))
const timeoutMs = Math.max(1000, Number(process.env.HEI_STAGE5_PRODUCTION_TIMEOUT_MS ?? 30000))

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const endpointKey = (endpoint) => `${endpoint?.registry_id}:${endpoint?.native_record_type}:${endpoint?.native_record_id}`
const relationshipId = (type, source, target) => `series_rel_${createHash('sha256').update(`${type}\n${source}\n${target}`, 'utf8').digest('hex')}`

async function fetchJson(route) {
  const response = await fetch(`${origin}${route}`, {
    headers: { accept: 'application/json', 'cache-control': 'no-cache', 'user-agent': 'HEI-stage5-production-verifier/1.0' },
    signal: AbortSignal.timeout(timeoutMs),
  })
  if (!response.ok) throw new Error(`${route}: HTTP ${response.status}`)
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) throw new Error(`${route}: expected application/json, received ${contentType || 'missing'}`)
  return response.json()
}

function verify(descriptor, index, relationships) {
  const errors = []
  const fail = (message) => errors.push(message)
  if (authority.authority_id !== 'hei-ledger-series-phase9-stage5-hei-local-2026-08-21') fail('unexpected local authority')
  if (authority.registry_id !== 'historical-exchange-index' || authority.reviewed_audit?.accepted_count !== 21) fail('authority registry/count mismatch')
  if (!Array.isArray(authority.finite_allowlist) || authority.finite_allowlist.length !== 21) fail('authority allowlist must contain 21 rows')

  if (descriptor?.registry?.id !== 'historical-exchange-index') fail('descriptor registry id mismatch')
  if (descriptor?.record_counts?.relationships !== 21) fail(`descriptor relationship count must be 21, found ${descriptor?.record_counts?.relationships}`)
  if (descriptor?.routes?.relationships !== '/data/series/relationships.json') fail('descriptor relationship route mismatch')
  if (descriptor?.capabilities?.relationships !== 'adapter') fail('descriptor relationship capability mismatch')

  const indexRows = Array.isArray(index?.records) ? index.records : []
  const indexKeys = new Set(indexRows.map((row) => row.global_record_key))
  if (indexKeys.size !== indexRows.length) fail('Series index contains duplicate global keys')

  const expectedSet = new Set(authority.finite_allowlist.map(([type, source, target]) => `${type}\n${source}\n${target}`))
  if (expectedSet.size !== 21) fail('authority allowlist contains duplicate tuples')
  if (!Array.isArray(relationships) || relationships.length !== 21) fail(`relationship transport must contain 21 records, found ${Array.isArray(relationships) ? relationships.length : 'non-array'}`)

  const actualSet = new Set()
  const ids = new Set()
  for (const [position, relationship] of (relationships ?? []).entries()) {
    const label = `relationship ${position + 1}`
    const source = endpointKey(relationship.source)
    const target = endpointKey(relationship.target)
    const tuple = `${relationship.relation_type}\n${source}\n${target}`
    if (relationship.series_schema_version !== '1.0.0' || relationship.object_type !== 'relationship_record') fail(`${label}: object contract mismatch`)
    if (!['predecessor_of', 'successor_of'].includes(relationship.relation_type)) fail(`${label}: unauthorized type ${relationship.relation_type}`)
    if (relationship.direction !== 'directed') fail(`${label}: direction mismatch`)
    if (relationship.provenance?.basis !== 'native_reviewed_relationship') fail(`${label}: provenance basis mismatch`)
    if (!Array.isArray(relationship.provenance?.native_evidence_refs)) fail(`${label}: native_evidence_refs must be an array`)
    if (!indexKeys.has(source)) fail(`${label}: source endpoint missing from Series index`)
    if (!indexKeys.has(target)) fail(`${label}: target endpoint missing from Series index`)
    if (source === target) fail(`${label}: self-loop`)
    if (!expectedSet.has(tuple)) fail(`${label}: tuple outside reviewed allowlist`)
    if (actualSet.has(tuple)) fail(`${label}: duplicate tuple`)
    actualSet.add(tuple)
    const expectedId = relationshipId(relationship.relation_type, source, target)
    if (relationship.id !== expectedId) fail(`${label}: deterministic id mismatch`)
    if (ids.has(relationship.id)) fail(`${label}: duplicate relationship id`)
    ids.add(relationship.id)
  }
  if (actualSet.size !== expectedSet.size || [...expectedSet].some((tuple) => !actualSet.has(tuple))) fail('live relationship set does not exactly equal reviewed allowlist')
  return errors
}

let lastError
for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    const [descriptor, index, relationships] = await Promise.all([
      fetchJson('/data/series/registry.json'),
      fetchJson('/data/series/index.json'),
      fetchJson('/data/series/relationships.json'),
    ])
    const errors = verify(descriptor, index, relationships)
    if (errors.length === 0) {
      console.log(`HEI Stage 5 production verification passed on attempt ${attempt}: 21 reviewed relationships.`)
      process.exit(0)
    }
    lastError = new Error(errors.join('; '))
  } catch (error) {
    lastError = error
  }
  if (attempt < attempts) await sleep(delayMs)
}

console.error(`HEI Stage 5 production verification failed: ${lastError?.message ?? 'unknown error'}`)
process.exit(1)
