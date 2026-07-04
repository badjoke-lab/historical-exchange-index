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
Last confirmed main SHA: 6294fa9a6f909df1e374442ad7fe2ef2304097d9
Last merged PR: #526 Complete research and close range 0351-0400
Current phase: Phase C — Reviewed registry growth
Current item: verified-unadded range 0401-0450 scan
Next item: promote add-now parents from range 0401-0450
Cloudflare changes: none
Production deployment: none
```

## Current reviewed state

```text
Entities:  526
Events:    1004
Evidence: 2573
Maximum entity ID:   hei_ex_000642
Maximum event ID:    hei_ev_010080
Maximum evidence ID: hei_src_011264
```

```text
Target entities: 550
Reviewed entities: 526
Remaining additions: 24
Progress: 95.6%
```

## Range 0401-0450 initial scan

```text
Total rows:                    50
add_now:                        8
needs_research:                23
pending_thin:                  12
out_of_scope_or_duplicate:      7
range status:                  open
```

Add-now queue:

```text
CoinCorner
Coinmate
Coins.ph
CoinTR
CoinUp.io
Coinzoom
Comet Swap
Convergence Finance
```

The scan collapses derivative/product rows under parent identities, recognizes CoinEx Market and CoinOne Swap as child surfaces of existing canonical parents, and excludes Physical TCG marketplaces and launchpad-only rows from HEI exchange scope.

## Recently closed range 0351-0400

```text
promoted add_now:               8
promoted research:              8
unresolved add_now:             0
unresolved needs_research:      0
pending_thin:                  19
out_of_scope_or_duplicate:     15
range status:                  closed
```

## Remaining execution order

1. Validate and merge the range 0401-0450 scan PR.
2. Promote the eight add-now parent entities in reviewed batches.
3. Process the twenty-three needs-research rows in evidence-backed clusters.
4. Close range 0401-0450.
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
| Immediate | merge 0401-0450 scan and start add-now promotion | 526 reviewed entities, 8 immediate candidates queued |
| Weeks 1-3 | reviewed growth batches | at least 550 entities |
| Week 3 | milestone audit | Phase C complete |
| Weeks 4-10 | public surfaces through final integration | HEI v1.0 baseline |

GitHub-side work can continue without Cloudflare access.

## Recovery procedure

1. Confirm current main, open PRs, and actual reviewed counts.
2. Run record, duplicate, count, URL, origin, and evidence validation.
3. Resume the first incomplete item above.
4. Update this checkpoint whenever counts or execution order change.
