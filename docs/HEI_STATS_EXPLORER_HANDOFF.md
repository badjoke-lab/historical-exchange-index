# HEI Stats to Explorer Handoff

Status: E-5 semantic handoff  
Project: Historical Exchange Index (HEI)  
Checkpoint: 2026-07-06

## 1. Purpose

This document maps HEI Stats dimensions to the future Explorer research surface.

E-5 does **not** finalize the Explorer URL/query contract and does not add live deep links. Its role is to make the Stats-to-Explorer relationship explicit before E5-1 fixes the Explorer implementation specification and backward-compatible query semantics.

Machine-readable source:

```text
config/stats-explorer-deep-link-map.json
```

Product behavior source:

```text
docs/HEI_PRODUCT_SURFACES_SPEC.md
```

## 2. Boundary between E-5 and E5-1

E-5 decides:

- which Stats dimensions correspond to Entity Explorer;
- which correspond to Event Explorer;
- which canonical or deterministic field supplies values;
- which dimensions are direct candidates;
- which require compound/range semantics;
- which are derived aggregates and should not become filters automatically;
- which evidence-wide dimensions remain deferred.

E5-1 must decide:

- final URL parameter serialization;
- whether repeated parameters, comma-separated values, or another deterministic representation is used for multi-value filters;
- exact date-boundary encoding for year histogram links;
- default sort behavior;
- malformed query fallback behavior;
- canonical/robots behavior for query URLs;
- compatibility rules after Explorer v1 release.

Until E5-1 is merged:

```text
url_contract_finalized = false
stats_links_enabled = false
```

## 3. Direct Entity Explorer mappings

### Status

Stats sources:

```text
snapshot.by_status
snapshot.active_analysis.status_breakdown
snapshot.dead_analysis.status_breakdown
```

Explorer semantic:

```text
view = entities
filter = status
value source = entity.status
```

Stats keys already use canonical status enum values.

### Type

Stats sources:

```text
snapshot.by_type
snapshot.active_analysis.type_breakdown
```

Explorer semantic:

```text
view = entities
filter = type
value source = entity.type
```

Values are canonical `cex`, `dex`, and `hybrid`; display labels may be CEX/DEX/Hybrid.

### Death reason

Stats sources:

```text
snapshot.dead_reason
snapshot.dead_analysis.death_reason_breakdown
```

Explorer semantic:

```text
view = entities
filter = death_reason
value source = entity.death_reason
```

Display labels must never replace canonical query values such as `regulation`, `voluntary_shutdown`, or `chain_failure`.

### Official URL status

Stats sources:

```text
snapshot.active_analysis.url_status_breakdown
snapshot.coverage.url_status_breakdown
```

Explorer semantic:

```text
view = entities
filter = official_url_status
value source = entity.official_url_status
```

### Entity confidence

Stats sources:

```text
snapshot.active_analysis.confidence_breakdown
snapshot.quality.confidence_breakdown
```

Explorer semantic:

```text
view = entities
filter = confidence
value source = entity.confidence
```

### Strict country/origin values

Stats source:

```text
snapshot.country_origin.strict_countries
```

Explorer semantic:

```text
view = entities
filter = country_or_origin
value source = entity.country_or_origin
```

Only exact reviewed field values are direct mappings. Derived origin buckets are not interchangeable with exact canonical values.

## 4. Direct Event Explorer mappings

### Event type

Stats source:

```text
snapshot.events.event_type_breakdown
```

Explorer semantic:

```text
view = events
filter = event_type
value source = event.event_type
```

### Impact level

Stats source:

```text
snapshot.events.impact_level_breakdown
```

Explorer semantic:

```text
view = events
filter = impact_level
value source = event.impact_level
```

### Event status effect

Stats source:

```text
snapshot.events.status_effect_breakdown
```

Explorer semantic:

```text
view = events
filter = event_status_effect
value source = event.event_status_effect
```

## 5. Range candidates

### Launch year

Stats sources:

```text
snapshot.active_analysis.launch_year_histogram
history.launch_year_counts
```

Candidate Explorer semantics:

```text
launch_from
launch_to
```

A Stats bar representing one year can eventually map to a deterministic date interval, but E5-1 must fix exact boundary serialization.

### Death year

Stats sources:

```text
snapshot.dead_analysis.death_year_histogram
history.death_year_counts
```

Candidate Explorer semantics:

```text
death_from
death_to
```

Again, E5-1 fixes exact boundary serialization.

## 6. Compound candidates

These Stats views combine more than one semantic condition.

### Archive coverage

```text
snapshot.coverage.archive
```

Overall coverage can correspond to:

```text
archive_available = true
```

Active-side and dead-side rows also require group status semantics. E5-1 must decide whether those links use repeated status filters, a documented group preset, or another deterministic representation.

### Origin × status

```text
snapshot.country_origin.status_rows
```

Candidate filters:

```text
country_or_origin
status
```

### Origin × type

```text
snapshot.country_origin.type_rows
```

Candidate filters:

```text
country_or_origin
type
```

## 7. Derived dimensions that must not become accidental filters

The following Stats dimensions are useful analysis but are not direct Explorer v1 filters merely because they are visible in Stats:

```text
active age bands
evidence depth buckets
last-verified recency bands
missing-field rates
field-presence / completeness metrics
event averages
snapshot growth
average lifespan
dead-side aggregate archive percentage
```

Reasons include:

- value depends on current time;
- value is derived from counts rather than a canonical field;
- no Explorer v1 filter exists for the concept;
- aggregate values do not correspond to a stable record subset without additional contract work.

E5-1 may add a deterministic filter only through an explicit specification change. E-5 does not authorize hidden derived filtering.

## 8. Origin bucket warning

`country_origin.origin_buckets` contains derived groupings such as global/ecosystem/region-level/unknown categories.

These labels are not necessarily literal `country_or_origin` field values.

Therefore:

```text
snapshot.country_origin.origin_buckets
mapping_kind = derived_non_filter
```

This avoids creating misleading links that display one grouped label but query a different canonical value set.

## 9. Evidence dimensions are deferred

Stats includes evidence-wide dimensions:

```text
source_type_breakdown
reliability_breakdown
claim_scope_breakdown
evidence averages
```

Explorer v1 explicitly excludes a standalone Evidence Explorer. These Stats sections therefore remain:

```text
destination_view = deferred_evidence
mapping_kind = deferred
```

Evidence remains available through exchange and event context until a separate reviewed product decision adds evidence-wide exploration.

## 10. Query-key handoff set

E-5 may reference only query keys already anticipated by the product specification.

Entity candidate keys:

```text
q
type
status
death_reason
launch_from
launch_to
death_from
death_to
official_url_status
archive_available
confidence
country_or_origin
sort
```

Event candidate keys:

```text
q
event_type
date_from
date_to
impact_level
event_status_effect
confidence
entity_type
entity_status
sort
```

The mapping file uses only the subset needed by current Stats dimensions.

## 11. E5-1 handoff requirements

E5-1 can begin only after the following are true:

```text
Stats dimensions mapped
future query keys identified
canonical value sources identified
direct vs compound vs range mappings separated
derived/non-filter dimensions explicit
Evidence Explorer dimensions explicitly deferred
mapping validator passing
```

E5-1 must then transform this semantic map into a final tested Explorer query contract before any Stats deep link is enabled.
