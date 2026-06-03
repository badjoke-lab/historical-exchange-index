# Consumed backlog rows: exchange / DEX batch 10

Status: added

## Purpose

Batch-consume verified-unadded rows for five exchange / DEX records under the revised HEI record-addition workflow.

This batch prioritizes candidates with official domains and rows that can be consolidated cleanly by entity or protocol.

## Added records

| entity_id | record | path | consumed rows |
|---|---|---|---|
| `hei_ex_000403` | Blockchain.com | `records/exchanges/blockchain-com.json` | `hei_unadded_0364`, `hei_unadded_0366` |
| `hei_ex_000404` | Bluefin | `records/exchanges/bluefin.json` | `hei_unadded_0372`-`hei_unadded_0374` |
| `hei_ex_000405` | BlueMove | `records/exchanges/bluemove.json` | `hei_unadded_0375`-`hei_unadded_0377` |
| `hei_ex_000406` | Blueprint | `records/exchanges/blueprint.json` | `hei_unadded_0378` |
| `hei_ex_000407` | BounceBit Swap V3 | `records/exchanges/bouncebit-swap-v3.json` | `hei_unadded_0390` |

## Source confirmation

Rows were checked in `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl` before creation.

## Duplicate handling

### Blockchain.com

Consumed rows:

- `hei_unadded_0364` Blockchain.com
- `hei_unadded_0366` blockchaincom

Decision: create one `Blockchain.com` exchange entity and treat the CCXT `blockchaincom` row as an alias/source row.

Not consumed:

- `hei_unadded_0365` Blockchain.io

Decision: leave Blockchain.io unconsumed because it is a separate candidate and should not be merged into Blockchain.com without stronger evidence.

### Bluefin

Consumed rows:

- `hei_unadded_0372` Bluefin
- `hei_unadded_0373` Bluefin
- `hei_unadded_0374` Bluefin Spot

Decision: create one `Bluefin` protocol-level trading / DEX record and treat Bluefin Spot as a product/context row for v0.

### BlueMove

Consumed rows:

- `hei_unadded_0375` BlueMove
- `hei_unadded_0376` BlueMove
- `hei_unadded_0377` BlueMove DEX

Decision: create one `BlueMove` protocol-level DEX record.

### Blueprint

Consumed row:

- `hei_unadded_0378` Blueprint

Decision: create one `Blueprint` protocol seed record.

### BounceBit Swap V3

Consumed row:

- `hei_unadded_0390` BounceBit Swap V3

Decision: create one chain/version-specific DEX record because the source row is explicitly BounceBit-specific.

## Notes

- This batch intentionally avoids rows with no official domain or unclear identity.
- Blockchain.io is intentionally left unconsumed.
- Records in this batch should be improved later with stronger launch, licensing, migration, rebrand, shutdown, or operating-history evidence where available.

## Next action

Continue with remaining candidates:

- Blockchain.io after source review
- BL3P / Bittylicious if official-domain evidence is found
- Braziliex as inactive/dead if closure evidence is found
- Blue Planet / BLEX / BMX Classic AMM if scope and source quality are acceptable
- Next-range protocol rows after source review
