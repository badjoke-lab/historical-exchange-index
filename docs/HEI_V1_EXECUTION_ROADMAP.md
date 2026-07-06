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
Implementation baseline SHA before current D-5 work: 4318f274650c50e89520d941c991da05bacde6e6
Last merged implementation PR: #537 Add Monthly Historical Exchange Snapshot
Current phase after this PR merges: Phase E — Discovery foundation hardening
Completed phase after this PR merges: Phase D — Change layer completion
Current item after this PR merges: E-1 Internal-link audit and repair
Next item after E-1: E-2 SEO and metadata consistency audit
Cloudflare configuration changes required for E-1: none expected
Production verification: required when public routes, feeds, or deployment-sensitive output change
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

D-2 through D-5 add public surfaces and reviewed feed outputs. They do not change canonical entity, event, or evidence counts.

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

Implemented after Phase D completion:

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
- `/quality/` Evidence Health and Data Quality public summary;
- `/monthly/` Monthly Historical Exchange Snapshot;
- `/feeds/updates.json` reviewed JSON Feed;
- `/feeds/updates.xml` reviewed RSS feed.

Stats is an existing analysis layer and will later gain Explorer deep links.

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
Phase D Change layer completion          COMPLETE after D-5 merge
Phase E Discovery foundation hardening  NEXT
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

Purpose: make registry change and historical activity visible without turning HEI into a breaking-news site.

```text
D-1 HEI Registry Update surface                         COMPLETE
D-2 Exchange Incident Timeline                         COMPLETE
D-3 Evidence Health and Data Quality public summary   COMPLETE
D-4 Monthly Historical Exchange Snapshot              COMPLETE
D-5 RSS and JSON feeds for reviewed public updates    COMPLETE AFTER CURRENT PR MERGE
D-6 Quality repair batches                             PARALLEL CONTINUOUS LANE
```

### D-2 completion record

D-2 includes:

- `/incidents/` public route;
- deterministic incident extraction from reviewed event records;
- explicit incident event-type allowlist;
- reverse chronological ordering with year grouping;
- links to canonical exchange dossiers;
- event-linked evidence counts;
- sitemap, navigation, discovery, monitoring, and output validation integration;
- no raw monitoring output or unreviewed candidates.

### D-3 completion record

D-3 includes:

- `/quality/` public route;
- public summary built from the existing Stats calculation layer;
- entity confidence, evidence reliability, evidence depth, record freshness, coverage, source-type, claim-scope, missing-field, and completeness metrics;
- public metric definitions and denominator notes;
- independent validator recomputation of headline metrics;
- explicit exclusion of internal monitoring findings, private research notes, unresolved candidate queues, and operator-only repair priorities.

### D-4 completion record

D-4 includes:

- `/monthly/` public route;
- latest completed UTC month selection;
- explicit review period and separate generation date;
- deterministic reviewed-event projection using a public event-type allowlist;
- monthly event, affected exchange, critical/high, and event-linked evidence counts;
- event-type and impact breakdowns;
- chronological event list with dossier links;
- explicit empty-month behavior;
- independent validator recomputation of month selection and monthly metrics;
- no publication of monitoring health, repair priorities, internal watchlists, or raw monthly-review artifacts.

### D-5 completion record

D-5 includes:

- `/feeds/updates.json` using JSON Feed 1.1;
- `/feeds/updates.xml` using RSS 2.0;
- `data/registry-updates.json` as the sole reviewed feed source;
- deterministic source order: `date desc`, then `id asc`;
- stable item identity: `urn:hei:registry-update:<update_id>`;
- stable item URLs anchored to `/updates/#<update_id>`;
- reviewed-only marker in JSON Feed extension data;
- source counts and reviewed change summaries in feed items;
- `/updates/` alternate feed discovery and direct feed links;
- feed endpoints added to `version.json`, manifest, `llms.txt`, and `ai.txt` discovery;
- build-time machine validation of source count, stable IDs, ordering, timestamps, and reviewed-only marker;
- exported-output validation of JSON/RSS count and stable ID order;
- production checker support for both feed endpoints and content types;
- no raw monitoring output, internal watchlists, or unmerged candidates.

D-5 completion gate:

```text
RSS 2.0 feed generated
JSON Feed 1.1 generated
source is reviewed Registry Update data only
stable identifiers documented and tested
ordering and timestamps validated
reviewed-only boundary tested
manifest and discovery references updated
exported feed files validated after Next static export
production checker validates both endpoints
```

## 8. Phase E — Discovery foundation hardening

Purpose: prepare navigation, linking, metadata, and route behavior before Explorer v1.

Stats already exists. Phase E is not a Stats implementation phase.

Execution order:

```text
E-1 Internal-link audit and repair                    NEXT
E-2 SEO and metadata consistency audit
E-3 Sitemap and canonical-route consistency
E-4 Public route discovery and cross-surface navigation audit
E-5 Stats readiness for Explorer deep links
```

### E-1 Internal-link audit and repair

Work:

- inventory all internal links in generated public HTML;
- detect broken internal routes and fragment links where practical;
- verify entity dossier links from Updates, Incidents, Monthly, Stats-related surfaces, and core registry views;
- verify footer and header routes;
- avoid treating external evidence URLs as internal-link failures;
- add a reusable CI audit before fixing any discovered broken links.

Completion gate:

```text
reusable internal-link audit exists
all generated internal route targets resolve
critical broken internal links = 0
new Change-layer surfaces are included in audit coverage
```

### E-2 SEO and metadata consistency audit

Work:

- audit title, description, canonical, Open Graph, and relevant alternate discovery metadata;
- verify new Change-layer pages are consistent with site semantics;
- detect duplicate or missing canonical metadata;
- preserve research/share URL concerns separately from future Explorer query URLs.

### E-3 Sitemap and canonical-route consistency

Work:

- audit sitemap route set against intended public static routes and entity routes;
- verify obsolete routes remain redirected and excluded;
- verify canonical routes and trailing-slash behavior;
- keep feed endpoints out of sitemap unless a reviewed reason changes that rule.

### E-4 Public route discovery and cross-surface navigation audit

Work:

- verify Registry, Analysis, Research-ready, and Change surfaces are discoverable from appropriate public entry points;
- check navigation hierarchy and footer density;
- ensure Updates, Incidents, Monthly, Quality, and Stats connect coherently without turning the header into a dashboard menu.

### E-5 Stats readiness for Explorer deep links

Work:

- map Stats dimensions to future Explorer filter semantics;
- define which Stats blocks will receive deep links;
- identify mismatches between display labels and canonical enum/query values;
- produce the handoff required by E5-1 Explorer query-contract work.

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
1. E-1 Internal-link audit and repair
2. E-2 SEO and metadata consistency audit
3. E-3 Sitemap and canonical-route consistency
4. E-4 Public route discovery and cross-surface navigation audit
5. E-5 Stats readiness for Explorer deep links
6. Phase E.5 Explorer v1
7. Phase F bilingual layer
8. Phase G v1.0 integration baseline
9. Post-v1.0 evaluation sequence
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
