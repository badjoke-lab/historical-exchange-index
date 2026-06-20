# HEI A2 country_or_origin audit — 2026-06-19

## Scope

This audit covers the projected public entity layer rather than only `data/entities.json`.

Projected public entities are composed of:

- canonical entities after reviewed corrections
- new entities from reviewed exchange bundles

## Baseline

```text
Canonical entities:             306
Reviewed-bundle entities:       106
Projected public entities:      412
True missing values:             21
Explicit Unknown values:          9
Total review queue:              30
Invalid non-string values:        0
```

`Unknown` is not treated as a structural missing value. It is an explicit provisional classification that remains in the research queue until stronger evidence is available.

## Initial queue

### Canonical true-missing values

- OPNX
- CryptoBridge

### Canonical explicit Unknown values

- Coin-Swap
- AllCrypt
- McxNOW
- Crypto-Trade
- CoinedUp
- AidosMarket
- 55 Global Markets
- BCC Exchange (BitConnect Coin)
- Txbit

### Reviewed-bundle true-missing values

- Aivora Exchange
- ApolloX
- Bequant
- Bitbaby
- bitcastle
- Bitcointry
- BitDelta
- Bitexlive
- BitKan
- BitMart
- BitStorage
- Bitzy
- Blockchain.com
- Blueprint
- Bron Intents
- BTCC
- Bulla Exchange
- BYDFi
- Byte Exchange

## Batch 1 decisions

| Entity | Decision | Basis |
| --- | --- | --- |
| ApolloX | `BNB Chain ecosystem` | Official ApolloX material describes BNB Chain support and a multichain protocol; no unsupported legal country is asserted. |
| Bequant | `Malta` | Official BEQUANT group material identifies Malta-incorporated group companies and Malta headquarters. |
| bitcastle | `Saint Vincent and the Grenadines` | Official terms identify bitcastle LLC as registered in Kingstown, Saint Vincent and the Grenadines. |
| Blockchain.com | `United Kingdom` | Official company history states that it began in York and has its global headquarters in London. |
| BYDFi | `Seychelles` | Official legal and privacy material identifies BYDFi Fintech LTD as registered in Seychelles. |

## Verified post-Batch 1 state

PR #399 was validated and merged as commit `bd665468f6159a8e2aaeb1a71f738dbfc5210102` after the repository-owned Cloudflare Pages policy was successfully applied.

```text
Projected public entities:      412
True missing values:             16
Explicit Unknown values:          9
Total review queue:              25
Invalid non-string values:        0
```

Required checks passed before merge:

- CI
- Records validation
- Backlog dedupe
- static production build
- machine-readable validation
- built HTML and JSON count consistency

## Batch 2 decisions

The second batch resolves five additional active records with official legal, company-history, or protocol documentation.

| Entity | Decision | Basis |
| --- | --- | --- |
| BitMart | `Marshall Islands` | BitMart's official user agreement identifies GBM Global Inc. as BitMart and gives its registration number and Marshall Islands address. Cayman governing law is not treated as the entity origin. |
| BitKan | `China` | BitKan's official site confirms its 2012 history, and an official-domain company explainer identifies Beijing, China as its headquarters. This is treated as historical operating origin rather than current legal domicile. |
| BTCC | `United Kingdom` | BTCC's standardized official-site company profile describes the exchange as headquartered in the UK. Notes preserve its historical Chinese roots and multi-jurisdiction legal-provider structure. |
| BitDelta | `Romania` | BitDelta's official general terms identify Lionheart Limited S.R.L as the platform company and state that it is incorporated under Romanian law. |
| Bulla Exchange | `Berachain ecosystem` | Official Bulla documentation explicitly describes the protocol as a DEX built for Berachain. No unsupported legal-country assignment is made. |

Each record receives one additional evidence item, and the linked event `source_count` is updated.

## Expected post-Batch 2 state

The main-target CI audit must confirm:

```text
Projected public entities:      412
True missing values:             11
Explicit Unknown values:          9
Total review queue:              20
Invalid non-string values:        0
Projected public evidence:     1600
```

Remaining true missing values are:

- OPNX
- CryptoBridge
- Aivora Exchange
- Bitbaby
- Bitcointry
- Bitexlive
- BitStorage
- Bitzy
- Blueprint
- Bron Intents
- Byte Exchange

## Remaining work

1. Process active low-confidence seed records where `Global`, an ecosystem label, or `Unknown` may be more accurate than a country.
2. Process historical dead-side records requiring archived or secondary historical evidence.
3. Review the nine existing explicit `Unknown` values separately from structural missing values.
4. Convert the audit to a strict structural gate once true missing values reach zero.

## Merge state

PR #399 is merged. PR #400 now targets `main`. Because PR #399 was squash-merged, the Batch 2 branch was rebuilt directly from the merged main commit so its final diff contains only this audit document and the five Batch 2 record changes.

## Rules

- Do not infer a country from a domain suffix, language, or user geography.
- Distinguish founding origin, operating headquarters, legal domicile, and ecosystem origin.
- Use `Unknown` when evidence cannot support a more specific classification.
- Preserve notes explaining ambiguous multi-jurisdiction cases.
- Do not merge unreviewed candidates directly into canonical public data.
