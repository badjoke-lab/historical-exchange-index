# HEI Post-D1000 Growth BX100 — FYB-SG

Date: 2026-09-02
Lane: A / canonical exchange growth
Source issue: #819

## Decision

Promote FYB-SG as a distinct inactive centralized exchange entity.

- canonical entity: `hei_ex_001191`
- canonical name: `FYB-SG`
- type: `cex`
- status: `inactive`
- death_reason: `voluntary_shutdown`
- exact launch_date: unknown
- exact death_date: unknown
- country_or_origin: `Singapore`

FYB-SE remains a separate unresolved sister-exchange candidate and is not collapsed into FYB-SG.

## Identity and operating scope

Contemporary Business Times reporting identifies FYB-SG as a Singapore exchange and quotes founder Luv Khemani. Historical exchange directories describe FYB-SG as a centralized BTC/SGD venue at `fybsg.com`.

## Terminal state

Cryptowisser's dated 2019-02-26 update reproduces the message displayed on FYB-SG's website stating that the exchange was ceasing operations due to bank account closure. A historical Bitcointalk thread independently reproduces the same first-party wording.

This supports `inactive` plus `voluntary_shutdown`. It does **not** establish an exact effective shutdown date. The canonical `death_date` therefore remains null.

Event `hei_ev_010215` is modeled as `shutdown_announced` on 2019-02-26, the dated observation of the closure notice, rather than as `shutdown_effective`.

## Evidence

- `hei_src_012757` — The Business Times — contemporary identity/origin evidence.
- `hei_src_012758` — Cryptowisser — dated reproduction of FYB-SG's closure notice.
- `hei_src_012759` — Bitcointalk — low-reliability corroboration reproducing the same notice.
- `hei_src_012760` — Blockspot — current inactive/dead-domain historical profile.

## Conservative boundaries

- No exact launch date is asserted from a year-only directory claim.
- No exact shutdown date is inferred from the date a closure notice was observed.
- Bank-account closure is retained as the stated operational reason for the voluntary cessation; no insolvency, fraud, hack, or regulatory shutdown is inferred.
- FYB-SE is not merged into FYB-SG.

## Backlog disposition

Issue #819 covered both FYB-SG and FYB-SE. BX100 resolves FYB-SG only. #819 should remain open until FYB-SE is separately resolved or explicitly dispositioned.
