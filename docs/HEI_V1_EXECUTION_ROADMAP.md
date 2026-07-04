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
Last confirmed main SHA: 6c06f81e753fae04de51a26833f1072826f6e9e8
Last merged PR: #514 Process research cluster 03 from range 0251-0300
Current phase: Phase C — Reviewed registry growth
Current item: bopAMM / Brexily / BrownFi / BTCEX research cluster
Next item: BTCMEX / BTCsquare / BtcTrade.im / Buenbit / BurrBear / BW research cluster
Cloudflare changes: none
Production deployment: none
```

## Projected state after current cluster

```text
Entities:  490
Events:    1003
Evidence: 2501
Maximum entity ID:   hei_ex_000606
Maximum event ID:    hei_ev_010079
Maximum evidence ID: hei_src_011192
```

These values become authoritative only after CI passes and the pull request merges.

```text
Target entities: 550
Projected entities: 490
Remaining additions: 60
Progress: 89.1%
```

## Range 0251-0300

```text
Total rows:                    50
promoted add_now:               5
promoted research:              2
existing duplicate consumed:    3
unresolved add_now:             0
unresolved needs_research:     10
pending_thin:                  20
out_of_scope_or_duplicate:     10
range status:                  open
```

Current cluster:

```text
bopAMM   parent Bebop identity review remains open
Brexily  pending_thin
BrownFi  hei_ex_000606; active
BTCEX    pending_thin
```

Open identity reviews:

```text
Bebop           parent protocol review for bopAMM
BMX by Morphex  parent protocol review
BTSE            parent exchange review
Bybit           global/regional identity review
```

## Remaining execution order

1. Validate and merge research cluster 04.
2. Process BTCMEX, BTCsquare, BtcTrade.im, Buenbit, BurrBear, and BW.
3. Complete Bebop, BMX, BTSE, and Bybit parent/global identity reviews.
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
| Immediate | merge research cluster 04 and start next cluster | 490 reviewed entities |
| Weeks 1-3 | reviewed growth batches | at least 550 entities |
| Week 3 | milestone audit | Phase C complete |
| Weeks 4-10 | public surfaces through final integration | HEI v1.0 baseline |

GitHub-side work can continue without Cloudflare access.

## Recovery procedure

1. Confirm current main, open PRs, and actual reviewed counts.
2. Run record, duplicate, count, URL, origin, and evidence validation.
3. Resume the first incomplete item above.
4. Update this checkpoint whenever counts or execution order change.
