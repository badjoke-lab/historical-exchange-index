const MISSING_FIELD_KEY = '__hei_missing__'

function isMissingFieldExpectation(value) {
  return Boolean(value)
    && typeof value === 'object'
    && !Array.isArray(value)
    && value[MISSING_FIELD_KEY] === true
    && Object.keys(value).length === 1
}

export function restorePreA4LineageEntities(entities, manifest) {
  const result = entities.map((entity) => ({ ...entity }))
  const byId = new Map(result.map((entity) => [entity.id, entity]))

  for (const change of manifest.changes ?? []) {
    if (!['predecessor_id', 'successor_id'].includes(change.field)) {
      throw new Error(`A4 baseline manifest contains unsupported field: ${change.field}`)
    }
    const entity = byId.get(change.entity_id)
    if (!entity) throw new Error(`A4 baseline entity is missing: ${change.entity_id}`)

    if (isMissingFieldExpectation(change.expected_before)) delete entity[change.field]
    else entity[change.field] = change.expected_before
  }

  return result
}
