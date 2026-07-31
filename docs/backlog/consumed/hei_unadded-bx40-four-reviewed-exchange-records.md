# Consumed backlog — BX40 four reviewed exchange records

Status: consumed  
Date: 2026-07-31  
Milestone: D-1000 Reviewed Entity Milestone

## Added

```text
INEX       hei_ex_001076 active
SAFEbit    hei_ex_001077 active
SecondBTC  hei_ex_001078 active
INX One    hei_ex_001079 active
```

## Event allocation

```text
SAFEbit rebrand  hei_ev_010091
```

## Evidence allocation

```text
INEX       hei_src_012377–012378
SAFEbit    hei_src_012379–012381
SecondBTC  hei_src_012382–012383
INX One    hei_src_012384–012385
```

## Continuity handling

SAFEbit and Bitci are treated as one continuing entity. The 2025 commercial-title change is recorded as an in-place `rebranded` event, without adding predecessor or successor fields.

Tothemoon was excluded because it is the continuing Cryptology platform after the 2024 rebrand. ALP.COM was excluded because it is already consolidated into BTC-Alpha.

## Existing records rejected during review

```text
Deepcoin
bitcastle
Websea
digitalexchange.id
HiBT
Emirex
Globe Exchange
Bitexlive
Bilaxy
Catex
FameEX
BTC-Alpha / ALP.COM
Cryptology / Tothemoon
```

## Result

```text
Entities: 959
Events:   1015
Evidence: 3689
Remaining to D-1000: 41
```

The next unused event ID is `hei_ev_010092`.
