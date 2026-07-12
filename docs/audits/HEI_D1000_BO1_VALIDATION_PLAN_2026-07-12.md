# HEI D-1000 BO1 Validation Plan

Date: 2026-07-12

## Scope

Validate the fifth five-entity D-1000 growth batch and AutoShark URL-safety repair:

```text
AstroSwap
BCSwap
Beamex AMM
Baseline (Base)
Blitz AMM
AutoShark URL repair
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
unsafe URL suppression
count semantics regression
machine-readable build and validation
public build and validation
Japanese route count parity
L-2 evaluation remains HOLD
maintainer recovery counts == 775 / 1004 / 3295
```

## Expected projected state

```text
Entities: 775
Events:   1004
Evidence: 3295
English dossiers:  775
Japanese dossiers: 775
Sitemap routes:     1574
```

## Status expectations

```text
AstroSwap        limited
BCSwap           limited
Beamex AMM       limited
Baseline (Base)  active
Blitz AMM        limited
AutoShark        dead
```

## URL-safety expectation

```text
AutoShark official_url_status == unsafe
repurposed gambling domain is not presented as a safe public destination
historical archive and shutdown evidence remain available
```

## Overlap expectation

AuraSwap, BarterSwap Superposition, Basin Exchange, and Beam Swap were rejected by the first BO1 overlap run because they already resolved to reviewed canonical or alias records. The replacement head must report zero blocking overlaps.

## Merge rule

Do not merge if any reviewed-data, count-semantics, machine/public consistency, URL safety, localization, L-2 HOLD, or recovery gate fails.
