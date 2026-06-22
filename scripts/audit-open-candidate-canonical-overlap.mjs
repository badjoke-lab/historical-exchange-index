import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { loadCanonicalData } from './monitoring/core/load-canonical-data.mjs'
import { loadResolutionFiles } from './monitoring/core/load-watchlists.mjs'
import { candidateKeyFromName, normalizeCandidateName } from './monitoring/core/candidate-identity.mjs'

const root = process.cwd()
const outputArg = process.argv.find((arg) => arg.startsWith('--output='))
const strict = process.argv.includes('--strict')

function identityValues(entity) {
  return [entity.canonical_name, entity.slug, ...(entity.aliases || [])]
    .map(normalizeCandidateName)
    .filter(Boolean)
}

const [canonical, resolutions] = await Promise.all([
  loadCanonicalData(),
  loadResolutionFiles(),
])

const entityByIdentity = new Map()
for (const entity of canonical.entities) {
  for (const value of identityValues(entity)) {
    const owners = entityByIdentity.get(value) || []
    owners.push(entity)
    entityByIdentity.set(value, owners)
  }
}

const openEntries = (resolutions.index.entries || []).filter((entry) => ['held', 'needs_research'].includes(entry.state))
const overlaps = []

for (const entry of openEntries) {
  const identities = [entry.canonical_name, ...(entry.aliases || [])]
    .map(normalizeCandidateName)
    .filter(Boolean)
  const matches = new Map()
  for (const identity of identities) {
    for (const entity of entityByIdentity.get(identity) || []) {
      matches.set(entity.id, { entity, identity })
    }
  }
  for (const { entity, identity } of matches.values()) {
    overlaps.push({
      candidate_key: entry.candidate_key || candidateKeyFromName(entry.canonical_name),
      candidate_name: entry.canonical_name,
      candidate_state: entry.state,
      matched_identity: identity,
      entity_id: entity.id,
      entity_slug: entity.slug,
      entity_name: entity.canonical_name,
    })
  }
}

const report = {
  generated_at: new Date().toISOString(),
  projected_entities: canonical.entities.length,
  open_resolution_entries: openEntries.length,
  overlap_count: overlaps.length,
  unique_overlapping_candidates: new Set(overlaps.map((item) => item.candidate_key)).size,
  overlaps: overlaps.sort((left, right) => left.candidate_key.localeCompare(right.candidate_key)),
  status: overlaps.length === 0 ? 'pass' : 'fail',
}

if (outputArg) {
  const outputPath = path.resolve(root, outputArg.slice('--output='.length))
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}

console.log(`Projected entities: ${report.projected_entities}`)
console.log(`Open resolution entries: ${report.open_resolution_entries}`)
console.log(`Overlapping candidates: ${report.unique_overlapping_candidates}`)
for (const item of report.overlaps) {
  console.log(`- ${item.candidate_key} -> ${item.entity_id} ${item.entity_name}`)
}
if (strict && overlaps.length > 0) process.exit(1)
