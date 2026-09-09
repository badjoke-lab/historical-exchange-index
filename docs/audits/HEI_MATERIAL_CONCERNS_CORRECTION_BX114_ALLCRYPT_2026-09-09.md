# HEI Material-Concerns Correction — BX114 AllCrypt — 2026-09-09

## Scope

This batch resolves the zero-evidence legacy record for `hei_ex_000215` (AllCrypt) under issue #857. No schema, workflow, validator, monitoring, Phase 9, or unrelated canonical changes are included.

## Findings

The reviewed material supports AllCrypt as a small altcoin-focused CEX operating from March 2014. A contemporaneous AllCrypt operator account stated on 2014-03-31 that the exchange was 30 days old, while same-day public exchange-listing posts show AllCrypt publicly available on 2014-03-01. The existing launch date is therefore retained.

A contemporaneous exchange-list tracking thread records that an AllCrypt blog post dated 2015-03-10 announced a planned shutdown for 2015-03-31 and instructed users to remove coins. Before that planned date, a reproduced AllCrypt site notice described a compromise associated with WordPress access, uploaded files, a drained BTC wallet, and a complete site shutdown while damage was assessed. A later technical postmortem corroborates the compromise path using AllCrypt's own explanation.

The existing `death_date: 2015-03-18` is not sufficiently supported as an exact permanent-closure day. Reviewed sources use dates around 2015-03-18 for reporting and postmortem publication, while the operator notice itself appears earlier and describes the site as down pending assessment. HEI therefore removes the exact death date rather than convert a publication date into a lifecycle fact.

## Canonical disposition

- `status: dead` — retained.
- `death_reason: hack` — retained as the immediate terminal interruption that took the service offline before the already announced 2015-03-31 closure.
- `launch_date: 2014-03-01` — retained.
- `death_date: 2015-03-18` -> `null`.
- `country_or_origin: Unknown` — retained.
- Added `shutdown_announced` event on 2015-03-10.
- Added `hack` event on 2015-03-16 with medium confidence; this event records the contemporaneous site-down/compromise marker, not a proven permanent-death date.

## Evidence boundaries

Community/forum material is used only where it preserves contemporaneous operator statements or contemporaneous exchange-list tracking. It is not treated as a regulatory or judicial finding. The technical Acunetix article is used as corroboration for the compromise mechanism. No allegation of fraud, insolvency, or intentional misappropriation is added to canonical data.

## Result

AllCrypt now has linked lifecycle evidence and no longer depends on an unsupported exact terminal date. The correction remains conservative: it records the announced closure plan and the intervening hack separately, while leaving the exact permanent-closure date unknown.
