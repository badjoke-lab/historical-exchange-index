# HEI Localization Strategy and Foundation Specification

Status: active localization source of truth  
Project: Historical Exchange Index (HEI)  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-07-06

## 1. Authority and scope

This document controls HEI localization architecture, rollout gates, locale safety rules, and the F-1 Multilingual Foundation implementation.

Execution order comes from `docs/HEI_V1_EXECUTION_ROADMAP.md`.

This specification supersedes earlier assumptions that HEI must complete a full Japanese site before v1.0. The fixed strategy is now:

```text
F-1 localization foundation
        ↓
G v1.0 integration baseline
        ↓
H Compare v1
        ↓
L-1 Japanese Pilot
        ↓
L-2 evaluation gate
        ↓
GO / HOLD / PIVOT
```

Full multilingual rollout is not a v1.0 requirement.

## 2. Core localization principles

### 2.1 Canonical facts remain single-source

The following remain one reviewed factual source of truth:

```text
data/entities.json
data/events.json
data/evidence.json
reviewed record bundles
reviewed Registry Update data
public machine-readable exports derived from reviewed data
```

Localization must not create parallel factual registries.

### 2.2 Localization is presentation overlay

Localized content may provide:

- UI labels;
- navigation labels;
- button and CTA text;
- explanatory page copy;
- optional entity summary/notes copy;
- optional event title/description copy.

Localized content must not redefine canonical facts.

### 2.3 English remains canonical public root

Fixed locale model:

```text
default locale: en
canonical root: /
pilot locale: ja
pilot path prefix: /ja/
```

English is the fallback presentation language.

### 2.4 Japanese is a pilot locale, not an assumed full rollout

Japanese is registered first because the operator can directly review translation quality and HEI has meaningful Japanese exchange-history subject matter.

This does not mean Japanese is guaranteed to receive full-site coverage.

After the pilot, expansion requires the Localization Evaluation Gate.

### 2.5 Additional languages are evidence-gated

No third language is fixed in advance.

Potential candidates include Spanish, Portuguese, Korean, Vietnamese, Indonesian, and others. Actual selection must use HEI-specific evidence and QA capacity.

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
- common accessibility labels.

### 3.2 Display labels for canonical enums

Internal enum values remain unchanged while display labels may be localized.

Examples:

```text
internal: status=dead
English label: Dead
Japanese label: 終了

internal: event_type=regulatory_action
English label: Regulatory action
Japanese label: 規制措置
```

The localized label never replaces the internal value in canonical data, URLs, or Explorer query state.

### 3.3 Page copy

May be localized:

- Home explanatory copy;
- About;
- Methodology;
- later Stats/Quality explanatory copy;
- later Change-layer explanatory copy;
- later Explorer labels and helper text.

### 3.4 Optional record-copy overlays

May be localized as separate optional presentation copy:

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

F-1 uses this architecture:

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
  i18n-overlay-schema.json

scripts/
  validate-i18n-foundation.mjs
  test-i18n-foundation.mjs
```

F-1 may adjust exact filenames if implementation evidence requires it, but the separation between canonical facts, UI dictionaries, and record-copy overlays is mandatory.

## 6. Locale configuration contract

Required conceptual configuration:

```ts
export const defaultLocale = 'en'
export const locales = ['en', 'ja'] as const
export const publicPilotLocales = [] as const
```

During F-1, Japanese may be registered as a supported/pilot-capable locale while public Japanese routes remain disabled.

The implementation must distinguish:

- supported locale definitions;
- publicly routed locales;
- fallback locale.

This prevents registration of a locale from accidentally publishing incomplete routes.

## 7. Dictionary contract

### 7.1 Common dictionary

Common dictionary keys should use stable semantic identifiers, for example:

```json
{
  "nav.home": "Home",
  "nav.dead": "Dead",
  "nav.active": "Active",
  "nav.explorer": "Explorer",
  "nav.stats": "Stats",
  "nav.updates": "Updates",
  "nav.incidents": "Incidents",
  "nav.methodology": "Methodology",
  "nav.about": "About",
  "action.submitCorrection": "Submit correction",
  "action.clearFilters": "Clear all filters",
  "label.lastUpdated": "Last updated"
}
```

Japanese dictionary keys must match the English key set for the F-1 common/enums foundation scope.

### 7.2 Enum-label dictionary

Enum dictionaries provide display labels only.

Suggested key namespaces:

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

All enum keys must map back to currently supported canonical values.

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

Allowed keys per entity record:

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

Allowed keys:

```text
title
description
```

All factual event fields remain canonical.

### 8.3 Overlay identifier rules

- entity overlays are keyed by canonical slug;
- event overlays are keyed by canonical event ID;
- overlay identifiers must resolve to reviewed canonical records when non-empty;
- unknown identifiers are validation errors;
- duplicate identifiers are impossible in JSON object form and must remain so;
- overlay locale metadata must match the containing locale directory.

## 9. Merge and fallback behavior

### 9.1 Entity display merge

```text
canonical entity
        ↓
optional locale entity copy
        ↓
display entity
```

Only `summary` and `notes` may be replaced by overlay copy in F-1 utilities.

All other fields remain canonical.

### 9.2 Event display merge

```text
canonical event
        ↓
optional locale event copy
        ↓
display event
```

Only `title` and `description` may be replaced by overlay copy.

### 9.3 Fallback

Fixed fallback behavior:

```text
requested dictionary exists
    -> use requested locale dictionary

requested dictionary missing/unsupported
    -> use English dictionary

record overlay exists
    -> use allowed localized copy fields

record overlay missing
    -> use canonical English record text
```

Missing optional record-copy translation must not block canonical publication or English builds.

## 10. Locale route helper contract

Route helpers must preserve record identity and page type.

Examples:

```text
English: /exchange/mt-gox/
Japanese pilot-capable route: /ja/exchange/mt-gox/

English: /methodology/
Japanese: /ja/methodology/
```

Rules:

- do not translate slugs;
- remove default `en` prefix from canonical English routes;
- add `/ja/` prefix only for public Japanese routes;
- preserve search/query state when a future locale switcher supports Explorer;
- locale helper output must not silently create public routes that are outside the active rollout phase.

## 11. F-1 implementation scope

F-1 is architecture work only.

Required:

```text
locale config
common dictionaries
enum dictionaries
dictionary loader
English fallback
entity-copy overlay schema and empty seed files
event-copy overlay schema and empty seed files
entity merge utility
event merge utility
locale route helpers
foundation validator
foundation self-tests
package/CI integration
documentation checkpoint sync
```

Not required in F-1:

```text
public /ja/ routes
language switcher
Japanese About translation
Japanese Methodology translation
Japanese list routes
Japanese detail routes
Japanese Stats/Quality/Change routes
Japanese Explorer
hreflang publication
locale sitemap expansion
bulk record translation
additional languages
```

## 12. F-1 safety validator

The validator must check at least:

- locale config includes `en` and `ja` exactly as intended;
- default locale is `en`;
- English/Japanese common dictionary key sets match for foundation keys;
- English/Japanese enum dictionary key sets match;
- enum dictionary keys correspond to supported canonical enum values;
- overlay schema version is supported;
- overlay locale metadata matches directory locale;
- entity overlay records contain only allowed copy keys;
- event overlay records contain only allowed copy keys;
- non-empty entity overlay IDs resolve to canonical slugs;
- non-empty event overlay IDs resolve to canonical event IDs;
- no URL-like canonical fields appear in overlay records;
- no ID/status/death_reason/confidence fields appear in entity overlays;
- no date/type/impact/status-effect/confidence fields appear in event overlays;
- existing canonical data files remain outside the localization directories.

## 13. F-1 self-test contract

Tests must demonstrate:

- Japanese dictionary lookup returns Japanese value;
- unsupported locale falls back to English;
- English lookup remains stable;
- entity copy overrides only summary/notes;
- missing entity copy returns canonical text;
- event copy overrides only title/description;
- missing event copy returns canonical text;
- English root route has no `/en/` prefix;
- Japanese route helper produces `/ja/` prefix;
- slug is preserved across locale route generation;
- invalid overlay fixture is rejected by validator or schema helper.

## 14. CI integration

F-1 must add stable package scripts, for example:

```text
i18n:validate
i18n:test
```

These must run in the normal validation path before F-1 is marked complete.

F-1 must not add localization requirements to canonical ingest/promotion logic.

Canonical data PRs must remain publishable without new Japanese record copy.

## 15. Japanese Pilot scope after Compare

Japanese public rollout occurs only after:

```text
F-1 foundation COMPLETE
G v1.0 baseline COMPLETE
H Compare v1 COMPLETE
```

Initial pilot scope:

```text
/ja/
/ja/about/
/ja/methodology/
common navigation/footer labels
language switcher
basic enum display labels
locale metadata
hreflang/alternate links
pilot sitemap entries
```

The pilot deliberately does not begin with a complete translated registry.

## 16. Japanese Pilot evaluation

Evaluation categories:

### Search

- impressions;
- clicks;
- Japanese queries;
- indexing state.

### Usage

- entry rate;
- language switch use;
- navigation from localized About/Methodology;
- return behavior where measurable.

### Maintenance quality

- correction requests;
- fallback frequency;
- broken locale links;
- translation synchronization burden;
- operator QA burden.

Decision outcomes:

```text
GO
  expand Japanese coverage in staged order

HOLD
  retain pilot only; continue core roadmap

PIVOT
  keep useful foundation/pilot work; evaluate another language later
```

## 17. Japanese Expansion order after GO

```text
JA-1 /ja/dead/ and /ja/active/
JA-2 /ja/exchange/[slug]/
JA-3 /ja/stats/ and /ja/quality/
JA-4 /ja/updates/, /ja/incidents/, /ja/monthly/
JA-5 /ja/explore/
JA-6 multilingual final audit
```

Record-copy overlays may grow incrementally. Missing optional copy continues to fall back to canonical English.

## 18. Additional-language gate

No fixed third language exists.

Candidates must be selected from HEI evidence, not generic market ranking alone.

Decision inputs:

- traffic language and geography;
- Search Console queries;
- pilot behavior;
- subject relevance to exchange history;
- translation QA capacity;
- maintenance cost.

Only one new language pilot should be introduced at a time unless operating capacity changes materially.

## 19. SEO and metadata rules for future public locale routes

When a locale route becomes public, require:

- correct HTML `lang`;
- locale-specific title and description;
- locale-specific canonical URL;
- reciprocal `hreflang`/alternate links;
- appropriate Open Graph locale metadata;
- deliberate sitemap inclusion;
- no query-variant sitemap explosion;
- no locale route pointing canonically to a different factual record identity.

These requirements are pilot/public-rollout work, not F-1 foundation requirements.

## 20. UI and design rules

Localization must preserve HEI's quiet-registry direction.

Rules:

- do not convert dense lists/tables into oversized cards merely because labels become longer;
- allow wrapping before deleting information;
- keep chips short where possible;
- longform locale pages may use slightly more line height;
- mobile remains information-dense but usable;
- URL safety meaning must remain clear across locales;
- no color-only status semantics.

## 21. Workflow separation

Canonical workflow and localization workflow remain separate.

Canonical flow:

```text
discovery
normalize/dedupe
reviewed draft
validation
PR
manual merge
public output
```

Localization flow:

```text
dictionary or overlay change
localization validation
translation review
PR
manual merge
localized presentation
```

Do not combine broad canonical factual changes with bulk translation changes in one PR.

## 22. Change control

Review this specification and the roadmap together before changing:

- default locale;
- public locale prefix model;
- canonical/fallback language;
- overlay allowed fields;
- Japanese pilot scope;
- localization evaluation gate;
- additional-language selection rules;
- locale-specific Explorer query semantics;
- decision to make full multilingual rollout a v1.0 requirement.

Implementation PRs must cite the relevant section of this specification.

## 23. F-1 completion definition

F-1 is complete when:

```text
localization architecture documented                 pass
locale config fixed                                  pass
common/enums dictionary schemas fixed                pass
English fallback tested                              pass
entity/event overlay schemas fixed                   pass
merge utilities tested                               pass
locale route helpers tested                          pass
overlay safety validator                             pass
CI/package integration                               pass
canonical data regression                            pass
English public output regression                     pass
Japanese full-route rollout                          intentionally not included
```

After F-1 completion, execution moves directly to Phase G v1.0 Integration Baseline.
