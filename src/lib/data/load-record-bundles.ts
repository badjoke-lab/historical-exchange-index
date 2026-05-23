import fs from 'node:fs'
import path from 'node:path'
import type { EntityRecord } from '../types/entity'
import type { EventRecord } from '../types/event'
import type { EvidenceRecord } from '../types/evidence'

export interface ExchangeRecordBundle {
  entity: EntityRecord
  events: EventRecord[]
  evidence: EvidenceRecord[]
}

function readJsonFile<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw) as T
}

export function loadExchangeRecordBundles(): ExchangeRecordBundle[] {
  const recordsDir = path.join(process.cwd(), 'records', 'exchanges')

  if (!fs.existsSync(recordsDir)) {
    return []
  }

  return fs
    .readdirSync(recordsDir)
    .filter((fileName) => fileName.endsWith('.json'))
    .sort((a, b) => a.localeCompare(b))
    .map((fileName) => readJsonFile<ExchangeRecordBundle>(path.join(recordsDir, fileName)))
}
