# HEI v1 Execution Roadmap

Status: active execution source of truth  
Project: Historical Exchange Index (HEI)  
Repository: `badjoke-lab/historical-exchange-index`  
Created: 2026-06-18  
Rebased to repository state: 2026-06-20  
Target: HEI v1.0 completion and transition to recurring registry operations

---

## 1. Purpose

This file is the recovery and execution source of truth for the remaining HEI v1 work.

It must answer:

1. what is complete;
2. what main commit is authoritative;
3. what work item is active;
4. what must happen next;
5. what defines HEI v1.0 completion.

Repository state is authoritative when this checkpoint and GitHub disagree. Every implementation pull request must update the current checkpoint before merge.

---

## 2. Non-negotiable operating rules

### 2.1 Canonical safety

Automated monitoring may create findings, reports, watchlists, artifacts, and monitoring pull requests. It must not directly modify:

```text
data/entities.json
data/events.json
data/evidence.json
```

Canonical changes require a reviewed normal pull request.

### 2.2 Count semantics

Reviewed public counts are not maximum IDs.

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

### 2.3 Record quality

Do not add thin records only to reach a numerical target. A normal new public record should have:

- a clear HEI-relevant identity;
- at least one meaningful event;
- normally two or more evidence records;
- source-backed status and date decisions;
- duplicate, alias, slug, and domain checks;
- conservative confidence and end-state classification.

### 2.4 Origin discipline

`country_or_origin` may represent legal domicile, operating origin, founding origin, or ecosystem origin. Notes and evidence must explain which basis is used.

Do not infer a country from a domain suffix, language, user geography, or unsupported secondary summaries. Use `Unknown`, `Global`, or an ecosystem label when that is more accurate.

### 2.5 URL safety

Original official URLs remain historical fields even if no longer safe or active. Dead-side records should prefer archived access. `unsafe`, `repurposed`, and `dead_domain` URLs must not be treated as ordinary live actions.

### 2.6 Merge discipline

Before each merge:

- inspect current `main`;
- inspect the complete PR diff;
- confirm the expected head SHA;
- confirm CI and record validation;
- confirm count effects;
- update this checkpoint.

After each merge record:

- merged PR and merge SHA;
- reviewed counts;
- maximum IDs;
- exact effect;
- known remaining issue;
- next work item.

---

## 3. Current checkpoint

### 3.1 Last confirmed baseline

```text
Checkpoint date: 2026-06-22
Last confirmed main SHA: a34ef6a3898bda5d32d291e4660d44689230a011
Last merged implementation PR: #411 Close A3 lineage audit — L3
Current implementation PR: #412 Apply reviewed A4 lineage links
Production verification workflow: 27858696613
Production verification result: success for earlier production baseline; A4 remains GitHub-only and does not change Cloudflare or production settings
```

### 3.2 Reviewed public counts

Confirmed unchanged by the complete A3 read-only audit:

```text
Entities:  412
Events:    687
Evidence: 1608
```

### 3.3 Maximum observed IDs

```text
Maximum entity ID:    hei_ex_000525
Maximum event ID:     hei_ev_002079
Maximum evidence ID:  hei_src_003197
```

### 3.4 Completed execution items

- guarded reviewed entity-correction mechanism;
- Coinone launch-date correction and launch evidence;
- legacy `event_type`, `source_type`, and `claim_scope` normalization with strict gates;
- weekly monitoring implementation;
- monthly read-only review workflow and 2026-05 backfill;
- machine-readable public layer and validation;
- public HTML / JSON / metadata count unification;
- A1 official URL status normalization in PR #394;
- reproducible Cloudflare Pages deployment controls in PR #397;
- Cloudflare policy applied: production from `main`, preview deployments disabled;
- A2 country/origin Batches 1-5 in PRs #399, #400, #402, #403, and #404;
- explicit Unknown reviews U1 and U2 in PRs #405 and #406;
- A2 strict country/origin checker and CI gate in PR #407;
- A3 projected-public lineage inventory verified in PR #408;
- A3-L1 review of all eleven existing relationship edges in PR #409;
- A3-L2 review of all twenty-five structured event/state candidates in PR #410;
- A3-L3 consolidated closure gate and completion report in PR #411;
- A4 reviewed lineage application, permanent validation, and frozen A3 baseline protection in PR #412;
- production endpoint, commit, count, safety-flag, and route verification.

### 3.5 Active work item

```text
Current phase: Phase A — Structural entity-quality debt
Completed item: A4 — Apply safe lineage links
A3 inventory implementation: PR #408
A3 L1 existing-edge review: PR #409
A3 L2 structured candidate review: PR #410
A3 closure: PR #411
A4 implementation: PR #412
Reviewed A4 lineage field changes: 14
Affected entities: 14
Projected public counts: 412 entities / 687 events / 1608 evidence
Missing lineage targets: 0
Self relationships: 0
Frozen A3 baseline retained for review-integrity checks
Current item: A5 — Permanent entity-quality audit
Next implementation item: add the permanent entity-quality audit and CI or scheduled gate
```

A3 changed no canonical relationship fields. PR #412 applies the fourteen reviewed A4 lineage-field changes while retaining document-only and unresolved cases outside canonical links.

### 3.6 Next action

Proceed to A5 after PR #412: run the permanent entity-quality audit, convert the reusable checks into a CI or scheduled gate, and keep Cloudflare and production changes out of scope until the GitHub-side phase is complete.

---

## 4. Overall execution order

```text
R0. Roadmap placement and recovery protocol
A. Structural entity-quality debt
B. Monitoring and count regression guarantees
C. Grow reviewed public registry to 550 entities
D. Add public-value update and research surfaces
E. Complete Stats, internal linking, and SEO
F. Publish English/Japanese bilingual layer
G. Final integration audit and HEI v1.0 baseline
```

Estimated remaining effort from the 2026-06-20 checkpoint:

```text
Implementation PRs: approximately 39-48
Working days: approximately 46-64
Calendar estimate: approximately 10-14 weeks
```

The largest uncertainty is Phase C. HEI must grow from 412 to at least 550 reviewed entities without accepting thin count-filler records.

---

# Phase R0 — Roadmap placement

## R0.1 Source-of-truth roadmap

Completion gate:

- roadmap exists on `main`;
- count semantics are explicit;
- recovery procedure exists;
- active item is explicit.

Status: **COMPLETED**

---

# Phase A — Structural entity-quality debt

Estimated remaining duration: 6-10 working days  
Estimated remaining PRs: 7-9

## A1. Normalize invalid `official_url_status`

Completion gate:

```text
invalid official_url_status = 0
historical URLs preserved
strict validation enabled
```

Status: **COMPLETED in PR #394**

## A2. Fill missing `country_or_origin`

Method:

- use official corporate, legal, project, or archived material where possible;
- distinguish legal domicile, operating origin, founding origin, and ecosystem origin;
- use `Unknown`, `Global`, or an ecosystem label when evidence does not support a country;
- attach evidence or explicit notes for every decision.

Execution batches:

1. Batch 1 — five high-confidence records: completed in PR #399.
2. Batch 2 — five official legal/company/ecosystem decisions: completed in PR #400.
3. Batch 3 — five active low-confidence seed records: completed in PR #402.
4. Batch 4 — four active protocol and exchange records: completed in PR #403.
5. Batch 5 — OPNX and CryptoBridge guarded corrections: completed in PR #404.
6. Explicit `Unknown` U1 — five older canonical records: completed in PR #405.
7. Explicit `Unknown` U2 — six remaining records: completed in PR #406.
8. Final strict-gate PR: completed in PR #407.

Completion gate:

```text
true missing country_or_origin = 0
unsupported country assignments = 0
remaining Unknown values explicitly reviewed and documented
strict structural gate enabled
```

Status: **COMPLETED in PR #407**

## A3. Audit lineage candidates

Classify every acquisition, merger, rebrand, migration, predecessor, and successor candidate as:

```text
link_now
document_only
unresolved
```

Do not create thin successor entities only to fill lineage fields.

Execution batches:

1. Inventory tooling and verified projected-public report: implemented in PR #408.
2. L1 — review eleven existing relationship records: completed in PR #409.
3. L2 — review twenty-five structured event/state candidates: completed in PR #410.
4. L3 — consolidate reviewed dispositions and close A3: completed in PR #411.

Verified inventory:

```text
structured candidates = 36
text-only watchlist = 52
missing targets = 0
self relationships = 0
non-reciprocal relationships = 9
```

Status: **COMPLETED in PR #411 — 36 / 36 structured candidates reviewed**

## A4. Apply safe lineage links

Completion gate:

- no broken lineage IDs;
- applied links are bidirectional or explicitly documented;
- unresolved cases remain in a review report rather than being forced into canonical links.

Status: **COMPLETED in PR #412 — 14 reviewed lineage field changes across 14 entities**

## A5. Permanent entity-quality audit

Audit:

- invalid URL status;
- provisional or placeholder text;
- missing origin;
- missing archive;
- missing original domain;
- URL-field consistency;
- suspicious or incomplete lineage.

Completion gate:

```text
critical structural findings = 0
reusable audit command exists
CI or scheduled quality gate exists
```

Status: pending

---

# Phase B — Monitoring and count regression guarantees

Estimated duration: 4-6 working days  
Estimated PRs: 3-4

## B1. Full monitoring run after structural cleanup

Run all six groups:

- candidate discovery;
- news and event watch;
- active status watch;
- evidence and record quality watch;
- site and SEO watch;
- monitoring health watch.

Completion gate:

```text
critical monitoring errors = 0
canonical guard passes
fixed structural issues are not rediscovered as unresolved debt
```

Status: pending

## B2. Reorganize watchlists and resolutions

Candidate classes:

- A — strong add or update candidate;
- B — needs research or stronger evidence;
- C — out of scope, duplicate, or not an HEI exchange record.

Resolution states:

- promoted;
- held;
- out_of_scope;
- duplicate;
- already_canonical;
- needs_research.

Completion gate:

- processed candidates do not repeatedly return as new;
- aged A candidates are visible;
- duplicate and C resolutions are retained.

Status: pending

## B3. Count-semantics regression tests

Test consistency across:

- canonical JSON;
- reviewed record bundles;
- public page loaders;
- monitoring aggregate;
- machine-readable output;
- sitemap generation.

Completion gate:

```text
public reviewed counts = monitoring counts = machine-readable counts
existing-entity repair bundles do not increase entity count
all reviewed events and evidence are included
conflicting duplicate IDs fail validation
```

Status: pending

## B4. Production smoke checks

Verified surfaces include:

- public root and registry routes;
- representative exchange routes;
- methodology and about;
- `/version.json`;
- `/data/manifest.json`;
- `/llms.txt`;
- `/ai.txt`;
- sitemap and route discovery.

Verification completed on 2026-06-20 against production commit `89c3a072a0d0953e91ef14c355c26ac38cbcab7b`.

Status: **COMPLETED**

---

# Phase C — Grow the reviewed registry to 550 entities

Starting reviewed count: 412  
Required net additions: at least 138  
Estimated duration: 15-25 working days  
Estimated PRs: 14-19

## C1. Candidate scans

Scan 30-50 candidates per block and classify:

```text
add_now
needs_research
pending_thin
out_of_scope_or_duplicate
```

Only `add_now` enters record PRs.

Status: pending

## C2-C3. Repair thin active CEX records

Before count growth, improve existing active records lacking:

- clear identity;
- launch event and launch evidence;
- current active-status evidence;
- official domain and origin;
- normal evidence depth.

Status: pending

## C4-C5. Add DEX, perp DEX, and hybrid batches

Rules:

- model entity-level identity rather than deployment rows;
- begin with small public-quality batches;
- do not call a protocol dead only because one frontend disappeared;
- use `inactive` when permanent end-state evidence is weak.

Expected contribution: approximately 55-70 entities.

Status: pending

## C6-C7. Add historical dead, acquired, merged, and rebranded batches

Prioritize:

- official shutdown;
- bankruptcy or liquidation;
- regulatory termination;
- hack followed by permanent shutdown;
- acquisition, merger, or clear rebrand;
- preserved archive evidence.

Expected contribution: approximately 70-85 entities.

Status: pending

## C8. Review the 550-entity milestone

Review:

- exact reviewed counts;
- duplicate IDs, slugs, names, aliases, and domains;
- active/dead balance;
- CEX/DEX/hybrid balance;
- archive coverage;
- high-confidence share;
- origin-known share;
- evidence depth.

Completion gate:

```text
reviewed public entities >= 550
all additions meet public quality
no thin count-filler batch accepted
all CI and record validations green
```

Status: pending

---

# Phase D — Public-value update and research surfaces

Estimated duration: 5-7 working days  
Estimated PRs: 4-5

## D1. HEI Registry Update / Changelog

Generate only from merged reviewed changes:

- new entities;
- corrected entities;
- new events;
- new evidence;
- archive and URL improvements;
- lineage improvements.

Status: pending

## D2. Exchange Incident Timeline

Display reviewed events for hacks, withdrawal suspensions, trading halts, regulatory actions, shutdowns, bankruptcy, acquisition, merger, and rebrand.

Status: pending

## D3. Evidence Health Report

Publish safe aggregates:

- evidence total;
- archived-evidence coverage;
- low evidence-depth counts;
- source-type and reliability distributions;
- repaired source count.

Do not expose raw internal danger lists.

Status: pending

## D4. Monthly Exchange Failure Snapshot

Aggregate reviewed monthly changes for shutdown, exploit, suspension, regulatory action, bankruptcy, acquisition, and rebrand.

Status: pending

## D5. RSS and JSON update feeds

Feed reviewed canonical updates and public reports only.

Status: pending

---

# Phase E — Stats, internal linking, and SEO

Estimated duration: 7-10 working days  
Estimated PRs: 5-7

## E1. Stats generator and schemas

Generate:

```text
public/data/stats.json
public/data/stats-history.json
```

Statistics must be derived from entity, event, and evidence records.

Status: pending

## E2. Stats Tier 1

- total entities;
- dead-side total;
- active-side total;
- events;
- evidence;
- archive coverage;
- high-confidence share;
- origin-known share.

Status: pending

## E3. Stats Tier 2

- launch-year and death-year distributions;
- evidence depth;
- unknown-field rates;
- verification recency;
- country and origin summaries.

Status: pending

## E4. Stats Tier 3

- event internals;
- evidence internals;
- relationship coverage;
- record completeness;
- origin by status and type.

Status: pending

## E5. History snapshots

Show trend charts only after at least two comparable snapshots exist.

Status: pending

## E6. Search and internal links

Search identity fields remain canonical name, aliases, and original official domain. Link Stats, Timeline, Changelog, details, Methodology, and related entities.

Status: pending

## E7. SEO and structured discovery

- canonical metadata;
- Open Graph metadata;
- JSON-LD where appropriate;
- sitemap validation;
- machine-readable discovery links;
- internal-link validation.

Status: pending

---

# Phase F — English/Japanese bilingual publication

Estimated duration: 6-9 working days  
Estimated PRs: 5-6

English remains at root. Japanese uses `/ja/`. Canonical data stays single-source; translation is an overlay and must not translate IDs, slugs, enum values, URLs, publishers, or canonical evidence titles.

## F1. i18n foundations

Locale configuration, dictionaries, fallback rules, and localized copy overlays.

Status: pending

## F2. Japanese common UI

Header, footer, filters, buttons, labels, and disclaimers.

Status: pending

## F3. Japanese About and Methodology

Definitions, limitations, and correction guidance first.

Status: pending

## F4. Japanese registry routes

```text
/ja/
/ja/dead/
/ja/active/
/ja/exchange/[slug]/
```

Status: pending

## F5. Japanese Stats

Reuse identical numerical data and translate presentation only.

Status: pending

## F6. Locale validation and SEO

- `lang` and `hreflang`;
- locale canonical URLs;
- `og:locale`;
- localized sitemap entries;
- dictionary-key validation;
- locale-route validation.

Status: pending

---

# Phase G — Final integration audit and HEI v1.0

Estimated duration: 4-6 working days  
Estimated PRs: 4-5

## G1. Accessibility and interaction audit

Keyboard navigation, focus, controls, semantics, screen-reader labels, contrast, and mobile overflow.

Status: pending

## G2. Final URL-safety audit

Verify unsafe, repurposed, dead, redirected, and live-unverified behavior.

Status: pending

## G3. Production integration test

Test all routes, public reports, machine-readable files, sitemap, robots, locales, 404 behavior, Cloudflare production, weekly monitoring, and monthly review.

Status: pending

## G4. Operations runbook

Document record addition, corrections, event/evidence updates, monitoring review, watchlist resolution, stats snapshots, translation updates, incident response, rollback, and checkpoint updates.

Status: pending

## G5. Record the v1.0 baseline

Record release SHA, counts, maximum IDs, coverage values, known limitations, deferred work, and the next growth target.

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

## 5. Revised weekly schedule

| Week | Main work | Required result |
|---|---|---|
| 1 | A2 Batch 3-5 and true-missing closure | true missing origin reaches zero |
| 2 | Unknown review, lineage, permanent entity gate | Phase A complete |
| 3 | monitoring, watchlists, count regression | Phase B complete |
| 4 | candidate scans and thin CEX repair | growth queue fixed |
| 5 | DEX, perp DEX, hybrid batches | approximately 460-480 entities |
| 6 | DEX and historical batches | approximately 500-520 entities |
| 7 | historical batches and milestone audit | at least 550 entities |
| 8 | Changelog, Timeline, Evidence Health | public-value surfaces available |
| 9 | Monthly Snapshot, feeds, Stats generator | Phase D complete, Stats base ready |
| 10 | Stats tiers and history | analysis layer complete |
| 11 | search, links, SEO, i18n foundation | English discovery layer complete |
| 12 | Japanese primary routes and Stats | bilingual primary layer complete |
| 13 | accessibility, URL safety, integration | release candidate |
| 14 | runbook and release baseline | HEI v1.0 complete |

---

## 6. Pull-request checkpoint template

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

A PR changing counts must update both reviewed counts and maximum IDs. A PR not changing counts must say so explicitly.

---

## 7. Recovery procedure

1. Read this file from `main`.
2. Confirm actual current main SHA.
3. Compare it with Section 3.
4. Inspect open PRs and relevant branches.
5. Regenerate reviewed counts; never infer them from maximum IDs.
6. Run relevant validation commands.
7. Resume the first item whose completion gate is not satisfied.
8. Update this file in the same implementation PR.

---

## 8. Deferred beyond v1.0

- D1 migration;
- deployment-level DEX modeling;
- chain-specific deployment pages;
- public comments;
- live price, TVL, volume, or order-book data;
- rankings or recommendation scores;
- automatic canonical publication without review.

---

## 9. Recurring operation after v1.0

### Weekly

- automated monitoring;
- A/B/C candidate review;
- URL and evidence health review;
- monitoring PR only for meaningful findings.

### Monthly

- reviewed growth batch;
- Monthly Exchange Failure Snapshot;
- Registry Update;
- stats snapshot;
- stale-record repair;
- checkpoint refresh.

### Quarterly

- coverage review;
- archive review;
- low-confidence review;
- lineage review;
- active/dead reclassification review;
- search and SEO review.

Longer-term reviewed entity targets:

```text
v1.1: 750
v1.2: 1,000
v1.5: 2,000
long-term entity-only range: 4,000-6,000
```
