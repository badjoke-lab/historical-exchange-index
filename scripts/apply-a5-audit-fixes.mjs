import fs from 'node:fs'

function updateJson(file, mutate) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'))
  mutate(data)
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

updateJson('records/exchanges/etherdelta.json', (bundle) => {
  bundle.entity.official_url_status = 'unknown'
  bundle.entity.death_reason = null
  bundle.entity.notes = 'Added from verified-unadded row hei_unadded_0843 after event-backed review. EtherDelta is treated as one historical DEX entity, not as a generic active database row. The entity status is inactive because the original venue is not treated as a current active exchange in this registry context. The present state of the original domain is not freshly verified, so official_url_status remains unknown.'
})

updateJson('records/exchanges/line-bitmax.json', (bundle) => {
  bundle.entity.official_url_status = 'live_verified'
})

updateJson('records/exchanges/fairdesk.json', (bundle) => {
  bundle.entity.official_url_status = 'unknown'
  bundle.entity.notes = `${bundle.entity.notes} The current redirect or dead-domain state of the original domain is not asserted without a fresh URL verification, so official_url_status remains unknown.`
})

const auditFile = 'scripts/audit-entity-quality.mjs'
let source = fs.readFileSync(auditFile, 'utf8')

source = source.replace(
`import {
  DEAD_SIDE_STATUSES,
  OFFICIAL_URL_STATUS_VALUES,
} from './monitoring/core/constants.mjs'`,
`import {
  TYPE_VALUES,
  STATUS_VALUES,
  DEATH_REASON_VALUES,
  DEAD_SIDE_STATUSES,
  ACTIVE_SIDE_STATUSES,
  OFFICIAL_URL_STATUS_VALUES,
} from './monitoring/core/constants.mjs'`,
)

source = source.replace(
`function isHttpUrl(value) {`,
`function domainsCompatible(left, right) {
  if (!left || !right) return false
  return left === right || left.endsWith(\`.\${right}\`) || right.endsWith(\`.\${left}\`)
}

function isHttpUrl(value) {`,
)

source = source.replace(
`    if (!OFFICIAL_URL_STATUS_VALUES.includes(entity.official_url_status)) {`,
`    if (!TYPE_VALUES.includes(entity.type)) {
      add(findings, 'critical', 'invalid_entity_type', entity, \`\${label} has an invalid entity type.\`, {
        value: entity.type ?? null,
      })
    }

    if (!STATUS_VALUES.includes(entity.status)) {
      add(findings, 'critical', 'invalid_entity_status', entity, \`\${label} has an invalid entity status.\`, {
        value: entity.status ?? null,
      })
    }

    if (entity.death_reason !== null && entity.death_reason !== undefined && !DEATH_REASON_VALUES.includes(entity.death_reason)) {
      add(findings, 'critical', 'invalid_death_reason', entity, \`\${label} has an invalid death_reason.\`, {
        value: entity.death_reason,
      })
    }

    if (DEAD_SIDE_STATUSES.includes(entity.status) && !entity.death_reason) {
      add(findings, 'high', 'dead_side_missing_death_reason', entity, \`\${label} is dead-side but has no death_reason.\`)
    }

    if (ACTIVE_SIDE_STATUSES.includes(entity.status) && entity.death_reason) {
      add(findings, 'high', 'active_side_has_death_reason', entity, \`\${label} is active-side but has a death_reason.\`, {
        value: entity.death_reason,
      })
    }

    if (!['high', 'medium', 'low'].includes(entity.confidence)) {
      add(findings, 'high', 'invalid_entity_confidence', entity, \`\${label} has an invalid or missing confidence.\`, {
        value: entity.confidence ?? null,
      })
    }

    if (!OFFICIAL_URL_STATUS_VALUES.includes(entity.official_url_status)) {`,
)

source = source.replace(
`    if (hasText(originalUrl) && hasText(originalDomain) && urlHost && domainHost && urlHost !== domainHost) {`,
`    if (hasText(originalUrl) && hasText(originalDomain) && urlHost && domainHost && !domainsCompatible(urlHost, domainHost)) {`,
)

source = source.replace(
`  for (const category of ['invalid_official_url_status', 'missing_country_or_origin', 'missing_lineage_target']) {`,
`  for (const category of ['invalid_entity_type', 'invalid_entity_status', 'invalid_death_reason', 'invalid_official_url_status', 'missing_country_or_origin', 'missing_lineage_target']) {`,
)

source = source.replace(
`      id: 'ex-broken', slug: 'broken', canonical_name: 'Broken', status: 'active',
      country_or_origin: null, official_url_status: 'invalid_value', official_url_original: null,`,
`      id: 'ex-broken', slug: 'broken', canonical_name: 'Broken', type: 'invalid_type', status: 'invalid_status', death_reason: 'invalid_reason', confidence: 'invalid_confidence',
      country_or_origin: null, official_url_status: 'invalid_value', official_url_original: null,`,
)

fs.writeFileSync(auditFile, source, 'utf8')
console.log('Applied A5 audit and projected-record normalization fixes.')
