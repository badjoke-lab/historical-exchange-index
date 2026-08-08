# Consumed backlog — BX49 four reviewed Kazakhstan exchange records

Status: consumed  
Date: 2026-08-09  
Milestone: D-1000 Reviewed Entity Milestone

## Added

```text
ATAIX Eurasia  hei_ex_001113 active
DeltaDA        hei_ex_001114 active
CaspianEx      hei_ex_001115 active
Intebix        hei_ex_001116 limited
```

## Evidence allocation

```text
ATAIX Eurasia  hei_src_012462–012463
DeltaDA        hei_src_012464–012465
CaspianEx      hei_src_012466–012467
Intebix        hei_src_012468–012469
```

No new event IDs are consumed in BX49. The next unused event ID remains `hei_ev_010101`.

## Status handling

ATAIX Eurasia, DeltaDA, and CaspianEx are added as `active` at high confidence from current first-party operating surfaces and current AFSA public-register records.

Intebix is added as `limited` at high confidence. Its current first-party surface remains online but states that infrastructure upgrade work is underway and that trading and balance operations are temporarily unavailable. AFSA continues to list its Digital Asset Trading Facility licence as active through 2026-09-01.

CaspianEx's public footer retains an older FinTech Lab expiry date; AFSA's current register lists the relevant Top Line Limited trading-facility licence as active through 2026-12-31. The regulator's current status is used for HEI classification.

No exact platform launch date is inferred solely from licence dates.

## Identity and overlap checks

Direct current-main name and domain searches found no reviewed record for:

```text
ATAIX Eurasia / ataix.kz
DeltaDA / deltada.kz
CaspianEx / caspianex.com
Intebix / intebix.kz
```

No unsupported predecessor, successor, merger, acquisition, rebrand, or shared-entity relationship is added. In particular, historical Biteeu/Intebix lineage is not asserted in this batch without reviewed first-party identity evidence.

## Result

```text
Entities: 996
Events:   1024
Evidence: 3773
Remaining to D-1000: 4
```

Next unused identifiers:

```text
Entity:   hei_ex_001117
Event:    hei_ev_010101
Evidence: hei_src_012470
```
