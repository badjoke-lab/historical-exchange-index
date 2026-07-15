# HEI D-1000 BW1 Validation Plan

Date: 2026-07-15

## Scope

Validate two new reviewed exchange entities:

```text
HydraDEX   hei_ex_000917 active
FluxFlow V3 hei_ex_000918 active
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
maintainer recovery counts == 798 / 1004 / 3352
```

## Expected projected state

```text
Entities: 798
Events:   1004
Evidence: 3352
English dossiers:  798
Japanese dossiers: 798
Sitemap routes:     1620
```

## Evidence boundary

- HydraDEX is supported by the current first-party hydradex.org application and current HydraDEX V2/V3 protocol metrics. V3 reports non-zero recent volume and fees.
- FluxFlow V3 is supported by current Fluent-chain CLMM registry and metric evidence showing current liquidity, fees, revenue, and recent DEX volume.
- FluxFlow V3 has no stable first-party public URL recovered in this pass; URL fields remain unset and confidence remains medium.
- Neither record invents a launch date, jurisdiction, legal entity, terminal date, shutdown cause, predecessor, or successor.

## Overlap expectation

Repository-wide name and domain searches found no current-main record for HydraDEX, hydradex.org, FluxFlow, or FluxFlow V3. HydraDEX is distinct from the existing Polkadot ecosystem Hydration record. V2 and V3 discovery rows are consolidated under one HydraDEX entity rather than split.

## Merge rule

Do not merge if any reviewed-data, count-semantics, machine/public consistency, URL safety, localization, L-2 HOLD, recovery, or entity-quality gate fails.
