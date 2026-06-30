# Consumed batch: verified-unadded 0151-0200 / batch 01

Status: promoted and resolved

Reviewed at: 2026-06-30

## Canonical entities

| candidate rows | canonical entity | result |
|---|---|---|
| `hei_unadded_0163` | `hei_ex_000566` BHEX | Added as `dead / regulation` with late-2018 launch history and the staged October 2021 permanent shutdown. |
| `hei_unadded_0167` | `hei_ex_000567` Bidesk | Added as `dead / regulation` with October 2019 launch history and the October 2021 permanent shutdown schedule. |
| `hei_unadded_0172`-`0173` | `hei_ex_000568` Bilaxy | Added once as an active CEX with April 2018 launch history, the August 2021 hot-wallet hack, and phased withdrawal restoration. |
| `hei_unadded_0176` | `hei_ex_000569` Binance DEX | Added as `dead / voluntary_shutdown` with April 2019 launch history, BEP-151 decommissioning, and the November 2024 Beacon Chain terminal marker. |

## Batch output

- new entities: 4
- new events: 9
- new evidence records: 17
- duplicate entities created: 0

## Modeling decisions

- BHEX uses `2021-10-23` as the final platform-access date. Earlier October dates remain staged trading and closure milestones in notes.
- Bidesk uses `regulation` because the operator's shutdown announcement tied the permanent closure to major policy and regulatory changes.
- Bilaxy remains active. The 2021 breach is represented as a critical hack event followed by phased withdrawal restoration rather than as a terminal exchange failure.
- Duplicate Bilaxy rows are collapsed into one entity.
- Binance DEX is separate from Binance.com because it was the native on-chain order-book venue on Binance Chain.
- Binance DEX uses `2024-11-19` as a conservative definitive terminal marker. The DEX module was disabled earlier under BEP-151, while the underlying Beacon Chain stopped processing new transactions on that date.
- Bibox was reviewed but not included in this batch because its official site remains live and its current operating state needs a separate active-side review.

## Safety checks

- current JSONL candidate IDs, names, and slugs were checked before promotion
- exact canonical record paths and ID ranges were checked before creation
- event source counts match linked evidence
- product and duplicate rows were collapsed before entity creation
- future or unsupported shutdown dates were not invented
- no Cloudflare or deployment changes are included
