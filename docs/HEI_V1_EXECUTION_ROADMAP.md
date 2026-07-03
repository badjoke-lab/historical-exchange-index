# HEI v1 Execution Roadmap

Status: active execution source of truth  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-07-04  
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
Last confirmed main SHA: 10daf033d186602c9843fce930a4f8942b47b542
Last merged PR: #508
Current phase: Phase C — Reviewed registry growth
Current item: final cluster for range 0201-0250
Next item: scan verified-unadded rows 0251-0300
Cloudflare changes: none
Production deployment: none
```

## Projected state after current cluster

```text
Entities:  483
Events:    997
Evidence: 2485
Maximum entity ID:   hei_ex_000598
Maximum event ID:    hei_ev_010072
Maximum evidence ID: hei_src_011174
```

```text
Target entities: 550
Projected entities: 483
Remaining additions: 67
Progress: 87.8%
```

## Range 0201-0250

```text
Total rows:             50
Promoted add_now:        7
Promoted research:       8
Pending thin:           30
Excluded:                5
Unresolved research:     0
Range status:       closed
```

Final cluster:

```text
Bithesap        pending_thin
BLEX            pending_thin
Blitz Exchange  hei_ex_000596; inactive
Blockbid        hei_ex_000597; inactive
Blockchain.io   hei_ex_000598; inactive
```

## Remaining execution order

1. Validate and merge final cluster 04.
2. Scan verified-unadded rows 0251-0300.
3. Promote public-quality records from that range.
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
| Immediate | merge final range cluster | 483 reviewed entities |
| Weeks 1-3 | next ranges and growth batches | at least 550 entities |
| Week 3 | milestone audit | Phase C complete |
| Weeks 4-10 | public surfaces through final integration | HEI v1.0 baseline |

GitHub-side work can continue without Cloudflare access.

## Recovery procedure

1. Confirm current main, open PRs, and actual reviewed counts.
2. Run record, duplicate, count, URL, origin, and evidence validation.
3. Resume the first incomplete item above.
4. Update this checkpoint whenever counts or execution order change.
