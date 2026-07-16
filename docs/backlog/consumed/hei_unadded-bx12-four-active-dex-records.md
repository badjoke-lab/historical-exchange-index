# Consumed Backlog — D-1000 BX12 Four Active DEX Records

Date: 2026-07-17  
State: consumed by reviewed BX12 batch

## Added

```text
NOXA             hei_ex_000962
Somnia Exchange  hei_ex_000963
SectorOne        hei_ex_000964
Somnex           hei_ex_000965
```

## Selection basis

Each added entity has:

```text
current first-party identity surface
current exchange or integrated trading functionality
current non-zero protocol activity
direct canonical-path checks
alternate slug checks
legacy nested path checks
repository-wide name and domain checks
no invented legal or lifecycle fields
```

## Identity handling

NOXA DEX and NOXA Fun are one NOXA entity.

SectorOne DLMM pools, farms, and vaults are one SectorOne exchange and liquidity-layer entity.

Somnex DEX, Somnex V3, SpotX aggregation, perpetuals, and meme-launch trading are one Somnex trading-platform entity.

Metric child labels must not be promoted into duplicate canonical exchange records.

## Excluded or held

```text
Bean Exchange:
  existing record hei_ex_000559

SomeSwap:
  current independent activity visible
  held because a sufficiently strong current first-party identity and documentation surface was not confirmed

NOXA child metric labels:
  not separate exchange entities

SectorOne DLMM Vaults:
  not a separate exchange entity

Somnex DEX / Somnex V3:
  not separate exchange entities
```

## Validation authority

Final identity and overlap authority remains:

```text
Records validation
Candidate scan gate
Watchlist resolution gate
Permanent entity quality audit
```
