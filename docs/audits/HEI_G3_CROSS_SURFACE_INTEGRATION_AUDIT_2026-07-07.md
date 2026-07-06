# HEI G-3 Cross-surface Integration Audit — 2026-07-07

Status: PASS  
Roadmap item: G-3 Cross-surface Integration Audit  
Specification: `docs/HEI_V1_INTEGRATION_BASELINE_SPEC.md`, Section 6  
Canonical count impact: none

## 1. Scope

The final audit covered:

```text
12 core public surfaces
4 Explorer-link source routes
5 dossier-link source routes
existing E-4 navigation graph
Stats -> Explorer links
Updates -> Explorer links
Incidents -> Explorer links
Monthly -> Explorer links
Dead/Active/Change -> exchange dossier reachability
Explorer source -> exchange dossier reachability
reviewed-public-only link boundary
broken core cross-links
```

Core public surfaces are inherited from:

```text
config/public-navigation-surfaces.json
```

G-3 does not create a competing route graph.

## 2. Machine-readable integration contract

Source:

```text
config/cross-surface-integration-contract.json
```

It references:

```text
config/public-navigation-surfaces.json
config/explorer-query-contract.json
config/stats-explorer-deep-link-map.json
```

The contract fixes:

- Explorer-link source routes;
- required Entity/Event query keys;
- required direct/range/compound query coverage;
- dossier-link source routes;
- client-rendered dossier source contracts;
- reviewed-public-only Change surfaces.

## 3. Commands and gate

```text
npm run machine:build
npm run build
npm run integration:test
npm run integration:audit
npm run public:validate
```

Dedicated workflow:

```text
.github/workflows/cross-surface-integration-gate.yml
```

The workflow publishes:

```text
cross-surface-integration-audit-report
```

## 4. Stats -> Explorer integration

The existing Stats deep-link component was retained and expanded.

Runtime-safe query builder:

```text
src/lib/explorer/build-explorer-href.ts
```

Stats deep links now cover the Explorer v1 handoff dimensions that are public-filter compatible:

### Direct Entity dimensions

```text
status
type
death_reason
official_url_status
confidence
country_or_origin
```

### Entity ranges

```text
launch_from + launch_to
death_from + death_to
```

Year links serialize full inclusive ISO boundaries:

```text
YYYY-01-01
YYYY-12-31
```

### Entity compound queries

```text
archive_available + repeated status
country_or_origin + repeated status
country_or_origin + type
```

### Direct Event dimensions

```text
event_type
impact_level
event_status_effect
```

Derived/non-filter dimensions and deferred Evidence Explorer dimensions remain non-links.

## 5. Change-layer integration

### Updates

Validated:

```text
view=events Explorer handoff
added-entity dossier links
updated-entity dossier links
```

### Incidents

Validated:

```text
view=events
event_type filters
multi-event-type incident query
dossier links
```

### Monthly

Validated:

```text
view=events
date_from
date_to
event_type
impact_level
dossier links when reviewed monthly items exist
```

All generated Explorer hrefs in contextual integration surfaces are checked against the fixed query parser/serializer contract.

## 6. Initial audit findings

The first generated-output audit reported 10 findings:

```text
8 explorer_view_not_explicit
2 dossier_link_missing
```

### Cause 1 — global navigation false positives

The audit initially scanned every `/explore/` href on each page. Global header/footer navigation intentionally links to the Explorer base route without query state, but these are not contextual deep links.

Repair:

```text
Explorer deep-link audit scope = page <main> contextual content
                               + Stats Explorer drilldown nav
```

Global base navigation remains covered by the E-4 navigation audit.

### Cause 2 — client-rendered list dossier links

Dead and Active registry result rows are client-rendered. Their dossier links are source contracts and are not guaranteed to appear as normal static anchors in the generated HTML snapshot used by the audit.

Repair:

```text
Dead generated output + source contract
Active generated output + source contract
```

The source contract must contain the canonical `/exchange/${entity.slug}/` dossier route pattern.

These were audit-scope corrections, not weakened integration requirements.

## 7. Final result

Final audit output:

```text
Public navigation audit:
  surfaces:         12
  header routes:   10
  footer routes:    8
  contextual edges: 8
  findings:          0

Cross-surface integration audit:
  core surfaces:          12
  Explorer-link sources:   4
  dossier-link sources:    5
  findings:                0
```

Final result:

```text
PASS
```

## 8. Completion gate

```text
unintended orphan core surfaces: 0       PASS
required contextual edges:       pass    PASS
Explorer query-link contract:     pass    PASS
broken core cross-links:          0       PASS
reviewed-public link boundary:    pass    PASS
self-test:                        pass    PASS
```

G-3 is complete when the PR containing this report passes its final full GitHub workflow set and merges to `main`.

Next roadmap item after merge:

```text
G-4 Machine-readable and Public-output Consistency Audit
```
