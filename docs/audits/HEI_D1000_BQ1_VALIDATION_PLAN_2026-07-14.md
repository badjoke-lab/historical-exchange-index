# HEI D-1000 BQ1 Validation Plan

Date: 2026-07-14

## Scope

Validate the BQ1 reviewed growth batch:

```text
HbarSuite
Helix Markets
Hydrometer Finance
Hummus Finance
Hello DEX
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
maintainer recovery counts == 784 / 1004 / 3315
```

## Expected projected state

```text
Entities: 784
Events:   1004
Evidence: 3315
English dossiers:  784
Japanese dossiers: 784
Sitemap routes:     1592
```

## Status expectations

```text
HbarSuite          active
Helix Markets      limited
Hydrometer Finance inactive
Hummus Finance     active
Hello DEX          active
```

## Overlap expectation

BQ1 was assembled only after checking exact slugs, alternate slugs, canonical names, aliases, and domains against current main. Fluid DEX, Holdstation, and Haven1 hSwap were rejected after alternate-path checks proved that they already exist as `hei_ex_000691`, `hei_ex_000725`, and `hei_ex_000721`.

Records validation must report zero blocking overlaps.

## Hydrometer boundary

Hydrometer Finance is recorded as inactive because the current protocol registry explicitly flags a rug pull and a down website. No death date or terminal event is created because no reliable dated terminal marker was recovered.

## Merge rule

Do not merge if any reviewed-data, count-semantics, machine/public consistency, URL safety, localization, L-2 HOLD, or recovery gate fails.
