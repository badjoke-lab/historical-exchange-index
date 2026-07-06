import assert from 'node:assert/strict'
import {
  canonicalizeExplorerQuery,
  explorerQueryHref,
  loadExplorerQueryContract,
  loadReviewedQueryValues,
  normalizeExplorerDate,
  normalizeExplorerSearchText,
  parseExplorerQuery,
  serializeExplorerQuery,
} from './lib/explorer-query-contract.mjs'

const contract = loadExplorerQueryContract()
const reviewedValues = loadReviewedQueryValues()

function equal(actual, expected, message) {
  assert.deepEqual(actual, expected, message)
}

function run() {
  equal(parseExplorerQuery('', contract, reviewedValues), { view: 'entities' }, 'default view')
  assert.equal(serializeExplorerQuery({ view: 'entities' }, contract, reviewedValues), 'view=entities')
  assert.equal(serializeExplorerQuery({ view: 'events' }, contract, reviewedValues), 'view=events')

  equal(
    parseExplorerQuery('view=entities&type=dex&type=cex&type=dex&status=dead&status=active', contract, reviewedValues),
    { view: 'entities', type: ['cex', 'dex'], status: ['active', 'dead'] },
    'multi enum values are deduplicated and sorted by contract order',
  )

  assert.equal(
    canonicalizeExplorerQuery('status=dead&type=dex&type=cex&view=entities&type=dex', contract, reviewedValues),
    'view=entities&type=cex&type=dex&status=dead',
    'canonical parameter order',
  )

  equal(
    parseExplorerQuery('view=events&status=dead&event_type=hack&event_type=other&type=cex', contract, reviewedValues),
    { view: 'events', event_type: ['hack', 'other'] },
    'cross-view parameters are ignored',
  )

  equal(
    parseExplorerQuery('view=entities&type=wat&status=dead&unknown_key=x', contract, reviewedValues),
    { view: 'entities', status: ['dead'] },
    'invalid enum and unknown keys are ignored',
  )

  equal(
    parseExplorerQuery('view=nope&event_type=hack&type=dex', contract, reviewedValues),
    { view: 'entities', type: ['dex'] },
    'invalid view falls back to entities and cross-view keys are ignored',
  )

  equal(
    parseExplorerQuery('view=entities&archive_available=yes&archive_available=true', contract, reviewedValues),
    { view: 'entities', archive_available: 'true' },
    'first valid boolean value is used',
  )

  equal(
    parseExplorerQuery('view=entities&launch_from=2020&launch_to=2022', contract, reviewedValues),
    { view: 'entities', launch_from: '2020-01-01', launch_to: '2022-12-31' },
    'year shorthand expands to inclusive ISO boundaries',
  )

  equal(
    parseExplorerQuery('view=events&date_from=2024-02-29&date_to=2024-02-30', contract, reviewedValues),
    { view: 'events', date_from: '2024-02-29' },
    'invalid calendar date is ignored',
  )

  equal(
    parseExplorerQuery('view=entities&launch_from=2025&launch_to=2020', contract, reviewedValues),
    { view: 'entities', launch_from: '2025-01-01', launch_to: '2020-12-31' },
    'inverted valid ranges are preserved for deterministic empty-result handling',
  )

  const firstOrigin = reviewedValues.entities.country_or_origin[0]
  assert.ok(firstOrigin, 'reviewed origin values should not be empty')
  const originLower = firstOrigin.toLocaleLowerCase('en-US')
  equal(
    parseExplorerQuery(`view=entities&country_or_origin=${encodeURIComponent(originLower)}`, contract, reviewedValues),
    { view: 'entities', country_or_origin: [firstOrigin] },
    'reviewed values match case-insensitively and serialize canonically',
  )

  equal(
    parseExplorerQuery('view=entities&country_or_origin=DefinitelyNotAReviewedOrigin', contract, reviewedValues),
    { view: 'entities' },
    'unknown reviewed values are ignored',
  )

  assert.equal(
    normalizeExplorerSearchText('  ＦＴＸ\n  collapse\tspace  ', 160),
    'FTX collapse space',
    'search text uses NFKC, trim, and collapsed whitespace',
  )

  const overlong = 'a'.repeat(200)
  assert.equal(normalizeExplorerSearchText(overlong, 160).length, 160, 'search text truncates at 160 code points')

  assert.equal(normalizeExplorerDate('2020', 'launch_from', contract), '2020-01-01')
  assert.equal(normalizeExplorerDate('2020', 'launch_to', contract), '2020-12-31')
  assert.equal(normalizeExplorerDate('2020-02-29', 'launch_from', contract), '2020-02-29')
  assert.equal(normalizeExplorerDate('2021-02-29', 'launch_from', contract), null)

  assert.equal(
    canonicalizeExplorerQuery('view=entities&sort=name_asc'),
    'view=entities',
    'default entity sort is omitted',
  )
  assert.equal(
    canonicalizeExplorerQuery('view=events&sort=date_newest'),
    'view=events',
    'default event sort is omitted',
  )
  assert.equal(
    canonicalizeExplorerQuery('view=events&sort=entity_name_asc'),
    'view=events&sort=entity_name_asc',
    'non-default sort is serialized',
  )

  const state = parseExplorerQuery(
    'view=events&q=%20FTX%20%20collapse%20&event_type=other&event_type=hack&date_from=2022&impact_level=critical&sort=entity_name_asc',
    contract,
    reviewedValues,
  )
  const serialized = serializeExplorerQuery(state, contract, reviewedValues)
  assert.equal(
    serialized,
    'view=events&q=FTX+collapse&event_type=hack&event_type=other&date_from=2022-01-01&impact_level=critical&sort=entity_name_asc',
    'stable event serialization order',
  )
  equal(parseExplorerQuery(serialized, contract, reviewedValues), state, 'round trip preserves normalized state')

  assert.equal(
    explorerQueryHref({ view: 'entities', status: ['dead'], type: ['dex'] }, contract, reviewedValues),
    '/explore/?view=entities&type=dex&status=dead',
    'href helper uses canonical route and query order',
  )

  console.log('Explorer query contract tests passed.')
}

run()
