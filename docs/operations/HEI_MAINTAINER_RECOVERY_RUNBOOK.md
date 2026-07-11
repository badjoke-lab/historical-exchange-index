# HEI Maintainer Recovery Runbook

Status: required recovery procedure  
Scope: repository-only recovery after an interrupted thread, session, handoff, or maintainer change

## 1. Purpose

This runbook lets a new maintainer or agent reconstruct HEI development state from repository and current GitHub state alone.

Do not use remembered chat history as authority.

The recovery target is to determine:

```text
repository and default branch
current origin/main SHA
reviewed counts
current phase
current work item
next work item
active specifications
open product PRs
deployment policy
production verification state
validation commands
recovery sequence
```

Machine-readable companion:

```text
config/maintainer-recovery-contract.json
```

## 2. Authority order

Read in this order:

```text
1. AGENTS.md
2. docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md
3. config/cloudflare-pages-project.json
4. docs/HEI_V1_EXECUTION_ROADMAP.md
5. active phase specification
6. task-specific contracts/specifications
7. latest dated production verification report when production state matters
8. current GitHub state for SHA, branches, workflows, and open PRs
```

Rules:

- repository/GitHub state wins when a checkpoint is stale;
- deployment policy wins on Cloudflare behavior;
- roadmap controls execution order;
- task specifications control behavior and completion gates;
- main SHA and open PRs are dynamic and must be inspected;
- reviewed counts must use public build semantics, not base-array lengths.

## 3. Step 1 — Confirm repository identity and default branch

Expected repository:

```text
badjoke-lab/historical-exchange-index
```

Expected default branch:

```text
main
```

Local commands:

```bash
git remote -v
git branch --show-current
git remote show origin
```

Stop if you are in the wrong repository.

## 4. Step 2 — Fetch current remote state and record origin/main SHA

Do not copy a SHA from an old handoff.

```bash
git fetch origin --prune
git rev-parse origin/main
```

Record the returned SHA as the recovery input commit.

For feature-branch recovery also record:

```bash
git rev-parse HEAD
git merge-base HEAD origin/main
```

Never treat stale local `main` as current without fetching remote state first.

## 5. Step 3 — Inspect open PRs and branch state

Open product PRs are dynamic.

```bash
gh pr list --state open --limit 100
```

Inspect:

```text
PR title
head branch
base branch
mergeability
head SHA
workflow state
roadmap item advanced by the PR
```

Do not permanently encode transient open PR numbers into this runbook or recovery contract.

## 6. Step 4 — Read AGENTS + deployment policy + Cloudflare project policy

Read:

```text
AGENTS.md
docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md
config/cloudflare-pages-project.json
```

Confirm current repository policy for:

```text
production branch
production deployment enablement
preview deployment setting
PR deployment comments
build watch paths
```

Never expose Cloudflare credentials in repository files, issues, PRs, or logs.

## 7. Step 5 — Read roadmap current checkpoint and execution order

Read:

```text
docs/HEI_V1_EXECUTION_ROADMAP.md
config/maintainer-recovery-contract.json
```

Extract:

```text
current phase
current work item
next work item
reviewed counts
immediate execution order
post-v1 milestone gates
```

If roadmap and current GitHub state disagree:

1. inspect current main and open PRs;
2. determine actual repository state;
3. continue from repository truth;
4. repair the stale checkpoint in the next appropriate reviewed PR.

Current reviewed checkpoint after D-750 and L-1 completion:

```text
current phase: L-2 Localization Evaluation Gate
current work item: L2-1 — Evaluation contract, telemetry, and evidence capture
next work item: D-1000 Reviewed Entity Milestone
```

Phase state:

```text
Phase G — v1.0 Integration Baseline: COMPLETE
Phase H — Compare v1:                 COMPLETE
D-750 Reviewed Entity Milestone:      COMPLETE
L-1 Japanese Pilot:                   COMPLETE
L-2 Localization Evaluation Gate:     CURRENT
```

The fixed post-v1 priority sequence remains:

```text
Phase H — Compare v1                 COMPLETE
D-750 Reviewed Entity Milestone      COMPLETE
L-1 Japanese Pilot                   COMPLETE
L-2 Localization Evaluation Gate     CURRENT
D-1000 Reviewed Entity Milestone     NEXT AFTER L-2 DECISION
Language Selection Gate
```

Current GitHub state remains authoritative if this checkpoint later becomes stale.

## 8. Step 6 — Derive reviewed counts using public build aggregation semantics

Reviewed public state is not equal to base-array lengths alone.

Inputs include:

```text
base arrays:
  data/entities.json
  data/events.json
  data/evidence.json

reviewed bundles:
  records/exchanges/*.json

plus:
  entity corrections
  entity identity resolution
  event/evidence merge semantics
```

Do not manually reimplement simplified count logic.

Use the same aggregation modules as public build and recovery validation:

```text
scripts/lib/reviewed-bundle-aggregation.mjs
scripts/lib/entity-corrections.mjs
```

Current expected reviewed counts:

```text
Entities:  750
Events:    1004
Evidence:  3219
```

Run:

```bash
npm run recovery:validate
```

The validator reports reviewed counts under build semantics and rejects stale checkpoint counts.

Data growth gates are defined in:

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
```

The milestone count rules explicitly reject:

- raw candidate count;
- monitoring finding count;
- staging count;
- base JSON array lengths alone;
- unmerged PR count.

## 9. Step 7 — Read active phase specification and task-specific contracts

For the current L-2 phase, read:

```text
docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
config/l2-localization-evaluation-contract.json
data-evaluation/l2-localization-evidence.json
```

For Japanese Pilot maintenance, also read:

```text
docs/HEI_L1_JAPANESE_PILOT_IMPLEMENTATION_PLAN.md
config/japanese-pilot-route-contract.json
```

For data-growth planning after L-2, read:

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
```

For Compare maintenance, also read:

```text
docs/HEI_COMPARE_V1_SPEC.md
config/compare-v1-contract.json
```

L-2 decides GO / HOLD / PIVOT for the Japanese Pilot. It does not authorize a third language.

## 10. Step 8 — Read latest production verification report before production diagnosis

Historical v1 baseline production evidence remains in:

```text
docs/audits/HEI_G7_V1_BASELINE_CHECKPOINT_2026-07-07.md
```

Latest Compare completion and H-5 production evidence is summarized in:

```text
docs/audits/HEI_H5_COMPARE_V1_COMPLETION_2026-07-08.md
```

Current production diagnosis still begins with deployed commit identity:

```text
/version.json
```

Do not diagnose a stale deployment as a code defect before comparing deployed commit identity with the expected current main commit.

## 11. Step 9 — Run recovery validator and relevant project validation commands

Core commands:

```bash
npm run policy:check
npm run records:validate
npm run machine:validate
npm run public:validate
npm run localization:evaluate:test
npm run localization:telemetry:test
npm run localization:evaluate
npm run recovery:test
npm run recovery:validate
```

For L-2 evaluation changes, confirm:

```text
GO/HOLD/PIVOT self-test passes
telemetry source test passes
current evidence snapshot evaluates reproducibly
third_language_authorized remains false
```

For data-growth changes, run the relevant overlap, duplicate, ID-collision, count-semantics, and quality gates already wired into GitHub Actions.

For Compare maintenance changes, also use:

```bash
npm run compare:test
npm run compare:audit
```

## 12. Step 10 — Resume the first incomplete roadmap item

At this checkpoint:

```text
Phase H COMPLETE
D-750 COMPLETE
L-1 COMPLETE
L-2 CURRENT
```

Resume L2-1 evaluation evidence capture and keep the current decision at HOLD until the minimum observation window and required evidence are complete.

Do not fabricate Search Console or GA4 values. Do not infer demand from route existence alone.

After the L-2 decision, resume the D-1000 Reviewed Entity Milestone according to roadmap order.

## 13. Step 11 — Repair stale checkpoint in the next appropriate reviewed PR

When repository state advances:

1. update the roadmap checkpoint;
2. update `config/maintainer-recovery-contract.json` when current phase/item/next item changes;
3. update this runbook checkpoint section when needed;
4. preserve historical baseline evidence rather than rewriting it as current state;
5. keep dynamic main SHA and open PR state outside permanent assumptions.

## 14. Recovery sequence summary

```text
confirm repository identity and default branch
fetch current remote state and record origin/main SHA
inspect open PRs and branch state
read AGENTS + deployment policy + Cloudflare project policy
read roadmap current checkpoint and execution order
read active phase specification and task-specific contracts
derive reviewed counts using public build aggregation semantics
read latest production verification report before production diagnosis
run recovery validator and relevant project validation commands
resume the first incomplete roadmap item
repair stale checkpoint in the next appropriate reviewed PR
```
