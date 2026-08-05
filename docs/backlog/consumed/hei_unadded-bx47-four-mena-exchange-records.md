# Consumed backlog — BX47 four reviewed MENA exchange records

Status: consumed  
Date: 2026-08-05  
Milestone: D-1000 Reviewed Entity Milestone

## Added

```text
Yhego      hei_ex_001105 active
CoinMENA   hei_ex_001106 active
Fasset     hei_ex_001107 active
MidChains  hei_ex_001108 active
```

## Evidence allocation

```text
Yhego      hei_src_012445–012446
CoinMENA   hei_src_012447–012449
Fasset     hei_src_012450–012451
MidChains  hei_src_012452–012453
```

## Event allocation

```text
CoinMENA   hei_ev_010099 regulatory_action 2026-06-22
```

The next unused event ID is `hei_ev_010100`.

## Status handling

All four entities are added as `active` at high confidence.

Yhego is supported by its active VARA exchange-services and broker-dealer register entry. Its site returned an access-control response and is therefore `live_unverified` rather than treated as dead or inactive.

CoinMENA, Fasset, and MidChains are supported by current first-party operating surfaces and active VARA entries. CoinMENA's June 2026 VARA fine is retained as a reviewed regulatory-action event without changing the entity from active because the regulator continues to list its licence as active.

Regulatory evidence is used for operator identity, platform identity, licence reference, licensed activities, conditions, issue date, and current status, not as a performance or safety endorsement.

## Identity and overlap checks

Direct current-main name, path, domain, alias, and operator checks found no reviewed Yhego, CoinMENA, Fasset, or MidChains entity before drafting.

No unsupported predecessor, successor, merger, acquisition, rebrand, regional split, or shared-entity relation is added.

## Result

```text
Entities: 988
Events:   1023
Evidence: 3757
Remaining to D-1000: 12
```

Next unused identifiers:

```text
Entity:   hei_ex_001109
Event:    hei_ev_010100
Evidence: hei_src_012454
```
