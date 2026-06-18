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

export function buildBundleEntityIdMap(canonicalEntities, entries) {
  const identityOwner = new Map()
  const sourceToCanonical = new Map(canonicalEntities.map((entity) => [entity.id, entity.id]))

  for (const entity of canonicalEntities) {
    for (const key of entityIdentityKeys(entity)) {
      const existing = identityOwner.get(key)
      if (existing && existing !== entity.id) {
        throw new Error(`canonical identity collision: ${key} belongs to ${existing} and ${entity.id}`)
      }
      identityOwner.set(key, entity.id)
    }
  }

  for (const { fileName, bundle } of entries) {
    if (!bundle?.entity?.id) throw new Error(`${fileName}: bundle entity is missing id`)
    const keys = [...entityIdentityKeys(bundle.entity)]
    const matches = [...new Set(keys.map((key) => identityOwner.get(key)).filter(Boolean))]
    if (matches.length > 1) {
      throw new Error(`${fileName}: bundle entity matches multiple reviewed entities: ${matches.join(', ')}`)
    }

    const canonicalId = matches[0] ?? bundle.entity.id
    sourceToCanonical.set(bundle.entity.id, canonicalId)

    if (matches.length === 0) {
      for (const key of keys) identityOwner.set(key, canonicalId)
    }
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
  const canonicalById = new Map()
  for (const record of canonicalRecords) {
    if (!record?.id) throw new Error(`canonical data: ${label} record is missing id`)
    if (canonicalById.has(record.id)) throw new Error(`canonical data: duplicate ${label} id: ${record.id}`)
    canonicalById.set(record.id, record)
  }

  const additions = new Map()
  for (const { fileName, bundle } of bundles) {
    for (const sourceRecord of bundle[field]) {
      if (!sourceRecord?.id) throw new Error(`${fileName}: ${label} record is missing id`)
      const exchangeId = entityIdMap.get(sourceRecord.exchange_id) ?? sourceRecord.exchange_id
      const record = exchangeId === sourceRecord.exchange_id
        ? sourceRecord
        : { ...sourceRecord, exchange_id: exchangeId }

      const canonicalRecord = canonicalById.get(record.id)
      if (canonicalRecord) {
        if (stableStringify(canonicalRecord) !== stableStringify(record)) {
          throw new Error(`${fileName}: conflicting canonical ${label} id after entity mapping: ${record.id}`)
        }
        continue
      }

      const existing = additions.get(record.id)
      if (existing && stableStringify(existing) !== stableStringify(record)) {
        throw new Error(`${fileName}: conflicting ${label} id: ${record.id}`)
      }
      additions.set(record.id, record)
    }
  }

  return [...canonicalRecords, ...additions.values()]
}
