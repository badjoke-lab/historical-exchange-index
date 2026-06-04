# Pending review: verified-unadded rows 0442-0452

Status: pending review
Scope: HEI exchange / DEX candidate backlog
Created from: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`

## Purpose

This memo preserves candidates that were reviewed during the next-record scan but were not added to canonical exchange records.

The goal is to avoid polluting canonical records with thin `listed_reference`-only entries while keeping the candidates available for later re-checks, active seed phases, DEX seed phases, or monitoring-based resurfacing.

## Operating rule

Canonical record creation requires public-ready value:

- clear exchange / DEX / hybrid identity
- meaningful event beyond a bare database listing, or a major seed candidate with clear public value
- preferably two or more evidence items
- safe status / URL handling
- no unresolved duplicate concern

Candidates below are not consumed. They remain available for future review.

## Classification legend

```text
add_now
  Ready for canonical record creation.

needs_research
  Potentially relevant, but stronger source or event confirmation is needed.

pending_thin
  Too thin for canonical record creation now; usually database-only or listed-reference-only.

active_seed_later
  Active-looking candidate better handled during a dedicated active CEX / DEX seed phase.

out_of_scope_or_duplicate
  Likely outside HEI scope or likely duplicate of an existing record.
```

## Reviewed candidates

| candidate_id | name | likely type | source/domain note | classification | why not added now | revisit trigger |
|---|---|---:|---|---|---|---|
| `hei_unadded_0442` | C-Patex | cex | CoinPaprika row; candidate domain `c-patex.com` | `pending_thin` | Only a thin database-style listing was available in the reviewed context. No meaningful launch, shutdown, acquisition, rebrand, incident, or other history event was confirmed. | Revisit if an official source, archived website, shutdown notice, independent news source, or second strong evidence item is found. |
| `hei_unadded_0443` | C3 Exchange | bridge / exchange-like | Bridge-like candidate | `needs_research` | May not be a straightforward exchange entity. Needs scope check before HEI canonical inclusion. | Revisit if it can be clearly modeled as exchange / DEX / hybrid, or if a meaningful exchange-related event is confirmed. |
| `hei_unadded_0444` | Cables Finance | dex | DefiLlama row; candidate domain `cables.finance` | `pending_thin` | Only a thin DEX listing/candidate-domain profile was available in the reviewed context. No meaningful history event was confirmed. | Revisit during DEX seed phase or if official launch, frontend shutdown, migration, exploit, or independent evidence is found. |
| `hei_unadded_0445` | Caliber | dex | DefiLlama row; no strong domain verified in reviewed context | `pending_thin` | Database-reference-only candidate. No official domain, archive, or meaningful event confirmed. | Revisit if official domain, launch evidence, incident evidence, or archive is found. |
| `hei_unadded_0451` | Canary | dex | DefiLlama row; Avalanche ecosystem context | `pending_thin` | Database-reference-only candidate in the reviewed context. No meaningful event confirmed. | Revisit during DEX seed phase or if official/independent sources are found. |
| `hei_unadded_0452` | CandySwap | dex | DefiLlama row; MEER ecosystem context | `pending_thin` | Database-reference-only candidate in the reviewed context. No meaningful event confirmed. | Revisit during DEX seed phase or if official launch, archive, shutdown, migration, or incident evidence is found. |

## Not reviewed in this memo

Rows outside the listed candidate IDs are not classified here. Camelot-related rows through `hei_unadded_0450` were already handled in the previous consumed batch and are not part of this pending memo.

## Next action

For the next canonical addition PR, do not continue by converting these thin candidates into records. Instead:

1. Scan a wider window such as `hei_unadded_0453-0500`.
2. Classify candidates first.
3. Add only `add_now` records with meaningful event/evidence value.
4. Store thin or deferred candidates in pending-batch memos like this one.

## Public-safety note

This memo is public-safe backlog metadata. It avoids unverified claims such as fraud, danger, insolvency, or shutdown unless backed by sources in canonical records.
