const ALLOWED_FIELDS = new Set([
  'type',
  'status',
  'death_reason',
  'launch_date',
  'death_date',
  'country_or_origin',
  'summary',
  'official_url_status',
  'archived_url',
  'predecessor_id',
  'successor_id',
  'parent_id',
  'confidence',
  'last_verified_at',
  'notes',
])

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`
  }
  return JSON.stringify(value)
}

export function applyReviewedEntityCorrections(entities, entries) {
  const result = entities.map((entity) => ({ ...entity }))
  const indexById = new Map(result.map((entity, index) => [entity.id, index]))
  const fieldOwners = new Map()

  for (const { fileName, bundle } of entries) {
    const correction = bundle.entity_correction
    if (correction === undefined) continue
    if (!isObject(correction)) throw new Error(`${fileName}: entity_correction must be an object`)
    if (correction.entity_id !== bundle.entity?.id) {
      throw new Error(`${fileName}: entity_correction.entity_id must match bundle.entity.id`)
    }

    const index = indexById.get(correction.entity_id)
    if (index === undefined) {
      throw new Error(`${fileName}: entity_correction target is not canonical: ${correction.entity_id}`)
    }
    if (!isObject(correction.expected) || !isObject(correction.changes)) {
      throw new Error(`${fileName}: entity_correction expected and changes must be objects`)
    }

    const expectedFields = Object.keys(correction.expected).sort()
    const changedFields = Object.keys(correction.changes).sort()
    if (changedFields.length === 0) throw new Error(`${fileName}: entity_correction changes must not be empty`)
    if (stable(expectedFields) !== stable(changedFields)) {
      throw new Error(`${fileName}: entity_correction expected and changes must have identical fields`)
    }

    const current = result[index]
    const next = { ...current }
    for (const field of changedFields) {
      if (!ALLOWED_FIELDS.has(field)) throw new Error(`${fileName}: entity_correction field is not allowed: ${field}`)
      const key = `${correction.entity_id}:${field}`
      if (fieldOwners.has(key)) throw new Error(`${fileName}: entity field already corrected: ${key}`)
      if (stable(current[field]) !== stable(correction.expected[field])) {
        throw new Error(`${fileName}: stale entity_correction expected value for ${key}`)
      }
      if (stable(correction.expected[field]) === stable(correction.changes[field])) {
        throw new Error(`${fileName}: entity_correction does not change ${key}`)
      }
      next[field] = correction.changes[field]
      fieldOwners.set(key, fileName)
    }
    result[index] = next
  }

  return result
}
