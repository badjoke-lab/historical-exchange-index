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

Verified state after Batch 1:

```text
Projected public entities:      412
True missing values:             16
Explicit Unknown values:          9
Total review queue:              25
```

## Batch 2 — PR #400

| Entity | Decision |
| --- | --- |
| BitMart | `Marshall Islands` |
| BitKan | `China` |
| BTCC | `United Kingdom` |
| BitDelta | `Romania` |
| Bulla Exchange | `Berachain ecosystem` |

Verified state after Batch 2:

```text
Projected public entities:      412
True missing values:             11
Explicit Unknown values:          9
Total review queue:              20
Projected public evidence:     1600
```

## Batch 3 decisions

Batch 3 processes five active low-confidence seed records. It deliberately distinguishes a concrete jurisdiction, global operating scope, and reviewed `Unknown` classifications.

| Entity | Decision | Evidence basis |
| --- | --- | --- |
| Aivora Exchange | `British Virgin Islands` | Official About Us material states that AIVORA was established in 2024 in the British Virgin Islands; later subsidiaries are documented separately. |
| Bitbaby | `Unknown` | Official exchange, company, legal, policy, and contact surfaces do not disclose a verifiable legal entity, headquarters, founding jurisdiction, or ecosystem origin. |
| Bitcointry | `Global` | The official platform describes itself as a global cryptocurrency exchange; no narrower legal domicile was verified. |
| Bitexlive | `Kazakhstan` | Official ecosystem material describes BitexLive as founded in 2017 and headquartered in Uralsk, Kazakhstan. |
| BitStorage | `Unknown` | Official exchange and team surfaces do not disclose a verifiable legal or operating origin. |

Evidence changes:

- add `hei_src_003190` for the official AIVORA About Us profile
- add `hei_src_003191` for the official BitexLive ecosystem profile
- preserve existing official-domain evidence for Bitcointry, Bitbaby, and BitStorage
- record the reason for each reviewed `Unknown` in entity and evidence notes

## Expected post-Batch 3 state

GitHub CI must confirm:

```text
Projected public entities:      412
True missing values:              6
Explicit Unknown values:         11
Total review queue:              17
Invalid non-string values:        0
Projected public evidence:     1602
```

Remaining true missing values:

- OPNX
- CryptoBridge
- Bitzy
- Blueprint
- Bron Intents
- Byte Exchange

Explicit `Unknown` review queue after Batch 3:

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

## Remaining work

1. Process Bitzy, Blueprint, Bron Intents, and Byte Exchange as Batch 4.
2. Process historical canonical records OPNX and CryptoBridge as Batch 5.
3. Review all explicit `Unknown` values separately from structural missing values.
4. Enable the strict structural gate once true missing values reach zero.

## Rules

- Do not infer a country from a domain suffix, language, or user geography.
- Distinguish founding origin, operating headquarters, legal domicile, and ecosystem origin.
- Use `Unknown` when evidence cannot support a more specific classification.
- Use `Global` only when the project explicitly describes global scope and a narrower origin is not verified.
- Preserve notes explaining ambiguous or multi-jurisdiction cases.
