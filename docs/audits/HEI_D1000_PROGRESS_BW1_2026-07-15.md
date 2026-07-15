# HEI D-1000 Progress Checkpoint — BW1

Date: 2026-07-15  
Status: IN PROGRESS  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BW1 is the thirteenth reviewed growth batch during the L-2 initial HOLD period. It adds two exchange entities after current-main overlap checks.

## 2. Batch contents

```text
HydraDEX    hei_ex_000917 active
FluxFlow V3 hei_ex_000918 active
```

## 3. Projected reviewed state

```text
Entities: 798
Events:   1004
Evidence: 3352
```

Batch delta:

```text
Entities: +2
Events:   +0
Evidence: +5
```

Remaining to D-1000:

```text
202 reviewed entities
```

## 4. Status discipline

HydraDEX is active because its current first-party application remains reachable and its V3 protocol profile reports current TVL and non-zero 24-hour, 7-day, and 30-day volume and fees. V2 and V3 are consolidated under one HydraDEX entity.

FluxFlow V3 is active because its current Fluent-chain protocol profile reports current liquidity and non-zero recent fees, revenue, and exchange volume. Confidence remains medium and official URL fields remain unset because stable first-party public documentation was not recovered.

## 5. Overlap findings

No current-main entity matched HydraDEX, Hydra DEX, hydradex.org, FluxFlow, or FluxFlow V3 through exact path and repository-wide name/domain searches. HydraDEX is not the same entity as Hydration, the existing Polkadot ecosystem DEX.

The candidate corpus remains a historical snapshot; nearby H-I candidates are heavily represented already and were excluded rather than duplicated.

## 6. Deferred candidates

```text
HbarSuite, Helix Markets
  exchange identity exists but current public status remains insufficiently resolved

Hanbitco, HCoin, Hubi, Hashfort, HeraldEX, HOTDEX, IDCM
  stale registry-only evidence or unresolved current lifecycle

FluxFlow first-party surface
  not recovered; record remains medium-confidence and registry-backed
```

BW1 does not use weak candidates merely to increase batch size.

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
records/exchanges/hydradex.json
records/exchanges/fluxflow-v3.json
```
