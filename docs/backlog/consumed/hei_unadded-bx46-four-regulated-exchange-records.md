# Consumed backlog — BX46 four reviewed regulated exchange records

Status: consumed  
Date: 2026-08-05  
Milestone: D-1000 Reviewed Entity Milestone

## Added

```text
YAX        hei_ex_001101 active
Bixin.com  hei_ex_001102 active
Ofza       hei_ex_001103 active
MB.IO      hei_ex_001104 active
```

## Evidence allocation

```text
YAX        hei_src_012437–012438
Bixin.com  hei_src_012439–012440
Ofza       hei_src_012441–012442
MB.IO      hei_src_012443–012444
```

## Event allocation

No new lifecycle event is added. The next unused event ID remains `hei_ev_010099`.

## Status handling

All four entities are added as `active` at high confidence.

YAX and Bixin.com are supported by current first-party or parent-company service material and the Hong Kong Securities and Futures Commission licensed-platform list. Ofza and MB.IO are supported by current first-party operating surfaces and active Dubai Virtual Assets Regulatory Authority public-register entries.

The regulatory evidence is used for operator identity, platform identity, licence reference, licensed activities, issue date, and current register status, not as a performance or safety endorsement.

YAX and Bixin.com use `live_unverified` URL status because their main sites returned access-control responses during verification. Ofza and MB.IO use `live_verified` from directly reviewed first-party operating surfaces.

MB.IO uses `United Arab Emirates` for `country_or_origin` from the reviewed Dubai-licensed platform operator MBIO FZE. The Australian spot-product entity remains documented as an alias and jurisdiction-specific scope note rather than a second canonical exchange or lineage edge.

## Identity and overlap checks

Direct current-main name, path, domain, alias, and operator checks found no reviewed YAX, Bixin.com, Ofza, or MB.IO entity before drafting.

No unsupported predecessor, successor, merger, acquisition, rebrand, regional split, or shared-entity relation is added.

## Result

```text
Entities: 984
Events:   1022
Evidence: 3748
Remaining to D-1000: 16
```

Next unused identifiers:

```text
Entity:   hei_ex_001105
Event:    hei_ev_010099
Evidence: hei_src_012445
```
