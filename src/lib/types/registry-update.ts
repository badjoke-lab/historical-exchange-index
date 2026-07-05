export type RegistryUpdateType = 'registry_growth' | 'quality_audit'

export type RegistryUpdateEntity = {
  name: string
  slug: string
  type?: 'cex' | 'dex' | 'hybrid'
  status?: string
}

export type RegistryUpdatedEntity = {
  name: string
  slug: string
  change: string
}

export type RegistryUpdateCounts = {
  entities_before: number
  entities_after: number
  events_before: number
  events_after: number
  evidence_before: number
  evidence_after: number
}

export type RegistryUpdate = {
  id: string
  date: string
  update_type: RegistryUpdateType
  title: string
  summary: string
  counts: RegistryUpdateCounts
  added_entities: RegistryUpdateEntity[]
  updated_entities: RegistryUpdatedEntity[]
  evidence_added: number
  notes: string[]
}

export type RegistryUpdateFile = {
  version: number
  updates: RegistryUpdate[]
}
