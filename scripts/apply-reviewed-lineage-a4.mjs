import fs from 'node:fs'
import path from 'node:path'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'

const root = process.cwd()
const recordDir = path.join(root, 'records', 'exchanges')
const manifestPath = path.join(root, 'config', 'lineage-a4-application.json')
const missingMarker = { __hei_missing__: true }

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const hasOwn = (object, field) => Object.prototype.hasOwnProperty.call(object, field)
function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`
  }
  return JSON.stringify(value)
}

const canonicalEntities = readJson(path.join(root, 'data', 'entities.json'))
const canonicalById = new Map(canonicalEntities.map((entity) => [entity.id, entity]))
const canonicalIds = new Set(canonicalById.keys())
const l1 = readJson(path.join(root, 'config', 'lineage-l1-dispositions.json'))
const l2 = readJson(path.join(root, 'config', 'lineage-l2-dispositions.json'))

const bundleEntries = []
const bundleById = new Map()
for (const fileName of fs.readdirSync(recordDir).filter((name) => name.endsWith('.json')).sort()) {
  const filePath = path.join(recordDir, fileName)
  const bundle = readJson(filePath)
  if (bundleById.has(bundle.entity.id)) throw new Error(`duplicate record bundle entity: ${bundle.entity.id}`)
  const entry = { fileName, filePath, bundle }
  bundleEntries.push(entry)
  bundleById.set(bundle.entity.id, entry)
}

const projectedBaseline = [
  ...applyReviewedEntityCorrections(canonicalEntities, bundleEntries),
  ...bundleEntries.filter(({ bundle }) => !canonicalIds.has(bundle.entity.id)).map(({ bundle }) => bundle.entity),
]
const baselineById = new Map(projectedBaseline.map((entity) => [entity.id, entity]))

const planned = new Map()
function addChange(entityId, field, appliedValue, source) {
  const baseline = baselineById.get(entityId)
  if (!baseline) throw new Error(`projected public entity not found: ${entityId}`)
  const key = `${entityId}:${field}`
  const existing = planned.get(key)
  if (existing) {
    if (stable(existing.applied_value) !== stable(appliedValue)) throw new Error(`conflicting A4 values for ${key}`)
    existing.source_refs.push(source)
    return
  }
  const expectedBefore = hasOwn(baseline, field) ? baseline[field] : missingMarker
  if (hasOwn(baseline, field) && stable(baseline[field]) === stable(appliedValue)) {
    throw new Error(`A4 action is already projected: ${key}`)
  }
  planned.set(key, {
    entity_id: entityId,
    entity_name: baseline.canonical_name,
    field,
    expected_before: expectedBefore,
    applied_value: appliedValue,
    source_refs: [source],
  })
}

for (const item of l1.dispositions) {
  if (item.disposition === 'add_reciprocal') {
    const reciprocalField = item.field === 'successor_id' ? 'predecessor_id' : 'successor_id'
    addChange(item.target_id, reciprocalField, item.entity_id, `L1:${item.entity_id}:${item.disposition}`)
  } else if (item.disposition === 'remove_to_event_only') {
    addChange(item.entity_id, item.field, null, `L1:${item.entity_id}:${item.disposition}`)
  }
}

for (const item of l2.dispositions) {
  if (item.classification !== 'link_now') continue
  addChange(item.entity_id, item.relation_field, item.target_id, `L2:${item.entity_id}:${item.link_mode}`)
  if (item.link_mode === 'reciprocal_pair') {
    const reciprocalField = item.relation_field === 'successor_id' ? 'predecessor_id' : 'successor_id'
    addChange(item.target_id, reciprocalField, item.entity_id, `L2:${item.entity_id}:reciprocal`)
  }
}

if (planned.size !== 14) throw new Error(`expected 14 unique A4 field changes, got ${planned.size}`)

const changesByEntity = new Map()
for (const change of planned.values()) {
  const list = changesByEntity.get(change.entity_id) ?? []
  list.push(change)
  changesByEntity.set(change.entity_id, list)
}

const changedFiles = []
for (const [entityId, changes] of [...changesByEntity.entries()].sort()) {
  const baseline = baselineById.get(entityId)
  const isCanonical = canonicalIds.has(entityId)
  let entry = bundleById.get(entityId)

  if (!entry) {
    if (!isCanonical) throw new Error(`projected-only entity lacks its source bundle: ${entityId}`)
    const fileName = `${baseline.slug}.json`
    const filePath = path.join(recordDir, fileName)
    if (fs.existsSync(filePath)) throw new Error(`record path already exists for ${entityId}: ${fileName}`)
    entry = {
      fileName,
      filePath,
      bundle: {
        entity: { ...baseline },
        events: [],
        evidence: [],
      },
    }
    bundleById.set(entityId, entry)
  }

  const { fileName, filePath, bundle } = entry
  if (bundle.entity.id !== entityId) throw new Error(`${fileName}: bundle entity mismatch`)

  if (isCanonical) {
    const canonical = canonicalById.get(entityId)
    const correction = bundle.entity_correction ?? { entity_id: entityId, expected: {}, changes: {} }
    if (correction.entity_id !== entityId) throw new Error(`${fileName}: correction entity mismatch`)

    for (const change of changes.sort((a, b) => a.field.localeCompare(b.field))) {
      if (hasOwn(correction.changes, change.field)) {
        if (stable(correction.changes[change.field]) !== stable(change.applied_value)) {
          throw new Error(`${fileName}: existing correction conflicts for ${change.field}`)
        }
      } else {
        correction.expected[change.field] = hasOwn(canonical, change.field) ? canonical[change.field] : missingMarker
        correction.changes[change.field] = change.applied_value
      }
      bundle.entity[change.field] = change.applied_value
    }
    bundle.entity_correction = correction
  } else {
    if (bundle.entity_correction) throw new Error(`${fileName}: projected-only entity must not use entity_correction`)
    for (const change of changes) bundle.entity[change.field] = change.applied_value
  }

  fs.writeFileSync(filePath, `${JSON.stringify(bundle, null, 2)}\n`, 'utf8')
  changedFiles.push(fileName)
}

const manifest = {
  version: 1,
  applied_at: '2026-06-21',
  source_review_prs: [409, 410, 411],
  scope: 'reviewed_a4_canonical_lineage_field_changes',
  baseline_projected_entities: projectedBaseline.length,
  change_count: planned.size,
  entity_count: changesByEntity.size,
  changes: [...planned.values()].sort((a, b) =>
    a.entity_id.localeCompare(b.entity_id) || a.field.localeCompare(b.field),
  ),
}
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

console.log(`Applied ${manifest.change_count} lineage field changes across ${manifest.entity_count} entities.`)
console.log(changedFiles.join('\n'))
