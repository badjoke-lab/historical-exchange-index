# HEI D-1000 Progress Checkpoint — BV1

Date: 2026-07-14  
Status: IN PROGRESS  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BV1 is the twelfth reviewed growth batch during the L-2 initial HOLD period. It adds one new exchange entity and refreshes one existing exchange with current first-party implementation evidence after current-main overlap checks.

## 2. Batch contents

```text
HollaEx  hei_ex_000916 active — new entity
GalaSwap hei_ex_000709 active — implementation evidence refresh
```

## 3. Projected reviewed state

```text
Entities: 796
Events:   1004
Evidence: 3347
```

Batch delta:

```text
Entities: +1
Events:   +0
Evidence: +3
```

Remaining to D-1000:

```text
204 reviewed entities
```

## 4. Status discipline

HollaEx is active because its current first-party platform exposes the HollaEx Pro exchange and its current API documentation covers public market data, order books, trades and charts together with authenticated balances, deposits, withdrawals, orders, conversions, WebSocket feeds, and administrative exchange interfaces.

GalaSwap remains active. Its existing record already establishes the native self-custodial GalaChain DEX, concentrated-liquidity pools, market and pool analytics, portfolio history, wallet signing, and on-chain settlement. BV1 adds the official GalaChain DEX chaincode repository, updated in July 2026, as current implementation evidence.

## 5. Overlap findings

Records validation identified the proposed new GalaSwap entity as a duplicate of existing GalaSwap `hei_ex_000709` through normalized slug, canonical name, and `swap.gala.com`. The duplicate file was removed and its strongest additive source was consolidated into the existing record.

HollaEx has no exact file, alternate slug, canonical-name, alias, domain, or repository text overlap on current main.

The candidate corpus remains a historical snapshot. Numerous nearby candidates were already represented by current records and were excluded rather than duplicated.

## 6. Deferred candidates

```text
Hanbitco, HCoin, Hubi, Hashfort, HeraldEX, HOTDEX
  stale registry-only evidence or unresolved current state

Hydra DEX
  identity boundary unresolved against other Hydra/Hydration implementations

Globitex, Graviex, Gleec BTC Exchange, HadesSwap
  insufficient current first-party or lifecycle evidence
```

BV1 does not use these candidates merely to increase the batch size.

## 7. Safety boundaries

BV1 changes reviewed exchange bundles and growth checkpoint documentation only.

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
D-1000 BU1:           COMPLETE
D-1000 BV1:           validation pending
Language Selection:  blocked until later gate
```

## 9. Authority references

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
docs/audits/HEI_D1000_PROGRESS_BU1_2026-07-14.md
docs/backlog/consumed/hei_unadded-bv1-two-exchange-records.md
records/exchanges/hollaex.json
records/exchanges/galaswap.json
```
