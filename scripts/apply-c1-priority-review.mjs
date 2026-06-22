import fs from 'node:fs'

const file = 'data-staging/candidate-scans/c1-scan-01.json'
const scan = JSON.parse(fs.readFileSync(file, 'utf8'))

const reviews = {
  'candidate:aevo-perps': {
    proposed_canonical_name: 'Aevo',
    proposed_aliases: ['Aevo Perps', 'Aevo Exchange'],
    scan_disposition: 'add_now',
    entity_boundary: 'distinct_entity',
    duplicate_status: 'clear',
    likely_type: 'dex',
    likely_status: 'active',
    official_sources: ['https://docs.aevo.xyz/'],
    independent_sources: ['https://www.coindesk.com/markets/2024/05/21/crypto-derivatives-dex-aevos-token-jumps-10-as-binance-labs-discloses-investment'],
    minimum_record_shape: { meaningful_events: 2, evidence_records: 3 },
    confidence: 'high',
    unresolved_questions: ['Confirm the exact Ribbon Finance to Aevo lineage dates during record drafting.'],
    assigned_batch: 'c1-growth-batch-02',
    review_notes: 'Aevo Perps is a product surface of the distinct Aevo derivatives exchange. Model the entity as Aevo, not as a separate perps-only exchange.',
  },
  'candidate:curve-dex': {
    proposed_canonical_name: 'Curve Finance',
    proposed_aliases: ['Curve', 'Curve DEX'],
    scan_disposition: 'add_now',
    entity_boundary: 'distinct_entity',
    duplicate_status: 'clear',
    likely_type: 'dex',
    likely_status: 'active',
    official_sources: ['https://docs.curve.finance/'],
    independent_sources: ['https://messari.io/report/curve-finance-valuation-report'],
    minimum_record_shape: { meaningful_events: 2, evidence_records: 3 },
    confidence: 'high',
    unresolved_questions: [],
    assigned_batch: 'c1-growth-batch-01',
    review_notes: 'Distinct AMM DEX identity. Use Curve Finance as the canonical entity name.',
  },
  'candidate:dx-exchange': {
    proposed_canonical_name: 'DX.Exchange',
    proposed_aliases: ['DX Exchange'],
    scan_disposition: 'add_now',
    entity_boundary: 'distinct_entity',
    duplicate_status: 'clear',
    likely_type: 'cex',
    likely_status: 'dead',
    official_sources: ['https://web.archive.org/web/*/https://dx.exchange/'],
    independent_sources: [
      'https://www.coindesk.com/markets/2019/11/04/dxexchange-halts-operations-seeks-buyer-10-months-after-launch',
      'https://www.theblock.co/post/45672/nasdaq-powered-crypto-platform-dx-exchange-shuts-down-on-lookout-for-merger-or-acquisition',
    ],
    minimum_record_shape: { meaningful_events: 2, evidence_records: 3 },
    confidence: 'high',
    unresolved_questions: ['Capture a dated official shutdown announcement archive during record drafting.'],
    assigned_batch: 'c1-growth-batch-01',
    review_notes: 'Distinct historical centralized exchange. Launch and 2019 shutdown are independently documented.',
  },
  'candidate:dydx-v4': {
    proposed_canonical_name: 'dYdX',
    proposed_aliases: ['dYdX V4', 'dYdX Chain'],
    scan_disposition: 'add_now',
    entity_boundary: 'distinct_entity',
    duplicate_status: 'clear',
    likely_type: 'dex',
    likely_status: 'active',
    official_sources: ['https://docs.dydx.xyz/'],
    independent_sources: ['https://www.coindesk.com/tech/2023/10/24/dydx-decentralized-crypto-exchange-open-sources-v4-code-for-upcoming-cosmos-chain'],
    minimum_record_shape: { meaningful_events: 3, evidence_records: 4 },
    confidence: 'high',
    unresolved_questions: ['Model V3 to V4 as platform evolution, not two public entities.'],
    assigned_batch: 'c1-growth-batch-01',
    review_notes: 'The public entity is dYdX. V4 is a major chain/platform migration and event in the same entity lifecycle.',
  },
  'candidate:gains-network': {
    proposed_canonical_name: 'gTrade',
    proposed_aliases: ['Gains Network', 'Gains.trade'],
    scan_disposition: 'add_now',
    entity_boundary: 'distinct_entity',
    duplicate_status: 'clear',
    likely_type: 'dex',
    likely_status: 'active',
    official_sources: ['https://docs.gains.trade/gtrade-leveraged-trading/overview'],
    independent_sources: ['https://www.coingecko.com/learn/what-is-gains-network-gns'],
    minimum_record_shape: { meaningful_events: 2, evidence_records: 3 },
    confidence: 'medium',
    unresolved_questions: ['Confirm the earliest public gTrade launch date from an archived official source.'],
    assigned_batch: 'c1-growth-batch-02',
    review_notes: 'Gains Network is the builder/protocol organization; gTrade is the exchange identity to publish.',
  },
  'candidate:joe-dex': {
    proposed_canonical_name: 'LFJ',
    proposed_aliases: ['Trader Joe', 'Joe DEX'],
    scan_disposition: 'add_now',
    entity_boundary: 'distinct_entity',
    duplicate_status: 'clear',
    likely_type: 'dex',
    likely_status: 'active',
    official_sources: ['https://docs.lfj.gg/'],
    independent_sources: ['https://coinmarketcap.com/exchanges/trader-joe-avalanche/'],
    minimum_record_shape: { meaningful_events: 3, evidence_records: 4 },
    confidence: 'high',
    unresolved_questions: ['Confirm the dated Trader Joe to LFJ rebrand announcement during record drafting.'],
    assigned_batch: 'c1-growth-batch-01',
    review_notes: 'Distinct multichain DEX. Model Trader Joe to LFJ as a rebrand in one entity lifecycle.',
  },
  'candidate:jupiter-perpetual-exchange': {
    proposed_canonical_name: 'Jupiter Perpetuals',
    proposed_aliases: ['Jupiter Perpetual Exchange'],
    scan_disposition: 'needs_research',
    entity_boundary: 'product_or_version',
    duplicate_status: 'pending',
    likely_type: 'dex',
    likely_status: 'active',
    official_sources: ['https://dev.jup.ag/docs/perps'],
    independent_sources: [],
    minimum_record_shape: { meaningful_events: 1, evidence_records: 1 },
    confidence: 'low',
    unresolved_questions: [
      'Decide whether Jupiter Perpetuals is a distinct exchange entity or a product surface within the broader Jupiter trading platform.',
      'Find a durable independent source covering launch and operating status.',
    ],
    assigned_batch: null,
    review_notes: 'Official materials describe a perpetual exchange program, but entity boundaries versus the Jupiter aggregator remain unresolved.',
  },
  'candidate:orca-dex': {
    proposed_canonical_name: 'Orca',
    proposed_aliases: ['Orca DEX'],
    scan_disposition: 'add_now',
    entity_boundary: 'distinct_entity',
    duplicate_status: 'clear',
    likely_type: 'dex',
    likely_status: 'active',
    official_sources: ['https://docs.orca.so/support/about'],
    independent_sources: ['https://blockworks.co/news/solana-based-dex-orca-closes-18m-series-a-to-build-amm'],
    minimum_record_shape: { meaningful_events: 2, evidence_records: 3 },
    confidence: 'high',
    unresolved_questions: [],
    assigned_batch: 'c1-growth-batch-01',
    review_notes: 'Distinct Solana spot DEX identity with official history and current operating documentation.',
  },
  'candidate:osmosis-dex': {
    proposed_canonical_name: 'Osmosis',
    proposed_aliases: ['Osmosis DEX'],
    scan_disposition: 'add_now',
    entity_boundary: 'distinct_entity',
    duplicate_status: 'clear',
    likely_type: 'dex',
    likely_status: 'active',
    official_sources: ['https://docs.osmosis.zone/'],
    independent_sources: ['https://www.coindesk.com/business/2021/10/27/osmosis-closes-21m-token-sale-led-by-paradigm'],
    minimum_record_shape: { meaningful_events: 2, evidence_records: 3 },
    confidence: 'high',
    unresolved_questions: [],
    assigned_batch: 'c1-growth-batch-01',
    review_notes: 'Distinct cross-chain DEX and appchain identity. Do not split chain deployments into separate entities.',
  },
  'candidate:quickswap-dex': {
    proposed_canonical_name: 'QuickSwap',
    proposed_aliases: ['Quickswap Dex', 'QuickSwap DEX'],
    scan_disposition: 'add_now',
    entity_boundary: 'distinct_entity',
    duplicate_status: 'clear',
    likely_type: 'dex',
    likely_status: 'active',
    official_sources: ['https://docs.quickswap.exchange/'],
    independent_sources: ['https://coinmarketcap.com/exchanges/quickswap/'],
    minimum_record_shape: { meaningful_events: 2, evidence_records: 3 },
    confidence: 'high',
    unresolved_questions: [],
    assigned_batch: 'c1-growth-batch-01',
    review_notes: 'Distinct DEX identity. Treat V2, V3, perps integrations, and chain deployments as products/events unless later evidence requires separation.',
  },
  'candidate:thorchain-dex': {
    proposed_canonical_name: 'THORChain',
    proposed_aliases: ['Thorchain DEX', 'THORChain DEX'],
    scan_disposition: 'add_now',
    entity_boundary: 'distinct_entity',
    duplicate_status: 'clear',
    likely_type: 'dex',
    likely_status: 'active',
    official_sources: ['https://docs.thorchain.org/'],
    independent_sources: ['https://www.coindesk.com/tech/2022/06/24/thorchain-mainnet-goes-live-on-seven-networks-rune-spikes'],
    minimum_record_shape: { meaningful_events: 2, evidence_records: 3 },
    confidence: 'high',
    unresolved_questions: [],
    assigned_batch: 'c1-growth-batch-01',
    review_notes: 'Official documentation explicitly describes THORChain as a Layer-1 decentralized exchange. Model interfaces as supporting frontends, not separate THORChain entities.',
  },
}

for (const candidate of scan.candidates) {
  const review = reviews[candidate.candidate_key]
  if (!review) continue
  Object.assign(candidate, review, {
    review_status: 'reviewed',
    research_priority: 'priority',
    last_reviewed_at: '2026-06-22',
  })
}

const reviewedKeys = Object.keys(reviews)
for (const key of reviewedKeys) {
  if (!scan.candidates.some((candidate) => candidate.candidate_key === key)) {
    throw new Error(`Priority review candidate missing from scan: ${key}`)
  }
}

scan.first_growth_batch = [
  'candidate:curve-dex',
  'candidate:dx-exchange',
  'candidate:dydx-v4',
  'candidate:joe-dex',
  'candidate:orca-dex',
  'candidate:osmosis-dex',
  'candidate:quickswap-dex',
  'candidate:thorchain-dex',
]
scan.updated_at = '2026-06-22'
scan.counts = {
  total: scan.candidates.length,
  needs_research: scan.candidates.filter((item) => item.scan_disposition === 'needs_research').length,
  pending_thin: scan.candidates.filter((item) => item.scan_disposition === 'pending_thin').length,
  add_now: scan.candidates.filter((item) => item.scan_disposition === 'add_now').length,
  out_of_scope_or_duplicate: scan.candidates.filter((item) => item.scan_disposition === 'out_of_scope_or_duplicate').length,
}

if (scan.counts.total !== 42 || scan.counts.add_now !== 10 || scan.counts.needs_research !== 1 || scan.counts.pending_thin !== 31) {
  throw new Error(`Unexpected reviewed scan counts: ${JSON.stringify(scan.counts)}`)
}
if (scan.first_growth_batch.length !== 8) throw new Error('First growth batch must contain eight candidates')

fs.writeFileSync(file, `${JSON.stringify(scan, null, 2)}\n`, 'utf8')
console.log(`Applied priority reviews: ${reviewedKeys.length}`)
console.log(`Scan counts: ${JSON.stringify(scan.counts)}`)
console.log(`First growth batch: ${scan.first_growth_batch.length}`)
