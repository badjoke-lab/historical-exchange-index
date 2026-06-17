import fs from 'node:fs'
import path from 'node:path'
import type { EntityRecord } from '../types/entity'
import { applyReviewedEntityCorrections } from './entity-corrections'
import { filterNewExchangeRecordBundles, loadExchangeRecordBundles } from './load-record-bundles'

function readJsonFile<T>(relativePath: string): T {
  const filePath = path.join(process.cwd(), relativePath)
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw) as T
}

export function loadEntities(): EntityRecord[] {
  const entities = readJsonFile<EntityRecord[]>('data/entities.json')
  const bundles = loadExchangeRecordBundles()
  const correctedEntities = applyReviewedEntityCorrections(entities, bundles)
  const bundleEntities = filterNewExchangeRecordBundles(bundles, entities).map(
    (bundle) => bundle.entity,
  )

  return [...correctedEntities, ...bundleEntities]
}
