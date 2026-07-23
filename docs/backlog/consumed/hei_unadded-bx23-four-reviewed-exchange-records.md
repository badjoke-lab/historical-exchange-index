# HEI reviewed backlog consumption — D-1000 BX23

Date: 2026-07-23  
State: consumed by reviewed BX23 branch

## Starting checkpoint

BX23 starts from merged BX22 `main` commit `f22d81120ef6861c0611a18d0b735ad4f2a87daa`.

```text
Entities: 885
Events:   1004
Evidence: 3529
English dossiers:  885
Japanese dossiers: 885
Next entity ID:     hei_ex_001006
Next evidence ID:   hei_src_012226
```

## Reviewed additions

```text
Kumbaya        hei_ex_001006 active
SakuraSwap     hei_ex_001007 active
Neoxa Exchange hei_ex_001008 limited
SquidSwap      hei_ex_001009 limited
```

## Candidate sources

```text
current external discovery review
  Kumbaya
  SakuraSwap
  Neoxa Exchange
  SquidSwap
```

## Duplicate and scope controls

Direct canonical name, alias, slug, domain, and record-path searches found no existing entity for the final four additions.

DyorSwap was rejected after direct path review found existing canonical entity `hei_ex_000850` at `records/exchanges/dyorswap.json`.

SquidSwap remains limited because current markets continue to appear in independent directories while the canonical domain has conflicting continuity signals. HEI preserves the URL without marking it live.

Neoxa Exchange remains separate from the planned native Neoxa DEX. The current service includes custody and manual withdrawal review and is modeled as a centralized exchange-like venue rather than as the future native DEX.

## Entity-first boundaries

- Kumbaya consolidates swap, router, V2/V3 pool, launchpad, and social-asset surfaces.
- SakuraSwap consolidates AMM, CLMM, pool, and network-specific deployment surfaces.
- Neoxa Exchange consolidates its current spot, AMM-pool, bridge, and exchange-token surfaces only.
- SquidSwap consolidates AMM trading, token launch, presale, locking, and liquidity-management surfaces.

## Projected reviewed delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected state:

```text
Entities: 889
Events:   1004
Evidence: 3537
English dossiers:  889
Japanese dossiers: 889
Sitemap routes:     1826
Remaining to D-1000: 111
```