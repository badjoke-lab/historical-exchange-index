import fs from 'node:fs'
import path from 'node:path'
import type { EventRecord } from '../types/event'

function readJsonFile<T>(relativePath: string): T {
  const filePath = path.join(process.cwd(), relativePath)
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw) as T
}

export function loadEvents(): EventRecord[] {
  return readJsonFile<EventRecord[]>('data/events.json')
}
