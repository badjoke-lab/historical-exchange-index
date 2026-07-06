# DESIGN.md — Historical Exchange Index

Historical Exchange Index (HEI) should feel like a quiet historical registry.

This file is the visual direction source of truth. Product behavior and route scope are defined in `docs/HEI_PRODUCT_SURFACES_SPEC.md`, while execution order is defined in `docs/HEI_V1_EXECUTION_ROADMAP.md`.

## Core direction

- Vercel-led visual structure
- Notion-like readability on detail and longform pages
- Stripe only as a minor future reference for stats polish
- not a clone of any one reference
- not a marketing site
- not a trading terminal

## Product mood

HEI should feel:

- archival
- restrained
- data-dense
- sober
- credible
- calm
- slightly severe
- historically minded

Working phrase:

- quiet registry

## Surface hierarchy

The visual system must support four connected public layers:

```text
Registry
  browse and inspect individual records

Analysis
  understand distributions, quality, and coverage

Research
  filter and search across reviewed entities and events

Change
  follow reviewed registry updates and historical change surfaces
```

These layers should feel like one registry system rather than separate microsites.

## Explorer direction

Explorer must look like a research utility inside HEI.

Prefer:

- dense, readable result lists and tables where appropriate
- restrained filter controls
- explicit result counts
- compact metadata
- stable labels
- visible active-filter state
- direct links into exchange dossiers and evidence context
- strong keyboard and mobile usability

Avoid:

- exchange-logo walls as the primary information structure
- trading-terminal chrome
- red/green market semantics
- score gauges
- animated market counters
- decorative dashboard widgets without research value
- synthetic risk-score presentation

## Stats and Explorer relationship

Stats shows aggregate patterns. Explorer shows the exact records behind those patterns.

Visual links between them should be direct and understated:

```text
Stats observation
  -> Explore matching records
```

The link should feel like a drilldown into the registry, not a marketing call to action.

## Change-layer direction

Registry Updates, Incident Timeline, quality summaries, monthly snapshots, and feeds must preserve the same restrained archival tone.

Change surfaces should emphasize:

- reviewed facts
- chronology
- provenance
- clear update dates
- links back to canonical record context

They must not resemble a breaking-news homepage or engagement feed.
