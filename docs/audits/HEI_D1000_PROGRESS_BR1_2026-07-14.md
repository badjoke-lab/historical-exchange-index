# HEI D-1000 Progress Checkpoint — BR1

Date: 2026-07-14  
Status: IN PROGRESS  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BR1 is the eighth reviewed growth batch during the L-2 initial HOLD period. It adds five conservative inactive exchange records from the historical registry backlog without expanding localization scope.

## 2. Batch contents

```text
HBUS               hei_ex_000899 inactive
CoinPlace          hei_ex_000900 inactive
Bits Blockchain    hei_ex_000901 inactive
BJS                hei_ex_000902 inactive
Bigmarkets Limited hei_ex_000903 inactive
```

## 3. Projected reviewed state

```text
Entities: 785
Events:   1004
Evidence: 3323
```

Batch delta:

```text
Entities: +5
Events:   +0
Evidence: +10
```

Remaining to D-1000:

```text
215 reviewed entities
```

## 4. Status discipline

All five entities are classified inactive because the historical exchange registry explicitly marks them inactive. No terminal date, shutdown cause, or death event is created.

HBUS is modeled separately from global Huobi/HTX because the historical registry preserves it as the United States venue identity. The record does not assert a corporate successor or exact terminal date.

CoinPlace, Bits Blockchain, BJS, and Bigmarkets Limited retain only registry-supported identity and inactive state. Their first-party domains and jurisdictions remain unset when not reliably recovered.

## 5. Backlog freshness and overlap finding

BR1 selection used exact file checks plus repository-wide searches for canonical names, aliases, and candidate slugs. No current-main record was found for the five selected candidates.

CoinExchange was considered but excluded because the old candidate corpus marked it active while the available historical context suggested a later closure; BR1 does not resolve that contradiction without stronger source recovery.

Hanbitco, HCoin, Hubi, and IDCM were also deferred because their old registry rows did not provide enough current or terminal evidence for a conservative state decision.

## 6. Safety boundaries

BR1 changes reviewed exchange bundles and growth checkpoint documentation only.

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
D-1000 BQ1:           COMPLETE
D-1000 BR1:           validation pending
Language Selection:  blocked until later gate
```

## 8. Authority references

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
docs/audits/HEI_D1000_PROGRESS_BQ1_2026-07-14.md
docs/backlog/consumed/hei_unadded-br1-five-inactive-exchanges.md
records/exchanges/hbus.json
records/exchanges/coinplace.json
records/exchanges/bits-blockchain.json
records/exchanges/bjs.json
records/exchanges/bigmarkets-limited.json
```
