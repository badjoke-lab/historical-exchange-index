# HEI AI-era Execution Schedule

Status: roadmap addendum

This schedule does not replace active HEI work. It inserts AI-era resilience work into the existing roadmap without stopping record growth or monitoring.

## Work order
### A. Preserve ongoing operations
Status: ONGOING

Continue reviewed record growth, evidence maintenance, monitoring, localization, and current approved roadmap work.

### B. Provenance and lifecycle audit
Status: COMPLETE / BOUNDED AUDIT

Audit representative active/dead records for missing post-event follow-up, last-verified metadata, archive/evidence visibility, claims/recovery/distribution events, and successor relationships. Produce a bounded backlog; do not mass-change canonical data automatically.

Completion authority:

`docs/audits/HEI_AI_ERA_PROVENANCE_LIFECYCLE_AUDIT_2026-08-15.md`

The resulting lifecycle backlog remains ordinary reviewed Lane A / Stage G work; Stage B completion does not mean every follow-up item is already resolved.

### C. Record-level machine-readable surface
Status: NEXT AI-ERA IMPLEMENTATION STAGE

Define and ship deterministic per-record JSON derived from canonical entity/event/evidence data. Validate parity with the human page and existing manifest/version rules.

### D. Explorer/Search strengthening
Add useful deterministic filters supported by canonical data, including time, origin, event/status/death dimensions and evidence/verification dimensions where safe. Preserve URL/query contracts.

### E. Compare completion/extension
Use the existing Compare specification as authority; add only evidence-backed historical/lifecycle fields and keep missing values explicit.

### F. Stats completion
Use the existing Stats specification/hand-off as authority. Emphasize snapshot, trend, coverage and data quality; no price/TVL/ranking drift.

### G. Lifecycle follow-up pass
Prioritize important records where the historical story currently stops at the headline event. Add reviewed follow-up events/evidence through claims, recovery, distribution, successor or final state when supported.

### H. Natural-language evaluation only after B-G
Evaluate natural-language-to-structured-filter translation only after deterministic search is strong. No free-form AI answer is canonical.

## Gate for every stage
Spec/update -> implementation PR -> CI green -> merge -> production/read-only verification where applicable -> roadmap/status synchronization. A later stage must not be declared complete from code alone.

## Mandatory continuation rule
Every future HEI work thread must read the current authoritative roadmap plus `HEI_AI_ERA_REGISTRY_SPEC.md` and this schedule before choosing the next task.