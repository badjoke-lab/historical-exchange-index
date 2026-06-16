import fs from 'node:fs'
import path from 'node:path'
import type { EventRecord } from '../types/event'
import { loadExchangeRecordBundles } from './load-record-bundles'

function readJsonFile<T>(relativePath: string): T {
  const filePath = path.join(process.cwd(), relativePath)
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw) as T
}

export function loadEvents(): EventRecord[] {
  const events = readJsonFile<EventRecord[]>('data/events.json')
  const seenIds = new Set(events.map((event) => event.id))
  const bundleEvents = loadExchangeRecordBundles()
    .flatMap((bundle) => bundle.events)
    .filter((event) => {
      if (seenIds.has(event.id)) return false
      seenIds.add(event.id)
      return true
    })

  return [...events, ...bundleEvents]
}
