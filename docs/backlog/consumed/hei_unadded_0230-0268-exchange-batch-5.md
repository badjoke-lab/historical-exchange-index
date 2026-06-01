# Consumed backlog rows: exchange / DEX batch 5

Status: added

## Purpose

Batch-consume verified-unadded rows for five exchange / DEX records under the revised HEI record-addition workflow.

This batch prioritizes candidates with official domains and duplicate rows that can be consolidated cleanly.

## Added records

| entity_id | record | path | consumed rows |
|---|---|---|---|
| `hei_ex_000377` | BEX | `records/exchanges/bex.json` | `hei_unadded_0230`, `hei_unadded_0231` |
| `hei_ex_000378` | Bifrost Swap | `records/exchanges/bifrost-swap.json` | `hei_unadded_0237`, `hei_unadded_0238` |
| `hei_ex_000379` | Biswap | `records/exchanges/biswap.json` | `hei_unadded_0258`-`hei_unadded_0260` |
| `hei_ex_000380` | Bit2C | `records/exchanges/bit2c.json` | `hei_unadded_0265`, `hei_unadded_0266` |
| `hei_ex_000381` | Bitazza | `records/exchanges/bitazza.json` | `hei_unadded_0268` |

## Source confirmation

Rows were checked in `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl` before creation.

## Duplicate handling

### BEX

Consumed rows:

- `hei_unadded_0230` BEX
- `hei_unadded_0231` BEX

Decision: create one `BEX` Berachain ecosystem DEX record.

### Bifrost Swap

Consumed rows:

- `hei_unadded_0237` Bifrost DEX
- `hei_unadded_0238` Bifrost Swap

Decision: create one `Bifrost Swap` DEX record.

### Biswap

Consumed rows:

- `hei_unadded_0258` Biswap
- `hei_unadded_0259` Biswap
- `hei_unadded_0260` Biswap V2

Decision: create one `Biswap` protocol-level DEX record.

### Bit2C

Consumed rows:

- `hei_unadded_0265` Bit2c
- `hei_unadded_0266` Bit2C

Decision: create one `Bit2C` centralized exchange record.

### Bitazza

Consumed row:

- `hei_unadded_0268` Bitazza

Decision: create one `Bitazza` centralized exchange record.

## Notes

- This batch intentionally avoids thin rows with no official domain where possible.
- BEX, Bifrost Swap, Biswap, Bit2C, and Bitazza should be improved later with more precise launch, licensing, rebrand, or operating-history events where available.
- Binance-related rows in this range should be handled separately because they require more careful grouping and existing-major-exchange scope decisions.

## Next action

Continue with remaining candidates:

- Binance US / Binance derivatives rows, if scope allows and duplicate handling is planned carefully
- Bilaxy
- Bitbns
- bitcastle
- Bitcointry
- BCEX / BHEX / Bibox / Bidesk after source review
