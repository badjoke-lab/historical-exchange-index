# HEI Material Concerns Correction — BX109 CHBTC — 2026-09-08

## Scope

This batch repairs only `hei_ex_000271` (CHBTC) under the zero-evidence legacy-material-concerns work tracked by #857.

No schema, validator, workflow, monitoring, Phase 9, or unrelated canonical changes are included.

## Pre-repair state

The CHBTC record was already classified `rebranded` with successor `hei_ex_000290` (ZB.com), but it had no linked events or evidence. It also carried two exact dates that were not adequately tied to reviewed source evidence:

- `launch_date: 2013-06-01`
- `death_date: 2017-12-31`

The record notes explicitly described the latter as an end-of-year transition marker rather than an observed event date.

## Evidence review

### South China Morning Post — 2017-10-31

Contemporaneous reporting states that ZB.com was an overseas platform operated by Chinese digital-currency exchange CHBTC and that international trading would become available from 2017-11-01.

This supports service/brand continuity between CHBTC and ZB.com without requiring an inference of legal-entity dissolution.

### A5站长网 — 2017-11-02

Contemporaneous domain/platform reporting states that ZB.com formally went live on 2017-11-01 and that the new platform/domain replaced the original `chbtc.com` domain for the trading service.

This corroborates 2017-11-01 as an observable transition point.

## Canonical corrections

- preserve `status: rebranded`
- preserve `death_reason: rebrand`
- preserve successor `hei_ex_000290`
- change `launch_date` from `2013-06-01` to `null`; reviewed material supports 2013 / early-2013 operation but not that exact day
- change `death_date` from synthetic marker `2017-12-31` to documented transition date `2017-11-01`
- refresh summary, notes, and `last_verified_at`

## Canonical additions

- `hei_ev_010233` — CHBTC transitioned to the ZB.com overseas platform on 2017-11-01
- `hei_src_012781` — South China Morning Post contemporaneous report
- `hei_src_012782` — A5 contemporaneous ZB.com launch/domain-transition report

## Explicit non-inferences

- The 2017-11-01 brand transition is not treated as legal-entity dissolution.
- No terminal failure, insolvency, or asset-loss event is inferred.
- No exact CHBTC launch day is introduced.
- The separate later status of ZB.com remains governed by the ZB.com canonical record.

## Disposition

The zero-evidence material concern for CHBTC is repaired with a documented lifecycle transition and with unsupported exact-date precision removed.
