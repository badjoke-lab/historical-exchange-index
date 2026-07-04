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
Last confirmed main SHA: a2486a7b01d74d4fb1546a350cc7a68be136c04e
Last merged PR: #524 Add reviewed exchange batch for range 0351-0400
Current phase: Phase C — Reviewed registry growth
Current item: research cluster 01 from range 0351-0400
Next item: continue remaining needs-research rows from range 0351-0400
Cloudflare changes: none
Production deployment: none
```

## Projected state after current research cluster

```text
Entities:  523
Events:    1004
Evidence: 2567
Maximum entity ID:   hei_ex_000639
Maximum event ID:    hei_ev_010080
Maximum evidence ID: hei_src_011258
```

These values become authoritative only after CI passes and the pull request merges.

```text
Target entities: 550
Projected entities: 523
Remaining additions: 27
Progress: 95.1%
```

## Range 0351-0400

```text
Total rows:                    50
promoted add_now:               8
promoted research:              5
unresolved add_now:             0
unresolved needs_research:     11
pending_thin:                  12
out_of_scope_or_duplicate:     14
range status:                  open
```

Current research cluster:

```text
Chainge Finance  hei_ex_000635; limited
ChampagneSwap    hei_ex_000636; active
CherrySwap       hei_ex_000637; inactive
ChimpX AI DEX    hei_ex_000638; active
Clober           hei_ex_000639; active
Clutch Anvil AMM pending_thin
```

## Remaining execution order

1. Validate and merge research cluster 01.
2. Process the remaining eleven needs-research rows in evidence-backed clusters.
3. Close range 0351-0400.
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
| Immediate | merge research cluster 01 and continue range review | 523 reviewed entities |
| Weeks 1-3 | reviewed growth batches | at least 550 entities |
| Week 3 | milestone audit | Phase C complete |
| Weeks 4-10 | public surfaces through final integration | HEI v1.0 baseline |

GitHub-side work can continue without Cloudflare access.

## Recovery procedure

1. Confirm current main, open PRs, and actual reviewed counts.
2. Run record, duplicate, count, URL, origin, and evidence validation.
3. Resume the first incomplete item above.
4. Update this checkpoint whenever counts or execution order change.
