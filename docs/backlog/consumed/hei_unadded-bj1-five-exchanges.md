# D-750 Batch BJ1 — CSWAP DEX, Forest, Durian AMM, CrescentSwap, and Clutch Anvil AMM

Reviewed at: 2026-07-10

## Results

- `0484` CSWAP DEX -> `hei_ex_000862`, active DEX
- `0795` Forest V1 -> `hei_ex_000863`, limited DEX, canonicalized as Forest
- `0618` Durianfun AMM -> `hei_ex_000864`, active DEX, canonicalized as Durian AMM
- `0453` CrescentSwap -> `hei_ex_000865`, active DEX
- Clutch Anvil AMM -> `hei_ex_000866`, active DEX

## Status and entity decisions

- CSWAP DEX is `active` from a reachable first-party Cardano application, ecosystem registry contract metadata, and current protocol liquidity.
- Forest is `limited`, not `active` or `dead`, because the current BSC DEX identity and adapter configuration remain preserved but stronger recent utilization and stable first-party availability evidence were not recovered.
- Durian AMM is `active` from a current hourly Bitkub Chain volume adapter that automatically discovers newly graduated AMM pools and tracks swaps and fee flows.
- CrescentSwap is `active` from current TVL on Arbitrum and Base together with non-zero 30-day, 7-day, and 24-hour DEX volume.
- Clutch Anvil AMM is `active` from current hourly on-chain adapter infrastructure covering factory-deployed NFT AMM vaults across Ethereum, Base, and ApeChain with 2026 deployment start points.

## Entity-first decisions

- CSWAP DEX remains one Cardano exchange entity across application, contract-script, and ecosystem-registry surfaces.
- Forest V1 is canonicalized as one Forest entity rather than a version-only identity.
- Durianfun AMM source representation is canonicalized as one Durian AMM exchange entity; individual graduated pools are not separate HEI entities.
- CrescentSwap remains one CLMM exchange entity across Arbitrum and Base.
- Clutch Anvil markets and NFT collections remain one multichain AMM exchange entity rather than separate market entities.

## Evidence decisions

### CSWAP DEX

The current first-party application remains reachable. Cardano ecosystem registry data identifies the project as a DEX, preserves cswap.fi, V1 release metadata, and deployed Plutus-script contract addresses. Current protocol data reports Cardano TVL. Confidence is `high`.

### Forest

The June 2026 DEX candidate corpus identifies Forest V1 as a BSC DEX, and the current Uniswap V2 registry preserves Forest adapter configuration. Stronger recent usage and first-party availability evidence were not recovered, so HEI uses `limited`. Confidence is `medium`.

### Durian AMM

The current open-source DEX-volume adapter documents Bitkub Chain markets that graduate from Durianfun bonding curves into dedicated constant-product AMM pools. The adapter automatically discovers new pools, reads Swapped events, calculates fees and revenue, and pulls hourly. Confidence is `medium`.

### CrescentSwap

Current protocol data reports non-zero TVL across Arbitrum and Base and non-zero 30-day, 7-day, and 24-hour DEX volume. The current registry links the CrescentSwap project social identity and CLMM infrastructure. Confidence is `medium`.

### Clutch Anvil AMM

The current open-source DEX-volume adapter documents permissionless NFT AMM vaults, NFT buy/sell events, fee flows, hourly pulls, and 2026 factory deployment start points on Ethereum, Base, and ApeChain. Confidence is `medium`.

## Current-main overlap findings

The five BJ1 record paths were confirmed absent from reviewed main before drafting. Several initially considered alternatives were excluded after direct current-main checks found existing reviewed entities, including CoinCorner, Coinmate, CoinTR, CoinUp.io, CoinZoom, DeFi Kingdoms, DefiPlaza, Cables Finance, Caliber, Canary, Canto Dex, Comet Swap, and Convergence Finance.

ExinSwap was not forced into the milestone batch because its lifecycle and terminal/current state remain ambiguous and require separate research.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 750
- projected event count: 1004
- projected evidence count: 3219
- projected remaining to D-750: 0

## Operating mode

BJ1 is the final planned five-entity D-750 growth batch. No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge. After merge, the milestone must be verified on current main under public build aggregation semantics before D-750 is declared complete or L-1 work begins.