# HEI D-1000 Progress Checkpoint — BX1

Date: 2026-07-15  
Status: COMPLETE  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BX1 is the fourteenth reviewed growth batch during the L-2 initial HOLD period. It added four current active DEX entities using first-party protocol and trading documentation and merged through PR #665 after all required workflows passed.

## 2. Batch contents

```text
Kodiak          hei_ex_000918 active
Kriya           hei_ex_000919 active
Kinetix Finance hei_ex_000920 active
Lynex           hei_ex_000921 active
```

## 3. Reviewed state after merge

```text
Entities: 801
Events:   1004
Evidence: 3361
```

Batch delta:

```text
Entities: +4
Events:   +0
Evidence: +8
```

Remaining to D-1000 after merge:

```text
199 reviewed entities
```

## 4. Status discipline

Kodiak is active because current first-party documentation identifies a Berachain-native DEX using V2 and V3 AMMs and publishes current mainnet factories, routers, position managers, quoters, and related contracts.

Kriya is active because current first-party documentation describes live Sui spot trading through AMM and CLMM liquidity, cross-protocol routing, limit-order integration, and a linked application.

Kinetix Finance is active because its current first-party product suite includes V2 and V3 DEXs, swaps, liquidity and perpetual exchanges, and its current tutorial documents market and limit swaps through the live application.

Lynex is active because its current first-party website links the live DEX application and documents swaps, trading fees, liquidity pools, routing, managed-liquidity strategies, voting, and incentives.

## 5. Overlap findings

Repository-wide name and domain searches found no current-main records for:

```text
Kodiak / kodiak.finance
Kriya / kriya.finance
Kinetix Finance / kinetix.finance
Lynex / lynex.fi
```

Records validation passed on the final PR head.

## 6. Deferred candidates

```text
Helix Markets
  first-party implementation exists but current public status remains insufficiently resolved

Hanbitco, HCoin, Hubi, Hashfort, HeraldEX, HOTDEX, IDCM
  stale registry-only evidence or unresolved current lifecycle
```

BX1 did not use weak candidates merely to increase the batch size.

## 7. Safety boundaries

BX1 did not change:

```text
Cloudflare configuration
localization route scope
L-2 HOLD decision
third-language authorization
canonical schema
public machine-readable safety rules
```

## 8. Completion state

```text
L-2 initial decision: HOLD
D-1000 growth:        CURRENT
D-1000 BW1:           COMPLETE
D-1000 BX1:           COMPLETE
Merged PR:            #665
Language Selection:   blocked until later gate
```

## 9. Authority references

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
docs/audits/HEI_D1000_PROGRESS_BW1_2026-07-15.md
docs/backlog/consumed/hei_unadded-bx1-four-exchange-records.md
records/exchanges/kodiak.json
records/exchanges/kriya.json
records/exchanges/kinetix-finance.json
records/exchanges/lynex.json
```
