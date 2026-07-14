# HEI D-1000 Progress Checkpoint — BU1

Date: 2026-07-14  
Status: IN PROGRESS  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BU1 is the eleventh reviewed growth batch during the L-2 initial HOLD period. It adds two exchange records after current-main overlap checks and rejects one duplicate candidate rather than forcing a larger batch.

## 2. Batch contents

```text
GMO Coin       hei_ex_000914 active
Glyph Exchange hei_ex_000915 limited
```

## 3. Projected reviewed state

```text
Entities: 796
Events:   1004
Evidence: 3345
```

Batch delta:

```text
Entities: +2
Events:   +0
Evidence: +4
```

Remaining to D-1000:

```text
204 reviewed entities
```

## 4. Status discipline

GMO Coin is active because its current first-party Japanese exchange website exposes brokerage, order-book exchange, crypto-FX, deposits and withdrawals, staking, lending, market, account, and trading-tool surfaces. Its current first-party API documentation covers public and authenticated REST and WebSocket exchange functions and contains a change history through June 2026.

Glyph Exchange is limited because a maintained DEX adapter identifies its Core deployment and queries a CoreDAO-hosted Glyph subgraph for volume and fee accounting, while a stable first-party interface and independently verified recent user activity were not recovered. BU1 therefore does not promote it to active or infer a shutdown.

## 5. Overlap finding

Hotcoin initially appeared unlisted through the stale candidate scan. Creation was stopped when GitHub reported an existing target path, revealing current-main Hotcoin `hei_ex_000712`, which already contains current first-party website and API evidence.

The final two entities have no exact file, alternate slug, canonical-name, alias, domain, or repository text overlap on current main.

## 6. Deferred candidates

```text
Globitex          insufficient current first-party and lifecycle evidence
Graviex           insufficient current first-party and lifecycle evidence
Gleec BTC Exchange identity and exchange-boundary evidence incomplete
HadesSwap         thin aggregator-only evidence
```

BU1 does not use these candidates merely to increase the batch size.

## 7. Safety boundaries

BU1 changes reviewed exchange bundles and growth checkpoint documentation only.

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
D-1000 BT1:           COMPLETE
D-1000 BU1:           validation pending
Language Selection:  blocked until later gate
```

## 9. Authority references

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
docs/audits/HEI_D1000_PROGRESS_BT1_2026-07-14.md
docs/backlog/consumed/hei_unadded-bu1-two-exchange-records.md
records/exchanges/gmo-coin.json
records/exchanges/glyph-exchange.json
```
