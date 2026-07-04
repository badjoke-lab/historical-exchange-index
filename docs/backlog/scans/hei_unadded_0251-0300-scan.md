# Scan: verified-unadded rows 0251-0300

Status: closed / all add-now and research rows resolved

## Integrity binding

- machine-readable scan: `docs/backlog/scans/hei_unadded_0251-0300-scan.json`
- source: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`
- source blob: `0b0f758137396cc0a21a4eb2c122b71c01b0b3c6`
- reviewed_at: `2026-07-05`

## Initial classification summary

| class | count |
|---|---:|
| add_now | 8 |
| needs_research | 16 |
| pending_thin | 16 |
| out_of_scope_or_duplicate | 10 |

## Batch 01 results

- `0270` Braziliex -> existing `hei_ex_000502`; no new record
- `0275` BTC-Alpha -> new `hei_ex_000599`
- `0297` BXH -> new `hei_ex_000600`

## Batch 02 results

- `0252` Blocktrade -> new `hei_ex_000601`
- `0278` BTCBOX -> new `hei_ex_000602`
- `0281` btcmarkets / BTC Markets -> existing `hei_ex_000039`; no new record
- `0288` Buda -> existing `hei_ex_000054` Buda.com; no new record
- `0295` BuyUcoin -> new `hei_ex_000604`

## Boundary review results

- `0287` BTSE Futures -> existing parent `hei_ex_000052`; no standalone product entity
- `0300` Bybit EU -> existing parent `hei_ex_000011`; regional platform represented under parent record and events

## Research cluster 03 results

- `0251` Blocktane -> `pending_thin`
- `0255` Blue Planet -> new `hei_ex_000605`
- `0260` BMEX -> `pending_thin`
- `0261` BMX Classic product row -> parent BMX Trade added as new `hei_ex_000610`; no standalone product entity

## Research cluster 04 results

- `0269` bopAMM -> parent Bebop added as new `hei_ex_000609`; no standalone product entity
- `0271` Brexily -> `pending_thin`
- `0272` BrownFi -> new `hei_ex_000606`
- `0279` BTCEX -> `pending_thin`

## Research cluster 05 results

- `0282` BTCMEX -> `pending_thin`
- `0283` BTCsquare -> `pending_thin`
- `0284` BtcTrade.im -> `pending_thin`
- `0289` Buenbit -> new `hei_ex_000607`; active with acquisition event
- `0294` BurrBear -> new `hei_ex_000608`; active DEX
- `0296` BW -> `pending_thin`

## Remaining add-now queue

None.

## Remaining needs-research queue

None.

## Pending thin

`0251`, `0254`, `0256`, `0259`-`0260`, `0262`-`0265`, `0268`, `0271`, `0273`-`0274`, `0276`-`0277`, `0279`-`0280`, `0282`-`0284`, `0285`-`0286`, `0290`, `0296`.

## Out of scope or product/version rows

- `0253` Bloom Trading Bot
- `0257` Blum
- `0258` Blur Bids
- `0266` BONKbot
- `0267` boop.fun
- `0291` Bullpen Prediction Markets
- `0292` BullX
- `0293` Bunni V2
- `0298` Bybit Spot
- `0299` Bybit Derivative Exchange

## Current range position

```text
range records:                 50
promoted add_now:               5
promoted research:              6
existing duplicate consumed:    5
boundary rows reviewed:         2
research cluster rows reviewed: 14
identity review rows resolved:   4
unresolved add_now:             0
unresolved needs_research:      0
pending_thin:                  24
out_of_scope_or_duplicate:     10
range status:                  closed
```

## Next step

Scan and process verified-unadded range 0301-0350, then continue reviewed growth until at least 550 entities.
