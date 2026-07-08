# HEI Compare v1 Specification

Status: fixed implementation specification  
Project: Historical Exchange Index (HEI)  
Roadmap item: Phase H — Compare v1  
Machine contract: `config/compare-v1-contract.json`

## 1. Authority and purpose

This document is the task-specific source of truth for HEI Compare v1.

Execution order remains governed by `docs/HEI_V1_EXECUTION_ROADMAP.md`. Product behavior and non-goals remain governed by `docs/HEI_PRODUCT_SURFACES_SPEC.md`. This specification fixes the route, selection-state contract, reviewed-data boundary, deterministic comparison fields, URL-safety behavior, crawl policy, and implementation split for Phase H.

Compare exists to help a reader inspect reviewed exchange histories side by side. It is a research utility inside the HEI quiet-registry system, not a scorecard, ranking product, trading dashboard, or AI answer engine.

## 2. Scope

Compare v1 supports:

- 2 to 4 reviewed public exchanges at a time;
- shareable URL state;
- reviewed identity and classification fields;
- lifecycle dates;
- deterministic lifespan;
- status and death reason;
- country or origin;
- URL and archive state;
- confidence;
- reviewed event and evidence counts;
- deterministic selected major events;
- direct dossier links.

Compare v1 does not support:

- synthetic risk scores;
- investment or safety rankings;
- live price, volume, TVL, liquidity, or order-book metrics;
- unreviewed candidates;
- raw monitoring output;
- AI-generated factual claims;
- model-generated recommendations;
- free-form natural-language comparison.

## 3. Reviewed-public boundary

Every comparison fact must come from reviewed public HEI state or a deterministic derivation from that state.

The entity source is the same reviewed-public aggregation used by public product surfaces. Implementations must not derive the comparison universe from base-array lengths alone and must not expose staging, watchlist, monitoring, or unmerged candidate data.

Event and evidence counts use reviewed public events and evidence associated with the resolved reviewed entity.

Missing values remain missing. Compare must not infer a terminal date, origin, status transition, death reason, URL state, or historical event that is absent from reviewed data.

## 4. Route and selection state

The Compare route is:

```text
/compare/
```

The shareable selection parameter is repeated:

```text
/compare/?exchange=ftx&exchange=mt-gox
```

The fixed selection rules are:

- parameter key: `exchange`;
- values are reviewed public entity slugs;
- comparison-ready state requires 2 to 4 unique resolved entities;
- selection order is preserved and defines comparison-column order;
- duplicate slugs are removed after the first occurrence;
- a maximum of 4 reviewed unique slugs is retained;
- empty, malformed, or unknown reviewed slugs are ignored;
- unknown query parameters are ignored;
- zero or one resolved entity renders selection state without comparison claims;
- unreviewed candidates are never resolved into Compare.

The normalized share URL contains only resolved reviewed slugs.

### 4.1 Slug normalization

Before reviewed-entity resolution:

1. trim whitespace;
2. lowercase;
3. require `^[a-z0-9]+(?:-[a-z0-9]+)*$`;
4. reject values longer than 120 Unicode code points.

Slug normalization is only URL-state handling. It does not create or alter canonical entity identity.

## 5. Comparison sections

The public comparison is organized into six compact sections.

### 5.1 Identity

Fields:

- canonical name;
- type;
- dossier link.

Canonical names and slugs remain locale-independent factual identity.

### 5.2 Lifecycle

Fields:

- launch date;
- terminal date;
- deterministic lifespan.

`terminal_date` in Compare v1 is exactly the reviewed entity `death_date`. Compare must not infer a terminal date from events.

`lifespan_days` is derived only when both launch and death dates are valid reviewed ISO dates and death date is not earlier than launch date:

```text
floor((death_date UTC - launch_date UTC) / 86400000)
```

If the inputs are missing or invalid, lifespan is unknown.

The UI may render a human-readable duration from `lifespan_days`, but the calculation must remain deterministic and documented.

### 5.3 Status and origin

Fields:

- status;
- death reason;
- country or origin;
- confidence.

The UI must preserve the distinction between `status` and `death_reason`. Missing death reason on non-dead-side entries is not an error and must not be filled with a guess.

### 5.4 URL and archive state

Fields:

- original domain;
- official URL status;
- archive availability;
- archive link when available.

`archive_available` is the deterministic boolean value of `Boolean(entity.archived_url)`.

Compare follows the existing HEI URL-safety policy:

- dead-side archive access is preferred;
- unsafe, repurposed, and dead-domain original URLs must not become primary direct actions;
- Compare must not weaken dossier URL-safety behavior;
- archive links come only from reviewed `archived_url` values.

### 5.5 Record coverage

Fields:

- reviewed event count;
- reviewed evidence count.

Counts are descriptive coverage information only. They are not quality scores and must not be presented as rankings.

### 5.6 Selected major events

Compare may show up to 5 reviewed events per entity.

Candidate events are those where at least one is true:

- `is_major_event === true`;
- `impact_level === critical`;
- `impact_level === high`.

Selection priority is deterministic:

1. explicit `is_major_event === true`;
2. critical before high impact;
3. known event dates before unknown;
4. newer event date first;
5. higher `sort_order` first;
6. event ID ascending as final tie-break.

After selecting at most 5 events, display them chronologically:

1. known event date ascending;
2. `sort_order` ascending;
3. event ID ascending.

AI or editorial scoring must not be used to choose major events.

## 6. Selection UI behavior

The selection control must search or select only reviewed public entities.

Required behavior:

- user can add entities until 4 are selected;
- user can remove any selected entity;
- duplicate selection is prevented;
- current selection order remains visible;
- two resolved entities are enough to show a comparison;
- one selected entity shows a clear prompt to add another;
- zero selected entities shows an empty selector state;
- invalid or unavailable URL selections do not create factual comparison columns;
- the normalized share action uses the fixed repeated `exchange` parameter contract.

Compare should not require account state, cookies, or server-side session state for shareability.

## 7. Layout and visual direction

Compare must follow the HEI quiet-registry direction.

Preferred structure:

1. compact page header;
2. compact selection controls;
3. comparison state summary;
4. dense comparison table or matrix;
5. selected major-event rows;
6. dossier/archive actions;
7. methodology and correction utility links.

Desktop behavior:

- 2 to 4 exchange columns;
- row labels remain stable and easy to scan;
- dense borders and restrained surfaces are preferred over large cards.

Mobile behavior:

- preserve entity identity while horizontally scrolling or using another compact comparison pattern;
- do not convert every field into a giant stacked marketing card;
- selected entities and removal controls remain keyboard and touch usable.

Status color may support scanning, but no comparison meaning may rely on color alone.

## 8. Missing and uncertain values

Compare must distinguish:

- a reviewed explicit value;
- an unknown or missing value;
- a deterministic derived value.

Rules:

- display missing values explicitly as `Unknown` or an equivalent UI label;
- never convert missing values to zero;
- never interpret missing archive URL as proof that no archive exists anywhere;
- never interpret event/evidence counts as safety or quality scores;
- confidence is displayed as reviewed metadata, not converted into a numeric score.

## 9. Crawl and canonical policy

The fixed crawl policy is:

- `/compare/` base route may be indexable;
- base route may be included in the sitemap when implementation is public;
- arbitrary query variants are not added to the sitemap;
- all query variants canonicalize to `/compare/`;
- HEI does not generate SEO landing pages for every exchange combination.

Shareable research state and SEO landing pages are separate concerns.

## 10. Localization interaction

Phase H must not block the later Japanese Pilot.

Requirements:

- query parameter key `exchange` is locale-independent;
- slug values are locale-independent;
- canonical facts remain single-source;
- labels and helper copy must be dictionary-ready;
- future locale routes must preserve the same comparison semantics;
- Phase H does not itself launch a public locale.

## 11. Implementation split

Phase H is split into reviewable items.

```text
H-1 Compare specification and selection-state contract
H-2 Compare route, reviewed selector, and core identity/lifecycle matrix
H-3 URL/archive safety, coverage counts, and selected major events
H-4 Share flow, dossier/Explorer discovery links, and navigation integration
H-5 Accessibility, responsive, crawl, regression, and production verification
```

Dependency order should be preserved even if PR count changes.

### H-1 completion

- this specification exists;
- `config/compare-v1-contract.json` exists and matches it;
- route and selection semantics are fixed before UI implementation.

### H-2 completion

- `/compare/` exists;
- reviewed entity resolution is used;
- 2-to-4 selection works;
- normalized repeated-parameter URL state works;
- identity and lifecycle rows work;
- no unreviewed data can enter comparison output.

### H-3 completion

- status/origin rows work;
- URL/archive behavior preserves HEI safety rules;
- event/evidence counts use reviewed public data;
- selected major events follow the deterministic contract.

### H-4 completion

- comparison URLs are shareable;
- relevant reviewed public surfaces can discover Compare without clutter;
- dossier and Explorer handoffs preserve reviewed identity;
- navigation changes follow the public-surface hierarchy.

### H-5 completion

- keyboard and visible-focus behavior is audited;
- mobile comparison remains usable;
- no color-only meaning exists;
- base/query canonical and sitemap policy are audited;
- reviewed-public boundary regression checks pass;
- production verification confirms deployed commit before route diagnosis.

## 12. Phase H completion gate

Phase H is complete only when all of the following are true:

```text
H-1 contract fixed
H-2 core comparison public
H-3 comparison content complete
H-4 discovery/share integration complete
H-5 final audits and production verification complete
```

Completion does not change the separate D-750 requirement.

The release gate remains:

```text
H COMPLETE + D-750 COMPLETE -> L-1 Japanese Pilot may launch
```

## 13. Change control

Any change to the following requires this specification and the machine contract to be reviewed together:

- Compare route;
- selection parameter key;
- 2-to-4 comparison limit;
- selection ordering;
- reviewed-public resolution boundary;
- normalized URL serialization;
- lifespan derivation;
- selected-major-event algorithm;
- URL-safety behavior;
- crawl/canonical policy;
- addition of scoring, rankings, AI factual generation, or live-market metrics.

Changes that alter Phase order or the H/D-750/L-1 gate also require roadmap review.
