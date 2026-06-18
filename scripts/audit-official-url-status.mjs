import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const entities = JSON.parse(fs.readFileSync(path.join(root, 'data', 'entities.json'), 'utf8'))
const allowed = new Set([
  'live_verified',
  'live_unverified',
  'dead_domain',
  'redirected',
  'repurposed',
  'unsafe',
  'unknown',
])
const strict = process.argv.includes('--strict')
const reportPathArg = process.argv.find((value) => value.startsWith('--report='))

const invalid = entities
  .filter((entity) => !allowed.has(entity.official_url_status))
  .map((entity) => ({
    id: entity.id,
    slug: entity.slug,
    canonical_name: entity.canonical_name,
    status: entity.status,
    death_reason: entity.death_reason,
    official_url_original: entity.official_url_original,
    official_domain_original: entity.official_domain_original,
    official_url_status: entity.official_url_status,
    archived_url: entity.archived_url,
    last_verified_at: entity.last_verified_at,
    notes: entity.notes,
  }))

const report = {
  generated_at: new Date().toISOString(),
  entity_count: entities.length,
  invalid_count: invalid.length,
  allowed_values: [...allowed],
  invalid,
}

console.log(JSON.stringify(report, null, 2))

if (reportPathArg) {
  const relativePath = reportPathArg.slice('--report='.length)
  const outputPath = path.join(root, relativePath)
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}

if (strict && invalid.length > 0) process.exit(1)
