import fs from 'node:fs'
import path from 'node:path'
import type { EvidenceRecord } from '../types/evidence'
import { loadExchangeRecordBundles } from './load-record-bundles'

function readJsonFile<T>(relativePath: string): T {
  const filePath = path.join(process.cwd(), relativePath)
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw) as T
}

export function loadEvidence(): EvidenceRecord[] {
  const evidence = readJsonFile<EvidenceRecord[]>('data/evidence.json')
  const seenIds = new Set(evidence.map((source) => source.id))
  const bundleEvidence = loadExchangeRecordBundles()
    .flatMap((bundle) => bundle.evidence)
    .filter((source) => !seenIds.has(source.id))

  return [...evidence, ...bundleEvidence]
}
