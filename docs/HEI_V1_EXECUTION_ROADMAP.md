# HEI v1 Execution Roadmap

Status: active execution source of truth  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-07-06  
Target: HEI v1.0 and recurring registry operations

Repository state is authoritative when this checkpoint and GitHub disagree.

## 1. Required reference set

Read in this order before implementation work:

1. `AGENTS.md`;
2. `docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md`;
3. `config/cloudflare-pages-project.json`;
4. this roadmap;
5. `docs/HEI_PRODUCT_SURFACES_SPEC.md`;
6. `docs/HEI_STATS_EXPLORER_HANDOFF.md`;
7. `docs/HEI_EXPLORER_QUERY_CONTRACT.md`;
8. `config/explorer-query-contract.json`;
9. the task-specific schema, monitoring, machine-readable, localization, audit, or feed contract document.

Every implementation PR must identify:

- roadmap item;
- specification source;
- canonical count impact;
- deployment impact;
- validation performed;
- production verification plan when public output changes.

## 2. Operating rules

- Canonical changes require reviewed pull requests.
- Automated monitoring must not directly edit canonical data.
- Do not add thin records merely to increase counts.
- Preserve historical URLs and conservative status decisions.
- Raw monitoring findings remain internal unless reviewed into a safe public form.
- Public product features use reviewed public data only.
- No risk scores, free-form AI truth claims, or unreviewed candidate exposure.
- Explorer filters and URL state are deterministic and tested.
- Explorer implementation follows the fixed query contract unless a reviewed specification change updates it.
- Stats deep links remain disabled until Entity and Event Explorer are both stable.
- Update this checkpoint when counts, phase state, active item, or execution order materially changes.

## 3. Current checkpoint

```text
Last merged implementation PR: #545 Fix Explorer v1 query contract and reference parser
Current PR: #546 Add deterministic Entity Explorer
Current phase: Phase E.5 — Explorer v1
Completed after current PR merges: E5-1 Query Contract / E5-2 Entity Explorer
Current item after current PR merges: E5-3 Event Explorer
Next item after E5-3: E5-4 Stats -> Explorer deep links
Cloudflare configuration changes required for E5-3: none expected
Production verification: required for public Explorer output after deployment propagation
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

Status: **COMPLETE**.

```text
entity target:                     550 / 550
count semantics:                   pass
records validation:                pass
country origin strict gate:        pass
active CEX / DEX readiness:        pass
watchlist resolution gate:         pass
entity quality critical findings:  0
entity quality high findings:      0
```

Audit source:

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

Key completion results:

```text
broken internal routes:                 0
fragment failures:                      0
metadata findings before Explorer:      0
sitemap URLs before Explorer:           561
static sitemap routes:                  11
exchange sitemap routes:                550
orphan public surfaces before Explorer: 0
Stats semantic dimensions:              23
Stats paths mapped exactly once:        40
Evidence Explorer:                      deferred
Stats deep links:                       disabled pending E5-4
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

Lane A continues in parallel and must not displace the active product phase.

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

Sources of truth:

```text
docs/HEI_PRODUCT_SURFACES_SPEC.md
docs/HEI_STATS_EXPLORER_HANDOFF.md
docs/HEI_EXPLORER_QUERY_CONTRACT.md
config/stats-explorer-deep-link-map.json
config/explorer-query-contract.json
```

Execution order:

```text
E5-1 Explorer query contract                              COMPLETE
E5-2 Entity Explorer                                      COMPLETE AFTER CURRENT PR MERGE
E5-3 Event Explorer                                       NEXT
E5-4 Stats -> Explorer deep links
E5-5 Timeline / Updates -> Explorer cross-links
E5-6 accessibility, URL-state, crawl-control, regression audit
```

### 7.1 E5-1 — Explorer query contract

Status: **COMPLETE** after PR #545.

Fixed route and views:

```text
/explore/
view=entities
view=events
default view=entities
view always serialized
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

Implementation sources:

```text
config/explorer-query-contract.json
docs/HEI_EXPLORER_QUERY_CONTRACT.md
scripts/lib/explorer-query-contract.mjs
scripts/validate-explorer-query-contract.mjs
scripts/test-explorer-query-contract.mjs
```

Validation result:

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
Evidence Explorer deferred: pass
```

### 7.2 E5-2 — Entity Explorer

Status: **COMPLETE AFTER CURRENT PR MERGE**.

Public route:

```text
/explore/?view=entities
```

Implementation sources:

```text
src/app/explore/page.tsx
src/components/explorer/entity-explorer-client.tsx
src/components/explorer/entity-explorer-client.module.css
src/lib/explorer/entity-query.ts
```

Implemented Entity filter set:

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

Behavior:

- server loads reviewed entity data through the existing reviewed-data loader;
- client receives reviewed entities only;
- URL state is parsed and serialized against the fixed contract;
- repeated values within one key use OR semantics;
- different keys combine with AND semantics;
- date comparisons are inclusive;
- valid inverted date ranges return zero results;
- year shorthand remains accepted by URL parsing and normalizes to ISO boundaries;
- UI date controls emit complete ISO dates;
- search scope matches the fixed contract;
- reviewed origin values serialize using canonical spelling;
- default sort is omitted from URL serialization;
- deterministic tie-breakers are implemented;
- dense desktop table and compact mobile record list are provided;
- load-more behavior resets on canonical query-state changes;
- Event view is an explicit E5-3 placeholder rather than incomplete event filtering;
- Stats deep links remain disabled.

Public discovery/navigation state after E5-2:

```text
core public surfaces:       12
navigation layers:          Registry / Research / Analysis / Change / Trust / Support
header internal routes:     10
footer internal routes:     8
orphan public surfaces:     0
Explorer metadata:          present
Explorer canonical:         /explore/
Explorer JSON-LD:           present
```

Sitemap handling:

```text
E5-2 keeps the existing sitemap contract at 561 URLs:
11 static routes + 550 exchange routes.

/explore/ is publicly discoverable through header/footer navigation and has canonical metadata.
Base-route sitemap inclusion is intentionally deferred to E5-6, where query crawl-control, canonical behavior, and final sitemap policy are audited together.
Query variants remain excluded from sitemap in all cases.
```

E5-2 validation result:

```text
Next build:                         pass
lint:                               pass
machine-readable validation:       pass
public output validation:          pass
internal-link audit:                pass
metadata diagnostics:               pass
sitemap/canonical audit:            pass
navigation/discovery audit:         pass
Explorer query contract validation: pass
Explorer contract tests:            pass
count semantics regression:         pass
record/quality/watchlist gates:      pass
canonical count impact:              none
```

E5-2 production verification after merge:

```text
verify deployed commit propagation
verify /explore/?view=entities loads
verify repeated-value OR filtering
verify cross-filter AND behavior
verify date range behavior
verify inverted-range empty result
verify reload/share URL state
verify malformed input fallback
verify desktop/mobile layouts
verify header/footer Explorer discovery
verify Event view remains E5-3 placeholder
```

### 7.3 E5-3 — Event Explorer

Status: **NEXT**.

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
- reviewed parent entity context only;
- event search scope follows fixed contract;
- `entity_type` and `entity_status` evaluate against parent entity;
- same-key repeated values use OR;
- cross-key filters use AND;
- date range comparison is inclusive;
- valid inverted range returns zero results;
- stable shareable URL state;
- contract-defined deterministic sorting;
- no Evidence Explorer;
- no Stats deep links yet.

E5-3 completion gate:

```text
Event view reads reviewed events only
reviewed parent entity context joined correctly
all Event filters implemented
Event search scope matches contract
Event sort options implemented
URL parse/serialize behavior matches contract
malformed query behavior matches contract
shareable URL state stable
internal-link audit pass
metadata audit pass
navigation/discovery audit pass
public validation pass
E5-4 handoff ready
```

### 7.4 E5-4 — Stats -> Explorer deep links

Only after E5-2 and E5-3 are stable:

- enable direct mappings;
- implement fixed year-to-ISO range conversion;
- enable compound links using repeated-value OR semantics;
- keep derived/non-filter metrics unlinked unless explicitly specified;
- change `stats_links_enabled` only in this phase.

### 7.5 E5-5 — Timeline / Updates -> Explorer cross-links

Add reviewed public query links only where the fixed query contract safely represents the target subset.

No raw monitoring or unmerged candidate query states are allowed.

### 7.6 E5-6 — Explorer final audit

Required work:

- accessibility audit;
- keyboard behavior;
- mobile interaction audit;
- URL-state round-trip regression;
- malformed query regression;
- canonical behavior for query variants;
- robots/indexing review;
- add the base `/explore/` route to sitemap if final crawl policy confirms inclusion;
- keep query variants outside sitemap;
- final public route consistency audit;
- final machine-readable route discoverability review.

Completion gate:

```text
entity filters deterministic and tested
event filters deterministic and tested
query state round-trips through shareable URLs
malformed query values fail safely or fall back predictably
Stats deep links resolve to correct Explorer states
reviewed public data boundary enforced
query URL crawl behavior controlled
base route sitemap policy finalized
keyboard and mobile interaction audited
```

## 8. Phase F — English root and Japanese `/ja/`

Work:

- keep English as root canonical language;
- add Japanese `/ja/` routes using translation overlays;
- localize UI, Methodology, About, Stats, Updates, Incidents, Quality, Monthly, and Explorer labels in dependency order;
- keep query parameter keys and enum values locale-independent;
- preserve one canonical factual data source.

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
1. E5-3 Event Explorer
2. E5-4 Stats -> Explorer deep links
3. E5-5 Timeline / Updates -> Explorer cross-links
4. E5-6 Explorer accessibility, URL-state, crawl-control, regression audit
5. Phase F bilingual layer
6. Phase G v1.0 integration baseline
7. Post-v1.0 evaluation sequence
```

Lane A quality repair and reviewed record growth continue in parallel without replacing the main product sequence.

GitHub-side work can continue without Cloudflare access unless a task specifically requires deployment configuration or production verification.

## 12. Recovery procedure

When resuming HEI work:

1. Confirm current `main`, open PRs, and reviewed counts.
2. Read `AGENTS.md` and Cloudflare deployment policy.
3. Read this roadmap.
4. Read `docs/HEI_PRODUCT_SURFACES_SPEC.md`.
5. Read `docs/HEI_STATS_EXPLORER_HANDOFF.md`.
6. Read `docs/HEI_EXPLORER_QUERY_CONTRACT.md` and `config/explorer-query-contract.json`.
7. Resume the first incomplete item in the active phase.
8. Cite roadmap/specification sections in the PR body.
9. Update this checkpoint when counts, phase, active item, or execution order materially changes.

Do not use remembered chat history as the execution source of truth when repository documents and current GitHub state can be inspected directly.
