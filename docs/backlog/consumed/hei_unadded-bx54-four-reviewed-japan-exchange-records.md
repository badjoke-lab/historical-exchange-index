# Consumed backlog — BX54 reviewed Japan exchange records

Status: consumed  
Date: 2026-08-09  
Lane: post-D-1000 canonical growth

## Added

```text
BITPOINT       hei_ex_001133 active
S.BLOX         hei_ex_001134 active
HashKey Japan  hei_ex_001135 active
BACKSEAT       hei_ex_001136 limited
```

## Event allocation

```text
BITPOINT       hei_ev_010103 operator merger / service remains active
HashKey Japan  hei_ev_010104 rebrand
BACKSEAT       hei_ev_010105 external deposit/withdrawal suspension
```

S.BLOX consumes no new event ID in this batch.

## Evidence allocation

```text
BITPOINT       hei_src_012503–012505
S.BLOX         hei_src_012506–012507
HashKey Japan  hei_src_012508–012510
BACKSEAT       hei_src_012511–012513
```

## Review basis

BITPOINT is supported by its current first-party trading site plus first-party merger-completion notices from both BITPOINT and SBI VC Trade. The former legal operator merged into SBI VC Trade on 2026-04-01, while the BITPOINT and VCTRADE customer-facing services remained distinct and available. The legal-company merger is therefore recorded as an event with `event_status_effect: active`, not as service death.

S.BLOX is supported by its current first-party crypto trading site and the current JVCEA member directory, which lists S.BLOX Inc. under Kanto Finance Bureau crypto-asset exchange registration No. 00016.

HashKey Japan is supported by its current first-party site, the first-party company-name change notice, and the current JVCEA member directory. The June 1, 2026 Tokyo Hash → HashKey Japan change was a company-name change only; the first-party notice states that legal identity, contracts, and services were unchanged.

BACKSEAT is supported by its current first-party exchange site, a 2026 first-party suspension notice, and the current JVCEA member directory. The exchange remains usable for crypto trading, but external crypto deposits/withdrawals and staking are suspended and the dealer-market service is unavailable; `limited` is therefore the conservative current status.

## Identity and scope controls

Direct current-main path checks found no reviewed BITPOINT, S.BLOX, HashKey Japan/Tokyo Hash, or BACKSEAT exchange record before BX54.

The batch does not treat every Japanese registered crypto-asset business as an HEI exchange. CoinTrade was reviewed and excluded from this batch because its own FAQ states that it currently provides only dealer-market sales rather than exchange-style trading. Registration alone is not sufficient for HEI inclusion.

HashKey Japan and Tokyo Hash are treated as one continuing entity rather than predecessor/successor entities because the first-party rebrand notice explicitly preserves the legal entity and services.

BITPOINT is treated as a continuing service identity after the operator-company merger because its current first-party site and merger notice explicitly preserve the BITPOINT service brand.

## Reviewed result

```text
Entities: 1016
Events:   1029
Evidence: 3817
```

Next unused identifiers after BX54:

```text
Entity:   hei_ex_001137
Event:    hei_ev_010106
Evidence: hei_src_012514
```

These counts remain subject to normal reviewed-public aggregation, identity-resolution, and validation semantics at merge time.
