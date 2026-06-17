import fs from 'node:fs'
import path from 'node:path'
import type { EntityRecord } from '../types/entity'
import type { EventRecord } from '../types/event'
import type { EvidenceRecord } from '../types/evidence'
import type { EntityCorrection } from './entity-corrections'

export interface ExchangeRecordBundle {
  entity: EntityRecord
  entity_correction?: EntityCorrection
  events: EventRecord[]
  evidence: EvidenceRecord[]
}

function readJsonFile<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw) as T
}

function normalizeIdentity(value: string | null | undefined): string | null {
  if (!value) return null
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')

  return normalized.length > 0 ? normalized : null
}

function addIdentityKey(keys: Set<string>, value: string | null | undefined): void {
  const normalized = normalizeIdentity(value)
  if (normalized) keys.add(normalized)
}

export function getEntityIdentityKeys(entity: EntityRecord): Set<string> {
  const keys = new Set<string>()

  addIdentityKey(keys, entity.id)
  addIdentityKey(keys, entity.slug)
  addIdentityKey(keys, entity.canonical_name)
  addIdentityKey(keys, entity.official_domain_original)
  addIdentityKey(keys, entity.official_url_original)

  for (const alias of entity.aliases) {
    addIdentityKey(keys, alias)
  }

  return keys
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

export function filterNewExchangeRecordBundles(
  bundles: ExchangeRecordBundle[],
  baseEntities: EntityRecord[],
): ExchangeRecordBundle[] {
  const seenIdentityKeys = new Set<string>()

  for (const entity of baseEntities) {
    for (const key of getEntityIdentityKeys(entity)) {
      seenIdentityKeys.add(key)
    }
  }

  const acceptedBundles: ExchangeRecordBundle[] = []

  for (const bundle of bundles) {
    const bundleKeys = getEntityIdentityKeys(bundle.entity)
    const hasExistingIdentity = [...bundleKeys].some((key) => seenIdentityKeys.has(key))

    if (hasExistingIdentity) {
      continue
    }

    acceptedBundles.push(bundle)

    for (const key of bundleKeys) {
      seenIdentityKeys.add(key)
    }
  }

  return acceptedBundles
}
