# Consumed backlog — BX37 four reviewed exchange records

Status: consumed  
Date: 2026-07-29  
Milestone: D-1000 Reviewed Entity Milestone

## Added

```text
Netcoins      hei_ex_001064 active
Kanga Global  hei_ex_001065 active
Coinmerce     hei_ex_001066 active
Bitonic       hei_ex_001067 active
```

## Evidence allocation

```text
Netcoins      hei_src_012353–012354
Kanga Global  hei_src_012355–012356
Coinmerce     hei_src_012357–012358
Bitonic       hei_src_012359–012360
```

## BL3P transition handling

BL3P's existing shutdown event and evidence already document its December 2024 closure and transfer of remaining balances to Bitonic. BX37 keeps that transition event-only and does not add canonical predecessor or successor fields because the current lineage-application baseline is frozen.

## Rejected or held during review

- Existing reviewed exchanges were rejected through direct canonical-path reads rather than relying on search-index absence.
- IntentX and Polynomial were rejected as deprecated.
- LogX V2 and RubyDex were held for insufficient current activity support.
- Kriptomat was excluded because the service was in an orderly wind-down.
- Finst was held for a separate Anycoin Direct acquisition and lineage review.

## Result

```text
Entities: 947
Events:   1014
Evidence: 3664
Remaining to D-1000: 53
```

The next unused event ID remains `hei_ev_010091`.
