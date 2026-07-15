# HEI D-1000 Progress Checkpoint — BW1

Date: 2026-07-15  
Status: IN PROGRESS  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BW1 is the thirteenth reviewed growth batch during the L-2 initial HOLD period. It adds one exchange entity and strengthens two existing exchange records after authoritative overlap validation.

## 2. Batch contents

```text
HSuite    hei_ex_000917 active — new entity
Hydra DEX hei_ex_000764 active — V2/V3 evidence refresh
FluxFlow  hei_ex_000841 active — current metric re-verification
```

## 3. Projected reviewed state

```text
Entities: 797
Events:   1004
Evidence: 3352
```

Batch delta:

```text
Entities: +1
Events:   +0
Evidence: +5
```

Remaining to D-1000:

```text
203 reviewed entities
```

## 4. Status discipline

HSuite is active because its current first-party application remains reachable, its current Hedera protocol profile reports TVL and non-zero 24-hour, 7-day, and 30-day DEX volume, and an open-source adapter queries dedicated HbarSuite network nodes and DEX analytics endpoints.

Hydra DEX remains active. BW1 adds direct V2 and V3 protocol profiles; V3 reports current liquidity and non-zero recent volume and fees, while V2 preserves the version and liquidity context.

FluxFlow remains active. Its existing current protocol source was re-verified against current Fluent-chain liquidity, fees, revenue, and exchange volume. No duplicate FluxFlow V3 entity is created.

## 5. Overlap findings

Records validation found that the initial proposed HydraDEX and FluxFlow V3 records duplicated existing `hydra.json` (`hei_ex_000764`) and `fluxflow.json` (`hei_ex_000841`). The duplicate files were removed and the useful evidence was folded into the existing records.

Repository-wide name and domain searches found no current-main entity for HSuite, HbarSuite, HbarSuite DEX, or hsuite.app.

The candidate corpus remains a historical snapshot; nearby H-I candidates are heavily represented already and were excluded rather than duplicated.

## 6. Deferred candidates

```text
Helix Markets
  exchange identity exists but current public status remains insufficiently resolved

Hanbitco, HCoin, Hubi, Hashfort, HeraldEX, HOTDEX, IDCM
  stale registry-only evidence or unresolved current lifecycle
```

BW1 does not use weak candidates merely to increase the batch size.

## 7. Safety boundaries

BW1 changes reviewed exchange bundles and growth checkpoint documentation only.

It does not change:

```text
Cloudflare configuration
localization route scope
L-2 HOLD decision
third-language authorization
canonical schema
public machine-readable safety rules
```

## 8. Current execution state

```text
L-2 initial decision: HOLD
D-1000 growth:        CURRENT
D-1000 BV1:           COMPLETE
D-1000 BW1:           validation pending
Language Selection:  blocked until later gate
```

## 9. Authority references

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
docs/audits/HEI_D1000_PROGRESS_BV1_2026-07-14.md
docs/backlog/consumed/hei_unadded-bw1-two-exchange-records.md
records/exchanges/hbarsuite.json
records/exchanges/hydra.json
records/exchanges/fluxflow.json
```
