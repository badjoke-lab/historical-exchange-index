# HEI D-1000 Progress Checkpoint — BX4

Date: 2026-07-16  
Status: IN PROGRESS  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BX4 is the seventeenth reviewed growth batch during the L-2 initial HOLD period. It adds four current active DEX entities using current first-party exchange, application, protocol, and deployed-contract documentation.

## 2. Batch contents

```text
Shadow Exchange hei_ex_000930 active
Equalizer       hei_ex_000931 active
Metropolis      hei_ex_000932 active
Momentum        hei_ex_000933 active
```

## 3. Projected reviewed state

```text
Entities: 813
Events:   1004
Evidence: 3385
```

Batch delta:

```text
Entities: +4
Events:   +0
Evidence: +8
```

Remaining to D-1000:

```text
187 reviewed entities
```

## 4. Status discipline

Shadow Exchange is active because current first-party documentation identifies a Sonic-native concentrated-liquidity exchange, links a live application, and publishes current pool, router, quoter, gauge, voting, and position-management contracts.

Equalizer is active because current first-party documentation describes operating Fantom and Sonic exchange deployments with liquidity pools, swaps, gauges, voting incentives, and current Sonic factory, routing, concentrated-liquidity, and quoting contracts.

Metropolis is active because current first-party documentation identifies a Sonic-native Liquidity Book DLMM DEX, links a live application, and publishes current Sonic mainnet factories, routers, quoter, and pair implementation addresses.

Momentum is active because current first-party documentation identifies a live Sui concentrated-liquidity DEX with swaps, liquidity provision, programmable multi-step transactions, incentives, cross-chain support, and a linked public application.

## 5. Overlap and candidate findings

Repository-wide name and domain searches and direct canonical-path checks found no current-main records for:

```text
Shadow Exchange / shadow.so
Equalizer / equalizer.exchange
Metropolis / metropolis.exchange
Momentum / mmt.finance
```

Blackhole and Kodiak were initially reviewed but excluded when direct path reads confirmed existing reviewed records. Search-index omissions were not treated as proof of absence.

Records validation, Candidate scan, and Watchlist resolution remain authoritative. Any normalized overlap found by CI must be resolved before merge.

## 6. Checkpoint repair

BX4 marks the merged BX3 checkpoint complete and advances the maintainer recovery reference and reviewed counts to BX4.

## 7. Safety boundaries

BX4 does not change:

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
D-1000 BX3:           COMPLETE
D-1000 BX4:           validation pending
Language Selection:  blocked until later gate
```

## 9. Authority references

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
docs/audits/HEI_D1000_PROGRESS_BX3_2026-07-15.md
docs/backlog/consumed/hei_unadded-bx4-four-active-dex-records.md
records/exchanges/shadow-exchange.json
records/exchanges/equalizer.json
records/exchanges/metropolis.json
records/exchanges/momentum.json
```
