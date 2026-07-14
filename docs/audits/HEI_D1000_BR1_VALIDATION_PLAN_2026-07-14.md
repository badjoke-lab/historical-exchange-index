# HEI D-1000 BR1 Validation Plan

Date: 2026-07-14

## Scope

Validate the BR1 registry-backed historical exchange batch:

```text
HBUS
CoinPlace
Bits Blockchain
BJS
Bigmarkets Limited
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
maintainer recovery counts == 785 / 1004 / 3323
```

## Expected projected state

```text
Entities: 785
Events:   1004
Evidence: 3323
English dossiers:  785
Japanese dossiers: 785
Sitemap routes:     1594
```

## Status expectations

```text
HBUS               inactive
CoinPlace          inactive
Bits Blockchain    inactive
BJS                inactive
Bigmarkets Limited inactive
```

## Evidence boundary

BR1 is deliberately conservative. Each candidate is preserved by the CoinPaprika exchange registry as inactive. HBUS also has a historical website archive reference. For the remaining four candidates, first-party domains, jurisdictions, launch dates, terminal dates, and shutdown causes were not reliably recovered.

The records therefore must not invent:

```text
death dates
shutdown events
death reasons
jurisdictions beyond the evidence
corporate lineage
first-party domains
```

## Overlap expectation

Exact slug, canonical-name, alias, and repository text searches found no current-main entity for the five BR1 candidates. Records validation must report zero blocking overlaps.

## Merge rule

Do not merge if any reviewed-data, count-semantics, machine/public consistency, URL safety, localization, L-2 HOLD, recovery, or entity-quality gate fails.
