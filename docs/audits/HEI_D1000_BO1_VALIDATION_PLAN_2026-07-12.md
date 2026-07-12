# HEI D-1000 BO1 Validation Plan

Date: 2026-07-12

## Scope

Validate the fifth five-entity D-1000 growth batch and AutoShark URL-safety repair:

```text
AstroSwap
AuraSwap
BarterSwap Superposition
Basin Exchange
Beam Swap
AutoShark URL repair
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
AstroSwap                 limited
AuraSwap                  limited
BarterSwap Superposition  active
Basin Exchange            active
Beam Swap                 active
AutoShark                 dead
```

## URL-safety expectation

```text
AutoShark official_url_status == unsafe
repurposed gambling domain is not presented as a safe public destination
historical archive and shutdown evidence remain available
```

## Freshness expectations

The batch must preserve current-main overlap findings and must not duplicate Astroport, Astrovault, Atlantis, Atmos, Auragi, AuroraSwap, AutoShark, AUX Exchange, Axial, BabyDogeSwap, BabySwap, BaseX, or Bancor version rows.

## Merge rule

Do not merge if any reviewed-data, count-semantics, machine/public consistency, URL safety, localization, L-2 HOLD, or recovery gate fails.
