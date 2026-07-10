import enEntities from '../../../data-i18n/en/entities-copy.json'
import jaEntities from '../../../data-i18n/ja/entities-copy.json'
import enEvents from '../../../data-i18n/en/events-copy.json'
import jaEvents from '../../../data-i18n/ja/events-copy.json'
import type { SupportedLocale } from '../../i18n/config'
import type { EntityLocalizedCopy } from './merge-entity-copy'
import type { EventLocalizedCopy } from './merge-event-copy'

type EntityOverlayDocument = {
  schema_version: number
  locale: string
  records: Record<string, EntityLocalizedCopy>
}

type EventOverlayDocument = {
  schema_version: number
  locale: string
  records: Record<string, EventLocalizedCopy>
}

const entityDocuments: Record<SupportedLocale, EntityOverlayDocument> = {
  en: enEntities,
  ja: jaEntities,
}

const eventDocuments: Record<SupportedLocale, EventOverlayDocument> = {
  en: enEvents,
  ja: jaEvents,
}

export function getEntityCopy(locale: SupportedLocale, slug: string): EntityLocalizedCopy | undefined {
  return entityDocuments[locale].records[slug]
}

export function getEventCopy(locale: SupportedLocale, eventId: string): EventLocalizedCopy | undefined {
  return eventDocuments[locale].records[eventId]
}

export function getCopyOverlayCounts(locale: SupportedLocale) {
  return {
    entities: Object.keys(entityDocuments[locale].records).length,
    events: Object.keys(eventDocuments[locale].records).length,
  }
}
