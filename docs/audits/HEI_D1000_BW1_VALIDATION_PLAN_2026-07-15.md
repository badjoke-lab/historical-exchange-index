# HEI D-1000 BW1 Validation Plan

Date: 2026-07-15

## Scope

Validate one new reviewed exchange entity and three existing-entity evidence/status refreshes:

```text
Kuru       hei_ex_000917 active — new entity
Hydra DEX  hei_ex_000764 active — V2/V3 evidence refresh
HSuite DEX hei_ex_000758 active — adapter evidence refresh
FluxFlow   hei_ex_000841 active — current metric re-verification
```

## Required checks

```text
record schema validation
overlap audit
name/slug/domain/alias duplicate audit
entity/event/evidence ID collision audit
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
maintainer recovery counts == 797 / 1004 / 3353
```

## Expected projected state

```text
Entities: 797
Events:   1004
Evidence: 3353
English dossiers:  797
Japanese dossiers: 797
Sitemap routes:     1618
```

## Evidence boundary

- Kuru is supported by current first-party documentation, the official public DEX-contract repository, and current Monad DEX and aggregator metrics.
- Hydra DEX already exists as `hei_ex_000764`; BW1 adds direct current V2 and V3 protocol pages, including recent V3 volume and fees.
- HSuite DEX already exists as `hei_ex_000758`; BW1 adds the dedicated open-source adapter that queries HbarSuite mainnet services and DEX analytics endpoints.
- FluxFlow already exists as `hei_ex_000841`; BW1 refreshes the verification date and current metric description without creating a duplicate entity or evidence row.
- No record invents a launch date, jurisdiction, legal entity, terminal date, shutdown cause, predecessor, or successor.

## Overlap findings

Initial proposed HydraDEX, FluxFlow V3, and HSuite records were rejected by authoritative Records validation because existing `hydra.json`, `fluxflow.json`, and `hsuite-dex.json` already own those identities. All three duplicate files were removed and useful evidence was folded into existing records.

Repository-wide exact-path, name, alias, and domain searches found no existing Kuru or kuru.io record.

## Merge rule

Do not merge if any reviewed-data, count-semantics, machine/public consistency, URL safety, localization, L-2 HOLD, recovery, or entity-quality gate fails.
