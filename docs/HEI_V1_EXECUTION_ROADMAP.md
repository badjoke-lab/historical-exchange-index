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
Last confirmed main SHA: a9d5d2d018abca2adabca7026595b0970bbf7060
Last merged PR: #516 Process research cluster 05 from range 0251-0300
Current phase: Phase C — Reviewed registry growth
Current item: Bebop / BMX Trade / BTSE / Bybit identity reviews and range closure
Next item: scan verified-unadded range 0301-0350
Cloudflare changes: none
Production deployment: none
```

## Projected state after current review

```text
Entities:  494
Events:    1004
Evidence: 2509
Maximum entity ID:   hei_ex_000610
Maximum event ID:    hei_ev_010080
Maximum evidence ID: hei_src_011200
```

These values become authoritative only after CI passes and the pull request merges.

```text
Target entities: 550
Projected entities: 494
Remaining additions: 56
Progress: 89.8%
```

## Range 0251-0300

```text
Total rows:                    50
promoted add_now:               5
promoted research:              6
existing duplicate consumed:    5
unresolved add_now:             0
unresolved needs_research:      0
pending_thin:                  24
out_of_scope_or_duplicate:     10
range status:                  closed
```

Current review results:

```text
bopAMM           parent Bebop added as hei_ex_000609
BMX product row  parent BMX Trade added as hei_ex_000610
BTSE Futures     consumed under existing hei_ex_000052
Bybit EU         consumed under existing hei_ex_000011
```

## Remaining execution order

1. Validate and merge the final identity-review and range-close PR.
2. Scan verified-unadded range 0301-0350.
3. Process add-now and evidence-backed research batches from that range.
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
| Immediate | merge final identity reviews and start range 0301-0350 scan | 494 reviewed entities |
| Weeks 1-3 | reviewed growth batches | at least 550 entities |
| Week 3 | milestone audit | Phase C complete |
| Weeks 4-10 | public surfaces through final integration | HEI v1.0 baseline |

GitHub-side work can continue without Cloudflare access.

## Recovery procedure

1. Confirm current main, open PRs, and actual reviewed counts.
2. Run record, duplicate, count, URL, origin, and evidence validation.
3. Resume the first incomplete item above.
4. Update this checkpoint whenever counts or execution order change.
