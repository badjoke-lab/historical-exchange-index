import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import {
  buildBundleEntityIdMap,
  loadReviewedBundles,
  mergeRecords,
} from '../scripts/lib/reviewed-bundle-aggregation.mjs'
import { applyReviewedEntityCorrections } from '../scripts/lib/entity-corrections.mjs'

const root = process.cwd()
const args = process.argv.slice(2)
const full = args.includes('--full')
const sampleSizeArg = args.find((arg) => arg.startsWith('--sample-size='))
const outArg = args.find((arg) => arg.startsWith('--out='))
const sourceCommitArg = args.find((arg) => arg.startsWith('--source-commit='))
const sampleSize = sampleSizeArg ? Number(sampleSizeArg.split('=')[1]) : 25

if (!Number.isInteger(sampleSize) || sampleSize < 1 || sampleSize > 250) {
  throw new Error('--sample-size must be an integer between 1 and 250')
}

const mode = full ? 'full' : 'sample'
const defaultOut = path.join(root, '.commercial-output', `hei-dataset-${mode}`)
const outputDir = path.resolve(root, outArg ? outArg.slice('--out='.length) : defaultOut)
const sourceCommit = sourceCommitArg?.slice('--source-commit='.length) || process.env.HEI_SOURCE_COMMIT || null

const protectedRoots = [
  path.join(root, 'data'),
  path.join(root, 'records'),
  path.join(root, 'public'),
  path.join(root, 'data-staging'),
]
for (const protectedRoot of protectedRoots) {
  if (outputDir === protectedRoot || outputDir.startsWith(`${protectedRoot}${path.sep}`)) {
    throw new Error(`Refusing to write commercial output into protected repository path: ${outputDir}`)
  }
}

function readJson(relativePath, fallback = []) {
  const filePath = path.join(root, relativePath)
  return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : fallback
}

function csvValue(value) {
  if (value === null || value === undefined) return ''
  const text = typeof value === 'object' ? JSON.stringify(value) : String(value)
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

function writeCsv(filePath, columns, rows) {
  const lines = [columns.join(',')]
  for (const row of rows) {
    lines.push(columns.map((column) => csvValue(row[column])).join(','))
  }
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf8')
}

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex')
}

const canonicalEntities = readJson('data/entities.json')
const canonicalEvents = readJson('data/events.json')
const canonicalEvidence = readJson('data/evidence.json')
const { all: reviewedBundles, newEntityBundles } = loadReviewedBundles(root, canonicalEntities)
const correctedCanonicalEntities = applyReviewedEntityCorrections(canonicalEntities, reviewedBundles)
const entities = [...correctedCanonicalEntities, ...newEntityBundles.map(({ bundle }) => bundle.entity)]
const entityIdMap = buildBundleEntityIdMap(correctedCanonicalEntities, reviewedBundles)
const events = mergeRecords(canonicalEvents, reviewedBundles, 'events', 'event', entityIdMap)
const evidence = mergeRecords(canonicalEvidence, reviewedBundles, 'evidence', 'evidence', entityIdMap)

const entityById = new Map(entities.map((entity) => [entity.id, entity]))
const sortedEntities = [...entities].sort((a, b) => String(a.slug).localeCompare(String(b.slug)))
const selectedEntities = full ? sortedEntities : sortedEntities.slice(0, sampleSize)
const selectedIds = new Set(selectedEntities.map((entity) => entity.id))
const selectedEvents = events
  .filter((event) => selectedIds.has(event.exchange_id))
  .sort((a, b) => {
    const byExchange = String(a.exchange_id).localeCompare(String(b.exchange_id))
    if (byExchange !== 0) return byExchange
    const byDate = String(a.event_date ?? '').localeCompare(String(b.event_date ?? ''))
    if (byDate !== 0) return byDate
    return String(a.id).localeCompare(String(b.id))
  })
const selectedEvidence = evidence
  .filter((item) => selectedIds.has(item.exchange_id))
  .sort((a, b) => {
    const byExchange = String(a.exchange_id).localeCompare(String(b.exchange_id))
    if (byExchange !== 0) return byExchange
    return String(a.id).localeCompare(String(b.id))
  })

const forbiddenMarkers = ['candidate_class', 'data-staging', 'internal monitoring', 'private research note']
const serialized = JSON.stringify({
  entities: selectedEntities,
  events: selectedEvents,
  evidence: selectedEvidence,
})
for (const marker of forbiddenMarkers) {
  if (serialized.includes(marker)) throw new Error(`Commercial export leaked forbidden marker: ${marker}`)
}

fs.rmSync(outputDir, { recursive: true, force: true })
fs.mkdirSync(outputDir, { recursive: true })

const exchangeColumns = [
  'id',
  'slug',
  'canonical_name',
  'aliases',
  'type',
  'status',
  'death_reason',
  'launch_date',
  'death_date',
  'country_or_origin',
  'official_domain_original',
  'official_url_status',
  'archived_url',
  'confidence',
  'last_verified_at',
  'predecessor_id',
  'successor_id',
]

const eventColumns = [
  'id',
  'exchange_id',
  'exchange_slug',
  'event_type',
  'event_date',
  'title',
  'description',
  'confidence',
  'impact_level',
  'event_status_effect',
  'source_count',
  'sort_order',
]

const evidenceColumns = [
  'id',
  'exchange_id',
  'exchange_slug',
  'event_id',
  'source_type',
  'title',
  'url',
  'publisher',
  'published_at',
  'archived_url',
  'accessed_at',
  'reliability',
  'claim_scope',
]

const exchangeRows = selectedEntities.map((entity) => ({
  ...entity,
  aliases: entity.aliases ?? [],
}))
const eventRows = selectedEvents.map((event) => ({
  ...event,
  exchange_slug: entityById.get(event.exchange_id)?.slug ?? '',
}))
const evidenceRows = selectedEvidence.map((item) => ({
  ...item,
  exchange_slug: entityById.get(item.exchange_id)?.slug ?? '',
}))

const exchangesPath = path.join(outputDir, 'exchanges.csv')
const eventsPath = path.join(outputDir, 'events.csv')
const evidencePath = path.join(outputDir, 'evidence.csv')
writeCsv(exchangesPath, exchangeColumns, exchangeRows)
writeCsv(eventsPath, eventColumns, eventRows)
writeCsv(evidencePath, evidenceColumns, evidenceRows)

const bundlePath = path.join(outputDir, 'dataset.json')
fs.writeFileSync(
  bundlePath,
  `${JSON.stringify(
    {
      schema_version: '1.0.0',
      data_schema_version: 'hei_commercial_exchange_lifecycle_v1',
      project_id: 'historical-exchange-index',
      export_mode: mode,
      canonical_only: true,
      records: {
        exchanges: exchangeRows,
        events: eventRows,
        evidence: evidenceRows,
      },
    },
    null,
    2,
  )}\n`,
  'utf8',
)

const files = ['exchanges.csv', 'events.csv', 'evidence.csv', 'dataset.json']
const hashes = Object.fromEntries(
  files.map((name) => [name, { sha256: sha256(path.join(outputDir, name)), bytes: fs.statSync(path.join(outputDir, name)).size }]),
)

const manifest = {
  schema_version: '1.0.0',
  data_schema_version: 'hei_commercial_exchange_lifecycle_v1',
  project_id: 'historical-exchange-index',
  product_name: 'Crypto Exchange Lifecycle & Incident Dataset',
  export_mode: mode,
  canonical_only: true,
  prepublication: true,
  generated_at: new Date().toISOString(),
  source_repository: 'badjoke-lab/historical-exchange-index',
  source_commit: sourceCommit,
  counts: {
    exchanges: exchangeRows.length,
    events: eventRows.length,
    evidence: evidenceRows.length,
  },
  files: hashes,
  notice: 'Pre-publication evaluation output. Commercial license, marketplace approval, pricing, and update cadence are not finalized.',
}
fs.writeFileSync(path.join(outputDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

console.log(
  `Built HEI commercial dataset ${mode} export: ${exchangeRows.length} exchanges / ${eventRows.length} events / ${evidenceRows.length} evidence -> ${outputDir}`,
)
if (!full) {
  console.log('Sample mode is the default. Re-run with --full only for an explicitly authorized complete local export.')
}
