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
Last confirmed main SHA: 540eca471472b3737212c52dcd508d0e519a738e
Last merged PR: #527 Scan verified-unadded range 0401-0450
Current phase: Phase C — Reviewed registry growth
Current item: promote add-now parents from range 0401-0450
Next item: process needs-research rows from range 0401-0450
Cloudflare changes: none
Production deployment: none
```

## Projected state after current add-now batch

```text
Entities:  533
Events:    1004
Evidence: 2587
Maximum entity ID:   hei_ex_000649
Maximum event ID:    hei_ev_010080
Maximum evidence ID: hei_src_011278
```

These values become authoritative only after CI passes and the pull request merges.

```text
Target entities: 550
Projected entities: 533
Remaining additions: 17
Progress: 96.9%
```

## Range 0401-0450

```text
Total rows:                    50
promoted add_now:               7
promoted research:              0
existing duplicate consumed:    1
unresolved add_now:             0
unresolved needs_research:     23
pending_thin:                  12
out_of_scope_or_duplicate:      7
range status:                  open
```

Promoted add-now parents:

```text
CoinCorner          hei_ex_000643
Coinmate            hei_ex_000644
CoinTR              hei_ex_000645
CoinUp.io           hei_ex_000646
CoinZoom            hei_ex_000647
Comet Swap          hei_ex_000648
Convergence Finance hei_ex_000649
```

Existing duplicate consumed:

```text
Coins.ph            existing hei_ex_000043
```

## Remaining execution order

1. Validate and merge the add-now promotion batch.
2. Process the twenty-three needs-research rows in evidence-backed clusters.
3. Close range 0401-0450.
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
| Immediate | merge add-now batch and start research clusters | 533 reviewed entities |
| Weeks 1-3 | reviewed growth batches | at least 550 entities |
| Week 3 | milestone audit | Phase C complete |
| Weeks 4-10 | public surfaces through final integration | HEI v1.0 baseline |

GitHub-side work can continue without Cloudflare access.

## Recovery procedure

1. Confirm current main, open PRs, and actual reviewed counts.
2. Run record, duplicate, count, URL, origin, and evidence validation.
3. Resume the first incomplete item above.
4. Update this checkpoint whenever counts or execution order change.
