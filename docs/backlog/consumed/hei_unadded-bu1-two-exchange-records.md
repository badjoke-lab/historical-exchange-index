# D-1000 Batch BU1 — Glyph Record and GMO Evidence Refresh

Reviewed at: 2026-07-14

## Results

- `0864` Glyph V2 -> `hei_ex_000915`, new limited Glyph Exchange entity
- `0866` GMO Coin Japan -> existing `hei_ex_000692`, current API evidence refresh

## Status decisions

GMO Coin Japan remains active. The existing reviewed entity already preserves its Japanese regulated exchange identity and current trading products. BU1 adds current first-party API documentation with public and authenticated REST/WebSocket exchange functions and a change history through June 2026.

Glyph Exchange is limited, not active or dead. A maintained Core DEX adapter queries the Glyph subgraph for volume and fee accounting, but a stable first-party interface and independently verified recent user activity were not recovered in this review pass.

## Rejected duplicates

```text
0866 proposed new GMO Coin entity -> existing GMO Coin Japan hei_ex_000692
0946 Hotcoin                      -> existing Hotcoin hei_ex_000712
```

The GMO candidate is consumed as an evidence refresh rather than a new entity. The Hotcoin candidate required no BU1 enrichment.

## Deferred candidates

```text
0851 Gleec BTC Exchange -> identity and exchange-boundary evidence incomplete
0862 Globitex           -> current first-party and lifecycle evidence insufficient
0883 Graviex            -> current first-party and lifecycle evidence insufficient
0899 HadesSwap          -> thin aggregator-only evidence
```

These candidates are not consumed as reviewed records and may be reconsidered only with stronger evidence.

## Evidence decisions

Glyph Exchange receives two evidence items from current open-source registry infrastructure. Existing GMO Coin Japan receives one new high-reliability first-party API source. No record receives an invented launch date, terminal date, death reason, legal entity, or successor.

## Batch output

- new entities: 1
- enriched existing entities: 1
- new events: 0
- new evidence: 3
- projected entity count: 795
- projected event count: 1004
- projected evidence count: 3344
- projected remaining to D-1000: 205

## Operating mode

BU1 is the eleventh D-1000 growth batch during the L-2 initial HOLD period. It adds reviewed canonical data and evidence only. No localization breadth, third-language authorization, Cloudflare configuration, or canonical schema changes are included.
