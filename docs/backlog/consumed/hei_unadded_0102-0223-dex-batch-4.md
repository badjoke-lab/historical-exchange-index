# Consumed backlog rows: DEX/exchange batch 4

Status: added

## Purpose

Batch-consume verified-unadded rows for five exchange / DEX records under the revised HEI record-addition workflow.

This batch continues the post-scan workflow. Duplicate or closely related candidate rows are collapsed into one entity where appropriate.

## Added records

| entity_id | record | path | consumed rows |
|---|---|---|---|
| `hei_ex_000372` | Aquarius | `records/exchanges/aquarius.json` | `hei_unadded_0102`, `hei_unadded_0103` |
| `hei_ex_000373` | ArcherSwap | `records/exchanges/archerswap.json` | `hei_unadded_0112`, `hei_unadded_0113` |
| `hei_ex_000374` | Baryon Network | `records/exchanges/baryon-network.json` | `hei_unadded_0190`, `hei_unadded_0191` |
| `hei_ex_000375` | BeeZee DEX | `records/exchanges/beezee-dex.json` | `hei_unadded_0219` |
| `hei_ex_000376` | Bequant | `records/exchanges/bequant.json` | `hei_unadded_0223` |

## Source confirmation

Rows were checked in `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl` and scan memos before creation:

- `docs/backlog/scans/hei_unadded_0101-0150-scan.md`
- `docs/backlog/scans/hei_unadded_0151-0200-scan.md`

Rows from `hei_unadded_0201` onward were also inspected from the verified-unadded JSONL source before selecting BeeZee DEX and Bequant.

## Duplicate handling

### Aquarius

Consumed rows:

- `hei_unadded_0102` Aquarius
- `hei_unadded_0103` Aquarius Stellar

Decision: create one `Aquarius` protocol-level DEX record.

### ArcherSwap

Consumed rows:

- `hei_unadded_0112` ArcherSwap
- `hei_unadded_0113` Archerswap

Decision: create one `ArcherSwap` protocol-level DEX record.

### Baryon Network

Consumed rows:

- `hei_unadded_0190` Baryon Network
- `hei_unadded_0191` Baryon Network

Decision: create one `Baryon Network` protocol-level DEX record.

### BeeZee DEX

Consumed row:

- `hei_unadded_0219` BeeZee DEX

Decision: create one `BeeZee DEX` record.

### Bequant

Consumed row:

- `hei_unadded_0223` Bequant

Decision: create one low-confidence CEX seed record. Official domain was not confirmed during this pass and should be improved later.

## Notes

- Beam Swap (`hei_unadded_0206`) was investigated but excluded after tool-side write blocking.
- Aster remains a future candidate after prior write blocking.
- Bequant is thinner than the other records in this batch and should be upgraded with official-domain or history evidence later.

## Next action

Continue with remaining research candidates:

- Aster
- Beam Swap
- Azbit
- B2BX
- ATAIX
- ATOMARS
- AtomDax
- BCEX
- Beamex / Bean Exchange / other 0201-0250 rows after source review
