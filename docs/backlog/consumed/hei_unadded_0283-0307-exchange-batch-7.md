# Consumed backlog rows: exchange / DEX batch 7

Status: added

## Purpose

Batch-consume verified-unadded rows for five exchange / DEX records under the revised HEI record-addition workflow.

This batch prioritizes candidates with official domains and duplicate rows that can be consolidated cleanly.

## Added records

| entity_id | record | path | consumed rows |
|---|---|---|---|
| `hei_ex_000387` | BitDelta | `records/exchanges/bitdelta.json` | `hei_unadded_0283` |
| `hei_ex_000388` | Bitexlive | `records/exchanges/bitexlive.json` | `hei_unadded_0290`, `hei_unadded_0291` |
| `hei_ex_000389` | Bitflow | `records/exchanges/bitflow.json` | `hei_unadded_0296`, `hei_unadded_0297` |
| `hei_ex_000390` | BitGenie | `records/exchanges/bitgenie.json` | `hei_unadded_0299`, `hei_unadded_0300` |
| `hei_ex_000391` | BitKan | `records/exchanges/bitkan.json` | `hei_unadded_0307` |

## Source confirmation

Rows were checked in `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl` before creation.

## Duplicate handling

### BitDelta

Consumed row:

- `hei_unadded_0283` BitDelta

Decision: create one `BitDelta` centralized exchange record.

### Bitexlive

Consumed rows:

- `hei_unadded_0290` Bitexlive
- `hei_unadded_0291` Bitexlive

Decision: create one `Bitexlive` centralized exchange record.

### Bitflow

Consumed rows:

- `hei_unadded_0296` Bitflow
- `hei_unadded_0297` Bitflow

Decision: create one `Bitflow` protocol-level DEX record.

### BitGenie

Consumed rows:

- `hei_unadded_0299` BitGenie
- `hei_unadded_0300` BitGenie AMM

Decision: create one `BitGenie` protocol-level DEX record.

### BitKan

Consumed row:

- `hei_unadded_0307` BitKan

Decision: create one `BitKan` centralized exchange record.

## Notes

- This batch intentionally avoids thin rows with no official domain where possible.
- Records in this batch should be improved later with stronger launch, licensing, regulatory, rebrand, or operating-history evidence where available.
- Rows with no official domain or unclear identity remain unconsumed.

## Next action

Continue with remaining candidates:

- BITCOIVA
- BitGlobal
- Bithumb Singapore
- Bitinka
- BitMEX / BitMEX derivatives rows if not already present
- BitMart / BitMart Futures if not already present
- Bitrue / Bitrue Futures if not already present
