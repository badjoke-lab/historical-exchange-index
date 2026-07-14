# D-1000 Batch BU1 — Two Exchange Records

Reviewed at: 2026-07-14

## Results

- `0864` Glyph V2 -> `hei_ex_000915`, limited Glyph Exchange entity
- `0866` GMO Coin Japan -> `hei_ex_000914`, active GMO Coin entity

## Status decisions

GMO Coin is active based on its current first-party Japanese exchange website and current public and authenticated REST/WebSocket API documentation with a change history through June 2026.

Glyph Exchange is limited, not active or dead. A maintained Core DEX adapter queries the Glyph subgraph for volume and fee accounting, but a stable first-party interface and independently verified recent user activity were not recovered in this review pass.

## Rejected duplicate

```text
0946 Hotcoin -> existing Hotcoin hei_ex_000712
```

The stale candidate row was already represented by the current Hotcoin entity and required no BU1 enrichment.

## Deferred candidates

```text
0851 Gleec BTC Exchange -> identity and exchange-boundary evidence incomplete
0862 Globitex           -> current first-party and lifecycle evidence insufficient
0883 Graviex            -> current first-party and lifecycle evidence insufficient
0899 HadesSwap          -> thin aggregator-only evidence
```

These candidates are not consumed as reviewed records and may be reconsidered only with stronger evidence.

## Evidence decisions

Each new entity receives two evidence items. First-party exchange and API documentation controls GMO Coin. Current open-source registry infrastructure controls Glyph Exchange, with limited status preserving uncertainty. No record receives an invented launch date, terminal date, death reason, legal entity, or successor.

## Batch output

- new entities: 2
- new events: 0
- new evidence: 4
- projected entity count: 796
- projected event count: 1004
- projected evidence count: 3345
- projected remaining to D-1000: 204

## Operating mode

BU1 is the eleventh D-1000 growth batch during the L-2 initial HOLD period. It adds reviewed canonical data only. No localization breadth, third-language authorization, Cloudflare configuration, or canonical schema changes are included.
