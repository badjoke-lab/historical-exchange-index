import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { loadReviewedBundles, mergeRecords } from './lib/reviewed-bundle-aggregation.mjs'
import { applyReviewedEntityCorrections } from './lib/entity-corrections.mjs'

const root = process.cwd()
const lineageEvents = new Set(['acquired', 'merged', 'rebranded', 'token_migration'])
const lineageStatuses = new Set(['acquired', 'merged', 'rebranded'])
const lineageReasons = new Set(['acquisition', 'merger', 'rebrand'])
const textRules = [
  ['predecessor', /\bpredecessor\b/i],
  ['successor', /\bsuccessor\b/i],
  ['rebrand', /\brebrand(?:ed|ing)?\b|\bformerly known as\b|\bnow known as\b/i],
  ['acquisition', /\bacquir(?:ed|er|ing|es|ition)\b/i],
  ['merger', /\bmerg(?:ed|er|ing|es)\b/i],
  ['migration', /\bmigrat(?:ed|ion|ing|es)\b/i],
  ['lineage', /\blineage\b/i],
]

const load = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
const present = (value) => typeof value === 'string' && value.trim() !== ''
const summarizeEntity = (entity) => ({
  id: entity.id,
  slug: entity.slug,
  canonical_name: entity.canonical_name,
  status: entity.status,
  death_reason: entity.death_reason ?? null,
  predecessor_id: entity.predecessor_id ?? null,
  successor_id: entity.successor_id ?? null,
  parent_id: entity.parent_id ?? null,
})
const summarizeEvent = (event) => ({
  id: event.id,
  event_type: event.event_type,
  event_date: event.event_date ?? null,
  title: event.title ?? '',
  event_status_effect: event.event_status_effect ?? null,
  counterparty_name: event.counterparty_name ?? null,
  counterparty_exchange_id: event.counterparty_exchange_id ?? null,
})

function textSignals(entity, events) {
  const text = [
    ...(entity.aliases ?? []), entity.summary, entity.notes,
    ...events.flatMap((event) => [event.title, event.description, event.notes, event.counterparty_name]),
  ].filter(present).join('\n')
  return textRules.filter(([, pattern]) => pattern.test(text)).map(([label]) => label)
}

function relationshipAudit(entities) {
  const byId = new Map(entities.map((entity) => [entity.id, entity]))
  const edges = []
  const missing = []
  const self = []
  const asymmetric = []

  for (const entity of entities) {
    for (const field of ['predecessor_id', 'successor_id']) {
      const targetId = entity[field]
      if (!present(targetId)) continue
      const edge = { entity_id: entity.id, entity_name: entity.canonical_name, field, target_id: targetId }
      edges.push(edge)
      if (targetId === entity.id) {
        self.push(edge)
        continue
      }
      const target = byId.get(targetId)
      if (!target) {
        missing.push(edge)
        continue
      }
      const reciprocalField = field === 'predecessor_id' ? 'successor_id' : 'predecessor_id'
      if (target[reciprocalField] !== entity.id) {
        asymmetric.push({
          ...edge,
          target_name: target.canonical_name,
          reciprocal_field: reciprocalField,
          reciprocal_actual: target[reciprocalField] ?? null,
        })
      }
    }
  }
  return { edges, missing, self, asymmetric }
}

function classify(entity, events, byId) {
  if (present(entity.predecessor_id) || present(entity.successor_id)) return 'linked_existing'
  const terminal = lineageStatuses.has(entity.status) || lineageReasons.has(entity.death_reason)
  const attributable = events.filter((event) => present(event.counterparty_exchange_id) && byId.has(event.counterparty_exchange_id))
  if (attributable.length > 0) {
    const ownershipOnly = attributable.every((event) =>
      event.event_type === 'acquired' && !terminal && ['active', 'limited', null].includes(event.event_status_effect ?? null),
    )
    return ownershipOnly ? 'document_only' : 'link_now'
  }
  if (events.some((event) => event.event_type === 'acquired') && !terminal) return 'document_only'
  if (events.some((event) => event.event_type === 'token_migration') && !terminal) return 'document_only'
  return 'unresolved'
}

export function buildInventory(entities, events) {
  const byId = new Map(entities.map((entity) => [entity.id, entity]))
  const byEntity = new Map()
  for (const event of events) {
    const list = byEntity.get(event.exchange_id) ?? []
    list.push(event)
    byEntity.set(event.exchange_id, list)
  }

  const relationships = relationshipAudit(entities)
  const invalidCounterparties = []
  const candidates = []
  const textWatchlist = []

  for (const entity of entities) {
    const allEvents = byEntity.get(entity.id) ?? []
    const relevantEvents = allEvents.filter((event) => lineageEvents.has(event.event_type))
    const signals = textSignals(entity, allEvents)
    for (const event of relevantEvents) {
      if (present(event.counterparty_exchange_id) && !byId.has(event.counterparty_exchange_id)) {
        invalidCounterparties.push({
          entity_id: entity.id,
          entity_name: entity.canonical_name,
          event_id: event.id,
          event_type: event.event_type,
          counterparty_exchange_id: event.counterparty_exchange_id,
          counterparty_name: event.counterparty_name ?? null,
        })
      }
    }

    const structured =
      present(entity.predecessor_id)
      || present(entity.successor_id)
      || lineageStatuses.has(entity.status)
      || lineageReasons.has(entity.death_reason)
      || relevantEvents.length > 0

    if (!structured) {
      if (signals.length > 0) textWatchlist.push({ entity: summarizeEntity(entity), text_signals: signals })
      continue
    }

    candidates.push({
      classification: classify(entity, relevantEvents, byId),
      entity: summarizeEntity(entity),
      lineage_events: relevantEvents.map(summarizeEvent),
      text_signals: signals,
    })
  }

  const count = (kind) => candidates.filter((item) => item.classification === kind).length
  const candidateCounts = {
    linked_existing: count('linked_existing'),
    link_now: count('link_now'),
    document_only: count('document_only'),
    unresolved: count('unresolved'),
  }
  return {
    generated_at: new Date().toISOString(),
    projected_public_entities: entities.length,
    projected_public_events: events.length,
    lineage_status_entities: entities.filter((entity) => lineageStatuses.has(entity.status)).length,
    lineage_death_reason_entities: entities.filter((entity) => lineageReasons.has(entity.death_reason)).length,
    lineage_events: events.filter((event) => lineageEvents.has(event.event_type)).length,
    existing_relationship_edges: relationships.edges.length,
    missing_relationship_targets: relationships.missing.length,
    self_relationships: relationships.self.length,
    asymmetric_relationships: relationships.asymmetric.length,
    invalid_event_counterparty_targets: invalidCounterparties.length,
    candidate_counts: candidateCounts,
    structured_review_queue_total: Object.values(candidateCounts).reduce((sum, value) => sum + value, 0),
    text_watchlist_total: textWatchlist.length,
    relationship_edges: relationships.edges,
    missing_target_records: relationships.missing,
    self_reference_records: relationships.self,
    asymmetric_records: relationships.asymmetric,
    invalid_counterparty_records: invalidCounterparties,
    candidates,
    text_watchlist: textWatchlist,
  }
}

function renderMarkdown(report) {
  const lines = [
    '# HEI A3 Lineage Inventory', '',
    `Generated: ${report.generated_at}`, '',
    '## Summary', '', '```text',
    `Projected public entities:          ${report.projected_public_entities}`,
    `Projected public events:            ${report.projected_public_events}`,
    `Lineage status entities:            ${report.lineage_status_entities}`,
    `Lineage death-reason entities:      ${report.lineage_death_reason_entities}`,
    `Lineage events:                     ${report.lineage_events}`,
    `Existing relationship edges:        ${report.existing_relationship_edges}`,
    `Missing relationship targets:       ${report.missing_relationship_targets}`,
    `Self relationships:                 ${report.self_relationships}`,
    `Asymmetric relationships:           ${report.asymmetric_relationships}`,
    `Invalid event counterparty targets: ${report.invalid_event_counterparty_targets}`,
    `linked_existing:                    ${report.candidate_counts.linked_existing}`,
    `link_now:                           ${report.candidate_counts.link_now}`,
    `document_only:                      ${report.candidate_counts.document_only}`,
    `unresolved:                         ${report.candidate_counts.unresolved}`,
    `Structured review queue:            ${report.structured_review_queue_total}`,
    `Text-only watchlist:                ${report.text_watchlist_total}`,
    '```', '',
  ]
  for (const kind of ['linked_existing', 'link_now', 'document_only', 'unresolved']) {
    const items = report.candidates.filter((item) => item.classification === kind)
    lines.push(`## ${kind} (${items.length})`, '')
    for (const item of items) {
      const eventText = item.lineage_events.map((event) => `${event.event_type}:${event.id}`).join(', ') || 'none'
      const signalText = item.text_signals.join(', ') || 'none'
      lines.push(`- ${item.entity.id} — ${item.entity.canonical_name} — events: ${eventText} — signals: ${signalText}`)
    }
    if (items.length === 0) lines.push('None.')
    lines.push('')
  }
  lines.push(`## Text-only watchlist (${report.text_watchlist_total})`, '')
  for (const item of report.text_watchlist) lines.push(`- ${item.entity.id} — ${item.entity.canonical_name} — ${item.text_signals.join(', ')}`)
  if (report.text_watchlist_total === 0) lines.push('None.')
  lines.push('')
  for (const [title, records] of [
    ['Missing targets', report.missing_target_records],
    ['Self references', report.self_reference_records],
    ['Asymmetric links', report.asymmetric_records],
    ['Invalid counterparties', report.invalid_counterparty_records],
  ]) {
    lines.push(`## ${title} (${records.length})`, '', '```json', JSON.stringify(records, null, 2), '```', '')
  }
  return `${lines.join('\n')}\n`
}

function selfTest() {
  const entities = [
    { id: 'hei_ex_000001', canonical_name: 'Old', status: 'rebranded', death_reason: 'rebrand', successor_id: 'hei_ex_000002' },
    { id: 'hei_ex_000002', canonical_name: 'New', status: 'active', predecessor_id: 'hei_ex_000001' },
    { id: 'hei_ex_000003', canonical_name: 'Owned', status: 'active' },
    { id: 'hei_ex_000004', canonical_name: 'Merged', status: 'merged', death_reason: 'merger' },
    { id: 'hei_ex_000005', canonical_name: 'Target', status: 'active' },
    { id: 'hei_ex_000006', canonical_name: 'Unknown Target', status: 'rebranded', death_reason: 'rebrand' },
    { id: 'hei_ex_000007', canonical_name: 'Text Only', status: 'active', notes: 'Historical lineage mention.' },
  ]
  const events = [
    { id: 'hei_ev_000001', exchange_id: 'hei_ex_000003', event_type: 'acquired', event_status_effect: 'active' },
    { id: 'hei_ev_000002', exchange_id: 'hei_ex_000004', event_type: 'merged', counterparty_exchange_id: 'hei_ex_000005' },
  ]
  const report = buildInventory(entities, events)
  const expected = { linked_existing: 2, link_now: 1, document_only: 1, unresolved: 1 }
  for (const [key, value] of Object.entries(expected)) {
    if (report.candidate_counts[key] !== value) throw new Error(`self-test ${key}: expected ${value}`)
  }
  if (report.asymmetric_relationships !== 0) throw new Error('self-test expected symmetric links')
  if (report.text_watchlist_total !== 1) throw new Error('self-test expected one text-only watch item')
  console.log('lineage inventory self-test passed')
}

function main() {
  if (process.argv.includes('--self-test')) return selfTest()
  const canonicalEntities = load('data/entities.json')
  const canonicalEvents = load('data/events.json')
  const { all, newEntityBundles, entityIdMap } = loadReviewedBundles(root, canonicalEntities)
  const entities = [
    ...applyReviewedEntityCorrections(canonicalEntities, all),
    ...newEntityBundles.map(({ bundle }) => bundle.entity),
  ]
  const events = mergeRecords(canonicalEvents, all, 'events', 'event', entityIdMap)
  const report = buildInventory(entities, events)
  const json = `${JSON.stringify(report, null, 2)}\n`
  const markdown = renderMarkdown(report)
  const jsonArg = process.argv.find((arg) => arg.startsWith('--output-json='))
  const mdArg = process.argv.find((arg) => arg.startsWith('--output-md='))
  if (jsonArg) {
    const file = path.resolve(root, jsonArg.slice(14))
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, json)
  }
  if (mdArg) {
    const file = path.resolve(root, mdArg.slice(12))
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, markdown)
  }
  if (process.argv.includes('--json')) console.log(json.trimEnd())
  else console.log(markdown)
}

main()
