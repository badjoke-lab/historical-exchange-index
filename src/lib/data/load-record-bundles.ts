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

type IdentityIndex = Map<string, Set<string>>

type IdentityIndexes = {
  id: IdentityIndex
  slug: IdentityIndex
  domain: IdentityIndex
  name: IdentityIndex
  alias: IdentityIndex
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

function addOwner(index: IdentityIndex, value: string | null | undefined, entityId: string): void {
  const key = normalizeIdentity(value)
  if (!key) return
  const owners = index.get(key) ?? new Set<string>()
  owners.add(entityId)
  index.set(key, owners)
}

function registerEntity(indexes: IdentityIndexes, entity: EntityRecord, entityId = entity.id): void {
  addOwner(indexes.id, entity.id, entityId)
  addOwner(indexes.slug, entity.slug, entityId)
  addOwner(indexes.domain, entity.official_domain_original, entityId)
  addOwner(indexes.domain, entity.official_url_original, entityId)
  addOwner(indexes.name, entity.canonical_name, entityId)
  for (const alias of entity.aliases) addOwner(indexes.alias, alias, entityId)
}

function uniqueMatch(
  index: IdentityIndex,
  values: Array<string | null | undefined>,
  slug: string,
  label: string,
): string | null {
  const matches = new Set<string>()
  for (const value of values) {
    const key = normalizeIdentity(value)
    if (!key) continue
    for (const entityId of index.get(key) ?? []) matches.add(entityId)
  }
  if (matches.size > 1) {
    throw new Error(`${slug}: ambiguous ${label} match: ${[...matches].join(', ')}`)
  }
  return matches.size === 1 ? [...matches][0] : null
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

export function buildBundleEntityIdMap(
  bundles: ExchangeRecordBundle[],
  baseEntities: EntityRecord[],
): Map<string, string> {
  const indexes: IdentityIndexes = {
    id: new Map(),
    slug: new Map(),
    domain: new Map(),
    name: new Map(),
    alias: new Map(),
  }
  const sourceToCanonical = new Map<string, string>(
    baseEntities.map((entity) => [entity.id, entity.id]),
  )

  for (const entity of baseEntities) registerEntity(indexes, entity)

  for (const bundle of bundles) {
    const entity = bundle.entity
    let canonicalId = uniqueMatch(indexes.id, [entity.id], entity.slug, 'id')
    if (!canonicalId) canonicalId = uniqueMatch(indexes.slug, [entity.slug], entity.slug, 'slug')
    if (!canonicalId) {
      canonicalId = uniqueMatch(
        indexes.domain,
        [entity.official_domain_original, entity.official_url_original],
        entity.slug,
        'domain',
      )
    }
    if (!canonicalId) {
      canonicalId = uniqueMatch(indexes.name, [entity.canonical_name], entity.slug, 'canonical name')
    }
    if (!canonicalId) {
      canonicalId = uniqueMatch(
        indexes.alias,
        [entity.canonical_name, ...entity.aliases],
        entity.slug,
        'alias',
      )
    }
    if (!canonicalId) canonicalId = entity.id

    sourceToCanonical.set(entity.id, canonicalId)
    registerEntity(indexes, entity, canonicalId)
  }

  return sourceToCanonical
}

export function filterNewExchangeRecordBundles(
  bundles: ExchangeRecordBundle[],
  baseEntities: EntityRecord[],
): ExchangeRecordBundle[] {
  const entityIdMap = buildBundleEntityIdMap(bundles, baseEntities)
  const acceptedIds = new Set(baseEntities.map((entity) => entity.id))
  const acceptedBundles: ExchangeRecordBundle[] = []

  for (const bundle of bundles) {
    const resolvedId = entityIdMap.get(bundle.entity.id)
    if (resolvedId !== bundle.entity.id || acceptedIds.has(bundle.entity.id)) continue
    acceptedBundles.push(bundle)
    acceptedIds.add(bundle.entity.id)
  }

  return acceptedBundles
}
