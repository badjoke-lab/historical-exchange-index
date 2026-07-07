# HEI Localization Strategy and Foundation Specification

Status: active localization source of truth  
Project: Historical Exchange Index (HEI)  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-07-07

## 1. Authority and scope

This document controls HEI localization architecture, rollout gates, locale safety rules, Japanese Pilot scope, evaluation, and additional-language selection.

Execution order comes from:

```text
docs/HEI_V1_EXECUTION_ROADMAP.md
```

Data milestone gates come from:

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
```

The fixed strategy is:

```text
F-1 localization foundation
        ↓
G v1.0 integration baseline
        ↓
H Compare v1
        ↓
D-750 reviewed entity milestone
        ↓
L-1 Japanese Pilot
        ↓
L-2 Localization Evaluation Gate
        ↓
D-1000 reviewed entity milestone
        ↓
Language Selection Gate
        ↓
zero or one evidence-selected third-language pilot
```

Data growth continues in parallel. The sequence above controls public rollout gates and priority focus.

Full multilingual rollout is not a v1.0 requirement.

## 2. Core localization principles

### 2.1 Canonical facts remain single-source

The following remain one reviewed factual source of truth:

```text
data/entities.json
data/events.json
data/evidence.json
reviewed records/exchanges bundles
reviewed Registry Update data
public machine-readable exports derived from reviewed data
```

Localization must not create parallel factual registries.

### 2.2 Localization is a presentation overlay

Localized content may provide:

- UI labels;
- navigation labels;
- button and CTA text;
- explanatory page copy;
- optional entity summary/notes copy;
- optional event title/description copy.

Localized content must not redefine canonical facts.

### 2.3 English remains the canonical public root

Fixed locale model:

```text
default locale: en
fallback locale: en
canonical root: /
first pilot locale: ja
pilot path prefix: /ja/
```

English is the fallback presentation language.

### 2.4 Japanese is a pilot, not an assumed full translation program

Japanese is first because:

- the operator can directly review Japanese quality;
- HEI has meaningful Japanese exchange-history subject matter;
- the pilot can be evaluated without committing to permanent full-record translation.

Japanese Pilot does not mean every entity summary, event description, or evidence title must be translated.

### 2.5 Data growth has priority over broad translation coverage

Canonical corpus growth benefits every locale and every machine/public surface.

Fixed release gates:

```text
Japanese public pilot: not before 750 reviewed entities
third-language pilot: not before 1000 reviewed entities
```

Localization work must not become a reason to stop reviewed data growth.

### 2.6 Additional languages are evidence-gated

No third language is fixed in advance.

Potential candidates may include Spanish, Portuguese, Korean, Vietnamese, Indonesian, Chinese variants, or others.

Selection must use HEI-specific evidence and QA capacity.

## 3. What may be localized

### 3.1 User-interface copy

May be localized:

- header;
- navigation;
- footer;
- filter labels;
- result-count sentences;
- empty states;
- buttons;
- CTA text;
- disclaimers;
- section headings;
- helper text;
- accessibility labels;
- URL-safety explanatory labels;
- Explorer controls;
- Stats/Quality labels;
- Change-layer interface copy.

### 3.2 Display labels for canonical enums

Internal enum values remain unchanged while display labels may be localized.

Example:

```text
internal: status=dead
English label: Dead
Japanese label: 終了

internal: event_type=regulatory_action
English label: Regulatory action
Japanese label: 規制措置
```

Localized labels never replace internal values in canonical data, URLs, or Explorer query state.

### 3.3 Page copy

May be localized:

- Home explanatory copy;
- About;
- Methodology;
- Stats/Quality explanatory copy;
- Change-layer explanatory copy;
- Explorer labels and helper text;
- exchange-detail interface labels.

### 3.4 Optional record-copy overlays

May be localized separately as optional presentation copy:

```text
entity summary
entity notes
event title
event description
```

Missing optional copy must fall back to canonical English text.

## 4. What must not be localized into canonical state

Do not translate or locale-fork:

```text
id
slug
canonical enum values
canonical_name by default
aliases as canonical identity data
official_url_original
official_domain_original
archived_url
source URL
evidence source title
publisher name
record IDs
exchange IDs
event IDs
evidence IDs
Explorer query parameter keys
Explorer enum parameter values
```

Reasons:

- HEI is a historical registry;
- source identity must remain traceable;
- URLs are historical evidence and safety-sensitive;
- one record must preserve one identity across locales;
- machine-readable consumers must not receive locale-divergent facts.

## 5. Repository architecture

The localization foundation uses this separation:

```text
src/
  i18n/
    config.ts
    locales/
      en/
        common.json
        enums.json
      ja/
        common.json
        enums.json

  lib/
    i18n/
      get-dictionary.ts
      locale-routes.ts
      merge-entity-copy.ts
      merge-event-copy.ts

data-i18n/
  en/
    entities-copy.json
    events-copy.json
  ja/
    entities-copy.json
    events-copy.json

config/
  i18n-locales.json
  i18n-overlay-schema.json

scripts/
  validate-i18n-foundation.mjs
  test-i18n-foundation.mjs
```

Separation between canonical facts, UI dictionaries, and record-copy overlays is mandatory.

## 6. Locale configuration contract

Required conceptual state:

```text
default locale: en
fallback locale: en
supported locales: en, ja
public locales before L-1: en
pilot locale: ja
```

The implementation must distinguish:

- supported locale definitions;
- publicly routed locales;
- pilot locales;
- fallback locale.

Registering a locale must not accidentally publish incomplete routes.

## 7. Dictionary contract

### 7.1 Common dictionary

Dictionary keys use stable semantic identifiers.

Examples:

```text
nav.home
nav.dead
nav.active
nav.explorer
nav.stats
nav.updates
nav.incidents
nav.methodology
nav.about
action.submitCorrection
action.clearFilters
label.lastUpdated
```

Japanese dictionary keys must remain structurally compatible with English foundation keys.

### 7.2 Enum-label dictionary

Enum dictionaries provide display labels only.

Namespaces may include:

```text
status.*
deathReason.*
exchangeType.*
officialUrlStatus.*
confidence.*
eventType.*
impactLevel.*
eventStatusEffect.*
```

All enum keys must map to supported canonical values.

### 7.3 Key stability

Dictionary keys are internal UI contracts. Rename/removal requires review of all consumers and validators.

## 8. Record-copy overlay contract

### 8.1 Entity copy

Conceptual shape:

```json
{
  "schema_version": 1,
  "locale": "ja",
  "records": {
    "mt-gox": {
      "summary": "...",
      "notes": "..."
    }
  }
}
```

Allowed entity copy fields:

```text
summary
notes
```

Disallowed examples:

```text
id
slug
status
death_reason
official_url_original
official_domain_original
archived_url
confidence
last_verified_at
```

### 8.2 Event copy

Conceptual shape:

```json
{
  "schema_version": 1,
  "locale": "ja",
  "records": {
    "hei_ev_000102": {
      "title": "...",
      "description": "..."
    }
  }
}
```

Allowed event copy fields:

```text
title
description
```

All factual event fields remain canonical.

### 8.3 Overlay identifier rules

- entity overlays are keyed by canonical slug;
- event overlays are keyed by canonical event ID;
- non-empty overlay IDs must resolve to reviewed canonical records;
- overlay locale metadata must match the locale directory;
- unknown identifiers are validation errors.

## 9. Merge and fallback behavior

### Entity display merge

```text
canonical entity
        ↓
optional locale entity copy
        ↓
display entity
```

Only approved presentation-copy fields may be replaced.

### Event display merge

```text
canonical event
        ↓
optional locale event copy
        ↓
display event
```

Only approved presentation-copy fields may be replaced.

### Fallback

```text
requested dictionary exists
    -> use requested locale dictionary

requested dictionary missing/unsupported
    -> use English dictionary

record overlay exists
    -> use allowed localized copy

record overlay missing
    -> use canonical English record copy
```

Missing optional translation must not block canonical publication or English builds.

## 10. Locale route contract

Route helpers must preserve record identity and page type.

Examples:

```text
/exchange/mt-gox/
/ja/exchange/mt-gox/

/methodology/
/ja/methodology/
```

Rules:

- do not translate slugs;
- do not add `/en/` to canonical English routes;
- add `/ja/` only when the corresponding Japanese route is deliberately public;
- preserve query state for locale switching;
- Explorer query keys and enum values remain locale-independent;
- locale helpers must not silently create routes outside the active rollout phase.

## 11. F-1 completion state

F-1 foundation is complete.

Completed foundation includes:

```text
locale config
English/Japanese common dictionaries
English/Japanese enum dictionaries
dictionary loader
English fallback
entity/event copy overlay schema
empty/controlled overlay files
entity/event merge utilities
locale route helpers
foundation validator
foundation tests
CI integration
```

F-1 completion does not itself publish Japanese routes.

## 12. Japanese Pilot prerequisites

L-1 may begin only after:

```text
F-1 localization foundation COMPLETE
Phase G v1.0 baseline COMPLETE
H Compare v1 COMPLETE
D-750 reviewed entity milestone COMPLETE
```

The reviewed-entity count must use public build aggregation semantics defined by `docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md`.

## 13. L-1 Japanese Pilot scope

The pilot is intentionally broad in UI coverage but limited in translated factual copy.

### 13.1 Public Japanese route shell

Pilot target surfaces:

```text
/ja/
/ja/dead/
/ja/active/
/ja/about/
/ja/methodology/
/ja/stats/
/ja/quality/
/ja/explore/
/ja/updates/
/ja/incidents/
/ja/monthly/
/ja/exchange/[slug]/
```

The route shell may use English fallback for untranslated record copy.

### 13.2 Required Japanese UI coverage

```text
header
navigation
footer
Home copy
About copy
Methodology copy
filter labels
status labels
death-reason labels
Explorer controls and helper text
Stats labels and explanation
Quality labels and explanation
Updates/Incidents/Monthly UI copy
exchange-detail section headings and field labels
URL-safety labels
Timeline labels
Evidence section labels
disclaimers
correction UI
language switcher
```

### 13.3 Record-copy pilot sample

The initial pilot may include reviewed optional overlays for approximately:

```text
dead-side priority set: up to 100 entities
active-side priority set: up to 50 entities
selected major events where useful
```

This is a controlled sample, not a requirement to translate all 750+ entities.

Selection should prioritize:

- historically important exchanges;
- records likely to receive Japanese search demand;
- records useful for comparing Japanese and global exchange history;
- records whose English summary can be safely translated without factual reinterpretation.

### 13.4 Explicit non-goals of L-1

Not required:

```text
translation of every entity summary
translation of every event description
translation of evidence titles
translation of publisher names
translation of canonical names by default
new Japanese factual registry
third-language launch
```

## 14. L-1 SEO and metadata requirements

When Japanese routes become public, require:

- correct HTML `lang`;
- locale-specific title and description;
- locale-specific canonical URL;
- reciprocal `hreflang`/alternate links;
- appropriate Open Graph locale metadata;
- deliberate sitemap inclusion;
- no query-variant sitemap explosion;
- no locale route pointing canonically to a different factual identity.

## 15. L-2 Localization Evaluation Gate

L-2 evaluates whether Japanese coverage is useful and maintainable.

### Search evidence

- impressions;
- clicks;
- Japanese queries;
- indexing state;
- landing-page distribution.

### Usage evidence

- entry rate;
- language-switch use;
- localized navigation depth;
- Explorer usage;
- Stats/Quality usage;
- dossier transitions;
- return behavior where measurable.

### Maintenance evidence

- correction requests;
- fallback frequency;
- broken locale links;
- translation synchronization burden;
- stale overlay backlog;
- operator QA burden;
- CI/localization failure rate.

Decision outcomes:

```text
GO
  keep Japanese pilot and expand useful Japanese coverage in stages

HOLD
  keep pilot scope stable; prioritize core roadmap and D-1000 growth

PIVOT
  retain useful foundation/pilot work; do not expand Japanese aggressively;
  continue D-1000 growth and wait for the Language Selection Gate
```

L-2 does not authorize a third language.

## 16. Japanese expansion after GO

If L-2 returns GO, expansion should prioritize copy depth rather than multiplying route families that already exist in the pilot shell.

Suggested order:

```text
JA-1 expand dead-side entity summary overlays
JA-2 expand active-side entity summary overlays
JA-3 expand selected major event copy
JA-4 improve Stats/Quality/Change explanatory copy
JA-5 improve Explorer helper copy and search guidance
JA-6 multilingual quality/SEO/fallback audit
```

Record-copy overlays may grow incrementally. Missing optional copy continues to fall back to canonical English.

Japanese expansion must not stop D-1000 data growth.

## 17. D-1000 prerequisite for additional-language selection

No third-language pilot may be launched before:

```text
D-1000 reviewed entity milestone COMPLETE
Japanese Pilot evidence exists
L-2 decision is recorded
Language Selection Gate is executed
```

The 1000-entity rule is a release prerequisite, not a claim that every one of 1000 entities must have Japanese copy.

## 18. Language Selection Gate

No third language is preselected.

Decision inputs:

- HEI traffic language and geography;
- Search Console queries;
- Japanese pilot behavior;
- exchange-history subject relevance;
- translation QA capability;
- maintenance cost;
- correction/support language patterns;
- operator ability to verify longform quality.

Decision outcomes:

```text
NO LAUNCH
  no evidence supports another locale yet

PILOT ONE LANGUAGE
  select one language and define a separate pilot scope
```

Only one new language pilot should be introduced at a time unless operating capacity changes materially.

## 19. Additional-language safety rules

A third-language pilot must:

- reuse canonical facts;
- reuse locale-independent slugs and Explorer query state;
- use English fallback;
- have a defined QA owner/process;
- have explicit route and sitemap scope;
- have a measurement gate;
- not copy raw machine translation directly into canonical records;
- not block English or Japanese canonical publication when optional copy is missing.

## 20. UI and design rules

Localization must preserve HEI's quiet-registry direction.

Rules:

- do not replace dense tables/lists with oversized cards merely because labels are longer;
- allow wrapping before deleting information;
- keep chips concise;
- longform locale pages may use slightly more line height;
- mobile remains information-dense but usable;
- URL-safety meaning must remain clear across locales;
- no color-only status semantics.

## 21. Workflow separation

Canonical workflow:

```text
discovery
normalize/dedupe
reviewed draft
validation
PR
manual merge
public output
```

Localization workflow:

```text
dictionary or overlay change
localization validation
translation review
PR
manual merge
localized presentation
```

Do not combine broad canonical factual changes with bulk translation changes in one PR.

Canonical data PRs remain publishable without new Japanese record copy.

## 22. Validation requirements

Localization validation must continue to check:

- locale config contract;
- default/fallback locale;
- dictionary key compatibility;
- enum-label key validity;
- overlay schema version;
- overlay locale metadata;
- allowed copy-only fields;
- entity/event overlay identifier resolution;
- prohibition of canonical factual fields in overlays;
- prohibition of URL/state/date/type facts in copy overlays;
- route prefix behavior;
- English fallback;
- locale-independent slugs and query state.

Public L-1 work must additionally validate:

- hreflang reciprocity;
- locale canonical URLs;
- sitemap scope;
- broken locale links;
- fallback behavior on untranslated dossiers/events;
- no canonical data duplication.

## 23. Change control

Review this specification, the roadmap, and the data-growth milestone specification together before changing:

- default locale;
- public locale prefix model;
- canonical/fallback language;
- overlay allowed fields;
- 750-entity Japanese Pilot gate;
- L-1 pilot scope;
- L-2 evaluation gate;
- 1000-entity third-language prerequisite;
- additional-language selection rules;
- locale-specific Explorer query semantics.

Implementation PRs must cite the relevant section of this specification.

Do not change localization rollout order through chat memory alone. Update repository authorities first.
