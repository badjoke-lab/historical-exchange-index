# Consumed backlog rows: exchange / DEX batch 11

Status: added

## Purpose

Batch-consume verified-unadded rows for five exchange / DEX records under the revised HEI record-addition workflow.

This batch prioritizes candidates with official domains and rows that can be consolidated cleanly by entity or protocol.

## Added records

| entity_id | record | path | consumed rows |
|---|---|---|---|
| `hei_ex_000408` | Bron Intents | `records/exchanges/bron-intents.json` | `hei_unadded_0393` |
| `hei_ex_000409` | BTC Trade UA | `records/exchanges/btc-trade-ua.json` | `hei_unadded_0397`, `hei_unadded_0398` |
| `hei_ex_000410` | BulbaSwap | `records/exchanges/bulbaswap.json` | `hei_unadded_0416`-`hei_unadded_0418` |
| `hei_ex_000411` | Butter.xyz | `records/exchanges/butter-xyz.json` | `hei_unadded_0426`-`hei_unadded_0428` |
| `hei_ex_000412` | BYDFi | `records/exchanges/bydfi.json` | `hei_unadded_0436`-`hei_unadded_0438` |

## Source confirmation

Rows were checked in `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl` before creation.

## Duplicate handling

### Bron Intents

Consumed row:

- `hei_unadded_0393` Bron Intents

Decision: create one `Bron Intents` protocol seed record.

### BTC Trade UA

Consumed rows:

- `hei_unadded_0397` BTC Trade UA
- `hei_unadded_0398` BTC Trade UA

Decision: create one `BTC Trade UA` centralized exchange record.

### BulbaSwap

Consumed rows:

- `hei_unadded_0416` Bulbaswap V2
- `hei_unadded_0417` BulbaSwap V2
- `hei_unadded_0418` BulbaSwap V3

Decision: create one `BulbaSwap` protocol-level DEX record and treat V2/V3 rows as variant/version context.

### Butter.xyz

Consumed rows:

- `hei_unadded_0426` Butter.xyz
- `hei_unadded_0427` Butter.xyz
- `hei_unadded_0428` Butter.xyz

Decision: create one `Butter.xyz` protocol-level DEX record.

### BYDFi

Consumed rows:

- `hei_unadded_0436` BYDFi
- `hei_unadded_0437` BYDFi
- `hei_unadded_0438` BYDFi (Spot)

Decision: create one `BYDFi` centralized exchange record and treat BYDFi Spot as product/context row for v0.

## Notes

- `Bulla` / `Bulla Exchange` was investigated in this pass but excluded after tool-side write blocking.
- `BTCC` was skipped because the candidate rows had active/inactive status tension and should be handled separately after evidence review.
- Records in this batch should be improved later with stronger launch, licensing, migration, rebrand, shutdown, or operating-history evidence where available.

## Next action

Continue with remaining candidates:

- Bulla / Bulla Exchange if write issue is resolved
- BTCC after active/inactive evidence review
- Bybit EU / BYDFi-related variants if scoped separately
- Byreal
- Byte Exchange
- Camelot / Camelot V2 / Camelot V3 as a protocol grouping
