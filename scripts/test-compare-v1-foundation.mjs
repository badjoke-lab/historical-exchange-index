import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const root = process.cwd()

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function loadPureTsModule(relativePath) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8')
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    fileName: relativePath,
  }).outputText

  const module = { exports: {} }
  const blockedRequire = (specifier) => {
    throw new Error(`Unexpected runtime import in pure Compare test module: ${specifier}`)
  }
  const execute = new Function('exports', 'module', 'require', output)
  execute(module.exports, module, blockedRequire)
  return module.exports
}

const query = loadPureTsModule('src/lib/compare/compare-query.ts')
const core = loadPureTsModule('src/lib/compare/compare-core.ts')
const contract = JSON.parse(fs.readFileSync(path.join(root, 'config/compare-v1-contract.json'), 'utf8'))

assert(query.COMPARE_ROUTE === contract.route, 'Compare route constant differs from contract')
assert(query.COMPARE_PARAMETER === contract.selection.parameter, 'Compare parameter constant differs from contract')
assert(query.COMPARE_MIN_SELECTION === contract.selection.minimum_meaningful_selection, 'Compare minimum differs from contract')
assert(query.COMPARE_MAX_SELECTION === contract.selection.maximum_selection, 'Compare maximum differs from contract')

const validSlugs = new Set(['mt-gox', 'ftx', 'binance', 'quadrigacx', 'btc-e'])
const params = new URLSearchParams()
for (const slug of ['mt-gox', 'ftx', 'mt-gox', 'unknown-exchange', 'binance', 'quadrigacx', 'btc-e']) {
  params.append('exchange', slug)
}
params.set('ignored', 'value')

const parsed = query.parseCompareSelection(params, validSlugs)
assert(
  JSON.stringify(parsed.selectedSlugs) === JSON.stringify(['mt-gox', 'ftx', 'binance', 'quadrigacx']),
  `Unexpected selected order: ${JSON.stringify(parsed.selectedSlugs)}`,
)
assert(JSON.stringify(parsed.duplicateSlugs) === JSON.stringify(['mt-gox']), 'Duplicate selection not reported')
assert(JSON.stringify(parsed.invalidSlugs) === JSON.stringify(['unknown-exchange']), 'Invalid selection not reported')
assert(JSON.stringify(parsed.omittedValidSlugs) === JSON.stringify(['btc-e']), 'Over-limit valid selection not reported')

const serialized = query.serializeCompareSelection(['ftx', 'mt-gox', 'ftx', 'binance', 'quadrigacx', 'btc-e'])
assert(
  serialized === 'exchange=ftx&exchange=mt-gox&exchange=binance&exchange=quadrigacx',
  `Unexpected serialization: ${serialized}`,
)
assert(
  query.buildCompareHref(['ftx', 'mt-gox']) === '/compare/?exchange=ftx&exchange=mt-gox',
  'Compare href does not preserve selection order',
)
assert(query.buildCompareHref([]) === '/compare/', 'Empty Compare href must use base route')

assert(core.deriveLifespanDays('2020-01-01', '2021-01-01') === 366, 'Leap-year lifespan mismatch')
assert(core.deriveLifespanDays('2021-01-01', '2020-01-01') === null, 'Reversed lifespan must be null')
assert(core.deriveLifespanDays('2020-02-30', '2021-01-01') === null, 'Invalid launch date must be null')
assert(core.deriveLifespanDays('2020-01-01', null) === null, 'Ongoing lifespan must be null')

function event(id, impactLevel, eventDate, sortOrder) {
  return {
    id,
    exchange_id: 'hei_ex_test',
    event_type: 'other',
    event_date: eventDate,
    title: id,
    description: id,
    confidence: 'high',
    impact_level: impactLevel,
    event_status_effect: 'none',
    source_count: 1,
    sort_order: sortOrder,
    notes: '',
  }
}

const major = core.selectMajorEvents([
  event('medium-new', 'medium', '2025-01-01', 1),
  event('critical-old', 'critical', '2020-01-01', 1),
  event('high-old', 'high', '2022-01-01', 1),
  event('critical-new', 'critical', '2024-01-01', 2),
  event('critical-new-first-order', 'critical', '2024-01-01', 1),
])

assert(
  JSON.stringify(major.map((item) => item.id)) ===
    JSON.stringify(['critical-new-first-order', 'critical-new', 'critical-old']),
  `Major-event ordering mismatch: ${JSON.stringify(major.map((item) => item.id))}`,
)
assert(major.length === contract.major_events.maximum_per_entity, 'Major-event maximum differs from contract')

console.log('Compare v1 production logic self-test passed.')
