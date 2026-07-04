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
Last confirmed main SHA: 3834638482e6ccf72555bd91acde784cede89b83
Last merged PR: #525 Process research cluster 01 from range 0351-0400
Current phase: Phase C — Reviewed registry growth
Current item: final research cluster and closure of range 0351-0400
Next item: scan verified-unadded range 0401-0450
Cloudflare changes: none
Production deployment: none
```

## Projected state after current final cluster

```text
Entities:  526
Events:    1004
Evidence: 2573
Maximum entity ID:   hei_ex_000642
Maximum event ID:    hei_ev_010080
Maximum evidence ID: hei_src_011264
```

These values become authoritative only after CI passes and the pull request merges.

```text
Target entities: 550
Projected entities: 526
Remaining additions: 24
Progress: 95.6%
```

## Range 0351-0400

```text
Total rows:                    50
promoted add_now:               8
promoted research:              8
unresolved add_now:             0
unresolved needs_research:      0
pending_thin:                  19
out_of_scope_or_duplicate:     15
range status:                  closed
```

Final research cluster:

```text
Chaince        pending_thin
ChileBit       pending_thin
Chiliz         out_of_scope_or_duplicate
CITEX          hei_ex_000640; inactive
Cleopatra      hei_ex_000641; inactive
CODEX          pending_thin
CODEX Exchange pending_thin
Coinbe         pending_thin
Coinbit        pending_thin
CoinCasso      hei_ex_000642; inactive
CoinCex        pending_thin
```

## Remaining execution order

1. Validate and merge the final research and range-close PR.
2. Scan verified-unadded range 0401-0450.
3. Process add-now and research batches from that range.
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
| Immediate | merge final range-close PR and start 0401-0450 scan | 526 reviewed entities |
| Weeks 1-3 | reviewed growth batches | at least 550 entities |
| Week 3 | milestone audit | Phase C complete |
| Weeks 4-10 | public surfaces through final integration | HEI v1.0 baseline |

GitHub-side work can continue without Cloudflare access.

## Recovery procedure

1. Confirm current main, open PRs, and actual reviewed counts.
2. Run record, duplicate, count, URL, origin, and evidence validation.
3. Resume the first incomplete item above.
4. Update this checkpoint whenever counts or execution order change.
