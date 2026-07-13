# HEI D-1000 BO1 Validation Plan

Date: 2026-07-12

## Scope

Validate the BO1 reviewed growth batch, BMX entity-first consolidation, and AutoShark URL-safety repair:

```text
AstroSwap
BCSwap
Beamex AMM
BLEX
BMX Classic AMM -> existing BMX Trade
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
maintainer recovery counts == 774 / 1004 / 3295
```

## Expected projected state

```text
Entities: 774
Events:   1004
Evidence: 3295
English dossiers:  774
Japanese dossiers: 774
Sitemap routes:     1572
```

## Status expectations

```text
AstroSwap       limited
BCSwap          limited
Beamex AMM      limited
BLEX            active
BMX Trade       active, enriched with BMX Classic AMM aliases and evidence
AutoShark       dead
```

## URL-safety expectation

```text
AutoShark official_url_status == unsafe
repurposed gambling domain is not presented as a safe public destination
historical archive and shutdown evidence remain available
```

## Overlap expectation

Prior BO1 heads were correctly rejected for duplicate identities. The final head removes the separate BMX Classic AMM entity and consolidates its aliases and evidence into existing BMX Trade because both resolve to the same `bmx.trade` identity. Records validation must report zero blocking overlaps.

## Merge rule

Do not merge if any reviewed-data, count-semantics, machine/public consistency, URL safety, localization, L-2 HOLD, or recovery gate fails.
