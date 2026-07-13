# HEI D-1000 BQ1 Validation Plan

Date: 2026-07-14

## Scope

Validate the entity-first BQ1 batch:

```text
new entity:
  Hydrometer Finance

existing entity enrichments:
  HSuite DEX / HbarSuite
  Hummus
  Hello DEX
```

Helix Markets is excluded because its `helixapp.com` domain overlaps the existing Helix entity while the candidate registry assigns conflicting ecosystem metadata.

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
maintainer recovery counts == 780 / 1004 / 3313
```

## Expected projected state

```text
Entities: 780
Events:   1004
Evidence: 3313
English dossiers:  780
Japanese dossiers: 780
Sitemap routes:     1584
```

## Status expectations

```text
Hydrometer Finance inactive
HSuite DEX           active, enriched
Hummus               active, enriched
Hello DEX            active, enriched
```

## Overlap expectation

BQ1 candidate review found additional alternate-path overlaps after the initial draft:

```text
Fluid DEX      -> hei_ex_000691
Holdstation    -> hei_ex_000725
Haven1 hSwap   -> hei_ex_000721
HbarSuite      -> hei_ex_000758 / HSuite DEX
Helix Markets  -> hei_ex_000697 domain overlap with Helix
Hummus Finance -> hei_ex_000766 / Hummus
Hello DEX      -> hei_ex_000771
```

Duplicate draft files were removed. Current registry evidence was consolidated only where identity remained coherent. Records validation must report zero blocking overlaps.

## Hydrometer boundary

Hydrometer Finance is recorded as inactive because the current protocol registry explicitly flags a rug pull and a down website. No death date or terminal event is created because no reliable dated terminal marker was recovered.

## Merge rule

Do not merge if any reviewed-data, count-semantics, machine/public consistency, URL safety, localization, L-2 HOLD, or recovery gate fails.
