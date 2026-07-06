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
6. the task-specific schema, monitoring, record-growth, machine-readable, localization, audit, or feed-contract document.

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
Last merged implementation PR: #541 Add generated-output SEO metadata audit
Current PR: #542 Add sitemap and canonical route-set audit
Current phase: Phase E — Discovery foundation hardening
Completed after current PR merges: E-1 Internal links / E-2 SEO metadata / E-3 Sitemap consistency
Current item after current PR merges: E-4 Public route discovery and cross-surface navigation audit
Next item after E-4: E-5 Stats readiness for Explorer deep links
Cloudflare configuration changes required for E-4: none expected
Production verification: required when public routes, feeds, metadata output, or deployment-sensitive behavior changes
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

Phase D and Phase E discovery audits do not change canonical entity, event, or evidence counts unless a separate reviewed data PR explicitly does so.

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

### 5.2 Current public foundation

Implemented:

- registry browsing and exchange detail pages;
- active-side and dead-side views;
- exchange timeline and evidence presentation;
- `/stats/` analysis surface;
- `/updates/` reviewed Registry Update surface;
- `/incidents/` Exchange Incident Timeline;
- `/quality/` Evidence Health and Data Quality public summary;
- `/monthly/` Monthly Historical Exchange Snapshot;
- `/feeds/updates.json` JSON Feed 1.1;
- `/feeds/updates.xml` RSS 2.0;
- reviewed entity/event/evidence JSON publication;
- machine-readable version and manifest layer;
- public-output consistency validation;
- generated-output internal-link audit;
- generated-output SEO metadata audit;
- exact sitemap/canonical route-set audit after E-3 merge.

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
Phase D Change layer completion          COMPLETE
Phase E Discovery foundation hardening  ACTIVE
Phase E.5 Explorer v1
Phase F Multilingual layer
Phase G v1.0 integration
Post-v1.0 Compare evaluation
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

Status: **COMPLETE** after PR #538.

```text
D-1 HEI Registry Update surface                         COMPLETE
D-2 Exchange Incident Timeline                         COMPLETE
D-3 Evidence Health and Data Quality public summary   COMPLETE
D-4 Monthly Historical Exchange Snapshot              COMPLETE
D-5 RSS and JSON feeds for reviewed public updates    COMPLETE
D-6 Quality repair batches                             PARALLEL CONTINUOUS LANE
```

Key completed outputs:

- `/updates/` reviewed public changelog;
- `/incidents/` reviewed incident timeline;
- `/quality/` public aggregate evidence/data-quality summary;
- `/monthly/` reviewed monthly historical snapshot;
- reviewed-only JSON Feed and RSS output;
- fixed feed contract in `docs/HEI_REVIEWED_UPDATE_FEEDS_SPEC.md`;
- raw monitoring output and unreviewed candidates excluded from public Change-layer outputs.

## 8. Phase E — Discovery foundation hardening

Purpose: prepare navigation, metadata, route consistency, and Stats/query semantics before Explorer v1.

Stats already exists. Phase E is not a Stats implementation phase.

Execution order:

```text
E-1 Internal-link audit and repair                    COMPLETE
E-2 SEO and metadata consistency audit               COMPLETE
E-3 Sitemap and canonical-route consistency          COMPLETE AFTER CURRENT PR MERGE
E-4 Public route discovery and cross-surface navigation audit   NEXT
E-5 Stats readiness for Explorer deep links
```

### E-1 Internal-link audit and repair

Implementation:

- scan generated HTML output;
- resolve internal route and static-output links;
- validate same-page and cross-page fragment IDs;
- ignore external origins and non-navigation schemes;
- run self-test and generated-output audit under `public:validate`.

Completion result:

```text
reusable internal-link audit: present
self-test: pass
generated-output audit: pass
broken internal route targets: 0
checked fragment failures: 0
repairs required from initial audit: 0
```

### E-2 SEO and metadata consistency audit

Implementation:

- validate title and description presence;
- validate canonical presence, exact route ownership, and uniqueness;
- validate Open Graph and Twitter metadata;
- validate Updates JSON Feed/RSS alternates;
- normalize equivalent trailing-slash route forms where appropriate;
- exclude 404 and ownership-verification HTML from normal public-page contracts;
- add route-specific social metadata for Stats, Quality, Updates, Incidents, Monthly, Methodology, About, and Donate;
- emit machine-readable diagnostics artifact.

Completion result:

```text
audited public pages: 561
metadata findings: 0
missing page titles: 0
missing page descriptions: 0
missing or duplicate canonicals: 0
canonical route mismatches: 0
critical Open Graph metadata gaps: 0
Updates feed alternate mismatches: 0
```

### E-3 Sitemap and canonical-route consistency

Implementation:

- exact sitemap set comparison rather than count-only validation;
- expected set = 11 static public routes + every reviewed public exchange route;
- parse reviewed public entity output for expected exchange slugs;
- verify duplicate sitemap URLs = 0;
- verify all sitemap URLs resolve to generated HTML output;
- verify each sitemap target has one canonical URL;
- verify canonical URL exactly matches the sitemap URL;
- verify non-root sitemap page URLs use the trailing-slash policy;
- verify JSON/RSS feed endpoints stay outside the page sitemap;
- verify obsolete `/all`, `/registry`, and `/exchanges` route families are absent;
- verify their redirect contracts remain present and use `/ 301` targets;
- run auditor self-test and real generated-output audit under `public:validate`.

Completion result:

```text
expected sitemap URLs: 561
static routes: 11
exchange routes: 550
exact route-set comparison: pass
duplicate sitemap URLs: 0
missing reviewed exchange routes: 0
unexpected sitemap routes: 0
missing generated route outputs: 0
canonical/sitemap mismatches: 0
trailing-slash mismatches: 0
feed URLs in page sitemap: 0
obsolete routes in sitemap: 0
obsolete redirect contract: pass
repairs required from initial audit: 0
```

Completion gate:

```text
reusable sitemap/canonical audit exists      pass
sitemap expected route set matches output   pass
entity route coverage complete              pass
obsolete routes excluded                    pass
canonical/trailing-slash policy consistent  pass
feed endpoints excluded                     pass
duplicate sitemap URLs = 0                  pass
```

### E-4 Public route discovery and cross-surface navigation audit

Work:

- define intended discovery paths for Registry, Analysis, Change, Trust/Methodology, and Support surfaces;
- verify every core public surface is reachable from an intended header, footer, or contextual path;
- check header and footer hierarchy;
- check direct relationships among Stats, Quality, Updates, Incidents, and Monthly;
- verify page-level contextual links where useful;
- detect orphan public surfaces;
- avoid turning the header into a dashboard-style menu;
- document intended navigation hierarchy before Explorer is added;
- add reusable generated-output discovery/navigation checks where deterministic.

Completion gate:

```text
core surface discovery paths documented
all core surfaces reachable from intended entry points
no orphan public surface
header/footer hierarchy reviewed
cross-surface contextual links verified
```

### E-5 Stats readiness for Explorer deep links

Work:

- map Stats dimensions to future Explorer filter semantics;
- identify which Stats blocks will receive deep links;
- identify display-label versus canonical enum/query-value mismatches;
- define entity-view versus event-view mappings;
- produce the handoff required by E5-1 Explorer query-contract work.

Completion gate:

```text
Stats dimensions mapped
future query keys identified
enum/query value mapping documented
entity/event destination mode documented
E5-1 handoff ready
```

Phase E completion gate:

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
- localize UI, Methodology, About, Stats, Updates, Incidents, Quality, Monthly, and Explorer labels in dependency order;
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
G-1 Accessibility audit
G-2 URL safety audit
G-3 Cross-surface navigation and integration audit
G-4 Machine-readable and public-output consistency audit
G-5 Production integration and verification
G-6 Maintainer runbook and recovery procedure validation
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
1. E-4 Public route discovery and cross-surface navigation audit
2. E-5 Stats readiness for Explorer deep links
3. Phase E.5 Explorer v1
4. Phase F bilingual layer
5. Phase G v1.0 integration baseline
6. Post-v1.0 evaluation sequence
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
