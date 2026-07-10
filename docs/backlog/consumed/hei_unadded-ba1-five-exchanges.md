# D-750 Batch BA1 — CandySwap, Consensus Liquidity DEX, El Dorado Exchange, EmpireDEX, and Equation V3

Reviewed at: 2026-07-10

## Results

- `0324` CandySwap -> `hei_ex_000817`, inactive DEX
- `0396` Consensus Liquidity DEX -> `hei_ex_000818`, active DEX
- `0651` El Dorado Exchange -> `hei_ex_000819`, limited DEX
- `0669` EmpireDEX -> `hei_ex_000820`, active DEX
- `0682` Equation V3 -> `hei_ex_000821`, limited DEX

## Evidence decisions

### CandySwap

DefiLlama identifies CandySwap as a MEER-chain Uniswap V2 fork with substantial cumulative DEX volume but zero current TVL. The first-party website timed out during this review pass, so HEI uses `inactive`, not `dead`, and marks the URL `live_unverified`. Confidence is `medium`.

### Consensus Liquidity DEX

Current first-party Swapscanner website exposes a CL DEX surface alongside Trade, Swap Pro, DCA, Staking, Portfolio, and documentation. DefiLlama independently reports current Kaia TVL, fees, revenue, and non-zero 30-day, 7-day, and 24-hour DEX volume. Confidence is `high`.

### El Dorado Exchange

DefiLlama identifies El Dorado Exchange as an on-chain spot and perpetual exchange and reports residual TVL plus substantial cumulative spot and perpetual volume across BNB Chain and Arbitrum. A stable first-party website and clear current public trading surface were not recovered, so HEI uses `limited`. Confidence is `medium`.

### EmpireDEX

DefiLlama identifies EmpireDEX as a multichain AMM DEX and reports current multichain TVL plus non-zero 30-day, 7-day, and 24-hour DEX volume. A stable first-party website was not recovered, so URL fields remain unset rather than guessed. Confidence is `medium`.

### Equation V3

DefiLlama identifies Equation V3 as an Arbitrum perpetual DEX and reports zero current TVL alongside substantial cumulative DEX volume and historical fee generation. HEI therefore uses `limited`, not `active`. Confidence is `medium`.

## Current-main overlap findings

Direct current-main and permanent overlap validation prevented stale candidate assumptions from creating duplicate drafts:

- Buda.com -> existing `hei_ex_000054`
- BMX Trade -> existing `hei_ex_000610`
- BrownFi -> existing `hei_ex_000606`
- BurrBear -> existing `hei_ex_000608`
- Cables Finance -> existing `hei_ex_000617`
- Caliber -> existing `hei_ex_000618`
- Canary -> existing `hei_ex_000619`
- Canto Dex -> existing `hei_ex_000624`
- Cleopatra -> existing `hei_ex_000641`
- Clober -> existing `hei_ex_000639`

The initial Buda and BMX drafts were blocked by permanent overlap validation because current main already contains those identities. Both duplicate drafts were removed and replaced by CandySwap and Consensus Liquidity DEX while preserving the five-entity batch size.

Bitex.la, Bitocto Exchange, and BitPreço remain lifecycle-research candidates and were not forced into this routine growth batch.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 705
- projected event count: 1004
- projected evidence count: 3084
- remaining to D-750 after projected merge: 45

## Operating mode

BA1 continues normal D-750 multi-entity batching. Routine growth work targets approximately five reviewed entities per PR, normally 4–6. No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.