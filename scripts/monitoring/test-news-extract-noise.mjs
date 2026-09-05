import { extractCandidateNameFromNews, inferEventCategory } from './core/news-extract.mjs';
import { isChainInfrastructureCandidate } from './monitors/news-and-event-watch.mjs';
import { NEWS_QUERY_GROUPS, getNewsQueries } from './sources/news-queries.mjs';

function assertNullCandidate(item, label) {
  const candidate = extractCandidateNameFromNews(item);
  if (candidate !== null) {
    throw new Error(`${label}: expected null candidate, received ${candidate}`);
  }
}

function assertNewsQueryCoverage() {
  const previousLimit = process.env.HEI_MONITORING_NEWS_QUERY_LIMIT;
  process.env.HEI_MONITORING_NEWS_QUERY_LIMIT = '20';

  try {
    const queries = getNewsQueries();
    if (queries.length !== 20) {
      throw new Error(`news query cap regression: expected 20 queries, received ${queries.length}`);
    }

    const selectedCategories = new Set(queries.map((query) => query.category));
    for (const group of NEWS_QUERY_GROUPS) {
      if (!selectedCategories.has(group.category)) {
        throw new Error(`news query cap starved category: ${group.category}`);
      }
    }

    if (!queries.some((query) => query.category === 'chain_infrastructure_outage' && query.likely_event_types.includes('chain_shutdown_impact'))) {
      throw new Error('chain infrastructure query coverage must map to chain_shutdown_impact');
    }
  } finally {
    if (previousLimit === undefined) delete process.env.HEI_MONITORING_NEWS_QUERY_LIMIT;
    else process.env.HEI_MONITORING_NEWS_QUERY_LIMIT = previousLimit;
  }
}

function assertChainInfrastructureExtraction() {
  const item = {
    title: 'Robinhood Chain Stops Producing Blocks. What Happened?',
    snippet: 'A network outage stalled transactions for at least 14 minutes.',
    source_name: 'BeInCrypto',
  };
  const candidate = extractCandidateNameFromNews(item);
  if (candidate !== 'Robinhood Chain') {
    throw new Error(`chain outage extraction must identify Robinhood Chain: ${candidate}`);
  }

  const category = inferEventCategory(`${item.title} ${item.snippet}`, 'unknown');
  if (category !== 'chain_infrastructure_outage') {
    throw new Error(`chain outage category regression: ${category}`);
  }

  if (!isChainInfrastructureCandidate({
    news_event_categories: [category],
    likely_event_types: ['chain_shutdown_impact'],
  })) {
    throw new Error('chain outage monitor signal must be retained as chain infrastructure context');
  }
}

assertNullCandidate(
  {
    title: 'FCA Shuts Down Unregistered P2P Crypto Trading in London',
    snippet: 'The UK regulator acted against unregistered peer-to-peer crypto trading.',
    source_name: 'CoinMarketCap',
  },
  'regulator abbreviation used as headline subject',
);

assertNullCandidate(
  {
    title: 'Best Decentralized Crypto Exchanges in July 2026: Discover the Top DEX for Your Crypto Needs!',
    snippet: 'A ranking headline must not manufacture an exchange named Top.',
    source_name: 'Coin Bureau',
  },
  'ranking adjective used as exchange identity',
);

assertNullCandidate(
  {
    title: 'Crypto Exploits Cost Exchanges Millions as Security Incidents Rise',
    snippet: 'A generic incident headline must not manufacture an exchange named Exploits Cost.',
    source_name: 'Example News',
  },
  'headline fragment used as exchange identity',
);

assertNullCandidate(
  {
    title: 'Hong Kong Exchange Warning Issued in New Regulatory Notice',
    snippet: 'A geographic market label must not become a canonical exchange candidate.',
    source_name: 'Example News',
  },
  'geographic label used as exchange identity',
);

assertNullCandidate(
  {
    title: 'Six Crypto Exchanges Face New Regulatory Restrictions',
    snippet: 'A count word must not become a canonical exchange candidate.',
    source_name: 'Example News',
  },
  'count word used as exchange identity',
);

assertNewsQueryCoverage();
assertChainInfrastructureExtraction();

console.log('HEI news candidate noise regressions passed.');
