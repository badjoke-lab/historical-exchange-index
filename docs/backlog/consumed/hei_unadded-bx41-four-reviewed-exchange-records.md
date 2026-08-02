# Consumed backlog — BX41 four reviewed exchange records

Status: consumed  
Date: 2026-08-02  
Milestone: D-1000 Reviewed Entity Milestone

## Added

```text
Orionx         hei_ex_001080 limited
Wallex         hei_ex_001081 active
Satoshi Tango  hei_ex_001082 active
Fiwind         hei_ex_001083 active
```

## Event allocation

```text
Orionx CMF regulatory action      hei_ev_010092
Wallex U.S. Treasury designation  hei_ev_010093
```

## Evidence allocation

```text
Orionx         hei_src_012386–012388
Wallex         hei_src_012389–012390
Satoshi Tango  hei_src_012391–012392
Fiwind         hei_src_012393–012394
```

## Rejected duplicate

```text
CryptoMKT / CryptoMarket
```

The initial CryptoMKT candidate was rejected after the permanent overlap validator matched it to existing canonical entity `hei_ex_000102` CryptoMarket through the shared `cryptomkt.com` domain and CryptoMarket identity. The duplicate record was removed and replaced with Wallex.

## Status handling

Orionx remains publicly reachable, but the Chilean CMF rejected Orionx SpA's relevant registration and authorization requests on 2026-06-26 and restricted new covered operations. It is therefore added as `limited`, without a death date or terminal event.

Wallex, Satoshi Tango, and Fiwind are added as `active`. Wallex's June 2026 U.S. Treasury designation is recorded as a regulatory event without inferring operational closure. Satoshi Tango and Fiwind receive high confidence from current first-party platforms and legal or registration disclosures.

## Identity and overlap checks

Direct canonical-path checks, base-canonical checks where relevant, and historical commit searches found no reviewed entity for the four final additions. No unsupported predecessor, successor, merger, acquisition, or rebrand relation is added.

## Result

```text
Entities: 963
Events:   1017
Evidence: 3698
Remaining to D-1000: 37
```

The next unused event ID is `hei_ev_010094`.
