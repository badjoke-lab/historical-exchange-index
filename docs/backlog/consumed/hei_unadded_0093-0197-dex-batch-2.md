> Correction: duplicate entity `hei_ex_000364` was removed and its useful event/evidence material was migrated to canonical `hei_ex_000068`. This memo remains as backlog-processing history.

# Consumed backlog rows: DEX/exchange batch 2

Status: added

## Purpose

Batch-consume verified-unadded rows for five exchange / DEX records under the revised HEI record-addition policy.

This batch continues the post-scan workflow and avoids one-row pending PRs. Duplicate or version-specific rows are collapsed into one entity where appropriate.

## Added records

| entity_id | record | path | consumed rows |
|---|---|---|---|
| `hei_ex_000362` | ApeSwap | `records/exchanges/apeswap.json` | `hei_unadded_0093`-`hei_unadded_0095` |
| `hei_ex_000363` | ApolloX | `records/exchanges/apollox.json` | `hei_unadded_0099`, `hei_unadded_0100` |
| `hei_ex_000364` | Backpack | `records/exchanges/backpack.json` | `hei_unadded_0170` |
| `hei_ex_000365` | BakerySwap | `records/exchanges/bakeryswap.json` | `hei_unadded_0171`, `hei_unadded_0172` |
| `hei_ex_000366` | BaseSwap | `records/exchanges/baseswap.json` | `hei_unadded_0194`-`hei_unadded_0197` |

## Source confirmation

Rows were checked in `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl` and scan memos before creation:

- `docs/backlog/scans/hei_unadded_0052-0100-scan.md`
- `docs/backlog/scans/hei_unadded_0101-0150-scan.md`
- `docs/backlog/scans/hei_unadded_0151-0200-scan.md`

## Duplicate handling

### ApeSwap

Consumed rows:

- `hei_unadded_0093` ApeSwap
- `hei_unadded_0094` ApeSwap BSC
- `hei_unadded_0095` ApeSwap AMM

Decision: create one `ApeSwap` protocol-level DEX record.

### ApolloX

Consumed rows:

- `hei_unadded_0099` ApolloX
- `hei_unadded_0100` ApolloX DEX

Decision: create one `ApolloX` hybrid exchange/protocol record unless future research proves separation is required.

### Backpack

Consumed row:

- `hei_unadded_0170` Backpack

Decision: create one active CEX seed record because an official exchange domain exists and the row comes from CCXT.

### BakerySwap

Consumed rows:

- `hei_unadded_0171` BakerySwap
- `hei_unadded_0172` BakerySwap

Decision: create one `BakerySwap` protocol-level DEX record.

### BaseSwap

Consumed rows:

- `hei_unadded_0194` BaseSwap V2
- `hei_unadded_0195` BaseSwap V2
- `hei_unadded_0196` BaseSwap V3
- `hei_unadded_0197` BaseSwap V3

Decision: create one `BaseSwap` protocol-level DEX record and avoid separate v2/v3 records in v0.

## Notes

- Aster was investigated in this pass but was excluded from the batch after repeated tool-side write blocking.
- Aster remains a future research/add candidate.
- Records in this batch should be improved later with stronger launch, incident, migration, licensing, or history evidence where available.

## Next action

Continue with remaining research candidates:

- Aster
- Arbswap
- ArcherSwap
- ArthSwap
- Balanced / Balanced Exchange
- Baryon Network
- Azbit / B2BX where CEX scope is accepted
