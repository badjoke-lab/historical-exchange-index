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
Last confirmed main SHA: 45556c9f253b3522cb9d69c5200ad820e0fc458a
Last merged PR: #518 Review candidate range 0301-0350
Current phase: Phase C — Reviewed registry growth
Current item: promote add-now parents from range 0301-0350
Next item: process needs-research rows from range 0301-0350
Cloudflare changes: none
Production deployment: none
```

## Projected state after current add-now batch

```text
Entities:  499
Events:    1004
Evidence: 2519
Maximum entity ID:   hei_ex_000615
Maximum event ID:    hei_ev_010080
Maximum evidence ID: hei_src_011210
```

These values become authoritative only after CI passes and the pull request merges.

```text
Target entities: 550
Projected entities: 499
Remaining additions: 51
Progress: 90.7%
```

## Range 0301-0350

```text
Total rows:                    50
promoted add_now:               5
promoted research:              0
unresolved add_now:             0
unresolved needs_research:     15
pending_thin:                  10
out_of_scope_or_duplicate:     20
range status:                  open
```

Promoted add-now parents:

```text
Capricorn       hei_ex_000611
Carbon DeFi     hei_ex_000612
Catex           hei_ex_000613
CaviarNine      hei_ex_000614
Cellana Finance hei_ex_000615
```

## Remaining execution order

1. Validate and merge the add-now promotion batch.
2. Process the fifteen needs-research rows in evidence-backed clusters.
3. Close range 0301-0350.
4. Continue reviewed growth until at least 550 entities.
5. Run the Phase C milestone audit.
6. Build public update surfaces, Stats, SEO, Japanese routes, and final integration.

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
| Immediate | merge add-now batch and start research clusters | 499 reviewed entities |
| Weeks 1-3 | reviewed growth batches | at least 550 entities |
| Week 3 | milestone audit | Phase C complete |
| Weeks 4-10 | public surfaces through final integration | HEI v1.0 baseline |

GitHub-side work can continue without Cloudflare access.

## Recovery procedure

1. Confirm current main, open PRs, and actual reviewed counts.
2. Run record, duplicate, count, URL, origin, and evidence validation.
3. Resume the first incomplete item above.
4. Update this checkpoint whenever counts or execution order change.
