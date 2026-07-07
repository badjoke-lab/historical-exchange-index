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

At the 2026-07-07 G-7 branch checkpoint, repository authorities expect:

```text
current phase: Phase G — v1.0 Integration Baseline
current work item: G-7 v1.0 Baseline Checkpoint
next work item: Phase H — Compare v1
```

The fixed post-v1 priority sequence is:

```text
Phase H — Compare v1
D-750 Reviewed Entity Milestone
L-1 Japanese Pilot
L-2 Localization Evaluation Gate
D-1000 Reviewed Entity Milestone
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

Current expected reviewed counts at the G-7 baseline candidate:

```text
Entities:  550
Events:    1004
Evidence: 2621
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

Primary specifications:

```text
docs/HEI_PRODUCT_SURFACES_SPEC.md
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md
docs/HEI_V1_INTEGRATION_BASELINE_SPEC.md
```

Current G-7 baseline assets:

```text
config/v1-baseline-contract.json
scripts/validate-v1-baseline.mjs
scripts/test-v1-baseline-validator.mjs
```

Phase G contracts include:

```text
config/url-display-policy.json
config/cross-surface-integration-contract.json
config/machine-public-consistency-contract.json
config/production-verification-contract.json
config/maintainer-recovery-contract.json
```

Explorer work also requires:

```text
config/explorer-query-contract.json
config/stats-explorer-deep-link-map.json
docs/HEI_STATS_EXPLORER_HANDOFF.md
```

Do not infer behavior from old conversation text when repository contracts exist.

## 10. Step 8 — Read latest production verification report before production diagnosis

Read:

```text
docs/audits/HEI_G5_PRODUCTION_VERIFICATION_2026-07-07.md
config/production-verification-contract.json
scripts/check-machine-readable-production.mjs
scripts/verify-production-integration.mjs
.github/workflows/production-verification-gate.yml
```

Production authority rule:

```text
check deployed /version.json commit first
compare with expected commit
only diagnose route/output behavior after commit equality
```

The G-5 verification system covers:

```text
expected/deployed commit equality
machine-readable production layer
core routes
Explorer query routes
representative deep links
public machine files
sitemap
robots
representative exchange dossier
```

A stale deployment is not evidence of a code defect.

## 11. Step 9 — Run recovery validator and relevant project validation commands

Minimum recovery validation commands:

```bash
npm run recovery:test
npm run recovery:validate
```

Required command references:

```bash
npm run policy:check
npm run records:validate
npm run machine:validate
npm run public:validate
npm run recovery:test
npm run recovery:validate
```

For data growth:

- read the data-growth milestone specification;
- run record overlap/duplicate/ID collision checks;
- preserve reviewed-public boundary;
- derive milestone counts using public build aggregation semantics.

For localization:

- read both growth and localization specifications;
- preserve 750 and 1000 release gates;
- run i18n validation and public locale route checks.

For Explorer work:

- run Explorer contract and Stats handoff checks.

For G-7:

- run baseline self-test and baseline validation once package/workflow integration is present;
- confirm production expected/deployed commit equality;
- confirm final workflow set.

## 12. Step 10 — Resume the first incomplete roadmap item

Do not skip to a remembered task.

Resume the first incomplete item shown by:

```text
current GitHub state
roadmap current checkpoint
active task specification
open product PR state
```

## 13. Recovery sequence

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
read active phase specification and task-specific contracts
        ↓
derive reviewed counts using public build aggregation semantics
        ↓
read latest production verification report before production diagnosis
        ↓
run recovery validator and relevant project validation commands
        ↓
resume the first incomplete roadmap item
        ↓
repair stale checkpoint in the next appropriate reviewed PR
```

## 14. Interrupted PR recovery

When a session ended with an open PR:

1. inspect PR metadata and current head SHA;
2. compare PR base with current main;
3. inspect changed files;
4. inspect workflows for the current head SHA;
5. read PR body for roadmap/spec traceability;
6. inspect diagnostic artifacts from failed gates;
7. repair verified findings only;
8. rerun final-head workflows;
9. merge only after required gates pass;
10. update roadmap/checkpoint in the same or next appropriate reviewed PR.

Do not assume a PR is ready because an older head passed CI.

## 15. Production incident recovery

Before diagnosing a production problem:

```text
1. read deployed /version.json
2. compare deployed build.commit with expected reviewed commit
3. if stale, classify as deployment lag/state mismatch
4. if equal, reproduce the affected route/file
5. inspect the relevant verification/audit contract
6. diagnose code/output only after commit equality
```

Commands:

```bash
EXPECTED_COMMIT=<reviewed-main-sha> npm run production:check
npm run production:verify-integration
```

## 16. Canonical data incident recovery

If reviewed data appears damaged:

1. stop automated promotion/merge work;
2. inspect `origin/main` and the suspected introducing PR;
3. run `npm run records:validate`;
4. inspect base arrays and reviewed `records/exchanges` bundles;
5. run ID collision, overlap, duplicate, enum, reference, and count-semantic checks;
6. never copy raw monitoring/staging candidates directly into reviewed public inputs;
7. repair through a reviewed PR;
8. rebuild machine-readable/public output;
9. run public consistency validation;
10. verify production only after deployment commit equality.

## 17. Growth/localization recovery

Before changing the order of data growth and localization:

1. read `docs/HEI_V1_EXECUTION_ROADMAP.md`;
2. read `docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md`;
3. read `docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md`;
4. confirm current reviewed entity count under build semantics;
5. preserve these gates unless a reviewed authority change deliberately replaces them:

```text
750 before Japanese public pilot
1000 before Language Selection Gate
no third language preselected
one additional language pilot at a time
```

## 18. Recovery completion checklist

A repository-only recovery is complete only when the maintainer can state, with repository evidence:

```text
[ ] repository and default branch
[ ] current origin/main SHA
[ ] reviewed counts under public build aggregation semantics
[ ] current phase
[ ] current work item
[ ] next work item
[ ] active specifications
[ ] current open product PR state
[ ] deployment policy and project state
[ ] latest production verification state
[ ] required validation commands
[ ] exact recovery sequence
[ ] current 750/1000 localization gates
```

Do not proceed from a remembered schedule when repository authorities can be read directly.
