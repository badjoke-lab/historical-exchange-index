# HEI Unadded Candidate Scan — 0651-0700

Status: reviewed scan checkpoint  
Milestone: D-750 Reviewed Entity Milestone  
Machine-readable authority: `docs/backlog/scans/hei_unadded_0651-0700-scan.json`

## Summary

```text
add_now:                    21
needs_research:              2
pending_thin:                7
out_of_scope_or_duplicate:  20
--------------------------------
total:                      50
```

The range contains several strong DEX candidates and many source rows that would inflate counts if versions, chains, legacy deployments, or product rows were treated as separate entities.

## Add-now queue

```text
El Dorado Exchange
ElectroSwap
Elektrik
Elexium
ElfomoFi
Elix.fi
Elk Finance
Ellipsis Finance
Elys DEX
Embr Finance
Emirex
EmpireDEX
Energiswap
Enosys
Equalizer Exchange
Equation
Equilibre
Equity
Etherex
Ethervista
EulerSwap
```

Recommended first research group:

```text
Ellipsis Finance
Elk Finance
Equalizer Exchange
Enosys
Etherex
EulerSwap
```

## Consolidation groups

```text
Elexium + Elexium Finance -> one entity
Elk + Elk Finance + Avalanche row -> one entity
embr + Embr Finance -> one entity
Emirex duplicate rows -> one entity
Energiswap duplicate rows -> one entity
Enosys Flare/V2/V3 rows -> one entity
Equalizer Base/Sonic/Fantom rows -> one entity
Equilibre duplicate names -> one entity
Etherex duplicate/CL/Legacy rows -> one entity
```

## Needs-research queue

```text
EliteX Exchange
ErgoDEX / Spectrum Finance lineage
```

The ErgoDEX candidate requires explicit lineage/rebrand reconstruction before entity creation or update.

## Pending-thin queue

```text
Enmanet
Erex
Escodex
EtherMium
Ethex
Etor
EurekaX
```

These remain too thin for immediate public record work.

## Scope/product handling

- Emojicoin.fun is categorized as Launchpad.
- EtherFi Cash Liquid is categorized as Crypto Card Issuer.
- Enosys versions and chain rows remain one entity.
- Equalizer chain rows remain one entity.
- Etherex CL and Legacy remain under one Etherex entity.

## D-750 impact

This scan itself does not change reviewed counts. At scan creation, the merged reviewed state is:

```text
Entities:  564
Events:    1004
Evidence:  2661
Remaining to D-750: 186
```

The separate open D1 record batch may change counts independently after review and merge.

Recommended next execution:

```text
Batch D750-E1
  strongest official-source candidates from Ellipsis Finance / Elk Finance / Equalizer Exchange / Enosys / Etherex / EulerSwap

Lineage research
  ErgoDEX / Spectrum Finance

Batch D750-E2
  next strong add-now group
```

Only reviewed merged records count toward D-750.
