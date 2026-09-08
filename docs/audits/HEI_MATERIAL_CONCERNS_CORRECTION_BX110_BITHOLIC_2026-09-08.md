# HEI Material Concerns Correction — BX110 Bitholic — 2026-09-08

## Scope

This batch repairs the zero-evidence legacy bundle for `hei_ex_000199` (Bitholic) under #857. No schema, validator, workflow, monitoring, Phase 9, or unrelated canonical record is changed.

## Reviewed canonical state

Before this batch, Bitholic was classified `rebranded` with `death_reason: rebrand`, `launch_date: 2018-05-01`, and `death_date: 2019-08-08`, but had no linked event or evidence records.

## Evidence findings

1. A BITHOLIC-issued 2019-03-04 release describes the Singapore-based exchange as actively operating and preparing a BXA listing during March 2019.
2. The earlier RDMCHAIN launch announcement said Bitholic would start in May 2018, but did not establish the exact day 2018-05-01.
3. The Block reported on 2019-08-08 that BitHolic had changed its name to Bithumb Singapore "this month". This supports the rebrand classification but does not establish August 8 as the transition day.
4. The reviewed evidence does not establish legal-entity dissolution, an acquisition date, or a sufficiently precise predecessor/successor legal relationship for canonical lineage mutation.

## Corrections

- Preserve `status: rebranded`.
- Preserve `death_reason: rebrand`.
- Change `launch_date: 2018-05-01` to `null` because only a May 2018 launch window is supported.
- Change `death_date: 2019-08-08` to `null` because August 8 is the reporting date, not a proven exact rebrand date.
- Preserve `successor_id: null`; do not infer legal or ownership continuity beyond the documented name transition.
- Refresh summary, notes, and `last_verified_at`.

## Canonical additions

- `hei_src_012783` — BITHOLIC first-party March 2019 operating/listing statement.
- `hei_src_012784` — The Block contemporaneous report that BitHolic changed its name to Bithumb Singapore during August 2019.

No lifecycle event is emitted because the reviewed sources do not establish an exact rebrand day. This avoids turning a publication date into a fabricated event date.

## Explicit non-inferences

- No exact launch day is inferred from "May 2018".
- No exact rebrand day is inferred from an August 8 report saying the change occurred "this month".
- No legal dissolution is inferred from a brand transition.
- No acquisition is inferred from Bithumb market entry reporting without sufficiently precise ownership evidence.
