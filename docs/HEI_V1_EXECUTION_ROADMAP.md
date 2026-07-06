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
6. the relevant schema, monitoring, record-growth, machine-readable, localization, audit, or task-specific document.

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
Implementation baseline before E-1: 8cbc861ca53cd9f65e91e84ecb8f6bf62698c29f
Last merged implementation PR: #538 Add reviewed Registry Update RSS and JSON feeds
Current phase: Phase E — Discovery foundation hardening
Completed item after this PR merges: E-1 Internal-link audit and repair
Current item after this PR merges: E-2 SEO and metadata consistency audit
Next item after E-2: E-3 Sitemap and canonical-route consistency
Cloudflare configuration changes required for E-2: none expected
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

Phase D and the Phase E audits do not change canonical entity, event, or evidence counts unless a separate reviewed data PR explicitly does so.

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
- reusable generated-output internal-link audit after E-1 merge.

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

### D-1 Registry Update

- reviewed update data source;
- `/updates/` public changelog;
- canonical-only publication rule;
- raw monitoring findings excluded.

### D-2 Incident Timeline

- `/incidents/` route;
- deterministic reviewed-event extraction;
- explicit incident event-type allowlist;
- reverse chronology and year grouping;
- dossier links and event-linked evidence counts;
- sitemap, discovery, monitoring, and output validation integration.

### D-3 Quality Summary

- `/quality/` route;
- confidence, reliability, evidence depth, freshness, and coverage metrics;
- source-type and claim-scope breakdowns;
- denominator notes and non-completeness disclaimer;
- independent headline metric recomputation;
- internal repair queues and monitoring output excluded.

### D-4 Monthly Snapshot

- `/monthly/` route;
- latest completed UTC month selection;
- review period separated from generation date;
- deterministic reviewed-event allowlist;
- monthly event, exchange, impact, and evidence counts;
- chronological dossier-linked list;
- explicit empty-month behavior;
- internal monthly-review artifacts excluded.

### D-5 Reviewed Feeds

- JSON Feed 1.1 and RSS 2.0;
- reviewed Registry Update source only;
- stable `urn:hei:registry-update:<id>` identities;
- deterministic `date desc`, then `id asc` ordering;
- stable anchored item URLs;
- feed discovery in Updates, version, manifest, llms.txt, and ai.txt;
- build, export, and production-check validation;
- fixed contract in `docs/HEI_REVIEWED_UPDATE_FEEDS_SPEC.md`.

## 8. Phase E — Discovery foundation hardening

Purpose: prepare navigation, metadata, route consistency, and Stats/query semantics before Explorer v1.

Stats already exists. Phase E is not a Stats implementation phase.

Execution order:

```text
E-1 Internal-link audit and repair                    COMPLETE AFTER CURRENT PR MERGE
E-2 SEO and metadata consistency audit               NEXT
E-3 Sitemap and canonical-route consistency
E-4 Public route discovery and cross-surface navigation audit
E-5 Stats readiness for Explorer deep links
```

### E-1 Internal-link audit and repair

Implementation:

- scan all generated `out/**/*.html` files;
- collect internal `href` values;
- resolve root-relative, relative, and same-origin absolute URLs;
- resolve generated HTML routes and static JSON/XML/TXT files;
- validate same-page and cross-page fragment IDs where present;
- ignore external origins and non-navigation schemes;
- include auditor self-test with valid route, relative path, missing target, valid fragment, and missing-fragment cases;
- run the audit under the existing `public:validate` CI path.

Audit result at E-1 completion:

```text
reusable internal-link audit: present
self-test: pass
generated-output audit: pass
broken internal route targets: 0
checked fragment failures: 0
repairs required from initial audit: 0
```

Completion gate:

```text
reusable internal-link audit exists       pass
all generated internal route targets      pass
critical broken internal links = 0        pass
Change-layer surfaces included            pass
```

### E-2 SEO and metadata consistency audit

Work:

- build a reusable generated-output metadata audit before applying repairs;
- audit title and description presence;
- audit canonical link presence and uniqueness;
- verify canonical URL matches the intended public route;
- audit Open Graph title, description, URL, and image where applicable;
- audit Twitter card metadata where applicable;
- verify feed alternate discovery on `/updates/`;
- detect duplicate or missing canonical metadata;
- verify new Change-layer pages use consistent registry semantics;
- preserve future Explorer share URLs separately from canonical SEO landing-page policy.

Completion gate:

```text
reusable metadata audit exists
missing page titles = 0
missing page descriptions = 0
missing or duplicate canonicals = 0
canonical route mismatches = 0
critical Open Graph metadata gaps = 0
Updates feed alternates validated
```

### E-3 Sitemap and canonical-route consistency

Work:

- audit sitemap route set against intended static routes and entity routes;
- verify obsolete routes remain redirected and excluded;
- verify canonical routes and trailing-slash behavior;
- ensure feed endpoints remain outside the HTML page sitemap unless a reviewed rule changes that policy;
- turn route-count and route-set expectations into reusable checks.

Completion gate:

```text
sitemap expected route set matches output
entity route coverage complete
obsolete routes excluded
canonical/trailing-slash policy consistent
feed endpoints excluded from page sitemap
```

### E-4 Public route discovery and cross-surface navigation audit

Work:

- verify Registry, Analysis, and Change surfaces are discoverable from appropriate entry points;
- check header and footer hierarchy;
- check direct relationships among Stats, Quality, Updates, Incidents, and Monthly;
- verify page-level contextual links where useful;
- avoid turning the header into a dashboard-style menu;
- document intended navigation hierarchy before Explorer is added.

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
1. E-2 SEO and metadata consistency audit
2. E-3 Sitemap and canonical-route consistency
3. E-4 Public route discovery and cross-surface navigation audit
4. E-5 Stats readiness for Explorer deep links
5. Phase E.5 Explorer v1
6. Phase F bilingual layer
7. Phase G v1.0 integration baseline
8. Post-v1.0 evaluation sequence
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
