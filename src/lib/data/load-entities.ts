import fs from 'node:fs'
import path from 'node:path'
import type { EntityRecord } from '../types/entity'
import { loadExchangeRecordBundles } from './load-record-bundles'

function readJsonFile<T>(relativePath: string): T {
  const filePath = path.join(process.cwd(), relativePath)
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw) as T
}

export function loadEntities(): EntityRecord[] {
  const entities = readJsonFile<EntityRecord[]>('data/entities.json')
  const seenIds = new Set(entities.map((entity) => entity.id))
  const bundleEntities = loadExchangeRecordBundles()
    .map((bundle) => bundle.entity)
    .filter((entity) => !seenIds.has(entity.id))

  return [...entities, ...bundleEntities]
}
