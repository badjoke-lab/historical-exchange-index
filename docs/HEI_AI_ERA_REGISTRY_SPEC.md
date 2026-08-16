# HEI AI-era Registry Specification

Status: **implemented finite pass / mandatory reference for future product work**

## Purpose
HEI must remain useful when generic AI can summarize well-known exchange histories. HEI therefore optimizes for verifiable historical records, provenance, structured retrieval, comparison, and lifecycle follow-up rather than prose volume.

## Required product direction
1. Preserve the canonical entity -> event -> evidence model and reviewed-only publication boundary.
2. Follow incidents beyond the initial headline: shutdown, insolvency, bankruptcy, claims, recoveries, distributions, acquisitions, relaunches, successors, and final state when evidence exists.
3. Make provenance prominent: evidence type, claim scope, confidence, archive links, last verification, and unresolved uncertainty.
4. Provide record-level machine-readable output bundling one entity with its reviewed events, evidence references, relationships, and verification metadata. Do not create a separate AI-only source of truth.
5. Strengthen structured Explorer filters before considering natural-language search. Natural-language search, if added, must compile into deterministic structured filters and must not invent results.
6. Maintain and extend Compare using canonical fields and evidence-backed derived values.
7. Implement Stats as registry analysis and coverage/quality reporting, not a market ranking dashboard.
8. Keep correction/review workflows human-accountable. Automated discovery may stage candidates but must not directly mutate canonical records.

## Implemented finite-pass state

The 2026-08-15 through 2026-08-16 finite pass implements this direction through:

- reviewed record-level entity/event/evidence JSON and discovery metadata;
- deterministic Explorer verification/evidence provenance filters;
- deterministic Compare provenance and verification fields;
- deterministic machine-readable Stats snapshot/history outputs;
- existing dossier-level evidence type, reliability, claim scope, archive, confidence/revision-state visibility;
- bounded lifecycle audit plus current-date follow-up, with future/ambiguous checkpoints retained for reviewed monitoring rather than fabricated completion;
- a completed natural-language evaluation whose current decision is DEFER.

Completion authority:

`docs/audits/HEI_AI_ERA_FINITE_PASS_CLOSEOUT_2026-08-16.md`

The finite pass does not end ongoing reviewed operations, monitoring, data growth, corrections, localization evidence collection, or future lifecycle work.

## Non-goals
AI summary buttons, prompt libraries, public chat, and LLM-generated canonical facts are not priority work. API infrastructure is not required where static deterministic JSON is sufficient.

## Completion gate
This specification is satisfied only when record-level structured output, strengthened discovery/filtering, Compare, Stats, provenance visibility, and lifecycle follow-up are represented in production or explicitly tracked by the execution roadmap.

The finite 2026-08 AI-era implementation pass is considered complete only after the closeout record documents the exact Stage F production verification authority and is merged through normal CI.

## Mandatory reference rule
All future HEI feature, data-growth, monitoring, Explorer, Compare, Stats, machine-readable, provenance, lifecycle, and AI-assisted retrieval work must check this document together with the current authoritative HEI roadmap and `HEI_AI_ERA_EXECUTION_SCHEDULE.md`. Existing stricter safety or evidence rules take precedence.
