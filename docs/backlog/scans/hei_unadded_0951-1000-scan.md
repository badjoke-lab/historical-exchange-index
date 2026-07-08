# HEI Unadded Candidate Scan — 0951-1000

Status: reviewed scan checkpoint  
Milestone: D-750 Reviewed Entity Milestone  
Machine-readable authority: `docs/backlog/scans/hei_unadded_0951-1000-scan.json`

## Summary

```text
add_now:                    22
needs_research:              4
pending_thin:                2
out_of_scope_or_duplicate:  22
--------------------------------
total:                      50
```

This range contains major current DEX candidates, regional Huobi/HTX lineage questions, and large version/deployment clusters. Entity-first consolidation and direct existing-bundle checks are applied before drafting.

## Add-now queue

```text
HumanFi
Humble Defi
Humidifi
Hummus AMM
HunnySwap
HX Finance
Hybra Finance
Hydra DEX
Hydration
Hydrex Integral
Hydrometer Finance
HyperBlast
HyperBrick
Hyperion
HyperJump
Hyperliquid
HyperSwap
Hypertrade
ICDex
IcecreamSwap
ICPSwap
Icrypex
```

Recommended first research group:

```text
Hyperliquid
Hydration
ICPSwap
ICDex
Hyperion
Humble Defi
```

Hyperliquid is prioritized because of historical and ecosystem importance. Hydration, ICPSwap, ICDex, Hyperion, and Humble Defi have stronger protocol identity or official-source potential than the thinner tail of the range.

## Consolidation and existing-record findings

```text
Huckleberry AMM -> previous-range Huckleberry entity candidate
Humidifi duplicate rows -> one entity
huobi -> existing HTX hei_ex_000019
Hybra V2/V3/V4 -> one entity
Hydra DEX V2/V3 -> one entity
Hydration + Hydration DEX -> one entity
Hyperion duplicate rows -> one entity
Hyperliquid + Spot + Spot Orderbook -> one entity
HyperSwap V2/V3 -> one entity after boundary review
Hypertrade + V3 -> one entity
ICDex duplicate rows -> one entity
IcecreamSwap Core/V2/V3 -> one entity
ICPSwap duplicate rows -> one entity
Icrypex duplicate rows -> one entity
```

## Needs-research queue

```text
Huobi Korea
Huobi US / HBUS
HyperSwap identity boundary
IDCM
```

Huobi regional operations are not automatically merged into HTX because legal and operational entity boundaries require explicit historical research. HyperSwap also requires separation of the Areon-network and Hyperliquid-network identities before public entity creation.

## Pending-thin queue

```text
Hypecoinexchange
iCoinbay
```

These remain too thin for immediate public record work.

## Scope/product handling

- HYPERSTITIONS is categorized as Prediction Market.
- huobi is not a new entity because existing reviewed HTX record `hei_ex_000019` preserves Huobi-to-HTX continuity.
- Hyperliquid spot and spot-orderbook rows remain under one Hyperliquid exchange entity.
- IcecreamSwap chain/version rows remain under one entity.

## Direct existing-bundle checks

```text
HTX / Huobi continuity: existing hei_ex_000019
Hyperliquid direct bundle path: no existing bundle found
```

Direct checks supplement the permanent overlap and duplicate gates.

## D-750 impact

This scan itself does not change reviewed counts. At scan creation, the merged reviewed state is:

```text
Entities:  578
Events:    1004
Evidence:  2703
Remaining to D-750: 172
```

The separate open J1 record batch may change counts independently after review and merge.

Recommended next execution:

```text
Batch D750-K1
  strongest official-source candidates from Hyperliquid / Hydration / ICPSwap / ICDex / Hyperion / Humble Defi

Lineage research
  Huobi Korea
  Huobi US / HBUS
  HyperSwap identity boundary

Historical/current-state research
  IDCM
```

Only reviewed merged records count toward D-750.
