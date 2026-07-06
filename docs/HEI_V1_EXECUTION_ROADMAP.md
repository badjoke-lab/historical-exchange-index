# HEI v1 Execution Roadmap

Status: active execution source of truth  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-07-06  
Target: HEI v1.0, validated growth experiments, and recurring registry operations

Repository state is authoritative when this checkpoint and GitHub disagree.

## 1. Required reference set

Read in this order before implementation work:

1. `AGENTS.md`;
2. `docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md`;
3. `config/cloudflare-pages-project.json`;
4. this roadmap;
5. `docs/HEI_PRODUCT_SURFACES_SPEC.md`;
6. `docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md` for localization work;
7. `docs/HEI_STATS_EXPLORER_HANDOFF.md` for Stats/Explorer maintenance;
8. `docs/HEI_EXPLORER_QUERY_CONTRACT.md` and `config/explorer-query-contract.json` for Explorer maintenance;
9. the task-specific schema, monitoring, machine-readable, audit, or feed contract document.

Execution order comes from this roadmap. Product behavior comes from the relevant specification. Localization schedule and rollout gates come from the localization strategy specification.

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
- Explorer filters and URL state remain deterministic and tested.
- Canonical factual data remains single-source across locales.
- Query parameter keys, IDs, slugs, enum values, and source URLs remain locale-independent.
- Localization rollout is evidence-gated: foundation first, pilot later, expansion only after evaluation.
- Full multilingual rollout is not a v1.0 completion requirement.
- Lane A data growth, Lane C operations, and Lane D machine-use maintenance continue in parallel without displacing the active product item.
- Update this checkpoint whenever phase state, active item, execution order, or canonical counts materially change.

## 3. Current checkpoint

```text
Last merged implementation PR: #550 Finalize Explorer crawl, accessibility, and regression audits
Explorer v1: COMPLETE
Current phase: F-1 Multilingual Foundation
Current item: roadmap/specification sync, then localization foundation implementation
Next phase after F-1: Phase G v1.0 Integration Baseline
Next product feature after v1.0: Phase H Compare v1
Localization rollout after Compare: L-1 Japanese Pilot -> L-2 Evaluation Gate
Cloudflare configuration required for F-1: none expected
Public Japanese routes in F-1: none
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

Product, localization-foundation, and integration work do not change canonical counts unless a separate reviewed data PR explicitly does so.

## 5. Completed foundation

### 5.1 Phase C — Registry milestone

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

### 5.4 Phase E.5 — Explorer v1

Status: **COMPLETE** after PR #550.

```text
E5-1 Query contract and reference parser                  COMPLETE
E5-2 Entity Explorer                                      COMPLETE
E5-3 Event Explorer                                       COMPLETE
E5-4 Stats -> Explorer deep links                         COMPLETE
E5-5 Change-layer -> Explorer cross-links                 COMPLETE
E5-6 accessibility / URL-state / crawl / regression       COMPLETE
```

Final Explorer public contract:

```text
base route:              /explore/
base route indexable:    yes
base route in sitemap:   exactly once
query variants sitemap:  no
query canonical:         /explore/
static sitemap routes:   12
exchange sitemap routes: 550
total sitemap URLs:      562
```

Explorer, Stats, Change surfaces, and machine-readable route discovery are now a completed dependency baseline for the remaining roadmap.

## 6. Execution model

### Lane A — Data and quality

Continuous parallel lane:

```text
candidate discovery
reviewed record additions
existing entity/event/evidence strengthening
status and lifecycle updates
medium/low quality repair batches
archive and evidence improvements
```

Lane A continues throughout F-1, G, H, localization pilots, and later experiments.

### Lane B — Product sequence

```text
Phase D Change layer                         COMPLETE
Phase E Discovery foundation                COMPLETE
Phase E.5 Explorer v1                       COMPLETE
Phase F-1 Multilingual Foundation           ACTIVE
Phase G v1.0 Integration Baseline           NEXT
Phase H Compare v1
Phase L-1 Japanese Pilot
Phase L-2 Localization Evaluation Gate
Phase I Discovery Log Trial
Language Selection Gate
Phase J NL Filter Translator                CONDITIONAL
Phase K API Expansion                       CONDITIONAL
```

### Lane C — Operations

Continuous parallel lane:

```text
monitoring
quality monitoring
canonical update tracking
reviewed Registry Updates
monthly reviewed snapshots
review queue maintenance
```

### Lane D — Machine use

Continuous parallel lane:

```text
stable canonical JSON
schema stability
version and manifest integrity
machine-readable public layer
reviewed update feeds
Explorer query contract stability
conditional API expansion only after demonstrated need
```

## 7. Phase F-1 — Multilingual Foundation

Status: **ACTIVE**.

Source of truth:

```text
docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md
```

Purpose: create locale-safe architecture without committing HEI to a full Japanese or multilingual rollout before v1.0.

Required work:

```text
F1-1 locale configuration
F1-2 common UI dictionary schema
F1-3 enum-label dictionary schema
F1-4 localized record-copy overlay schema
F1-5 deterministic dictionary loader and fallback
F1-6 entity/event overlay merge utilities
F1-7 locale route helpers
F1-8 overlay safety validator
F1-9 package/CI integration
F1-10 roadmap/spec checkpoint and recovery documentation
```

F-1 does **not** publish a complete `/ja/` site.

F-1 must not:

- create translated canonical datasets;
- duplicate entities/events/evidence by locale;
- translate IDs, slugs, enum values, domains, source URLs, archive URLs, publisher names, or evidence source titles into canonical data;
- make Japanese copy a build requirement for canonical record publication;
- introduce a locale-specific Explorer query contract;
- add multiple public language rollouts at once.

Completion gate:

```text
locale config fixed:                         pass
English default root fixed:                  pass
Japanese registered as pilot locale:         pass
common dictionary loader:                    pass
enum-label loader:                           pass
canonical English fallback:                  pass
record overlay merge utilities:              pass
route helper behavior:                       pass
overlay safety validation:                   pass
canonical data unchanged:                    pass
existing English public output regression:   pass
public Japanese full-route rollout:          not part of F-1
```

After F-1, move directly to Phase G.

## 8. Phase G — v1.0 Integration Baseline

Purpose: stop feature accumulation temporarily and validate HEI as one coherent product before major new public expansion.

Execution order:

```text
G-1 Accessibility audit
G-2 URL safety audit
G-3 Cross-surface navigation and integration audit
G-4 Machine-readable and public-output consistency audit
G-5 Production integration and verification
G-6 Maintainer runbook and recovery validation
G-7 v1.0 baseline checkpoint/tag
```

### G-1 Accessibility audit

Audit all major public surfaces for:

- keyboard navigation;
- visible focus;
- labeled controls;
- contrast and non-color meaning;
- responsive table/list behavior;
- touch targets and mobile filter usability.

### G-2 URL safety audit

Audit historical original URLs and archive access behavior across:

```text
live_verified
live_unverified
redirected
repurposed
dead_domain
unsafe
unknown
```

No public locale or product surface may make a historical original domain appear safer than the reviewed URL status supports.

### G-3 Cross-surface integration audit

Validate meaningful movement across:

```text
Registry
Stats
Quality
Explorer
Updates
Incidents
Monthly
Exchange dossiers
```

Completion requires zero unintended orphan core surfaces.

### G-4 Machine/public consistency audit

Validate consistency across:

```text
HTML
sitemap
version.json
manifest.json
entities.json
events.json
evidence.json
feeds
llms.txt
ai.txt
```

### G-5 Production verification

Verify deployed commit propagation and required production routes/outputs. GitHub CI success alone is not sufficient.

### G-6 Maintainer runbook

Repository documents must be enough to recover:

```text
main SHA
canonical counts
current phase
current item
next item
open product PR state
production verification state
recovery procedure
```

### G-7 v1.0 baseline

Record a stable v1.0 checkpoint containing route, schema, count, deployment, and operational recovery state.

Completion gate:

```text
critical accessibility findings:             0
critical URL-safety findings:                 0
critical public-data consistency findings:   0
core route integration findings:              0
production verification:                      pass
runbook recovery validation:                  pass
v1.0 baseline recorded:                       pass
```

## 9. Phase H — Compare v1

Status: after v1.0 baseline, before localization pilot expansion.

Purpose: turn existing reviewed entity/event/evidence data into a new research workflow rather than only a wider-language presentation layer.

Initial scope:

- compare 2 to 4 exchanges;
- reviewed entity facts;
- lifecycle dates and deterministic lifespan;
- status and death reason;
- origin;
- URL/archive state;
- confidence;
- event counts and selected major events;
- evidence counts;
- direct dossier links.

Compare must not:

- introduce synthetic risk scores;
- rank exchange safety or investment quality;
- use unreviewed monitoring candidates;
- create AI-generated factual comparison claims.

Completion gate:

```text
2-4 record selection stable
shareable comparison state stable
reviewed-data-only boundary enforced
mobile comparison behavior usable
internal links valid
no synthetic scoring
public consistency validation pass
```

## 10. Phase L-1 — Japanese Pilot

Purpose: test whether localized HEI access creates meaningful value before translating the complete product.

Initial public scope:

```text
/ja/
/ja/about/
/ja/methodology/
common Japanese navigation/footer labels
language switcher
basic enum display labels
locale metadata
hreflang/alternate links
pilot locale sitemap entries
```

Not included in the pilot by default:

```text
full Japanese exchange-detail coverage
full Japanese Stats/Quality/Change coverage
Japanese Explorer
record-by-record bulk translation
additional public languages
```

Pilot principles:

- English remains canonical root;
- Japanese is `/ja/`;
- canonical factual data remains shared;
- translation copy is overlay-only;
- missing optional record copy falls back to canonical English;
- source titles, publishers, URLs, IDs, slugs, and enum values remain original/internal canonical values.

## 11. Phase L-2 — Localization Evaluation Gate

The Japanese pilot must be evaluated before expansion.

Evaluation categories:

### Search and discovery

- Japanese-page impressions;
- clicks;
- Japanese search queries;
- indexed pilot pages.

### Usage

- `/ja/` entry rate;
- language-switch usage;
- About/Methodology navigation depth;
- return visits where measurable;
- internal navigation from localized pages.

### Quality and maintenance

- translation correction count;
- fallback frequency;
- broken locale links;
- synchronization burden;
- operator review burden.

Decision outcomes:

```text
GO    -> Japanese Expansion sequence
HOLD  -> keep pilot routes only and continue other roadmap work
PIVOT -> retain foundation/pilot as appropriate and evaluate another language later
```

No localization expansion occurs automatically.

## 12. Japanese Expansion — only after GO

Sequence:

```text
JA-1 /ja/dead/ and /ja/active/
JA-2 /ja/exchange/[slug]/
JA-3 /ja/stats/ and /ja/quality/
JA-4 /ja/updates/, /ja/incidents/, /ja/monthly/
JA-5 /ja/explore/
JA-6 multilingual SEO, fallback, accessibility, and consistency audit
```

The Japanese Explorer must reuse the same locale-independent query keys and enum values as the English Explorer.

## 13. Phase I — Discovery Log Trial

Purpose: test a reviewed research-publication surface that shows ongoing HEI investigation without exposing raw monitoring output or becoming a breaking-news site.

Flow:

```text
monitoring / research finding
        ↓
manual review
        ↓
structured research note
        ↓
public Discovery Log trial
```

Possible content:

- newly verified historical records;
- meaningful evidence strengthening;
- historical identity questions resolved;
- unresolved historical research questions stated conservatively;
- archive-recovery work.

Automatic publication of raw monitoring findings remains prohibited.

## 14. Language Selection Gate

No third public language is preselected.

Candidate languages may include Spanish, Portuguese, Korean, Vietnamese, Indonesian, or others, but selection must use HEI-specific evidence:

- actual traffic geography/language;
- Search Console queries;
- pilot locale behavior;
- exchange-history relevance;
- translation QA capability;
- maintenance cost.

Rule:

```text
one pilot
    ↓
measure
    ↓
expand / hold / pivot
```

Do not launch multiple full-language sites simultaneously.

## 15. Phase J — Natural Language Filter Translator

Status: **CONDITIONAL**.

Enter the active schedule only if Explorer usage shows that users need help constructing deterministic filter state.

Its job is limited to:

```text
natural-language request
        ↓
validated Explorer parameters
        ↓
deterministic Explorer results
```

It must not become a free-form factual answer engine.

## 16. Phase K — API Expansion

Status: **CONDITIONAL**.

The current machine-readable foundation remains:

```text
/version.json
/data/manifest.json
/data/entities.json
/data/events.json
/data/evidence.json
reviewed update feeds
/llms.txt
/ai.txt
```

New API work enters the schedule only after demonstrated external consumer need that static public files cannot reasonably satisfy.

## 17. Immediate execution order

```text
0. Sync roadmap and localization specification          CURRENT
1. Complete F-1 Multilingual Foundation
2. Phase G v1.0 Integration Baseline
3. Phase H Compare v1
4. Phase L-1 Japanese Pilot
5. Phase L-2 Localization Evaluation Gate
6. Execute GO/HOLD/PIVOT decision
7. Phase I Discovery Log Trial
8. Language Selection Gate when evidence exists
9. Phase J NL Filter Translator only if justified
10. Phase K API Expansion only if justified
```

## 18. Recovery procedure

When resuming HEI work:

1. Confirm current `main`, open product PRs, and reviewed counts.
2. Read `AGENTS.md` and the Cloudflare deployment policy.
3. Read this roadmap.
4. Read the specification for the active item.
5. For localization, read `docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md` before coding.
6. For Explorer maintenance, read the Product Surfaces Spec, Stats handoff, Query Contract, and query config.
7. Resume the first incomplete item in the active phase.
8. Cite the roadmap item and source specification in the PR body.
9. Update this checkpoint when phase status, execution order, or counts materially change.

Do not use remembered chat history as the execution source of truth when repository documents and current GitHub state can be inspected directly.
