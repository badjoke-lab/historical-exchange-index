# Consumed backlog rows: exchange batch 6

Status: added

## Purpose

Batch-consume verified-unadded rows for five centralized exchange records under the revised HEI record-addition workflow.

This batch prioritizes candidates with official domains and duplicate rows that can be consolidated cleanly. Binance US is handled separately from other Binance derivatives and market-specific rows.

## Added records

| entity_id | record | path | consumed rows |
|---|---|---|---|
| `hei_ex_000382` | Bitbaby | `records/exchanges/bitbaby.json` | `hei_unadded_0269` |
| `hei_ex_000383` | Bitbns | `records/exchanges/bitbns.json` | `hei_unadded_0271`, `hei_unadded_0272` |
| `hei_ex_000384` | bitcastle | `records/exchanges/bitcastle.json` | `hei_unadded_0274` |
| `hei_ex_000385` | Bitcointry | `records/exchanges/bitcointry.json` | `hei_unadded_0277`, `hei_unadded_0278` |
| `hei_ex_000386` | Binance US | `records/exchanges/binance-us.json` | `hei_unadded_0250`, `hei_unadded_0251`, `hei_unadded_0253` |

## Source confirmation

Rows were checked in `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl` before creation.

## Duplicate handling

### Bitbaby

Consumed row:

- `hei_unadded_0269` Bitbaby

Decision: create one `Bitbaby` centralized exchange record.

### Bitbns

Consumed rows:

- `hei_unadded_0271` Bitbns
- `hei_unadded_0272` BitBNS

Decision: create one `Bitbns` centralized exchange record.

### bitcastle

Consumed row:

- `hei_unadded_0274` bitcastle

Decision: create one `bitcastle` centralized exchange record.

### Bitcointry

Consumed rows:

- `hei_unadded_0277` Bitcointry
- `hei_unadded_0278` Bitcointry Exchange

Decision: create one `Bitcointry` centralized exchange record.

### Binance US

Consumed rows:

- `hei_unadded_0250` Binance US
- `hei_unadded_0251` Binance US
- `hei_unadded_0253` binanceus

Decision: create one `Binance US` centralized exchange record. Other Binance market-specific or derivatives rows are intentionally left for a later scope pass.

## Notes

- This batch intentionally avoids merging Binance US with Binance DEX, Binance Futures, Binance JEX, or CCXT market-specific derivatives rows.
- Records in this batch should be improved later with stronger launch, licensing, regulatory, or operating-history evidence where available.
- Rows with no official domain or unclear identity remain unconsumed.

## Next action

Continue with remaining candidates:

- Bilaxy
- BCEX
- BHEX
- Bibox
- Bidesk
- BitcoinVN
- BITCOIVA
- Bit.com Futures / Bit.com Spot
- Binance DEX / Binance Futures / Binance JEX rows as a separate careful grouping task
