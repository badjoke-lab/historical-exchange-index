const ENABLE_NEWS_RSS = process.env.HEI_MONITORING_ENABLE_NEWS_RSS === '1';

export const NEWS_WATCH_ENABLED = ENABLE_NEWS_RSS;

export const TRUSTED_NEWS_DOMAINS = [
  'reuters.com',
  'bloomberg.com',
  'coindesk.com',
  'theblock.co',
  'cointelegraph.com',
  'techcrunch.com',
  'sec.gov',
  'cftc.gov',
  'fca.org.uk',
  'fsa.go.jp',
  'sfc.hk',
  'mas.gov.sg',
  'treasury.gov',
];

export const NEWS_QUERY_GROUPS = [
  {
    category: 'shutdown',
    likely_event_types: ['shutdown_announced', 'shutdown_effective'],
    queries: [
      'crypto exchange shuts down',
      'crypto exchange ceases operations',
      'crypto exchange wind down',
      'cryptocurrency exchange service discontinued',
      'DEX protocol shuts down exchange',
    ],
  },
  {
    category: 'hack_incident',
    likely_event_types: ['hack', 'exploit', 'withdrawal_suspended'],
    queries: [
      'crypto exchange hacked unauthorized withdrawals',
      'crypto exchange hot wallet breach',
      'cryptocurrency exchange exploit withdrawals suspended',
      'DEX exploit trading halted',
      'perp DEX exploit',
    ],
  },
  {
    category: 'withdrawal_deposit_trading_suspension',
    likely_event_types: ['withdrawal_suspended', 'deposit_suspended', 'trading_halted'],
    queries: [
      'crypto exchange suspends withdrawals',
      'crypto exchange deposits suspended',
      'crypto exchange trading halted',
      'exchange users unable to withdraw crypto',
      'withdrawal only mode crypto exchange',
    ],
  },
  {
    category: 'chain_infrastructure_outage',
    likely_event_types: ['chain_shutdown_impact'],
    queries: [
      'blockchain block production halted DEX exchange',
      'L2 sequencer outage DEX trading',
      'chain outage decentralized exchange transactions stalled',
      'rollup outage exchange trading halted',
      'blockchain network halt crypto exchange users',
    ],
  },
  {
    category: 'regulatory',
    likely_event_types: ['regulatory_action'],
    queries: [
      'crypto exchange regulatory action',
      'crypto exchange license revoked',
      'crypto exchange warning list regulator',
      'crypto exchange regional exit users close accounts',
      'crypto exchange sanctions enforcement',
    ],
  },
  {
    category: 'acquisition_migration_rebrand',
    likely_event_types: ['acquired', 'merged', 'rebranded', 'other'],
    queries: [
      'crypto exchange acquired customer migration',
      'crypto exchange asset transfer users migrated',
      'crypto exchange rebranded renamed',
      'crypto exchange merged with',
      'crypto exchange service migration successor',
    ],
  },
];

export function getNewsQueries() {
  const parsedLimit = Number.parseInt(process.env.HEI_MONITORING_NEWS_QUERY_LIMIT || '20', 10);
  const maxQueries = Number.isFinite(parsedLimit) ? Math.max(0, parsedLimit) : 20;
  if (maxQueries === 0) return [];

  const groupedQueries = NEWS_QUERY_GROUPS.map((group) => group.queries.map((query) => ({
    query,
    category: group.category,
    likely_event_types: group.likely_event_types,
  })));
  const queries = [];

  // Select queries round-robin by category so a global query cap cannot silently
  // starve later categories. With the normal limit of 20, every current group
  // receives coverage, including chain-infrastructure and acquisition signals.
  for (let queryIndex = 0; queries.length < maxQueries; queryIndex += 1) {
    let addedThisRound = false;

    for (const groupQueries of groupedQueries) {
      if (queries.length >= maxQueries) break;
      if (queryIndex >= groupQueries.length) continue;
      queries.push(groupQueries[queryIndex]);
      addedThisRound = true;
    }

    if (!addedThisRound) break;
  }

  return queries;
}
