# HEI reviewed backlog consumption — D-1000 BX22

Date: 2026-07-22  
State: consumed by reviewed BX22 branch

## Starting checkpoint

BX22 starts from merged BX21 `main` commit `236b0c8d1014d246906831ed42ba3812465a2d19`.

```text
Entities: 881
Events:   1004
Evidence: 3521
English dossiers:  881
Japanese dossiers: 881
Next entity ID:     hei_ex_001002
Next evidence ID:   hei_src_012218
```

## Reviewed additions

```text
World Markets hei_ex_001002 active
Prism DEX     hei_ex_001003 active
Nado          hei_ex_001004 active
InkySwap      hei_ex_001005 active
```

## Candidate sources

```text
current external discovery review
  World Markets
  Prism DEX
  Nado
  InkySwap
```

## Duplicate and scope controls

The BX22 screening pass rejected or consolidated stale candidates already represented by canonical entities, including BTC Markets, BTCBOX, BTSE Futures, Buenbit, Bunni V2, BuyUcoin, Cables Finance, Caliber, Canonic, Capricorn, Carbon DeFi, and Canto Dex.

Records validation rejected two initial BX22 proposals:

```text
Buda.com        -> hei_ex_000054
BMX Classic AMM -> BMX Trade hei_ex_000610
```

Their proposed files were removed, their ID and evidence slots were reassigned, and both candidates were terminally closed as duplicates in `data-staging/watchlists/resolution/overrides/20260722-bx22-duplicate-closures.json`. The validation gate was not bypassed.

BMEX was not promoted because the candidate name is ambiguous across the BitMEX BMEX token and unrelated exchange references.

Direct canonical path, alias, domain, and product-lineage review found no existing entity for World Markets, Prism DEX, Nado, or InkySwap.

## Entity-first boundaries

- World Markets consolidates spot, perpetual futures, lending, ATLAS risk controls, and unified-margin trading under one MegaETH exchange entity.
- Prism DEX consolidates the Prism application, V3 factory, pools, and concentrated-liquidity positions.
- Nado consolidates spot, perpetuals, its sequencer and on-chain settlement architecture, and the NLP liquidity vault.
- InkySwap consolidates the AMM DEX and its InkyPump-linked pre-bond and post-bond trading surfaces.

## Projected reviewed delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected state:

```text
Entities: 885
Events:   1004
Evidence: 3529
English dossiers:  885
Japanese dossiers: 885
Sitemap routes:     1818
Remaining to D-1000: 115
```
