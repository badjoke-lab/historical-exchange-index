# Consumed backlog rows: DEX/exchange batch 3

Status: added

## Purpose

Batch-consume verified-unadded rows for five DEX/protocol records under the revised HEI record-addition policy.

This batch continues the post-scan workflow and avoids one-row pending PRs. Duplicate, branding, chain, and version-specific rows are collapsed into one entity where appropriate.

## Added records

| entity_id | record | path | consumed rows |
|---|---|---|---|
| `hei_ex_000367` | Balanced | `records/exchanges/balanced.json` | `hei_unadded_0173`, `hei_unadded_0174` |
| `hei_ex_000368` | Arbswap | `records/exchanges/arbswap.json` | `hei_unadded_0110` |
| `hei_ex_000369` | ArthSwap | `records/exchanges/arthswap.json` | `hei_unadded_0124`, `hei_unadded_0125` |
| `hei_ex_000370` | Beamswap | `records/exchanges/beamswap.json` | `hei_unadded_0208`-`hei_unadded_0211` |
| `hei_ex_000371` | Beets | `records/exchanges/beets.json` | `hei_unadded_0213`-`hei_unadded_0218` |

## Source confirmation

Rows were checked in `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl` and scan memos before creation:

- `docs/backlog/scans/hei_unadded_0101-0150-scan.md`
- `docs/backlog/scans/hei_unadded_0151-0200-scan.md`
- `docs/backlog/scans/hei_unadded_0052-0100-scan.md`

Rows from `hei_unadded_0201` onward were also inspected from the verified-unadded JSONL source before selecting Beamswap and Beets.

## Duplicate handling

### Balanced

Consumed rows:

- `hei_unadded_0173` Balanced
- `hei_unadded_0174` Balanced Exchange

Decision: create one `Balanced` protocol-level DEX record.

### Arbswap

Consumed row:

- `hei_unadded_0110` Arbswap

Decision: create one `Arbswap` DEX record.

### ArthSwap

Consumed rows:

- `hei_unadded_0124` ArthSwap
- `hei_unadded_0125` ArthSwap V3

Decision: create one `ArthSwap` protocol-level DEX record and avoid separate v3 records in v0.

### Beamswap

Consumed rows:

- `hei_unadded_0208` Beamswap
- `hei_unadded_0209` BeamSwap Classic
- `hei_unadded_0210` BeamSwap Stable AMM
- `hei_unadded_0211` BeamSwap V3

Decision: create one `Beamswap` protocol-level DEX record and treat variant/version rows as aliases or deployment context.

### Beets

Consumed rows:

- `hei_unadded_0213` Beethoven X (Optimism)
- `hei_unadded_0214` Beethoven X (Optimism)
- `hei_unadded_0215` Beets (Sonic)
- `hei_unadded_0216` Beets (Sonic)
- `hei_unadded_0217` Beets DEX
- `hei_unadded_0218` Beets DEX V3

Decision: create one `Beets` protocol-level DEX record and treat Beethoven X / Beets / chain/version rows as one consolidated entity for v0.

## Notes

- This batch intentionally avoids creating separate records for version, deployment, or chain-specific rows.
- Aster remains a future candidate after prior write blocking.
- Records in this batch should be improved later with stronger launch, migration, rebrand, or incident evidence where available.

## Next action

Continue with remaining research candidates:

- Aster
- ArcherSwap
- Baryon Network
- Azbit
- B2BX
- ATAIX
- ATOMARS
- AtomDax
- Beam Swap if separate from Beamswap after research
