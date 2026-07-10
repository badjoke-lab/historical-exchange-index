# HEI L-1 Japanese Pilot Route Activation Completion Checkpoint

Date: 2026-07-10  
Status: PASS  
Project: Historical Exchange Index (HEI)

## 1. Conclusion

The L1-4 Japanese Pilot route shell, metadata, sitemap, and activation item is complete.

The controlled Japanese public route family is active while canonical reviewed facts remain single-source.

Public Japanese route scope:

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

The next implementation item is:

```text
L1-5 — Controlled optional record-copy sample
```

This checkpoint does not authorize automatic translation of canonical data, a third language, or a full-registry copy translation pass.

## 2. Activation identity

Activation PR:

```text
#647  Activate L-1 Japanese Pilot route shell
```

Validated activation head:

```text
ca54ae4e62a5ead7b8b019dfea3a7c0135c50b78
```

Merged main commit:

```text
47a762c3f586570003d12ca636a78a5fcdd52532
```

The merge commit is one commit ahead of the validated activation head and has no file-level differences from that validated head.

## 3. Reviewed public state

Count-semantics evidence reported:

```text
Entities: 750
Events:   1004
Evidence: 3219
```

Reviewed bundle state:

```text
Reviewed bundles: 606
New entity bundles: 444
Repair bundles: 162
```

ID collision audit:

```text
Event conflicts:    0
Evidence conflicts: 0
Total conflicts:    0
Status:              pass
```

## 4. Bilingual route evidence

Built output counts:

```text
English exchange detail pages:  750
Japanese exchange detail pages: 750
English sitemap entity routes:  750
Japanese sitemap entity routes: 750
Total sitemap routes:           1524
```

Static sitemap composition:

```text
English static routes:  13
Japanese static routes: 11
English dossiers:       750
Japanese dossiers:      750
Total:                  1524
```

The Japanese route family is generated from the same reviewed entity set as English output.

## 5. Locale contract

The active locale contract is:

```text
supported: en, ja
public:    en, ja
pilot:     ja
default:   en
fallback:  en
```

The Japanese public pilot uses path-based routing:

```text
English: /
Japanese: /ja/
```

Entity slugs remain locale-independent.

## 6. Metadata and document-language validation

The Japanese Pilot readiness gate passed the following activation checks:

```text
Japanese route source contract
static HTML postprocessor self-test
public build
L1 i18n foundation validation
route-family completeness
reviewed entity threshold >= 750
Japanese dossier count == reviewed entity count
html lang=ja
Japanese canonical URLs
en/ja alternate-language metadata
og:locale=ja_JP
Japanese sitemap static routes
Japanese sitemap dossier routes
no query variants in sitemap
```

The static HTML localization step is deterministic, build-time only, and limited to:

```text
out/ja/**
```

It does not alter canonical JSON or English output.

## 7. Canonical data boundary

The following remain the single canonical reviewed data source:

```text
data/entities.json
data/events.json
data/evidence.json
```

Japanese output does not fork:

```text
entity identity
slug
status
death_reason
official URL history
archive URLs
event identity
evidence identity
reviewed counts
machine-readable canonical collections
```

Optional localized copy remains presentation-only overlay data.

Missing localized copy falls back to canonical English presentation copy.

## 8. URL safety preservation

Japanese dossiers preserve HEI URL safety rules.

Original URLs are promoted as clickable live actions only for:

```text
live_verified
live_unverified
```

Historical, dead, repurposed, unsafe, redirected, or unresolved original URLs are not promoted as ordinary live-site actions by the Japanese dossier shell.

Archive access remains the preferred action for dead-side records when available.

## 9. Final validation cycle

The validated activation head passed all 24 pull-request workflow runs.

Successful workflow groups included:

```text
Records validation
Verified-unadded scan integrity
Watchlist resolution
Candidate scan
Backlog dedupe
DEX readiness
active CEX audit and queue
country/origin strict gate
lineage audit
entity quality audit
I18n foundation gate
Japanese Pilot readiness gate
Accessibility gate
Metadata diagnostics
v1 baseline checkpoint gate
Maintainer recovery gate
Machine/public consistency gate
Cross-surface integration gate
Compare v1 gate
URL safety gate
CI
Count semantics regression
```

Overall activation result:

```text
PASS
```

## 10. Roadmap transition

Current state:

```text
D-750 Reviewed Entity Milestone                 COMPLETE
L1-1 Activation contract and gate               COMPLETE
L1-2 Shared localized site chrome               COMPLETE
L1-3 Locale-aware presentation foundation       COMPLETE
L1-3 Renderer connections                       COMPLETE
L1-4 Route shell, metadata, sitemap, activation COMPLETE
L1-5 Controlled optional record-copy sample     NEXT
```

L1-5 should add reviewed Japanese copy overlays in small batches.

Priority remains controlled and optional:

```text
selected dead-side entity summaries
selected active-side entity summaries
selected major event titles/descriptions
```

Missing overlays must continue to fall back to canonical English copy.

## 11. Evidence references

```text
docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md
docs/HEI_L1_JAPANESE_PILOT_IMPLEMENTATION_PLAN.md
docs/audits/HEI_D750_MILESTONE_COMPLETION_2026-07-10.md
config/i18n-locales.json
config/japanese-pilot-route-contract.json
scripts/validate-japanese-pilot-readiness.mjs
scripts/check-count-semantics-regression.mjs
scripts/audit-sitemap-canonical-routes.mjs
PR #647
Count semantics workflow run 29107435371
Japanese Pilot readiness workflow run 29107435294
Count semantics artifact 8233501814
```
