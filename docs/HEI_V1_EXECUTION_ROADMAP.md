# HEI v1 Execution Roadmap

Status: active execution source of truth  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-07-06  
Target: HEI v1.0 and recurring registry operations

Repository state is authoritative when this checkpoint and GitHub disagree.

## 1. Required reference set

Before implementation work, read in this order:

1. `AGENTS.md`;
2. `docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md`;
3. `config/cloudflare-pages-project.json`;
4. this roadmap;
5. `docs/HEI_PRODUCT_SURFACES_SPEC.md` for public product-surface work;
6. the relevant schema, monitoring, record-growth, machine-readable, localization, or audit document for the task.

Every implementation PR must identify:

- roadmap item;
- relevant specification section;
- canonical count impact;
- deployment impact;
- validation performed;
- production verification plan when public output changes.

## 2. Operating rules

- Canonical changes require reviewed pull requests.
- Automated monitoring must not directly edit canonical data.
- Do not add thin records to satisfy a count target.
- Preserve historical URLs and conservative status decisions.
- Confirm the full diff and required checks before merge.
- Raw monitoring findings remain internal unless reviewed into a safe public form.
- Public product features must query reviewed public data only.
- Do not introduce risk scores, free-form AI truth claims, or unreviewed candidate exposure.
- Update this checkpoint when counts, phase state, active item, or execution order materially changes.

## 3. Current checkpoint

```text
Implementation baseline SHA before current D-3 work: ac626337e04847e2a5db7c3119aaf54b256f3213
Last merged implementation PR: #535 Add reviewed Exchange Incident Timeline
Current phase: Phase D — Change layer completion
Completed items after this PR merges: D-1 Registry Update / D-2 Incident Timeline / D-3 Evidence Health and Data Quality
Current item after this PR merges: D-4 Monthly Historical Exchange Snapshot
Next item after D-4: D-5 RSS and JSON reviewed-update feeds
Cloudflare configuration changes required for D-4: none expected
Production verification: required when a new public route or public feed is merged
```

## 4. Current reviewed state

```text
Entities:  550
Events:    1004
Evidence: 2621
Maximum entity ID:   hei_ex_000666
Maximum event ID:    hei_ev_010080
Maximum evidence ID: hei_src_011312
```

These counts are unchanged by D-2 and D-3. Both phases add public surfaces derived from reviewed public records and do not modify canonical entity, event, or evidence records.

## 5. Completed foundation

### 5.1 Phase C milestone

```text
entity target:                     550 / 550
count semantics:                   pass
records validation:                pass
country origin strict gate:        pass
active CEX / DEX readiness:        pass
watchlist resolution gate:         pass
entity quality critical findings:  0
entity quality high findings:      0
Phase C status:                    complete
```

Audit source of truth:

```text
docs/audits/HEI_PHASE_C_MILESTONE_AUDIT_2026-07-05.md
```

Remaining quality queues continue through reviewed repair batches and do not reopen count-driven growth as the primary milestone.

### 5.2 Verified-unadded range 0401-0450

```text
range records:                 50
promoted add_now:               7
promoted research:             17
existing duplicates consumed:   2
unresolved add_now:              0
unresolved needs_research:       0
pending_thin:                   16
out_of_scope_or_duplicate:       8
range status:                   closed
```

### 5.3 Existing public foundation

Implemented:

- registry browsing and exchange detail pages;
- active-side and dead-side views;
- exchange timeline and evidence presentation;
- `/stats/` analysis surface;
- monitoring and recurring review infrastructure;
- machine-readable public layer;
- reviewed canonical entity, event, and evidence JSON publication;
- public HTML / JSON / metadata consistency validation;
- `/updates/` reviewed Registry Update surface;
- `/incidents/` Exchange Incident Timeline;
- `/quality/` Evidence Health and Data Quality public summary after D-3 merge.

Stats is not a future build dependency. It is an existing analysis layer that will later gain Explorer deep links.

## 6. Execution model

HEI proceeds through four coordinated lanes.

### Lane A — Data and quality

```text
continuous candidate discovery
reviewed record additions
existing entity/event/evidence strengthening
status and lifecycle updates
medium/low quality repair batches
archive and evidence improvements
```

This lane continues throughout the schedule. It must not displace the active product phase unless unresolved data-contract issues block it.

### Lane B — Product surfaces

```text
Phase D Change layer completion
Phase E discovery foundation hardening
Phase E.5 Explorer v1
Phase F multilingual layer
Phase G v1.0 integration
post-v1.0 Compare evaluation
```

### Lane C — Operations

```text
monitoring
quality monitoring
canonical update tracking
reviewed Registry Updates
monthly reviewed snapshots
optional post-v1.0 Discovery Log trial
```

Monitoring output remains internal until reviewed into a public-safe form.

### Lane D — Machine use

```text
stable canonical JSON
schema stability
version and manifest integrity
machine-readable public layer
reviewed update feeds
conditional API expansion only if consumer need is demonstrated
```

A new API phase does not precede Explorer.

## 7. Phase D — Change layer completion

Purpose: make registry change and historical activity visible without turning HEI into a breaking-news site.

```text
D-1 HEI Registry Update surface                         COMPLETE
D-2 Exchange Incident Timeline                         COMPLETE
D-3 Evidence Health and Data Quality public summary   COMPLETE AFTER CURRENT PR MERGE
D-4 Monthly Historical Exchange Snapshot              NEXT
D-5 RSS and JSON feeds for reviewed public updates    PENDING
D-6 Quality repair batches                             PARALLEL
```

### D-2 completion record

D-2 includes:

- `/incidents/` public route;
- deterministic incident extraction from reviewed event records;
- explicit incident event-type allowlist;
- reverse chronological ordering with year grouping;
- event type and impact presentation;
- links to canonical exchange dossiers;
- event-linked evidence counts;
- sitemap, navigation, machine-readable discovery, monitoring, and public-output validation integration;
- no raw monitoring output;
- no unreviewed candidates;
- no canonical data changes.

### D-3 completion record

D-3 includes:

- `/quality/` public route;
- a public summary builder reusing the existing Stats calculation layer;
- entity confidence distribution;
- evidence reliability distribution;
- evidence depth per entity;
- record freshness bands;
- archive, date, origin, domain, and confidence coverage metrics;
- evidence source-type and claim-scope breakdowns;
- selected missing-field counts and completeness indicators;
- public metric definitions and explicit denominator notes;
- explicit statement that coverage metrics do not certify registry completeness;
- explicit exclusion of internal monitoring findings, private research notes, unresolved candidate queues, and operator-only repair priorities;
- sitemap, footer, machine-readable discovery, monitoring, and public-output validation integration;
- independent validator recomputation of headline quality metrics from reviewed data;
- no canonical data changes.

D-3 completion gate:

```text
public quality summary exists
private monitoring and research notes are not exposed
metric definitions and denominators are documented
headline quality values are independently recomputed in validation
route, sitemap, discovery, and canonical metadata checks pass
```

### D-4 Monthly Historical Exchange Snapshot

Work:

- present a reviewed monthly historical snapshot;
- summarize relevant shutdown, hack, exploit, withdrawal suspension, regulatory action, acquisition, merger, and rebrand events represented in reviewed data;
- preserve historical context rather than imitate general news coverage;
- state review period and snapshot generation time separately;
- link included items to canonical exchange/event context where available;
- reuse existing monthly review aggregation where appropriate without publishing internal review artifacts wholesale.

Completion gate:

```text
monthly snapshot format is stable
period and snapshot time are explicit
all included records are review-safe
links resolve to canonical public context where available
internal review artifacts remain private
```

### D-5 RSS and JSON feeds

Work:

- expose reviewed Registry Update and other safe public change outputs;
- define stable feed schemas and URLs;
- exclude raw monitoring data and unmerged candidates;
- validate ordering, IDs, timestamps, and public-data safety;
- update machine-readable discovery where appropriate.

Completion gate:

```text
RSS feed valid
JSON feed valid
stable identifiers documented
reviewed-only boundary tested
manifest and discovery references updated where appropriate
```

## 8. Phase E — Discovery foundation hardening

Purpose: prepare navigation, linking, metadata, and route behavior before Explorer v1.

Stats already exists. Phase E is not a Stats implementation phase.

```text
E-1 internal-link audit and repair
E-2 SEO and metadata consistency audit
E-3 sitemap and canonical-route consistency
E-4 public route discovery and cross-surface navigation audit
E-5 Stats readiness for Explorer deep links
```

Completion gate:

```text
core public routes discoverable
internal links valid
canonical metadata coherent
sitemap aligned with intended public routes
Stats dimensions mapped to planned Explorer query semantics
```

## 9. Phase E.5 — Explorer v1

Product source of truth:

```text
docs/HEI_PRODUCT_SURFACES_SPEC.md
```

Explorer v1 includes:

```text
Entity Explorer
Event Explorer
shareable URL query state
Stats -> Explorer deep links
Timeline / Updates -> Explorer cross-links where useful
```

Explorer v1 excludes:

```text
Evidence Explorer
risk scores
free-form Ask HEI
AI-generated classifications
Natural Language Filter Translator
Compare view
```

Recommended implementation order:

```text
E5-1 Explorer implementation specification and query contract
E5-2 Entity Explorer
E5-3 Event Explorer
E5-4 Stats -> Explorer deep links
E5-5 Timeline / Updates -> Explorer cross-links
E5-6 accessibility, URL-state, crawl-control, and regression audit
```

Completion gate:

```text
entity filters deterministic and tested
event filters deterministic and tested
query state round-trips through shareable URLs
malformed query values fail safely or fall back predictably
Stats deep links resolve to correct Explorer states
reviewed public data boundary enforced
query URL crawl behavior controlled
keyboard and mobile interaction audited
```

## 10. Phase F — English root and Japanese `/ja/`

Work:

- keep English as root canonical language;
- add Japanese `/ja/` routes using translation overlays;
- localize UI, methodology, about, Stats, Update, Timeline, Quality, and Explorer labels in dependency order;
- keep query parameter keys and enum values locale-independent;
- preserve a single canonical factual data source.

Completion gate:

```text
English root stable
Japanese route structure stable
no divergent factual datasets
locale-independent Explorer query semantics
translation fallback behavior tested
```

## 11. Phase G — v1.0 integration baseline

```text
G-1 accessibility audit
G-2 URL safety audit
G-3 cross-surface navigation and integration audit
G-4 machine-readable and public-output consistency audit
G-5 production integration and verification
G-6 maintainer runbook and recovery procedure validation
G-7 v1.0 baseline tag/checkpoint
```

Completion gate:

```text
critical accessibility issues = 0
critical URL-safety issues = 0
critical public-data consistency issues = 0
all required public routes verified
machine-readable outputs match reviewed public data
runbook can recover phase and next action from repository documents
v1.0 baseline recorded
```

## 12. Post-v1.0 sequence

Post-v1.0 work must not displace the active v1.0 path.

```text
Phase H   Compare v1
Phase I   Discovery Log trial
Phase J   Natural Language Filter Translator only if Explorer usage justifies it
Phase K   API expansion only if consumer demand justifies it
```

### H — Compare v1

Compare follows Explorer and v1.0. It may compare reviewed facts such as type, launch date, terminal date, status, death reason, lifespan, major events, evidence count, archive status, origin, and confidence.

No synthetic risk score is allowed.

### I — Discovery Log trial

A reviewed Discovery Log may summarize promotions, pending-thin outcomes, duplicates, and out-of-scope decisions without exposing private research notes or raw monitoring data.

### J — Natural Language Filter Translator

Conditional only. Its role is limited to translating user language into validated Explorer parameters. Deterministic Explorer results remain authoritative.

Free-form AI classification of exchange history is not part of the plan.

### K — API expansion

Conditional only. Do not add API endpoints merely for appearance. Stable JSON, schema behavior, manifests, feeds, and Explorer contracts come first.

## 13. Indefinite backlog and rejected active priorities

### Indefinite backlog

```text
Public Comments
```

Comments remain deferred because moderation, spam, source disputes, legal risk, and community-management cost do not justify displacement of core registry work.

### Not part of the active roadmap

```text
Risk Score
AI Summary vs Human Summary
free-form Ask HEI
raw monitoring publication
general crypto breaking-news operation
Weekly Exchange Watch as a scheduled product phase
```

## 14. Immediate schedule from the current checkpoint

```text
1. D-4 Monthly Historical Exchange Snapshot
2. D-5 RSS and JSON reviewed-update feeds
3. Phase E discovery foundation hardening
4. Phase E.5 Explorer v1
5. Phase F bilingual layer
6. Phase G v1.0 integration baseline
7. Post-v1.0 evaluation sequence
```

Lane A quality repair and reviewed record growth continue in parallel without replacing the main product sequence.

GitHub-side work can continue without Cloudflare access unless a task specifically requires deployment configuration or production verification.

## 15. Recovery procedure

When resuming HEI work:

1. Confirm current `main`, open PRs, and actual reviewed counts.
2. Read `AGENTS.md` and the Cloudflare deployment policy.
3. Read this roadmap.
4. Read `docs/HEI_PRODUCT_SURFACES_SPEC.md` for public product-surface work.
5. Read the task-specific schema, monitoring, machine-readable, localization, or audit document.
6. Resume the first incomplete item in the active phase.
7. In the PR body, cite the roadmap item and relevant specification section.
8. Update this checkpoint whenever counts, phase, active item, or execution order materially changes.

Do not use remembered chat history as the execution source of truth when repository documents and current GitHub state can be inspected directly.
