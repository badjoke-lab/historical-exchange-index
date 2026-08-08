# Consumed backlog — BX50 D-1000 milestone exchange records

Status: consumed  
Date: 2026-08-09  
Milestone: D-1000 Reviewed Entity Milestone

## Added

```text
SINEGY         hei_ex_001117 active
KDX            hei_ex_001118 active
Samuel Kripto  hei_ex_001119 active
Nanovest       hei_ex_001120 active
```

## Evidence allocation

```text
SINEGY         hei_src_012470–012471
KDX            hei_src_012472–012473
Samuel Kripto  hei_src_012474–012475
Nanovest       hei_src_012476–012477
```

No new event IDs are consumed in BX50. The next unused event ID remains `hei_ev_010102`.

## Status handling

All four records are added as `active` at high confidence.

SINEGY and KDX are current Malaysian Digital Asset Exchanges supported by first-party operating surfaces and the Securities Commission Malaysia registered-DAX list updated 2026-07-20.

KDX is the continuing Malaysian operator Kinetic DAX Sdn. Bhd., formerly Tokenize Technology (M) Sdn. Bhd. The former Malaysian brand is preserved as an alias rather than counted as a second entity. BX50 does not infer identity with separate non-Malaysian Tokenize operators.

Samuel Kripto is supported by its current first-party trading platform, OJK business licence KEP-8/D.07/2025, and current Indonesian exchange-member material. The former Vonix app name is retained as an alias rather than a separate entity.

Nanovest is supported by its current first-party crypto trading surface and OJK provider identification for PT Tumbuh Bersama Nano. HEI records only Nanovest's centralized crypto trading function; the platform's foreign-stock and digital-gold products are outside the exchange classification.

## Identity and overlap checks

Direct current-main name, alias, and domain searches found no reviewed record for:

```text
SINEGY / sinegy.com
KDX / kdx.com.my / Kinetic DAX
Samuel Kripto / samuelkripto.com / Vonix
Nanovest / nanovest.io
```

No unsupported predecessor, successor, merger, acquisition, or cross-jurisdiction shared-entity relationship is added.

## Projected result

```text
Entities: 1000
Events:   1025
Evidence: 3781
Remaining to D-1000: 0
```

Next unused identifiers:

```text
Entity:   hei_ex_001121
Event:    hei_ev_010102
Evidence: hei_src_012478
```

D-1000 is not declared complete by this staging note alone. Completion requires reviewed merge to `main` and the milestone completion checkpoint under public-build count semantics.
