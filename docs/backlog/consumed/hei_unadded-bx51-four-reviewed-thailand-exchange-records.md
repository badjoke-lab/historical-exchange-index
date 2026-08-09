# Consumed backlog — BX51 reviewed Thailand exchange records

Status: consumed  
Date: 2026-08-09  
Lane: post-D-1000 canonical growth

## Added

```text
WAANX       hei_ex_001121 active
TDX         hei_ex_001122 active
Z.com EX    hei_ex_001123 active
Binance TH  hei_ex_001124 active
```

## Evidence allocation

```text
WAANX       hei_src_012478–012479
TDX         hei_src_012480–012481
Z.com EX    hei_src_012482–012483
Binance TH  hei_src_012484–012485
```

No new event IDs are consumed in BX51. The next unused event ID remains `hei_ev_010102`.

## Review basis

All four records are current Thai centralized digital-asset exchange operators supported by both current first-party operating material and the Thailand Securities and Exchange Commission's current Digital Asset Exchange license list.

The batch does not treat regulator licensing as an investment endorsement, does not infer exact launch dates from licensing or company-incorporation dates, and does not add trading-volume, solvency, security-quality, or custody-quality claims.

## Identity and overlap checks

Direct current-main record/path/name checks found no reviewed record for WAANX, TDX, Z.com EX, or Binance TH before this branch.

Orbix was initially considered for the same Thai-operator batch, but direct file creation detected the existing reviewed `records/exchanges/orbix.json` record (`hei_ex_001038`). Orbix was therefore excluded rather than duplicated.

Binance TH is recorded as a separate regional operator because Gulf Binance Co., Ltd. is a distinct Thai licensed joint-venture operator on `binance.th`; the existing global Binance record already preserves a boundary between Binance.com and separately operated regional entities.

## Projected reviewed result

```text
Entities: 1004
Events:   1025
Evidence: 3789
```

Next unused identifiers after BX51:

```text
Entity:   hei_ex_001125
Event:    hei_ev_010102
Evidence: hei_src_012486
```

These counts remain subject to the normal reviewed-public aggregation, identity-resolution, and validation semantics at merge time.
