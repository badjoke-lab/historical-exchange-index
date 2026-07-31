# Consumed backlog — BX39 four reviewed exchange records

Status: consumed  
Date: 2026-07-31  
Milestone: D-1000 Reviewed Entity Milestone

## Added

```text
NBX            hei_ex_001072 active
Kinesis Money  hei_ex_001073 active
KoinBX         hei_ex_001074 active
Mudrex         hei_ex_001075 active
```

## Evidence allocation

```text
NBX            hei_src_012369–012370
Kinesis Money  hei_src_012371–012372
KoinBX         hei_src_012373–012374
Mudrex         hei_src_012375–012376
```

## Identity and status handling

- NBX is supported by a current Norwegian regulator entry and live independent NOK/EUR markets.
- Kinesis Money is supported by current first-party terms and live independent spot markets.
- KoinBX is retained conservatively at medium confidence; anomaly-marked market volume is not treated as quality evidence.
- Mudrex is assigned `Global` origin because current terms identify distinct Delaware, Indian, and Lithuanian entities serving users by jurisdiction.

## Rejected during review

- Buda.com was rejected after the alternate-slug record `buda-com` and prior reviewed PRs established existing entity `hei_ex_000054`.
- Orbix, Cryptal, CoinJar, ICRYPEX, Paymium, BTC Markets, and Paribu were rejected as existing reviewed records.
- No candidate was promoted solely from search-index absence or raw reported volume.

## Result

```text
Entities: 955
Events:   1014
Evidence: 3680
Remaining to D-1000: 45
```

The next unused event ID remains `hei_ev_010091`.
