# HEI v1 and Post-v1 Execution Roadmap

Status: active execution source of truth  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-08-16

Repository state, reviewed build output, and current GitHub state are authoritative. Dynamic values such as the current main SHA and open pull requests must be read at recovery time rather than treated as permanent roadmap text.

## 1. Required reading order

1. `AGENTS.md`
2. `docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md`
3. `config/cloudflare-pages-project.json`
4. this roadmap
5. `docs/HEI_AI_ERA_REGISTRY_SPEC.md`
6. `docs/HEI_AI_ERA_EXECUTION_SCHEDULE.md`
7. `config/maintainer-recovery-contract.json`
8. `docs/HEI_PRODUCT_SURFACES_SPEC.md`
9. `docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md`
10. `docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md`
11. `docs/HEI_L1_JAPANESE_PILOT_IMPLEMENTATION_PLAN.md`
12. `docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md`
13. task-specific specifications and contracts

Execution order comes from this roadmap. Detailed behavior and completion gates come from the relevant specification and current reviewed contracts. The AI-era registry specification and schedule are mandatory cross-cutting authorities for provenance, lifecycle follow-up, deterministic machine use, Explorer, Compare, Stats, and any later AI-assisted retrieval.

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
- AI-era machine-readable, provenance, lifecycle, Explorer, Compare, and Stats boundaries remain mandatory after the finite implementation pass; completion does not authorize weaker review or generated canonical facts.

## 3. Current checkpoint

```text
Phase G — v1.0 Integration Baseline: COMPLETE
Phase H — Compare v1:                 COMPLETE
D-750 Reviewed Entity Milestone:      COMPLETE
L-1 Japanese Pilot:                   COMPLETE / PUBLIC
L-2 Localization Evaluation Gate:     HOLD / EVIDENCE CAPTURE
D-1000 Reviewed Entity Milestone:     COMPLETE
AI-era finite resilience pass:        COMPLETE
Language Selection Gate:              BLOCKED UNTIL L-2 EVIDENCE / DECISION
```

D-1000 frozen completion state:

```text
Entities: 1000
Events:   1025
Evidence: 3781
English dossiers:  1000
Japanese dossiers: 1000
Sitemap dossier routes: 1000 English + 1000 Japanese
```

Current reviewed public state under build aggregation semantics at the 2026-08-16 AI-era closeout:

```text
Entities: 1034
Events:   1039
Evidence: 3871
```

Current authority:

```text
config/maintainer-recovery-contract.json
docs/audits/HEI_D1000_MILESTONE_COMPLETION_2026-08-09.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
data-evaluation/l2-localization-evidence.json
docs/HEI_AI_ERA_REGISTRY_SPEC.md
docs/HEI_AI_ERA_EXECUTION_SCHEDULE.md
docs/audits/HEI_AI_ERA_FINITE_PASS_CLOSEOUT_2026-08-16.md
```

D-1000 is complete. L-2 remains HOLD because required external Search Console, GA4, indexing, and operator-burden evidence is not yet complete. The 1000-entity prerequisite for Language Selection is satisfied, but Language Selection remains blocked until the L-2 evidence and decision requirements are satisfied.

The finite AI-era resilience pass is a completed cross-cutting track. It does not reorder the separate localization roadmap and does not stop ongoing reviewed record growth, monitoring, corrections, evidence maintenance, or scheduled lifecycle follow-up.

## 4. Reviewed-count semantics

Do not recover counts from base-array lengths alone.

Authority:

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
scripts/lib/reviewed-bundle-aggregation.mjs
scripts/lib/entity-corrections.mjs
```

Milestones count reviewed public state after reviewed bundle aggregation, entity correction, identity resolution, and event/evidence merge semantics.

The D-1000 milestone target `reviewed public entities >= 1000` is complete. Post-D-1000 reviewed growth has advanced the current public state to 1034 entities / 1039 events / 3871 evidence at this checkpoint. Dynamic counts must still be derived at recovery time rather than copied forward blindly.

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
D-1000     Reviewed Entity Milestone            COMPLETE
AI-era B-H finite resilience track             COMPLETE
```

Frozen and phase-completion evidence:

```text
docs/audits/HEI_G7_V1_BASELINE_CHECKPOINT_2026-07-07.md
config/v1-baseline-contract.json
scripts/validate-v1-baseline.mjs
docs/audits/HEI_H5_COMPARE_V1_COMPLETION_2026-07-08.md
docs/audits/HEI_D750_MILESTONE_COMPLETION_2026-07-10.md
docs/audits/HEI_L1_JAPANESE_PILOT_ROUTE_ACTIVATION_COMPLETION_2026-07-10.md
docs/audits/HEI_D1000_MILESTONE_COMPLETION_2026-08-09.md
docs/audits/HEI_AI_ERA_FINITE_PASS_CLOSEOUT_2026-08-16.md
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
D-1000 Reviewed Entity Milestone       COMPLETE
post-D-1000 growth continues under the same quality rules
AI-era lifecycle follow-up continues through normal reviewed Lane A
```

### Lane B — Product and localization

```text
Phase H — Compare v1                   COMPLETE
L-1 Japanese Pilot                     COMPLETE / PUBLIC
L-2 Localization Evaluation Gate       HOLD / EVIDENCE CAPTURE
Japanese staged expansion              ONLY AFTER GO
Language Selection Gate                AFTER L-2 EVIDENCE / DECISION
Phase I — Discovery Log Trial          AFTER LANGUAGE SELECTION GATE
Phase J — NL Filter Translator         DEFERRED / CONDITIONAL AFTER EVIDENCE
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
future lifecycle checkpoints from Issue #768
```

### Lane D — Machine use

```text
canonical JSON
record-level reviewed bundles
/stats.json
/stats-history.json
schema stability
version / manifest integrity
reviewed feeds
Explorer contract stability
Compare contract stability
static deterministic outputs before API infrastructure
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
L-2 Localization Evaluation Gate       HOLD / EVIDENCE CAPTURE
        ↓
D-1000 Reviewed Entity Milestone       COMPLETE
        ↓
Language Selection Gate                BLOCKED ON L-2 EVIDENCE / DECISION
        ↓
Phase I — Discovery Log Trial
```

Canonical growth and quality work may continue while L-2 evidence is captured, but public rollout gates remain fixed. The completed AI-era B-H resilience track is orthogonal to this sequence and does not bypass L-2 or Language Selection gates.

## 8. Phase H — Compare v1

State: `COMPLETE`

Authority:

```text
docs/HEI_PRODUCT_SURFACES_SPEC.md
docs/HEI_COMPARE_V1_SPEC.md
config/compare-v1-contract.json
docs/audits/HEI_H5_COMPARE_V1_COMPLETION_2026-07-08.md
docs/HEI_AI_ERA_COMPARE_EXTENSION_SPEC.md
```

Compare remains reviewed-facts-only and must not introduce synthetic risk scores, investment rankings, unreviewed candidates, or AI-generated factual claims. The AI-era extension adds reviewed provenance/verification fields without changing the 2–4 entity selection contract.

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

State: `HOLD / EVIDENCE CAPTURE`

Decision semantics:

```text
GO    -> staged Japanese expansion may continue; Language Selection becomes eligible for execution
HOLD  -> keep Pilot stable; continue evidence capture and core/data-quality work
PIVOT -> retain useful Pilot work; do not expand aggressively; repair or reduce scope before Language Selection
```

L-2 does not authorize a third language. D-1000 is complete, but until the observation and required external metrics are complete and the decision is reproducible from real evidence, HOLD remains correct and Language Selection remains blocked.

Authority:

```text
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
config/l2-localization-evaluation-contract.json
data-evaluation/l2-localization-evidence.json
```

## 12. D-1000 Reviewed Entity Milestone

State: `COMPLETE`

```text
Target:   reviewed public entities >= 1000
Entities: 1000
Events:   1025
Evidence: 3781
Remaining: 0 reviewed entities
```

Completion authority:

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/audits/HEI_D1000_MILESTONE_COMPLETION_2026-08-09.md
```

The milestone was completed on reviewed `main` after BX50 with record overlap, duplicate, ID-collision, count-semantics, machine/public, URL-safety, localization, and public-output validation passing.

Post-D-1000 data growth remains allowed and should continue to use the same reviewed PR, evidence, dedupe, and manual-merge boundaries.

## 13. Language Selection Gate

State: `BLOCKED ON L-2 EVIDENCE / DECISION`

Prerequisites:

```text
D-1000 COMPLETE                         SATISFIED
Japanese Pilot evidence exists          INCOMPLETE
L-2 decision reproducible from evidence INCOMPLETE
```

No third language is preselected.

Decision:

```text
NO LAUNCH
  keep en + ja only

PILOT ONE LANGUAGE
  select exactly one evidence-supported third language
```

Do not run this gate from language preference or chat memory alone. It must use HEI-specific evidence and the L-2 decision record.

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

Current decision: `DEFER`.

Authority:

```text
docs/audits/HEI_AI_ERA_NATURAL_LANGUAGE_FILTER_EVALUATION_2026-08-16.md
```

Re-open only when evidence demonstrates real user/consumer need. Any future implementation must compile to the deterministic Explorer query contract, expose the resulting structured query, fail closed on unsupported concepts, remain optional, and never invent canonical facts or records.

### Phase K — API Expansion

Activate only after real external consumer need that static files cannot satisfy. Record-level bundles and deterministic Stats JSON remain the default machine-use path while sufficient.

## 16. AI-era resilience track

State: `COMPLETE` for the finite 2026-08 implementation pass.

Authority:

```text
docs/HEI_AI_ERA_REGISTRY_SPEC.md
docs/HEI_AI_ERA_EXECUTION_SCHEDULE.md
docs/audits/HEI_AI_ERA_PROVENANCE_LIFECYCLE_AUDIT_2026-08-15.md
docs/audits/HEI_AI_ERA_LIFECYCLE_FOLLOWUP_PASS_2026-08-16.md
docs/audits/HEI_AI_ERA_NATURAL_LANGUAGE_FILTER_EVALUATION_2026-08-16.md
docs/audits/HEI_AI_ERA_FINITE_PASS_CLOSEOUT_2026-08-16.md
```

Implemented direction:

```text
reviewed record-level machine-readable bundles       COMPLETE
Explorer provenance / verification strengthening    COMPLETE
Compare deterministic provenance extension           COMPLETE
Stats deterministic machine-readable outputs         COMPLETE
current-date lifecycle follow-up                      COMPLETE
natural-language translator evaluation                COMPLETE / DEFER
```

Stage A ordinary reviewed operations continue by design. Future lifecycle checkpoints remain normal Lane A / monitoring work and are tracked in Issue #768.

## 17. Immediate execution order

```text
1. Continue L-2 evidence capture under HOLD                CURRENT
2. Continue reviewed data/quality/lifecycle work in Lane A
3. Populate required external and operator-burden metrics
4. Reproduce the L-2 GO / HOLD / PIVOT decision
5. Run the Language Selection Gate
6. Phase I — Discovery Log Trial
7. Phase J only if later evidence justifies reopening
8. Phase K only if justified
```

## 18. Recovery

Primary runbook:

```text
docs/operations/HEI_MAINTAINER_RECOVERY_RUNBOOK.md
```

Recovery must determine repository identity, current main SHA, open PRs, deployment policy, roadmap checkpoint, AI-era registry/schedule state, active specifications, reviewed counts under build semantics, production/baseline verification state, required validation commands, and the first incomplete roadmap item.

At the 2026-08-16 checkpoint, recovery should resolve at minimum:

```text
Phase H COMPLETE
D-750 COMPLETE
L-1 COMPLETE / PUBLIC
L-2 HOLD / EVIDENCE CAPTURE
D-1000 COMPLETE
AI-era finite resilience pass COMPLETE
Entities: 1034
Events: 1039
Evidence: 3871
Language Selection BLOCKED ON L-2 EVIDENCE / DECISION
```

Dynamic main SHA, counts after later reviewed growth, and open PR state must still be read from current GitHub state.

## 19. Change control

Update this roadmap together with relevant specifications before changing:

- Compare position or contract behavior;
- 750 as the Japanese Pilot gate;
- L-1 scope;
- L-2 decision semantics;
- 1000 as the Language Selection Gate prerequisite;
- third-language selection rules;
- Discovery Log order;
- conditional activation of Phase J or K;
- AI-era provenance, lifecycle, machine-readable, deterministic-search, Compare, Stats, or AI-assisted retrieval boundaries.

Fixed localization priority remains:

```text
Compare -> 750 -> Japanese Pilot/evaluation -> 1000 -> language selection
```

The completed AI-era finite pass remains a mandatory cross-cutting product constraint rather than a replacement for that localization order.
