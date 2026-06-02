# Consumed backlog rows: exchange batch 8

Status: added

## Purpose

Batch-consume verified-unadded rows for five centralized exchange records under the revised HEI record-addition workflow.

This batch prioritizes candidates with official domains and duplicate rows that can be consolidated cleanly.

## Added records

| entity_id | record | path | consumed rows |
|---|---|---|---|
| `hei_ex_000392` | Bitlo | `records/exchanges/bitlo.json` | `hei_unadded_0310` |
| `hei_ex_000393` | BitMart | `records/exchanges/bitmart.json` | `hei_unadded_0311`, `hei_unadded_0312` |
| `hei_ex_000394` | BitStorage | `records/exchanges/bitstorage.json` | `hei_unadded_0329`, `hei_unadded_0330` |
| `hei_ex_000395` | Bittime | `records/exchanges/bittime.json` | `hei_unadded_0334` |
| `hei_ex_000396` | BitTrade | `records/exchanges/bittrade.json` | `hei_unadded_0335`, `hei_unadded_0336` |

## Source confirmation

Rows were checked in `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl` before creation.

## Duplicate handling

### Bitlo

Consumed row:

- `hei_unadded_0310` Bitlo

Decision: create one `Bitlo` centralized exchange record.

### BitMart

Consumed rows:

- `hei_unadded_0311` BitMart
- `hei_unadded_0312` BitMart

Decision: create one `BitMart` centralized exchange record.

Public-site check before this PR showed `bitmar` matched `BitMarket` and `BitMarket.eu`, not `BitMart`, so this was not treated as an existing public duplicate.

### BitStorage

Consumed rows:

- `hei_unadded_0329` BitStorage
- `hei_unadded_0330` BitStorage

Decision: create one `BitStorage` centralized exchange record.

### Bittime

Consumed row:

- `hei_unadded_0334` Bittime

Decision: create one `Bittime` centralized exchange record.

### BitTrade

Consumed rows:

- `hei_unadded_0335` bittrade
- `hei_unadded_0336` BitTrade / Huobi Japan

Decision: create one `BitTrade` centralized exchange record and treat the Huobi Japan source row as an alias/context row for v0.

## Notes

- Bittrex is intentionally not included in this batch because it has major closure/bankruptcy/regulatory history and should be handled as a thicker standalone or carefully researched record.
- Records in this batch should be improved later with stronger launch, licensing, regulatory, rebrand, hack, shutdown, or operating-history evidence where available.
- Rows with no official domain or unclear identity remain unconsumed.

## Next action

Continue with remaining candidates:

- Bittrex as a thicker event-backed record
- BitGlobal
- Bithumb Singapore
- Bitinka
- BitMEX / BitMEX derivatives rows if not already present
- BitMart Futures if scoped separately
- Bitrue / Bitrue Futures
