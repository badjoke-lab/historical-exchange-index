# HEI Material Concerns Correction — BX105 LiteBit — 2026-09-04

## Scope

Bounded repair for `hei_ex_000283` LiteBit under #857. No schema, workflow, validator, monitoring, Phase 9, or unrelated canonical changes.

## Findings

- LiteBit's bundle had no events or evidence despite asserting a May 2023 wind-down, Bitvavo acquisition, and an exact `death_date` of `2023-08-14`.
- Bitvavo's 2023-05-23 announcement records LiteBit's decision to terminate its activities and includes a statement from LiteBit COO Arthur van Lier.
- The Dutch ACM approved Bitvavo B.V.'s acquisition of the LiteBit business on 2023-06-06.
- LiteBit's current official site confirms operations have ceased and eligible customer funds were transferred to Bitvavo.
- None of the recovered primary/regulatory sources establishes `2023-08-14` as the exact terminal date. The exact death date is therefore removed rather than preserved without support.

## Canonical additions

- `hei_ev_010226` — shutdown announced on 2023-05-23
- `hei_ev_010227` — acquisition approved on 2023-06-06
- `hei_src_012769` — Bitvavo first-party announcement carrying LiteBit's decision and COO statement
- `hei_src_012770` — ACM acquisition decision
- `hei_src_012771` — current LiteBit cessation / customer-transfer notice

## Conservative boundaries

- `status: acquired`, `death_reason: acquisition`, and successor Bitvavo are retained because the ACM decision supports the acquisition.
- `death_date` is set to null because no recovered first-party/regulatory source establishes the prior exact date.
- No additional acquisition scope beyond the regulated LiteBit business/customer transition is inferred.
