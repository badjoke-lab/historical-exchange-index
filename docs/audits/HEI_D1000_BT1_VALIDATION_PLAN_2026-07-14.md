# HEI D-1000 BT1 Validation Plan

Date: 2026-07-14

## Scope

Validate the BT1 mixed exchange batch:

```text
Durianfun AMM
Econia
edgeX
ExinSwap
FVM Exchange
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
maintainer recovery counts == 795 / 1004 / 3343
```

## Expected projected state

```text
Entities: 795
Events:   1004
Evidence: 3343
English dossiers:  795
Japanese dossiers: 795
Sitemap routes:     1614
```

## Status expectations

```text
Durianfun AMM active
Econia        inactive
edgeX         active
ExinSwap      active
FVM Exchange  active
```

## Evidence boundary

BT1 uses current protocol adapters and first-party repositories or documentation where available.

- Durianfun AMM is supported by current production-factory, liquidity, swap, fee, and revenue adapters.
- Econia preserves a first-party Aptos order-book repository but is no longer actively maintained and appears in current dead-adapter infrastructure; it is classified inactive without a terminal date.
- edgeX is supported by a maintained first-party V2 SDK and a current spot-volume adapter querying enabled markets.
- ExinSwap is supported by first-party AMM documentation and a current application-volume adapter.
- FVM Exchange is supported by a current Fantom pair-factory and gauge adapter; its public URL remains live_unverified.

The records must not invent launch dates, terminal dates, shutdown causes, legal entities, or succession relationships.

## Overlap expectation

Exact file checks plus repository-wide canonical-name, alias, slug, and domain searches found no current-main records for the final five entities. Fathom DEX was rejected after an alternate-slug file collision revealed existing `hei_ex_000686`.

## Merge rule

Do not merge if any reviewed-data, count-semantics, machine/public consistency, URL safety, localization, L-2 HOLD, recovery, or entity-quality gate fails.
