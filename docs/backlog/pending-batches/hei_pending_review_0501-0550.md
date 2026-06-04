# Pending review: verified-unadded rows 0501-0550

Status: pending review
Scope: HEI exchange / DEX candidate backlog
Created from: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`

## Purpose

This memo classifies `hei_unadded_0501-0550` before canonical record creation.

This window contains a mix of database-only CEX rows, DEX/protocol variants, major active CEX candidates, and a few potentially historical candidates that need stronger event/evidence review. No candidate in this scan was promoted directly to canonical records because the reviewed context did not yet provide enough public-ready event/evidence value.

## Operating rule

Do not add database-only or `listed_reference`-only candidates to canonical records.

Canonical additions should have clear identity, meaningful event value, preferably two or more evidence items, safe URL/status handling, and no unresolved duplicate or scope concern.

## Classification summary

```text
add_now: 0
needs_research: 12
pending_thin: 15
active_seed_later: 12
out_of_scope_or_duplicate: 11
```

## Reviewed candidate groups

### needs_research

These may be HEI-relevant, but need stronger source, event, duplicate, or scope review before canonical inclusion.

```text
hei_unadded_0506 ChaoEX
hei_unadded_0509 ChileBit
hei_unadded_0512 Choice
hei_unadded_0516 CITEX
hei_unadded_0527 CODEX
hei_unadded_0528 CODEX Exchange
hei_unadded_0529 Coin Galaxy
hei_unadded_0530 Coin Republic
hei_unadded_0541 Coinbit
hei_unadded_0543 CoinCasso
hei_unadded_0547 CoinDeal
hei_unadded_0549 Coindelta
```

Notes:

- `ChileBit`, `Coinbit`, `CoinDeal`, and `Coindelta` may have historical value, but need source-backed shutdown/status/event review before canonical inclusion.
- `ChaoEX`, `Choice`, `CITEX`, `CODEX`, `Coin Galaxy`, `Coin Republic`, and `CoinCasso` look exchange-like but need stronger identity and evidence review.
- None should be added from this scan based only on the current database row.

### pending_thin

These were too thin for canonical record creation in this scan, usually database-only or listed-reference-only.

```text
hei_unadded_0501 ChainX
hei_unadded_0502 Chamber Ex
hei_unadded_0503 ChampagneSwap
hei_unadded_0508 Cherryswap
hei_unadded_0511 ChimpX AI DEX
hei_unadded_0519 Cleo
hei_unadded_0526 CobaltX
hei_unadded_0531 Coin163
hei_unadded_0532 Coinall
hei_unadded_0533 CoinAmount
hei_unadded_0539 Coinbe
hei_unadded_0540 COINBIG
hei_unadded_0542 Coinbuy cash
hei_unadded_0544 CoinCex
hei_unadded_0545 CoinChangeX
```

Revisit only if official sources, archive evidence, shutdown/current-status evidence, independent news, or another strong evidence item appears.

### active_seed_later

These look more suitable for a dedicated active CEX / DEX seed phase than for the current historical-event-first batch.

```text
hei_unadded_0504 Changelly PRO
hei_unadded_0505 Changelly PRO
hei_unadded_0513 Chronos
hei_unadded_0517 Claimswap
hei_unadded_0520 Cleopatra CL
hei_unadded_0522 Clipper
hei_unadded_0523 Clober V1
hei_unadded_0525 Clutch Anvil AMM
hei_unadded_0534 Coinbase
hei_unadded_0535 Coinbase International Exchange
hei_unadded_0546 CoinCorner
hei_unadded_0550 CoinEx
```

Notes:

- `Coinbase` and `CoinEx` are major active CEX candidates and should be handled in a dedicated active CEX seed phase, not as thin one-off records.
- `Changelly PRO`, `Chronos`, `Claimswap`, `Cleopatra`, `Clipper`, `Clober`, and `Clutch` should be handled in active DEX/protocol seed work with cluster and variant review.
- `CoinEx` has a paired domain-bearing row after this window and should be reviewed together with the next batch.

### out_of_scope_or_duplicate

These appear to be chain/deployment/version variants, subproducts, generated exchange IDs, or scope-mismatched items.

```text
hei_unadded_0507 Chapool
hei_unadded_0510 Chiliz
hei_unadded_0514 Chronos V1
hei_unadded_0515 Chronos V2
hei_unadded_0518 ClaimSwap V1
hei_unadded_0521 Cleopatra Legacy
hei_unadded_0524 Clober V2
hei_unadded_0536 coinbaseadvanced
hei_unadded_0537 coinbaseexchange
hei_unadded_0538 coinbaseinternational
hei_unadded_0548 CoinDeal Derivatives
```

Notes:

- Chronos V1/V2 should not be split from Chronos in v0 without a deployment-level model.
- ClaimSwap V1 should fold into Claimswap if added later.
- Clober V2 should fold into a Clober cluster if added later.
- Coinbase advanced/exchange/international CCXT IDs should be reviewed as product or venue variants, not automatically separate entities.
- CoinDeal Derivatives should be reviewed with CoinDeal if that entity is later added.

## Add-now decision

No `add_now` record was selected from this scan.

Reason: the scan includes some promising research candidates, but none should be promoted from the reviewed row alone. Adding now would either create thin records or split active/product variants too early.

## Next action

1. Continue scanning `hei_unadded_0551-0600`.
2. Review `CoinEx` with the domain-bearing row after this window.
3. Prioritize `Coinbit`, `CoinDeal`, and `Coindelta` for source-backed historical review if stronger evidence is available.
4. Keep Coinbase and other major active platforms for a dedicated active CEX seed phase.

## Public-safety note

This memo is public-safe backlog metadata. It avoids unverified claims such as fraud, danger, insolvency, shutdown, or unsafe status unless backed by canonical evidence.
