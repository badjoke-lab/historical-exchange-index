# HEI Maintainer Recovery Runbook

Status: required recovery procedure  
Scope: repository-only recovery after an interrupted thread, session, handoff, or maintainer change

## 1. Purpose

This runbook must let a new maintainer or agent reconstruct the current HEI development state from repository and current GitHub state alone.

Do not use remembered chat history as authority.

The recovery target is to determine:

```text
repository and default branch
current origin/main SHA
reviewed entity/event/evidence counts
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
6. task-specific contract/specification
7. latest dated production verification report when production state matters
8. current GitHub state for main SHA, branches, workflows, and open PRs
```

Rules:

- repository/GitHub state wins when a checkpoint is stale;
- the deployment policy wins on Cloudflare deployment behavior;
- the roadmap controls execution order;
- product, localization, Explorer, monitoring, and Phase G specifications control their respective behavior/completion gates;
- current GitHub PR state is dynamic and must not be replaced by a permanently hard-coded PR number list.

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

GitHub-side recovery should inspect the repository metadata directly.

Stop if you are in the wrong repository.

## 4. Step 2 — Fetch and record current main SHA

Do not copy a SHA from an old handoff.

Local recovery:

```bash
git fetch origin --prune
git rev-parse origin/main
```

Record the returned SHA as the recovery input commit.

If current work is on a feature branch, also record:

```bash
git rev-parse HEAD
git merge-base HEAD origin/main
```

Never treat a stale local `main` as current without fetching remote state first.

## 5. Step 3 — Inspect open PRs and branch state

Open product PR state is dynamic.

With GitHub CLI:

```bash
gh pr list --state open --limit 100
```

Also inspect:

```text
PR title
head branch
base branch
mergeability
workflow state
whether the PR advances the roadmap item currently marked active
```

Do not permanently encode transient open PR numbers into this runbook or the recovery contract.

## 6. Step 4 — Read mandatory operating instructions

Read:

```text
AGENTS.md
docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md
config/cloudflare-pages-project.json
```

Before touching deployment-sensitive paths, confirm:

```text
production branch: main
production deployments: enabled
preview deployment setting: none
PR deployment comments: disabled
```

Never expose Cloudflare credentials in files, issues, PRs, or logs.

## 7. Step 5 — Read roadmap current checkpoint

Read:

```text
docs/HEI_V1_EXECUTION_ROADMAP.md
```

Extract:

```text
current phase
current item
current PR if recorded
next item
reviewed counts
immediate execution order
```

If roadmap and current GitHub state disagree:

1. inspect current main and open PRs;
2. determine the actual repository state;
3. continue from repository truth;
4. repair the stale roadmap checkpoint in the next appropriate reviewed PR.

For the current G-6 checkpoint, the contract expects:

```text
current phase: Phase G — v1.0 Integration Baseline
current item:  G-6 Maintainer Runbook and Recovery Validation
next item:     G-7 v1.0 Baseline Checkpoint
```

## 8. Step 6 — Derive reviewed counts from canonical data

Canonical public data:

```text
data/entities.json
data/events.json
data/evidence.json
```

Derive counts directly:

```bash
node -e "const e=require('./data/entities.json'); const v=require('./data/events.json'); const s=require('./data/evidence.json'); console.log({entities:e.length,events:v.length,evidence:s.length})"
```

Current expected reviewed counts for this checkpoint:

```text
Entities:  550
Events:    1004
Evidence: 2621
```

If actual canonical array lengths differ, repository data wins and the recovery contract/roadmap must be updated in the same appropriate PR.

## 9. Step 7 — Resolve active specifications

Always read the active phase specification.

For Phase G:

```text
docs/HEI_V1_INTEGRATION_BASELINE_SPEC.md
```

Other primary specifications:

```text
docs/HEI_PRODUCT_SURFACES_SPEC.md
docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md
```

Task-specific contracts currently relevant to completed Phase G work:

```text
config/url-display-policy.json
config/cross-surface-integration-contract.json
config/machine-public-consistency-contract.json
config/production-verification-contract.json
config/maintainer-recovery-contract.json
```

Explorer work additionally requires:

```text
config/explorer-query-contract.json
config/stats-explorer-deep-link-map.json
docs/HEI_STATS_EXPLORER_HANDOFF.md
```

Do not infer behavior from old conversation text when these repository contracts exist.

## 10. Step 8 — Recover production verification state

Read the latest dated production verification report:

```text
docs/audits/HEI_G5_PRODUCTION_VERIFICATION_2026-07-07.md
```

Also inspect:

```text
config/production-verification-contract.json
scripts/check-machine-readable-production.mjs
scripts/verify-production-integration.mjs
.github/workflows/production-verification-gate.yml
```

G-5 authority rule:

```text
check deployed /version.json commit first
compare with expected commit
only diagnose route behavior after commit equality
```

The G-5 report records a PASS for:

```text
expected/deployed commit equality
machine-readable production layer
12 core routes
2 Explorer query routes
3 representative deep links
11 machine/public files
562 sitemap URLs
robots contract
representative Mt. Gox dossier
```

A stale deployment is not evidence of a code defect.

## 11. Step 9 — Run recovery validation

Run:

```bash
npm run recovery:test
npm run recovery:validate
```

`recovery:test` verifies the recovery validator can detect broken fixtures.

`recovery:validate` verifies current repository recovery completeness, including:

```text
authoritative path existence
canonical count agreement
roadmap current/next item visibility
runbook required information coverage
package command references
deployment policy/config agreement
production verification reference and PASS state
AGENTS recovery authority chain
```

Do not continue from a contradictory recovery state without resolving or explicitly documenting the contradiction.

## 12. Step 10 — Run project validation appropriate to the task

Minimum recovery command references:

```bash
npm run policy:check
npm run records:validate
npm run machine:validate
npm run public:validate
npm run recovery:test
npm run recovery:validate
```

For data changes, also run the relevant strict data/quality gates.

For Explorer work, run Explorer contract and handoff checks.

For Phase G public-output work, preserve the dedicated accessibility, URL safety, cross-surface integration, machine/public consistency, i18n, and production verification gates.

## 13. Step 11 — Resume the first incomplete roadmap item

Recovery sequence:

```text
confirm repository identity and default branch
        ↓
fetch current remote state and record origin/main SHA
        ↓
inspect open PRs and branch state
        ↓
read AGENTS + deployment policy + Cloudflare project policy
        ↓
read roadmap current checkpoint and execution order
        ↓
read active phase spec and task-specific contracts
        ↓
derive canonical counts from canonical JSON arrays
        ↓
read latest production verification report before production diagnosis
        ↓
run recovery validator and relevant project validation
        ↓
resume the first incomplete roadmap item
        ↓
repair stale checkpoints in the next appropriate reviewed PR
```

Do not skip directly to a remembered next task.

## 14. Interrupted PR recovery

When a thread/session ended with an open PR:

1. inspect PR metadata and head SHA;
2. compare the PR base SHA with current main;
3. inspect changed files;
4. inspect all workflow runs associated with the current PR head SHA;
5. read PR body for roadmap/spec traceability;
6. inspect any diagnostic artifacts for failed audit gates;
7. repair only verified findings;
8. rerun final-head workflows;
9. merge only after required gates pass;
10. update roadmap/checkpoint in the same or next appropriate PR.

Do not assume a PR is ready because an older head passed CI.

## 15. Production incident recovery

Before diagnosing a reported production problem:

```text
1. read deployed /version.json
2. compare deployed build.commit with expected reviewed main commit
3. if stale, classify as deployment lag/state mismatch
4. if equal, reproduce the affected route/file
5. inspect the relevant production verification/audit contract
6. diagnose code or output only after commit equality
```

Production commands:

```bash
EXPECTED_COMMIT=<reviewed-main-sha> npm run production:check
npm run production:verify-integration
```

The integration verifier contract currently remains pinned to the G-5 verified production baseline until a later reviewed production verification deliberately advances it.

## 16. Canonical data incident recovery

If canonical data appears damaged:

1. stop automated promotion/merge work;
2. inspect `origin/main` and the suspected introducing PR;
3. run `npm run records:validate`;
4. run ID collision, overlap, duplicate, enum, reference, and count-semantic checks;
5. do not copy raw monitoring/staging candidates into canonical data;
6. repair through a reviewed canonical PR;
7. rebuild machine-readable output;
8. run public consistency validation;
9. verify production only after deployment commit equality.

## 17. Recovery completion checklist

A repository-only recovery is complete only when the maintainer can state, with repository evidence:

```text
[ ] repository and default branch
[ ] current origin/main SHA
[ ] reviewed counts
[ ] current phase
[ ] current work item
[ ] next work item
[ ] active specifications
[ ] current open PR state
[ ] deployment policy and project state
[ ] latest production verification state
[ ] required validation commands
[ ] exact recovery/resume sequence
```

The G-6 validator and dated recovery exercise report are the completion evidence for this runbook.
