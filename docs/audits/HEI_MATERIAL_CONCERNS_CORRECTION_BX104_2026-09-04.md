# HEI Material Concerns Correction — BX104 CoinFLEX — 2026-09-04

## Scope

Bounded repair for `hei_ex_000313` CoinFLEX under #857. No schema, workflow, validator, monitoring, Phase 9, or unrelated canonical changes.

## Findings

- The canonical bundle was zero-evidence despite asserting a June 2022 withdrawal halt and later CoinFLEX-to-OPNX identity transition.
- The Supreme Court of Seychelles ruling dated 2022-08-17 records that a large customer failed to meet financial obligations, creating a balance-sheet hole that left CoinFLEX unable to meet withdrawal requests and other liabilities. The same ruling approved an interim arrangement in the restructuring process.
- CoinFLEX executive Leslie Lamb publicly announced on 2023-03-08 that CoinFLEX would officially rebrand to Open Exchange (OPNX).
- The prior canonical `death_date` of `2023-02-15` was not supported by the recovered record and is corrected to `2023-03-08`.
- HEI retains `status: rebranded` and `death_reason: rebrand` as the public identity transition marker, but leaves `successor_id: null`. Later creditor litigation disputed whether OPNX was an authorized one-to-one legal successor, so the lineage must remain narrative/event-level rather than a forced canonical successor edge.

## Canonical additions

- `hei_ev_010223` — withdrawal suspension on 2022-06-23
- `hei_ev_010224` — Seychelles interim restructuring arrangement on 2022-08-17, modeled as `other` because HEI has no dedicated restructuring event enum
- `hei_ev_010225` — public CoinFLEX-to-OPNX rebrand announcement on 2023-03-08
- `hei_src_012766` and `hei_src_012767` — Supreme Court of Seychelles / SeyLII court document
- `hei_src_012768` — Leslie Lamb first-party executive rebrand announcement

## Conservative boundaries

- No bankruptcy or insolvency event is inferred from a restructuring arrangement.
- No clean successor relationship to OPNX is asserted.
- The 2019 launch date and Seychelles origin are not tightened in this repair.
- The rebrand evidence supports the public identity transition only; it does not resolve later governance/legal disputes about OPNX.
