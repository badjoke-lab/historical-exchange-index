# HEI Unadded Candidate Scan — 0901-0950

Status: reviewed scan checkpoint  
Milestone: D-750 Reviewed Entity Milestone  
Machine-readable authority: `docs/backlog/scans/hei_unadded_0901-0950-scan.json`

## Summary

```text
add_now:                    29
needs_research:              6
pending_thin:                3
out_of_scope_or_duplicate:  12
--------------------------------
total:                      50
```

This range has a large immediate-research pool but still requires identity consolidation around HashKey, Helix, Hercules, Hermes, HitBTC, HiveSwap, Honeypop, Honeyswap, and HorizonDEX.

## Add-now queue

```text
Haedal AMM Protocol
HakuSwap
Hanji Protocol
HARD Swap
Hashflow
Hashlock Markets
Hata
Haven1 hSwap
HbarSuite
Heaven
HeliSwap
Helix
Helix Markets
Hello DEX
Heraswap
Hercules
Hermes Protocol
hibachi
Hibt
HitBTC
HiveSwap
Holdstation Swap
Honeypop DEX
Honeyswap
Horiza
HorizonDEX
Hotcoin
Hotstuff Spot
Huckleberry
```

Recommended first research group:

```text
Hashflow
Hata
Helix
HitBTC
Honeyswap
HorizonDEX
```

The group balances historically relevant CEX/DEX venues with current well-defined protocol candidates.

## Consolidation groups

```text
Helix Spot -> Injective Helix entity
Hercules V2/V3 -> one Hercules entity
Hermes V1 -> Hermes Protocol entity
HitBTC duplicate rows -> one entity
HiveSwap V2/V3 -> one entity
Honeypop DEX duplicate rows -> one entity
Honeyswap duplicate rows -> one entity
HorizonDEX duplicate rows -> one entity
```

## Needs-research queue

```text
Hanbitco
HashKey Exchange / HashKey Global boundary
HCoin
HollaEx scope
Hubi
```

HashKey Exchange and HashKey Global are held for explicit legal/entity-boundary review rather than being merged or split by assumption.

## Pending-thin queue

```text
Hashfort
HeraldEX
HOTDEX
```

These remain too thin for immediate public record work.

## Scope/product handling

- Holoworld AI is categorized as Launchpad.
- Holyheld Card is categorized as Crypto Card Issuer.
- HollaEx requires scope review because exchange software/infrastructure and public venue identity may not map cleanly to one HEI entity.
- Helix Markets on ICP is treated as a distinct research candidate from Injective Helix, not automatically merged by name similarity.

## Direct existing-bundle checks

```text
HitBTC direct bundle path: no existing bundle found
Helix direct bundle path:  no existing bundle found
```

Direct checks supplement the permanent overlap and duplicate gates.

## D-750 impact

This scan itself does not change reviewed counts. Current merged reviewed state after G1 is:

```text
Entities:  575
Events:    1004
Evidence:  2694
Remaining to D-750: 175
```

The separate open I1 record batch may change counts independently after review and merge.

Recommended next execution:

```text
Batch D750-J1
  strongest official/regulatory candidates from Hashflow / Hata / Helix / HitBTC / Honeyswap / HorizonDEX

Entity-boundary research
  HashKey Exchange vs HashKey Global
  HollaEx scope

Historical research
  HCoin
  Hubi
```

Only reviewed merged records count toward D-750.
