# HEI v1 Execution Roadmap

Status: active execution source of truth  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-07-06

Repository state is authoritative when this checkpoint and GitHub disagree.

## 1. Required reading

Before implementation work, read:

1. `AGENTS.md`;
2. deployment policy and Cloudflare project policy;
3. this roadmap;
4. `docs/HEI_PRODUCT_SURFACES_SPEC.md` for product behavior;
5. `docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md` for localization;
6. `docs/HEI_V1_INTEGRATION_BASELINE_SPEC.md` for Phase G;
7. Explorer contracts when changing Explorer behavior;
8. task-specific data, monitoring, machine-readable, audit, or feed specifications.

Execution order comes from this roadmap. Completion gates come from the relevant specification.

## 2. Operating rules

- Canonical changes require reviewed PRs.
- Monitoring must not directly edit canonical data.
- Public features use reviewed public data only.
- Raw monitoring and unreviewed candidates remain private/internal.
- No synthetic risk scores or free-form AI truth claims.
- Canonical facts remain single-source across locales.
- Explorer query keys and enum values remain locale-independent.
- Full multilingual rollout is not a v1.0 requirement.
- Data growth, operations, and machine-readable maintenance continue in parallel.
- Update this checkpoint whenever phase, active item, order, or canonical counts materially change.

## 3. Current checkpoint

```text
Last merged implementation PR: #551 Add localization foundation and revised execution roadmap
F-1 Multilingual Foundation: COMPLETE
Current phase: Phase G — v1.0 Integration Baseline
Current PR: #552 Add Phase G accessibility baseline audit
Current item: G-1 Accessibility Audit
Current G-1 final audit: 13 generated routes; 0 critical / 0 high / 0 medium / 0 low findings
Next item: G-2 URL Safety Audit
Next product feature after v1.0: H Compare v1
Localization after Compare: L-1 Japanese Pilot -> L-2 Evaluation Gate
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

## 5. Completed phases

```text
Phase C   Registry milestone                 COMPLETE
Phase D   Change layer                       COMPLETE
Phase E   Discovery foundation               COMPLETE
Phase E.5 Explorer v1                        COMPLETE
Phase F-1 Multilingual Foundation            COMPLETE
```

### Explorer v1 completion

```text
E5-1 query contract                         COMPLETE
E5-2 Entity Explorer                        COMPLETE
E5-3 Event Explorer                         COMPLETE
E5-4 Stats -> Explorer deep links           COMPLETE
E5-5 Change -> Explorer cross-links         COMPLETE
E5-6 accessibility/URL/crawl regression     COMPLETE
```

Final Explorer contract:

```text
base route:              /explore/
base route in sitemap:   exactly once
query variants sitemap:  no
query canonical:         /explore/
static routes:           12
exchange routes:         550
total sitemap URLs:      562
```

### F-1 completion

Source:

```text
docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md
```

Completed:

```text
locale config
English default/public root
Japanese pilot locale registration
English/Japanese common dictionaries
English/Japanese enum-label dictionaries
entity/event copy overlay schema
English fallback loader
safe overlay merge utilities
locale route helpers
overlay validator and behavior tests
dedicated i18n gate
public regression integration
```

Public Japanese full-site rollout remains intentionally deferred.

## 6. Parallel execution lanes

### Lane A — Data and quality

```text
candidate discovery
reviewed record additions
entity/event/evidence strengthening
status and lifecycle updates
quality repair
archive and evidence improvements
```

### Lane B — Product sequence

```text
Phase G   v1.0 Integration Baseline          ACTIVE
Phase H   Compare v1
Phase L-1 Japanese Pilot
Phase L-2 Localization Evaluation Gate
Phase I   Discovery Log Trial
Language Selection Gate
Phase J   NL Filter Translator               CONDITIONAL
Phase K   API Expansion                      CONDITIONAL
```

### Lane C — Operations

```text
monitoring
quality monitoring
canonical update tracking
reviewed Registry Updates
monthly reviewed snapshots
review queue maintenance
```

### Lane D — Machine use

```text
stable canonical JSON
schema stability
version/manifest integrity
machine-readable public layer
reviewed update feeds
Explorer contract stability
API expansion only after demonstrated need
```

## 7. Phase G — v1.0 Integration Baseline

Source:

```text
docs/HEI_V1_INTEGRATION_BASELINE_SPEC.md
```

Order:

```text
G-1 Accessibility Audit                         ACTIVE / COMPLETE AFTER #552 MERGE
G-2 URL Safety Audit                            NEXT
G-3 Cross-surface Integration Audit
G-4 Machine/Public Consistency Audit
G-5 Production Verification
G-6 Maintainer Runbook and Recovery Validation
G-7 v1.0 Baseline Checkpoint
```

### G-1 Accessibility Audit

Coverage:

```text
12 core static routes
1 representative exchange detail route
Explorer interaction source contracts
global focus behavior
reduced-motion handling
responsive Explorer behavior
textual status semantics
```

Initial findings:

```text
HIGH Home registry search input missing accessible name
HIGH Explorer local focus-visible contract missing
```

Repairs:

```text
Home search accessible name added
global focus-visible treatment added
Explorer tabs/summaries/checkbox/date/origin focus treatment added
reduced-motion handling added
primary navigation accessible name added
```

Final result:

```text
routes covered: 13
critical: 0
high:     0
medium:   0
low:      0
```

Report:

```text
docs/audits/HEI_G1_ACCESSIBILITY_AUDIT_2026-07-06.md
```

### G-2 URL Safety Audit

Work:

- audit original URL, domain, URL status, and archive URL relationships;
- cover every URL-status enum value;
- ensure unsafe URLs are not presented as ordinary trusted links;
- keep redirected/repurposed status visible;
- verify original/archive distinction across detail, lists, Explorer, About, and Methodology;
- add reusable validator, self-test, report, and CI integration.

Completion gate:

```text
critical URL-safety findings: 0
high URL-safety findings:     0
all URL-status values covered
archive/original distinction verified
```

### G-3 Cross-surface Integration Audit

Audit graph:

```text
Home
Dead
Active
Explorer
Stats
Quality
Updates
Incidents
Monthly
Methodology
About
Donate
Exchange Detail
```

Gate:

```text
unintended orphan core surfaces: 0
required contextual edges: pass
Explorer query-link contract: pass
broken core cross-links: 0
```

### G-4 Machine/Public Consistency Audit

Audit:

```text
HTML
sitemap.xml
robots.txt
version.json
manifest.json
entities.json
events.json
evidence.json
feeds/updates.json
feeds/updates.xml
llms.txt
ai.txt
```

Gate:

```text
critical consistency findings: 0
count mismatches: 0
route-discovery mismatches: 0
public safety-boundary leaks: 0
feed contract findings: 0
```

### G-5 Production Verification

Verify deployed commit propagation and production routes/files.

Required record:

```text
expected commit
deployed commit
checked routes
checked machine files
result
known limitations
```

### G-6 Maintainer Runbook and Recovery

Repository-only recovery must determine:

```text
main SHA
canonical counts
current phase
current item
next item
active specs
open product PRs
deployment policy
production verification state
validation commands
recovery sequence
```

### G-7 v1.0 Baseline

Record:

```text
baseline SHA/tag
canonical counts
schema versions
public route contract
sitemap URL count
machine-readable file contract
Explorer query contract version
localization foundation state
monitoring/operations separation
production verification record
known deferred items
```

After G-7, move to Phase H.

## 8. Phase H — Compare v1

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
- direct dossier links;
- shareable comparison state.

Compare must not:

- introduce synthetic risk scores;
- rank safety or investment quality;
- use unreviewed monitoring candidates;
- create AI-generated factual comparison claims.

## 9. Phase L-1 — Japanese Pilot

Pilot only after F-1, Phase G, and Compare v1.

Initial scope:

```text
/ja/
/ja/about/
/ja/methodology/
common Japanese navigation/footer labels
language switcher
basic enum display labels
locale metadata
hreflang/alternate links
pilot sitemap entries
```

Not included by default:

```text
full Japanese exchange-detail coverage
full Japanese Stats/Quality/Change coverage
Japanese Explorer
bulk record translation
additional public languages
```

## 10. Phase L-2 — Localization Evaluation Gate

Evaluate search, usage, and maintenance burden.

Decision:

```text
GO    -> staged Japanese Expansion
HOLD  -> keep pilot only and continue core work
PIVOT -> retain useful foundation/pilot work and evaluate another language later
```

Japanese Expansion after GO:

```text
JA-1 /ja/dead/ and /ja/active/
JA-2 /ja/exchange/[slug]/
JA-3 /ja/stats/ and /ja/quality/
JA-4 /ja/updates/, /ja/incidents/, /ja/monthly/
JA-5 /ja/explore/
JA-6 multilingual final audit
```

## 11. Phase I — Discovery Log Trial

```text
monitoring / research finding
        ↓
manual review
        ↓
structured research note
        ↓
public Discovery Log trial
```

Automatic publication of raw monitoring findings remains prohibited.

## 12. Language Selection Gate

No third language is preselected.

Selection inputs:

- HEI traffic language/geography;
- Search Console queries;
- pilot behavior;
- exchange-history relevance;
- translation QA capability;
- maintenance cost.

Rule:

```text
one pilot -> measure -> expand / hold / pivot
```

## 13. Conditional later phases

### Phase J — NL Filter Translator

Activate only if Explorer usage demonstrates a need.

```text
natural language -> validated Explorer parameters -> deterministic Explorer results
```

It must not become a free-form factual answer engine.

### Phase K — API Expansion

Activate only after real external consumer need that static files cannot satisfy.

Current public machine layer:

```text
/version.json
/data/manifest.json
/data/entities.json
/data/events.json
/data/evidence.json
reviewed feeds
/llms.txt
/ai.txt
```

## 14. Immediate execution order

```text
1. Complete G-1 Accessibility Audit                    CURRENT
2. G-2 URL Safety Audit                                NEXT
3. G-3 Cross-surface Integration Audit
4. G-4 Machine/Public Consistency Audit
5. G-5 Production Verification
6. G-6 Maintainer Runbook and Recovery Validation
7. G-7 v1.0 Baseline Checkpoint
8. H Compare v1
9. L-1 Japanese Pilot
10. L-2 Localization Evaluation Gate
11. Execute GO / HOLD / PIVOT decision
12. I Discovery Log Trial
13. Language Selection Gate when evidence exists
14. J NL Filter Translator only if justified
15. K API Expansion only if justified
```

## 15. Recovery procedure

1. Confirm current `main`, open product PRs, and reviewed counts.
2. Read `AGENTS.md` and deployment policy.
3. Read this roadmap.
4. Read the specification for the active item.
5. For Phase G, read the integration baseline specification.
6. For localization, read the localization strategy specification.
7. For Explorer changes, read Product Surfaces, Stats handoff, Query Contract, and query config.
8. Resume the first incomplete item in the active phase.
9. Cite roadmap item and specification in the PR body.
10. Update this checkpoint when phase status, execution order, or counts materially change.

Do not use remembered chat history as the execution source of truth when repository documents and current GitHub state can be inspected directly.
