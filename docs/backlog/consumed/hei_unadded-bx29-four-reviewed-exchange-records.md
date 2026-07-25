# HEI BX29 Consumed Candidate Note

Date: 2026-07-25

## Promoted

```text
Biconomy.com -> hei_ex_001030 active
Zoomex       -> hei_ex_001031 active
P2B          -> hei_ex_001032 active
M2           -> hei_ex_001033 limited
```

## Source acquisition and dedupe

BX29 used the source-acquisition slots in the canonical backlog rather than assuming that code-search misses represented absent records.

An initial proposed set contained Toobit, CoinW, Bitunix, and BYDFi. Direct canonical-path checks showed that all four already existed as reviewed records, so none was duplicated and no count was claimed from them.

The final four candidates passed direct canonical-path and alternate-name checks:

```text
records/exchanges/biconomy-com.json
records/exchanges/biconomy.json
records/exchanges/zoomex.json
records/exchanges/p2b.json
records/exchanges/p2pb2b.json
records/exchanges/m2.json
```

The checked paths were absent before drafting. Name, alias, domain, and entity-boundary review found no reviewed canonical record for the final additions.

## Review basis

### Biconomy.com

- Current first-party corporate material identifies the exchange operator and a British Virgin Islands address.
- Current independent exchange data lists hundreds of recently updated spot markets, non-zero volume, reserves, and the same jurisdiction.
- The record is explicitly separated from the unrelated Biconomy Web3 infrastructure protocol.

### Zoomex

- Current first-party material identifies an operating global centralized exchange.
- Separate first-party documentation describes Zoomex DEX as a wallet-based perpetual product built on the CEX stack and sharing its liquidity.
- Current independent exchange data lists recently updated centralized spot markets, non-zero volume, reserves, and Seychelles registration.
- CEX, futures, and DEX surfaces remain one hybrid entity.

### P2B

- Current first-party pages expose active markets, trading, listings, launchpad, card-purchase, and API services.
- Current independent exchange data lists recently updated spot markets, non-zero volume, reserves, and Lithuania registration.
- P2B and the historical P2PB2B domain identity remain one entity.

### M2

- Current first-party fee and account materials expose spot trading, OTC, conversion, deposit, and withdrawal functions.
- The global trading name is operated by a Bahamas-regulated entity, while a separate UAE entity provides ADGM-regulated custody.
- HEI does not extend the custody authorization to all exchange services.
- Current independent exchange profiling recognizes M2 but reports volume as untracked, so status remains `limited`.

## Duplicate and safety controls

- Product surfaces, regional pages, futures pages, DEX pages, account types, and legal affiliates were not split into count-inflating entities.
- A live website alone was not treated as enough for `active`; M2 remains `limited` because independent current market activity was not tracked.
- No exact launch date, predecessor, successor, terminal date, or incident event was invented.
- The consumed note records review disposition only and does not authorize automatic candidate publication.
