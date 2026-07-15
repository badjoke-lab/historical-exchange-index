# HEI D-1000 Progress Checkpoint — BX2

Date: 2026-07-15  
Status: IN PROGRESS  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BX2 is the fifteenth reviewed growth batch during the L-2 initial HOLD period. It adds four current active DEX entities using current first-party protocol, interface, contract, and trading documentation.

## 2. Batch contents

```text
Maverick Protocol hei_ex_000922 active
Merchant Moe      hei_ex_000923 active
Meteora           hei_ex_000924 active
Minswap           hei_ex_000925 active
```

## 3. Projected reviewed state

```text
Entities: 805
Events:   1004
Evidence: 3369
```

Batch delta:

```text
Entities: +4
Events:   +0
Evidence: +8
```

Remaining to D-1000:

```text
195 reviewed entities
```

## 4. Status discipline

Maverick Protocol is active because current first-party documentation identifies a live spot-swap DEX and liquidity protocol with a V2 interface for swaps, liquidity positions, incentives, voting, and pool creation.

Merchant Moe is active because current first-party documentation identifies a Mantle-native DEX with swaps, limit orders, classic AMM pools, Liquidity Book markets, farming, staking, gauges, and a published current contract registry.

Meteora is active because current first-party documentation exposes a live Solana application and current DLMM, DAMM v2, bonding-curve, pool, swap, liquidity, API, SDK, and launch infrastructure.

Minswap is active because its current first-party site exposes live Cardano swaps, aggregation, liquidity, farming, staking, launch, governance, analytics, and wallet functions, supported by current protocol documentation.

## 5. Overlap findings

Repository-wide name and domain searches found no current-main records for:

```text
Maverick Protocol / mav.xyz
Merchant Moe / merchantmoe.com
Meteora / meteora.ag
Minswap / minswap.org
```

Records validation remains authoritative. Any normalized overlap found by CI must be resolved before merge.

## 6. Checkpoint repair

BX2 repairs the stale BX1 progress state from `validation pending` to `COMPLETE` and advances the maintainer recovery reference to BX2.

## 7. Safety boundaries

BX2 does not change:

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
D-1000 BX1:           COMPLETE
D-1000 BX2:           validation pending
Language Selection:  blocked until later gate
```

## 9. Authority references

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
docs/audits/HEI_D1000_PROGRESS_BX1_2026-07-15.md
docs/backlog/consumed/hei_unadded-bx2-four-active-dex-records.md
records/exchanges/maverick-protocol.json
records/exchanges/merchant-moe.json
records/exchanges/meteora.json
records/exchanges/minswap.json
```
