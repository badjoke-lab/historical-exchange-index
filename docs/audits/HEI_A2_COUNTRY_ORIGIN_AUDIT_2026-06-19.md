# HEI A2 country_or_origin audit — 2026-06-19

## Scope

This audit covers the projected public entity layer:

- canonical entities after reviewed corrections
- genuinely new entities from reviewed exchange bundles

`Unknown` is an explicit reviewed classification, not a structural missing value.

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

## Batch 1 — PR #399

| Entity | Decision |
| --- | --- |
| ApolloX | `BNB Chain ecosystem` |
| Bequant | `Malta` |
| bitcastle | `Saint Vincent and the Grenadines` |
| Blockchain.com | `United Kingdom` |
| BYDFi | `Seychelles` |

## Batch 2 — PR #400

| Entity | Decision |
| --- | --- |
| BitMart | `Marshall Islands` |
| BitKan | `China` |
| BTCC | `United Kingdom` |
| BitDelta | `Romania` |
| Bulla Exchange | `Berachain ecosystem` |

## Batch 3 — PR #402

| Entity | Decision |
| --- | --- |
| Aivora Exchange | `British Virgin Islands` |
| Bitbaby | `Unknown` |
| Bitcointry | `Global` |
| Bitexlive | `Kazakhstan` |
| BitStorage | `Unknown` |

## Batch 4 — PR #403

| Entity | Decision |
| --- | --- |
| Bitzy | `Bitcoin ecosystem` |
| Blueprint | `Ethereum ecosystem` |
| Bron Intents | `Cross-chain ecosystem` |
| Byte Exchange | `Turkey` |

Verified state after Batch 4:

```text
Projected public entities:      412
True missing values:              2
Explicit Unknown values:         11
Total review queue:              13
Invalid non-string values:        0
Projected public evidence:     1606
```

## Batch 5 decisions

Batch 5 resolves the final two structural omissions through guarded corrections to existing canonical entities.

| Entity | Decision | Evidence basis |
| --- | --- | --- |
| OPNX | `Seychelles` | Contemporary reporting identifies OPNX as incorporated in Seychelles while maintaining a Hong Kong office. The separate CoinFLEX continuity dispute remains a lineage issue for A3-A4. |
| CryptoBridge | `BitShares ecosystem` | The project's launch announcement describes CryptoBridge as a gateway providing access to the BitShares decentralized trading platform. No reliable legal-country assignment was established. |

Implementation:

- add guarded correction bundle `records/exchanges/opnx.json`
- add guarded correction bundle `records/exchanges/cryptobridge.json`
- add `hei_src_003196` for OPNX corporate-origin reporting
- add `hei_src_003197` for the CryptoBridge gateway launch announcement
- do not create successor or predecessor links in A2

## Expected post-Batch 5 state

GitHub CI must confirm:

```text
Projected public entities:      412
True missing values:              0
Explicit Unknown values:         11
Total review queue:              11
Invalid non-string values:        0
Projected public events:        687
Projected public evidence:     1608
```

Explicit `Unknown` review queue:

- Coin-Swap
- AllCrypt
- McxNOW
- Crypto-Trade
- CoinedUp
- AidosMarket
- 55 Global Markets
- BCC Exchange (BitConnect Coin)
- Txbit
- Bitbaby
- BitStorage

## Remaining A2 work

1. Review all eleven explicit `Unknown` values.
2. Keep `Unknown` where research cannot support a narrower classification.
3. Enable the strict structural gate after the reviewed-Unknown report is complete.
4. Advance the roadmap to A3 lineage review.

## Rules

- Do not infer a country from a domain suffix, language, or user geography.
- Distinguish founding origin, operating headquarters, legal domicile, and ecosystem origin.
- Use `Unknown` when evidence cannot support a more specific classification.
- Use `Global` only when the project explicitly describes global scope and a narrower origin is not verified.
- Preserve notes explaining ambiguous, multi-jurisdiction, or disputed-lineage cases.
