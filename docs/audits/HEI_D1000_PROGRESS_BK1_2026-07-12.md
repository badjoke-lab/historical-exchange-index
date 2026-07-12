# HEI D-1000 Progress Checkpoint — BK1

Date: 2026-07-12  
Status: IN PROGRESS  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BK1 is the first reviewed five-entity batch after the L-2 initial HOLD decision.

## 2. Batch contents

```text
Aborean Finance  hei_ex_000867  active
Alien Base       hei_ex_000868  active
Aequinox         hei_ex_000869  active
AethonSwap       hei_ex_000870  limited
Aldrin           hei_ex_000871  limited
```

Entity-first consolidation:

```text
Aborean AMM + Aborean CL + Aborean Finance V3 -> Aborean Finance
Alien Base V2 + Alien Base V3 -> Alien Base
```

## 3. Projected reviewed state

```text
Entities: 755
Events:   1004
Evidence: 3234
```

Batch delta:

```text
Entities: +5
Events:   +0
Evidence: +15
```

Remaining to D-1000:

```text
245 reviewed entities
```

## 4. Status decisions

- Aborean Finance: active from reachable first-party application and current registry identity.
- Alien Base: active from reachable first-party application and current registry identity.
- Aequinox: active from current liquidity and recent non-zero DEX-volume evidence.
- AethonSwap: limited because residual identity remains but recent trading evidence is insufficient.
- Aldrin: limited because identity remains but strong recent utilization and stable first-party application evidence were not recovered.

## 5. Safety boundaries

BK1 adds reviewed exchange bundles only.

It does not change:

```text
Cloudflare configuration
localization route scope
L-2 HOLD decision
third-language authorization
canonical schema
public machine-readable safety rules
```

## 6. Current execution state

```text
L-2 initial decision: HOLD
D-1000 growth:        CURRENT
D-1000 BK1:           validation pending
Language Selection:  blocked until later gate
```

## 7. Authority references

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
docs/audits/HEI_L2_INITIAL_HOLD_CHECKPOINT_2026-07-11.md
docs/backlog/consumed/hei_unadded-bk1-five-exchanges.md
records/exchanges/aborean-finance.json
records/exchanges/alien-base.json
records/exchanges/aequinox.json
records/exchanges/aethonswap.json
records/exchanges/aldrin.json
```
