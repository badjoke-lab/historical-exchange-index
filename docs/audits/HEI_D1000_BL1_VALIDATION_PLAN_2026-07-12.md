# HEI D-1000 BL1 Validation Plan

Date: 2026-07-12

## Scope

Validate the second five-entity D-1000 growth batch:

```text
Alita Finance
AlphaQ
AlphaSec Spot
Alphix
Althea DEX
```

## Required checks

```text
record schema validation
overlap audit
name/slug/domain duplicate audit
entity/event/evidence ID collision audit
verified-unadded scan integrity
candidate consumption integrity
country/origin strict gate
projected enum validation
entity quality gate
count semantics regression
machine-readable build and validation
public build and validation
Japanese route count parity
L-2 evaluation remains HOLD
maintainer recovery counts == 760 / 1004 / 3249
```

## Expected projected state

```text
Entities: 760
Events:   1004
Evidence: 3249
English dossiers:  760
Japanese dossiers: 760
Sitemap routes:     1544
```

## Status expectations

```text
Alita Finance  limited
AlphaQ         limited
AlphaSec Spot  limited
Alphix         active
Althea DEX     limited
```

Registry presence alone must not be treated as proof of active use. Alphix is the only active classification in BL1 because current multichain liquidity and recent activity evidence are available.

## Merge rule

Do not merge if any reviewed-data, count-semantics, machine/public consistency, URL safety, localization, L-2 HOLD, or recovery gate fails.
