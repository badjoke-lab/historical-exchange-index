# HEI G-4 Machine/Public Consistency Audit — 2026-07-07

Status: PASS  
Roadmap item: G-4 Machine-readable and Public-output Consistency Audit  
Specification: `docs/HEI_V1_INTEGRATION_BASELINE_SPEC.md`, Section 7  
Canonical count impact: none

## 1. Scope

The final audit covered:

```text
HTML count surfaces
sitemap.xml
robots.txt
version.json
data/manifest.json
data/entities.json
data/events.json
data/evidence.json
feeds/updates.json
feeds/updates.xml
llms.txt
ai.txt
```

The audit is a cross-output consistency layer. It does not replace existing public-output, machine-readable, feed-export, sitemap/canonical, or count validators.

## 2. Machine-readable contract

Source:

```text
config/machine-public-consistency-contract.json
```

The contract fixes:

- required public route discovery set;
- required machine-readable file set;
- sitemap static-route expectations;
- Explorer base-route sitemap behavior;
- robots allow/sitemap contract;
- generated timestamp consistency expectations;
- reviewed-state timestamp consistency expectations;
- manifest public-safety state;
- forbidden public machine/feed markers;
- comparable HTML count surfaces;
- reviewed Registry Update source.

## 3. Commands and gate

```text
npm run machine:build
npm run build
npm run consistency:test
npm run consistency:audit
npm run public:validate
```

Dedicated workflow:

```text
.github/workflows/machine-public-consistency-gate.yml
```

The workflow publishes:

```text
machine-public-consistency-audit-report
```

## 4. Finding categories

The G-4 audit classifies findings into six categories:

```text
count_mismatch
route_discovery_mismatch
public_safety_boundary_leak
feed_contract
timestamp_mismatch
sitemap_robots
```

This allows Phase G completion to distinguish factual count drift from route-discovery drift, public-safety leaks, feed defects, timestamp divergence, and crawl-contract defects.

## 5. Cross-output checks

### Count consistency

Validated agreement among:

```text
version.json record_counts
manifest.json record_counts
public entities record_count and records.length
public events record_count and records.length
public evidence record_count and records.length
version/manifest active-side and dead-side breakdowns
Home HTML count labels
Stats HTML count labels
Quality HTML count labels
llms.txt count state
ai.txt count state
```

### Route discovery

Validated one route contract across:

```text
version.routes
manifest.main_routes
llms.txt
ai.txt
```

The required route set includes:

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

### Timestamp consistency

Validated equality of:

```text
version.build.generated_at
version.data.generated_at
manifest.generated_at
entities.generated_at
events.generated_at
evidence.generated_at
```

and reviewed-state agreement across:

```text
version.data.records_last_reviewed_at
manifest.records_last_reviewed_at
entities.records_last_reviewed_at
events.records_last_reviewed_at
evidence.records_last_reviewed_at
```

### Public safety boundary

Validated exact manifest state:

```text
canonical_only: true
includes_unreviewed_candidates: false
includes_internal_monitoring: false
includes_private_notes: false
```

Public machine-readable collections and feeds were checked for forbidden staging/internal markers.

### Reviewed update feeds

Validated:

- JSON Feed item IDs/order against reviewed Registry Updates;
- RSS GUID IDs/order against reviewed Registry Updates;
- JSON Feed reviewed-public-only marker;
- item URL and publication-date consistency.

### Sitemap and robots

Reused the existing exact sitemap/canonical audit and additionally checked:

```text
static sitemap routes: 12
Explorer base route in sitemap: exactly once
query variants in sitemap: none
robots user-agent: *
robots allow: /
robots sitemap: https://hei.badjoke-lab.com/sitemap.xml
```

## 6. Final result

Final audit output:

```text
Entities:          550
Events:            1004
Evidence:          2621
Reviewed updates:  2
Sitemap URLs:      562
```

Category results:

```text
count_mismatch:                 0
route_discovery_mismatch:       0
public_safety_boundary_leak:    0
feed_contract:                  0
timestamp_mismatch:             0
sitemap_robots:                 0
```

Final result:

```text
PASS
```

## 7. Completion gate

```text
critical consistency findings:       0  PASS
count mismatch findings:             0  PASS
route-discovery mismatch findings:   0  PASS
public safety-boundary leaks:        0  PASS
feed contract findings:              0  PASS
sitemap/robots findings:             0  PASS
timestamp mismatch findings:         0  PASS
self-test:                         pass  PASS
```

G-4 is complete when the PR containing this report passes its final full GitHub workflow set and merges to `main`.

Next roadmap item after merge:

```text
G-5 Production Integration and Verification
```
