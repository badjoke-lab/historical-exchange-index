# HEI v1 Execution Roadmap

Status: active execution source of truth  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-07-03  
Target: HEI v1.0 and recurring registry operations

Repository state is authoritative when this checkpoint and GitHub disagree.

## Operating rules

- Canonical changes require reviewed pull requests.
- Automated monitoring must not directly edit canonical data.
- Do not add thin records to satisfy a count target.
- Preserve historical URLs and use conservative status decisions.
- Reuse existing canonical identities and model validated successor identities explicitly.
- Treat maximum IDs as allocation markers, not record counts.
- Confirm the full diff and all required checks before merge.

## Current checkpoint

```text
Last confirmed main SHA: 5c127cc4f160c849cd0cc1c038a81d8b67f107fd
Last merged PR: #505 Add growth batch 02 for range 0201-0250
Current phase: Phase C — Reviewed registry growth
Current item: BitGlobal / Bithumb Singapore identity cluster
Next item: BitFlip / BITKER / Bitnaru historical terminal-state cluster
Cloudflare changes: none
Production deployment: none
```

## Projected state after the current research cluster

```text
Entities:  477
Events:    987
Evidence: 2461
Maximum entity ID:   hei_ex_000592
Maximum event ID:    hei_ev_010062
Maximum evidence ID: hei_src_011150
```

These values become authoritative only after CI passes and the pull request merges.

```text
Target entities: 550
Projected entities: 477
Remaining additions: 73
Progress: 86.7%
```

## Range 0201-0250

```text
Total rows:                    50
Initial add_now:                7
Promoted add_now:               7
Initial needs_research:        14
Resolved needs_research:        2
Remaining needs_research:      12
Pending thin:                  26
Out of scope / duplicate:       3
```

Promoted add-now records:

```text
Bitex.la
Bitpanda Pro
BL3P
Bitinka
Bitocto
Bitypreco
BitShares DEX
```

Resolved research cluster:

```text
BitGlobal          new hei_ex_000591; inactive; former Bithumb Global
Bithumb Singapore  new hei_ex_000592; dead / unknown; successor to Bitholic
Bitholic repair    hei_ex_000199; dead -> rebranded; successor_id -> hei_ex_000592
```

Identity boundary:

```text
Bithumb Korea      existing canonical entity hei_ex_000021
BitGlobal          separate global exchange and trademark licensee
Bitholic           predecessor brand hei_ex_000199
Bithumb Singapore  successor brand hei_ex_000592
```

Record-overlap CI rejected the initial use of Bitholic as an alias on the new Singapore entity. The final model preserves Bitholic as the terminal predecessor record and links the separately verified Bithumb Singapore successor.

## Remaining execution order

1. Validate and merge the BitGlobal / Bithumb Singapore cluster.
2. Research BitFlip, BITKER, and Bitnaru as a historical terminal-state batch.
3. Resolve Bitonic scope against the already-added BL3P record.
4. Review Bits Blockchain, Bitsdaq, Bittylicious, BLEX, Blitz AMM, Blockbid, and Blockchain.io in small batches.
5. Close range 0201-0250 after every research row is promoted, reclassified as pending-thin, or excluded.
6. Continue reviewed growth until at least 550 entities.
7. Run the Phase C milestone audit.
8. Build public update surfaces, Stats, SEO, Japanese routes, and final v1.0 integration.

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
| Immediate | validate and merge Bithumb identity cluster | 477 reviewed entities |
| Weeks 1-3 | remaining research and growth batches | at least 550 entities |
| Week 3 | milestone audit | Phase C complete |
| Weeks 4-5 | public update surfaces | Phase D complete |
| Weeks 5-7 | Stats, links, SEO | Phase E complete |
| Weeks 7-9 | Japanese primary routes | Phase F complete |
| Weeks 9-10 | final audit, runbook, production smoke | HEI v1.0 baseline |

GitHub-side work can continue without Cloudflare access. Cloudflare-only work remains confined to final production integration.

## Recovery procedure

1. Confirm current `main`, open PRs, and actual reviewed counts.
2. Run record, duplicate, count, URL, origin, and evidence validation.
3. Resume the first incomplete item above.
4. Update this checkpoint whenever counts or execution order change.
