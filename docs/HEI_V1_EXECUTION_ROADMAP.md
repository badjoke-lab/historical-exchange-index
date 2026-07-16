# HEI v1 and Post-v1 Execution Roadmap

Status: active execution source of truth  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-07-17

Repository state, reviewed build output, and current GitHub state are authoritative. Dynamic values such as the current main SHA and open pull requests must be read at recovery time rather than treated as permanent roadmap text.

## 1. Required reading order

1. `AGENTS.md`
2. `docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md`
3. `config/cloudflare-pages-project.json`
4. this roadmap
5. `config/maintainer-recovery-contract.json`
6. `docs/HEI_PRODUCT_SURFACES_SPEC.md`
7. `docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md`
8. `docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md`
9. `docs/HEI_L1_JAPANESE_PILOT_IMPLEMENTATION_PLAN.md`
10. `docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md`
11. task-specific specifications and contracts

Execution order comes from this roadmap. Detailed behavior and completion gates come from the relevant specification and current reviewed contracts.

## 2. Operating rules

- Canonical changes require reviewed pull requests.
- Monitoring must not directly edit reviewed public state.
- Raw monitoring and unreviewed candidates remain internal.
- Canonical facts remain single-source across locales.
- Explorer query keys, Compare selection keys, enum values, and reviewed slugs remain locale-independent.
- Reviewed milestone counts use public build aggregation semantics, not base-array lengths or candidate counts.
- No third-language pilot may launch before 1000 reviewed entities, Japanese Pilot evidence, an L-2 decision, and a Language Selection Gate decision.
- No third language is preselected.
- Only one additional language pilot should run at a time.
- Production diagnosis starts with deployed commit verification.
- Dynamic main SHA and open PR state must come from current GitHub state.

## 3. Current checkpoint

```text
Phase G — v1.0 Integration Baseline: COMPLETE
Phase H — Compare v1:                 COMPLETE
D-750 Reviewed Entity Milestone:      COMPLETE
L-1 Japanese Pilot:                   COMPLETE / PUBLIC
L-2 Localization Evaluation Gate:     HOLD / EVIDENCE CAPTURE
D-1000 Reviewed Entity Milestone:     CURRENT
Language Selection Gate:              BLOCKED UNTIL D-1000 + L-2 EVIDENCE
```

BX12 reviewed state:

```text
Entities: 845
Events:   1004
Evidence: 3449
English dossiers:  845
Japanese dossiers: 845
Sitemap routes:     1714
Remaining to D-1000: 155
```

Current authority:

```text
config/maintainer-recovery-contract.json
docs/audits/HEI_D1000_PROGRESS_BX12_2026-07-17.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
data-evaluation/l2-localization-evidence.json
```

L-2 remains HOLD because the minimum observation window and required external evidence are not complete. HOLD keeps the Japanese Pilot public and permits reviewed canonical growth toward D-1000.

## 4. Reviewed-count semantics

Do not recover counts from base-array lengths alone.

Authority:

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
scripts/lib/reviewed-bundle-aggregation.mjs
scripts/lib/entity-corrections.mjs
```

Milestones count reviewed public state after reviewed bundle aggregation, entity correction, identity resolution, and event/evidence merge semantics.

Current BX12 identifiers:

```text
Maximum added entity ID:   hei_ex_000965
Maximum event ID:          hei_ev_010080
Maximum added evidence ID: hei_src_012145
```

The D-1000 milestone is `reviewed public entities >= 1000`.

## 5. Completed phases and frozen baseline evidence

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
G-7 v1.0 Baseline Checkpoint                   COMPLETE
Phase H    Compare v1                           COMPLETE
D-750      Reviewed Entity Milestone            COMPLETE
L-1        Japanese Pilot                       COMPLETE / PUBLIC
```

Frozen and phase-completion evidence:

```text
docs/audits/HEI_G7_V1_BASELINE_CHECKPOINT_2026-07-07.md
config/v1-baseline-contract.json
scripts/validate-v1-baseline.mjs
docs/audits/HEI_H5_COMPARE_V1_COMPLETION_2026-07-08.md
docs/audits/HEI_D750_MILESTONE_COMPLETION_2026-07-10.md
docs/audits/HEI_L1_JAPANESE_PILOT_ROUTE_ACTIVATION_COMPLETION_2026-07-10.md
```

The frozen v1 baseline remains historical evidence. Current reviewed counts may grow without changing its baseline SHA, route contract, schema contract, or safety boundaries.

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
D-1000 Reviewed Entity Milestone       CURRENT
```

### Lane B — Product and localization

```text
Phase H — Compare v1                   COMPLETE
L-1 Japanese Pilot                     COMPLETE / PUBLIC
L-2 Localization Evaluation Gate       HOLD / EVIDENCE CAPTURE
Japanese staged expansion              ONLY AFTER GO
Language Selection Gate                AFTER D-1000 + L-2 EVIDENCE
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
D-750 Reviewed Entity Milestone        COMPLETE
        ↓
L-1 Japanese Pilot                     COMPLETE / PUBLIC
        ↓
L-2 Localization Evaluation Gate       HOLD
        ↓
D-1000 Reviewed Entity Milestone       CURRENT
        ↓
Language Selection Gate
        ↓
Phase I — Discovery Log Trial
```

Data growth continues during L-2 HOLD, but public rollout gates remain fixed.

## 8. Phase H — Compare v1

State: `COMPLETE`

Authority:

```text
docs/HEI_PRODUCT_SURFACES_SPEC.md
docs/HEI_COMPARE_V1_SPEC.md
config/compare-v1-contract.json
docs/audits/HEI_H5_COMPARE_V1_COMPLETION_2026-07-08.md
```

Compare remains reviewed-facts-only and must not introduce synthetic risk scores, investment rankings, unreviewed candidates, or AI-generated factual claims.

## 9. D-750 Reviewed Entity Milestone

State: `COMPLETE`

```text
Entities: 750
Events:   1004
Evidence: 3219
```

Authority:

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/audits/HEI_D750_MILESTONE_COMPLETION_2026-07-10.md
```

## 10. L-1 Japanese Pilot

State: `COMPLETE / PUBLIC`

The pilot preserves a broad Japanese UI shell, localized major controls, English fallback, canonical facts single-source, all reviewed Japanese dossier routes, and locale-safe metadata and sitemap coverage.

Authority:

```text
docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md
docs/HEI_L1_JAPANESE_PILOT_IMPLEMENTATION_PLAN.md
docs/audits/HEI_L1_JAPANESE_PILOT_ROUTE_ACTIVATION_COMPLETION_2026-07-10.md
```

## 11. L-2 Localization Evaluation Gate

State: `HOLD`

Decision semantics:

```text
GO    -> staged Japanese expansion may continue with D-1000 growth
HOLD  -> keep Pilot stable; prioritize D-1000/core work
PIVOT -> retain useful Pilot work; do not expand aggressively; continue D-1000
```

L-2 does not authorize a third language. Until the observation window and required external metrics are complete, HOLD is correct.

Authority:

```text
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
config/l2-localization-evaluation-contract.json
data-evaluation/l2-localization-evidence.json
```

## 12. D-1000 Reviewed Entity Milestone

State: `CURRENT`

```text
Target:   reviewed public entities >= 1000
Entities: 845
Events:   1004
Evidence: 3449
Remaining: 155 reviewed entities
```

Work categories:

```text
candidate discovery
strong dedupe and direct canonical-path checks before drafting
reviewed batch additions
record strengthening where additions reveal overlap or lifecycle gaps
status and lifecycle updates
archive and evidence improvements
count validation under public build semantics
```

D-1000 is a prerequisite for the Language Selection Gate.

## 13. Language Selection Gate

State: `BLOCKED`

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

### Phase K — API Expansion

Activate only after real external consumer need that static files cannot satisfy.

## 16. Immediate execution order

```text
1. Continue L-2 evidence capture under HOLD
2. Continue D-1000 reviewed canonical growth          CURRENT
3. Complete D-1000 at >=1000 reviewed entities
4. Reproduce the L-2 decision from real evidence
5. Run the Language Selection Gate
6. Phase I — Discovery Log Trial
7. Phase J only if justified
8. Phase K only if justified
```

## 17. Recovery

Primary runbook:

```text
docs/operations/HEI_MAINTAINER_RECOVERY_RUNBOOK.md
```

Recovery must determine repository identity, current main SHA, open PRs, deployment policy, roadmap checkpoint, active specifications, reviewed counts under build semantics, production/baseline verification state, required validation commands, and the first incomplete roadmap item.

At the BX12 checkpoint, recovery should resolve:

```text
Phase H COMPLETE
D-750 COMPLETE
L-1 COMPLETE / PUBLIC
L-2 HOLD
D-1000 CURRENT
Entities: 845
Events: 1004
Evidence: 3449
Remaining to D-1000: 155
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

Fixed priority:

```text
Compare -> 750 -> Japanese Pilot/evaluation -> 1000 -> language selection
```
