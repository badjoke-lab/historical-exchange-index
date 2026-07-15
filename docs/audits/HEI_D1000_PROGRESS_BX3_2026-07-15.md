# HEI D-1000 Progress Checkpoint — BX3

Date: 2026-07-15  
Status: IN PROGRESS  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BX3 is the sixteenth reviewed growth batch during the L-2 initial HOLD period. It adds four current active DEX and DEX-aggregator entities using current first-party protocol, application, API, and deployed-contract documentation.

## 2. Batch contents

```text
OpenOcean hei_ex_000926 active
Pharaoh   hei_ex_000927 active
Ramses    hei_ex_000928 active
Odos      hei_ex_000929 active
```

## 3. Projected reviewed state

```text
Entities: 809
Events:   1004
Evidence: 3377
```

Batch delta:

```text
Entities: +4
Events:   +0
Evidence: +8
```

Remaining to D-1000:

```text
191 reviewed entities
```

## 4. Status discipline

OpenOcean is active because current first-party documentation and its official website expose multichain swap routing, liquidity aggregation, a public application, API, SDK, widget, limit-order, and cross-chain functions.

Pharaoh is active because current first-party documentation identifies an Avalanche-native concentrated-liquidity DEX with swaps, liquidity, farming, voting, incentives, and deployed factories, routers, position-management, and quoting contracts.

Ramses is active because current first-party documentation links its public application and documents concentrated and legacy AMMs, swaps, farming, voting, automated vaults, multichain architecture, and deployed routing infrastructure.

Odos is active because current first-party documentation links the live application and documents on-chain liquidity aggregation, token swaps, quote and execution endpoints, liquidity zaps, contracts, APIs, and current v3 routing.

## 5. Overlap and candidate findings

Repository-wide name and domain searches found no current-main records for:

```text
OpenOcean / openocean.finance
Pharaoh / pharaoh.exchange
Ramses / ramses.xyz
Odos / odos.xyz
```

Records validation, Candidate scan, and Watchlist resolution remain authoritative. Any normalized overlap found by CI must be resolved before merge.

Pearl Exchange was reviewed as a possible fourth record but excluded before drafting because its former public domain currently resolves to unrelated gambling and SEO-spam content. Stale protocol documentation alone was not treated as sufficient evidence of current active status.

## 6. Checkpoint repair

BX3 marks the merged BX2 checkpoint complete and advances the maintainer recovery reference and reviewed counts to BX3.

## 7. Safety boundaries

BX3 does not change:

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
L-2 initial decision: HOLD
D-1000 growth:        CURRENT
D-1000 BX2:           COMPLETE
D-1000 BX3:           validation pending
Language Selection:  blocked until later gate
```

## 9. Authority references

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
docs/audits/HEI_D1000_PROGRESS_BX2_2026-07-15.md
docs/backlog/consumed/hei_unadded-bx3-four-active-dex-records.md
records/exchanges/openocean.json
records/exchanges/pharaoh.json
records/exchanges/ramses.json
records/exchanges/odos.json
```
