# HEI AI-era Execution Schedule

Status: **finite AI-era pass complete / mandatory roadmap addendum**

This schedule does not replace active HEI work. It inserts AI-era resilience work into the existing roadmap without stopping record growth or monitoring.

## Work order
### A. Preserve ongoing operations
Status: **ONGOING BY DESIGN**

Continue reviewed record growth, evidence maintenance, monitoring, localization, and current approved roadmap work.

This stage is not a finite completion gate. Ordinary operations continue after the AI-era implementation pass closes.

### B. Provenance and lifecycle audit
Status: **COMPLETE / BOUNDED AUDIT**

Completion authority:

`docs/audits/HEI_AI_ERA_PROVENANCE_LIFECYCLE_AUDIT_2026-08-15.md`

The resulting lifecycle backlog was handed to Stage G and normal reviewed Lane A work.

### C. Record-level machine-readable surface
Status: **COMPLETE / PRODUCTION VERIFIED**

Implementation:

- PR #764
- first merge commit: `7f09ed503857499ced92a88acecf8ba01fdefb9a`

Production verification:

- machine-readable production smoke run `31927708917`
- verified base machine-readable endpoints and record-level endpoints from the later Stage D main deployment, which contains the Stage C implementation.

The public layer exposes deterministic per-record reviewed bundles through `/data/exchanges/index.json` and `/data/exchanges/{slug}.json`, with discovery through version/manifest/AI text surfaces.

### D. Explorer/Search strengthening
Status: **COMPLETE / PRODUCTION VERIFIED**

Implementation:

- PR #765
- merge commit: `2a99751ca0bec3f4c934288ab5f4db912a5103ff`

Production verification:

- exact deployed Stage D commit verified by machine-readable production smoke run `31927708917`.

The deterministic Explorer now includes reviewed verification/provenance filters while preserving the existing route, old query URLs, crawl policy, reviewed-only boundary and locale-independent canonical query keys.

### E. Compare completion/extension
Status: **COMPLETE / PRODUCTION VERIFIED**

Implementation:

- PR #766
- merge commit: `39f4eb4a6b19f30a256fba643cf453c6f0097a6f`

Production verification:

- exact main CI run `31928161585` — PASS;
- exact-commit Compare production verification run `31928424433` — PASS.

Compare retains the existing reviewed 2–4 entity selection contract and adds deterministic provenance/verification fields without risk, safety or investment scoring.

### F. Stats completion
Status: **COMPLETE / PRODUCTION VERIFIED**

Implementation:

- PR #767
- merge commit: `ca28e4e7c05a79c781a32ddc0a3d3c5472b45b09`
- public deterministic endpoints: `/stats.json` and `/stats-history.json`

Verification:

- exact merged-main CI run `31928619171` — PASS;
- exact-commit machine-readable production smoke run `31928845519` — PASS;
- production job `95120550522` verified all three layers: base machine-readable endpoints, record-level endpoints, and Stats endpoints.

Stage F therefore closes the remaining finite AI-era production gate. Stats remains reviewed registry analysis/coverage/history, not a price/TVL/ranking dashboard.

### G. Lifecycle follow-up pass
Status: **COMPLETE FOR CURRENT-DATE PASS**

Completion authority:

`docs/audits/HEI_AI_ERA_LIFECYCLE_FOLLOWUP_PASS_2026-08-16.md`

Future-dated and genuinely unresolved items are not fabricated into completed events. They are retained in GitHub Issue #768 for normal reviewed follow-up.

### H. Natural-language evaluation only after B-G
Status: **COMPLETE / DECISION = DEFER**

Decision authority:

`docs/audits/HEI_AI_ERA_NATURAL_LANGUAGE_FILTER_EVALUATION_2026-08-16.md`

No public natural-language translator is added now. The deterministic Explorer and machine-readable registry already satisfy the primary retrieval path, while repository/analytics evidence does not justify a new probabilistic dependency. Re-opening requires evidence-backed demand and a strict structured-query compiler boundary.

## Gate for every finite stage

Spec/update -> implementation PR -> CI green -> merge -> production/read-only verification where applicable -> roadmap/status synchronization.

All finite stages B-H have passed their applicable completion gates for the 2026-08 AI-era pass.

## Closeout boundary

The finite AI-era pass is **COMPLETE** as of the Stage F exact production verification above. The closeout record is:

`docs/audits/HEI_AI_ERA_FINITE_PASS_CLOSEOUT_2026-08-16.md`

The following remain ongoing after finite closeout and must not be mislabeled as unfinished AI-era implementation:

- Stage A normal reviewed operations and monitoring;
- L-2 localization evidence collection while its real external metrics remain incomplete;
- future lifecycle checkpoints tracked in Issue #768.

## Mandatory continuation rule

Every future HEI work thread must read the current authoritative roadmap plus `HEI_AI_ERA_REGISTRY_SPEC.md` and this schedule before choosing the next task.
