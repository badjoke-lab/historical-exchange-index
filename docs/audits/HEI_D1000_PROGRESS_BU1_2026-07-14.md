# HEI D-1000 Progress Checkpoint — BU1

Date: 2026-07-14  
Status: IN PROGRESS  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BU1 is the eleventh reviewed growth batch during the L-2 initial HOLD period. It adds one new exchange entity and refreshes one existing entity with current first-party API evidence after current-main overlap checks.

## 2. Batch contents

```text
Glyph Exchange  hei_ex_000915 limited — new entity
GMO Coin Japan hei_ex_000692 active  — evidence refresh
```

## 3. Projected reviewed state

```text
Entities: 795
Events:   1004
Evidence: 3344
```

Batch delta:

```text
Entities: +1
Events:   +0
Evidence: +3
```

Remaining to D-1000:

```text
205 reviewed entities
```

## 4. Status discipline

GMO Coin Japan remains active. Its existing record already establishes the regulated Japanese exchange identity, current order-book and leverage trading, broker service, wallets, staking, lending, and related services. BU1 refreshes the record with current first-party API documentation covering public and authenticated REST and WebSocket exchange functions and a change history through June 2026.

Glyph Exchange is limited because a maintained DEX adapter identifies its Core deployment and queries a CoreDAO-hosted Glyph subgraph for volume and fee accounting, while a stable first-party interface and independently verified recent user activity were not recovered. BU1 therefore does not promote it to active or infer a shutdown.

## 5. Overlap findings

The proposed new GMO Coin entity was rejected by records validation because existing GMO Coin Japan `hei_ex_000692` already owns the GMO Coin names, aliases, and `coin.z.com` domain. The duplicate file was removed and its strongest new API source was added to the existing record.

Hotcoin initially appeared unlisted through the stale candidate scan. Creation was stopped when GitHub reported an existing target path, revealing current-main Hotcoin `hei_ex_000712`, which already contains current first-party website and API evidence.

Glyph Exchange has no exact file, alternate slug, canonical-name, alias, domain, or repository text overlap on current main.

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
records/exchanges/gmo-coin-japan.json
records/exchanges/glyph-exchange.json
```
