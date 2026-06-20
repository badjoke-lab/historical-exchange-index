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

The first batch resolves five entries with direct official support.

| Entity | Decision | Basis |
| --- | --- | --- |
| ApolloX | `BNB Chain ecosystem` | Official ApolloX material describes BNB Chain support and a multichain protocol; no unsupported legal country is asserted. |
| Bequant | `Malta` | Official BEQUANT group material identifies Malta-incorporated group companies and Malta headquarters. |
| bitcastle | `Saint Vincent and the Grenadines` | Official terms identify bitcastle LLC as registered in Kingstown, Saint Vincent and the Grenadines. |
| Blockchain.com | `United Kingdom` | Official company history states that it began in York and has its global headquarters in London. |
| BYDFi | `Seychelles` | Official legal and privacy material identifies BYDFi Fintech LTD as registered in Seychelles. |

## Verified post-batch state

The final CI artifact generated from PR #399 confirmed:

```text
Projected public entities:      412
True missing values:             16
Explicit Unknown values:          9
Total review queue:              25
Invalid non-string values:        0
```

All required PR checks passed on commit `7c335a8634450899430f04bfca462647b2ba3dfb`:

- CI
- Records validation
- Backlog dedupe
- static production build
- machine-readable validation
- built HTML and JSON count consistency

Remaining true missing values are:

- OPNX
- CryptoBridge
- Aivora Exchange
- Bitbaby
- Bitcointry
- BitDelta
- Bitexlive
- BitKan
- BitMart
- BitStorage
- Bitzy
- Blueprint
- Bron Intents
- BTCC
- Bulla Exchange
- Byte Exchange

## Remaining work

The remaining queue must be processed in evidence-quality batches.

1. High-confidence active entities with official corporate, legal, or protocol documentation.
2. Active low-confidence seed records where `Global`, an ecosystem label, or `Unknown` may be more accurate than a country.
3. Historical dead-side records requiring archived or secondary historical evidence.
4. Convert the audit to a strict structural gate once true missing values reach zero.

## Merge state

PR #399 is intentionally left unmerged while Cloudflare project access is unavailable. The branch is fully validated and should not be merged until the repository-owned Cloudflare Pages policy has been applied or a safe merge window is explicitly confirmed.

## Rules

- Do not infer a country from a domain suffix, language, or user geography.
- Distinguish founding origin, operating headquarters, legal domicile, and ecosystem origin.
- Use `Unknown` when evidence cannot support a more specific classification.
- Preserve notes explaining ambiguous multi-jurisdiction cases.
- Do not merge unreviewed candidates directly into canonical public data.
