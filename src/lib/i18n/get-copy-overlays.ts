import enEntities from '../../../data-i18n/en/entities-copy.json'
import jaEntities from '../../../data-i18n/ja/entities-copy.json'
import enEvents from '../../../data-i18n/en/events-copy.json'
import jaEvents from '../../../data-i18n/ja/events-copy.json'
import type { SupportedLocale } from '../../i18n/config'
import type { EntityCopyOverlay } from './merge-entity-copy'
import type { EventCopyOverlay } from './merge-event-copy'

const entityDocuments: Record<SupportedLocale, EntityCopyOverlay> = {
  en: enEntities as EntityCopyOverlay,
  ja: jaEntities as EntityCopyOverlay,
}

const eventDocuments: Record<SupportedLocale, EventCopyOverlay> = {
  en: enEvents as EventCopyOverlay,
  ja: jaEvents as EventCopyOverlay,
}

export function getEntityCopyOverlay(locale: SupportedLocale): EntityCopyOverlay {
  return entityDocuments[locale]
}

export function getEventCopyOverlay(locale: SupportedLocale): EventCopyOverlay {
  return eventDocuments[locale]
}

export function getCopyOverlayCounts(locale: SupportedLocale) {
  return {
    entities: Object.keys(entityDocuments[locale].records).length,
    events: Object.keys(eventDocuments[locale].records).length,
  }
}
