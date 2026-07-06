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
6. `docs/HEI_STATS_EXPLORER_HANDOFF.md`;
7. `docs/HEI_EXPLORER_QUERY_CONTRACT.md` for Explorer work;
8. `config/explorer-query-contract.json` for fixed machine-readable query semantics;
9. the task-specific schema, monitoring, machine-readable, localization, audit, or feed contract document.

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
- Raw monitoring findings remain internal unless reviewed into a safe public form.
- Public product features must query reviewed public data only.
- Do not introduce risk scores, free-form AI truth claims, or unreviewed candidate exposure.
- Explorer filters and URL state must be deterministic and tested.
- Explorer implementation must follow the fixed query contract unless a reviewed specification change updates it.
- Update this checkpoint when counts, phase state, active item, or execution order materially changes.

## 3. Current checkpoint

```text
Last merged implementation PR: #544 Map Stats dimensions to Explorer filter semantics
Current PR: #545 Fix Explorer v1 query contract and reference parser
Current phase: Phase E.5 — Explorer v1
Completed after current PR merges: E5-1 Explorer query contract
Current item after current PR merges: E5-2 Entity Explorer
Next item after E5-2: E5-3 Event Explorer
Cloudflare configuration changes required for E5-2: none expected
Production verification: required when /explore/ becomes public
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

Explorer product work does not change canonical counts unless a separate reviewed data PR explicitly does so.

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

### 5.2 Phase D — Change layer

Status: **COMPLETE** after PR #538.

```text
D-1 Registry Update surface                         COMPLETE
D-2 Exchange Incident Timeline                     COMPLETE
D-3 Evidence Health and Data Quality summary       COMPLETE
D-4 Monthly Historical Exchange Snapshot           COMPLETE
D-5 RSS and JSON reviewed-update feeds             COMPLETE
D-6 Quality repair batches                         PARALLEL CONTINUOUS LANE
```

Safety boundary:

- reviewed public data only;
- raw monitoring output excluded;
- unmerged candidates excluded;
- history-first interpretation preserved;
- HEI does not become a general breaking-news site.

### 5.3 Phase E — Discovery foundation hardening

Status: **COMPLETE** after PR #544.

```text
E-1 Internal-link audit and repair                    COMPLETE
E-2 SEO and metadata consistency audit               COMPLETE
E-3 Sitemap and canonical-route consistency          COMPLETE
E-4 Public route discovery/navigation audit          COMPLETE
E-5 Stats readiness for Explorer deep links          COMPLETE
```

E-1 result:

```text
internal-link audit: present
self-test: pass
generated-output audit: pass
broken internal routes: 0
fragment failures: 0
```

E-2 result:

```text
audited public pages: 561
metadata findings: 0
missing titles/descriptions: 0
missing or duplicate canonicals: 0
canonical route mismatches: 0
critical OG metadata gaps: 0
Updates feed alternate mismatches: 0
```

E-3 result:

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

E-4 navigation contract:

```text
Registry  — Home / Dead / Active
Analysis  — Stats / Quality
Change    — Updates / Incidents / Monthly
Trust     — Methodology / About
Support   — Donate
```

E-4 result:

```text
core surfaces: 11
header internal routes: 9
footer internal routes: 7
required contextual edges: 8
reachable core surfaces: 11 / 11
orphan public surfaces: 0
navigation findings: 0
```

E-5 sources:

```text
config/stats-explorer-deep-link-map.json
docs/HEI_STATS_EXPLORER_HANDOFF.md
scripts/validate-stats-explorer-handoff.mjs
```

E-5 result:

```text
semantic dimensions: 23
Stats paths mapped exactly once: 40
Stats dimensions mapped: pass
future query keys identified: pass
canonical value sources identified: pass
direct/compound/range separation: pass
derived/non-filter metrics explicit: pass
Evidence Explorer dimensions deferred: pass
reviewed-data direct source validation: pass
Stats deep links remain disabled until Explorer views exist: pass
```

Phase E completion gate:

```text
core public routes discoverable                         pass
internal links valid                                   pass
canonical metadata coherent                            pass
sitemap aligned with intended public routes            pass
Stats dimensions mapped to Explorer semantics          pass
```

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
Phase E Discovery foundation hardening  COMPLETE
Phase E.5 Explorer v1                    ACTIVE
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
fixed Explorer query contract
conditional API expansion only if real consumer need is demonstrated
```

## 7. Phase E.5 — Explorer v1

Product sources of truth:

```text
docs/HEI_PRODUCT_SURFACES_SPEC.md
docs/HEI_STATS_EXPLORER_HANDOFF.md
docs/HEI_EXPLORER_QUERY_CONTRACT.md
config/stats-explorer-deep-link-map.json
config/explorer-query-contract.json
```

Execution order:

```text
E5-1 Explorer implementation specification and query contract   COMPLETE AFTER CURRENT PR MERGE
E5-2 Entity Explorer                                            NEXT
E5-3 Event Explorer
E5-4 Stats -> Explorer deep links
E5-5 Timeline / Updates -> Explorer cross-links
E5-6 accessibility, URL-state, crawl-control, and regression audit
```

### 7.1 E5-1 Explorer query contract

Status: **COMPLETE AFTER CURRENT PR MERGE**.

Fixed route:

```text
/explore/
```

Fixed views:

```text
entities
events
```

Fixed combination semantics:

```text
same key repeated values = OR
different keys = AND
multi-value encoding = repeated parameters
repeated values = deduplicated
repeated single-value parameters = first valid value
```

Fixed malformed-input behavior:

```text
unknown parameter = ignore
invalid enum value = ignore value
invalid boolean value = ignore value
invalid date value = ignore value
cross-view parameter = ignore
invalid view = entities fallback
valid inverted range = preserve; filtering layer returns zero results
```

Fixed date behavior:

```text
accepted input: YYYY or YYYY-MM-DD
from year: YYYY-01-01
to year: YYYY-12-31
comparison: inclusive
serialization: YYYY-MM-DD
```

Fixed search normalization:

```text
Unicode NFKC
trim
collapse whitespace
160 Unicode code-point cap
case-insensitive normalized substring matching
```

Fixed serialization order:

```text
view
q
view filters in contract order
sort
```

Fixed crawl policy:

```text
base /explore/ indexable
query variants excluded from sitemap
generated filter landing pages disabled
query variants canonicalize to /explore/
```

E5-1 implementation sources:

```text
config/explorer-query-contract.json
docs/HEI_EXPLORER_QUERY_CONTRACT.md
scripts/lib/explorer-query-contract.mjs
scripts/validate-explorer-query-contract.mjs
scripts/test-explorer-query-contract.mjs
```

E5-1 validation result:

```text
query parameter schema fixed: pass
parser/serializer behavior documented: pass
multi-value semantics fixed: pass
date semantics fixed: pass
sort defaults fixed: pass
malformed input behavior fixed: pass
search scope fixed: pass
canonical/crawl policy fixed: pass
contract validator: pass
round-trip tests: pass
malformed-input tests: pass
multi-value ordering tests: pass
date normalization tests: pass
Stats handoff compatibility: pass
Stats deep links still disabled: pass
Evidence Explorer still deferred: pass
E5-2 implementation handoff: ready
```

### 7.2 E5-2 Entity Explorer

Purpose: implement deterministic Entity Explorer filtering over reviewed public entity data.

Required filter set:

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

Required implementation behavior:

- read reviewed public entity data only;
- parse URL state through the fixed contract;
- apply OR within repeated values and AND across keys;
- apply inclusive date comparisons;
- return zero results for valid inverted ranges;
- use contract-defined search scope;
- use contract-defined sort behavior and tie-breakers;
- serialize shareable URLs deterministically;
- keep default sort omitted;
- keep Evidence Explorer out of the UI;
- do not enable Stats deep links yet;
- add `/explore/` to intended public route, sitemap, metadata, and navigation contracts;
- provide Entity/Event view switch UI while Event view may remain a documented not-yet-implemented handoff until E5-3, without violating URL parsing semantics.

E5-2 completion gate:

```text
/explore/ public route exists
Entity view reads reviewed public entity data only
all Entity filters implemented
Entity search scope matches contract
Entity sort options implemented
URL parse/serialize round-trip works in UI
malformed query behavior matches contract
shareable URLs stable
internal-link audit pass
metadata audit pass
sitemap/canonical audit pass
navigation/discovery audit pass
mobile and keyboard basics reviewed
E5-3 handoff ready
```

### 7.3 E5-3 Event Explorer

Purpose: implement deterministic Event Explorer filtering over reviewed public events plus reviewed parent exchange context.

Required filter set:

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

Required behavior:

- reviewed public event data only;
- parent exchange context from reviewed public entity data;
- event search scope follows fixed contract;
- entity_type/entity_status evaluated against parent entity;
- deterministic date and sort semantics;
- stable shareable URL state.

### 7.4 E5-4 Stats -> Explorer deep links

Only after E5-2 and E5-3 are stable:

- enable direct mappings;
- implement fixed year-to-ISO range conversion;
- enable compound links using fixed repeated-value OR semantics;
- keep derived/non-filter metrics unlinked unless explicitly specified;
- change `stats_links_enabled` only in this phase.

### 7.5 E5-5 Timeline / Updates -> Explorer cross-links

Add reviewed public query links where the fixed query contract safely represents the target subset.

No raw monitoring or unmerged candidate query states are allowed.

### 7.6 E5-6 Explorer audit

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

## 8. Phase F — English root and Japanese `/ja/`

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

## 9. Phase G — v1.0 integration baseline

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

## 10. Post-v1.0 sequence

```text
Phase H   Compare v1
Phase I   Discovery Log trial
Phase J   Natural Language Filter Translator only if Explorer usage justifies it
Phase K   API expansion only if real consumer demand justifies it
```

No synthetic risk score is allowed. Free-form Ask HEI remains outside the active roadmap.

## 11. Immediate schedule

```text
1. E5-2 Entity Explorer
2. E5-3 Event Explorer
3. E5-4 Stats -> Explorer deep links
4. E5-5 Timeline / Updates -> Explorer cross-links
5. E5-6 Explorer accessibility, URL-state, crawl-control, and regression audit
6. Phase F bilingual layer
7. Phase G v1.0 integration baseline
8. Post-v1.0 evaluation sequence
```

Lane A quality repair and reviewed record growth continue in parallel without replacing the main product sequence.

GitHub-side work can continue without Cloudflare access unless a task specifically requires deployment configuration or production verification.

## 12. Recovery procedure

When resuming HEI work:

1. Confirm current `main`, open PRs, and reviewed counts.
2. Read `AGENTS.md` and the Cloudflare deployment policy.
3. Read this roadmap.
4. Read `docs/HEI_PRODUCT_SURFACES_SPEC.md`.
5. Read `docs/HEI_STATS_EXPLORER_HANDOFF.md`.
6. Read `docs/HEI_EXPLORER_QUERY_CONTRACT.md` and `config/explorer-query-contract.json`.
7. Resume the first incomplete item in the active phase.
8. Cite roadmap/specification sections in the PR body.
9. Update this checkpoint when counts, phase, active item, or execution order materially changes.

Do not use remembered chat history as the execution source of truth when repository documents and current GitHub state can be inspected directly.
