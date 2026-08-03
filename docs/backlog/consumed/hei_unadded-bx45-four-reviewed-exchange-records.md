# Consumed backlog — BX45 four reviewed exchange records

Status: consumed  
Date: 2026-08-03  
Milestone: D-1000 Reviewed Entity Milestone

## Added

```text
Accumulus     hei_ex_001096 active
PantherTrade  hei_ex_001097 active
BGE           hei_ex_001098 active
VDX           hei_ex_001099 active
```

## Evidence allocation

```text
Accumulus     hei_src_012421–012422
PantherTrade  hei_src_012423–012424
BGE           hei_src_012425–012426
VDX           hei_src_012427–012428
```

## Event allocation

No new lifecycle event is added. The next unused event ID remains `hei_ev_010095`.

## Status handling

All four entities are added as `active` at high confidence.

Each record is supported by a current first-party operating or licensing surface and the Hong Kong Securities and Futures Commission list of licensed virtual asset trading platforms. The SFC evidence is used for operator identity, platform identity, CE reference, licensing date, and current licensed-platform status, not as a performance or safety endorsement.

## Identity and overlap checks

Direct current-main name, path, domain, and historical commit checks found no reviewed Accumulus, PantherTrade, BGE, or VDX entity before drafting.

No unsupported predecessor, successor, merger, acquisition, rebrand, regional split, or shared-entity relation is added.

## Result

```text
Entities: 979
Events:   1018
Evidence: 3732
Remaining to D-1000: 21
```

The next unused evidence ID is `hei_src_012429`.
