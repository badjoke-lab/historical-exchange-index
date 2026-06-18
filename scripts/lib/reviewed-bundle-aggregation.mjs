import fs from 'node:fs'
import path from 'node:path'

export function normalizeIdentity(value) {
  if (!value) return null
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '') || null
}

export function entityIdentityKeys(entity) {
  return new Set([
    entity.id,
    entity.slug,
    entity.canonical_name,
    entity.official_domain_original,
    entity.official_url_original,
    ...(entity.aliases ?? []),
  ].map(normalizeIdentity).filter(Boolean))
}

function addOwner(index, value, entityId) {
  const key = normalizeIdentity(value)
  if (!key) return
  const owners = index.get(key) ?? new Set()
  owners.add(entityId)
  index.set(key, owners)
}

function registerEntity(indexes, entity, entityId = entity.id) {
  addOwner(indexes.id, entity.id, entityId)
  addOwner(indexes.slug, entity.slug, entityId)
  addOwner(indexes.domain, entity.official_domain_original, entityId)
  addOwner(indexes.domain, entity.official_url_original, entityId)
  addOwner(indexes.name, entity.canonical_name, entityId)
  for (const alias of entity.aliases ?? []) addOwner(indexes.alias, alias, entityId)
}

function uniqueMatch(index, values, fileName, label) {
  const matches = new Set()
  for (const value of values) {
    const key = normalizeIdentity(value)
    if (!key) continue
    for (const entityId of index.get(key) ?? []) matches.add(entityId)
  }
  if (matches.size > 1) {
    throw new Error(`${fileName}: ambiguous ${label} match: ${[...matches].join(', ')}`)
  }
  return matches.size === 1 ? [...matches][0] : null
}

export function buildBundleEntityIdMap(canonicalEntities, entries) {
  const indexes = {
    id: new Map(),
    slug: new Map(),
    domain: new Map(),
    name: new Map(),
    alias: new Map(),
  }
  const sourceToCanonical = new Map(canonicalEntities.map((entity) => [entity.id, entity.id]))

  for (const entity of canonicalEntities) registerEntity(indexes, entity)

  for (const { fileName, bundle } of entries) {
    if (!bundle?.entity?.id) throw new Error(`${fileName}: bundle entity is missing id`)
    const entity = bundle.entity

    let canonicalId = uniqueMatch(indexes.id, [entity.id], fileName, 'id')
    if (!canonicalId) canonicalId = uniqueMatch(indexes.slug, [entity.slug], fileName, 'slug')
    if (!canonicalId) {
      canonicalId = uniqueMatch(
        indexes.domain,
        [entity.official_domain_original, entity.official_url_original],
        fileName,
        'domain',
      )
    }
    if (!canonicalId) canonicalId = uniqueMatch(indexes.name, [entity.canonical_name], fileName, 'canonical name')
    if (!canonicalId) {
      canonicalId = uniqueMatch(
        indexes.alias,
        [entity.canonical_name, ...(entity.aliases ?? [])],
        fileName,
        'alias',
      )
    }
    if (!canonicalId) canonicalId = entity.id

    sourceToCanonical.set(entity.id, canonicalId)
    registerEntity(indexes, entity, canonicalId)
  }

  return sourceToCanonical
}

export function classifyReviewedBundles(canonicalEntities, entries) {
  const entityIdMap = buildBundleEntityIdMap(canonicalEntities, entries)
  const all = []
  const newEntityBundles = []
  const acceptedIds = new Set(canonicalEntities.map((entity) => entity.id))

  for (const entry of entries) {
    const { fileName, bundle } = entry
    if (!bundle?.entity || !Array.isArray(bundle.events) || !Array.isArray(bundle.evidence)) {
      throw new Error(`${fileName}: expected { entity, events, evidence }`)
    }

    all.push(entry)
    const resolvedId = entityIdMap.get(bundle.entity.id)
    if (resolvedId !== bundle.entity.id || acceptedIds.has(bundle.entity.id)) continue
    newEntityBundles.push(entry)
    acceptedIds.add(bundle.entity.id)
  }

  return { all, newEntityBundles, entityIdMap }
}

export function loadReviewedBundles(root, canonicalEntities) {
  const recordsDir = path.join(root, 'records', 'exchanges')
  if (!fs.existsSync(recordsDir)) return { all: [], newEntityBundles: [], entityIdMap: new Map() }

  const entries = fs.readdirSync(recordsDir)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((fileName) => ({
      fileName,
      bundle: JSON.parse(fs.readFileSync(path.join(recordsDir, fileName), 'utf8')),
    }))

  return classifyReviewedBundles(canonicalEntities, entries)
}

export function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}

export function mergeRecords(canonicalRecords, bundles, field, label, entityIdMap = new Map()) {
  const canonicalIds = new Set()
  for (const record of canonicalRecords) {
    if (!record?.id) throw new Error(`canonical data: ${label} record is missing id`)
    if (canonicalIds.has(record.id)) throw new Error(`canonical data: duplicate ${label} id: ${record.id}`)
    canonicalIds.add(record.id)
  }

  const additions = new Map()
  for (const { fileName, bundle } of bundles) {
    for (const sourceRecord of bundle[field]) {
      if (!sourceRecord?.id) throw new Error(`${fileName}: ${label} record is missing id`)
      if (canonicalIds.has(sourceRecord.id)) continue

      const exchangeId = entityIdMap.get(sourceRecord.exchange_id) ?? sourceRecord.exchange_id
      const record = exchangeId === sourceRecord.exchange_id
        ? sourceRecord
        : { ...sourceRecord, exchange_id: exchangeId }
      const existing = additions.get(record.id)
      if (existing && stableStringify(existing) !== stableStringify(record)) {
        throw new Error(`${fileName}: conflicting ${label} id: ${record.id}`)
      }
      additions.set(record.id, record)
    }
  }

  return [...canonicalRecords, ...additions.values()]
}
