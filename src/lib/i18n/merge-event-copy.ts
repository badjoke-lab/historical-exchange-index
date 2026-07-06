import type { EventRecord } from '../types/event'

export type EventLocalizedCopy = {
  title?: string
  description?: string
}

export type EventCopyOverlay = {
  schema_version: 1
  locale: string
  records: Record<string, EventLocalizedCopy>
}

export function mergeEventCopy(
  event: EventRecord,
  overlay: EventCopyOverlay | null | undefined,
): EventRecord {
  const localized = overlay?.records?.[event.id]
  if (!localized) return event

  return {
    ...event,
    title: localized.title ?? event.title,
    description: localized.description ?? event.description,
  }
}
