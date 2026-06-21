import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { loadReviewedBundles } from './lib/reviewed-bundle-aggregation.mjs'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'
import { restorePreA4LineageEntities } from './lib/lineage-a4-baseline.mjs'

const root = process.cwd()
const load = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
const hasOwn = (object, field) => Object.prototype.hasOwnProperty.call(object, field)
function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`
  }
  return JSON.stringify(value)
}

const failures = []
const fail = (message) => failures.push(message)
const canonicalEntities = load('data/entities.json')
const l1 = load('config/lineage-l1-dispositions.json')
const l2 = load('config/lineage-l2-dispositions.json')
const manifest = load('config/lineage-a4-application.json')
const { all, newEntityBundles } = loadReviewedBundles(root, canonicalEntities)
const projectedEntities = [
  ...applyReviewedEntityCorrections(canonicalEntities, all),
  ...newEntityBundles.map(({ bundle }) => bundle.entity),
]
const baselineEntities = restorePreA4LineageEntities(projectedEntities, manifest)
const baselineById = new Map(baselineEntities.map((entity) => [entity.id, entity]))
const projectedById = new Map(projectedEntities.map((entity) => [entity.id, entity]))

const expectedChanges = new Map()
function addExpected(entityId, field, value, sourceRef) {
  const key = `${entityId}:${field}`
  const existing = expectedChanges.get(key)
  if (existing) {
    if (stable(existing.applied_value) !== stable(value)) fail(`${key}: conflicting derived A4 values`)
    else existing.source_refs.add(sourceRef)
    return
  }
  expectedChanges.set(key, {
    entity_id: entityId,
    field,
    applied_value: value,
    source_refs: new Set([sourceRef]),
  })
}

for (const item of l1.dispositions ?? []) {
  if (item.disposition === 'add_reciprocal') {
    const reciprocalField = item.field === 'successor_id' ? 'predecessor_id' : 'successor_id'
    addExpected(item.target_id, reciprocalField, item.entity_id, `L1:${item.entity_id}:${item.disposition}`)
  } else if (item.disposition === 'remove_to_event_only') {
    addExpected(item.entity_id, item.field, null, `L1:${item.entity_id}:${item.disposition}`)
  }
}
for (const item of l2.dispositions ?? []) {
  if (item.classification !== 'link_now') continue
  addExpected(item.entity_id, item.relation_field, item.target_id, `L2:${item.entity_id}:${item.link_mode}`)
  if (item.link_mode === 'reciprocal_pair') {
    const reciprocalField = item.relation_field === 'successor_id' ? 'predecessor_id' : 'successor_id'
    addExpected(item.target_id, reciprocalField, item.entity_id, `L2:${item.entity_id}:reciprocal`)
  }
}

if (manifest.version !== 1) fail('manifest version must be 1')
if (manifest.scope !== 'reviewed_a4_canonical_lineage_field_changes') fail('unexpected manifest scope')
if (!Array.isArray(manifest.changes)) fail('manifest changes must be an array')
if (manifest.baseline_projected_entities !== 412) fail(`manifest baseline_projected_entities must be 412, got ${manifest.baseline_projected_entities}`)
if (manifest.change_count !== 14) fail(`manifest change_count must be 14, got ${manifest.change_count}`)
if (manifest.entity_count !== 14) fail(`manifest entity_count must be 14, got ${manifest.entity_count}`)
if (expectedChanges.size !== 14) fail(`derived A4 change count must be 14, got ${expectedChanges.size}`)
if ((manifest.changes ?? []).length !== 14) fail(`manifest must contain 14 changes, got ${manifest.changes?.length ?? 0}`)
if (baselineEntities.length !== manifest.baseline_projected_entities) {
  fail(`baseline projected entity count changed: ${baselineEntities.length}`)
}
if (projectedEntities.length !== manifest.baseline_projected_entities) {
  fail(`projected entity count changed: ${projectedEntities.length}`)
}

const manifestByKey = new Map()
for (const change of manifest.changes ?? []) {
  const key = `${change.entity_id}:${change.field}`
  if (manifestByKey.has(key)) fail(`duplicate manifest change: ${key}`)
  manifestByKey.set(key, change)
  if (!['predecessor_id', 'successor_id'].includes(change.field)) fail(`${key}: invalid A4 field`)

  const baseline = baselineById.get(change.entity_id)
  const projected = projectedById.get(change.entity_id)
  if (!baseline) fail(`${key}: baseline projected entity missing`)
  if (!projected) fail(`${key}: projected entity missing`)
  if (baseline && change.entity_name !== baseline.canonical_name) fail(`${key}: entity_name drift`)

  const expectedBefore = change.expected_before
  const expectsMissing = expectedBefore
    && typeof expectedBefore === 'object'
    && !Array.isArray(expectedBefore)
    && expectedBefore.__hei_missing__ === true
    && Object.keys(expectedBefore).length === 1
  if (baseline) {
    if (expectsMissing) {
      if (hasOwn(baseline, change.field)) fail(`${key}: expected-before marker says missing but baseline field exists`)
    } else if (stable(baseline[change.field]) !== stable(expectedBefore)) {
      fail(`${key}: expected_before does not match baseline projected value`)
    }
  }
  if (projected && stable(projected[change.field]) !== stable(change.applied_value)) {
    fail(`${key}: projected value does not match applied_value`)
  }
}

for (const [key, expected] of expectedChanges) {
  const actual = manifestByKey.get(key)
  if (!actual) {
    fail(`${key}: missing from A4 manifest`)
    continue
  }
  if (stable(actual.applied_value) !== stable(expected.applied_value)) fail(`${key}: manifest applied value differs from reviewed dispositions`)
  const actualRefs = new Set(actual.source_refs ?? [])
  for (const sourceRef of expected.source_refs) {
    if (!actualRefs.has(sourceRef)) fail(`${key}: missing source reference ${sourceRef}`)
  }
}
for (const key of manifestByKey.keys()) {
  if (!expectedChanges.has(key)) fail(`${key}: manifest includes an unreviewed change`)
}

const expectedFinal = new Map()
for (const entity of baselineEntities) {
  for (const field of ['predecessor_id', 'successor_id']) {
    if (typeof entity[field] === 'string' && entity[field]) expectedFinal.set(`${entity.id}:${field}`, entity[field])
  }
}
for (const expected of expectedChanges.values()) {
  const key = `${expected.entity_id}:${expected.field}`
  if (expected.applied_value === null) expectedFinal.delete(key)
  else expectedFinal.set(key, expected.applied_value)
}

const actualFinal = new Map()
let missingTargets = 0
let selfRelationships = 0
for (const entity of projectedEntities) {
  for (const field of ['predecessor_id', 'successor_id']) {
    const targetId = entity[field]
    if (typeof targetId !== 'string' || !targetId) continue
    const key = `${entity.id}:${field}`
    actualFinal.set(key, targetId)
    if (!projectedById.has(targetId)) missingTargets += 1
    if (targetId === entity.id) selfRelationships += 1
  }
}
if (actualFinal.size !== expectedFinal.size) fail(`relationship edge count mismatch: expected ${expectedFinal.size}, got ${actualFinal.size}`)
for (const [key, targetId] of expectedFinal) {
  if (actualFinal.get(key) !== targetId) fail(`${key}: final relationship target mismatch`)
}
for (const key of actualFinal.keys()) {
  if (!expectedFinal.has(key)) fail(`${key}: unreviewed relationship edge exists`)
}
if (missingTargets !== 0) fail(`missing relationship targets: ${missingTargets}`)
if (selfRelationships !== 0) fail(`self relationships: ${selfRelationships}`)

const protectedL2Ids = new Set(
  (l2.dispositions ?? [])
    .filter((item) => item.classification !== 'link_now')
    .map((item) => item.entity_id),
)
for (const change of manifest.changes ?? []) {
  if (protectedL2Ids.has(change.entity_id)) fail(`${change.entity_id}: document-only or unresolved L2 entity was modified`)
}

const report = {
  generated_at: new Date().toISOString(),
  phase: 'A4',
  status: failures.length === 0 ? 'pass' : 'fail',
  canonical_source_entities: canonicalEntities.length,
  baseline_projected_entities: baselineEntities.length,
  projected_entities: projectedEntities.length,
  reviewed_changes: expectedChanges.size,
  applied_changes: manifest.changes?.length ?? 0,
  relationship_edges: actualFinal.size,
  missing_relationship_targets: missingTargets,
  self_relationships: selfRelationships,
  protected_l2_entities: protectedL2Ids.size,
  failures,
}

const outputArg = process.argv.find((arg) => arg.startsWith('--output='))
if (outputArg) {
  const outputPath = path.resolve(root, outputArg.slice('--output='.length))
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}

console.log(`Canonical source entities: ${report.canonical_source_entities}`)
console.log(`Baseline projected entities: ${report.baseline_projected_entities}`)
console.log(`Reviewed A4 changes: ${report.reviewed_changes}`)
console.log(`Applied A4 changes: ${report.applied_changes}`)
console.log(`Relationship edges: ${report.relationship_edges}`)
console.log(`Missing targets: ${report.missing_relationship_targets}`)
console.log(`Self relationships: ${report.self_relationships}`)
if (failures.length > 0) {
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}
console.log('A4 lineage application: pass')
