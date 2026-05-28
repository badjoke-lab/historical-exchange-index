import fs from 'node:fs'
import path from 'node:path'
import type { EntityRecord } from '../types/entity'
import { filterNewExchangeRecordBundles, loadExchangeRecordBundles } from './load-record-bundles'

function readJsonFile<T>(relativePath: string): T {
  const filePath = path.join(process.cwd(), relativePath)
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw) as T
}

export function loadEntities(): EntityRecord[] {
  const entities = readJsonFile<EntityRecord[]>('data/entities.json')
  const bundleEntities = filterNewExchangeRecordBundles(loadExchangeRecordBundles(), entities).map(
    (bundle) => bundle.entity,
  )

  return [...entities, ...bundleEntities]
}
