# Consumed backlog rows: exchange / DEX batch 12

Status: added

## Purpose

Batch-consume verified-unadded rows for five exchange / DEX records under the revised HEI record-addition workflow.

This batch prioritizes candidates with official domains and rows that can be consolidated cleanly by entity or protocol.

## Added records

| entity_id | record | path | consumed rows |
|---|---|---|---|
| `hei_ex_000413` | Butter.xyz | `records/exchanges/butter-xyz.json` | `hei_unadded_0426`-`hei_unadded_0428` |
| `hei_ex_000414` | BYDFi | `records/exchanges/bydfi.json` | `hei_unadded_0436`-`hei_unadded_0438` |
| `hei_ex_000415` | Byreal | `records/exchanges/byreal.json` | `hei_unadded_0439`, `hei_unadded_0440` |
| `hei_ex_000416` | Byte Exchange | `records/exchanges/byte-exchange.json` | `hei_unadded_0441` |
| `hei_ex_000417` | Camelot | `records/exchanges/camelot.json` | `hei_unadded_0446`-`hei_unadded_0450` |

## Source confirmation

Rows were checked in `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl` before creation.

## Duplicate handling

### Butter.xyz

Consumed rows:

- `hei_unadded_0426` Butter.xyz
- `hei_unadded_0427` Butter.xyz
- `hei_unadded_0428` Butter.xyz

Decision: create one `Butter.xyz` protocol-level DEX record and treat `butterxyz` / `butter-xyz` rows as one entity.

### BYDFi

Consumed rows:

- `hei_unadded_0436` BYDFi
- `hei_unadded_0437` BYDFi
- `hei_unadded_0438` BYDFi alternate spot row

Decision: create one `BYDFi` centralized exchange record and treat the spot row as an alternate source row.

### Byreal

Consumed rows:

- `hei_unadded_0439` Byreal
- `hei_unadded_0440` Byreal

Decision: create one `Byreal` DEX / exchange protocol record and consolidate CoinGecko and DefiLlama rows.

### Byte Exchange

Consumed row:

- `hei_unadded_0441` Byte Exchange

Decision: create one `Byte Exchange` centralized exchange seed record based on the official domain and CoinGecko source row.

### Camelot

Consumed rows:

- `hei_unadded_0446` Camelot
- `hei_unadded_0447` Camelot V2
- `hei_unadded_0448` Camelot V2
- `hei_unadded_0449` Camelot V3
- `hei_unadded_0450` Camelot V3

Decision: create one `Camelot` protocol-level DEX record and treat V2/V3 rows as variants rather than deployment-level records in v0.

## Notes

- This batch intentionally skips Bybit rows because Bybit is a large active CEX with multiple derivative / regional rows and should be handled as a separate thicker record.
- Thin rows between this batch's consumed ranges remain unconsumed for later review.
- Records in this batch should be improved later with stronger launch, jurisdiction, chain, version, or operating-history evidence where available.

## Next action

Continue after row `hei_unadded_0450`, while keeping Bybit-related rows separate for a dedicated record review.
