# HEI material-concerns correction — BX106 BitBay — 2026-09-04

## Scope

This batch repairs only the zero-evidence legacy bundle for `hei_ex_000127` BitBay under #857.

No schema, workflow, validator, monitoring, Phase 9, or unrelated canonical changes are included.

## Evidence recovered

- Contemporary 2021-11-08 reporting records BitBay's announcement that the exchange was becoming Zonda, including the new name, strategy and leadership.
- A later first-party Zonda API migration notice explicitly ties the rebranding to retirement of legacy `bitbay.net` API endpoints while retaining existing account/API credentials, supporting service continuity across the brand transition.

## Canonical disposition

- Preserve `status: rebranded`.
- Preserve `death_reason: rebrand`.
- Preserve `death_date: 2021-11-08` because the exact date is supported by contemporaneous reporting.
- Preserve `successor_id: hei_ex_000216` as the already-reviewed reciprocal lineage edge.
- Do not introduce a launch date; this repair did not recover an equally strong exact launch-date source.

## Canonical additions

- `hei_ev_010228` — BitBay rebranded to Zonda on 2021-11-08.
- `hei_src_012772` — contemporaneous rebrand report.
- `hei_src_012773` — Zonda first-party legacy BitBay API migration notice.

## Material-concerns guardrails

The recovered material supports a brand transition and service continuity. It does not establish or negate unrelated allegations or findings involving insolvency, hacks, fraud, enforcement, ownership misconduct, or customer losses. No absence-of-evidence inference is made for those dimensions.
