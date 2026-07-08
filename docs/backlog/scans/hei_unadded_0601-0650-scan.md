# HEI Unadded Candidate Scan — 0601-0650

Status: reviewed scan checkpoint  
Milestone: D-750 Reviewed Entity Milestone  
Machine-readable authority: `docs/backlog/scans/hei_unadded_0601-0650-scan.json`

## Summary

```text
add_now:                    21
needs_research:              4
pending_thin:                4
out_of_scope_or_duplicate:  21
--------------------------------
total:                      50
```

This range contains several strong DEX/protocol candidates and a large number of version, chain, product, existing-entity, and duplicate rows. Entity-first consolidation and direct-bundle verification are applied before record drafting.

## Add-now queue

```text
DPEX
DragonSwap
Drift
Dswap
DTX Dex
Duality
DuckyDeFi
Durianfun AMM
Dusa
DX25
DYORSwap
Dystopia
E3
EagleFi
Earnium
Ebisu's Bay
EchoDEX
Econia
EddyFinance
edgeX Spot
Ekubo
```

Recommended first research group:

```text
DragonSwap
Ekubo
DX25
Econia
Drift
```

dYdX was removed from the add-now queue after direct bundle verification found the existing reviewed entity `hei_ex_000517` in `records/exchanges/dydx.json`.

## Consolidation groups

```text
DragonSwap V2/V3 rows -> one entity
Dswap duplicate rows -> one entity
Dusa + Dusa Protocol -> one entity
DYORSwap chain/AMM rows -> one entity
Dystopia duplicate rows -> one entity
Ebisu's Bay duplicate rows -> one entity
EchoDEX V2/V3 -> one entity
EddyFinance + AMM row -> one entity
Ekubo + Ethereum V3 row -> one entity
dYdX source row -> existing hei_ex_000517
```

## Needs-research queue

```text
Dracula Finance
Dsdaq Global
EarnBIT
EGERA
```

These require scope, jurisdiction, domain-history, or current/terminal-state research before public drafting.

## Pending-thin queue

```text
Eco Exchange
EFC Global
EGAS swap
Einax
```

These remain too thin for immediate public record work.

## Scope/product handling

- Dove Wallet remains outside current exchange scope without stronger contrary evidence.
- Drip.Trade is categorized as NFT Marketplace.
- DTrade is categorized as Telegram Bot.
- Ducata is categorized as Yield.
- Durianfun Launchpad and DYORSwap Launchpad are product rows and are not separate exchange entities.
- dYdX is already represented by reviewed entity `hei_ex_000517` and is not a new D-750 entity.

## D-750 impact

This scan itself does not change reviewed counts. The current merged reviewed state after C1 is:

```text
Entities:  564
Events:    1004
Evidence:  2661
Remaining to D-750: 186
```

Recommended next execution:

```text
Batch D750-D1
  strongest official-source candidates from DragonSwap / Ekubo / DX25

Lifecycle research
  Econia archived repository and current protocol state
  Drift post-incident current state

Batch D750-D2
  next strong add-now group

Research queue
  separately resolve the 4 needs-research candidates
```

Only reviewed merged records count toward D-750.
