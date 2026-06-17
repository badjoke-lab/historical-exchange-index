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

export function classifyReviewedBundles(canonicalEntities, entries) {
  const seenIdentities = new Set(
    canonicalEntities.flatMap((entity) => [...entityIdentityKeys(entity)]),
  )
  const all = []
  const newEntityBundles = []

  for (const entry of entries) {
    const { fileName, bundle } = entry
    if (!bundle?.entity || !Array.isArray(bundle.events) || !Array.isArray(bundle.evidence)) {
      throw new Error(`${fileName}: expected { entity, events, evidence }`)
    }

    all.push(entry)
    const keys = entityIdentityKeys(bundle.entity)
    if ([...keys].some((key) => seenIdentities.has(key))) continue

    newEntityBundles.push(entry)
    for (const key of keys) seenIdentities.add(key)
  }

  return { all, newEntityBundles }
}

export function loadReviewedBundles(root, canonicalEntities) {
  const recordsDir = path.join(root, 'records', 'exchanges')
  if (!fs.existsSync(recordsDir)) return { all: [], newEntityBundles: [] }

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

export function mergeRecords(canonicalRecords, bundles, field, label) {
  const canonicalIds = new Set()
  for (const record of canonicalRecords) {
    if (!record?.id) throw new Error(`canonical data: ${label} record is missing id`)
    if (canonicalIds.has(record.id)) throw new Error(`canonical data: duplicate ${label} id: ${record.id}`)
    canonicalIds.add(record.id)
  }

  const additions = new Map()
  for (const { fileName, bundle } of bundles) {
    for (const record of bundle[field]) {
      if (!record?.id) throw new Error(`${fileName}: ${label} record is missing id`)
      if (canonicalIds.has(record.id)) continue

      const existing = additions.get(record.id)
      if (existing && stableStringify(existing) !== stableStringify(record)) {
        throw new Error(`${fileName}: conflicting ${label} id: ${record.id}`)
      }
      additions.set(record.id, record)
    }
  }

  return [...canonicalRecords, ...additions.values()]
}
