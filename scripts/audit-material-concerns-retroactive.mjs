import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = process.cwd()
const RECORDS_DIR = path.join(ROOT, 'records', 'exchanges')
const OUTPUT_DIR = path.join(ROOT, 'docs', 'audits')
const JSON_OUTPUT = path.join(OUTPUT_DIR, 'material-concerns-retroactive-audit-index.json')
const MD_OUTPUT = path.join(OUTPUT_DIR, 'material-concerns-retroactive-audit-summary.md')

const DIMENSIONS = [
  'operator_jurisdiction',
  'registration_regulatory',
  'custody_withdrawal',
  'service_restrictions',
  'insolvency_failure',
  'fraud_misconduct',
  'domain_state',
  'ownership_control'
]

const text = (value) => typeof value === 'string' ? value : ''
const lower = (value) => text(value).toLowerCase()

function corpusText(record) {
  const entity = record.entity ?? {}
  const events = Array.isArray(record.events) ? record.events : []
  const evidence = Array.isArray(record.evidence) ? record.evidence : []
  return [
    entity.summary,
    entity.notes,
    ...events.flatMap((event) => [event.event_type, event.title, event.description, event.notes]),
    ...evidence.flatMap((item) => [item.source_type, item.title, item.publisher, item.claim_scope, item.notes])
  ].map(lower).join(' ')
}

function classify(record) {
  const entity = record.entity ?? {}
  const events = Array.isArray(record.events) ? record.events : []
  const evidence = Array.isArray(record.evidence) ? record.evidence : []
  const all = corpusText(record)
  const eventText = events.map((event) => [event.event_type, event.title, event.description, event.notes].map(lower).join(' ')).join(' ')
  const results = {}

  results.operator_jurisdiction = entity.country_or_origin && lower(entity.country_or_origin) !== 'unknown'
    ? 'derivable'
    : 'research_required'

  results.registration_regulatory = /regulat|enforcement|licen[cs]|registration|authority|sanction|sec\b|cftc\b|fca\b|fsa\b|finma\b|mas\b/.test(all)
    ? 'derivable'
    : 'research_required'

  results.custody_withdrawal = /custod|withdraw|deposit|wallet|key holder|seed|mpc|fireblocks/.test(all)
    ? 'derivable'
    : 'research_required'

  results.service_restrictions = /suspend|halt|freeze|restrict|limited|maintenance|outage|cease|shutdown|withdrawal_suspended|deposit_suspended|trading_halted/.test(eventText)
    ? 'derivable'
    : 'research_required'

  results.insolvency_failure = /bankrupt|insolven|liquidat|restructur|collapse|failure|receivership/.test(all)
    ? 'derivable'
    : (['dead'].includes(entity.status) ? 'research_required' : 'not_applicable')

  results.fraud_misconduct = /fraud|scam|rug|misconduct|embezz|money laundering|wash trad/.test(all)
    ? 'derivable'
    : 'research_required'

  results.domain_state = ['unsafe', 'repurposed', 'dead_domain', 'redirected'].includes(entity.official_url_status)
    || entity.official_url_original
    || entity.official_domain_original
      ? 'derivable'
      : 'research_required'

  results.ownership_control = entity.predecessor_id || entity.successor_id
    || /acquir|merg|rebrand|ownership|owner|control change|parent compan/.test(all)
      ? 'derivable'
      : 'research_required'

  const sourceCoverage = evidence.length
  const derived = Object.values(results).filter((value) => value === 'derivable').length
  const researchRequired = Object.values(results).filter((value) => value === 'research_required').length
  const notApplicable = Object.values(results).filter((value) => value === 'not_applicable').length

  return {
    entity_id: entity.id ?? null,
    slug: entity.slug ?? null,
    canonical_name: entity.canonical_name ?? null,
    type: entity.type ?? null,
    status: entity.status ?? null,
    evidence_count: sourceCoverage,
    dimensions: results,
    counts: {
      derivable: derived,
      research_required: researchRequired,
      not_applicable: notApplicable
    }
  }
}

async function main() {
  const files = (await readdir(RECORDS_DIR)).filter((name) => name.endsWith('.json')).sort()
  const rows = []
  const parseErrors = []

  for (const name of files) {
    const filePath = path.join(RECORDS_DIR, name)
    try {
      const record = JSON.parse(await readFile(filePath, 'utf8'))
      rows.push(classify(record))
    } catch (error) {
      parseErrors.push({ file: name, error: error instanceof Error ? error.message : String(error) })
    }
  }

  const dimensionSummary = Object.fromEntries(DIMENSIONS.map((dimension) => [dimension, {
    derivable: rows.filter((row) => row.dimensions[dimension] === 'derivable').length,
    research_required: rows.filter((row) => row.dimensions[dimension] === 'research_required').length,
    not_applicable: rows.filter((row) => row.dimensions[dimension] === 'not_applicable').length
  }]))

  const summary = {
    generated_at: new Date().toISOString(),
    source: 'records/exchanges/*.json',
    record_count: rows.length,
    parse_errors: parseErrors,
    dimension_summary: dimensionSummary,
    research_queue_count: rows.filter((row) => row.counts.research_required > 0).length,
    fully_derivable_count: rows.filter((row) => row.counts.research_required === 0).length,
    rows
  }

  await mkdir(OUTPUT_DIR, { recursive: true })
  await writeFile(JSON_OUTPUT, `${JSON.stringify(summary, null, 2)}\n`, 'utf8')

  const md = [
    '# HEI material concerns retroactive audit — generated summary',
    '',
    'Status: generated audit index; review required before canonical corrections',
    'Parent: #853',
    '',
    `- Canonical exchange bundles scanned: **${rows.length}**`,
    `- Bundles with one or more research-required dimensions: **${summary.research_queue_count}**`,
    `- Bundles fully classifiable from current canonical material: **${summary.fully_derivable_count}**`,
    `- Parse errors: **${parseErrors.length}**`,
    '',
    '## Dimension coverage',
    '',
    '| Dimension | Derivable | Research required | Not applicable |',
    '| --- | ---: | ---: | ---: |',
    ...DIMENSIONS.map((dimension) => {
      const item = dimensionSummary[dimension]
      return `| ${dimension} | ${item.derivable} | ${item.research_required} | ${item.not_applicable} |`
    }),
    '',
    '## Interpretation',
    '',
    '- `derivable` means the current canonical bundle contains material that can support the public concern/known-unknown presentation.',
    '- `research_required` means absence or ambiguity must become research work; it is not a favorable safety conclusion.',
    '- `not_applicable` is used narrowly where the dimension is structurally inapplicable under the current lifecycle state.',
    '- This audit does not mutate entity/event/evidence/relationship canonical data and does not assign a safety score.',
    '',
    '## Next gate',
    '',
    'Review the generated JSON queue, convert material gaps into bounded correction batches, then rerun this audit after each merged batch until the remaining research queue is explicitly dispositioned.',
    ''
  ].join('\n')

  await writeFile(MD_OUTPUT, md, 'utf8')

  console.log(`Scanned ${rows.length} exchange bundles`)
  console.log(`Research queue: ${summary.research_queue_count}`)
  if (parseErrors.length) {
    console.error(`Parse errors: ${parseErrors.length}`)
    process.exitCode = 1
  }
}

await main()
