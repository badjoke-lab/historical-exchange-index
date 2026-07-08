# HEI Unadded Candidate Scan — 0551-0600

Status: reviewed scan checkpoint  
Milestone: D-750 Reviewed Entity Milestone  
Machine-readable authority: `docs/backlog/scans/hei_unadded_0551-0600-scan.json`

## Summary

```text
add_now:                    22
needs_research:              6
pending_thin:                8
out_of_scope_or_duplicate:  14
--------------------------------
total:                      50
```

This range contains a strong immediate-research pool but also many deployment, product, network, and duplicate source rows. Entity-first consolidation is applied before any public entity growth.

## Add-now queue

```text
DeltaSwap
DeltaTrade
Demex
derive
DerpDEX
Dex-Trade
Dexalot
dexie
Dexlab
Dexter Exchange
Dezswap
DFX V2
Dfyn
Digitalexchange.id
DipCoin Spot
Diviswap
DODO
DogeSwap
Doma DEX V3
DOOAR
DotSwap
Dove Swap V3
```

Recommended first research group:

```text
DODO
Dexalot
Demex
derive
Dfyn
Digitalexchange.id
```

These candidates have comparatively strong identity, official-domain, regulatory, or protocol-history potential.

## Consolidation groups

```text
DeltaSwap + Arbitrum row -> one entity
Demex + Demex AMM -> one entity
DerpDEX + opBNB row -> one entity
Dex-Trade duplicate rows -> one entity
Dexalot + Dexalot DEX -> one entity
Dfyn + Dfyn Network rows -> one entity
Diviswap duplicate rows -> one entity
DODO chain deployments + AMM row -> one entity
```

Version, chain, product, and registry-source rows do not create additional HEI entities.

## Needs-research queue

```text
DeversiFi
DFLOW
DIFX
DigiDinar
DNAX
DOBI
```

These require lineage, scope, jurisdiction, domain-history, or current/terminal-state work before public drafting.

## Pending-thin queue

```text
Dexomy
dexSWAP
Dexzbitz
Dgtmarket
Dinosaur Eggs
Dogeshrek
Dogex Global
Domitai
```

These remain too thin for immediate public record work.

## Scope/product handling

- DFlow Prediction Market is categorized as an interface row and is not promoted as a separate exchange entity from this scan.
- Dinari is categorized as RWA and is not promoted as an exchange entity from this row.
- DODO chain and AMM rows are consolidated into one protocol entity.

## D-750 impact

This scan does not change reviewed counts. At scan creation, the currently merged reviewed public state is:

```text
Entities:  558
Events:    1004
Evidence:  2643
Remaining to D-750: 192
```

The open B2 record batch may change these counts independently after review and merge.

Recommended next execution:

```text
Batch D750-C1
  strongest official-source candidates from DODO / Dexalot / Demex / derive / Dfyn / Digitalexchange.id

Batch D750-C2
  next strong add-now group

Research queue
  separately resolve the 6 needs_research candidates
```

Only reviewed merged records count toward D-750.
