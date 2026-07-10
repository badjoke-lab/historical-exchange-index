# HEI L-1 Japanese Pilot Implementation Plan

Status: active implementation plan  
Project: Historical Exchange Index (HEI)  
Entry gate: D-750 Reviewed Entity Milestone COMPLETE

## 1. Objective

Implement the first public Japanese pilot without creating a second factual registry, weakening English fallback, or exposing incomplete `/ja/` route families.

The pilot follows:

```text
canonical reviewed facts
        ↓
shared locale-independent identity and query state
        ↓
Japanese UI dictionary and optional copy overlays
        ↓
Japanese route shell
        ↓
activation gate
        ↓
public pilot
```

Canonical facts remain single-source. Japanese record-copy overlays are optional presentation copy only.

## 2. Fixed pilot route scope

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

The pilot does not require complete Japanese translation of all record summaries or events.

## 3. Safety rule

Japanese routes must not become public merely because a locale is listed as supported.

Activation requires all of the following in one reviewed public state:

```text
D-750 completion evidence exists
reviewed entity count >= 750
Japanese route family complete
Japanese dossier count == reviewed entity count
html lang=ja on representative Japanese output
locale-specific canonical URLs
reciprocal en/ja hreflang
og:locale=ja_JP
Japanese static routes in sitemap
all reviewed Japanese dossier routes in sitemap
no query variants in sitemap
English fallback preserved
canonical facts single-source
```

`config/japanese-pilot-route-contract.json` and `scripts/validate-japanese-pilot-readiness.mjs` are the activation safety contract.

## 4. Static-export language handling

HEI uses Next.js static export. The current root layout emits `<html lang="en">`.

L-1 must not publish Japanese pages with an English document language declaration.

The implementation should preserve the existing static-export architecture and use a deterministic localized-output step for Japanese output if route-level Next.js layout structure cannot emit the correct document language directly without a broad route-tree migration.

Any localized-output step must be:

- deterministic;
- build-time only;
- limited to Japanese output paths;
- validated by the Japanese Pilot readiness gate;
- unable to alter canonical factual JSON;
- covered by a self-test.

A broad route-group migration is not required for the pilot unless the smaller static-export approach proves unsafe or unmaintainable.

## 5. Implementation sequence

### L1-1 — Activation contract and gate

Deliver:

```text
Japanese route contract
D-750 prerequisite check
pre-activation leak check
public activation route checks
html lang check
canonical check
hreflang check
Open Graph locale check
sitemap coverage check
Japanese dossier-count check
CI gate
```

No Japanese route is activated in this step.

### L1-2 — Shared localized shell and dictionary coverage

Deliver reusable locale-aware presentation components without publishing `/ja/` routes yet:

```text
locale-aware header/navigation/footer
language-switch model
page-label helpers
required Japanese UI dictionary expansion
Compare handoff behavior decision for pilot routes
accessibility labels
URL-safety labels
```

English output must remain unchanged.

### L1-3 — Locale-aware page renderers

Prepare reusable Japanese rendering inputs for:

```text
Home
Dead
Active
About
Methodology
Stats
Quality
Explorer
Updates
Incidents
Monthly
Exchange dossier
```

This step should reuse reviewed canonical data and English fallback rather than fork data loading.

### L1-4 — Route shell, metadata, sitemap, and activation

Deliver the full route family and activate Japanese public routing in one reviewed change only after the readiness gate can pass.

Required:

```text
public locale activation
all required /ja/ routes
all reviewed /ja/exchange/[slug]/ routes
html lang=ja
locale canonical metadata
en/ja reciprocal hreflang
og:locale=ja_JP
sitemap integration
language switcher
public navigation integration
machine/public consistency review
accessibility review
URL-safety review
```

Partial route-family publication is prohibited.

### L1-5 — Controlled optional record-copy sample

After route activation is stable, add optional Japanese copy overlays in reviewed batches.

Priority may include:

```text
up to 100 dead-side entity summaries
up to 50 active-side entity summaries
selected major event titles/descriptions
```

Missing overlays continue to fall back to canonical English copy.

## 6. Compare scope

The fixed L-1 pilot route list does not require `/ja/compare/`.

During the pilot:

- Japanese navigation must not imply that a Japanese Compare route exists unless implemented;
- a Japanese surface may link to the reviewed English Compare route with clear locale behavior;
- Compare selection keys and exchange slugs remain locale-independent;
- adding `/ja/compare/` requires a separate reviewed scope decision and localization coverage.

## 7. Validation strategy

L-1 validation is layered:

```text
F-1 foundation validation
        +
Japanese Pilot readiness gate
        +
normal CI/public build validation
        +
URL safety
        +
machine/public consistency
        +
accessibility
```

The Japanese readiness gate has two states:

### Pre-activation

Pass only when:

- D-750 completion evidence exists;
- ja remains a supported pilot locale;
- no built Japanese root is exposed before activation;
- route and metadata contract is internally valid.

### Public activation

Pass only when:

- ja is a public locale;
- all contracted static routes exist;
- Japanese dossier count matches reviewed entity count;
- representative pages have correct locale metadata;
- sitemap coverage is complete and query-safe.

## 8. Non-goals

L-1 does not include:

```text
full translation of all 750+ records
translation of evidence titles
translation of publisher names
translation of canonical names by default
Japanese canonical factual forks
third-language work
automatic machine translation into canonical data
stopping reviewed data growth
```

## 9. Completion handoff

After L-1 is public and stable, collect evidence for L-2:

```text
Japanese search impressions and clicks
indexing state
Japanese landing-page distribution
language-switch use
localized navigation depth
Explorer/Stats/Quality usage
exchange dossier transitions
fallback frequency
broken locale links
translation synchronization burden
operator QA burden
CI/localization failure rate
```

L-2 decides GO / HOLD / PIVOT. It does not authorize a third language.
