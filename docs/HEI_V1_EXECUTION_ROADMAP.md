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
Last confirmed main SHA: a73c0e50b9c8a25734df95d0b87582691c61d520
Last merged PR: #510 Scan verified-unadded range 0251-0300
Current phase: Phase C — Reviewed registry growth
Current item: range 0251-0300 batch 01
Next item: active CEX batch for Blocktrade / BTCBOX / BTC Markets / Buda / BuyUcoin
Cloudflare changes: none
Production deployment: none
```

## Projected state after current batch

```text
Entities:  485
Events:    1000
Evidence: 2491
Maximum entity ID:   hei_ex_000600
Maximum event ID:    hei_ev_010075
Maximum evidence ID: hei_src_011180
```

```text
Target entities: 550
Projected entities: 485
Remaining additions: 65
Progress: 88.2%
```

## Range 0251-0300

```text
Total rows:                    50
promoted add_now:               2
existing duplicate consumed:    1
unresolved add_now:             5
needs_research:                16
pending_thin:                  16
out_of_scope_or_duplicate:     10
range status:                  open
```

Batch 01:

```text
Braziliex  existing hei_ex_000502
BTC-Alpha  hei_ex_000599
BXH        hei_ex_000600
```

## Remaining execution order

1. Validate and merge range 0251 batch 01.
2. Draft the active CEX batch: Blocktrade, BTCBOX, BTC Markets, Buda, and BuyUcoin.
3. Resolve BTSE Futures and Bybit EU identity boundaries.
4. Process remaining research rows in evidence-backed batches.
5. Close range 0251-0300.
6. Continue reviewed growth until at least 550 entities.
7. Run the Phase C milestone audit.
8. Build public update surfaces, Stats, SEO, Japanese routes, and final integration.

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
| Immediate | merge batch 01 and start active CEX batch | 485 reviewed entities |
| Weeks 1-3 | reviewed growth batches | at least 550 entities |
| Week 3 | milestone audit | Phase C complete |
| Weeks 4-10 | public surfaces through final integration | HEI v1.0 baseline |

GitHub-side work can continue without Cloudflare access.

## Recovery procedure

1. Confirm current main, open PRs, and actual reviewed counts.
2. Run record, duplicate, count, URL, origin, and evidence validation.
3. Resume the first incomplete item above.
4. Update this checkpoint whenever counts or execution order change.
