# HEI D-1000 BS1 Validation Plan

Date: 2026-07-14

## Scope

Validate the BS1 mixed-lifecycle DEX batch:

```text
Dark KnightSwap
Dexter Exchange
Dezswap
DipCoin
DiviSwap
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
maintainer recovery counts == 790 / 1004 / 3333
```

## Expected projected state

```text
Entities: 790
Events:   1004
Evidence: 3333
English dossiers:  790
Japanese dossiers: 790
Sitemap routes:     1604
```

## Status expectations

```text
Dark KnightSwap inactive
Dexter Exchange  inactive
Dezswap          active
DipCoin          active
DiviSwap         active
```

## Evidence boundary

BS1 combines current first-party code evidence with conservative registry-backed historical classification.

- Dark KnightSwap has first-party source code preserving the exchange and historical domain, but no independently verified current trading interface.
- Dexter Exchange is preserved as a Tezos DEX in registry data, but a current first-party interface and precise lifecycle boundary were not recovered.
- Dezswap has first-party application code updated in April 2026 with mainnet contracts and active API endpoints.
- DipCoin has first-party trading documentation updated in May 2026 and a current-running spot-volume adapter using api.dipcoin.io.
- DiviSwap has first-party Chiliz Chain DEX interface metadata and current registry corroboration.

The records must not invent terminal dates, shutdown causes, launch dates, legal entities, or succession relationships.

## Overlap expectation

Exact file checks plus repository-wide canonical-name, alias, slug, and domain searches found no current-main records for the five BS1 entities. DFX V2 was rejected during drafting after a hidden alternate-slug overlap was detected with existing DFX Finance `hei_ex_000739`.

## Merge rule

Do not merge if any reviewed-data, count-semantics, machine/public consistency, URL safety, localization, L-2 HOLD, recovery, or entity-quality gate fails.