# Consumed backlog rows: DEX / exchange batch 9

Status: added

## Purpose

Batch-consume verified-unadded rows for five DEX/exchange-like records under the revised HEI record-addition workflow.

This batch prioritizes candidates with domain references and rows that can be consolidated cleanly by protocol/version.

## Added records

| entity_id | record | path | consumed rows |
|---|---|---|---|
| `hei_ex_000398` | Bitzy | `records/exchanges/bitzy.json` | `hei_unadded_0343` |
| `hei_ex_000399` | Blackhole | `records/exchanges/blackhole.json` | `hei_unadded_0347`-`hei_unadded_0350` |
| `hei_ex_000400` | BladeSwap | `records/exchanges/bladeswap.json` | `hei_unadded_0351`-`hei_unadded_0353` |
| `hei_ex_000401` | BlasterSwap | `records/exchanges/blasterswap.json` | `hei_unadded_0354`-`hei_unadded_0356` |
| `hei_ex_000402` | BlazeSwap (Flare) | `records/exchanges/blazeswap-flare.json` | `hei_unadded_0357` |

## Source confirmation

Rows were checked in `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl` before creation.

## Duplicate handling

### Bitzy

Consumed row:

- `hei_unadded_0343` Bitzy

Decision: create one low-confidence exchange-like seed record.

### Blackhole

Consumed rows:

- `hei_unadded_0347` Blackhole AMM
- `hei_unadded_0348` Blackhole CLMM
- `hei_unadded_0349` Blackhole V3
- `hei_unadded_0350` Blackhole V3

Decision: create one `Blackhole` protocol-level DEX record and treat AMM, CLMM, and V3 rows as variant/context rows for v0.

### BladeSwap

Consumed rows:

- `hei_unadded_0351` BladeSwap
- `hei_unadded_0352` BladeSwap AMM
- `hei_unadded_0353` BladeSwap CL

Decision: create one `BladeSwap` protocol-level DEX record and treat AMM/CL rows as variants.

### BlasterSwap

Consumed rows:

- `hei_unadded_0354` BlasterSwap
- `hei_unadded_0355` Blasterswap V2
- `hei_unadded_0356` Blasterswap V3

Decision: create one `BlasterSwap` protocol-level DEX record and treat V2/V3 rows as variants.

### BlazeSwap (Flare)

Consumed row:

- `hei_unadded_0357` BlazeSwap (Flare)

Decision: create one Flare ecosystem DEX record. Chain-specific naming is kept because the source row is explicitly chain-specific.

## Notes

- This batch intentionally avoids rows with no official domain or unclear identity.
- Bitzy is lower confidence than the DEX protocol records and should be upgraded later with stronger official/operating evidence.
- Records in this batch should be improved later with stronger launch, migration, rebrand, shutdown, or operating-history evidence where available.

## Next action

Continue with remaining candidates:

- Blockchain.com / blockchaincom rows as a careful CEX/entity grouping
- BL3P / Bittylicious if official-domain evidence is found
- BLEX / derivatives rows if scope allows
- BlueMove / Bluefin / other next-range protocol rows after source review
