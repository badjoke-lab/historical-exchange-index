# HEI v1 and Post-v1 Execution Roadmap

Status: active execution source of truth  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-07-07

Repository and current GitHub state are authoritative when this checkpoint is stale.

## 1. Required reading order

Before implementation work, read:

1. `AGENTS.md`;
2. `docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md`;
3. `config/cloudflare-pages-project.json`;
4. this roadmap;
5. `docs/HEI_PRODUCT_SURFACES_SPEC.md` for public product behavior;
6. `docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md` for 750/1000 data gates;
7. `docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md` for localization;
8. `docs/HEI_V1_INTEGRATION_BASELINE_SPEC.md` for Phase G;
9. Explorer contracts when changing Explorer behavior;
10. task-specific data, monitoring, machine-readable, audit, feed, or operations specifications.

Execution order comes from this roadmap. Completion behavior comes from the relevant specification.

## 2. Operating rules

- Canonical changes require reviewed PRs.
- Monitoring must not directly edit reviewed canonical/public state.
- Public features use reviewed public data only.
- Raw monitoring and unreviewed candidates remain internal.
- No synthetic risk scores or free-form AI factual claims.
- Canonical facts remain single-source across locales.
- Explorer query keys and enum values remain locale-independent.
- Data growth, product work, operations, and machine-readable maintenance run as separate parallel lanes.
- Reviewed count milestones use public build aggregation semantics, not base-array lengths or candidate counts.
- Japanese public pilot is gated by 750 reviewed entities.
- No third-language pilot may launch before 1000 reviewed entities and a recorded Language Selection Gate decision.
- Production diagnosis starts with deployed commit verification.
- Dynamic state such as main SHA and open PRs must be derived from current GitHub state.
- Update repository authorities together when execution order, milestone gates, localization rollout, production state, or reviewed counts materially change.

## 3. Current checkpoint

```text
Last merged implementation PR: #557 Add Phase G maintainer recovery validation
Last merged main SHA: 9c1c0e9d7d327c61479a049ea498de7ec893a322
Current branch: g7-v1-baseline
Current phase: Phase G — v1.0 Integration Baseline
Current item: G-7 v1.0 Baseline Checkpoint
Next item: H Compare v1

Reviewed state:
  Entities:  550
  Events:    1004
  Evidence:  2621

Post-v1 fixed priority sequence:
  H Compare v1
  D-750 Reviewed Entity Milestone
  L-1 Japanese Pilot
  L-2 Localization Evaluation Gate
  D-1000 Reviewed Entity Milestone
  Language Selection Gate
```

G-7 remains incomplete until the baseline contract, validator, report, roadmap transition, production verification, and final workflow set complete and merge.

## 4. Current reviewed state and count semantics

Current reviewed state:

```text
Entities:  550
Events:    1004
Evidence: 2621
Maximum entity ID:   hei_ex_000666
Maximum event ID:    hei_ev_010080
Maximum evidence ID: hei_src_011312
```

Do not recover current counts from base-array lengths alone.

Reviewed public count semantics are defined in:

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
```

and reuse the public build aggregation semantics for:

```text
base arrays
reviewed records/exchanges bundles
entity corrections
identity resolution
event/evidence merge behavior
```

## 5. Completed foundation and product phases

```text
Phase C    Registry milestone                  COMPLETE
Phase D    Change layer                        COMPLETE
Phase E    Discovery foundation                COMPLETE
Phase E.5  Explorer v1                         COMPLETE
Phase F-1  Multilingual Foundation             COMPLETE
G-1        Accessibility Audit                 COMPLETE
G-2        URL Safety Audit                    COMPLETE
G-3        Cross-surface Integration Audit     COMPLETE
G-4        Machine/Public Consistency Audit    COMPLETE
G-5        Production Integration/Verification COMPLETE
G-6        Maintainer Recovery Validation      COMPLETE
G-7        v1.0 Baseline Checkpoint             ACTIVE
```

## 6. Parallel execution lanes

### Lane A — Data and quality

```text
candidate discovery
normalize/dedupe
reviewed record additions
entity/event/evidence strengthening
status and lifecycle updates
quality repair
archive and evidence improvements
D-750 milestone
D-1000 milestone
```

### Lane B — Product and localization

```text
G-7 v1.0 Baseline Checkpoint       ACTIVE
H Compare v1
L-1 Japanese Pilot                 only after D-750
L-2 Localization Evaluation Gate
Japanese expansion                 only after GO; may run with D-1000
Language Selection Gate            only after D-1000
I Discovery Log Trial
J NL Filter Translator              CONDITIONAL
K API Expansion                     CONDITIONAL
```

### Lane C — Operations

```text
monitoring
quality monitoring
canonical update tracking
reviewed Registry Updates
monthly reviewed snapshots
review queue maintenance
production verification
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

The lanes may run concurrently, but release gates and priority focus follow this roadmap.

## 7. Phase G — v1.0 Integration Baseline

Source:

```text
docs/HEI_V1_INTEGRATION_BASELINE_SPEC.md
```

Status:

```text
G-1 Accessibility Audit                         COMPLETE
G-2 URL Safety Audit                            COMPLETE
G-3 Cross-surface Integration Audit             COMPLETE
G-4 Machine/Public Consistency Audit            COMPLETE
G-5 Production Integration and Verification     COMPLETE
G-6 Maintainer Runbook and Recovery Validation  COMPLETE
G-7 v1.0 Baseline Checkpoint                    ACTIVE
```

Completion evidence:

```text
docs/audits/HEI_G1_ACCESSIBILITY_AUDIT_2026-07-06.md
docs/audits/HEI_G2_URL_SAFETY_AUDIT_2026-07-06.md
docs/audits/HEI_G3_CROSS_SURFACE_INTEGRATION_AUDIT_2026-07-07.md
docs/audits/HEI_G4_MACHINE_PUBLIC_CONSISTENCY_AUDIT_2026-07-07.md
docs/audits/HEI_G5_PRODUCTION_VERIFICATION_2026-07-07.md
docs/audits/HEI_G6_MAINTAINER_RECOVERY_VALIDATION_2026-07-07.md
```

### G-7 completion work

Record and validate:

```text
baseline main SHA/tag
reviewed counts
schema versions
public route contract
sitemap URL count
machine-readable file contract
Explorer query contract version
localization foundation state
monitoring/operations separation
production verification state
known deferred items
post-v1 priority sequence
```

G-7 completion gate:

```text
baseline contract: complete
baseline validator: PASS
baseline self-test: PASS
production expected/deployed commit: MATCH
Phase G reports: present and PASS
roadmap transitioned to post-v1 sequence
final workflow set: PASS
```

After G-7 merges, Phase G is complete and H Compare v1 becomes the active product item.

## 8. Phase H — Compare v1

Source:

```text
docs/HEI_PRODUCT_SURFACES_SPEC.md
```

Scope:

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

H completion does not require D-750 to be complete, but L-1 Japanese Pilot requires both H and D-750 completion.

## 9. D-750 Reviewed Entity Milestone

Source:

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
```

Target:

```text
reviewed public entities >= 750
```

From the 550 baseline candidate, this requires a net increase of 200 reviewed entities under build aggregation semantics.

Priority rule:

```text
H Compare complete
        ↓
750 reviewed entity gate
        ↓
Japanese public pilot may launch
```

Data work may continue during H implementation. The gate controls Japanese public launch timing, not whether ingestion may run.

## 10. L-1 Japanese Pilot

Source:

```text
docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md
```

Prerequisites:

```text
F-1 COMPLETE
Phase G COMPLETE
H Compare v1 COMPLETE
D-750 COMPLETE
```

Pilot principle:

```text
broad Japanese UI shell
+
fully localized Home/About/Methodology
+
localized controls/labels on major analysis/change/dossier surfaces
+
controlled optional record-copy sample
+
English fallback for untranslated record copy
```

Target Japanese route shell:

```text
/ja/
/ja/dead/
/ja/active/
/ja/about/
/ja/methodology/
/ja/stats/
/ja/quality/
/ja/explore/
/ja/updates/
/ja/incidents/
/ja/monthly/
/ja/exchange/[slug]/
```

Pilot optional record-copy sample may cover approximately:

```text
dead-side priority set: up to 100 entities
active-side priority set: up to 50 entities
selected major events
```

This is not a requirement to translate the full registry.

## 11. L-2 Localization Evaluation Gate

Evaluate:

```text
Search:
  impressions
  clicks
  Japanese queries
  indexing state

Usage:
  entry rate
  language switch use
  Explorer usage
  Stats/Quality usage
  dossier transitions

Maintenance:
  correction requests
  fallback frequency
  broken locale links
  stale overlay backlog
  synchronization burden
  operator QA burden
```

Decision:

```text
GO
  keep pilot and expand useful Japanese copy in stages

HOLD
  keep pilot stable and prioritize D-1000/core work

PIVOT
  retain useful Japanese work; do not expand aggressively;
  continue D-1000 and wait for Language Selection Gate
```

L-2 does not authorize a third language.

Data growth from 750 toward 1000 may continue while pilot evidence is being collected.

## 12. D-1000 Reviewed Entity Milestone

Source:

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
```

Target:

```text
reviewed public entities >= 1000
```

From 750:

```text
+250 reviewed entities
```

From the 550 baseline candidate:

```text
+450 reviewed entities
```

D-1000 is the prerequisite for the Language Selection Gate.

Japanese maintenance or staged expansion after a GO decision may continue in parallel, but must not stop canonical data growth without a verified operational reason.

## 13. Language Selection Gate

Prerequisites:

```text
D-1000 COMPLETE
Japanese Pilot evidence exists
L-2 decision recorded
```

No third language is preselected.

Inputs:

- HEI traffic language/geography;
- Search Console queries;
- Japanese pilot behavior;
- subject relevance to exchange history;
- translation QA capacity;
- maintenance cost;
- correction/support language patterns.

Decision:

```text
NO LAUNCH
  keep en + ja only

PILOT ONE LANGUAGE
  select exactly one evidence-supported third language
```

Do not launch multiple new languages at once under the current operating capacity.

## 14. Phase I — Discovery Log Trial

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

Discovery Log remains after the major Compare/data/localization gates so it does not displace the core registry-growth sequence.

## 15. Conditional later phases

### Phase J — NL Filter Translator

Activate only if Explorer usage demonstrates a need.

```text
natural language
        ↓
validated Explorer parameters
        ↓
deterministic Explorer results
```

It must not become a free-form factual answer engine.

### Phase K — API Expansion

Activate only after real external consumer need that static files cannot satisfy.

Current public machine layer already includes:

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

## 16. Immediate execution order

```text
1. Complete G-7 v1.0 Baseline Checkpoint              CURRENT
2. H Compare v1                                       NEXT
3. D-750 Reviewed Entity Milestone
4. L-1 Japanese Pilot
5. L-2 Localization Evaluation Gate
6. D-1000 Reviewed Entity Milestone
7. Language Selection Gate
8. I Discovery Log Trial
9. J NL Filter Translator only if justified
10. K API Expansion only if justified
```

Parallel rule:

```text
reviewed data growth continues during product/localization work
but public rollout gates remain fixed
```

## 17. Recovery procedure

Primary runbook:

```text
docs/operations/HEI_MAINTAINER_RECOVERY_RUNBOOK.md
```

Recovery must determine:

1. repository identity and default branch;
2. current origin/main SHA;
3. current open PRs and branch state;
4. deployment policy;
5. current roadmap checkpoint;
6. active task specifications;
7. reviewed counts using public build aggregation semantics;
8. latest production verification state;
9. required validation commands;
10. first incomplete roadmap item.

Do not use remembered chat history as execution authority when repository documents and current GitHub state can be inspected.

## 18. Change control

Update this roadmap together with the relevant specifications before changing:

- Compare position;
- 750 as Japanese Pilot gate;
- L-1 scope;
- L-2 decision semantics;
- 1000 as Language Selection Gate prerequisite;
- third-language selection rules;
- Discovery Log order;
- conditional activation of NL Filter Translator or API expansion.

The fixed priority after G-7 is:

```text
Compare
then 750
then Japanese Pilot/evaluation
then 1000
then language selection
```
