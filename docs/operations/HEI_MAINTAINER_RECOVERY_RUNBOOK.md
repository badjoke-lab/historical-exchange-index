# HEI Maintainer Recovery Runbook

Status: required recovery procedure  
Scope: repository-only recovery after an interrupted thread, session, handoff, or maintainer change

## 1. Purpose

This runbook lets a new maintainer or agent reconstruct HEI development state from repository and current GitHub state alone. Do not use remembered chat history as authority.

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
5. docs/HEI_AI_ERA_REGISTRY_SPEC.md
6. docs/HEI_AI_ERA_EXECUTION_SCHEDULE.md
7. config/maintainer-recovery-contract.json
8. active phase specification
9. task-specific contracts/specifications
10. latest exact-commit production verification evidence when production state matters
11. current GitHub state for SHA, branches, workflows, open PRs, and issues
```

Rules:

- repository/GitHub state wins when a checkpoint is stale;
- deployment policy wins on Cloudflare behavior;
- roadmap controls execution order;
- AI-era registry/schedule controls provenance, lifecycle, deterministic machine-use, Explorer, Compare, Stats, and later AI-assisted retrieval boundaries;
- task specifications control detailed behavior and completion gates;
- main SHA and open PRs are dynamic and must be inspected;
- reviewed counts must use public build semantics, not base-array lengths.

## 3. Recovery sequence

The canonical recovery sequence is intentionally explicit so a new maintainer can execute it without chat history.

1. **Confirm repository identity** and default branch.
2. **Fetch current remote** state and record `origin/main` SHA.
3. **Inspect open PRs** and branch state.
4. **Read AGENTS + deployment policy + Cloudflare project policy**.
5. **Read roadmap current** checkpoint and execution order.
6. **Read AI-era registry** specification + execution schedule + closeout report.
7. **Read active phase** specification and task-specific contracts.
8. **Derive reviewed counts** using public build aggregation semantics.
9. **Read exact-commit production** verification state before production diagnosis.
10. **Run recovery validator** and relevant project validation commands.
11. **Resume the first** incomplete roadmap item while preserving completed AI-era boundaries.
12. **Repair stale checkpoint** in the next appropriate reviewed PR.

## 4. Confirm repository identity and default branch

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

## 5. Fetch current remote state and record origin/main SHA

Do not copy a SHA from an old handoff.

```bash
git fetch origin --prune
git rev-parse origin/main
```

For feature-branch recovery also record:

```bash
git rev-parse HEAD
git merge-base HEAD origin/main
```

Never treat stale local `main` as current without fetching remote state first.

## 6. Inspect open PRs and branch state

Open product PRs are dynamic.

```bash
gh pr list --state open --limit 100
```

Inspect PR title, head/base branch, mergeability, head SHA, workflow state, and roadmap item. Also inspect open issues when they carry scheduled follow-up work, including lifecycle checkpoints.

Do not permanently encode transient open PR numbers as current truth.

## 7. Read AGENTS + deployment policy + Cloudflare project policy

Read:

```text
AGENTS.md
docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md
config/cloudflare-pages-project.json
```

Confirm production branch, production deployment enablement, preview setting, build watch paths, and commit-first production verification rules. Never expose Cloudflare credentials.

## 8. Read roadmap current checkpoint and execution order

Read:

```text
docs/HEI_V1_EXECUTION_ROADMAP.md
config/maintainer-recovery-contract.json
```

At the 2026-08-16 closeout checkpoint the expected state is:

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

The current phase is `L-2 Localization Evaluation Gate`. The current work item is `L2-1 — Evaluation contract, telemetry, and evidence capture`. The next work item is `Language Selection Gate`, but it remains blocked until L-2 has real evidence and a reproducible decision.

If repository state later differs, recover from repository/GitHub truth and repair stale documentation in a reviewed PR.

## 9. Read AI-era registry specification + execution schedule + closeout report

Mandatory authorities:

```text
docs/HEI_AI_ERA_REGISTRY_SPEC.md
docs/HEI_AI_ERA_EXECUTION_SCHEDULE.md
docs/audits/HEI_AI_ERA_FINITE_PASS_CLOSEOUT_2026-08-16.md
```

The finite B-H implementation pass is complete. Do not reopen completed work merely because Stage A normal operations, L-2 evidence collection, or future lifecycle follow-ups continue.

Continuing rules include reviewed-only publication, provenance visibility, record-level deterministic JSON, deterministic Explorer/Compare/Stats behavior, no generated canonical facts, and human-accountable review.

## 10. Read active phase specification and task-specific contracts

For the current L-2 phase read at minimum:

```text
docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
config/l2-localization-evaluation-contract.json
data-evaluation/l2-localization-evidence.json
```

For data, Explorer, Compare, Stats, machine-readable, monitoring, or lifecycle work, also read the matching task-specific authority listed in `config/maintainer-recovery-contract.json`.

## 11. Derive reviewed counts using public build aggregation semantics

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

Use the same aggregation modules as public build and recovery validation:

```text
scripts/lib/reviewed-bundle-aggregation.mjs
scripts/lib/entity-corrections.mjs
```

Expected reviewed counts at this checkpoint:

```text
Entities: 1034
Events:   1039
Evidence: 3871
```

These numbers are a checkpoint only. Re-derive them after later reviewed growth.

## 12. Read exact-commit production verification state before production diagnosis

A stale deployment is not a code defect. Start with `/version.json` and compare the deployed build commit to the expected Git commit.

Relevant evidence includes:

- the historical production verification report named in the recovery contract;
- current exact-commit machine-readable production smoke runs;
- current exact-commit Compare production verification when Compare behavior matters;
- the AI-era closeout report for the 2026-08 finite pass.

At finite AI-era closeout:

```text
Stage C/D machine-readable production smoke: 31927708917 PASS
Stage E Compare production verification:     31928424433 PASS
Stage F main CI:                              31928619171 PASS
Stage F machine-readable production smoke:   31928845519 PASS
```

Do not infer current production state from these historical run IDs after later public deployments; inspect current GitHub and `/version.json` first.

## 13. Run recovery validator and relevant project validation commands

Required validation commands from the recovery contract are:

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

Public-output implementation CI also validates the dedicated record-level and Stats machine-readable outputs. Do not remove those CI checks merely because they are not separate recovery-contract commands.

Expected L-2 evaluation remains `HOLD` while required real external evidence is missing. A reproducible HOLD is not a failed recovery.

## 14. Resume the first incomplete roadmap item while preserving completed AI-era boundaries

After successful recovery:

1. continue L-2 evidence capture if real external evidence is available;
2. continue reviewed data/quality/lifecycle work in parallel;
3. process scheduled lifecycle follow-ups through normal reviewed Lane A;
4. do not run Language Selection before the L-2 gate allows it;
5. do not revive the natural-language translator unless its evidence-backed reopening conditions are met.

The finite AI-era implementation pass being complete does not stop ordinary HEI maintenance.

## 15. Repair stale checkpoint in the next appropriate reviewed PR

If counts, phase text, current authority, production evidence, or branch state has legitimately advanced, update the affected roadmap/spec/recovery authority in the same appropriate reviewed workflow. Do not weaken fail-close validators just to make stale text pass.

## 16. Recovery completion checklist

Recovery is complete only when all are known or verified:

```text
[ ] repository and default branch
[ ] current origin/main SHA
[ ] open PR and relevant issue state
[ ] current reviewed counts under build semantics
[ ] current phase / current item / next item
[ ] L-2 decision/evidence state
[ ] AI-era registry/schedule/closeout state
[ ] deployment policy and watched paths
[ ] current exact-commit production state when relevant
[ ] required validation results
[ ] first incomplete roadmap item
```
