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
Last confirmed main SHA: e8d4f92d307f68ff0aa80d5ce154b366ed461ddc
Last merged PR: #523 Scan verified-unadded range 0351-0400
Current phase: Phase C — Reviewed registry growth
Current item: promote add-now parents from range 0351-0400
Next item: process needs-research rows from range 0351-0400
Cloudflare changes: none
Production deployment: none
```

## Projected state after current add-now batch

```text
Entities:  518
Events:    1004
Evidence: 2557
Maximum entity ID:   hei_ex_000634
Maximum event ID:    hei_ev_010080
Maximum evidence ID: hei_src_011248
```

These values become authoritative only after CI passes and the pull request merges.

```text
Target entities: 550
Projected entities: 518
Remaining additions: 32
Progress: 94.2%
```

## Range 0351-0400

```text
Total rows:                    50
promoted add_now:               8
promoted research:              0
unresolved add_now:             0
unresolved needs_research:     17
pending_thin:                  11
out_of_scope_or_duplicate:     14
range status:                  open
```

Promoted add-now parents:

```text
ChainEX       hei_ex_000627
Chainflip     hei_ex_000628
Changelly PRO hei_ex_000629
Choice        hei_ex_000630
Chronos       hei_ex_000631
ClaimSwap     hei_ex_000632
Clipper       hei_ex_000633
CobaltX       hei_ex_000634
```

## Remaining execution order

1. Validate and merge the add-now promotion batch.
2. Process the seventeen needs-research rows in evidence-backed clusters.
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
| Immediate | merge add-now batch and start research clusters | 518 reviewed entities |
| Weeks 1-3 | reviewed growth batches | at least 550 entities |
| Week 3 | milestone audit | Phase C complete |
| Weeks 4-10 | public surfaces through final integration | HEI v1.0 baseline |

GitHub-side work can continue without Cloudflare access.

## Recovery procedure

1. Confirm current main, open PRs, and actual reviewed counts.
2. Run record, duplicate, count, URL, origin, and evidence validation.
3. Resume the first incomplete item above.
4. Update this checkpoint whenever counts or execution order change.
