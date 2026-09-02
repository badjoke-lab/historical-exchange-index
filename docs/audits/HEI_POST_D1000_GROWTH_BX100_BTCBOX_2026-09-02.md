# HEI post-D1000 growth BX100 — BTCBOX restoration review — 2026-09-02

## Scope

Lane A lifecycle follow-up for existing canonical entity `hei_ex_000602` BTCBOX under issue #768.

No new exchange entity is created. The review is limited to the staged restoration of BTCBOX services after the 2026-01-29 full-service suspension.

## Current first-party evidence

BTCBOX's 2026-08-07 notice states that Japanese-yen withdrawal service would resume at 10:00 JST on 2026-08-10 after the operator confirmed that implemented safety and risk-reduction measures were functioning and the system was stable.

The same notice states that services still unavailable would be restored sequentially from September after the necessary checks were completed.

A review of the current BTCBOX official notice index on 2026-09-02 found later notices for individual crypto-asset deposit maintenance/resumption, but no first-party announcement establishing restoration of crypto withdrawals, exchange trading, or easy-buy service.

## Canonical decision

- keep entity status `limited`;
- add `hei_ev_010215` for the 2026-08-10 Japanese-yen withdrawal restoration;
- add first-party evidence `hei_src_012757`;
- update summary, notes, and `last_verified_at`;
- do not mark BTCBOX globally active;
- do not infer restoration of crypto withdrawals, exchange trading, or easy-buy service from the calendar reaching September.

## Evidence boundary

The 2026-08-07 first-party notice is sufficient to record the scheduled effective restoration of Japanese-yen withdrawals because it is a specific operator decision with an exact effective timestamp and no contrary later first-party notice was found during this review.

The remaining services stay unresolved until a first-party or equivalently strong post-effective source confirms restoration.

## IDs

- entity: existing `hei_ex_000602`
- event: `hei_ev_010215`
- evidence: `hei_src_012757`

## Source

- BTCBOX, `弊社一部サービスの再開時期について（日本円出金）`, 2026-08-07: `https://blog.btcbox.jp/?p=18784`
- BTCBOX official notice index reviewed 2026-09-02: `https://blog.btcbox.jp/archives/category/notice`
