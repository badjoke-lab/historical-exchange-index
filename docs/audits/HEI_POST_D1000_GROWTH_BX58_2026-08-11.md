# HEI Post-D-1000 Growth — BX58

Date: 2026-08-11
Status: reviewed batch candidate

## Scope

BX58 adds four independently reviewed decentralized trading entities:

- Arcus — `active`
- RISEx — `active`
- AnyHedge — `active`
- Verus Market — `active`

## Count impact

```text
Before BX58
Entities: 1025
Events:   1031
Evidence: 3836

After BX58
Entities: 1029
Events:   1031
Evidence: 3844
```

No canonical event is added in this batch.

## Review boundaries

- Arcus is one venue; `Arcus Perps` is an alias/product surface, not a separate entity.
- Extended Perps was reviewed and rejected from BX58 because `Extended` already exists canonically.
- RISEx is normalized as the RISE Chain exchange and does not invent an exact launch date.
- AnyHedge is recorded at protocol level as the peer-to-peer BCH derivatives venue; BCH Bull is not duplicated as a separate exchange in this batch.
- Verus Market is the protocol-level Verus AMM/conversion venue; the Verus-Ethereum Bridge is not duplicated as an exchange entity.
- Monitoring output is discovery-only and is not canonical evidence.

## Evidence standard

Each entity has a current first-party source and an independent current status/market-data source. Status is based on current trading availability or measurable current activity, not on the monitoring candidate label.

## Localization

L-2 remains `HOLD`. This reviewed canonical growth does not authorize broader translation or a third language.
