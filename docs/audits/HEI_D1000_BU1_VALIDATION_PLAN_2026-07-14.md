# HEI D-1000 BU1 Validation Plan

Date: 2026-07-14

## Scope

Validate the BU1 reviewed exchange update:

```text
Glyph Exchange — new reviewed entity
GMO Coin Japan — existing entity evidence refresh
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
maintainer recovery counts == 795 / 1004 / 3344
```

## Expected projected state

```text
Entities: 795
Events:   1004
Evidence: 3344
English dossiers:  795
Japanese dossiers: 795
Sitemap routes:     1614
```

## Status expectations

```text
GMO Coin Japan active
Glyph Exchange  limited
```

## Evidence boundary

- GMO Coin Japan remains the existing `hei_ex_000692` entity and receives refreshed current public and authenticated REST/WebSocket API evidence with a change history extending through June 2026.
- Glyph Exchange is supported by a maintained Core DEX adapter that queries a CoreDAO-hosted Glyph subgraph for volume, user fees, protocol revenue, and liquidity-provider revenue.
- Glyph Exchange remains limited because a stable first-party interface and independently verified recent user activity were not recovered during this review pass.

The records must not invent launch dates, terminal dates, shutdown causes, legal entities, or succession relationships.

## Overlap expectation

Records validation identified the proposed GMO Coin new entity as a duplicate of existing GMO Coin Japan `hei_ex_000692` through canonical name, aliases, and `coin.z.com`. The duplicate file was removed and only current API evidence was added to the existing entity.

Hotcoin was also rejected after an existing-path collision revealed current-main Hotcoin `hei_ex_000712`. Globitex, Graviex, Gleec BTC Exchange, and HadesSwap were not promoted because current first-party or lifecycle evidence remained insufficient. BU1 does not force a larger batch with weak records.

## Merge rule

Do not merge if any reviewed-data, count-semantics, machine/public consistency, URL safety, localization, L-2 HOLD, recovery, or entity-quality gate fails.
