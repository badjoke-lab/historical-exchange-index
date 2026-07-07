# HEI G-7 v1.0 Baseline Checkpoint — 2026-07-07

Status: PASS CANDIDATE — final PR-head workflows required before merge  
Roadmap item: G-7 v1.0 Baseline Checkpoint  
Baseline ID: `hei-v1.0-baseline-2026-07-07`  
Canonical count impact: none

## 1. Baseline identity

Baseline main SHA:

```text
9c1c0e9d7d327c61479a049ea498de7ec893a322
```

Baseline source:

```text
main after G-6 merge and before G-7 checkpoint metadata
```

The G-7 branch is based directly on this SHA.

## 2. Reviewed public state

```text
Entities:             550
Events:               1004
Evidence:             2621
Reviewed update items: 2
```

Counts use reviewed public build aggregation semantics, including reviewed bundles, entity corrections, identity resolution, and event/evidence merge behavior.

## 3. Schema baseline

```text
Machine schema:             1.0.0
Data schema:                hei_entity_event_evidence_v1
Explorer query contract:    1
I18n locale contract:       1
```

## 4. Public route baseline

```text
Static routes:              12
Exchange detail routes:     550
Sitemap URLs:               562
Explorer query variants:    excluded from sitemap
Explorer query canonical:   /explore/
```

Baseline route templates:

```text
/
/dead/
/active/
/exchange/{slug}/
/explore/
/stats/
/quality/
/updates/
/incidents/
/monthly/
/methodology/
/about/
/donate/
```

## 5. Machine-readable file baseline

```text
/version.json
/data/manifest.json
/data/entities.json
/data/events.json
/data/evidence.json
/feeds/updates.json
/feeds/updates.xml
/llms.txt
/ai.txt
```

Production verification additionally checked:

```text
/sitemap.xml
/robots.txt
```

## 6. Localization foundation baseline

```text
default locale: en
fallback locale: en
supported locales: en, ja
public locales at v1 baseline: en
pilot locale: ja
full Japanese public rollout in v1: false
canonical facts single-source: true
localized record copy overlay-only: true
```

Post-v1 release gates:

```text
Japanese public pilot minimum: 750 reviewed entities
Language Selection Gate minimum: 1000 reviewed entities
third language preselected: no
maximum new language pilots at once: 1
```

Authority:

```text
docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
```

## 7. Monitoring and operations separation

Baseline safety contract:

```text
raw monitoring public: false
unreviewed candidates public: false
monitoring may directly change reviewed canonical state: false
public surfaces reviewed only: true
```

Monitoring, staging, and reviewed public data remain separate.

## 8. Production baseline verification

Checked at:

```text
2026-07-07T11:22:22.933Z
```

Expected commit:

```text
9c1c0e9d7d327c61479a049ea498de7ec893a322
```

Deployed commit:

```text
9c1c0e9d7d327c61479a049ea498de7ec893a322
```

Final state:

```text
Expected commit:          9c1c0e9d7d327c61479a049ea498de7ec893a322
Deployed commit:          9c1c0e9d7d327c61479a049ea498de7ec893a322
Commit propagation:       MATCH
Machine layer:            PASS
Core routes:              12 / 12 PASS
Explorer queries:          2 / 2 PASS
Representative deep links: 3 / 3 PASS
Machine files:            11 / 11 PASS
Sitemap URLs:             562 PASS
Robots contract:          PASS
Representative dossier:   /exchange/mt-gox/ PASS
Overall result:           PASS
```

## 9. G-7 baseline validator result

Initial G-7 baseline validator output:

```text
Baseline SHA: 9c1c0e9d7d327c61479a049ea498de7ec893a322
Reviewed counts: 550 / 1004 / 2621
Routes: 13 templates
Sitemap URLs: 562
Machine files: 9
Deferred items: 6
```

Finding categories:

```text
baseline_identity:             0
count_mismatch:                0
schema_mismatch:               0
route_contract_mismatch:       0
machine_file_contract:         0
explorer_contract_mismatch:    0
localization_mismatch:         0
safety_boundary_mismatch:      0
phase_g_completion:            0
production_baseline_mismatch:  0
deferred_contract_mismatch:    0
priority_order_mismatch:       0
roadmap_mismatch:              0
```

Result:

```text
PASS
```

## 10. Post-v1 priority sequence

The fixed priority sequence after G-7 is:

```text
Phase H — Compare v1
        ↓
D-750 Reviewed Entity Milestone
        ↓
L-1 Japanese Pilot
        ↓
L-2 Localization Evaluation Gate
        ↓
D-1000 Reviewed Entity Milestone
        ↓
Language Selection Gate
        ↓
Phase I — Discovery Log Trial
```

Data growth continues in parallel, but release gates remain fixed.

## 11. Known deferred items

```text
Compare v1
Japanese public pilot
additional languages
Discovery Log trial
NL Filter Translator
API expansion
```

Milestone gates are not optional deferred features; they are execution-order constraints governing the deferred work.

## 12. Phase G completion evidence

```text
G-1 Accessibility Audit: PASS
G-2 URL Safety Audit: PASS
G-3 Cross-surface Integration Audit: PASS
G-4 Machine/Public Consistency Audit: PASS
G-5 Production Integration and Verification: PASS
G-6 Maintainer Recovery Validation: PASS
G-7 Baseline contract/validator: PASS candidate
```

Persistent reports:

```text
docs/audits/HEI_G1_ACCESSIBILITY_AUDIT_2026-07-06.md
docs/audits/HEI_G2_URL_SAFETY_AUDIT_2026-07-06.md
docs/audits/HEI_G3_CROSS_SURFACE_INTEGRATION_AUDIT_2026-07-07.md
docs/audits/HEI_G4_MACHINE_PUBLIC_CONSISTENCY_AUDIT_2026-07-07.md
docs/audits/HEI_G5_PRODUCTION_VERIFICATION_2026-07-07.md
docs/audits/HEI_G6_MAINTAINER_RECOVERY_VALIDATION_2026-07-07.md
```

## 13. Completion gate

```text
baseline contract:                     PASS
baseline self-test:                    PASS
baseline validation:                   PASS
production expected/deployed commit:   MATCH
reviewed count baseline:               PASS
schema baseline:                       PASS
route/sitemap baseline:                PASS
machine-readable contract:             PASS
localization foundation state:         PASS
750/1000 gate record:                  PASS
monitoring/operations separation:      PASS
post-v1 priority sequence:             PASS
recovery authority update:             pending final rerun
final PR-head workflow set:             pending
```

G-7 becomes complete only after the updated report/recovery authority passes final workflows and PR #558 merges.

After merge:

```text
Phase G — v1.0 Integration Baseline: COMPLETE
Next active item: Phase H — Compare v1
```
