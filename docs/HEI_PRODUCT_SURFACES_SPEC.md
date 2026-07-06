# HEI Product Surfaces Specification

Status: fixed product specification  
Project: Historical Exchange Index (HEI)  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-07-06  
Scope: public registry, analysis, research, and change-tracking surfaces after the current Phase D work

## 1. Authority and purpose

This document is the product-surface source of truth for HEI after the initial registry, Stats, monitoring, and machine-readable layers are in place.

It defines how HEI should expose the value of its reviewed `entity / event / evidence` data without turning the project into a trading dashboard, news site, risk-scoring product, or free-form AI answer engine.

Implementation work must follow both:

1. `docs/HEI_V1_EXECUTION_ROADMAP.md` for execution order and current phase;
2. this file for product-surface behavior and non-goals.

Repository state remains authoritative for actual merged implementation status.

## 2. Product model

HEI public output is organized into four layers.

```text
Registry layer
  individual records and primary browsing

Analysis layer
  aggregate distributions, quality, and coverage

Research layer
  deterministic cross-record exploration

Change layer
  reviewed registry updates and historical change surfaces
```

The layers must reinforce each other rather than become isolated features.

### 2.1 Registry layer

Primary routes include:

```text
/
/dead/
/active/
/exchange/[slug]/
```

Purpose:

- browse reviewed exchange records;
- inspect individual exchange identity and status;
- read lifecycle timelines;
- inspect supporting evidence;
- preserve historical URLs and archive access.

### 2.2 Analysis layer

Primary route:

```text
/stats/
```

Purpose:

- show registry scale and composition;
- show status and type distributions;
- show active-side and dead-side analysis;
- show archive, confidence, completeness, origin, evidence-depth, and freshness metrics;
- show historical distributions and snapshot growth where enough history exists.

Stats answers:

> What is common, rare, changing, complete, or missing across the registry?

### 2.3 Research layer

Primary route:

```text
/explore/
```

Initial modes:

```text
Entity Explorer
Event Explorer
```

Purpose:

- find the reviewed records matching explicit conditions;
- search across entities and events;
- preserve filter state in shareable URLs;
- connect aggregate Stats observations to the exact records behind them;
- provide deterministic results from reviewed data.

Explorer answers:

> Which exact records match this condition?

### 2.4 Change layer

Primary surfaces include:

```text
/updates/
Exchange Incident Timeline
Evidence Health and Data Quality summary
Monthly Historical Exchange Snapshot
RSS and JSON feeds for reviewed public updates
```

Purpose:

- show that HEI remains actively maintained;
- expose only reviewed changes and reviewed public summaries;
- show what changed in the registry without publishing raw monitoring output;
- preserve a historical interpretation rather than become a breaking-news feed.

Change surfaces answer:

> What was added, revised, confirmed, or historically recorded?

## 3. Current implementation baseline

At this specification checkpoint:

- Registry browsing and exchange detail pages exist;
- `/stats/` exists and already covers the main analysis categories;
- the machine-readable public layer exists;
- reviewed canonical datasets are publicly exposed under the project safety boundary;
- `/updates/` and its reviewed Registry Update data surface are implemented;
- the next execution item is the Exchange Incident Timeline.

The roadmap, not this section, controls the active work item if implementation status changes later.

## 4. Phase D — Change layer completion

The current Phase D order is retained.

```text
D-1 Registry Update surface                         complete
D-2 Exchange Incident Timeline                     next
D-3 Evidence Health and Data Quality summary       pending
D-4 Monthly Historical Exchange Snapshot           pending
D-5 RSS and JSON reviewed-update feeds             pending
D-6 Quality repair batches                         parallel continuous lane
```

### 4.1 Publication safety

Public Change-layer content must obey all of the following:

- merged canonical changes may be presented as official registry updates;
- raw monitoring findings remain internal;
- monitoring signals are not final classifications;
- unmerged candidates must not appear as reviewed registry facts;
- public incident items require reviewed canonical events or separately reviewed confirmed public items;
- publication drafts may be generated automatically, but publication remains review-gated.

### 4.2 HEI must not become a weekly news site

HEI is history-first.

The project may publish periodic reviewed update summaries, but it must not optimize for breaking-news volume or copy a general crypto-news workflow.

The preferred progression is:

```text
Registry Update
Monthly Snapshot
optional Discovery Log trial after v1.0
```

A recurring Weekly Exchange Watch is not part of the active roadmap.

## 5. Explorer v1

Explorer v1 is a formal product phase after the current Phase D and Phase E discovery-foundation work.

It must not interrupt the active Phase D sequence.

### 5.1 Core rule

Explorer is a deterministic query interface over reviewed public data.

It must not:

- invent classifications;
- infer unreviewed status changes;
- publish monitoring candidates;
- create AI-generated exchange claims;
- use hidden risk scoring;
- return results outside the reviewed public registry boundary.

### 5.2 Route model

The initial route is:

```text
/explore/
```

The active mode is represented in URL state.

Examples:

```text
/explore/?view=entities&type=cex&status=dead
/explore/?view=events&event_type=regulatory_action&from=2024-01-01
```

A future route split may be considered only if implementation evidence shows that a single route harms usability or maintainability.

### 5.3 Entity Explorer filters

Explorer v1 should support these reviewed-data filters where the underlying canonical field or deterministic derived value exists:

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

Filter semantics must be documented and tested.

Unknown values must remain filterable where useful. They must not be silently dropped.

### 5.4 Event Explorer filters

Explorer v1 should support:

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

Event Explorer results must retain clear links back to the parent exchange record and relevant evidence where available.

### 5.5 Search scope

`q` must use deterministic text matching over reviewed public fields.

The first implementation may cover fields such as:

- canonical name;
- aliases;
- slug;
- summary;
- event title;
- event summary or description;
- country or origin label.

The exact indexed field set must be written into implementation documentation before merge.

### 5.6 Sort contract

Entity sort options should be limited to stable, understandable fields such as:

```text
name_asc
name_desc
launch_oldest
launch_newest
death_oldest
death_newest
last_verified_newest
```

Event sort options should include:

```text
date_newest
date_oldest
entity_name_asc
```

Unsupported or malformed sort values must fall back to a documented default.

### 5.7 Shareable URL state

Every user-visible filter and sort state must round-trip through the URL.

Requirements:

- opening a copied URL restores the same state;
- removing a filter updates the URL;
- browser back and forward navigation restore prior state;
- URL serialization is stable and deterministic;
- empty/default parameters should be omitted where practical;
- parameter naming must remain backward-compatible after v1 release unless a migration or redirect plan exists.

### 5.8 Stats to Explorer deep links

Stats and Explorer must be connected.

Examples:

```text
Stats: death reason = regulation
  -> /explore/?view=entities&death_reason=regulation

Stats: event type = hack
  -> /explore/?view=events&event_type=hack

Stats: type = dex
  -> /explore/?view=entities&type=dex
```

The purpose is to let a user move from aggregate observation to exact records.

### 5.9 Change surfaces to Explorer deep links

Where useful, Update and Timeline surfaces should link to Explorer state.

Examples:

- an update summary may link to all entities added in a reviewed period if the query contract supports it safely;
- an incident summary may link to all events of the same type in a date range;
- a monthly snapshot may link to the underlying event subset.

These links must use reviewed public data only.

### 5.10 Evidence Explorer is not in v1

Explorer v1 includes:

```text
Entity Explorer
Event Explorer
```

A standalone Evidence Explorer is deferred.

Evidence remains visible through exchange detail and event context until a concrete research use case justifies a dedicated evidence-wide search surface.

### 5.11 SEO and crawl control

Explorer must not create an uncontrolled indexed URL explosion.

Default policy:

- `/explore/` may be indexable;
- arbitrary filtered query combinations should not be treated as separate canonical SEO landing pages;
- canonical metadata should remain stable;
- sitemap expansion must be deliberate, not generated from every possible filter combination;
- shareable research URLs and SEO landing pages are separate concerns.

Exact `robots` and canonical implementation must be decided during the Explorer specification PR before public rollout.

### 5.12 Accessibility and responsive behavior

Explorer must preserve the HEI quiet-registry direction.

Requirements:

- keyboard-accessible filter controls;
- visible focus states;
- labeled controls;
- understandable empty states;
- clear active-filter summary;
- no color-only meaning;
- mobile filter controls must not hide the active query state;
- dense result presentation is allowed, but touch targets and text must remain usable.

### 5.13 Visual direction

Explorer must feel like a research utility inside HEI, not a trading terminal.

Avoid:

- exchange-logo walls as the primary information structure;
- score gauges;
- red/green trading semantics;
- animated market-style counters;
- dashboard decoration without research value.

Prefer:

- dense lists and tables where appropriate;
- restrained filter panels;
- explicit result counts;
- stable labels;
- compact metadata;
- direct links to record dossiers and evidence context.

## 6. Explorer implementation split

Explorer work should be split into reviewable PRs.

Recommended order:

```text
E5-1 Explorer implementation specification and query contract
E5-2 Entity Explorer
E5-3 Event Explorer
E5-4 Stats -> Explorer deep links
E5-5 Timeline / Updates -> Explorer cross-links
E5-6 Explorer accessibility, URL-state, and regression audit
```

The exact PR count may change, but the dependency order should be preserved.

## 7. Compare v1

Compare is a post-v1.0 candidate.

It must not precede Explorer v1.

Possible comparison fields include:

```text
type
launch date
terminal date
status
death reason
lifespan
major events
evidence count
archive status
country or origin
confidence
```

Compare should use reviewed fields and deterministic derived values only.

It must not introduce a synthetic risk score.

## 8. Natural Language Filter Translator

Natural-language filtering is optional and conditional.

It is not part of HEI v1.0.

If introduced later, its job is only to translate a natural-language request into validated Explorer parameters.

Example:

```text
User request:
  exchanges that died because of regulation after 2020

Translator output:
  view=entities
  status=dead
  death_reason=regulation
  death_from=2020

Result authority:
  deterministic Explorer query over reviewed HEI data
```

The translator must not freely decide that an exchange failed for a reason not present in reviewed data.

A free-form `Ask HEI` answer engine is not part of the active roadmap.

## 9. API position

A new API phase is not required before Explorer.

Priority order:

```text
stable canonical JSON
stable schema behavior
stable URL contracts
version and manifest integrity
reviewed update feeds
Explorer query contract
conditional API expansion only when a real consumer need is demonstrated
```

The existing machine-readable public layer remains the public machine-use foundation.

Potential future endpoints such as `/api/exchanges`, `/api/events`, or `/api/search` remain conditional and must not be created only for appearance.

## 10. Explicit non-goals

The following are not part of the active HEI roadmap:

- exchange risk scores;
- AI-generated exchange truth labels;
- AI Summary vs Human Summary presentation;
- free-form Ask HEI chat;
- automated publication of raw monitoring findings;
- general crypto breaking-news coverage;
- a startup-style engagement dashboard;
- rankings that imply exchange quality or investment safety.

## 11. Public Comments

Public Comments are moved to indefinite backlog.

Reasons include:

- moderation cost;
- spam handling;
- source-quality disputes;
- defamation and accusation risk;
- community-management burden;
- weak direct contribution to core registry value.

Comments must not displace:

```text
Phase D completion
Phase E discovery foundation
Explorer v1
multilingual layer
v1.0 integration
post-v1.0 Compare evaluation
```

## 12. Post-v1.0 optional sequence

Recommended evaluation order after v1.0:

```text
H. Compare v1
I. Discovery Log trial
J. Natural Language Filter Translator only if Explorer usage justifies it
K. API expansion only if consumer demand justifies it
```

Public Comments remain indefinite backlog.

## 13. Localization interaction

The English-root and Japanese `/ja/` architecture remains a separate phase.

Explorer implementation must avoid hard-coding user-facing labels into filter semantics.

Requirements:

- query parameter keys and enum values remain locale-independent;
- UI labels may be localized;
- canonical data remains single-source;
- translation overlays must not create divergent factual records;
- shared Explorer URLs must remain semantically stable across locales where practical.

## 14. Change control

Any change to the following requires this specification and the roadmap to be reviewed together:

- Explorer route model;
- query parameter names;
- filter semantics;
- indexed search fields;
- public Change-layer safety rules;
- Compare moving before v1.0;
- Natural Language Filter Translator entering the active schedule;
- API expansion entering the active schedule;
- Public Comments returning to active planning.

Implementation PRs must cite the relevant section of this document in their PR body and update the roadmap checkpoint when phase status changes.
