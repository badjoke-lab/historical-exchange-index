# Consumed backlog — BX43 four reviewed exchange records

Status: consumed  
Date: 2026-08-03  
Milestone: D-1000 Reviewed Entity Milestone

## Added

```text
Brasil Bitcoin  hei_ex_001088 active
Digitra.com     hei_ex_001089 active
Coinext         hei_ex_001090 active
Moneybees       hei_ex_001091 active
```

## Evidence allocation

```text
Brasil Bitcoin  hei_src_012403–012404
Digitra.com     hei_src_012405–012406
Coinext         hei_src_012407–012408
Moneybees       hei_src_012409–012410
```

## Event allocation

No new lifecycle event is added. The next unused event ID remains `hei_ev_010094`.

## Duplicate rejection

Bitypreco was rejected from BX43 because `records/exchanges/bitypreco.json` already represents the same continuing Bitpreco/Bitypreco identity as `hei_ex_000589`. Moneybees replaced it.

## Status handling

All four entities are added as `active` at high confidence.

Brasil Bitcoin, Digitra.com, and Coinext are supported by current first-party trading platforms and current legal terms defining centralized crypto purchase, sale, custody, transfer, order, or related exchange functions.

Moneybees is supported by its current first-party buy and sell service, online trading desk, OTC network, and customer terms defining virtual-currency purchase and sale through the operator and its partner outlets.

## Identity and overlap checks

Direct canonical-path checks, base canonical name/domain checks, and historical commit searches found no reviewed entity for the four additions. No unsupported predecessor, successor, merger, acquisition, or rebrand relation is added.

## Result

```text
Entities: 971
Events:   1017
Evidence: 3714
Remaining to D-1000: 29
```

The next unused evidence ID is `hei_src_012411`.
