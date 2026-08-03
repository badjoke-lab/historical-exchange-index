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

## Final evidence allocation

```text
Accumulus     hei_src_012424–012425
PantherTrade  hei_src_012426–012427
BGE           hei_src_012428–012429
VDX           hei_src_012430–012431
```

PR #720 merged during BX45 validation and allocated `hei_src_012421–012423` to BTCBOX. BX45 evidence was therefore moved to the next collision-free range without changing its claims or sources.

## Event allocation

BX45 adds no lifecycle event. PR #720 allocated `hei_ev_010095–010096`; the next unused event ID is `hei_ev_010097`.

## Status and identity handling

All four entities are `active` at high confidence, supported by current first-party operating or licensing surfaces and the Hong Kong SFC licensed VATP list. Direct name, path, domain, and historical checks found no reviewed overlap.

## Final result

```text
Entities: 979
Events:   1020
Evidence: 3735
Remaining to D-1000: 21
```

The next unused evidence ID is `hei_src_012432`.
