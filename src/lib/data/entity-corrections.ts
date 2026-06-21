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
  | 'predecessor_id'
  | 'successor_id'
  | 'parent_id'
  | 'confidence'
  | 'last_verified_at'
  | 'notes'

type MissingFieldExpectation = {
  __hei_missing__: true
}

export interface EntityCorrection {
  entity_id: string
  expected: Partial<Record<CorrectableEntityField, EntityRecord[CorrectableEntityField] | MissingFieldExpectation>>
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
  'predecessor_id',
  'successor_id',
  'parent_id',
  'confidence',
  'last_verified_at',
  'notes',
])

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isMissingFieldExpectation(value: unknown): value is MissingFieldExpectation {
  return isObject(value)
    && value.__hei_missing__ === true
    && Object.keys(value).length === 1
}

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

      const expected = correction.expected[field]
      const change = correction.changes[field]
      if (isMissingFieldExpectation(change)) {
        throw new Error(`entity_correction changes may not use the missing-field marker for ${key}`)
      }
      if (isMissingFieldExpectation(expected)) {
        if (Object.prototype.hasOwnProperty.call(current, field)) {
          throw new Error(`stale entity_correction expected missing field for ${key}`)
        }
      } else if (stable(current[field]) !== stable(expected)) {
        throw new Error(`stale entity_correction expected value for ${key}`)
      }
      if (!isMissingFieldExpectation(expected) && stable(expected) === stable(change)) {
        throw new Error(`entity_correction does not change ${key}`)
      }

      Object.assign(next, { [field]: change })
      correctedFields.add(key)
    }
    result[index] = next
  }

  return result
}
