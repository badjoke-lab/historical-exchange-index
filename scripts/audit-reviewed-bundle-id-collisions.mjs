import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { loadReviewedBundles, stableStringify } from './lib/reviewed-bundle-aggregation.mjs'

const root = process.cwd()
const strict = process.argv.includes('--strict')
const outputArg = process.argv.find((arg) => arg.startsWith('--output='))

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
}

function remapRecord(record, entityIdMap) {
  const exchangeId = entityIdMap.get(record.exchange_id) ?? record.exchange_id
  return exchangeId === record.exchange_id ? record : { ...record, exchange_id: exchangeId }
}

function auditRecordType(canonicalRecords, bundles, field, label, entityIdMap) {
  const canonicalById = new Map(canonicalRecords.map((record) => [record.id, record]))
  const bundleById = new Map()
  const conflicts = []
  let identicalCanonicalDuplicates = 0
  let identicalBundleDuplicates = 0

  for (const { fileName, bundle } of bundles) {
    for (const sourceRecord of bundle[field] ?? []) {
      const record = remapRecord(sourceRecord, entityIdMap)
      const canonical = canonicalById.get(record.id)
      if (canonical) {
        if (stableStringify(canonical) === stableStringify(record)) {
          identicalCanonicalDuplicates += 1
        } else {
          conflicts.push({
            scope: 'canonical_vs_bundle',
            record_type: label,
            id: record.id,
            file: fileName,
            canonical: {
              exchange_id: canonical.exchange_id ?? null,
              event_id: canonical.event_id ?? null,
              title: canonical.title ?? null,
            },
            bundle: {
              exchange_id: record.exchange_id ?? null,
              event_id: record.event_id ?? null,
              title: record.title ?? null,
            },
          })
        }
        continue
      }

      const existing = bundleById.get(record.id)
      if (!existing) {
        bundleById.set(record.id, { fileName, record })
        continue
      }
      if (stableStringify(existing.record) === stableStringify(record)) {
        identicalBundleDuplicates += 1
      } else {
        conflicts.push({
          scope: 'bundle_vs_bundle',
          record_type: label,
          id: record.id,
          file: fileName,
          existing_file: existing.fileName,
          existing: {
            exchange_id: existing.record.exchange_id ?? null,
            event_id: existing.record.event_id ?? null,
            title: existing.record.title ?? null,
          },
          bundle: {
            exchange_id: record.exchange_id ?? null,
            event_id: record.event_id ?? null,
            title: record.title ?? null,
          },
        })
      }
    }
  }

  return {
    canonical_records: canonicalRecords.length,
    bundle_unique_additions: bundleById.size,
    identical_canonical_duplicates: identicalCanonicalDuplicates,
    identical_bundle_duplicates: identicalBundleDuplicates,
    conflict_count: conflicts.length,
    conflicts,
  }
}

const canonicalEntities = readJson('data/entities.json')
const canonicalEvents = readJson('data/events.json')
const canonicalEvidence = readJson('data/evidence.json')
const { all: reviewedBundles, entityIdMap } = loadReviewedBundles(root, canonicalEntities)

const report = {
  generated_at: new Date().toISOString(),
  reviewed_bundle_count: reviewedBundles.length,
  events: auditRecordType(canonicalEvents, reviewedBundles, 'events', 'event', entityIdMap),
  evidence: auditRecordType(canonicalEvidence, reviewedBundles, 'evidence', 'evidence', entityIdMap),
}
report.total_conflicts = report.events.conflict_count + report.evidence.conflict_count
report.status = report.total_conflicts === 0 ? 'pass' : 'fail'

if (outputArg) {
  const outputPath = path.resolve(root, outputArg.slice('--output='.length))
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}

console.log(`Reviewed bundles: ${report.reviewed_bundle_count}`)
console.log(`Event ID conflicts: ${report.events.conflict_count}`)
console.log(`Evidence ID conflicts: ${report.evidence.conflict_count}`)
for (const conflict of [...report.events.conflicts, ...report.evidence.conflicts]) {
  console.log(`- ${conflict.record_type} ${conflict.id}: ${conflict.file} (${conflict.scope})`)
}

if (strict && report.total_conflicts > 0) process.exit(1)
