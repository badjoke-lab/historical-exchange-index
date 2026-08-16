# HEI AI-era Lifecycle Follow-up Pass — 2026-08-16

Status: reviewed follow-up audit / Stage G preparation

Authority:

- `docs/HEI_AI_ERA_PROVENANCE_LIFECYCLE_AUDIT_2026-08-15.md`
- `docs/HEI_AI_ERA_REGISTRY_SPEC.md`
- `docs/HEI_AI_ERA_EXECUTION_SCHEDULE.md`

This pass re-checks the bounded Stage B lifecycle backlog using current first-party and regulator/independent evidence where available. It does not convert scheduled future checkpoints into completed events and does not infer terminal states from ambiguous evidence.

## BTCBOX — post-partial-reopening follow-up

Current canonical record:

- status: `limited`
- 2026-08-03: login and crypto-asset deposits partially reopened
- crypto withdrawals, exchange trading and easy-buy remained unavailable
- Japanese-yen withdrawal restart was scheduled for 2026-08-10

New primary evidence reviewed:

- BTCBOX, 2026-08-07, `https://blog.btcbox.jp/archives/18784`

The 2026-08-07 first-party notice states that BTCBOX had confirmed stable operation of the reopened site and decided to restart Japanese-yen withdrawals at 10:00 JST on 2026-08-10. The same notice states that services still not reopened were undergoing safety checks and were expected to resume sequentially from September after verification.

Disposition:

- keep entity status `limited`;
- do not infer full exchange reopening;
- do not infer crypto withdrawal, exchange trading or easy-buy restoration;
- do not create a post-effective Japanese-yen-withdrawal event solely from the pre-effective 2026-08-07 schedule unless a post-effective first-party or equivalent operational confirmation is captured;
- retain the current limited state and continue the September service-restoration checkpoint.

This is an evidence-strengthening result rather than a terminal-state change.

## BitradeX — missing August primary release rules

The canonical August asset-release event remains deliberately conservative because its event mechanics are still supported only by a community report rather than the underlying first-party notice.

Current first-party Help Center review found active official platform material through July 2026, including current AiBot, referral, BXC and asset-management announcements, but did not recover the specific August asset-release notice or detailed rules described by the community report.

Representative first-party surfaces reviewed:

- `https://help.bitradex.ai/hc/en-001/articles/16404321161999-Announcement-from-BitradeX-on-AIBot-Strategy-Position-Control-and-Locking-in-Existing-Users-Rights`
- `https://help.bitradex.ai/hc/en-001/articles/16917231120015-Announcement-on-BitradeX-New-User-Referral-Season-Event`
- `https://help.bitradex.ai/hc/en-001/articles/15947763724175-BXC-Complete-Official-FAQ`

Disposition:

- do not strengthen the August asset-release mechanics without the missing primary source;
- do not assert referral-conditioned principal release from unrelated referral/BXC material;
- retain the current conservative `limited` status and medium-confidence event treatment;
- primary-source recovery remains unresolved.

## Shelbit — final-state ambiguity remains

Current reviewed evidence already captures the core contradiction:

- Shelbit stated that it had ceased operations in January 2026;
- VARA stated in July 2026 that the entity had continued unlicensed virtual-asset activity and ordered an immediate cease and desist;
- Reuters reported that the public website had been down for months and reactivated after the July 31 investigation, while also reporting Shelbit's January-cessation statement;
- U.S. sanctions followed in August 2026.

Current review does not supply a clean, non-contradictory terminal operating date.

Disposition:

- preserve `inactive`;
- preserve no death date / no death reason;
- do not promote the company statement into a terminal canonical fact while regulator and independent evidence conflict with it.

## HTX / EXMO — future effective-date checkpoint

The EU measure recorded in HEI takes effect on 2026-08-23. This review occurs on 2026-08-16.

Disposition:

- no implementation-effect event may be recorded before the effective date;
- global entity status remains `active`;
- re-check exchange-level implementation on or after 2026-08-23.

## Bitget — future Japan withdrawal checkpoints

The reviewed Bitget record already carries the scheduled Japan-specific close-only and forced-position-closure checkpoints:

- 2026-11-01 close-only stage;
- 2026-12-31 forced closure of remaining positions.

Disposition:

- no effective-state event before those dates;
- keep global entity status `active`;
- retain jurisdiction-specific follow-up dates.

## Stage G result for current-date work

As of 2026-08-16, the actionable lifecycle backlog has been re-reviewed without unsafe inference.

The result is intentionally asymmetric:

- BTCBOX gained stronger primary follow-up evidence but still lacks a reviewed post-effective confirmation for the 2026-08-10 Japanese-yen withdrawal restart;
- BitradeX still lacks the specific primary August release notice;
- Shelbit remains genuinely ambiguous and should stay `inactive`;
- HTX / EXMO and Bitget checkpoints are future-dated and cannot be completed early.

Stage G should therefore be closed as a **current-date reviewed follow-up pass with unresolved/future checkpoints retained**, not as a claim that every lifecycle story has permanently ended. Future evidence continues through normal Lane A review and monitoring.
