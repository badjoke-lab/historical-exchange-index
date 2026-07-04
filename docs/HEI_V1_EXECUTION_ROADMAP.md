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
Last confirmed main SHA: 58ed3d30b26f50c267ae08060817b1a2e6c7a0a9
Last merged PR: #513 Review BTSE Futures and Bybit EU boundary rows
Current phase: Phase C — Reviewed registry growth
Current item: Blocktane / Blue Planet / BMEX / BMX Classic AMM research cluster
Next item: bopAMM / Brexily / BrownFi / BTCEX research cluster
Cloudflare changes: none
Production deployment: none
```

## Projected state after current cluster

```text
Entities:  489
Events:    1003
Evidence: 2499
Maximum entity ID:   hei_ex_000605
Maximum event ID:    hei_ev_010079
Maximum evidence ID: hei_src_011190
```

These values become authoritative only after CI passes and the pull request merges.

```text
Target entities: 550
Projected entities: 489
Remaining additions: 61
Progress: 88.9%
```

## Range 0251-0300

```text
Total rows:                    50
promoted add_now:               5
promoted research:              1
existing duplicate consumed:    3
unresolved add_now:             0
unresolved needs_research:     13
pending_thin:                  18
out_of_scope_or_duplicate:     10
range status:                  open
```

Current cluster:

```text
Blocktane       pending_thin
Blue Planet     hei_ex_000605; active
BMEX            pending_thin
BMX Classic AMM parent BMX by Morphex identity review remains open
```

Open identity reviews:

```text
BMX by Morphex  parent protocol review
BTSE            parent exchange review
Bybit           global/regional identity review
```

## Remaining execution order

1. Validate and merge research cluster 03.
2. Process bopAMM, Brexily, BrownFi, and BTCEX.
3. Process BTCMEX, BTCsquare, BtcTrade.im, Buenbit, BurrBear, and BW.
4. Complete BMX, BTSE, and Bybit parent/global identity reviews.
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
| Immediate | merge research cluster 03 and start next cluster | 489 reviewed entities |
| Weeks 1-3 | reviewed growth batches | at least 550 entities |
| Week 3 | milestone audit | Phase C complete |
| Weeks 4-10 | public surfaces through final integration | HEI v1.0 baseline |

GitHub-side work can continue without Cloudflare access.

## Recovery procedure

1. Confirm current main, open PRs, and actual reviewed counts.
2. Run record, duplicate, count, URL, origin, and evidence validation.
3. Resume the first incomplete item above.
4. Update this checkpoint whenever counts or execution order change.
