# HEI v1 Execution Roadmap

Status: active execution source of truth  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-07-05  
Target: HEI v1.0 and recurring registry operations

Repository state is authoritative when this checkpoint and GitHub disagree.

## Operating rules

- Canonical changes require reviewed pull requests.
- Automated monitoring must not directly edit canonical data.
- Do not add thin records to satisfy a count target.
- Preserve historical URLs and conservative status decisions.
- Do not bypass frozen lineage reviews.
- Treat maximum IDs as allocation markers, not record counts.
- Confirm the full diff and all required checks before merge.

## Current checkpoint

```text
Last confirmed main SHA: 9705d7e80573da808209185891c17038aedda30e
Last merged PR: #517 Complete final identity reviews and close range 0251-0300
Current phase: Phase C — Reviewed registry growth
Current item: verified-unadded range 0301-0350 scan
Next item: promote add-now parents from range 0301-0350
Cloudflare changes: none
Production deployment: none
```

## Current reviewed state

```text
Entities:  494
Events:    1004
Evidence: 2509
Maximum entity ID:   hei_ex_000610
Maximum event ID:    hei_ev_010080
Maximum evidence ID: hei_src_011200
```

```text
Target entities: 550
Reviewed entities: 494
Remaining additions: 56
Progress: 89.8%
```

## Range 0301-0350 initial scan

```text
Total rows:                    50
add_now:                        5
needs_research:                15
pending_thin:                  10
out_of_scope_or_duplicate:     20
range status:                  open
```

Add-now queue:

```text
Capricorn
Carbon Defi
Catex
CaviarNine
Cellana Finance
```

The scan collapses network, deployment, version, regional, and product rows under parent entities where appropriate. Existing parent matches include Bybit, BYDFi, Cetus Protocol, and CEX.IO.

## Recently closed range 0251-0300

```text
promoted add_now:               5
promoted research:              6
existing duplicate consumed:    5
unresolved add_now:             0
unresolved needs_research:      0
pending_thin:                  24
out_of_scope_or_duplicate:     10
range status:                  closed
```

## Remaining execution order

1. Validate and merge the range 0301-0350 scan PR.
2. Promote the five add-now parent entities in reviewed batches.
3. Process the fifteen needs-research rows in evidence-backed clusters.
4. Close range 0301-0350.
5. Continue reviewed growth until at least 550 entities.
6. Run the Phase C milestone audit.
7. Build public update surfaces, Stats, SEO, Japanese routes, and final integration.

## Phase C completion gate

```text
reviewed entities >= 550
no thin count-filler records
all required CI checks green
public, monitoring, machine, and built counts agree
duplicate, archive, confidence, origin, and evidence-depth audits pass
```

## Later phases

- Phase D: Registry Update, incident timeline, evidence health, monthly snapshot, feeds.
- Phase E: Stats, internal links, SEO, metadata, sitemap.
- Phase F: English root and Japanese `/ja/` routes with translation overlays.
- Phase G: accessibility, URL safety, production integration, runbook, v1.0 baseline.

## Schedule

| Period | Work | Result |
|---|---|---|
| Immediate | merge range 0301-0350 scan and start add-now promotion | 494 reviewed entities, 5 immediate candidates queued |
| Weeks 1-3 | reviewed growth batches | at least 550 entities |
| Week 3 | milestone audit | Phase C complete |
| Weeks 4-10 | public surfaces through final integration | HEI v1.0 baseline |

GitHub-side work can continue without Cloudflare access.

## Recovery procedure

1. Confirm current main, open PRs, and actual reviewed counts.
2. Run record, duplicate, count, URL, origin, and evidence validation.
3. Resume the first incomplete item above.
4. Update this checkpoint whenever counts or execution order change.
