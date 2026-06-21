import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { loadReviewedBundles } from './lib/reviewed-bundle-aggregation.mjs'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'
import {
  TYPE_VALUES,
  STATUS_VALUES,
  DEATH_REASON_VALUES,
  DEAD_SIDE_STATUSES,
  ACTIVE_SIDE_STATUSES,
  OFFICIAL_URL_STATUS_VALUES,
} from './monitoring/core/constants.mjs'

const root = process.cwd()
const strict = process.argv.includes('--strict')
const selfTest = process.argv.includes('--self-test')
const jsonArg = process.argv.find((arg) => arg.startsWith('--output-json='))
const markdownArg = process.argv.find((arg) => arg.startsWith('--output-md='))

const severityOrder = ['critical', 'high', 'medium', 'low']
const provisionalPattern = /\b(todo|tbd|placeholder|needs? (?:final )?verification|pending verification|temporary draft|draft record|needs? review)\b/i

function stableHost(value) {
  if (typeof value !== 'string' || value.trim() === '') return null
  try {
    const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`
    return new URL(candidate).hostname.toLowerCase().replace(/^www\./, '') || null
  } catch {
    return null
  }
}

function domainsCompatible(left, right) {
  if (!left || !right) return false
  return left === right || left.endsWith(`.${right}`) || right.endsWith(`.${left}`)
}

function isHttpUrl(value) {
  if (typeof value !== 'string' || value.trim() === '') return false
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function hasText(value) {
  return typeof value === 'string' && value.trim() !== ''
}

function finding(severity, category, entity, summary, details = {}) {
  return {
    severity,
    category,
    entity_id: entity?.id ?? null,
    slug: entity?.slug ?? null,
    canonical_name: entity?.canonical_name ?? null,
    summary,
    ...details,
  }
}

function add(findings, severity, category, entity, summary, details = {}) {
  findings.push(finding(severity, category, entity, summary, details))
}

function buildReviewedOneWayKeys(l1, l2) {
  const keys = new Set()
  for (const item of l1?.dispositions ?? []) {
    if (item.disposition === 'keep_one_way_documented') {
      keys.add(`${item.entity_id}:${item.field}:${item.target_id}`)
    }
  }
  for (const item of l2?.dispositions ?? []) {
    if (item.classification === 'link_now' && item.link_mode === 'one_way_documented') {
      keys.add(`${item.entity_id}:${item.relation_field}:${item.target_id}`)
    }
  }
  return keys
}

export function auditEntityQuality(entities, { reviewedOneWayKeys = new Set() } = {}) {
  const findings = []
  const byId = new Map(entities.map((entity) => [entity.id, entity]))

  for (const entity of entities) {
    const label = entity.canonical_name || entity.slug || entity.id || 'unknown entity'

    if (!TYPE_VALUES.includes(entity.type)) {
      add(findings, 'critical', 'invalid_entity_type', entity, `${label} has an invalid entity type.`, {
        value: entity.type ?? null,
      })
    }

    if (!STATUS_VALUES.includes(entity.status)) {
      add(findings, 'critical', 'invalid_entity_status', entity, `${label} has an invalid entity status.`, {
        value: entity.status ?? null,
      })
    }

    if (entity.death_reason !== null && entity.death_reason !== undefined && !DEATH_REASON_VALUES.includes(entity.death_reason)) {
      add(findings, 'critical', 'invalid_death_reason', entity, `${label} has an invalid death_reason.`, {
        value: entity.death_reason,
      })
    }

    if (DEAD_SIDE_STATUSES.includes(entity.status) && !entity.death_reason) {
      add(findings, 'high', 'dead_side_missing_death_reason', entity, `${label} is dead-side but has no death_reason.`)
    }

    if (ACTIVE_SIDE_STATUSES.includes(entity.status) && entity.death_reason) {
      add(findings, 'high', 'active_side_has_death_reason', entity, `${label} is active-side but has a death_reason.`, {
        value: entity.death_reason,
      })
    }

    if (!['high', 'medium', 'low'].includes(entity.confidence)) {
      add(findings, 'high', 'invalid_entity_confidence', entity, `${label} has an invalid or missing confidence.`, {
        value: entity.confidence ?? null,
      })
    }

    if (!OFFICIAL_URL_STATUS_VALUES.includes(entity.official_url_status)) {
      add(findings, 'critical', 'invalid_official_url_status', entity, `${label} has invalid or missing official_url_status.`, {
        value: entity.official_url_status ?? null,
      })
    }

    if (!hasText(entity.country_or_origin)) {
      add(findings, 'critical', 'missing_country_or_origin', entity, `${label} has no country_or_origin.`)
    }

    const originalUrl = entity.official_url_original
    const originalDomain = entity.official_domain_original
    const urlHost = stableHost(originalUrl)
    const domainHost = stableHost(originalDomain)

    if (hasText(originalUrl) && !isHttpUrl(originalUrl)) {
      add(findings, 'high', 'invalid_original_url', entity, `${label} has an invalid original URL.`, { value: originalUrl })
    }
    if (hasText(entity.archived_url) && !isHttpUrl(entity.archived_url)) {
      add(findings, 'high', 'invalid_archive_url', entity, `${label} has an invalid archived URL.`, { value: entity.archived_url })
    }
    if (!hasText(originalDomain)) {
      add(findings, 'medium', 'missing_original_domain', entity, `${label} has no original official domain.`)
    } else if (!domainHost) {
      add(findings, 'high', 'invalid_original_domain', entity, `${label} has an invalid original official domain.`, { value: originalDomain })
    }
    if (hasText(originalUrl) && hasText(originalDomain) && urlHost && domainHost && !domainsCompatible(urlHost, domainHost)) {
      add(findings, 'high', 'original_url_domain_mismatch', entity, `${label} original URL host and domain do not match.`, {
        original_url_host: urlHost,
        original_domain: domainHost,
      })
    }

    if (['live_verified', 'live_unverified', 'redirected'].includes(entity.official_url_status)) {
      if (!hasText(originalUrl)) {
        add(findings, 'high', 'live_status_missing_original_url', entity, `${label} has a live or redirected URL status without an original URL.`)
      }
      if (!hasText(originalDomain)) {
        add(findings, 'high', 'live_status_missing_original_domain', entity, `${label} has a live or redirected URL status without an original domain.`)
      }
    }

    if (DEAD_SIDE_STATUSES.includes(entity.status) && !hasText(entity.archived_url)) {
      add(findings, 'medium', 'dead_side_missing_archive', entity, `${label} is dead-side but has no archived URL.`)
    }

    if (['active', 'limited'].includes(entity.status) && ['dead_domain', 'repurposed', 'unsafe'].includes(entity.official_url_status)) {
      add(findings, 'high', 'active_side_url_status_conflict', entity, `${label} is active-side but its original URL status indicates a dead, repurposed, or unsafe domain.`, {
        status: entity.status,
        official_url_status: entity.official_url_status,
      })
    }

    for (const field of ['summary', 'notes']) {
      if (provisionalPattern.test(entity[field] ?? '')) {
        add(findings, 'medium', 'provisional_text', entity, `${label} contains provisional text in ${field}.`, { field })
      }
    }

    for (const field of ['predecessor_id', 'successor_id', 'parent_id']) {
      const targetId = entity[field]
      if (targetId === null || targetId === undefined || targetId === '') continue
      if (typeof targetId !== 'string') {
        add(findings, 'critical', 'invalid_lineage_field_type', entity, `${label}.${field} is not a string or null.`, { value: targetId })
        continue
      }
      if (targetId === entity.id) {
        add(findings, 'critical', 'self_lineage_reference', entity, `${label}.${field} points to itself.`)
        continue
      }
      if (!byId.has(targetId)) {
        add(findings, 'critical', 'missing_lineage_target', entity, `${label}.${field} points to a missing entity.`, { target_id: targetId })
        continue
      }

      if (field === 'predecessor_id' || field === 'successor_id') {
        const reciprocalField = field === 'predecessor_id' ? 'successor_id' : 'predecessor_id'
        const target = byId.get(targetId)
        const key = `${entity.id}:${field}:${targetId}`
        if (target?.[reciprocalField] !== entity.id && !reviewedOneWayKeys.has(key)) {
          add(findings, 'medium', 'unreviewed_nonreciprocal_lineage', entity, `${label}.${field} is not reciprocal and is not in the reviewed one-way set.`, {
            target_id: targetId,
            reciprocal_field: reciprocalField,
            reciprocal_value: target?.[reciprocalField] ?? null,
          })
        }
      }
    }

    if (entity.predecessor_id && entity.successor_id && entity.predecessor_id === entity.successor_id) {
      add(findings, 'high', 'same_predecessor_and_successor', entity, `${label} uses the same entity as predecessor and successor.`, {
        target_id: entity.predecessor_id,
      })
    }

    const lineageText = `${entity.summary ?? ''} ${entity.notes ?? ''}`
    if (!entity.predecessor_id && !entity.successor_id && /\b(successor|predecessor|rebrand(?:ed)?|renamed|merged into|acquired by|migrated to)\b/i.test(lineageText)) {
      add(findings, 'low', 'lineage_text_without_structured_link', entity, `${label} contains lineage language without a predecessor or successor field.`)
    }
  }

  findings.sort((left, right) => {
    const severityDelta = severityOrder.indexOf(left.severity) - severityOrder.indexOf(right.severity)
    if (severityDelta !== 0) return severityDelta
    return `${left.category}:${left.entity_id}`.localeCompare(`${right.category}:${right.entity_id}`)
  })

  const bySeverity = Object.fromEntries(severityOrder.map((severity) => [severity, findings.filter((item) => item.severity === severity).length]))
  const byCategory = {}
  for (const item of findings) byCategory[item.category] = (byCategory[item.category] ?? 0) + 1

  return {
    generated_at: new Date().toISOString(),
    projected_public_entities: entities.length,
    findings_total: findings.length,
    critical_findings: bySeverity.critical,
    findings_by_severity: bySeverity,
    findings_by_category: Object.fromEntries(Object.entries(byCategory).sort(([left], [right]) => left.localeCompare(right))),
    findings,
  }
}

function buildMarkdown(report) {
  const lines = [
    '# HEI Permanent Entity Quality Audit',
    '',
    `- Generated: ${report.generated_at}`,
    `- Projected public entities: ${report.projected_public_entities}`,
    `- Critical findings: ${report.critical_findings}`,
    `- Total findings: ${report.findings_total}`,
    '',
    '## Findings by severity',
    '',
    ...severityOrder.map((severity) => `- ${severity}: ${report.findings_by_severity[severity]}`),
    '',
    '## Findings by category',
    '',
    ...Object.entries(report.findings_by_category).map(([category, count]) => `- ${category}: ${count}`),
    '',
    '## Critical findings',
    '',
  ]
  const critical = report.findings.filter((item) => item.severity === 'critical')
  if (critical.length === 0) lines.push('- None')
  else for (const item of critical) lines.push(`- ${item.entity_id ?? 'unknown'} — ${item.category}: ${item.summary}`)
  lines.push('')
  return `${lines.join('\n')}\n`
}

function runSelfTest() {
  const reviewedOneWayKeys = new Set(['ex-one-way:successor_id:ex-target'])
  const entities = [
    {
      id: 'ex-one-way', slug: 'one-way', canonical_name: 'One Way', status: 'acquired',
      country_or_origin: 'Example', official_url_status: 'dead_domain', official_url_original: 'https://one.example/',
      official_domain_original: 'one.example', archived_url: 'https://web.archive.org/web/*/https://one.example/',
      successor_id: 'ex-target', summary: 'Acquired by Target.', notes: '',
    },
    {
      id: 'ex-target', slug: 'target', canonical_name: 'Target', status: 'active',
      country_or_origin: 'Example', official_url_status: 'live_verified', official_url_original: 'https://target.example/',
      official_domain_original: 'target.example', archived_url: null, summary: 'Active exchange.', notes: '',
    },
    {
      id: 'ex-broken', slug: 'broken', canonical_name: 'Broken', type: 'invalid_type', status: 'invalid_status', death_reason: 'invalid_reason', confidence: 'invalid_confidence',
      country_or_origin: null, official_url_status: 'invalid_value', official_url_original: null,
      official_domain_original: null, archived_url: null, successor_id: 'missing', summary: 'TODO verify.', notes: '',
    },
  ]
  const report = auditEntityQuality(entities, { reviewedOneWayKeys })
  const criticalCategories = new Set(report.findings.filter((item) => item.severity === 'critical').map((item) => item.category))
  for (const category of ['invalid_entity_type', 'invalid_entity_status', 'invalid_death_reason', 'invalid_official_url_status', 'missing_country_or_origin', 'missing_lineage_target']) {
    if (!criticalCategories.has(category)) throw new Error(`Self-test failed to detect ${category}`)
  }
  if (report.findings.some((item) => item.category === 'unreviewed_nonreciprocal_lineage' && item.entity_id === 'ex-one-way')) {
    throw new Error('Self-test rejected a reviewed one-way lineage edge')
  }
  console.log('Entity quality audit self-test: pass')
}

if (selfTest) {
  runSelfTest()
  process.exit(0)
}

const load = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
const canonicalEntities = load('data/entities.json')
const l1 = load('config/lineage-l1-dispositions.json')
const l2 = load('config/lineage-l2-dispositions.json')
const { all, newEntityBundles } = loadReviewedBundles(root, canonicalEntities)
const entities = [
  ...applyReviewedEntityCorrections(canonicalEntities, all),
  ...newEntityBundles.map(({ bundle }) => bundle.entity),
]
const report = auditEntityQuality(entities, { reviewedOneWayKeys: buildReviewedOneWayKeys(l1, l2) })

if (jsonArg) {
  const outputPath = path.resolve(root, jsonArg.slice('--output-json='.length))
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}
if (markdownArg) {
  const outputPath = path.resolve(root, markdownArg.slice('--output-md='.length))
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, buildMarkdown(report), 'utf8')
}

console.log(`Projected public entities: ${report.projected_public_entities}`)
console.log(`Critical findings: ${report.critical_findings}`)
console.log(`Findings by severity: ${JSON.stringify(report.findings_by_severity)}`)
console.log(`Findings by category: ${JSON.stringify(report.findings_by_category)}`)
if (strict && report.critical_findings > 0) process.exit(1)
