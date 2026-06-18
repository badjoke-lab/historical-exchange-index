# HEI v1 Execution Roadmap

Status: active execution source of truth  
Project: Historical Exchange Index (HEI)  
Repository: `badjoke-lab/historical-exchange-index`  
Created: 2026-06-18  
Target: HEI v1.0 completion and transition to recurring registry operations

---

## 1. Purpose

This file is the recovery and execution source of truth for the remaining HEI v1 work.

It must answer five questions at any time:

1. What has already been completed?
2. What is the current main commit?
3. What is the current active work item?
4. What must be done next?
5. What conditions define HEI v1.0 completion?

Every implementation pull request after this roadmap is merged must update the **Current checkpoint** section in this file before merge.

Do not rely on chat history, local notes, old branch names, or remembered counts when this file and the repository can be inspected directly.

---

## 2. Non-negotiable operating rules

### 2.1 Canonical safety

Automated monitoring may create findings, reports, watchlists, artifacts, and monitoring pull requests.

It must not directly modify:

```text
data/entities.json
data/events.json
data/evidence.json
```

Canonical changes require a reviewed normal pull request.

### 2.2 Count semantics

Do not confuse array length with the largest numeric ID.

Public reviewed counts are calculated as follows:

```text
entities
= canonical entities
+ reviewed bundle entities representing genuinely new identities

 events
= canonical events
+ all reviewed bundle events

 evidence
= canonical evidence
+ all reviewed bundle evidence
```

Duplicate IDs with identical content count once. Duplicate IDs with different content are errors.

The largest IDs are sequence markers only. They are not record counts.

### 2.3 Record quality

Do not add thin records only to reach a numerical target.

A normal new public record should have:

- a clear HEI-relevant entity identity
- at least one meaningful event
- normally two or more evidence records
- source-backed status and date decisions
- duplicate, alias, slug, and domain checks
- conservative confidence and end-state classification

### 2.4 URL safety

Original official URLs remain historical fields even if they are no longer safe or active.

For dead-side records, archived access is preferred. `unsafe`, `repurposed`, and `dead_domain` URLs must not be treated as ordinary live actions.

### 2.5 Merge discipline

Before each merge:

- inspect the current main branch
- inspect the complete pull-request diff
- confirm the expected head SHA
- confirm CI and record validation
- confirm canonical count effects
- update this roadmap checkpoint

After each merge, report:

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
Last confirmed main SHA: cb3d80e4b5751537b7589d140821262a740bb491
Last merged implementation PR: #393 Unify public HTML and machine-readable registry state
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

### 3.5 Active work item

```text
Roadmap checkpoint: A1 complete / A2 next
State: A1 implementation completed in PR #394
Next implementation item: A2 fill missing country_or_origin
Interrupt fix baseline: PR #393 / cb3d80e4b5751537b7589d140821262a740bb491
```

### 3.6 Next action

Begin A2 country-of-origin completion from the post-PR #394 main branch, preserving the fixed official URL status enum and strict CI gate.

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

Known baseline candidates:

- OPNX
- CryptoBridge

Method:

- use official corporate or project material where possible
- distinguish legal domicile, operating origin, and ecosystem origin
- do not guess a country when `Global`, an ecosystem label, or `Unknown` is more accurate
- attach evidence or explicit notes supporting the decision

Completion gate:

```text
missing country_or_origin = 0
no unsupported country assignment
```

Status: pending

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

## A5. Make the entity-quality audit permanent

Checks:

- invalid URL status
- provisional or placeholder text
- missing origin
- missing archive
- missing original domain
- URL-field consistency
- suspicious or incomplete lineage

Completion gate:

```text
critical structural entity-quality findings = 0
reusable audit command exists
CI or scheduled quality gate exists
```

Status: pending

---

# Phase B — Monitoring and count regression guarantees

Estimated duration: 3-4 working days  
Estimated PRs: 3-4

## B1. Run the full monitoring system after structural cleanup

Run all six monitor groups:

- candidate discovery
- news and event watch
- active status watch
- evidence and record quality watch
- site and SEO watch
- monitoring health watch

Verify that completed enum and entity-quality fixes no longer reappear.

Completion gate:

```text
critical monitoring errors = 0
canonical guard passes
fixed issues are not rediscovered as unresolved debt
```

Status: pending

## B2. Reorganize A/B/C watchlists and resolutions

Candidate classes:

- A: strong add or update candidate
- B: needs research or stronger evidence
- C: out of scope, duplicate, or not an HEI exchange record

Resolution states:

- promoted
- held
- out_of_scope
- duplicate
- already_canonical
- needs_research

Completion gate:

- processed candidates do not repeatedly return as new
- aged A candidates are visible
- C and duplicate resolutions are retained

Status: pending

## B3. Add count-semantics regression tests

Test consistency across:

- canonical JSON
- reviewed record bundles
- public page loaders
- monitoring aggregate
- machine-readable output
- sitemap generation

Completion gate:

```text
public reviewed counts = monitoring reviewed counts = machine-readable counts
existing-entity repair bundles do not increase entity count
all reviewed bundle events and evidence are included
conflicting duplicate IDs fail validation
```

Status: pending

## B4. Run production smoke checks

Check:

- `/`
- `/dead/`
- `/active/`
- representative `/exchange/[slug]/` routes
- `/stats/`
- `/methodology/`
- `/about/`
- `/version.json`
- `/data/manifest.json`
- `/llms.txt`
- `/ai.txt`
- `/sitemap.xml`

Completion gate:

- public site is available
- expected machine-readable endpoints are available
- counts and route discovery agree

Status: pending

---

# Phase C — Grow the reviewed registry to 550 entities

Estimated duration: 8-12 working days  
Estimated PRs: 6-8

The starting reviewed entity count must be regenerated before this phase begins. Do not calculate required additions from the maximum entity ID.

## C1. Scan a 30-50 candidate block

Classify every candidate:

```text
add_now
needs_research
pending_thin
out_of_scope_or_duplicate
```

Completion gate:

- classification memo exists
- duplicates and scope exclusions are explicit
- only `add_now` enters record PRs

Status: pending

## C2-C3. Repair thin active CEX records

Before adding only new names, improve existing active records that lack meaningful launch and current-status support.

Target per record:

- clear entity identity
- launch event
- launch evidence
- current active-status evidence
- official domain and origin
- normally two or more evidence records

Status: pending

## C4-C5. Add DEX, perp DEX, and hybrid batches

Batch size:

- begin with about five public-quality entities per PR
- increase only after validation and review remain stable

Rules:

- model entity-level identity, not chain deployment rows
- do not classify a protocol as dead only because one frontend is gone
- use `inactive` when permanent end-state evidence is weak

Status: pending

## C6-C7. Add historical dead, acquired, merged, and rebranded batches

Prioritize:

- official shutdown records
- bankruptcy or liquidation
- regulatory termination
- hack followed by permanent shutdown
- acquisition, merger, or clear rebrand
- preserved archive evidence

Status: pending

## C8. Review the 550-entity milestone

Review:

- exact reviewed entity count
- event and evidence totals
- duplicate IDs, slugs, names, aliases, and domains
- active-side and dead-side balance
- CEX, DEX, and hybrid balance
- archive coverage
- high-confidence share
- origin-known share
- evidence depth

Completion gate:

```text
reviewed public entities >= 550
all added entities are public quality
no thin count-filler batch accepted
all CI and record validations green
```

Status: pending

---

# Phase D — Public-value update and research surfaces

Estimated duration: 5-7 working days  
Estimated PRs: 4-5

## D1. HEI Registry Update / Changelog

Generate from merged canonical changes only:

- newly added entities
- corrected entities
- new events
- new evidence
- archive and URL improvements
- lineage improvements

Do not include unmerged staging candidates.

Status: pending

## D2. Exchange Incident Timeline

Display canonical reviewed events only, including:

- hack and exploit
- withdrawal suspension
- trading halt
- regulatory action
- shutdown announcement and effective shutdown
- bankruptcy filing
- acquisition, merger, and rebrand

Status: pending

## D3. Evidence Health Report

Publish safe aggregate information:

- evidence total
- archived-evidence coverage
- records with low evidence depth
- source-type and reliability distributions
- repaired source count

Do not publish raw internal danger lists or monitoring-system error details.

Status: pending

## D4. Monthly Exchange Failure Snapshot

Aggregate reviewed canonical changes by month:

- shutdown
- hack or exploit
- withdrawal suspension
- regulatory action
- bankruptcy
- acquisition
- rebrand

Status: pending

## D5. RSS and JSON update feeds

Feed only reviewed canonical updates and public reports.

Status: pending

---

# Phase E — Stats, internal linking, and SEO

Estimated duration: 7-10 working days  
Estimated PRs: 6-7

## E1. Complete the stats generator and schemas

Generate:

```text
public/data/stats.json
public/data/stats-history.json
```

Statistics must be derived from entity, event, and evidence records. Do not add aggregate-only fields to canonical records.

Status: pending

## E2. Complete Stats Tier 1

Top indicators:

- total entities
- dead-side total
- active-side total
- total events
- total evidence
- archive coverage
- high-confidence share
- origin-known share

Status: pending

## E3. Complete Stats Tier 2

Include:

- active launch-year distribution
- dead-side death-year distribution
- evidence depth
- unknown-field rates
- verification recency
- country and origin summaries

Status: pending

## E4. Complete Stats Tier 3

Include:

- event internals
- evidence internals
- relationship coverage
- record completeness
- country/origin by status
- country/origin by type

Status: pending

## E5. Add history snapshots

Show trend charts only after at least two comparable snapshots exist.

Status: pending

## E6. Improve search and internal links

Primary search identity fields remain:

- canonical name
- aliases
- original official domain

Add links among stats, timeline, changelog, detail records, methodology, and related entities.

Status: pending

## E7. Complete SEO and structured discovery

Include:

- canonical metadata
- Open Graph metadata
- JSON-LD where appropriate
- sitemap validation
- machine-readable discovery links
- internal-link validation

Status: pending

---

# Phase F — English/Japanese bilingual publication

Estimated duration: 6-8 working days  
Estimated PRs: 5-6

English remains at root. Japanese uses `/ja/`.

Canonical data remains single-source. Translation is an overlay and must not translate IDs, slugs, enum values, URLs, publishers, or evidence source titles in canonical data.

## F1. Add i18n foundations

- locale configuration
- common dictionary loader
- enum-label dictionaries
- page-copy dictionaries
- fallback rules
- localized record-copy overlay utility

Status: pending

## F2. Add Japanese common UI

Translate:

- header and navigation
- footer
- filters
- buttons
- status and reason labels
- event and evidence labels
- disclaimers

Status: pending

## F3. Publish Japanese About and Methodology

These are the first complete Japanese long-form pages because definitions, limitations, and correction guidance are trust-critical.

Status: pending

## F4. Publish Japanese registry routes

- `/ja/`
- `/ja/dead/`
- `/ja/active/`
- `/ja/exchange/[slug]/`

Status: pending

## F5. Publish Japanese Stats

Reuse the same numerical data. Translate only presentation labels and explanations.

Status: pending

## F6. Add i18n validation and SEO

- `lang`
- `hreflang`
- locale canonical URLs
- `og:locale`
- localized sitemap entries
- missing-dictionary-key validation
- broken-locale-route validation

Completion gate:

```text
English root routes pass
Japanese primary routes pass
canonical record data remains single-source
fallback behavior passes
locale SEO metadata is consistent
```

Status: pending

---

# Phase G — Final integration audit and HEI v1.0

Estimated duration: 4-5 working days  
Estimated PRs: 4-5

## G1. Accessibility and interaction audit

- keyboard navigation
- focus states
- filter controls
- table semantics
- screen-reader labels
- contrast
- mobile overflow and compact rows

Status: pending

## G2. Final URL-safety audit

Verify detail-page behavior for:

- unsafe
- repurposed
- dead domain
- redirected
- live but unverified

Status: pending

## G3. Production integration test

Test:

- all public route groups
- all exchange detail routes
- stats
- timeline
- changelog
- public reports
- machine-readable files
- sitemap and robots
- locale routes
- 404 behavior
- Cloudflare production build
- weekly monitoring
- monthly review

Status: pending

## G4. Write the operations runbook

Document:

- adding new records
- correcting existing entities
- event and evidence updates
- monitoring-PR processing
- watchlist resolution
- stats snapshots
- translation updates
- incident response
- rollback
- roadmap checkpoint updates

Status: pending

## G5. Record the v1.0 baseline

Record:

- release SHA
- reviewed record counts
- maximum IDs
- coverage values
- known limitations
- deferred work
- next recurring growth target

HEI v1.0 completion gate:

```text
reviewed entities >= 550
legacy enum violations = 0
invalid URL status = 0
critical data-quality alerts = 0
public, monitoring, and machine-readable counts agree
weekly monitoring is healthy
monthly review is healthy
canonical guard is healthy
Stats is public
Registry Update is public
Incident Timeline is public
Evidence Health is public
Monthly Snapshot is public
English and Japanese primary routes are public
all required CI checks are green
Cloudflare production smoke passes
operations runbook is complete
```

Status: pending

---

## 5. Weekly schedule view

| Week | Main work | Required result |
|---|---|---|
| 1 | URL status, origin, lineage, entity-quality gate | Structural entity debt closed |
| 2 | Full monitoring, watchlist cleanup, count regressions | Counts and monitoring semantics locked |
| 3 | Active repairs and DEX/perp batches | First growth batches merged |
| 4 | Historical batches and milestone review | 550 reviewed entities |
| 5 | Changelog, incident timeline, evidence health, monthly snapshot | Public-value surfaces available |
| 6 | Stats generator and Tier 1 | Core stats available |
| 7 | Stats Tier 2/3, search, links, SEO | Analysis and discovery layer complete |
| 8 | i18n foundation and Japanese long-form | Bilingual foundation complete |
| 9 | Japanese registry, stats, and locale SEO | Bilingual primary routes complete |
| 10 | Integration audit, runbook, release baseline | HEI v1.0 complete |

---

## 6. Pull-request checkpoint update template

Every implementation PR must update Section 3 using this format:

```text
Checkpoint date:
Current phase and item:
Last merged PR:
Last merged SHA:
Reviewed counts:
Maximum IDs:
What changed:
Validation result:
Known remaining issue:
Next item:
```

A PR that changes canonical counts must update both:

- reviewed public counts
- maximum observed IDs

A PR that does not change counts must explicitly say so.

---

## 7. Recovery procedure

When resuming after an interruption:

1. Read this file from `main`.
2. Confirm the actual current main SHA on GitHub.
3. Compare it with the checkpoint SHA in Section 3.
4. Inspect open pull requests and branches related to the current item.
5. Regenerate reviewed counts; never infer them from maximum IDs.
6. Run the relevant validation commands.
7. Resume the first item whose completion gate is not satisfied.
8. Update this file in the same pull request before merge.

If the file checkpoint is stale, the repository state is authoritative. Correct the checkpoint before continuing implementation.

---

## 8. Deferred beyond v1.0

The following are not required for HEI v1.0:

- D1 migration
- deployment-level DEX modeling
- chain-specific deployment pages
- public comments
- live price, TVL, volume, or order-book data
- rankings or recommendation scores
- automatic canonical publication without review

These require a separate specification and roadmap revision.

---

## 9. Recurring operation after v1.0

### Weekly

- automated monitoring
- A/B/C candidate review
- URL and evidence health review
- monitoring PR only when meaningful findings exist

### Monthly

- reviewed growth batch
- Monthly Exchange Failure Snapshot
- Registry Update
- stats snapshot
- stale-record repair
- roadmap checkpoint refresh

### Quarterly

- coverage review
- archive review
- low-confidence review
- lineage review
- active/dead reclassification review
- search and SEO review

Longer-term reviewed entity targets:

```text
v1.1: 750
v1.2: 1,000
v1.5: 2,000
long-term entity-only range: 4,000-6,000
```
