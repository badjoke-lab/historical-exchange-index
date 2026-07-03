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
Last confirmed main SHA: 9f8d417d99fabd0627a6ca49e3506a0c65adf18d
Last merged PR: #509 Close verified-unadded range 0201-0250
Current phase: Phase C — Reviewed registry growth
Current item: verified-unadded range 0251-0300 initial scan
Next item: Braziliex / BTC-Alpha / BXH historical batch
Cloudflare changes: none
Production deployment: none
```

## Current reviewed state

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
Current entities: 483
Remaining additions: 67
Progress: 87.8%
```

## Completed range 0201-0250

```text
Promoted add_now:    7
Promoted research:   8
Pending thin:       30
Excluded:            5
Range status:   closed
```

## Range 0251-0300

```text
Total rows:                    50
add_now:                        8
needs_research:                16
pending_thin:                  16
out_of_scope_or_duplicate:     10
range status:                  open
```

Add-now queue:

```text
Blocktrade
Braziliex
BTC-Alpha
BTCBOX
BTC Markets
Buda
BuyUcoin
BXH
```

First implementation batch:

```text
Braziliex
BTC-Alpha
BXH
```

## Remaining execution order

1. Merge the range 0251-0300 scan.
2. Draft and validate Braziliex, BTC-Alpha, and BXH.
3. Draft the active CEX batch: Blocktrade, BTCBOX, BTC Markets, Buda, and BuyUcoin.
4. Resolve BTSE Futures and Bybit EU identity boundaries.
5. Process remaining research rows in evidence-backed batches.
6. Close range 0251-0300.
7. Continue reviewed growth until at least 550 entities.
8. Run the Phase C milestone audit.
9. Build public update surfaces, Stats, SEO, Japanese routes, and final integration.

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
| Immediate | merge scan and start historical batch | fixed 50-row queue |
| Weeks 1-3 | reviewed growth batches | at least 550 entities |
| Week 3 | milestone audit | Phase C complete |
| Weeks 4-10 | public surfaces through final integration | HEI v1.0 baseline |

GitHub-side work can continue without Cloudflare access.

## Recovery procedure

1. Confirm current main, open PRs, and actual reviewed counts.
2. Run record, duplicate, count, URL, origin, and evidence validation.
3. Resume the first incomplete item above.
4. Update this checkpoint whenever counts or execution order change.
