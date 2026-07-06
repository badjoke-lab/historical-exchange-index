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
5. `docs/HEI_PRODUCT_SURFACES_SPEC.md`;
6. `docs/HEI_STATS_EXPLORER_HANDOFF.md` for Explorer work;
7. the task-specific schema, monitoring, record-growth, machine-readable, localization, audit, or feed-contract document.

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
- Explorer filters and URL state must be deterministic and tested.
- Update this checkpoint when counts, phase state, active item, or execution order materially changes.

## 3. Current checkpoint

```text
Last merged implementation PR: #543 Add public navigation and surface discovery audit
Current PR: #544 Map Stats dimensions to Explorer filter semantics
Completed after current PR merges: Phase E — Discovery foundation hardening
Current phase after current PR merges: Phase E.5 — Explorer v1
Current item after current PR merges: E5-1 Explorer implementation specification and query contract
Next item after E5-1: E5-2 Entity Explorer
Cloudflare configuration changes required for E5-1: none expected
Production verification: not required for specification-only E5-1 unless public output changes
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

Phase E and the initial Explorer specification phase do not change canonical counts unless a separate reviewed data PR explicitly does so.

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
- reviewed JSON Feed and RSS update feeds;
- reviewed entity/event/evidence JSON publication;
- machine-readable version and manifest layer;
- internal-link audit;
- metadata audit;
- sitemap/canonical route-set audit;
- navigation/discovery audit;
- Stats-to-Explorer semantic handoff after E-5 merge.

## 6. Execution model

### Lane A — Data and quality

```text
continuous candidate discovery
reviewed record additions
existing entity/event/evidence strengthening
status and lifecycle updates
medium/low quality repair batches
archive and evidence improvements
```

This lane continues throughout the schedule and must not displace the active product phase.

### Lane B — Product surfaces

```text
Phase D Change layer completion          COMPLETE
Phase E Discovery foundation hardening  COMPLETE AFTER CURRENT PR MERGE
Phase E.5 Explorer v1                    ACTIVE AFTER CURRENT PR MERGE
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
Explorer query contract
conditional API expansion only if real consumer need is demonstrated
```

## 7. Phase D — Change layer completion

Status: **COMPLETE** after PR #538.

```text
D-1 Registry Update surface                         COMPLETE
D-2 Exchange Incident Timeline                     COMPLETE
D-3 Evidence Health and Data Quality summary       COMPLETE
D-4 Monthly Historical Exchange Snapshot           COMPLETE
D-5 RSS and JSON reviewed-update feeds             COMPLETE
D-6 Quality repair batches                         PARALLEL CONTINUOUS LANE
```

Public Change-layer safety remains fixed:

- reviewed public data only;
- raw monitoring output excluded;
- unmerged candidates excluded;
- history-first interpretation preserved;
- HEI does not become a general breaking-news site.

## 8. Phase E — Discovery foundation hardening

Status: **COMPLETE AFTER CURRENT PR MERGE**.

```text
E-1 Internal-link audit and repair                    COMPLETE
E-2 SEO and metadata consistency audit               COMPLETE
E-3 Sitemap and canonical-route consistency          COMPLETE
E-4 Public route discovery/navigation audit          COMPLETE
E-5 Stats readiness for Explorer deep links          COMPLETE AFTER CURRENT PR MERGE
```

### E-1 completion

```text
internal-link audit: present
self-test: pass
generated-output audit: pass
broken internal routes: 0
fragment failures: 0
```

### E-2 completion

```text
audited public pages: 561
metadata findings: 0
missing titles/descriptions: 0
missing or duplicate canonicals: 0
canonical route mismatches: 0
critical OG metadata gaps: 0
Updates feed alternate mismatches: 0
```

### E-3 completion

```text
expected sitemap URLs: 561
static routes: 11
exchange routes: 550
exact route-set comparison: pass
duplicate sitemap URLs: 0
missing/unexpected routes: 0
canonical/sitemap mismatches: 0
trailing-slash mismatches: 0
feed URLs in page sitemap: 0
obsolete routes in sitemap: 0
obsolete redirect contract: pass
```

### E-4 completion

Navigation contract:

```text
Registry  — Home / Dead / Active
Analysis  — Stats / Quality
Change    — Updates / Incidents / Monthly
Trust     — Methodology / About
Support   — Donate
```

Completion result:

```text
core surfaces: 11
header internal routes: 9
footer internal routes: 7
required contextual edges: 8
reachable core surfaces: 11 / 11
orphan public surfaces: 0
navigation findings: 0
```

### E-5 completion

Source files:

```text
config/stats-explorer-deep-link-map.json
docs/HEI_STATS_EXPLORER_HANDOFF.md
scripts/validate-stats-explorer-handoff.mjs
```

E-5 mapping classes:

```text
direct
range_candidate
compound_candidate
derived_non_filter
aggregate_non_filter
deferred
```

Direct Entity candidates:

```text
status
type
death_reason
official_url_status
confidence
country_or_origin
```

Direct Event candidates:

```text
event_type
impact_level
event_status_effect
```

Range candidates:

```text
launch year -> launch_from / launch_to
death year -> death_from / death_to
```

Explicit non-filter/deferred categories include:

```text
age bands
evidence depth
review freshness
missing-field metrics
averages
snapshot growth
Evidence Explorer dimensions
```

Completion result:

```text
semantic dimensions: 23
Stats paths mapped exactly once: 40
Stats dimensions mapped: pass
future query keys identified: pass
canonical value sources identified: pass
direct/compound/range separation: pass
derived/non-filter metrics explicit: pass
Evidence Explorer dimensions deferred: pass
query keys constrained to Product Spec candidate sets: pass
reviewed-data direct source validation: pass
Stats deep links remain disabled before Explorer: pass
URL contract remains unfinalized before E5-1: pass
```

Phase E completion gate:

```text
core public routes discoverable                         pass
internal links valid                                   pass
canonical metadata coherent                            pass
sitemap aligned with intended public routes            pass
Stats dimensions mapped to Explorer semantics          pass
```

## 9. Phase E.5 — Explorer v1

Product sources of truth:

```text
docs/HEI_PRODUCT_SURFACES_SPEC.md
docs/HEI_STATS_EXPLORER_HANDOFF.md
config/stats-explorer-deep-link-map.json
```

Execution order:

```text
E5-1 Explorer implementation specification and query contract   NEXT
E5-2 Entity Explorer
E5-3 Event Explorer
E5-4 Stats -> Explorer deep links
E5-5 Timeline / Updates -> Explorer cross-links
E5-6 accessibility, URL-state, crawl-control, and regression audit
```

### E5-1 Explorer implementation specification and query contract

Purpose:

- convert the E-5 semantic handoff into a fixed implementation contract;
- define deterministic URL parsing and serialization before UI implementation;
- prevent Entity and Event Explorer from developing incompatible query semantics.

Required decisions:

```text
route: /explore/
view semantics: entities | events
parameter allowlists
single-value vs multi-value semantics
date parsing and year-bar boundary conversion
unknown-value behavior
search field scope
sort options and defaults
stable serialization order
empty/default parameter omission
malformed parameter fallback
canonical URL policy
robots/indexing policy for query combinations
backward-compatibility/change-control rule
```

E5-1 must not:

- build the full Explorer UI;
- enable Stats deep links;
- introduce Evidence Explorer;
- introduce AI-generated filtering or labels;
- expose monitoring candidates.

Completion gate:

```text
query parameter schema fixed
parser/serializer behavior documented
multi-value semantics fixed
date semantics fixed
sort defaults fixed
malformed input behavior fixed
search scope fixed
canonical/robots policy fixed
contract validator/tests present
E5-2 implementation handoff ready
```

### E5-2 Entity Explorer

Implements deterministic entity filtering over reviewed public entity data.

Candidate filter set from Product Spec:

```text
q
type
status
death_reason
launch_from
launch_to
death_from
death_to
official_url_status
archive_available
confidence
country_or_origin
sort
```

### E5-3 Event Explorer

Implements deterministic event filtering over reviewed public event data with parent exchange context.

Candidate filter set:

```text
q
event_type
date_from
date_to
impact_level
event_status_effect
confidence
entity_type
entity_status
sort
```

### E5-4 Stats -> Explorer deep links

Only after E5-1 through E5-3 are stable:

- enable direct mappings;
- implement reviewed range conversions;
- enable compound links only where the contract supports them;
- keep derived/non-filter metrics unlinked unless explicitly specified.

### E5-5 Timeline / Updates -> Explorer cross-links

Add reviewed public query links where the fixed query contract can represent the subset safely.

### E5-6 Explorer audit

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
Phase K   API expansion only if real consumer demand justifies it
```

No synthetic risk score is allowed. Free-form Ask HEI remains outside the active roadmap.

## 13. Immediate schedule

```text
1. E5-1 Explorer query contract
2. E5-2 Entity Explorer
3. E5-3 Event Explorer
4. E5-4 Stats -> Explorer deep links
5. E5-5 Timeline / Updates -> Explorer cross-links
6. E5-6 Explorer accessibility, URL-state, crawl-control, and regression audit
7. Phase F bilingual layer
8. Phase G v1.0 integration baseline
9. Post-v1.0 evaluation sequence
```

Lane A quality repair and reviewed record growth continue in parallel without replacing the main product sequence.

GitHub-side work can continue without Cloudflare access unless a task specifically requires deployment configuration or production verification.

## 14. Recovery procedure

When resuming HEI work:

1. Confirm current `main`, open PRs, and reviewed counts.
2. Read `AGENTS.md` and the Cloudflare deployment policy.
3. Read this roadmap.
4. For Explorer work, read `docs/HEI_PRODUCT_SURFACES_SPEC.md`.
5. Read `docs/HEI_STATS_EXPLORER_HANDOFF.md` and the machine-readable mapping.
6. Resume the first incomplete item in the active phase.
7. Cite roadmap/specification sections in the PR body.
8. Update this checkpoint when counts, phase, active item, or execution order materially changes.

Do not use remembered chat history as the execution source of truth when repository documents and current GitHub state can be inspected directly.
