# HEI D-1000 Progress Checkpoint — BT1

Date: 2026-07-14  
Status: IN PROGRESS  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BT1 is the tenth reviewed growth batch during the L-2 initial HOLD period. It adds five exchange records after current-main overlap checks and replaces one rejected duplicate candidate before PR creation.

## 2. Batch contents

```text
Durianfun AMM hei_ex_000909 active
Econia        hei_ex_000910 inactive
edgeX         hei_ex_000911 active
ExinSwap      hei_ex_000912 active
FVM Exchange  hei_ex_000913 active
```

## 3. Projected reviewed state

```text
Entities: 795
Events:   1004
Evidence: 3343
```

Batch delta:

```text
Entities: +5
Events:   +0
Evidence: +10
```

Remaining to D-1000:

```text
205 reviewed entities
```

## 4. Status discipline

Durianfun AMM is active because current adapters track 2026 production factories, graduated AMM pools, swaps, fees, revenue, and liquidity.

Econia is inactive because its first-party repository preserves the Aptos order-book protocol but notes inactive maintenance, while current registry infrastructure places Econia in the dead-adapter corpus. No exact shutdown date or cause is asserted.

edgeX is active because its maintained first-party V2 SDK documents current exchange functions and a current adapter queries enabled spot markets and public volume APIs.

ExinSwap is active because first-party documentation preserves its AMM trading, stablecoin, routing, and liquidity functions and a current adapter queries its application API.

FVM Exchange is active because a June 2026 adapter directly enumerates its Fantom pair factory, reserves, gauges, rewards, and liquidity pools. Its URL remains live_unverified.

## 5. Overlap finding

Fathom AMM / Fathom DEX initially appeared unlisted through partial file checks. Creation was stopped when GitHub reported an existing target path, revealing current-main Fathom DEX `hei_ex_000686`, which already consolidates both names. FVM Exchange replaced it.

The final five entities have no exact file, alternate slug, canonical-name, alias, or repository text overlap on current main.

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
docs/backlog/consumed/hei_unadded-bt1-five-exchange-records.md
records/exchanges/durianfun-amm.json
records/exchanges/econia.json
records/exchanges/edgex.json
records/exchanges/exinswap.json
records/exchanges/fvm-exchange.json
```
