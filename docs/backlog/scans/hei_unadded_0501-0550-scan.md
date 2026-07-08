# HEI Unadded Candidate Scan — 0501-0550

Status: reviewed scan checkpoint  
Milestone: D-750 Reviewed Entity Milestone  
Machine-readable authority: `docs/backlog/scans/hei_unadded_0501-0550-scan.json`

## Summary

```text
add_now:                    18
needs_research:              8
pending_thin:                6
out_of_scope_or_duplicate:  18
--------------------------------
total:                      50
```

The range was reviewed as one cohort before record drafting. A high share of rows are version, deployment, product, category mismatch, or duplicate representations. Entity-first consolidation is applied before any reviewed entity count increase.

## Add-now queue

```text
0503 Cyberperp
0504 Cypher
0508 Cytoswap
0511 DackieSwap
0515 Dano Finance
0520 Dark KnightSwap
0521 Darkness
0524 DDEX
0527 DeDust
0529 DeepBook
0533 DeFi Kingdoms
0537 DefiBox
0538 DeFiChain DEX
0540 DefiPlaza
0542 DefiTuna
0545 DeGate
0549 Delta Exchange candidate
0550 DeltaDeFi
```

Recommended first research group:

```text
DeDust
DeepBook
DeGate
DDEX
DackieSwap
Delta Exchange
```

## Consolidation groups

The following source rows are not treated as separate entities:

```text
0501-0502  Curve product/deployment rows -> existing Curve Finance entity
0504/0506/0507  Cypher + versions -> one entity
0508/0509  Cytoswap -> one entity
0511-0513  DackieSwap versions -> one entity
0518/0519  Darb Finance -> one research candidate
0527/0528  DeDust -> one entity
0529/0530  DeepBook versions -> one entity
0533/0534  DeFi Kingdoms + Crystalvale -> one entity
0538/0539  DeFiChain DEX -> one entity
0540/0541  DefiPlaza + chain-specific row -> one entity
0542/0543  DefiTuna + AMM row -> one entity
```

Version history may become events where historically meaningful, but version rows do not inflate entity count.

## Needs-research queue

```text
0510 Dach Exchange
0517 dappOS IntentEX
0518 Darb Finance
0522 DataDex
0523 Dcoin
0526 Decoin
0531 Deepcoin Derivative
0544 DeFive
```

The research queue requires stronger identity, domain, launch, product-boundary, or current/terminal-state evidence before record drafting.

## Pending-thin queue

```text
0514 Daexs
0516 DAO Swap
0535 DeFi Scan
0536 Defi Swap
0547 Degenswap
0548 Deliondex
```

These remain too thin for immediate public record work.

## D-750 impact

The scan itself does not change reviewed counts.

```text
Entities:  554
Events:    1004
Evidence:  2631
Remaining to D-750: 196
```

Recommended next execution:

```text
Batch D750-B1
  strongest first-party candidates from the recommended research group

Batch D750-B2
  next strong group from the add-now queue

Research queue
  separately resolve the 8 needs_research candidates
```

Only reviewed merged records count toward D-750.
