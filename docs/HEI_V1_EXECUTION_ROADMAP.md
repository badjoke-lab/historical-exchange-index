# Historical Exchange Index v1 Execution Roadmap

This roadmap is the source of truth for the remaining HEI v1 implementation sequence.

## 1. Operating rules

- Execute work in the phase order below unless a blocking defect requires an explicitly documented interruption.
- Keep reviewed public counts separate from maximum observed IDs.
- Update the current checkpoint in every implementation PR.
- Report the merged PR, merge SHA, current checkpoint, exact effect, and next work item after each merge.
- Preserve reviewed canonical data and do not publish monitoring candidates without review.

## 2. Recovery protocol

When resuming work, confirm:

- current `main` SHA
- last merged implementation PR
- reviewed entity, event, and evidence counts
- maximum observed IDs
- active work item
- open implementation PRs

After each merge, record:

- merged PR and merge SHA
- full schedule status
- current checkpoint
- exact effect of the merge
- next work item

---

## 3. Current checkpoint

This section must be updated in every implementation PR.

### 3.1 Last confirmed baseline

```text
Baseline date: 2026-06-19
Last confirmed main SHA: 752ba7604ab262cad47dd6a07fe5c4dc71e52678
Last merged implementation PR: #397 Make Cloudflare Pages deployment controls reproducible
```

### 3.2 Reviewed public counts

```text
Entities:  412
Events:    687
Evidence:  1594
```

These are reviewed public-layer counts, not maximum IDs.

### 3.3 Maximum observed IDs

```text
Maximum entity ID:    hei_ex_000525
Maximum event ID:     hei_ev_002079
Maximum evidence ID:  hei_src_003183
```

### 3.4 Completed immediately before this roadmap

- guarded reviewed entity-correction mechanism
- Coinone launch-date correction and launch evidence
- legacy `event_type` normalization and CI gate
- legacy `source_type` normalization and CI gate
- legacy `claim_scope` normalization and CI gate
- weekly monitoring implementation
- monthly read-only review workflow
- first monthly review backfill for 2026-05
- machine-readable public layer and validation
- public HTML / JSON / metadata count unification and production-output consistency checks
- repository-owned Cloudflare Pages deployment policy and reproducible configuration tooling

### 3.5 Active work item

```text
Roadmap checkpoint: A2 in progress
State: full projected-public audit completed; first high-confidence origin batch prepared in PR #398
Current implementation item: A2 fill missing country_or_origin
Cloudflare state: project configuration apply deferred until account access is restored
```

### 3.6 Next action

Complete CI and review for A2 Batch 1, then continue evidence-quality batches until true missing `country_or_origin` values reach zero. Keep Cloudflare configuration application deferred without blocking GitHub-side development.

---

## 4. Overall execution order

```text
R0. Place and merge this roadmap
A. Structural entity-quality debt
B. Monitoring and count regression guarantees
C. Grow reviewed public registry to 550 entities
D. Add public-value update and research surfaces
E. Complete Stats, internal linking, and SEO
F. Publish English/Japanese bilingual layer
G. Final integration audit and HEI v1.0 baseline
```

Estimated remaining effort after R0:

```text
Implementation PRs: approximately 30-38
Working days: approximately 37-52
Calendar estimate: approximately 8-11 weeks
```

The schedule is dependency-based. Dates may move, but phase order and completion gates must not be skipped without documenting the reason here.

---

# Phase R0 — Roadmap placement

## R0.1 Add this source-of-truth document

Work:

- add `docs/HEI_V1_EXECUTION_ROADMAP.md`
- record the last confirmed main SHA
- separate reviewed counts from maximum IDs
- define the merge-reporting and recovery protocol
- define all remaining phases and completion gates

Completion gate:

- file exists on `main`
- CI is green
- the next item is explicitly A1

Status: **COMPLETED**

---

# Phase A — Structural entity-quality debt

Estimated duration: 4-6 working days  
Estimated PRs: 4-6

## A1. Normalize invalid `official_url_status` values

Known audit baseline: 13 invalid values.

Previously identified records include:

- Coinbase Pro
- LocalCryptos
- CoinGather
- BitMarket.eu
- Stocks.exchange
- SouthXchange
- AEX
- BCM Exchange
- BITBOX
- AlfaCashier
- Bingbon
- Anyswap
- CoinFLEX

Method:

1. Rerun the audit from current main.
2. Inspect each entity, original URL, redirect target, archive, status, and notes.
3. Map each record to the fixed enum:
   - `live_verified`
   - `live_unverified`
   - `dead_domain`
   - `redirected`
   - `repurposed`
   - `unsafe`
   - `unknown`
4. Add a strict CI check for future invalid values.
5. Preserve original URLs and archive references.

Completion gate:

```text
invalid official_url_status = 0
no historical URL deleted merely because it is dead
strict validation enabled in CI
```

Status: **COMPLETED**

## A2. Fill missing `country_or_origin`

Current audit baseline:

```text
Projected public entities:      412
True missing values:             21
Explicit Unknown values:          9
Total review queue:              30
```

Method:

- audit the projected public layer, including reviewed bundles and reviewed corrections
- use official corporate or project material where possible
- distinguish legal domicile, operating origin, and ecosystem origin
- do not guess a country when `Global`, an ecosystem label, or `Unknown` is more accurate
- attach evidence or explicit notes supporting the decision
- process records in evidence-quality batches

Completion gate:

```text
true missing country_or_origin = 0
no unsupported country assignment
explicit Unknown values are documented and reviewable
strict structural validation enabled in CI
```

Status: **IN PROGRESS — Batch 1 in PR #398**

## A3-A4. Review lineage candidates

Classify each candidate as:

```text
link_now
  a clear canonical counterpart exists

document_only
  the relationship is supported but the counterpart is not yet canonical

unresolved
  acquisition, rebrand, or identity continuity remains ambiguous
```

Do not create thin successor entities only to fill a lineage field.

Completion gate:

- no broken lineage IDs
- all applied links are bidirectionally or explicitly documented where appropriate
- unresolved cases remain in a review report, not forced into canonical links

Status: pending

---

# Phase B — Monitoring and count regression guarantees

## B1. Lock public count consistency

Work:

- keep canonical, projected, machine-readable, and built HTML counts aligned
- fail CI on unexpected count drift
- record intended count changes in PR summaries

Completion gate:

- all public surfaces resolve to the same reviewed count state
- unintended count changes fail before merge

Status: pending

## B2. Strengthen monitoring safety

Work:

- preserve read-only monitoring collection
- keep candidates out of canonical data until manual review
- validate monitoring artifact paths and schemas
- document promotion rules

Completion gate:

- monitoring cannot write directly to canonical data
- candidate promotion remains explicit and reviewable

Status: pending

---

# Phase C — Grow reviewed public registry to 550 entities

Work:

- prioritize high-value historical exchanges and active platforms with durable evidence
- add records through reviewed bundles
- preserve entity / event / evidence structure
- avoid thin records created only to reach a count target

Completion gate:

```text
reviewed public entities >= 550
all additions pass duplicate, overlap, schema, and evidence validation
```

Status: pending

---

# Phase D — Add public-value update and research surfaces

Work:

- create update/history surfaces from reviewed data
- expose useful research paths without publishing internal candidates
- preserve archive-first presentation

Completion gate:

- users can understand what changed and why
- no internal monitoring or private review material leaks into public output

Status: pending

---

# Phase E — Complete Stats, internal linking, and SEO

Work:

- complete filterable Stats surfaces
- strengthen entity/event/evidence linking
- improve metadata, sitemap coverage, and structured data
- maintain fast static output

Completion gate:

- major registry dimensions are browsable and internally linked
- search and AI discovery surfaces remain consistent with canonical data

Status: pending

---

# Phase F — Publish English/Japanese bilingual layer

Work:

- implement the approved multilingual specification
- preserve canonical identifiers and shared factual data
- prevent language-specific data drift

Completion gate:

- English and Japanese routes resolve consistently
- canonical data remains single-source

Status: pending

---

# Phase G — Final integration audit and HEI v1.0 baseline

Work:

- audit repository, CI, production output, machine-readable layer, counts, and documentation
- remove temporary files and stale branches
- record the final v1.0 baseline

Completion gate:

- all prior phase gates are satisfied
- production and repository state are aligned
- recovery documentation identifies the final merge SHA and counts

Status: pending
