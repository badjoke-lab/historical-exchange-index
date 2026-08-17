import { extractCandidateNameFromNews } from './core/news-extract.mjs';

function assertNullCandidate(item, label) {
  const candidate = extractCandidateNameFromNews(item);
  if (candidate !== null) {
    throw new Error(`${label}: expected null candidate, received ${candidate}`);
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

console.log('HEI news candidate noise regressions passed.');
