# HEI G-6 Maintainer Recovery Validation — 2026-07-07

Status: PASS  
Roadmap item: G-6 Maintainer Runbook and Recovery Validation  
Canonical count impact: none

## 1. Purpose

G-6 verifies that HEI can be recovered from repository and current GitHub state without relying on remembered conversation history.

The recovery system consists of:

```text
docs/operations/HEI_MAINTAINER_RECOVERY_RUNBOOK.md
config/maintainer-recovery-contract.json
scripts/validate-maintainer-recovery.mjs
scripts/test-maintainer-recovery-validator.mjs
.github/workflows/maintainer-recovery-gate.yml
```

## 2. Recovery target

A maintainer or agent must be able to determine:

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

Dynamic values such as current main SHA and open PRs are derived from current repository/GitHub state and are not permanently hard-coded.

## 3. Authority chain

Recovery reads authority in this order:

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

Repository/GitHub state is authoritative when a checkpoint is stale.

## 4. Count-recovery defect discovered by G-6

The first repository-only validator attempted to derive reviewed counts from the three base arrays only:

```text
data/entities.json   306
data/events.json     513
data/evidence.json   1172
```

This was incorrect for current HEI repository semantics.

The reviewed public state is built from:

```text
base canonical arrays
+
reviewed records/exchanges bundles
+
reviewed entity corrections
+
identity resolution for bundle entities
+
event/evidence ID merge semantics
```

The public machine builder uses:

```text
scripts/lib/reviewed-bundle-aggregation.mjs
scripts/lib/entity-corrections.mjs
```

The recovery validator was changed to reuse those exact modules instead of maintaining a competing count implementation.

Final recovered reviewed counts:

```text
Entities:  550
Events:    1004
Evidence: 2621
```

Recovery diagnostics additionally recorded:

```text
Base entities:      306
Base events:        513
Base evidence:      1172
Reviewed bundles:   406
New entity bundles: 244
Correction bundles: 151
```

This is the central recovery correction produced by G-6.

## 5. Validator scope

The final validator checks:

```text
authoritative path existence
reviewed count recovery using public build aggregation semantics
roadmap current phase/item/next visibility
runbook required concepts
recovery-sequence anchors
required package commands
deployment policy and Cloudflare project policy agreement
latest production PASS reference
verified production commit reference
AGENTS authority-chain references
dynamic-state rules for SHA, PRs, and production state
```

Finding categories:

```text
missing_authoritative_path
stale_checkpoint
recovery_state_mismatch
runbook_incomplete
command_reference_incomplete
deployment_authority_incomplete
production_state_incomplete
authority_chain_incomplete
```

## 6. Black-box self-test

Command:

```text
npm run recovery:test
```

The self-test copies the authoritative repository inputs into a temporary recovery fixture and runs the real validator against that copy.

It verifies detection of:

```text
reviewed_count_mismatch
current_item_missing
package_script_missing
```

Final result:

```text
PASS
```

## 7. Repository-only recovery validation

Command:

```text
npm run recovery:validate
```

Final output:

```text
Authoritative/canonical paths: 14
Required commands:              6
Recovery steps:                11

Current phase:
  Phase G — v1.0 Integration Baseline

Current item:
  G-6 Maintainer Runbook and Recovery Validation

Next item:
  G-7 v1.0 Baseline Checkpoint

Reviewed counts:
  entities:  550
  events:    1004
  evidence: 2621
```

Category findings:

```text
missing_authoritative_path:      0
stale_checkpoint:                0
recovery_state_mismatch:         0
runbook_incomplete:              0
command_reference_incomplete:    0
deployment_authority_incomplete: 0
production_state_incomplete:     0
authority_chain_incomplete:      0
```

Final result:

```text
PASS
```

## 8. Dedicated workflow

Workflow:

```text
.github/workflows/maintainer-recovery-gate.yml
```

The gate runs:

```text
npm ci
npm run recovery:test
npm run recovery:validate
```

It always uploads diagnostic logs:

```text
maintainer-recovery-self-test.log
maintainer-recovery-validation.log
```

Artifact:

```text
maintainer-recovery-validation-report
```

## 9. Clean-room recovery exercise result

The final G-6 exercise recovered, from repository/current GitHub authority:

```text
repository: badjoke-lab/historical-exchange-index
default branch: main
reviewed counts: 550 / 1004 / 2621
current phase: Phase G — v1.0 Integration Baseline
current item: G-6 Maintainer Runbook and Recovery Validation
next item: G-7 v1.0 Baseline Checkpoint
deployment policy: production branch main, production deploys enabled, previews disabled
production state source: G-5 dated verification report
production verification result: PASS
recovery command references: complete
recovery sequence: 11 steps
```

Result:

```text
PASS
```

## 10. Completion gate

```text
repository-only recovery:             PASS
black-box self-test:                  PASS
stale checkpoint findings:            0
missing authoritative paths:          0
required command references:          complete
deployment authority findings:        0
production-state findings:            0
contradictory authority findings:     0
clean-room recovery exercise:         PASS
```

G-6 is complete when the PR containing this report passes its final workflow set and merges to `main`.

Next roadmap item after merge:

```text
G-7 v1.0 Baseline Checkpoint
```
