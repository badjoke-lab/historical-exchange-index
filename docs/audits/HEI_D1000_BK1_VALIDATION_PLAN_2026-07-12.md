# HEI D-1000 BK1 Validation Plan

Date: 2026-07-12

## Scope

Validate the first five-entity D-1000 growth batch:

```text
Aborean Finance
Alien Base
Aequinox
AethonSwap
Aldrin
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
maintainer recovery counts == 755 / 1004 / 3234
```

## Expected projected state

```text
Entities: 755
Events:   1004
Evidence: 3234
English dossiers:  755
Japanese dossiers: 755
```

## Merge rule

Do not merge if any reviewed-data, count-semantics, machine/public consistency, URL safety, localization, or recovery gate fails.
