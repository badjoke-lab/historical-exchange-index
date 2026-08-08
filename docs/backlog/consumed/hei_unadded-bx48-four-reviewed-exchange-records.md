# Consumed backlog — BX48 four reviewed exchange records

Status: consumed  
Date: 2026-08-09  
Milestone: D-1000 Reviewed Entity Milestone

## Added

```text
LCT             hei_ex_001109 active
MANTRA Finance  hei_ex_001110 active
BurjX           hei_ex_001111 active
Matrix Exchange hei_ex_001112 dead
```

## Evidence allocation

```text
LCT             hei_src_012454–012455
MANTRA Finance  hei_src_012456–012457
BurjX           hei_src_012458–012459
Matrix Exchange hei_src_012460–012461
```

## Event allocation

```text
Matrix Exchange hei_ev_010100 shutdown_effective 2026-01-31
```

The next unused event ID is `hei_ev_010101`.

## Status handling

LCT, MANTRA Finance, and BurjX are added as `active` at high confidence from current first-party operating surfaces and current UAE regulatory-register records.

Matrix Exchange is added as `dead` with `voluntary_shutdown`. Matrix Limited's first-party wind-down notice states that its virtual-asset Multilateral Trading Facility would be permanently suspended on 2026-01-31 at 23:59:59 UTC. The later FSRA regulatory-withdrawal status is supporting evidence and is not substituted for the first-party service shutdown date.

No exact launch date is inferred from a licence or FSP issue date for the three active additions.

## Identity and overlap checks

Direct current-main name and domain searches found no reviewed LCT / lct.tech, MANTRA Finance / mantra.finance, BurjX / burjx.com, or Matrix Exchange / matrix.co record before drafting. Generic Matrix wording in product documentation was not treated as an entity match.

No unsupported predecessor, successor, merger, acquisition, rebrand, regional split, or shared-entity relation is added.

## Result

```text
Entities: 992
Events:   1024
Evidence: 3765
Remaining to D-1000: 8
```

Next unused identifiers:

```text
Entity:   hei_ex_001113
Event:    hei_ev_010101
Evidence: hei_src_012462
```
