import fs from 'node:fs'
import path from 'node:path'
import type { EntityRecord } from '../types/entity'

function readJsonFile<T>(relativePath: string): T {
  const filePath = path.join(process.cwd(), relativePath)
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw) as T
}

export function loadEntities(): EntityRecord[] {
  return readJsonFile<EntityRecord[]>('data/entities.json')
}
