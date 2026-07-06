import type { EntityRecord } from '../types/entity'

export type EntityLocalizedCopy = {
  summary?: string
  notes?: string
}

export type EntityCopyOverlay = {
  schema_version: 1
  locale: string
  records: Record<string, EntityLocalizedCopy>
}

export function mergeEntityCopy(
  entity: EntityRecord,
  overlay: EntityCopyOverlay | null | undefined,
): EntityRecord {
  const localized = overlay?.records?.[entity.slug]
  if (!localized) return entity

  return {
    ...entity,
    summary: localized.summary ?? entity.summary,
    notes: localized.notes ?? entity.notes,
  }
}
