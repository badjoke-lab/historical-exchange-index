import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const entities = JSON.parse(fs.readFileSync(path.join(root, 'data', 'entities.json'), 'utf8'))
const allowedUrlStatuses = new Set([
  'live_verified', 'live_unverified', 'dead_domain', 'redirected',
  'repurposed', 'unsafe', 'unknown',
])
const deadSide = new Set(['dead', 'merged', 'acquired', 'rebranded'])
const lineageStatuses = new Set(['merged', 'acquired', 'rebranded'])
const provisionalPattern = /\b(?:placeholder|provisional|todo|tbd|needs? (?:final )?verification|requires? verification|needs? review|final verification|to be verified)\b/i

const report = {
  generated_at: new Date().toISOString(),
  totals: { entities: entities.length },
  invalid_official_url_status: [],
  provisional_text: [],
  missing_origin: [],
  missing_archive: [],
  dead_side_missing_archive: [],
  missing_original_domain: [],
  lineage_candidates_without_links: [],
  url_consistency: [],
}

for (const entity of entities) {
  if (!allowedUrlStatuses.has(entity.official_url_status)) {
    report.invalid_official_url_status.push({
      id: entity.id,
      slug: entity.slug,
      value: entity.official_url_status,
    })
  }

  for (const field of ['summary', 'notes']) {
    const value = entity[field]
    if (typeof value === 'string' && provisionalPattern.test(value)) {
      report.provisional_text.push({ id: entity.id, slug: entity.slug, field, value })
    }
  }

  if (!entity.country_or_origin) report.missing_origin.push({ id: entity.id, slug: entity.slug, status: entity.status })
  if (!entity.archived_url) report.missing_archive.push({ id: entity.id, slug: entity.slug, status: entity.status })
  if (deadSide.has(entity.status) && !entity.archived_url) {
    report.dead_side_missing_archive.push({ id: entity.id, slug: entity.slug, status: entity.status })
  }
  if (!entity.official_domain_original) {
    report.missing_original_domain.push({ id: entity.id, slug: entity.slug, status: entity.status })
  }
  if (
    lineageStatuses.has(entity.status)
    && !entity.predecessor_id
    && !entity.successor_id
    && !entity.parent_id
  ) {
    report.lineage_candidates_without_links.push({
      id: entity.id,
      slug: entity.slug,
      status: entity.status,
      canonical_name: entity.canonical_name,
      notes: entity.notes,
    })
  }

  if (!entity.official_url_original && !['unknown', 'dead_domain'].includes(entity.official_url_status)) {
    report.url_consistency.push({
      id: entity.id,
      slug: entity.slug,
      issue: 'status_without_original_url',
      official_url_status: entity.official_url_status,
    })
  }
  if (entity.archived_url && !entity.official_url_original) {
    report.url_consistency.push({
      id: entity.id,
      slug: entity.slug,
      issue: 'archive_without_original_url',
      archived_url: entity.archived_url,
    })
  }
}

report.counts = Object.fromEntries(
  Object.entries(report)
    .filter(([, value]) => Array.isArray(value))
    .map(([key, value]) => [key, value.length]),
)

const outputPath = path.join(root, 'data-staging', 'audits', 'entity-quality.json')
fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
console.log(JSON.stringify(report.counts, null, 2))
