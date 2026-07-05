import fs from 'node:fs'
import path from 'node:path'
import type { RegistryUpdate, RegistryUpdateFile } from '../types/registry-update'

const UPDATE_TYPES = new Set(['registry_growth', 'quality_audit'])
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function readUpdateFile(): RegistryUpdateFile {
  const filePath = path.join(process.cwd(), 'data/registry-updates.json')
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as RegistryUpdateFile
}

function assertUpdate(update: RegistryUpdate, seenIds: Set<string>) {
  if (!update.id || seenIds.has(update.id)) throw new Error(`registry update id is missing or duplicated: ${update.id}`)
  if (!DATE_RE.test(update.date)) throw new Error(`registry update has invalid date: ${update.id}`)
  if (!UPDATE_TYPES.has(update.update_type)) throw new Error(`registry update has invalid type: ${update.id}`)
  if (!update.title || !update.summary) throw new Error(`registry update is missing title or summary: ${update.id}`)
  if (!Array.isArray(update.added_entities) || !Array.isArray(update.updated_entities) || !Array.isArray(update.notes)) {
    throw new Error(`registry update arrays are invalid: ${update.id}`)
  }

  const countKeys = [
    'entities_before',
    'entities_after',
    'events_before',
    'events_after',
    'evidence_before',
    'evidence_after',
  ] as const
  for (const key of countKeys) {
    if (!Number.isInteger(update.counts[key]) || update.counts[key] < 0) {
      throw new Error(`registry update count is invalid: ${update.id}:${key}`)
    }
  }
  if (!Number.isInteger(update.evidence_added) || update.evidence_added < 0) {
    throw new Error(`registry update evidence_added is invalid: ${update.id}`)
  }

  seenIds.add(update.id)
}

export function loadRegistryUpdates(): RegistryUpdate[] {
  const file = readUpdateFile()
  if (file.version !== 1 || !Array.isArray(file.updates)) {
    throw new Error('data/registry-updates.json has unsupported shape')
  }

  const seenIds = new Set<string>()
  file.updates.forEach((update) => assertUpdate(update, seenIds))

  return [...file.updates].sort((a, b) => {
    const dateOrder = b.date.localeCompare(a.date)
    return dateOrder !== 0 ? dateOrder : a.id.localeCompare(b.id)
  })
}
