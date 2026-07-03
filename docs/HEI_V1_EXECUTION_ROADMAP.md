# HEI v1 Execution Roadmap

Status: active execution source of truth  
Repository: `badjoke-lab/historical-exchange-index`  
Checkpoint: 2026-07-04

## Current checkpoint

```text
Last confirmed main SHA: a2a1e7c9623ab89d1bb3dd82c58b5e5f9b788f2c
Last merged PR: #506
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

```text
Target entities: 550
Projected entities: 479
Remaining additions: 71
Progress: 87.1%
```

## Range 0201-0250

```text
Promoted add_now:               7
Resolved needs_research:        4
Remaining needs_research:       9
Pending thin:                  27
Excluded:                       3
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

GitHub-side work can continue without Cloudflare access.
