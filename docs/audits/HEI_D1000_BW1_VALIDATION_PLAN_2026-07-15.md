# HEI D-1000 BW1 Validation Plan

Date: 2026-07-15

## Scope

Validate one new reviewed exchange entity and two existing-entity evidence/status refreshes:

```text
HSuite    hei_ex_000917 active — new entity
Hydra DEX hei_ex_000764 active — V2/V3 evidence refresh
FluxFlow  hei_ex_000841 active — current metric re-verification
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
maintainer recovery counts == 797 / 1004 / 3352
```

## Expected projected state

```text
Entities: 797
Events:   1004
Evidence: 3352
English dossiers:  797
Japanese dossiers: 797
Sitemap routes:     1618
```

## Evidence boundary

- HSuite is supported by its current first-party application, current Hedera AMM metrics, and an open-source adapter querying dedicated HbarSuite network nodes and DEX analytics endpoints.
- Hydra DEX already exists as `hei_ex_000764`; BW1 adds direct current V2 and V3 protocol pages, including recent V3 volume and fees.
- FluxFlow already exists as `hei_ex_000841`; BW1 refreshes the verification date and current metric description without creating a duplicate entity.
- No record invents a launch date, jurisdiction, legal entity, terminal date, shutdown cause, predecessor, or successor.

## Overlap findings

Initial proposed HydraDEX and FluxFlow V3 records were rejected by Records validation because existing `hydra.json` and `fluxflow.json` already own their names, aliases, and domain identity. Both duplicate files were deleted. Repository-wide searches found no existing HSuite, HbarSuite, or hsuite.app entity.

## Merge rule

Do not merge if any reviewed-data, count-semantics, machine/public consistency, URL safety, localization, L-2 HOLD, recovery, or entity-quality gate fails.
