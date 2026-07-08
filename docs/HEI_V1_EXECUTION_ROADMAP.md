# HEI v1 and Post-v1 Execution Roadmap

Status: active execution source of truth  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-07-08

Repository and current GitHub state are authoritative when this checkpoint is stale.

## 1. Required reading order

1. `AGENTS.md`
2. `docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md`
3. `config/cloudflare-pages-project.json`
4. this roadmap
5. `docs/HEI_PRODUCT_SURFACES_SPEC.md`
6. `docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md`
7. `docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md`
8. `docs/HEI_V1_INTEGRATION_BASELINE_SPEC.md`
9. Explorer contracts when changing Explorer behavior
10. `docs/HEI_COMPARE_V1_SPEC.md` and `config/compare-v1-contract.json` when changing Compare behavior
11. task-specific specifications and contracts

Execution order comes from this roadmap. Detailed behavior and completion gates come from the relevant specification.

## 2. Operating rules

- Canonical changes require reviewed PRs.
- Monitoring must not directly edit reviewed public state.
- Raw monitoring and unreviewed candidates remain internal.
- Canonical facts remain single-source across locales.
- Explorer query keys and enum values remain locale-independent.
- Compare selection keys and reviewed slugs remain locale-independent.
- Data growth, product work, operations, and machine-readable maintenance run as separate parallel lanes.
- Reviewed milestone counts use public build aggregation semantics, not base-array lengths or candidate counts.
- Japanese public pilot requires Phase H completion and at least 750 reviewed entities.
- No third-language pilot may launch before 1000 reviewed entities, Japanese Pilot evidence, an L-2 decision, and a Language Selection Gate decision.
- No third language is preselected.
- Only one additional language pilot should run at a time under current operating capacity.
- Production diagnosis starts with deployed commit verification.
- Dynamic state such as main SHA and open PRs must come from current GitHub state.

## 3. Current checkpoint

```text
Last merged implementation PR: #564
Current main SHA: 8a10921fc7f2fc3b46ffa5b31a5b53e39595f9ce
v1 baseline SHA: 9c1c0e9d7d327c61479a049ea498de7ec893a322

Phase G — v1.0 Integration Baseline: COMPLETE
Phase H — Compare v1:                 COMPLETE

Current phase: D-750 Reviewed Entity Milestone
Current item:  grow reviewed public entities from 550 to >=750
Next item:     L-1 Japanese Pilot after D-750 completion

Reviewed state:
  Entities:  550
  Events:    1004
  Evidence:  2621
```

Phase H completion evidence:

```text
docs/audits/HEI_H5_COMPARE_V1_COMPLETION_2026-07-08.md
```

The H-5 production deployment was verified against:

```text
9fb3e1a3bda0c51ce59af364402a98a86736bcb1
```

The production verification tooling was merged in PR #564.

## 4. Reviewed-count semantics

Current reviewed state:

```text
Entities:  550
Events:    1004
Evidence:  2621
Maximum entity ID:   hei_ex_000666
Maximum event ID:    hei_ev_010080
Maximum evidence ID: hei_src_011312
```

Do not recover counts from base-array lengths alone.

Authority:

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
scripts/lib/reviewed-bundle-aggregation.mjs
scripts/lib/entity-corrections.mjs
```

Milestones count reviewed public state on `main` after reviewed bundle aggregation, entity correction, identity resolution, and event/evidence merge semantics.

The D-750 milestone is:

```text
reviewed public entities >= 750
```

From the 550 baseline this requires a net increase of 200 reviewed entities under public build semantics.

## 5. Completed phases

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
G-7        v1.0 Baseline Checkpoint             COMPLETE
Phase H    Compare v1                           COMPLETE
```

G-7 v1.0 Baseline Checkpoint evidence:

```text
docs/audits/HEI_G7_V1_BASELINE_CHECKPOINT_2026-07-07.md
config/v1-baseline-contract.json
scripts/validate-v1-baseline.mjs
scripts/test-v1-baseline-validator.mjs
.github/workflows/v1-baseline-gate.yml
```

Phase H evidence:

```text
docs/HEI_COMPARE_V1_SPEC.md
config/compare-v1-contract.json
scripts/audit-compare-v1.mjs
.github/workflows/compare-v1-gate.yml
scripts/verify-compare-production.mjs
.github/workflows/compare-production-verification.yml
docs/audits/HEI_H5_COMPARE_V1_COMPLETION_2026-07-08.md
```

## 6. Parallel lanes

### Lane A — Data and quality

```text
candidate discovery
normalize / dedupe
reviewed additions
record strengthening
status / lifecycle updates
quality repair
archive / evidence improvement
D-750 milestone                         CURRENT
after L-1/L-2 gate work: D-1000 milestone
```

### Lane B — Product and localization

```text
Phase H — Compare v1                   COMPLETE
L-1 Japanese Pilot                     BLOCKED UNTIL D-750
L-2 Localization Evaluation Gate       AFTER L-1 EVIDENCE
Japanese staged expansion              ONLY AFTER GO; MAY RUN WITH D-1000
Language Selection Gate                ONLY AFTER D-1000 + L-2 EVIDENCE
Phase I — Discovery Log Trial          AFTER LANGUAGE SELECTION GATE
Phase J — NL Filter Translator         CONDITIONAL
Phase K — API Expansion                CONDITIONAL
```

### Lane C — Operations

```text
monitoring
quality monitoring
review queues
reviewed Registry Updates
monthly reviewed snapshots
production verification
```

### Lane D — Machine use

```text
canonical JSON
schema stability
version / manifest integrity
reviewed feeds
Explorer contract stability
Compare contract stability
API expansion only after demonstrated need
```

## 7. Fixed post-v1 priority sequence

```text
Phase H — Compare v1                   COMPLETE
        ↓
D-750 Reviewed Entity Milestone        CURRENT
        ↓
L-1 Japanese Pilot
        ↓
L-2 Localization Evaluation Gate
        ↓
D-1000 Reviewed Entity Milestone
        ↓
Language Selection Gate
        ↓
Phase I — Discovery Log Trial
```

Data growth continues in parallel, but release gates remain fixed.

## 8. Phase H — Compare v1

State:

```text
COMPLETE
```

Authority:

```text
docs/HEI_PRODUCT_SURFACES_SPEC.md
docs/HEI_COMPARE_V1_SPEC.md
config/compare-v1-contract.json
```

Implemented scope:

- compare 2 to 4 reviewed exchanges;
- reviewed facts only;
- repeated shareable `exchange=<slug>` URL state;
- selection order preservation;
- lifecycle dates and deterministic lifespan;
- status and death reason;
- origin;
- URL/archive state;
- confidence;
- event/evidence counts;
- deterministic selected major events;
- dossier links;
- Explorer and dossier discovery handoffs;
- normalized share-link action;
- sitemap and machine-readable discovery;
- accessibility, URL-safety, cross-surface, crawl, and machine/public audits;
- production verification against the H-5 merged main deployment.

Implementation sequence:

```text
#559 H-1 contract and specification
#560 H-2 core Compare route and lifecycle matrix
#561 H-3 comparison depth and major events
#562 H-4 sharing and discovery integration
#563 H-5 final crawl/machine/regression integration
#564 production verification tooling and live verification gate
```

Compare does not introduce synthetic risk scores, investment rankings, unreviewed candidates, or AI-generated factual claims.

Phase H completion does not remove the D-750 gate for L-1.

## 9. D-750 Reviewed Entity Milestone

State:

```text
CURRENT
```

Authority:

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
```

Target:

```text
reviewed public entities >= 750
```

Current reviewed public entities:

```text
550
```

Remaining net increase from the v1 baseline:

```text
200 reviewed entities
```

Work categories:

```text
candidate discovery
strong dedupe before drafting
reviewed batch additions
record strengthening where additions reveal overlap or lifecycle gaps
status/lifecycle updates
archive/evidence improvements
count validation under public build semantics
```

The active milestone is about reviewed public entities, not candidate count, base-array length, or unreviewed staging volume.

Release gate:

```text
Phase H COMPLETE + D-750 COMPLETE -> L-1 Japanese Pilot may launch
```

Phase H is now complete. D-750 is the only remaining release prerequisite before L-1.

## 10. L-1 Japanese Pilot

State:

```text
BLOCKED UNTIL D-750 COMPLETE
```

Authority:

```text
docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md
```

Prerequisites:

```text
F-1 COMPLETE
Phase G COMPLETE
Phase H COMPLETE
D-750 COMPLETE
```

Current prerequisite state:

```text
F-1       COMPLETE
Phase G   COMPLETE
Phase H   COMPLETE
D-750     INCOMPLETE
```

Pilot model:

```text
broad Japanese UI shell
+ localized Home/About/Methodology
+ localized controls and labels on major surfaces
+ controlled optional record-copy sample
+ English fallback for untranslated record copy
```

The Pilot does not require full-registry translation. Optional copy may prioritize up to roughly 100 dead-side entities, 50 active-side entities, and selected major events.

## 11. L-2 Localization Evaluation Gate

Evaluate search evidence, Japanese entry behavior, language-switch use, Explorer/Stats/Compare usage, dossier transitions, correction requests, fallback frequency, stale overlays, synchronization burden, and operator QA burden.

Decision:

```text
GO    -> staged Japanese expansion may continue with D-1000 growth
HOLD  -> keep Pilot stable; prioritize D-1000/core work
PIVOT -> retain useful Pilot work; do not expand aggressively; continue D-1000
```

L-2 does not authorize a third language.

## 12. D-1000 Reviewed Entity Milestone

Authority:

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
```

Target:

```text
reviewed public entities >= 1000
```

From 750: +250 reviewed entities.  
From the 550 baseline: +450 reviewed entities.

D-1000 is a prerequisite for the Language Selection Gate.

## 13. Language Selection Gate

Prerequisites:

```text
D-1000 COMPLETE
Japanese Pilot evidence exists
L-2 decision recorded
```

No third language is preselected.

Decision:

```text
NO LAUNCH
  keep en + ja only

PILOT ONE LANGUAGE
  select exactly one evidence-supported third language
```

Inputs include HEI traffic geography/language, Search Console queries, Japanese Pilot behavior, exchange-history subject relevance, QA capacity, maintenance cost, and correction/support patterns.

## 14. Phase I — Discovery Log Trial

```text
monitoring/research finding
        ↓
manual review
        ↓
structured research note
        ↓
public Discovery Log trial
```

Automatic publication of raw monitoring findings remains prohibited.

## 15. Conditional later phases

### Phase J — NL Filter Translator

Activate only if Explorer usage demonstrates need.

```text
natural language -> validated Explorer parameters -> deterministic Explorer results
```

### Phase K — API Expansion

Activate only after real external consumer need that static files cannot satisfy.

Existing public machine layer includes version, manifest, three datasets, reviewed feeds, `llms.txt`, and `ai.txt`.

## 16. Immediate execution order

```text
1. D-750 Reviewed Entity Milestone                  CURRENT
2. L-1 Japanese Pilot                              NEXT AFTER D-750
3. L-2 Localization Evaluation Gate
4. D-1000 Reviewed Entity Milestone
5. Language Selection Gate
6. Phase I — Discovery Log Trial
7. Phase J only if justified
8. Phase K only if justified
```

Parallel rule:

```text
reviewed data growth continues during product/localization work
but public rollout gates remain fixed
```

For the current checkpoint, do not start L-1 public rollout before D-750 is complete.

## 17. Recovery

Primary runbook:

```text
docs/operations/HEI_MAINTAINER_RECOVERY_RUNBOOK.md
```

Recovery must determine repository identity, current main SHA, open PRs, deployment policy, roadmap checkpoint, active specifications, reviewed counts under build semantics, current production/baseline verification state, required validation commands, and the first incomplete roadmap item.

At this checkpoint, recovery should resolve:

```text
Phase H COMPLETE
D-750 CURRENT
reviewed public entities = 550
remaining to D-750 = 200
```

Dynamic main SHA and open PR state must still be read from current GitHub state.

## 18. Change control

Update this roadmap together with relevant specifications before changing:

- Compare position or contract behavior;
- 750 as the Japanese Pilot gate;
- L-1 scope;
- L-2 decision semantics;
- 1000 as the Language Selection Gate prerequisite;
- third-language selection rules;
- Discovery Log order;
- conditional activation of Phase J or K.

Fixed priority after G-7:

```text
Compare -> 750 -> Japanese Pilot/evaluation -> 1000 -> language selection
```

Current progress through that sequence:

```text
Compare COMPLETE
        ↓
750 CURRENT
        ↓
Japanese Pilot / evaluation
        ↓
1000
        ↓
language selection
```
