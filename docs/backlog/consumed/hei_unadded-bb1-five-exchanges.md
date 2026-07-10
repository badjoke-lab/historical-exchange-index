# D-750 Batch BB1 — BitcoinVN, BIT.TEAM, BisonFi, Beralis V3, and HumidiFi

Reviewed at: 2026-07-10

## Results

- `0194` BitcoinVN -> `hei_ex_000822`, active CEX
- `0187` BIT.TEAM -> `hei_ex_000823`, active CEX
- `0184` BisonFi -> `hei_ex_000824`, active DEX
- `0157` Beralis V3 -> `hei_ex_000825`, limited DEX
- `0954` / `0955` Humidifi / HumidiFi -> `hei_ex_000826`, active DEX

## Entity-first consolidation

- BitcoinVN remains one Vietnam-origin exchange and direct-swap platform entity across crypto/crypto and crypto/VND settlement routes.
- BIT.TEAM remains one centralized exchange entity across spot, OTC, API, and P2P surfaces.
- BisonFi remains one Solana Prop AMM DEX entity.
- Beralis V3 remains one Berachain CLMM entity; low activity is expressed through status rather than creating version/deployment splits.
- Humidifi and HumidiFi source spellings remain one Solana Prop AMM entity.

## Evidence decisions

### BitcoinVN

Current first-party BitcoinVN website exposes an active multi-asset swap application, crypto-to-VND routes, bank-transfer and cash settlement methods, staking navigation, account access, and current service activity. The site also states that the company was founded in 2013 and has operated without interruption since 2014. HEI leaves `launch_date` null because this review did not reconcile company founding with a precise exchange-service launch marker. Confidence is `high`.

### BIT.TEAM

Current first-party BIT.TEAM website exposes live exchange and P2P surfaces, account creation and login, OTC services, trading API access, KYC user and market statistics, current 24-hour volume, and support services. Confidence is `high`.

### BisonFi

DefiLlama identifies BisonFi as a Solana proprietary-market-maker DEX and reports substantial non-zero current 30-day, 7-day, and 24-hour DEX volume. HEI uses `active` while leaving URL fields unset because a stable first-party website surface was not recovered. Confidence is `medium`.

### Beralis V3

DefiLlama identifies Beralis V3 as a Berachain Uniswap V3 fork and reports residual TVL but zero recent 30-day, 7-day, and 24-hour fee activity, very small cumulative DEX volume, and a caution warning. HEI uses `limited`, not `active` or `dead`. Confidence is `medium`.

### HumidiFi

Current first-party HumidiFi site exposes a live liquidity leaderboard and links the Aquarium on-chain-liquidity product. DefiLlama identifies HumidiFi as a Solana Prop AMM and reports substantial current DEX volume plus fees and revenue. Confidence is `high`.

## Current-main overlap findings

Direct current-main checks and repository searches prevented stale candidate assumptions from creating duplicate drafts:

- BHEX -> existing `hei_ex_000566`
- Bidesk -> existing `hei_ex_000567`
- Bilaxy -> existing `hei_ex_000568`
- Binance DEX -> existing `hei_ex_000569`
- BitcoinTrade -> existing `hei_ex_000571`
- Bibox -> existing `hei_ex_000573`
- BitcoinToYou -> existing `hei_ex_000574`
- BenSwap -> existing `hei_ex_000575`
- BetterSwap -> existing `hei_ex_000576`
- BEVMSwap -> existing `hei_ex_000578`
- Bitpanda Pro -> existing `hei_ex_000585`
- BL3P -> existing `hei_ex_000586`
- Bitinka -> existing `hei_ex_000587`
- Bitypreço -> existing `hei_ex_000589`
- BitShares DEX -> existing `hei_ex_000590`

The initial Bitypreço replacement candidate was blocked by a path collision and direct main review confirmed the existing `hei_ex_000589` entity. It was replaced by HumidiFi while preserving the five-entity batch size.

Binance JEX, Bitex.la, Bitocto Exchange, BitPreço legacy spelling, and other lifecycle-sensitive candidates remain separate research work and were not forced into this routine batch.

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