# Consumed backlog — BX49 four reviewed Kazakhstan exchange records

Status: consumed  
Date: 2026-08-09  
Milestone: D-1000 Reviewed Entity Milestone

## Added

```text
Swiftex    hei_ex_001113 limited
DeltaDA    hei_ex_001114 active
CaspianEx  hei_ex_001115 active
Intebix    hei_ex_001116 limited
```

## Evidence allocation

```text
Swiftex    hei_src_012462–012463
DeltaDA    hei_src_012464–012465
CaspianEx  hei_src_012466–012467
Intebix    hei_src_012468–012469
```

## Event allocation

```text
Swiftex    hei_ev_010101 regulatory_action 2026-05-05
```

The next unused event ID is `hei_ev_010102`.

## Status handling

DeltaDA and CaspianEx are added as `active` at high confidence from current first-party operating surfaces and current AFSA public-register records.

Swiftex is added as `limited` at high confidence. Its current public exchange surface remains online with account and exchange calls to action, while AFSA records its Digital Asset Trading Facility licence as withdrawn by participant effective 2026-05-05. The regulatory withdrawal is recorded as a reviewed event but is not converted into a terminal service shutdown.

Intebix is added as `limited` at high confidence. Its current first-party surface remains online but states that infrastructure upgrade work is underway and that trading and balance operations are temporarily unavailable. AFSA continues to list its Digital Asset Trading Facility licence as active through 2026-09-01.

CaspianEx's public footer retains an older FinTech Lab expiry date; AFSA's current register lists the relevant Top Line Limited trading-facility licence as active through 2026-12-31. The regulator's current status is used for HEI classification.

No exact platform launch date is inferred solely from licence dates.

## Duplicate rejection

ATAIX Eurasia was initially drafted as `hei_ex_001113` but rejected before merge because the permanent entity-overlap validator matched alias `ATAIX` against existing reviewed record `records/exchanges/ataix.json` (`hei_ex_000551`). BX49 does not split the regional ATAIX operator into a second reviewed entity.

## Identity and overlap checks

Direct current-main name and domain searches found no reviewed record for:

```text
Swiftex / swiftex.io
DeltaDA / deltada.kz
CaspianEx / caspianex.com
Intebix / intebix.kz
```

No unsupported predecessor, successor, merger, acquisition, rebrand, or shared-entity relationship is added. In particular, historical Biteeu/Intebix lineage is not asserted in this batch without reviewed first-party identity evidence.

## Result

```text
Entities: 996
Events:   1025
Evidence: 3773
Remaining to D-1000: 4
```

Next unused identifiers:

```text
Entity:   hei_ex_001117
Event:    hei_ev_010102
Evidence: hei_src_012470
```
