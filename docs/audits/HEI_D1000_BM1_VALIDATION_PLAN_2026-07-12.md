# HEI D-1000 BM1 Validation Plan

Date: 2026-07-12

## Scope

Validate the third five-entity D-1000 growth batch:

```text
Amped Finance
Apex DeFi
Aquifer
Arch Swap
Amaterasu Finance
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
maintainer recovery counts == 765 / 1004 / 3264
```

## Expected projected state

```text
Entities: 765
Events:   1004
Evidence: 3264
English dossiers:  765
Japanese dossiers: 765
Sitemap routes:     1554
```

## Status expectations

```text
Amped Finance      limited
Apex DeFi          active
Aquifer             active
Arch Swap           limited
Amaterasu Finance   active
```

## Freshness expectations

The batch must preserve the current-main overlap finding that Angstrom, ApertureSwap, and Arbidex / Arbitrum Exchange are already reviewed and must not be duplicated.

## Merge rule

Do not merge if any reviewed-data, count-semantics, machine/public consistency, URL safety, localization, L-2 HOLD, or recovery gate fails.
