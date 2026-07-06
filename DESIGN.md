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

## Layout rules

### Registry pages
- compact tool-like header
- summary strip
- controls
- dense table/list
- footer note

### Detail pages
- dossier-style layout
- identity and status first
- fact block
- URL block
- timeline
- evidence
- correction/disclaimer

### Longform pages
- readable stack
- moderate width
- plainspoken, research-like tone

### Explorer pages
- research-utility layout
- visible active query state
- restrained filter controls
- explicit result count
- dense result list or table
- direct links into exchange dossiers and event context
- mobile controls that preserve query visibility

## Visual rules

- desktop-first
- tables preferred over oversized cards
- compact clarity over decorative whitespace
- borders matter
- low-contrast surface separation
- restrained depth
- no glossy SaaS hero treatment
- no crypto-neon styling
- no trading-terminal chrome
- no animated market counters
- no synthetic risk-score gauges

## Color roles

- base background: deep charcoal / near-black
- primary accent: muted bronze / aged gold
- archive accent: soft archival blue
- dead accent: muted red-brown
- active accent: subdued green
- limited accent: dusty amber
- inactive accent: blue-gray
- unknown accent: gray-violet

## Header

Must include:

- HEI wordmark/title
- primary nav
- one utility-emphasis action

It should feel like a tool header, not a launch header.

## Registry tables

- dense and legible
- modest row height
- subtle separators
- name column strongest
- archive access clearly scannable
- mobile should collapse rows compactly, not explode into giant cards

## Detail pages

- should read like compact dossiers
- original URL and archived URL must be visually separated
- archived URL should feel like the safer historical action for dead-side entries
- timeline should be factual and chronological
- evidence should feel citation-like, not social

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

## Final sentence

HEI should feel like a modern archival ledger for crypto exchange history:
clean, restrained, data-dense, quietly authoritative, and visibly aware of uncertainty.
