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
Last confirmed main SHA: 8d5573e1d5f67595eb125d1f46418b059827d1a6
Last merged PR: #511 Promote BTC-Alpha and BXH from range 0251-0300
Current phase: Phase C — Reviewed registry growth
Current item: range 0251-0300 active CEX batch
Next item: BTSE Futures / Bybit EU identity-boundary review
Cloudflare changes: none
Production deployment: none
```

## Projected state after current batch

```text
Entities:  488
Events:    1003
Evidence: 2497
Maximum entity ID:   hei_ex_000604
Maximum event ID:    hei_ev_010079
Maximum evidence ID: hei_src_011188
```

```text
Target entities: 550
Projected entities: 488
Remaining additions: 62
Progress: 88.7%
```

## Range 0251-0300

```text
Total rows:                    50
promoted add_now:               5
existing duplicate consumed:    3
unresolved add_now:             0
needs_research:                16
pending_thin:                  16
out_of_scope_or_duplicate:     10
range status:                  open
```

Current batch:

```text
Blocktrade   hei_ex_000601
BTCBOX       hei_ex_000602
BTC Markets  existing hei_ex_000039
Buda         existing hei_ex_000054
BuyUcoin     hei_ex_000604
```

## Remaining execution order

1. Validate and merge range 0251 active CEX batch.
2. Resolve BTSE Futures and Bybit EU identity boundaries.
3. Process remaining research rows in evidence-backed batches.
4. Close range 0251-0300.
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
| Immediate | merge active CEX batch and start boundary review | 488 reviewed entities |
| Weeks 1-3 | reviewed growth batches | at least 550 entities |
| Week 3 | milestone audit | Phase C complete |
| Weeks 4-10 | public surfaces through final integration | HEI v1.0 baseline |

GitHub-side work can continue without Cloudflare access.

## Recovery procedure

1. Confirm current main, open PRs, and actual reviewed counts.
2. Run record, duplicate, count, URL, origin, and evidence validation.
3. Resume the first incomplete item above.
4. Update this checkpoint whenever counts or execution order change.
