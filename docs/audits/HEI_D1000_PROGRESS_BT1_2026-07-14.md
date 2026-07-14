# HEI D-1000 Progress Checkpoint — BT1

Date: 2026-07-14  
Status: IN PROGRESS  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BT1 is the tenth reviewed growth batch during the L-2 initial HOLD period. It adds four exchange records after current-main overlap checks. Two apparent candidates were rejected as existing entities rather than forcing the batch to five.

## 2. Batch contents

```text
Econia        hei_ex_000910 inactive
edgeX         hei_ex_000911 active
ExinSwap      hei_ex_000912 active
FVM Exchange  hei_ex_000913 active
```

## 3. Projected reviewed state

```text
Entities: 794
Events:   1004
Evidence: 3341
```

Batch delta:

```text
Entities: +4
Events:   +0
Evidence: +8
```

Remaining to D-1000:

```text
206 reviewed entities
```

## 4. Status discipline

Econia is inactive because its first-party repository preserves the Aptos order-book protocol but notes inactive maintenance, while current registry infrastructure places Econia in the dead-adapter corpus. No exact shutdown date or cause is asserted.

edgeX is active because its maintained first-party V2 SDK documents current exchange functions and a current adapter queries enabled spot markets and public volume APIs.

ExinSwap is active because first-party documentation preserves its AMM trading, stablecoin, routing, and liquidity functions and a current adapter queries its application API.

FVM Exchange is active because a June 2026 adapter directly enumerates its Fantom pair factory, reserves, gauges, rewards, and liquidity pools. Its URL remains live_unverified.

## 5. Overlap finding

Fathom AMM / Fathom DEX initially appeared unlisted through partial file checks. Creation was stopped when GitHub reported an existing target path, revealing current-main Fathom DEX `hei_ex_000686`, which already consolidates both names.

Durianfun AMM was then drafted, but records validation detected canonical-name and alias overlap with existing Durian AMM `hei_ex_000864`. The duplicate record was removed.

The final four entities have no blocking overlap on current main. BT1 deliberately remains a four-record batch rather than forcing a weaker fifth candidate.

## 6. Safety boundaries

BT1 changes reviewed exchange bundles and growth checkpoint documentation only.

It does not change:

```text
Cloudflare configuration
localization route scope
L-2 HOLD decision
third-language authorization
canonical schema
public machine-readable safety rules
```

## 7. Current execution state

```text
L-2 initial decision: HOLD
D-1000 growth:        CURRENT
D-1000 BS1:           COMPLETE
D-1000 BT1:           validation pending
Language Selection:  blocked until later gate
```

## 8. Authority references

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
docs/audits/HEI_D1000_PROGRESS_BS1_2026-07-14.md
docs/backlog/consumed/hei_unadded-bt1-four-exchange-records.md
records/exchanges/econia.json
records/exchanges/edgex.json
records/exchanges/exinswap.json
records/exchanges/fvm-exchange.json
```
