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

Verified state after Batch 3:

```text
Projected public entities:      412
True missing values:              6
Explicit Unknown values:         11
Total review queue:              17
Invalid non-string values:        0
Projected public evidence:     1602
```

## Batch 4 decisions

| Entity | Decision | Evidence basis |
| --- | --- | --- |
| Bitzy | `Bitcoin ecosystem` | Current official material describes an EVM-compatible DEX settled on the Bitcoin network. The original `bitzy.app` domain redirects to `bitzy.info`. |
| Blueprint | `Ethereum ecosystem` | Official project publication identifies Blueprint as a ve(3,3) DEX on the Ethereum blockchain and designed for Ethereum mainnet. |
| Bron Intents | `Cross-chain ecosystem` | Official developer documentation defines Bron Intents as an open cross-chain swap protocol using independent solvers and on-chain settlement. |
| Byte Exchange | `Turkey` | Official About Us material identifies Bytedex Teknoloji A.Ş. as the owner and provides an İzmir, Türkiye address and registration details. |

Evidence changes:

- add `hei_src_003192` for the current Bitzy Bitcoin DEX page
- add `hei_src_003193` for Blueprint's official Ethereum DEX publication
- add `hei_src_003194` for Bron Intents official developer documentation
- add `hei_src_003195` for Byte Exchange's official company profile

## Expected post-Batch 4 state

GitHub CI must confirm:

```text
Projected public entities:      412
True missing values:              2
Explicit Unknown values:         11
Total review queue:              13
Invalid non-string values:        0
Projected public evidence:     1606
```

Remaining true missing values:

- OPNX
- CryptoBridge

Explicit `Unknown` review queue remains:

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

1. Process historical canonical records OPNX and CryptoBridge as Batch 5.
2. Review all explicit `Unknown` values separately from structural missing values.
3. Enable the strict structural gate once true missing values reach zero.

## Rules

- Do not infer a country from a domain suffix, language, or user geography.
- Distinguish founding origin, operating headquarters, legal domicile, and ecosystem origin.
- Use `Unknown` when evidence cannot support a more specific classification.
- Use `Global` only when the project explicitly describes global scope and a narrower origin is not verified.
- Preserve notes explaining ambiguous or multi-jurisdiction cases.
