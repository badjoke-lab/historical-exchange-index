# HEI D-1000 Progress Checkpoint — BX9

Date: 2026-07-16  
Status: IN PROGRESS  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BX9 is the twenty-second reviewed growth batch during the L-2 HOLD period. It adds four current active decentralized exchanges using current first-party applications, documentation, official mainnet tooling, public APIs, and independently maintained on-chain event tracking.

## 2. Batch contents

```text
PunchSwap    hei_ex_000950 active
1DEX         hei_ex_000951 active
Rubin        hei_ex_000952 active
LiquidLaunch hei_ex_000953 active
```

## 3. Projected reviewed state

```text
Entities: 833
Events:   1004
Evidence: 3425
```

Batch delta:

```text
Entities: +4
Events:   +0
Evidence: +8
```

Remaining to D-1000:

```text
167 reviewed entities
```

## 4. Status discipline

PunchSwap is active because current KittyPunch documentation identifies the V2/V3 decentralized exchange on Flow EVM and the dedicated first-party application exposes trade, swap, pool, and liquidity routes.

1DEX is active because its current first-party site explicitly identifies an order-book-based decentralized exchange and exposes current markets, trading, and liquidity surfaces.

Rubin is active because its official organization publishes a current mainnet spot and perpetual trading server covering markets, order books, accounts, positions, and order management, while its first-party indexer exposes live perpetual-market data.

LiquidLaunch is active because its first-party application remains reachable and current on-chain tracking records purchase, sale, bond-fee, post-bond fee-claim, and staking-reward events from identified Hyperliquid contracts. Confidence is `medium` because public first-party technical documentation is limited.

## 5. Overlap and candidate findings

Repository-wide name and domain searches plus direct normal, alternate, and legacy nested canonical-path checks found no current-main records for:

```text
PunchSwap / swap.kittypunch.xyz
1DEX / 1dex.com
Rubin / rubin.trade
LiquidLaunch / liquidlaunch.app
```

Angstrom, Full Sail, DipCoin, HARD Swap, EagleFi, CobaltX, and BrownFi were excluded after direct canonical-path inspection found existing reviewed records. This again confirms that repository search indexing alone is not sufficient for dedupe.

Flowr was excluded because its tracked value transfer belongs to an on-chain game economy rather than an exchange venue. Interest Protocol DEX was held because current first-party positioning and current activity evidence did not support a routine active-growth classification.

Records validation, Candidate scan, and Watchlist resolution remain authoritative. Any overlap found by CI must be resolved before merge.

## 6. Checkpoint repair

BX9 marks the merged BX8 checkpoint complete and advances the maintainer recovery reference, L-2 parallel-growth count text, reviewed counts, and execution-roadmap checkpoint to BX9.

## 7. Safety boundaries

BX9 does not change:

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
D-1000 BX8:         COMPLETE
D-1000 BX9:         validation pending
Language Selection: blocked until later gate
```

## 9. Authority references

```text
config/maintainer-recovery-contract.json
docs/HEI_V1_EXECUTION_ROADMAP.md
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
docs/audits/HEI_D1000_PROGRESS_BX8_2026-07-16.md
docs/backlog/consumed/hei_unadded-bx9-four-active-dex-records.md
records/exchanges/punchswap.json
records/exchanges/1dex.json
records/exchanges/rubin.json
records/exchanges/liquidlaunch.json
```
