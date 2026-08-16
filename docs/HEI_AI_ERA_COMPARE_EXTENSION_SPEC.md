# HEI AI-era Compare Extension Specification

Status: implementation specification  
Stage: AI-era Stage E  
Route: `/compare/`

Authority:

- `docs/HEI_V1_EXECUTION_ROADMAP.md`
- `docs/HEI_AI_ERA_REGISTRY_SPEC.md`
- `docs/HEI_AI_ERA_EXECUTION_SCHEDULE.md`
- `docs/HEI_COMPARE_V1_SPEC.md`
- `config/compare-v1-contract.json`

## 1. Purpose

Stage E extends the already-complete Compare v1 surface with deterministic provenance and verification fields. It does not change selection semantics, comparison limits, query encoding, crawl policy, or reviewed-only boundaries.

Existing comparison URLs must remain valid and serialize exactly as before.

## 2. Additive fields

The lifecycle section adds:

```text
last_verified_at
```

The new provenance section adds deterministic reviewed-data counts:

```text
high_reliability_evidence_count
archived_evidence_count
event_linked_evidence_count
evidence_source_type_count
latest_evidence_accessed_at
```

Definitions:

- `high_reliability_evidence_count`: count of reviewed evidence items with `reliability = high` for the entity;
- `archived_evidence_count`: count of reviewed evidence items with a non-empty `archived_url`;
- `event_linked_evidence_count`: count of reviewed evidence items with a non-empty `event_id`;
- `evidence_source_type_count`: count of distinct reviewed canonical `source_type` values represented for the entity;
- `latest_evidence_accessed_at`: maximum valid reviewed `accessed_at` date for the entity, otherwise null.

These values are deterministic projections. They are not persisted as new canonical facts.

## 3. UI

The comparison matrix must show:

- Last verified;
- Reviewed evidence;
- High-reliability evidence;
- Archived evidence;
- Event-linked evidence;
- Evidence source types;
- Latest evidence access.

Missing dates remain explicit rather than inferred.

## 4. Safety and non-goals

Stage E must not introduce:

- risk, safety, quality, or investment scores;
- rankings;
- live market data;
- generated factual claims;
- unreviewed candidate comparison;
- AI-selected major events;
- changes to the 2–4 reviewed exchange selection contract.

The existing deterministic major-event selection remains unchanged.

## 5. Compatibility

The route stays `/compare/` and the only selection key remains repeated `exchange=<reviewed-slug>` values. Existing links need no migration.

Stage E changes only the field set displayed after reviewed entities are resolved.

## 6. Completion gate

Stage E is complete only after:

- the extended contract passes its self-test;
- provenance values are derived from reviewed evidence aggregation;
- comparison UI exposes the required rows;
- existing selection/share/crawl behavior remains unchanged;
- Compare audit passes with zero findings;
- full repository CI passes;
- deployed production output is verified before the execution schedule advances to Stage F.
