# HEI v1 Execution Roadmap

Status: active execution source of truth  
Project: Historical Exchange Index (HEI)  
Repository: `badjoke-lab/historical-exchange-index`  
Current checkpoint: 2026-06-22  
Target: HEI v1.0 and transition to recurring registry operations

The detailed pre-B1 roadmap is preserved at:

`docs/archive/HEI_V1_EXECUTION_ROADMAP_PRE_B1_2026-06-22.md`

This file is the current operational roadmap. Repository state is authoritative if this checkpoint and GitHub disagree.

---

## 1. Non-negotiable operating rules

### Canonical safety

Automated monitoring may create findings, reports, watchlists, artifacts, and monitoring pull requests. It must not directly modify:

```text
data/entities.json
data/events.json
data/evidence.json
```

Canonical changes require a reviewed normal pull request.

### Count semantics

```text
entities
= canonical entities
+ reviewed bundle entities representing genuinely new identities

events
= canonical events
+ reviewed bundle events

evidence
= canonical evidence
+ reviewed bundle evidence
```

Duplicate IDs with identical content count once. Conflicting duplicate IDs are errors.

### Record quality

Do not add thin records only to reach a numerical target. A normal new public record requires:

- a clear HEI-relevant identity;
- at least one meaningful event;
- normally two or more evidence records;
- source-backed status and date decisions;
- alias, slug, domain, and duplicate checks;
- conservative confidence and end-state classification.

### URL and origin discipline

- preserve original URLs as historical fields;
- use archived access for dead-side records;
- do not treat unsafe, repurposed, or dead domains as ordinary live links;
- do not infer origin from domain suffix, language, or unsupported secondary summaries;
- use `Unknown`, `Global`, or an ecosystem label where evidence does not support a country.

### Merge discipline

Before merge:

- inspect current `main` and the complete PR diff;
- confirm the expected head SHA;
- confirm all required checks;
- confirm count effects;
- update this checkpoint.

---

## 2. Current checkpoint

```text
Checkpoint date: 2026-06-22
Last confirmed main SHA: 261fea4a37b101f4bbb7a53efc4acd4b5c045357
Last merged implementation PR: #413 Add permanent entity quality audit
Current implementation PR: #414 Validate full monitoring after structural cleanup
Current phase: Phase B — Monitoring and count regression guarantees
Completed item: B1 — Full monitoring run after structural cleanup
Current item: B2 — Reorganize watchlists and resolutions
Cloudflare configuration changed by current work: no
Production deployment performed by current work: no
```

### Reviewed public counts

```text
Entities:  412
Events:    687
Evidence: 1608
```

### Maximum observed IDs

```text
Maximum entity ID:    hei_ex_000525
Maximum event ID:     hei_ev_002079
Maximum evidence ID:  hei_src_003197
```

### B1 completion result

```text
Projected entities audited:  412
Projected events audited:    687
Projected evidence audited: 1608
Monitoring groups:          7 / 7 ok
Monitoring execution errors:    0
Critical findings:              0
Canonical file modifications:   0
Invalid projected event fields: 0
Invalid projected evidence fields: 0
Closed Phase A debt rediscovered: 0
```

Permanent safeguards now include:

- projected-public enum validation in normal CI;
- full monitoring completion validation;
- canonical-file guard;
- reviewed bundle entity-ID remapping for monitor events and evidence;
- frozen pre-B1 lineage-review baseline;
- normalized reviewed-bundle event and evidence enums.

The B1 audit is recorded in:

`docs/audits/HEI_B1_FULL_MONITORING_2026-06-22.md`

### Known non-blocking queue

The B1 run retained five high findings for later work:

- ArcherSwap official-site DNS failure;
- CoinLoan has no projected evidence records;
- Garantex has no projected evidence records;
- Zipmex has no projected evidence records;
- sitemap is missing required static routes.

These are not critical B1 structural failures.

---

## 3. Completed execution phases

### Phase R0 — Roadmap placement

Status: **COMPLETED**

### Phase A — Structural entity-quality debt

Status: **COMPLETED**

- A1 official URL status normalization — PR #394;
- A2 country/origin cleanup and strict gate — PRs #399-#407;
- A3 lineage inventory and complete review — PRs #408-#411;
- A4 reviewed lineage application — PR #412;
- A5 permanent entity-quality audit — PR #413.

A5 baseline:

```text
Projected entities: 412
Critical structural findings: 0
Permanent PR/main gate: enabled
```

### Phase B1 — Full monitoring after structural cleanup

Status: **COMPLETED in PR #414**

Completion gate:

```text
critical monitoring findings = 0
monitor execution errors = 0
canonical guard passes
fixed structural issues are not rediscovered
projected enum violations = 0
```

### Phase B4 — Earlier production smoke baseline

Status: **COMPLETED for the earlier production baseline**

A final production integration smoke test remains part of G3 before v1.0.

---

## 4. Remaining execution order and schedule

```text
B2-B3  Monitoring state and count regression
C      Grow reviewed registry to at least 550 entities
D      Public-value update and research surfaces
E      Stats, internal linking, and SEO
F      English/Japanese bilingual publication
G      Final integration audit and HEI v1.0 baseline
```

Estimated remaining effort from the B1 completion checkpoint:

```text
Implementation PRs: approximately 34-46
Working days: approximately 36-55
Calendar estimate: approximately 8-12 weeks
```

The largest uncertainty remains Phase C. HEI must add at least 138 reviewed entities without accepting thin count-filler records.

---

# Phase B — Monitoring and count regression guarantees

Estimated remaining duration: 2-4 working days  
Estimated remaining PRs: 2-3

## B2. Reorganize watchlists and resolutions

Status: **CURRENT**

Candidate classes:

```text
A — strong add or update candidate
B — needs research or stronger evidence
C — out of scope, duplicate, or not an HEI exchange record
```

Resolution states:

```text
promoted
held
out_of_scope
duplicate
already_canonical
needs_research
```

Required work:

- define one authoritative candidate identity and dedupe key;
- retain historical resolutions;
- prevent promoted, duplicate, out-of-scope, and already-canonical items from returning as new;
- expose aged A candidates;
- preserve B research queues without repeatedly creating identical findings;
- keep C resolutions auditable.

Completion gate:

```text
processed candidates do not repeatedly return as new
aged A candidates are visible
duplicate and C resolutions are retained
resolution schema and validation exist
monitoring-health uses the reorganized state
```

## B3. Count-semantics regression tests

Status: pending

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

## C2-C3. Repair thin active CEX records

Improve existing active records lacking clear identity, launch evidence, current-status evidence, original domain, origin, or normal evidence depth.

## C4-C5. DEX, perp DEX, and hybrid batches

Rules:

- model entity identity rather than deployment rows;
- start with small public-quality batches;
- do not classify a protocol as dead only because one frontend disappeared;
- use `inactive` where permanent end-state evidence is weak.

Expected contribution: approximately 55-70 entities.

## C6-C7. Historical dead, acquired, merged, and rebranded batches

Prioritize official shutdown, bankruptcy, liquidation, regulatory termination, permanent post-hack closure, acquisition, merger, clear rebrand, and preserved archive evidence.

Expected contribution: approximately 70-85 entities.

## C8. Review the 550-entity milestone

Completion gate:

```text
reviewed public entities >= 550
all additions meet public quality
no thin count-filler batch accepted
all CI and record validations green
duplicate, balance, archive, confidence, origin, and evidence-depth audit passes
```

---

# Phase D — Public-value update and research surfaces

Estimated duration: 5-7 working days  
Estimated PRs: 4-5

Planned surfaces:

- D1 Registry Update / Changelog generated only from merged reviewed changes;
- D2 Exchange Incident Timeline;
- D3 safe public Evidence Health aggregates;
- D4 Monthly Exchange Failure Snapshot;
- D5 RSS and JSON feeds for reviewed updates.

Internal danger lists and unreviewed candidates must not be exposed.

---

# Phase E — Stats, internal linking, and SEO

Estimated duration: 7-10 working days  
Estimated PRs: 5-7

Planned work:

- stats generator and schemas;
- Tier 1 totals and coverage;
- Tier 2 date, evidence-depth, unknown-field, recency, and origin summaries;
- Tier 3 event, evidence, lineage, and completeness internals;
- comparable history snapshots;
- search and related-entity links;
- canonical metadata, Open Graph, JSON-LD, sitemap, discovery, and internal-link validation.

Trend charts require at least two comparable snapshots.

---

# Phase F — English/Japanese bilingual publication

Estimated duration: 6-9 working days  
Estimated PRs: 5-6

English remains at root. Japanese uses `/ja/`. Canonical data remains single-source; translation is an overlay.

Planned work:

- i18n foundations and fallback rules;
- Japanese common UI;
- Japanese About and Methodology;
- `/ja/`, `/ja/dead/`, `/ja/active/`, and `/ja/exchange/[slug]/`;
- Japanese Stats presentation using identical numerical data;
- `lang`, `hreflang`, locale canonical URLs, `og:locale`, sitemap, dictionary, and route validation.

Do not translate IDs, slugs, enums, URLs, publishers, or canonical evidence titles.

---

# Phase G — Final integration audit and HEI v1.0

Estimated duration: 4-6 working days  
Estimated PRs: 4-5

Planned work:

- accessibility and interaction audit;
- final URL-safety audit;
- production integration test;
- operations runbook;
- v1.0 release baseline.

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

---

## 5. Revised schedule from the B1 checkpoint

| Relative week | Main work | Required result |
|---|---|---|
| 1 | B2 watchlists/resolutions and B3 count regression | Phase B complete |
| 2 | candidate scans and thin active CEX repair | growth queue fixed |
| 3-4 | DEX, perp DEX, hybrid batches | approximately 460-490 entities |
| 5-6 | historical batches and milestone audit | at least 550 entities |
| 6-7 | Changelog, Timeline, Evidence Health, Monthly Snapshot, feeds | Phase D complete |
| 7-9 | Stats tiers, history, search, links, SEO | Phase E complete |
| 9-10 | i18n foundation and Japanese primary routes | bilingual primary layer complete |
| 11 | accessibility, URL safety, and integration | release candidate |
| 12 | runbook, final production smoke, and release baseline | HEI v1.0 complete |

This is a sequencing estimate, not a deadline. Phase C may extend the calendar when evidence quality is insufficient.

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

A PR changing counts must update reviewed counts and maximum IDs. A PR not changing counts must state that explicitly.

---

## 7. Recovery procedure

1. Read this file from `main`.
2. Confirm actual current main SHA.
3. Compare it with Section 2.
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
- URL and evidence-health review;
- monitoring PR only for meaningful findings.

### Monthly

- reviewed growth batch;
- Monthly Exchange Failure Snapshot;
- Registry Update;
- stats snapshot;
- stale-record repair;
- checkpoint refresh.

### Quarterly

- coverage, archive, low-confidence, lineage, classification, search, and SEO review.

Longer-term reviewed entity targets:

```text
v1.1: 750
v1.2: 1,000
v1.5: 2,000
long-term entity-only range: 4,000-6,000
```
