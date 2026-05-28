import fs from 'node:fs'
import path from 'node:path'
import type { EventRecord } from '../types/event'
import type { EntityRecord } from '../types/entity'
import { filterNewExchangeRecordBundles, loadExchangeRecordBundles } from './load-record-bundles'

function readJsonFile<T>(relativePath: string): T {
  const filePath = path.join(process.cwd(), relativePath)
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw) as T
}

export function loadEvents(): EventRecord[] {
  const events = readJsonFile<EventRecord[]>('data/events.json')
  const entities = readJsonFile<EntityRecord[]>('data/entities.json')
  const seenIds = new Set(events.map((event) => event.id))
  const bundleEvents = filterNewExchangeRecordBundles(loadExchangeRecordBundles(), entities)
    .flatMap((bundle) => bundle.events)
    .filter((event) => !seenIds.has(event.id))

  return [...events, ...bundleEvents]
}
