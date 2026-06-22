# HEI v1 Execution Roadmap

Status: active execution source of truth  
Project: Historical Exchange Index (HEI)  
Repository: `badjoke-lab/historical-exchange-index`  
Current checkpoint: 2026-06-22  
Target: HEI v1.0 and transition to recurring registry operations

The detailed pre-B1 roadmap is preserved at:

`docs/archive/HEI_V1_EXECUTION_ROADMAP_PRE_B1_2026-06-22.md`

Repository state is authoritative if this checkpoint and GitHub disagree.

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
+ reviewed bundle events deduplicated by ID

evidence
= canonical evidence
+ reviewed bundle evidence deduplicated by ID
```

Repair bundles do not increase entity count. Identical duplicate IDs count once. Conflicting duplicate IDs are errors.

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
Last confirmed main SHA: 3816647b6e7dcd30fea3286bfc3d15fdc4171d38
Last merged implementation PR: #417 Add count semantics regression gate
Current implementation PR: #418 Classify the first Phase C candidate scan
Current phase: Phase C — Reviewed registry growth
Completed item: C1 — Candidate scans and growth queue selection
Current item: C2 — Draft the first growth batch of eight entities
Cloudflare configuration changed by current work: no
Production deployment performed by current work: no
```

### Reviewed public counts

```text
Entities:  412
Events:    691
Evidence: 1620
```

### Maximum observed IDs

```text
Maximum entity ID:    hei_ex_000525
Maximum event ID:     hei_ev_002083
Maximum evidence ID:  hei_src_003209
```

### Count composition

```text
Canonical entities:  306
Canonical events:    513
Canonical evidence: 1172

Reviewed bundles: 152
New-entity bundles: 106
Repair bundles:      46
```

### B1 completion result

```text
Monitoring groups: 7 / 7 ok
Monitoring execution errors: 0
Critical findings: 0
Canonical file modifications: 0
Closed Phase A debt rediscovered: 0
```

Audit:

`docs/audits/HEI_B1_FULL_MONITORING_2026-06-22.md`

### B2 completion result

```text
Resolution index entries: 66
Promoted: 14
Held: 31
Out of scope: 8
Duplicate: 0
Already canonical: 2
Needs research: 11
Historical resolution coverage errors: 0
Raw watchlist rows: 193
Unique candidate identities: 162
Repeated rows collapsed: 31
Reviewed queue coverage failures: 0
```

Audit:

`docs/audits/HEI_B2_WATCHLIST_RESOLUTION_2026-06-22.md`

### B3 completion result

```text
Projected registry:     412 / 691 / 1620
Monitoring aggregate:   412 / 691 / 1620
Machine-readable data:  412 / 691 / 1620
Built public data:      412 / 691 / 1620
Exchange detail pages:  412
Sitemap exchange routes: 412
Sitemap total routes:    419
Bundle ID conflicts:       0
```

B3 discovered and corrected 16 hidden ID conflicts:

```text
Event conflicts:    4
Evidence conflicts: 12
Affected bundles: CoinLoan, Zipmex, Garantex
```

These records had been silently omitted by older deduplication behavior. Restoring them changed supporting-record counts from `687 / 1608` to `691 / 1620` without changing entity count.

Audit:

`docs/audits/HEI_B3_COUNT_SEMANTICS_2026-06-22.md`

### C1 completion result

```text
Candidates reviewed:        42
Add now:                    10
Needs further research:      1
Pending thin:               31
Out of scope or duplicate:   0
First growth batch:          8
Second growth batch:         2
```

First growth batch:

```text
Curve Finance
DX.Exchange
dYdX
LFJ
Orca
Osmosis
QuickSwap
THORChain
```

Second growth batch:

```text
Aevo
gTrade
```

Jupiter Perpetuals remains in research because its entity boundary versus the wider Jupiter platform is unresolved.

Audit:

`docs/audits/HEI_C1_CANDIDATE_SCAN_01_2026-06-22.md`

### Known non-blocking queue

- ArcherSwap official-site DNS failure.

The earlier CoinLoan, Garantex, Zipmex evidence warnings and sitemap-route warning were resolved by B3.

---

## 3. Completed phases

### Phase R0 — Roadmap placement

Status: **COMPLETED**

### Phase A — Structural entity-quality debt

Status: **COMPLETED**

- A1 official URL status normalization — PR #394;
- A2 country/origin cleanup and strict gate — PRs #399-#407;
- A3 lineage inventory and complete review — PRs #408-#411;
- A4 reviewed lineage application — PR #412;
- A5 permanent entity-quality audit — PR #413.

### Phase B — Monitoring and count guarantees

Status: **COMPLETED**

- B1 full post-cleanup monitoring — PR #414;
- B2 watchlist and resolution reorganization — PR #416;
- B3 count-semantics regression — PR #417;
- B4 earlier production smoke baseline — completed for the earlier production baseline.

Permanent Phase B safeguards:

- projected-public enum validation;
- seven-monitor completion validation;
- canonical-file guard;
- stable candidate identity and authoritative resolution state;
- terminal-candidate staging exclusion;
- reviewed queue coverage;
- repair/new-bundle count semantics;
- cross-layer count and ID-set equality;
- strict bundle event/evidence ID collision detection;
- detail-page and sitemap route-count validation.

A final production integration smoke test remains part of Phase G.

---

## 4. Remaining execution order and schedule

```text
C      Grow reviewed registry to at least 550 entities
D      Public-value update and research surfaces
E      Stats, internal linking, and SEO
F      English/Japanese bilingual publication
G      Final integration audit and HEI v1.0 baseline
```

Estimated remaining effort from the C1 completion checkpoint:

```text
Implementation PRs: approximately 31-43
Working days: approximately 33-52
Calendar estimate: approximately 8-12 weeks
```

The largest uncertainty remains Phase C. HEI must add at least 138 reviewed entities without accepting thin count-filler records.

---

# Phase C — Grow the reviewed registry to 550 entities

Status: **CURRENT**  
Starting reviewed count: 412  
Required net additions: at least 138  
Estimated duration: 15-25 working days  
Estimated PRs: 14-19

## C1. Candidate scans and queue selection

Status: **COMPLETED in PR #418**

The first scan reviewed all 42 open B2 candidates:

```text
add_now:                    10
needs_research:              1
pending_thin:               31
out_of_scope_or_duplicate:   0
```

Completed work:

- fixed stable candidate keys and one disposition for every open candidate;
- reviewed the eleven priority candidates against official and independent sources;
- corrected product-style names to canonical entity identities;
- retained Jupiter Perpetuals for entity-boundary research;
- fixed an eight-entity first growth batch and a two-entity second batch;
- added a permanent candidate-scan schema and evidence-shape gate.

Completion gate:

```text
42 candidates reviewed
all candidates have one disposition
10 add_now candidates meet minimum source shape
no terminally resolved candidate returned as new
first growth batch fixed at 8 entities
```

## C2. First growth batch record drafting

Status: **CURRENT**

Draft reviewed record bundles for:

```text
Curve Finance
DX.Exchange
dYdX
LFJ
Orca
Osmosis
QuickSwap
THORChain
```

The batch may be split into smaller implementation PRs, but the selected identities and naming decisions are fixed by C1.

## C3. Repair thin active CEX records

Improve existing active records lacking clear identity, launch evidence, current-status evidence, original domain, origin, or normal evidence depth.

Repair bundles must not increase entity count and must pass the B3 count gate.

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
public, monitoring, and machine counts agree
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

## 5. Revised schedule from the B3 checkpoint

| Relative week | Main work | Required result |
|---|---|---|
| 1 | C1 scans, thin active CEX review, first growth batch | growth queue and batch cadence fixed |
| 2-4 | DEX, perp DEX, hybrid batches | approximately 460-490 entities |
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
