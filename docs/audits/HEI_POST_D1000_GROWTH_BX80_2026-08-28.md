# HEI post-D-1000 growth audit — BX80 — 2026-08-28

## Scope

Lane A canonical growth only. Adds Gibraltar Blockchain Exchange (GBX) as a reviewed historical CEX lifecycle record.

Base main: `6b08f992af0a2d0c6b2dc9203df9e0a4341add75`.

## Canonical reconciliation

Existing `records/exchanges/mine-digital.json` already records Mine Digital's acquisition of Global Blockchain Exchange on 2021-01-29. Its notes explicitly state that no predecessor/successor lineage edge is created because Mine Digital did not continue the GBX brand or platform technology.

BX80 therefore adds GBX as its own terminal exchange entity and links Mine Digital only as the event counterparty.

## Evidence review

1. 2018-07-23 public launch — contemporaneous CryptoNinjas report says GBX officially launched/opened its Digital Asset Exchange to public trading on that date.
2. 2018-11-22 DLT licence — Government of Gibraltar press release confirms the full GFSC DLT licence and identifies GBX as the GSX subsidiary / Digital Asset Exchange.
3. 2021-01-13 sale and closure schedule — first-party GBX/GSX notice announces sale to Mine Digital, deposit/new-registration shutdown, 2021-01-20 trading cessation, and 2021-01-29 GBX-DAX/account closure.
4. 2021-01-29 completion — first-party GBX/GSX notice confirms sale completion, GBX-DAX closure, withdrawal halt, account closure, and transfer of remaining eligible balances into the Mine Digital transition process.

## Modeling decision

- entity status: `acquired`
- death reason: `acquisition`
- death date: `2021-01-29`
- no successor/predecessor lineage edge
- acquisition is the terminal cause; same-day exchange closure is recorded in the acquisition event rather than reclassified as an unrelated voluntary shutdown
- no insolvency, scam, hack, or fraud inference

## ID allocation

From current main maxima after BX79:

- entity: `hei_ex_001178`
- events: `hei_ev_010206`–`hei_ev_010209`
- evidence: `hei_src_012710`–`hei_src_012713`

## Source-count check

- `hei_ev_010206`: 1 directly linked evidence
- `hei_ev_010207`: 1 directly linked evidence
- `hei_ev_010208`: 1 directly linked evidence
- `hei_ev_010209`: 1 directly linked evidence

## Delta

- +1 entity
- +4 events
- +4 evidence
- +0 lineage edges

## Boundaries

No schema, validator, monitoring, localization, Phase 9 production, or machine-readable contract changes are included.

If main advances before merge, BX80 must be replayed/re-IDed from the then-current main instead of merging stale IDs.
