import type { EntityRecord } from '../types/entity'

export type CorrectableEntityField =
  | 'type'
  | 'status'
  | 'death_reason'
  | 'launch_date'
  | 'death_date'
  | 'country_or_origin'
  | 'summary'
  | 'official_url_status'
  | 'archived_url'
  | 'confidence'
  | 'last_verified_at'
  | 'notes'

export interface EntityCorrection {
  entity_id: string
  expected: Partial<Pick<EntityRecord, CorrectableEntityField>>
  changes: Partial<Pick<EntityRecord, CorrectableEntityField>>
}

interface CorrectionBundle {
  entity: EntityRecord
  entity_correction?: EntityCorrection
}

const allowedFields = new Set<CorrectableEntityField>([
  'type',
  'status',
  'death_reason',
  'launch_date',
  'death_date',
  'country_or_origin',
  'summary',
  'official_url_status',
  'archived_url',
  'confidence',
  'last_verified_at',
  'notes',
])

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stable(record[key])}`).join(',')}}`
  }
  return JSON.stringify(value)
}

export function applyReviewedEntityCorrections(
  entities: EntityRecord[],
  bundles: CorrectionBundle[],
): EntityRecord[] {
  const result = entities.map((entity) => ({ ...entity }))
  const indexById = new Map(result.map((entity, index) => [entity.id, index]))
  const correctedFields = new Set<string>()

  for (const bundle of bundles) {
    const correction = bundle.entity_correction
    if (!correction) continue
    if (correction.entity_id !== bundle.entity.id) {
      throw new Error('entity_correction.entity_id must match bundle.entity.id')
    }

    const index = indexById.get(correction.entity_id)
    if (index === undefined) {
      throw new Error(`entity_correction target is not canonical: ${correction.entity_id}`)
    }

    const expectedFields = Object.keys(correction.expected).sort() as CorrectableEntityField[]
    const changedFields = Object.keys(correction.changes).sort() as CorrectableEntityField[]
    if (changedFields.length === 0 || stable(expectedFields) !== stable(changedFields)) {
      throw new Error('entity_correction expected and changes must have identical non-empty fields')
    }

    const current = result[index]
    const next = { ...current }
    for (const field of changedFields) {
      if (!allowedFields.has(field)) throw new Error(`entity_correction field is not allowed: ${field}`)
      const key = `${correction.entity_id}:${field}`
      if (correctedFields.has(key)) throw new Error(`entity field already corrected: ${key}`)
      if (stable(current[field]) !== stable(correction.expected[field])) {
        throw new Error(`stale entity_correction expected value for ${key}`)
      }
      if (stable(correction.expected[field]) === stable(correction.changes[field])) {
        throw new Error(`entity_correction does not change ${key}`)
      }
      Object.assign(next, { [field]: correction.changes[field] })
      correctedFields.add(key)
    }
    result[index] = next
  }

  return result
}
