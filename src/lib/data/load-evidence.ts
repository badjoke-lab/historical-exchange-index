import fs from 'node:fs'
import path from 'node:path'
import type { EntityRecord } from '../types/entity'
import type { EvidenceRecord } from '../types/evidence'
import { buildBundleEntityIdMap, loadExchangeRecordBundles } from './load-record-bundles'

function readJsonFile<T>(relativePath: string): T {
  const filePath = path.join(process.cwd(), relativePath)
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw) as T
}

export function loadEvidence(): EvidenceRecord[] {
  const evidence = readJsonFile<EvidenceRecord[]>('data/evidence.json')
  const baseEntities = readJsonFile<EntityRecord[]>('data/entities.json')
  const bundles = loadExchangeRecordBundles()
  const entityIdMap = buildBundleEntityIdMap(bundles, baseEntities)
  const seenIds = new Set(evidence.map((source) => source.id))
  const bundleEvidence = bundles
    .flatMap((bundle) => bundle.evidence)
    .filter((source) => {
      if (seenIds.has(source.id)) return false
      seenIds.add(source.id)
      return true
    })

  return [...evidence, ...bundleEvidence].map((source) => ({
    ...source,
    exchange_id: entityIdMap.get(source.exchange_id) ?? source.exchange_id,
  }))
}
