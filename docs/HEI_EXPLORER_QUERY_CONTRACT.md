# HEI Explorer v1 Query Contract

Status: fixed implementation contract  
Phase: E5-1  
Route: `/explore/`  
Checkpoint: 2026-07-06

Machine-readable source of truth:

```text
config/explorer-query-contract.json
```

Reference parser/serializer:

```text
scripts/lib/explorer-query-contract.mjs
```

This document explains the behavioral contract that E5-2 Entity Explorer, E5-3 Event Explorer, Stats deep links, and Change-layer cross-links must follow.

## 1. Scope

Explorer v1 has two views on one route:

```text
/explore/?view=entities
/explore/?view=events
```

The route does not expose unreviewed monitoring output, staging candidates, or private research notes.

Explorer v1 includes:

```text
Entity Explorer
Event Explorer
shareable query state
stable deterministic serialization
reviewed public data only
```

Explorer v1 excludes:

```text
Evidence Explorer
risk scores
free-form Ask HEI
AI-generated classifications
Natural Language Filter Translator
Compare view
```

## 2. View behavior

Query key:

```text
view
```

Allowed values:

```text
entities
events
```

Default when absent or invalid:

```text
entities
```

Canonical serialization always writes `view`, including the default Entity view.

Examples:

```text
/explore/?view=entities
/explore/?view=events
```

## 3. Filter combination semantics

The contract uses two simple rules.

### Same key: OR

Repeated values of the same multi-value filter use OR semantics.

Example:

```text
?view=entities&type=cex&type=dex
```

means:

```text
type = cex OR type = dex
```

### Different keys: AND

Different filter keys use AND semantics.

Example:

```text
?view=entities&type=dex&status=dead
```

means:

```text
type = dex AND status = dead
```

Combined example:

```text
?view=entities&type=cex&type=dex&status=dead&status=inactive
```

means:

```text
(type = cex OR type = dex)
AND
(status = dead OR status = inactive)
```

Repeated values are deduplicated.

## 4. Single-value repetition

For single-value parameters, repeated occurrences use the first valid value.

Example:

```text
?view=entities&launch_from=invalid&launch_from=2020
```

normalizes to:

```text
?view=entities&launch_from=2020-01-01
```

This rule applies to single-value date, boolean, and enum parameters.

## 5. Invalid input behavior

Invalid input must fail safely and predictably.

```text
unknown parameter       ignore
invalid enum value      ignore that value
invalid boolean value   ignore that value
invalid date value      ignore that value
cross-view parameter    ignore
invalid view             fall back to entities
```

Valid inverted ranges are preserved.

Example:

```text
launch_from=2025
launch_to=2020
```

normalizes to:

```text
launch_from=2025-01-01
launch_to=2020-12-31
```

The filtering layer must return zero results for an inverted valid range. The parser must not silently swap user intent.

## 6. Search contract

Search parameter:

```text
q
```

Normalization sequence:

```text
Unicode NFKC
trim
collapse whitespace
truncate to 160 Unicode code points
lowercase only for matching
```

The serialized query preserves normalized display case; matching is case-insensitive.

### Entity search fields

```text
canonical_name
aliases
slug
summary
country_or_origin
```

### Event search fields

```text
title
description
parent.canonical_name
parent.aliases
parent.slug
parent.country_or_origin
```

Event search therefore requires reviewed parent exchange context.

## 7. Date semantics

Accepted input formats:

```text
YYYY
YYYY-MM-DD
```

Year shorthand expands to inclusive ISO boundaries.

From-bound example:

```text
launch_from=2020
→ 2020-01-01
```

To-bound example:

```text
launch_to=2020
→ 2020-12-31
```

Comparison is inclusive.

Records with null dates do not match an active date-range constraint on that field.

This enables deterministic Stats year-bar links later without making Stats responsible for date serialization rules.

## 8. Entity Explorer parameters

Entity view candidate set is fixed as:

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

### Multi-value Entity filters

```text
type
status
death_reason
official_url_status
confidence
country_or_origin
```

### Single-value Entity filters

```text
q
launch_from
launch_to
death_from
death_to
archive_available
sort
```

`country_or_origin` accepts reviewed canonical values case-insensitively and serializes the reviewed canonical spelling.

## 9. Event Explorer parameters

Event view candidate set is fixed as:

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

### Multi-value Event filters

```text
event_type
impact_level
event_status_effect
confidence
entity_type
entity_status
```

### Single-value Event filters

```text
q
date_from
date_to
sort
```

`entity_type` and `entity_status` are evaluated against reviewed parent entity data.

## 10. Sort contract

### Entity default

```text
name_asc
```

The default sort is omitted from serialized URLs.

Allowed Entity sort values:

```text
name_asc
name_desc
launch_oldest
launch_newest
death_oldest
death_newest
last_verified_newest
```

Null date behavior for launch/death sorts is `known first`; deterministic tie-breakers are defined in the machine-readable contract.

### Event default

```text
date_newest
```

Allowed Event sort values:

```text
date_newest
date_oldest
entity_name_asc
```

Event sort tie-breakers use reviewed event date, sort order where applicable, and stable record IDs.

## 11. Stable serialization

Canonical query order is:

```text
view
q
view filters in contract order
sort
```

Multi-value enum filters serialize in contract enum order.

Reviewed-value filters such as `country_or_origin` serialize in canonical lexical order.

Empty search text, invalid values, and default sort values are omitted.

Example input:

```text
?status=dead&type=dex&type=cex&view=entities&type=dex
```

canonicalizes to:

```text
?view=entities&type=cex&type=dex&status=dead
```

Stable serialization is required for shareability, tests, and later Stats/Change-layer links.

## 12. Crawl and canonical policy

Base route:

```text
/explore/
```

Policy:

```text
base route indexable: yes
query variants in sitemap: no
generated filter landing pages: no
canonical for query variants: /explore/
```

Explorer query URLs are research-state URLs, not automatically generated SEO landing pages.

A later explicit product phase may create selected static landing pages, but E5-1 does not authorize automatic indexable page generation for arbitrary filter combinations.

## 13. Compatibility rules

After Explorer v1 implementation begins:

```text
unknown future keys on old parser: ignored
parameter rename: specification change + migration plan required
enum value change: schema + query contract review required
serialization order change: compatibility review required
```

A working shared URL must not be casually broken by later UI refactors.

## 14. Stats handoff relationship

E-5 mapped 40 Stats paths into 23 semantic dimensions.

After E5-1:

```text
url_contract_finalized = true
stats_links_enabled = false
```

Stats links stay disabled until Entity and Event Explorer implementations exist and can resolve the target states.

Direct Entity mappings include:

```text
status
type
death_reason
official_url_status
confidence
country_or_origin
```

Direct Event mappings include:

```text
event_type
impact_level
event_status_effect
```

Range candidates use the fixed year-to-ISO date expansion defined here.

Compound candidates may use repeated same-key values under the fixed OR semantics.

Derived/non-filter metrics remain unlinked unless a later explicit contract adds a deterministic filter.

## 15. Validation requirements

E5-1 completion requires:

```text
machine-readable contract present
contract validator passing
Stats handoff compatibility passing
reference parser present
reference serializer present
round-trip tests passing
malformed input tests passing
multi-value order tests passing
date normalization tests passing
crawl policy fixed
E5-2 handoff ready
```

E5-2 and E5-3 may implement UI and filtering behavior only by following this contract or by changing it through an explicit reviewed specification PR.
