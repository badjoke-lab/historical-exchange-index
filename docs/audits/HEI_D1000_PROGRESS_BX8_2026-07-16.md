# HEI D-1000 Progress Checkpoint — BX8

Date: 2026-07-16  
Status: IN PROGRESS  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BX8 is the twenty-first reviewed growth batch during the L-2 HOLD period. It adds four current active decentralized exchanges using current first-party application, documentation, code, and independent protocol-metric evidence.

## 2. Batch contents

```text
SwapX    hei_ex_000946 active
Raindex  hei_ex_000947 active
Sour     hei_ex_000948 active
Metric   hei_ex_000949 active
```

## 3. Projected reviewed state

```text
Entities: 829
Events:   1004
Evidence: 3417
```

Batch delta:

```text
Entities: +4
Events:   +0
Evidence: +8
```

Remaining to D-1000:

```text
171 reviewed entities
```

## 4. Status discipline

SwapX is active because its official Sonic application remains reachable and the official SwapX organization publishes the Algebra AMM implementation used by the exchange.

Raindex is active because Rainlang documentation identifies it as a programmable DEX and the official organization actively maintains the Rain orderbook, subgraph, solver, contract, and webapp stack.

Sour is active because its first-party site states that v1.0 is live on Solana mainnet and links the current production trading, market, earn, developer, status, audit, program-ID, and security surfaces.

Metric is active because its official domain remains reachable and current independent protocol data reports non-zero TVL and Swap-event volume across nine EVM networks. Confidence is `medium` because public first-party technical documentation is limited.

## 5. Overlap and candidate findings

Repository-wide name and domain searches plus direct normal, alternate, and legacy nested canonical-path checks found no current-main records for:

```text
SwapX / swapx.fi
Raindex / rainlang.xyz
Sour / sour.finance
Metric / metric.xyz
```

BrownFi was excluded after direct canonical-path inspection found existing record `hei_ex_000606` despite an empty repository-search result.

HyperLynx remains undrafted because a distinct official domain was not confirmed beyond its official GitHub organization. This avoids using a generic `github.com` identity as the canonical official domain in a routine growth batch.

Records validation, Candidate scan, and Watchlist resolution remain authoritative. Any overlap found by CI must be resolved before merge.

## 6. Checkpoint repair

BX8 marks the merged BX7 checkpoint complete and advances the maintainer recovery reference, L-2 parallel-growth count text, reviewed counts, and execution-roadmap checkpoint to BX8.

## 7. Safety boundaries

BX8 does not change:

```text
Cloudflare configuration
localization route scope
L-2 HOLD decision
third-language authorization
canonical schema
public machine-readable safety rules
```

## 8. Current execution state

```text
L-2 decision:       HOLD
D-1000 growth:      CURRENT
D-1000 BX7:         COMPLETE
D-1000 BX8:         validation pending
Language Selection: blocked until later gate
```

## 9. Authority references

```text
config/maintainer-recovery-contract.json
docs/HEI_V1_EXECUTION_ROADMAP.md
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
docs/audits/HEI_D1000_PROGRESS_BX7_2026-07-16.md
docs/backlog/consumed/hei_unadded-bx8-four-active-dex-records.md
records/exchanges/swapx.json
records/exchanges/raindex.json
records/exchanges/sour.json
records/exchanges/metric.json
```
