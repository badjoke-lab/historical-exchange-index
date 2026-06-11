import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const entitiesPath = path.join(root, 'data', 'entities.json')
const eventsPath = path.join(root, 'data', 'events.json')
const evidencePath = path.join(root, 'data', 'evidence.json')
const recordsDir = path.join(root, 'records', 'exchanges')
const consumedDir = path.join(root, 'docs', 'backlog', 'consumed')
const auditDir = path.join(root, 'docs', 'backlog', 'audits')

const migrations = [
  ['quadrigacx.json', 'hei_ex_000004'],
  ['btc-e.json', 'hei_ex_000005'],
  ['coinbase.json', 'hei_ex_000012'],
  ['bitfinex.json', 'hei_ex_000017'],
  ['bitmex.json', 'hei_ex_000062'],
  ['backpack.json', 'hei_ex_000068'],
  ['nobitex.json', 'hei_ex_000073'],
  ['cobinhood.json', 'hei_ex_000114'],
  ['altsbit.json', 'hei_ex_000115'],
  ['wex.json', 'hei_ex_000116'],
  ['localbitcoins.json', 'hei_ex_000124'],
  ['coinsetter.json', 'hei_ex_000125'],
  ['bitfront.json', 'hei_ex_000128'],
  ['youbit.json', 'hei_ex_000130'],
  ['clevercoin.json', 'hei_ex_000134'],
  ['the-rock-trading.json', 'hei_ex_000139'],
  ['bitsane.json', 'hei_ex_000154'],
  ['bter.json', 'hei_ex_000155'],
  ['acx.json', 'hei_ex_000164'],
  ['vebitcoin.json', 'hei_ex_000204'],
  ['bitmarket.json', 'hei_ex_000207'],
  ['balancer.json', 'hei_ex_000228'],
  ['fcoin.json', 'hei_ex_000249'],
  ['bitfloor.json', 'hei_ex_000256'],
  ['litebit.json', 'hei_ex_000283'],
  ['bit-trade-australia.json', 'hei_ex_000285'],
  ['localmonero.json', 'hei_ex_000294'],
]

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
const idNumber = (id) => Number(String(id || '').match(/_(\d+)$/)?.[1] || 0)
const normalize = (value) => String(value || '').normalize('NFKC').toLowerCase().replace(/[^a-z0-9]+/g, '')
const precision = (value) => (typeof value === 'string' ? value.length : 0)

function walkMarkdown(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walkMarkdown(full)
    return entry.name.endsWith('.md') ? [full] : []
  })
}

const entities = readJson(entitiesPath)
const events = readJson(eventsPath)
const evidence = readJson(evidencePath)
const entityById = new Map(entities.map((item) => [item.id, item]))
let nextEvent = Math.max(0, ...events.map((item) => idNumber(item.id))) + 1
let nextEvidence = Math.max(0, ...evidence.map((item) => idNumber(item.id))) + 1
const report = []
const notices = new Map()
const touchedEvents = new Set()

for (const [fileName, canonicalId] of migrations) {
  const filePath = path.join(recordsDir, fileName)
  if (!fs.existsSync(filePath)) continue

  const bundle = readJson(filePath)
  const canonical = entityById.get(canonicalId)
  if (!canonical) throw new Error(`Missing canonical entity ${canonicalId} for ${fileName}`)

  const oldId = bundle.entity.id
  canonical.aliases = [...new Set([...(canonical.aliases || []), ...(bundle.entity.aliases || [])])]
    .filter((value) => value && value !== canonical.canonical_name)

  if (!canonical.summary || bundle.entity.summary?.length > canonical.summary.length + 20) canonical.summary = bundle.entity.summary
  if (precision(bundle.entity.launch_date) > precision(canonical.launch_date)) canonical.launch_date = bundle.entity.launch_date
  if (precision(bundle.entity.death_date) > precision(canonical.death_date)) canonical.death_date = bundle.entity.death_date
  if ((!canonical.country_or_origin || ['global', 'unknown'].includes(String(canonical.country_or_origin).toLowerCase())) && bundle.entity.country_or_origin) {
    canonical.country_or_origin = bundle.entity.country_or_origin
  }
  for (const key of ['official_url_original', 'official_domain_original', 'archived_url']) {
    if (!canonical[key] && bundle.entity[key]) canonical[key] = bundle.entity[key]
  }
  const confidenceRank = { low: 1, medium: 2, high: 3 }
  if ((confidenceRank[bundle.entity.confidence] || 0) > (confidenceRank[canonical.confidence] || 0)) canonical.confidence = bundle.entity.confidence
  if (bundle.entity.last_verified_at && (!canonical.last_verified_at || bundle.entity.last_verified_at > canonical.last_verified_at)) {
    canonical.last_verified_at = bundle.entity.last_verified_at
  }

  const eventMap = new Map()
  let migratedEvents = 0
  let migratedEvidence = 0

  for (const event of bundle.events || []) {
    if (event.event_type === 'listed_reference') {
      eventMap.set(event.id, null)
      continue
    }

    const existing = events.find((item) =>
      item.exchange_id === canonicalId &&
      item.event_date === event.event_date &&
      (normalize(item.title) === normalize(event.title) || item.event_type === event.event_type),
    )

    if (existing) {
      eventMap.set(event.id, existing.id)
      touchedEvents.add(existing.id)
      continue
    }

    const newId = `hei_ev_${String(nextEvent++).padStart(6, '0')}`
    eventMap.set(event.id, newId)
    events.push({ ...event, id: newId, exchange_id: canonicalId })
    touchedEvents.add(newId)
    migratedEvents += 1
  }

  for (const source of bundle.evidence || []) {
    const targetEventId = source.event_id ? eventMap.get(source.event_id) ?? null : null
    const duplicate = evidence.some((item) => item.exchange_id === canonicalId && item.url === source.url)
    if (duplicate) continue

    const newId = `hei_src_${String(nextEvidence++).padStart(6, '0')}`
    evidence.push({
      ...source,
      id: newId,
      exchange_id: canonicalId,
      event_id: targetEventId,
      claim_scope: targetEventId ? source.claim_scope : 'entity',
    })
    if (targetEventId) touchedEvents.add(targetEventId)
    migratedEvidence += 1
  }

  fs.unlinkSync(filePath)
  notices.set(oldId, canonicalId)
  report.push({ fileName, oldId, canonicalId, migratedEvents, migratedEvidence })
}

for (const event of events) {
  if (!touchedEvents.has(event.id)) continue
  event.source_count = evidence.filter((item) => item.event_id === event.id).length
}

for (const file of walkMarkdown(consumedDir)) {
  let text = fs.readFileSync(file, 'utf8')
  const matches = [...notices.entries()].filter(([oldId]) => text.includes(oldId))
  if (matches.length === 0 || text.startsWith('> Correction: duplicate entity')) continue
  const notice = matches
    .map(([oldId, canonicalId]) => `> Correction: duplicate entity \`${oldId}\` was removed and its useful event/evidence material was migrated to canonical \`${canonicalId}\`. This memo remains as backlog-processing history.`)
    .join('\n')
  fs.writeFileSync(file, `${notice}\n\n${text}`)
}

entities.sort((a, b) => idNumber(a.id) - idNumber(b.id))
events.sort((a, b) => idNumber(a.id) - idNumber(b.id))
evidence.sort((a, b) => idNumber(a.id) - idNumber(b.id))
writeJson(entitiesPath, entities)
writeJson(eventsPath, events)
writeJson(evidencePath, evidence)

fs.mkdirSync(auditDir, { recursive: true })
const lines = [
  '# Duplicate Record Bundle Correction — 2026-06-10',
  '',
  'A repository-wide canonical-to-bundle identity comparison identified duplicate entity bundles.',
  'Confirmed duplicates were removed and useful event/evidence material was migrated to the pre-existing canonical entity IDs.',
  '',
  '| Removed bundle | Removed ID | Canonical ID | Events migrated | Evidence migrated |',
  '|---|---|---|---:|---:|',
  ...report.map((item) => `| \`${item.fileName}\` | \`${item.oldId}\` | \`${item.canonicalId}\` | ${item.migratedEvents} | ${item.migratedEvidence} |`),
  '',
  '## Explicitly retained distinct entities',
  '',
  '- Bittrex Global and Bittrex remain separate entities under the existing methodology decision.',
  '- BitTrade Australia and the separate BitTrade record remain distinct pending any later evidence-backed relationship decision.',
  '',
  '## Validation changes',
  '',
  '- Canonical-to-bundle identity comparison now runs before other record validation.',
  '- The Records validation workflow now uses `set -o pipefail`, so failures cannot be hidden by output piping.',
]
fs.writeFileSync(path.join(auditDir, 'duplicate-record-bundle-correction-2026-06-10.md'), `${lines.join('\n')}\n`)

const oneTimeWorkflow = path.join(root, '.github', 'workflows', 'run-duplicate-migration.yml')
if (fs.existsSync(oneTimeWorkflow)) fs.unlinkSync(oneTimeWorkflow)
fs.unlinkSync(new URL(import.meta.url))
console.log(`Migrated ${report.length} duplicate record bundles.`)
