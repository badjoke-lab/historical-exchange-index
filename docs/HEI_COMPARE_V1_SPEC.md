# HEI Compare v1 Specification

Status: active Compare source of truth  
Project: Historical Exchange Index (HEI)  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-07-07

## 1. Authority and scope

This document controls Phase H Compare v1 behavior, URL state, reviewed-data boundaries, comparison fields, deterministic derivation, accessibility, crawl behavior, and implementation order.

Execution order comes from:

```text
docs/HEI_V1_EXECUTION_ROADMAP.md
```

General public-surface behavior and non-goals come from:

```text
docs/HEI_PRODUCT_SURFACES_SPEC.md
```

Data-growth and localization gates remain controlled by:

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md
```

Compare must complete before the Japanese Pilot may launch. Data growth may continue in parallel.

## 2. Product purpose

Compare is a deterministic side-by-side research surface for reviewed HEI exchange records.

It answers:

> How do these specific reviewed exchange records differ across lifecycle, status, origin, URL/archive state, event history, and evidence depth?

Compare is not:

- a risk score;
- a safety ranking;
- an investment recommendation;
- an automated winner/loser selector;
- a synthetic reputation grade;
- an AI-generated factual comparison;
- a surface for unreviewed monitoring candidates.

## 3. Route and canonical contract

Public route:

```text
/compare/
```

Selected exchanges are represented by repeated `exchange` query parameters.

Examples:

```text
/compare/?exchange=mt-gox&exchange=ftx
/compare/?exchange=mt-gox&exchange=quadrigacx&exchange=btc-e
```

Rules:

- minimum meaningful comparison size: 2 exchanges;
- maximum comparison size: 4 exchanges;
- selection order is meaningful and controls column order;
- repeated duplicate slugs keep the first occurrence only;
- unknown slugs are ignored and surfaced as a non-blocking invalid-selection notice when practical;
- unsupported query parameters do not affect comparison state;
- serializer emits only valid selected `exchange` parameters;
- shareable URLs restore the same valid selection order;
- `/compare/` is the canonical URL for all query variants;
- query variants are not added to sitemap;
- `/compare/` itself is added to sitemap exactly once when H-2 becomes public.

## 4. Selection behavior

### 4.1 Empty state

The base route must not silently choose popular or featured exchanges.

It should present:

- a searchable/selectable exchange picker;
- reviewed entity count context;
- explanation that 2 to 4 exchanges can be compared;
- no preselected ranking or recommended exchange.

### 4.2 One selected exchange

One exchange may remain in URL state so dossier handoff can preselect it.

The surface should show the selected exchange and ask the user to add at least one more exchange.

### 4.3 Two to four selected exchanges

Render the comparison matrix.

Users must be able to:

- add an exchange until the maximum of four;
- remove an exchange;
- preserve remaining column order;
- copy/share the current URL;
- navigate to each source dossier.

### 4.4 Duplicate and invalid selections

Normalization order:

```text
read repeated exchange parameters in URL order
        ↓
trim values
        ↓
remove duplicates, keeping first occurrence
        ↓
resolve against reviewed entity slugs
        ↓
keep first four valid selections
```

No fuzzy identity inference is allowed at query-contract level.

## 5. Data authority

Compare uses the same reviewed public aggregation path as the rest of the site:

```text
loadEntities()
loadEvents()
loadEvidence()
```

These loaders already include reviewed bundle aggregation and identity normalization.

Compare must not read:

- monitoring reports;
- staging directories;
- candidate manifests;
- watchlists as factual comparison inputs;
- private notes.

## 6. Comparison model

Each comparison column represents one reviewed entity.

Required fields:

```text
identity
  canonical name
  type
  status
  death reason
  country or origin

lifecycle
  launch date
  terminal date
  lifespan display

URL/archive
  official URL status
  archive availability

review state
  confidence
  last verified

record depth
  reviewed event count
  reviewed evidence count
  selected major events

navigation
  direct dossier link
```

## 7. Deterministic field semantics

### 7.1 Identity fields

Use canonical reviewed values only.

Display labels may use existing metadata maps, but internal enum values remain unchanged.

### 7.2 Terminal date

Use:

```text
entity.death_date
```

Do not infer a terminal date from an event during Compare rendering.

If absent, display an explicit ongoing/not-terminal value rather than inventing a date.

### 7.3 Lifespan

Lifespan must be deterministic and must not depend on the current clock.

For terminal records with both full launch and death dates:

```text
lifespan_days = UTC day difference(death_date - launch_date)
```

Display may include a deterministic human-readable years value derived from days, but the underlying day count remains authoritative.

For records without a terminal date:

```text
lifespan_days = null
lifespan display = Ongoing
```

Do not calculate a live age from `today` in Compare v1.

If either required date cannot be parsed as a full date, show the reviewed date range without a synthetic duration.

### 7.4 Event count

Count all reviewed events whose normalized `exchange_id` equals the entity ID.

### 7.5 Evidence count

Count all reviewed evidence records whose normalized `exchange_id` equals the entity ID.

### 7.6 Selected major events

Compare may show up to three reviewed events per entity.

Selection is deterministic:

```text
impact rank: critical > high > medium > low
then event_date descending, null last
then sort_order ascending
then event id ascending
```

The displayed event content uses reviewed event title, type, date, and impact level.

No generated event summary is allowed.

## 8. Comparison matrix behavior

Rows are comparison dimensions. Columns are selected exchanges.

Rules:

- no row may color a value as better/worse by default;
- status colors may reuse existing semantic status styling, but must not imply investment quality;
- missing values are explicit;
- unknown is not silently dropped;
- labels remain stable;
- entity names link to dossiers;
- archive availability is informational, not a quality grade;
- evidence/event counts are record-depth indicators, not proof of safety.

Recommended row groups:

```text
Identity
Lifecycle
URL and archive state
Review state
Record depth
Major events
```

## 9. Shareable state contract

The URL is the source of truth for selection state.

Requirements:

- reload restores valid selection;
- add/remove updates URL;
- browser back/forward restores prior selections;
- order is stable;
- duplicate normalization is deterministic;
- maximum four valid entities;
- no local-storage-only selection state;
- no server-side saved comparison session is required.

## 10. Dossier and navigation handoff

H-3 should add a dossier handoff:

```text
Compare this exchange
  -> /compare/?exchange={slug}
```

The user then adds a second exchange on Compare.

Compare may also be added to shared navigation once H-2 is public.

H-3 should not force Explorer to become a multi-select application unless implementation evidence shows that a small, safe handoff can be added without destabilizing Explorer query behavior.

## 11. Accessibility

Required:

- labeled exchange selector;
- keyboard-operable add/remove controls;
- visible focus states;
- clear maximum-selection feedback;
- clear invalid-selection notice;
- table column headers associated with exchange columns;
- row headers for comparison dimensions;
- no color-only meaning;
- horizontally scrollable matrix on narrow screens without hiding exchange identity;
- touch targets remain usable;
- screen-reader text for remove controls includes exchange name.

## 12. Responsive behavior

Desktop:

- 2 to 4 exchange columns side by side;
- sticky or visually persistent row/column context where practical;
- dense registry-style presentation.

Mobile:

- preserve the same comparison data;
- horizontal table scrolling is acceptable;
- do not collapse values into opaque cards that hide row comparability;
- selected exchange names must remain identifiable during scroll;
- selection controls remain above the matrix.

## 13. Visual direction

Compare must feel like a research utility inside HEI.

Prefer:

- dense comparison tables;
- restrained typography;
- compact chips;
- explicit dates and counts;
- dossier links;
- quiet borders and grouping.

Avoid:

- podiums;
- score meters;
- winner badges;
- red/green trading semantics;
- logo walls as primary structure;
- animated counters;
- radar charts that imply a synthetic score model.

## 14. SEO and crawl behavior

When public:

```text
/compare/             indexable candidate
query variants         canonical to /compare/
query variants sitemap no
base route sitemap     exactly once
```

Metadata must describe reviewed historical comparison, not exchange safety or recommendation.

Structured data may describe a `CollectionPage` or `WebPage`, but must not emit synthetic ratings.

## 15. Localization interaction

Compare is implemented in English before L-1 Japanese Pilot.

Requirements:

- query key `exchange` remains locale-independent;
- slug values remain canonical and locale-independent;
- comparison field identifiers remain internal stable keys;
- user-facing field labels must be structured so they can later use locale dictionaries;
- Japanese Compare publication is not part of H unless the later localization authority deliberately adds it.

## 16. Implementation split

### H-1 Compare contract and deterministic data view

Deliver:

```text
Compare specification
machine-readable Compare query contract
query parse/serialize helpers
reviewed comparison view builder
lifespan derivation
major-event selection
self-tests and validator
roadmap checkpoint update
```

No public Compare route required in H-1.

### H-2 Compare route and UI

Deliver:

```text
/compare/
selector
URL-state synchronization
2-4 column matrix
empty/one-selection states
remove/add behavior
metadata and base canonical
responsive layout
```

### H-3 Discovery and dossier handoff

Deliver:

```text
shared navigation entry where appropriate
Compare this exchange dossier link
cross-surface reachability audit update
machine/public route contract updates
sitemap base-route update
```

Explorer multi-select integration remains optional and must not destabilize Explorer v1.

### H-4 Final audit and production verification

Audit:

```text
query normalization
URL round-trip
2/3/4 exchange states
invalid/duplicate/max handling
reviewed-data boundary
lifespan determinism
major-event determinism
accessibility
responsive generated output
canonical/sitemap behavior
machine/public consistency
production route and representative comparison URL
```

## 17. Completion gate

Phase H completes only when:

```text
H-1 contract/data view: PASS
H-2 public route/UI: PASS
H-3 navigation/dossier handoff: PASS
H-4 final audit: PASS
production verification: PASS
reviewed data boundary findings: 0
synthetic score/ranking findings: 0
query round-trip findings: 0
accessibility critical/high findings: 0
```

After H completion, the roadmap priority focus moves to D-750. Data growth may already have progressed in parallel.

## 18. Change control

Review this specification and the roadmap together before changing:

- `/compare/` route model;
- query parameter names;
- 2-to-4 selection limit;
- selection-order semantics;
- comparison field set;
- lifespan derivation;
- major-event selection algorithm;
- reviewed-data boundary;
- SEO/canonical behavior;
- H implementation order;
- H completion gate.

Implementation PRs must cite the relevant H section and this specification.
