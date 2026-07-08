# HEI Unadded Candidate Scan — 0701-0750

Status: reviewed scan checkpoint  
Milestone: D-750 Reviewed Entity Milestone  
Machine-readable authority: `docs/backlog/scans/hei_unadded_0701-0750-scan.json`

## Summary

```text
add_now:                    17
needs_research:              8
pending_thin:               10
out_of_scope_or_duplicate:  15
--------------------------------
total:                      50
```

This range mixes active DEX candidates, active CEX candidates, and historically significant exchange candidates. Direct bundle checks were used for likely existing CEX names because repository search indexing had already missed an existing dYdX bundle in the prior range.

## Add-now queue

```text
Everdex
EverySwap
Excalibur
ExinSwap
EXMO
extended
ezBtc
FairySwap
FameEX
FanX Protocol
Fathom DEX
FCON DEX
FeeFree
Fenix Finance
FermiSwap
Ferra
Ferro
```

Recommended first research group:

```text
EXMO
ezBtc
Fenix Finance
Fathom DEX
Ferro
extended
```

The group intentionally mixes current exchange venues with historically significant exchange records rather than treating the milestone as an active-only directory expansion.

## Consolidation groups

```text
Everdex duplicate source rows -> one entity
EXMO duplicate source rows -> one entity
FameEX duplicate + derivatives row -> one entity
FanX Protocol duplicate source rows -> one entity
Fathom AMM + DEX rows -> one entity
Fenix concentrated-liquidity + standard-pool rows -> one entity
Ferra CLMM/DLMM source rows -> one entity pending contrary lineage evidence
```

## Needs-research queue

```text
Exbito
Exbitron
ExMarkets
Exrates
ExtStock
EXX
Fatbtc
Fcex Exchange / FinanceX
```

These require domain-history, jurisdiction, identity normalization, shutdown/current-state, or terminal-date research before public classification.

## Pending-thin queue

```text
EX24
Ex4ange
EXC Cripto
Exchange BDCASH
eXchangily
EXCOINCIAL
EXNCE
Extrading
Fanáticos Criptos
Fargobase
```

These remain too thin for immediate public record work.

## Scope/product handling

- evently is categorized as Prediction Market.
- EVplusAI is categorized as Interface.
- Exa Card is categorized as Crypto Card Issuer.
- FarmCats Market is categorized as NFT Marketplace.
- FastJPEG is categorized as Launchpad.
- FameEX Derivatives remains a product/market row under FameEX.
- Fenix pool-model rows remain under one Fenix Finance entity.

## Direct existing-bundle checks

Direct bundle paths were checked for likely historical CEX overlaps:

```text
EXMO       no direct existing bundle found
Exrates    no direct existing bundle found
ezBtc      no direct existing bundle found
Exbitron   no direct existing bundle found
Fatbtc     no direct existing bundle found
```

This does not replace full normalization and duplicate validation; it records that exact direct bundle paths were not already present when the scan was prepared.

## D-750 impact

This scan itself does not change reviewed counts. Current merged reviewed state after E1 is:

```text
Entities:  568
Events:    1004
Evidence:  2673
Remaining to D-750: 182
```

Recommended next execution:

```text
Batch D750-F1
  strongest official/regulatory candidates from EXMO / ezBtc / Fenix Finance / Fathom DEX / Ferro / extended

Historical research
  Exbitron / Exrates / ExtStock / EXX / Fatbtc / FinanceX

Batch D750-F2
  next strong add-now group
```

Only reviewed merged records count toward D-750.
