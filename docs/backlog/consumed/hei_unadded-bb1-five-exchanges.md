# D-750 Batch BB1 — Huckleberry AMM, Hydra DEX, BisonFi, Beralis V3, and HumidiFi

Reviewed at: 2026-07-10

## Results

- `0951` Huckleberry AMM -> `hei_ex_000822`, active DEX
- `0966` / `0967` / `0968` Hydra DEX / Hydradex V2 / Hydradex V3 -> `hei_ex_000823`, limited DEX represented as Hydra DEX
- `0184` BisonFi -> `hei_ex_000824`, active DEX
- `0157` Beralis V3 -> `hei_ex_000825`, limited DEX
- `0954` / `0955` Humidifi / HumidiFi -> `hei_ex_000826`, active DEX

## Entity-first consolidation

- Huckleberry AMM, Huckleberry, and Huckleberry Finance source representations remain one Moonriver/CLV DEX entity.
- Hydra DEX, Hydradex V2, and Hydradex V3 source rows remain one Hydra Chain DEX entity.
- BisonFi remains one Solana Prop AMM DEX entity.
- Beralis V3 remains one Berachain CLMM entity; low activity is expressed through status rather than creating version/deployment splits.
- Humidifi and HumidiFi source spellings remain one Solana Prop AMM entity.

## Evidence decisions

### Huckleberry AMM

Current first-party Huckleberry website exposes Swap, Farm, Stake, Lend, Vote, Bridge, and Launch App surfaces and describes the project as a community DEX and lending platform on Moonriver and Clover. DefiLlama independently reports current TVL, fees, and non-zero 30-day, 7-day, and 24-hour DEX volume. Confidence is `high`.

### Hydra DEX

The current first-party HydraGon DEX application remains reachable. DefiLlama identifies Hydra DEX as the native decentralized exchange of Hydra Chain and reports residual TVL and non-zero 30-day DEX volume, but minimal 7-day activity and zero 24-hour volume in the reviewed snapshot. HEI uses `limited`, not `active` or `dead`, and consolidates V2/V3 source rows into one entity. Confidence is `medium`.

### BisonFi

DefiLlama identifies BisonFi as a Solana proprietary-market-maker DEX and reports substantial non-zero current 30-day, 7-day, and 24-hour DEX volume. HEI uses `active` while leaving URL fields unset because a stable first-party website surface was not recovered. Confidence is `medium`.

### Beralis V3

DefiLlama identifies Beralis V3 as a Berachain Uniswap V3 fork and reports residual TVL but zero recent 30-day, 7-day, and 24-hour fee activity, very small cumulative DEX volume, and a caution warning. HEI uses `limited`, not `active` or `dead`. Confidence is `medium`.

### HumidiFi

Current first-party HumidiFi site exposes a live liquidity leaderboard and links the Aquarium on-chain-liquidity product. DefiLlama identifies HumidiFi as a Solana Prop AMM and reports substantial current DEX volume plus fees and revenue. Confidence is `high`.

## Current-main overlap findings

Direct current-main checks, repository searches, and permanent overlap validation prevented stale candidate assumptions from creating duplicate drafts:

- BHEX -> existing `hei_ex_000566`
- Bidesk -> existing `hei_ex_000567`
- Bilaxy -> existing `hei_ex_000568`
- Binance DEX -> existing `hei_ex_000569`
- BitcoinTrade -> existing `hei_ex_000571`
- BitcoinVN -> existing VBTC identity `hei_ex_000572`
- Bibox -> existing `hei_ex_000573`
- BitcoinToYou -> existing `hei_ex_000574`
- BenSwap -> existing `hei_ex_000575`
- BetterSwap -> existing `hei_ex_000576`
- BIT.TEAM -> existing `hei_ex_000577`
- BEVMSwap -> existing `hei_ex_000578`
- Bitpanda Pro -> existing `hei_ex_000585`
- BL3P -> existing `hei_ex_000586`
- Bitinka -> existing `hei_ex_000587`
- Bitypreço -> existing `hei_ex_000589`
- BitShares DEX -> existing `hei_ex_000590`

The initial BitcoinVN and BIT.TEAM drafts were blocked by permanent overlap validation because current main already represents those identities. Both drafts were removed and replaced by Huckleberry AMM and Hydra DEX while preserving the five-entity batch size.

The initial Bitypreço replacement candidate was separately blocked by a path collision and direct main review confirmed the existing `hei_ex_000589` entity. It was replaced by HumidiFi.

Binance JEX, Bitex.la, Bitocto Exchange, and other lifecycle-sensitive candidates remain separate research work and were not forced into this routine batch.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 710
- projected event count: 1004
- projected evidence count: 3099
- remaining to D-750 after projected merge: 40

## Operating mode

BB1 continues normal D-750 multi-entity batching. Routine growth work targets approximately five reviewed entities per PR, normally 4–6. No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.