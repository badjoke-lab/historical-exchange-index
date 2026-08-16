# HEI AI-era Stats Completion Specification

Status: implementation specification  
Stage: AI-era Stage F  
Human route: `/stats/`

Authority:

- `docs/HEI_V1_EXECUTION_ROADMAP.md`
- `docs/HEI_AI_ERA_REGISTRY_SPEC.md`
- `docs/HEI_AI_ERA_EXECUTION_SCHEDULE.md`
- existing HEI Stats implementation and Explorer handoff contracts

## 1. Purpose

HEI already exposes a reviewed public `/stats/` analysis surface built from canonical entity, event, and evidence data. Stage F closes the remaining machine-readable gap by publishing deterministic static statistics outputs that correspond to the same reviewed aggregation model.

Stage F does not turn HEI into a market dashboard. It reports registry composition, lifecycle history, evidence coverage, quality, completeness, and historical counts only.

## 2. Public machine-readable outputs

Required endpoints:

```text
/stats.json
/stats-history.json
```

`/stats.json` is the current deterministic registry snapshot.

Minimum top-level sections:

```text
generated_at
totals
by_status
by_type
active_analysis
dead_analysis
country_origin
quality
coverage
completeness
events
evidence
```

`/stats-history.json` is the deterministic trend/history input.

Minimum top-level sections:

```text
generated_at
snapshots
launch_year_counts
death_year_counts
```

The history file may begin with one current reviewed snapshot. It must not invent prior snapshot values that were not captured under the same contract.

## 3. Source of truth

Both outputs are projections from reviewed public aggregation:

```text
entity -> event -> evidence
```

Reviewed record-bundle corrections and additions use the same aggregation semantics as the rest of the public site.

Stats-only aggregate fields must not be written back into canonical entity, event, or evidence records.

## 4. Discovery

The normal build must expose the endpoints through both `/version.json` and `/data/manifest.json`:

```text
stats.snapshot = /stats.json
stats.history = /stats-history.json
stats.canonical_only = true
stats.source = reviewed_entity_event_evidence_aggregation
```

`llms.txt` and `ai.txt` must also advertise the endpoints.

## 5. Validation

Repository validation must independently verify:

- snapshot entity/event/evidence totals match reviewed aggregation;
- active-side and dead-side totals match reviewed status semantics;
- status/type/event/evidence breakdowns reconcile to their denominators;
- history contains at least one reviewed snapshot;
- latest history snapshot matches current reviewed totals;
- launch/death year series reconcile to entities with known dates;
- discovery metadata is present and consistent;
- internal monitoring, staging and candidate markers are absent.

## 6. Production verification

The existing machine-readable production workflow must verify the exact merged `main` commit and fetch both Stats endpoints over HTTP. Production completion requires count parity with `/version.json` and safe output.

## 7. Non-goals

Stage F does not add:

- live price, volume, TVL or order-book metrics;
- exchange rankings;
- risk or safety scores;
- investment recommendations;
- fabricated historical snapshots;
- unreviewed monitoring statistics;
- arbitrary AI-generated analysis.

## 8. Completion gate

Stage F is complete only after:

- static Stats endpoints build successfully;
- repository validator passes;
- full CI passes;
- machine-readable discovery exposes both endpoints;
- exact-commit production verification passes;
- execution schedule is synchronized before Stage G is declared current.
