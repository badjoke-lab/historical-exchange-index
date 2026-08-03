# Consumed backlog — BX44 four reviewed exchange records

Status: consumed  
Date: 2026-08-03  
Milestone: D-1000 Reviewed Entity Milestone

## Added

```text
HKVAX      hei_ex_001092 active
HKbitEX    hei_ex_001093 active
DFX Labs   hei_ex_001094 active
EX.IO      hei_ex_001095 active
```

## Evidence allocation

```text
HKVAX      hei_src_012413–012414
HKbitEX    hei_src_012415–012416
DFX Labs   hei_src_012417–012418
EX.IO      hei_src_012419–012420
```

## Event allocation

No new lifecycle event is added. The next unused event ID remains `hei_ev_010095`.

## Status handling

All four entities are added as `active` at high confidence.

Each record is supported by a current first-party platform surface and the Hong Kong Securities and Futures Commission list of licensed virtual asset trading platforms. The SFC evidence is used for operator identity, platform identity, CE reference, licensing date, and current licensed-platform status, not as a performance or safety endorsement.

## Identity and overlap checks

Direct current-main name, path, domain, and historical commit checks found no reviewed HKVAX, HKbitEX, or EX.IO entity before drafting.

DFX Labs is not the existing DFX Finance decentralized protocol. DFX Labs uses the `dfx.hk` domain, is operated by DFX Labs Company Limited, and provides an account-based licensed Hong Kong virtual asset trading platform. The existing DFX Finance record represents an unrelated protocol identity.

No unsupported predecessor, successor, merger, acquisition, rebrand, regional split, or shared-entity relation is added.

## Result

```text
Entities: 975
Events:   1018
Evidence: 3724
Remaining to D-1000: 25
```

The next unused evidence ID is `hei_src_012421`.
