# HEI Maintainer Recovery Runbook

Status: required recovery procedure  
Scope: repository-only recovery after an interrupted thread, session, handoff, or maintainer change

## 1. Purpose

This runbook lets a new maintainer or agent reconstruct the current HEI development state from repository and current GitHub state alone.

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
6. task-specific contract/specification
7. latest dated production verification report when production state matters
8. current GitHub state for main SHA, branches, workflows, and open PRs
```

Rules:

- repository/GitHub state wins when a checkpoint is stale;
- deployment policy wins on Cloudflare behavior;
- the roadmap controls execution order;
- specifications and machine contracts control their own scopes;
- open PR state and main SHA are dynamic and must be inspected, not permanently hard-coded.

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

For feature-branch recovery, also record:

```bash
git rev-parse HEAD
git merge-base HEAD origin/main
```

Never treat a stale local `main` as current without fetching remote state first.

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

Confirm:

```text
production branch: main
production deployments: enabled
preview deployment setting: none
PR deployment comments: disabled
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
```

If roadmap and current GitHub state disagree:

1. inspect current main and open PRs;
2. determine actual repository state;
3. continue from repository truth;
4. repair the stale checkpoint in the next appropriate reviewed PR.

Current G-6 contract expects:

```text
current phase: Phase G — v1.0 Integration Baseline
current work item: G-6 Maintainer Runbook and Recovery Validation
next work item: G-7 v1.0 Baseline Checkpoint
```

## 8. Step 6 — Derive reviewed counts using record build semantics

This repository has two reviewed record inputs:

```text
base data arrays:
  data/entities.json
  data/events.json
  data/evidence.json

reviewed record bundles:
  records/exchanges/*.json
```

Do **not** treat base-array lengths alone as the current reviewed counts.

The production build semantics are defined by:

```text
scripts/build-data-from-records.mjs
```

That build starts from the base arrays and adds or verifies IDs from every reviewed bundle under `records/exchanges/`. Recovery counts must therefore be derived as the unique-ID union of:

```text
base entity IDs + bundle entity IDs
base event IDs + bundle event IDs
base evidence IDs + bundle evidence IDs
```

Current expected reviewed counts:

```text
Entities:  550
Events:    1004
Evidence: 2621
```

Run:

```bash
npm run recovery:validate
```

The validator reports both:

```text
base data counts
reviewed counts after record build semantics
record bundle file count
```

This distinction is required because base arrays can legitimately be smaller than the reviewed production state represented by base data plus reviewed bundles.

If the derived unique-ID union differs from the roadmap/recovery contract, repository build inputs are authoritative and the stale checkpoint must be repaired in a reviewed PR.

## 9. Step 7 — Read active phase specification and task-specific contracts

For Phase G:

```text
docs/HEI_V1_INTEGRATION_BASELINE_SPEC.md
```

Primary specifications:

```text
docs/HEI_PRODUCT_SURFACES_SPEC.md
docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md
```

Current Phase G contracts:

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

The G-5 report records PASS for:

```text
expected/deployed commit equality
machine-readable production layer
12 core routes
2 Explorer query routes
3 representative deep links
11 public machine files
562 sitemap URLs
robots contract
representative /exchange/mt-gox/ dossier
```

A stale deployment is not evidence of a code defect.

## 11. Step 9 — Run recovery validator and relevant project validation commands

Minimum recovery validation commands:

```bash
npm run recovery:test
npm run recovery:validate
```

`recovery:test` verifies the validator detects broken fixtures.

`recovery:validate` verifies:

```text
authoritative path existence
reviewed count derivation under record build semantics
roadmap current/next visibility
runbook required information coverage
package command references
deployment policy/config agreement
production PASS reference
AGENTS authority chain
dynamic-state rules
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

For data changes, also run relevant strict data/quality gates.

For Explorer work, run Explorer contract and handoff checks.

For Phase G public-output work, preserve accessibility, URL safety, cross-surface integration, machine/public consistency, i18n, and production verification gates.

## 12. Step 10 — Resume the first incomplete roadmap item

Do not skip to a remembered task. Resume the first incomplete item shown by repository/current GitHub state and the roadmap authority chain.

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
derive canonical counts under record build semantics
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

1. inspect PR metadata and head SHA;
2. compare PR base SHA with current main;
3. inspect changed files;
4. inspect all workflow runs for the current PR head SHA;
5. read PR body for roadmap/spec traceability;
6. inspect diagnostic artifacts from failed audit gates;
7. repair verified findings only;
8. rerun final-head workflows;
9. merge only after required gates pass;
10. update roadmap/checkpoint in the same or next appropriate PR.

Do not assume a PR is ready because an older head passed CI.

## 15. Production incident recovery

Before diagnosing a production problem:

```text
1. read deployed /version.json
2. compare deployed build.commit with expected reviewed main commit
3. if stale, classify as deployment lag/state mismatch
4. if equal, reproduce the affected route/file
5. inspect the relevant production verification/audit contract
6. diagnose code/output only after commit equality
```

Commands:

```bash
EXPECTED_COMMIT=<reviewed-main-sha> npm run production:check
npm run production:verify-integration
```

The integration contract remains pinned to the G-5 verified baseline until a later reviewed production verification deliberately advances it.

## 16. Canonical data incident recovery

If reviewed data appears damaged:

1. stop automated promotion/merge work;
2. inspect `origin/main` and suspected introducing PR;
3. run `npm run records:validate`;
4. inspect base arrays and reviewed `records/exchanges` bundles;
5. run ID collision, overlap, duplicate, enum, reference, and count-semantic checks;
6. never copy raw monitoring/staging candidates directly into canonical inputs;
7. repair through a reviewed PR;
8. rebuild machine-readable/public output;
9. run public consistency validation;
10. verify production only after deployment commit equality.

## 17. Recovery completion checklist

A repository-only recovery is complete only when the maintainer can state, with repository evidence:

```text
[ ] repository and default branch
[ ] current origin/main SHA
[ ] reviewed counts under record build semantics
[ ] current phase
[ ] current work item
[ ] next work item
[ ] active specifications
[ ] current open product PRs state
[ ] deployment policy and project state
[ ] latest production verification state
[ ] required validation commands
[ ] exact recovery sequence
```

The G-6 validator and dated clean-room recovery report are completion evidence for this runbook.
