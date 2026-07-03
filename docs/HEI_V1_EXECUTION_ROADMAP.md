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
- Do not bypass frozen lineage reviews when adding later records.
- Treat maximum IDs as allocation markers, not record counts.
- Confirm the full diff and all required checks before merge.

## Current checkpoint

```text
Last confirmed main SHA: a2a1e7c9623ab89d1bb3dd82c58b5e5f9b788f2c
Last merged PR: #506 Resolve BitGlobal and Bithumb Singapore identity cluster
Current phase: Phase C — Reviewed registry growth
Current item: BitFlip / BITKER / Bitnaru research cluster
Next item: Bitonic scope review against BL3P
Cloudflare changes: none
Production deployment: none
```

## Projected state after the current cluster

```text
Entities:  479
Events:    991
Evidence: 2469
Maximum entity ID:   hei_ex_000594
Maximum event ID:    hei_ev_010066
Maximum evidence ID: hei_src_011158
```

These values become authoritative only after CI passes and the pull request merges.

```text
Target entities: 550
Projected entities: 479
Remaining additions: 71
Progress: 87.1%
```

## Range 0201-0250

```text
Total rows:                    50
Promoted add_now:               7
Resolved needs_research:        4
Remaining needs_research:       9
Pending thin:                  27
Out of scope / duplicate:       3
```

Current cluster:

```text
BitFlip  -> hei_ex_000593
BITKER   -> hei_ex_000594
Bitnaru  -> pending_thin
```

## Remaining execution order

1. Validate and merge the current cluster.
2. Resolve Bitonic scope against BL3P.
3. Review Bits Blockchain, Bitsdaq, and Bittylicious.
4. Review BLEX, Blitz AMM, Blockbid, and Blockchain.io.
5. Resolve Bithesap or move it to pending-thin.
6. Close range 0201-0250.
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

### Phase D — Public-value surfaces

- Registry Update / Changelog
- Exchange Incident Timeline
- safe Evidence Health aggregates
- Monthly Exchange Failure Snapshot
- RSS and JSON feeds

### Phase E — Stats, links, and SEO

- stats generator and schemas
- snapshot, trend, and coverage layers
- search and related-entity links
- metadata, JSON-LD, sitemap, and internal-link validation

### Phase F — English/Japanese publication

English remains at root; Japanese uses `/ja/`. Canonical data stays single-source and translations remain overlays.

### Phase G — Final audit and HEI v1.0

- accessibility and interaction audit
- URL-safety audit
- production integration test
- operations runbook
- v1.0 release baseline

## Schedule

| Period | Work | Result |
|---|---|---|
| Immediate | validate and merge cluster 02 | 479 reviewed entities |
| Weeks 1-3 | remaining research and growth batches | at least 550 entities |
| Week 3 | milestone audit | Phase C complete |
| Weeks 4-5 | public update surfaces | Phase D complete |
| Weeks 5-7 | Stats, links, SEO | Phase E complete |
| Weeks 7-9 | Japanese routes | Phase F complete |
| Weeks 9-10 | final audit and production smoke | HEI v1.0 baseline |

GitHub-side work can continue without Cloudflare access. Cloudflare-only work remains confined to final production integration.

## Recovery procedure

1. Confirm current main, open PRs, and actual reviewed counts.
2. Run record, duplicate, count, URL, origin, and evidence validation.
3. Resume the first incomplete item above.
4. Update this checkpoint whenever counts or execution order change.
