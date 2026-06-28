# Consumed batch: verified-unadded 0101-0150 / batch 01

Status: promoted and resolved

Reviewed at: 2026-06-28

## Canonical entities

| candidate rows | canonical entity | result |
|---|---|---|
| `hei_unadded_0111`-`0112` | `hei_ex_000541` AutoShark | Added as `dead / voluntary_shutdown` with launch, May 2021 exploit, and March 2022 terminal-development announcement. |
| `hei_unadded_0116` | `hei_ex_000542` Axial | Added as an active Avalanche StableSwap DEX with exact launch and current activity evidence. |
| `hei_unadded_0124`-`0125` | `hei_ex_000543` BabyDogeSwap | Added once at protocol level with exact October 2022 launch and current first-party documentation. |
| `hei_unadded_0128` | existing `hei_ex_000068` Backpack Exchange | Strengthened without duplicate creation; corrected beta-launch month and added EU and BP milestones. |

## Batch output

- new entities: 3
- existing entities strengthened: 1
- new events: 8
- new evidence records: 17
- duplicate entities created: 0

## Modeling decisions

- AutoShark uses `dead / voluntary_shutdown` because the team explicitly stopped all platform development and described final redistribution and withdrawal arrangements.
- Backpack's first exchange launch is normalized to `2023-11-01` from first-party November 2023 history; the prior `2024-01-01` approximation is corrected.
- Backpack EU remains a regional expansion of Backpack Exchange rather than a separate entity.
- Axial remains active because current independent metrics show non-zero TVL, fees, revenue, and DEX volume.
- BabyDoge Algebra and duplicate database rows are represented by one BabyDogeSwap protocol entity.
- Balancer and Bancor deployment/version candidates remain attached to their existing canonical protocol records.

## Safety checks

- current JSONL candidate IDs, names, and slugs were rebound before classification
- exact canonical record paths were checked before creation
- event source counts match linked evidence
- duplicate and version rows were collapsed before entity creation
- no Cloudflare or deployment changes are included
