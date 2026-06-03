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
| `hei_ex_000410` | BTCC | `records/exchanges/btcc.json` | `hei_unadded_0403`, `hei_unadded_0404` |
| `hei_ex_000411` | BulbaSwap | `records/exchanges/bulbaswap.json` | `hei_unadded_0416`-`hei_unadded_0418` |
| `hei_ex_000412` | Bulla Exchange | `records/exchanges/bulla-exchange.json` | `hei_unadded_0419`, `hei_unadded_0420` |

## Source confirmation

Rows were checked in `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl` before creation.

## Duplicate handling

### Bron Intents

Consumed row:

- `hei_unadded_0393` Bron Intents

Decision: create one `Bron Intents` exchange/protocol seed record.

### BTC Trade UA

Consumed rows:

- `hei_unadded_0397` BTC Trade UA
- `hei_unadded_0398` BTC Trade UA

Decision: create one `BTC Trade UA` centralized exchange record.

### BTCC

Consumed rows:

- `hei_unadded_0403` BTCC
- `hei_unadded_0404` BTCC

Decision: create one `BTCC` centralized exchange record. CoinPaprika and CoinGecko source rows disagree on inactive/active status, so status remains active with notes pending deeper historical segmentation.

### BulbaSwap

Consumed rows:

- `hei_unadded_0416` Bulbaswap V2
- `hei_unadded_0417` BulbaSwap V2
- `hei_unadded_0418` BulbaSwap V3

Decision: create one `BulbaSwap` protocol-level DEX record and treat V2/V3 rows as variants.

### Bulla Exchange

Consumed rows:

- `hei_unadded_0419` Bulla
- `hei_unadded_0420` Bulla Exchange

Decision: create one `Bulla Exchange` protocol-level DEX record and treat Bulla as an alias/context row.

## Notes

- This batch intentionally avoids rows with no official domain or unclear identity.
- Braziliex and other inactive/dead-looking rows are left for stronger evidence review rather than thin active-style seed insertion.
- Records in this batch should be improved later with stronger launch, licensing, chain, shutdown, or operating-history evidence where available.

## Next action

Continue with remaining candidates:

- Braziliex as inactive/dead if closure evidence is found
- BrownFi after official-domain/source review
- BTC-Alpha / BTCBOX / BTCMEX if official-domain evidence is found
- Buda / Buenbit / BTSE Futures after source review
- BunSwap / BurrBear / Butter after next-range DEX review
