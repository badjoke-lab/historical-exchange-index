# HEI material-concerns correction BX102 — 2026-09-03

Status: COMPLETE / bounded canonical evidence repair
Issue: #858
Scope: BITFRONT and Coinbase Pro only

## BITFRONT

Canonical entity `hei_ex_000128` already classified BITFRONT as a dead CEX with a 2023-03-31 terminal marker but contained no canonical events or evidence.

First-party source recovered:
- LINE Blockchain / Finschia, `[NOTICE] BITFRONT Exchange to Close`, 2022-11-28
- https://medium.com/lineblockchain/notice-bitfront-exchange-to-close-5a887f5402c2

The notice identifies BITFRONT as operated by LVC USA Inc., states that the termination process had begun, immediately ended new registrations and credit-card payments, and says all services would be fully ended by March 2023.

Canonical action:
- preserve entity status `dead`;
- preserve `death_reason: voluntary_shutdown`;
- preserve existing `death_date: 2023-03-31` rather than infer a different exact day from month-only first-party wording;
- add `hei_ev_010217` (`shutdown_announced`, 2022-11-28);
- add `hei_ev_010218` (`shutdown_effective`, 2023-03-31);
- add first-party evidence `hei_src_012760`–`hei_src_012761`.

## Coinbase Pro

Canonical entity `hei_ex_000159` already classified Coinbase Pro as `rebranded` but contained no canonical lifecycle events or evidence and used 2023-12-31 as a terminal marker.

First-party sources recovered:
- Coinbase, `Hello Advanced Trade, goodbye Coinbase Pro`, published 2022-06-22 and updated 2023-11-20
- https://www.coinbase.com/blog/hello-advanced-trade-goodbye-coinbase-pro
- Coinbase Help, `Transitioning from Coinbase Pro to Coinbase Advanced`
- https://help.coinbase.com/en/pro/managing-my-account/account-information/transitioning-to-advanced-trade

The 2022 Coinbase announcement establishes the intended sunset and replacement by Coinbase Advanced. Its 2023-11-20 update states that phased migration was complete, Coinbase Pro was no longer supported on web or mobile, and customers could no longer log in.

Canonical action:
- preserve `status: rebranded` and `death_reason: rebrand`;
- correct `death_date` from 2023-12-31 to 2023-11-20 because the first-party update establishes the effective support/login cutoff;
- add `hei_ev_010219` (`shutdown_announced`, 2022-06-22);
- add `hei_ev_010220` (`rebranded`, 2023-11-20);
- add first-party evidence `hei_src_012762`–`hei_src_012763`.

## Boundary

No new exchange entity is created. No schema, validator, workflow, or gate is changed. This batch only repairs lifecycle evidence and one terminal date where current first-party evidence is stronger than the existing proxy marker.
