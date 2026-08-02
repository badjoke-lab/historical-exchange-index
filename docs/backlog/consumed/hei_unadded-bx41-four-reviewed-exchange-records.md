# Consumed backlog — BX41 four reviewed exchange records

Status: consumed  
Date: 2026-08-02  
Milestone: D-1000 Reviewed Entity Milestone

## Added

```text
Orionx         hei_ex_001080 limited
CryptoMKT      hei_ex_001081 active
Satoshi Tango  hei_ex_001082 active
Fiwind         hei_ex_001083 active
```

## Event allocation

```text
Orionx CMF regulatory action  hei_ev_010092
```

## Evidence allocation

```text
Orionx         hei_src_012386–012388
CryptoMKT      hei_src_012389–012390
Satoshi Tango  hei_src_012391–012392
Fiwind         hei_src_012393–012394
```

## Status handling

Orionx remains publicly reachable, but the Chilean CMF rejected Orionx SpA's relevant registration and authorization requests on 2026-06-26 and restricted new covered operations. It is therefore added as `limited`, without a death date or terminal event.

CryptoMKT, Satoshi Tango, and Fiwind are added as `active`. CryptoMKT receives medium confidence because its independent exchange listing does not track current volume. Satoshi Tango and Fiwind receive high confidence from current first-party platforms and legal or registration disclosures.

## Identity and overlap checks

Direct canonical-path checks and historical commit searches found no reviewed entity for the four final additions. No unsupported predecessor, successor, merger, acquisition, or rebrand relation is added.

## Result

```text
Entities: 963
Events:   1016
Evidence: 3698
Remaining to D-1000: 37
```

The next unused event ID is `hei_ev_010093`.
