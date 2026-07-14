# HEI D-1000 BU1 Validation Plan

Date: 2026-07-14

## Scope

Validate the BU1 reviewed exchange batch:

```text
GMO Coin
Glyph Exchange
```

## Required checks

```text
record schema validation
overlap audit
name/slug/domain/alias duplicate audit
entity/event/evidence ID collision audit
verified-unadded scan integrity
candidate consumption integrity
country/origin strict gate
projected enum validation
entity quality gate
URL safety
count semantics regression
machine-readable build and validation
public build and validation
Japanese route count parity
L-2 evaluation remains HOLD
maintainer recovery counts == 796 / 1004 / 3345
```

## Expected projected state

```text
Entities: 796
Events:   1004
Evidence: 3345
English dossiers:  796
Japanese dossiers: 796
Sitemap routes:     1616
```

## Status expectations

```text
GMO Coin       active
Glyph Exchange limited
```

## Evidence boundary

- GMO Coin is supported by its current first-party Japanese exchange website and current public and authenticated REST/WebSocket API documentation with a change history extending through June 2026.
- Glyph Exchange is supported by a maintained Core DEX adapter that queries a CoreDAO-hosted Glyph subgraph for volume, user fees, protocol revenue, and liquidity-provider revenue.
- Glyph Exchange remains limited because a stable first-party interface and independently verified recent user activity were not recovered during this review pass.

The records must not invent launch dates, terminal dates, shutdown causes, legal entities, or succession relationships.

## Overlap expectation

Exact file checks plus repository-wide canonical-name, alias, slug, and domain searches found no current-main records for GMO Coin or Glyph Exchange.

Hotcoin was rejected after an existing-path collision revealed current-main Hotcoin `hei_ex_000712`. Globitex, Graviex, Gleec BTC Exchange, and HadesSwap were not promoted because current first-party or lifecycle evidence remained insufficient. BU1 does not force a larger batch with weak records.

## Merge rule

Do not merge if any reviewed-data, count-semantics, machine/public consistency, URL safety, localization, L-2 HOLD, recovery, or entity-quality gate fails.
