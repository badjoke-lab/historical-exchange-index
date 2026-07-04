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
Last confirmed main SHA: 1fa444f8b5eb12a86bc9a7da9c87df38851d9fba
Last merged PR: #512 Promote active CEX batch from range 0251-0300
Current phase: Phase C — Reviewed registry growth
Current item: BTSE Futures / Bybit EU identity-boundary review
Next item: Blocktane / Blue Planet / BMEX / BMX Classic AMM research cluster
Cloudflare changes: none
Production deployment: none
```

## Current reviewed state

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
Current entities: 488
Remaining additions: 62
Progress: 88.7%
```

## Range 0251-0300

```text
Total rows:                    50
promoted add_now:               5
existing duplicate consumed:    3
boundary rows resolved:         2
unresolved add_now:             0
unresolved needs_research:     14
pending_thin:                  16
out_of_scope_or_deferred:      12
range status:                  open
```

Boundary decisions:

```text
BTSE Futures  product row under BTSE; no standalone entity
Bybit EU      regional Bybit platform; defer to broader Bybit identity review
```

## Remaining execution order

1. Validate and merge the BTSE / Bybit EU boundary review.
2. Process Blocktane, Blue Planet, BMEX, and BMX Classic AMM.
3. Process bopAMM, Brexily, BrownFi, and BTCEX.
4. Process BTCMEX, BTCsquare, BtcTrade.im, Buenbit, BurrBear, and BW.
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
| Immediate | merge boundary review and start next research cluster | 488 reviewed entities |
| Weeks 1-3 | reviewed growth batches | at least 550 entities |
| Week 3 | milestone audit | Phase C complete |
| Weeks 4-10 | public surfaces through final integration | HEI v1.0 baseline |

GitHub-side work can continue without Cloudflare access.

## Recovery procedure

1. Confirm current main, open PRs, and actual reviewed counts.
2. Run record, duplicate, count, URL, origin, and evidence validation.
3. Resume the first incomplete item above.
4. Update this checkpoint whenever counts or execution order change.
