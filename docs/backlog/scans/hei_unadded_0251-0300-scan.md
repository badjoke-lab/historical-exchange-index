# Scan: verified-unadded rows 0251-0300

Status: reviewed initial scan / add-now queue consumed

## Integrity binding

- machine-readable scan: `docs/backlog/scans/hei_unadded_0251-0300-scan.json`
- source: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`
- source blob: `0b0f758137396cc0a21a4eb2c122b71c01b0b3c6`
- reviewed_at: `2026-07-04`

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

## Remaining add-now queue

None.

## Needs-research queue

- `0251` Blocktane
- `0255` Blue Planet
- `0260` BMEX
- `0261` BMX Classic AMM
- `0269` bopAMM
- `0271` Brexily
- `0272` BrownFi
- `0279` BTCEX
- `0282` BTCMEX
- `0283` BTCsquare
- `0284` BtcTrade.im
- `0287` BTSE Futures
- `0289` Buenbit
- `0294` BurrBear
- `0296` BW
- `0300` Bybit EU

## Pending thin

`0254`, `0256`, `0259`, `0262`-`0265`, `0268`, `0273`-`0274`, `0276`-`0277`, `0280`, `0285`-`0286`, `0290`.

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
existing duplicate consumed:    3
unresolved add_now:             0
unresolved needs_research:     16
pending_thin:                  16
out_of_scope_or_duplicate:     10
range status:                  open
```

## Next step

Resolve BTSE Futures and Bybit EU identity boundaries, then process the remaining research rows in small evidence-backed batches.
