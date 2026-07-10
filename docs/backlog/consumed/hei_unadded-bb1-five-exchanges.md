# D-750 Batch BB1 — HbarSuite, HumanFi, BisonFi, Beralis V3, and HumidiFi

Reviewed at: 2026-07-10

## Results

- `0913` HbarSuite -> `hei_ex_000822`, active DEX
- `0952` HumanFi -> `hei_ex_000823`, active DEX aggregator
- `0184` BisonFi -> `hei_ex_000824`, active DEX
- `0157` Beralis V3 -> `hei_ex_000825`, limited DEX
- `0954` / `0955` Humidifi / HumidiFi -> `hei_ex_000826`, active DEX

## Entity-first consolidation

- HbarSuite and HSuite source representations remain one Hedera DEX and liquidity-protocol entity.
- HumanFi remains one World Chain swap-aggregation entity rather than being split by Mini App or route surface.
- BisonFi remains one Solana Prop AMM DEX entity.
- Beralis V3 remains one Berachain CLMM entity; low activity is expressed through status rather than creating version/deployment splits.
- Humidifi and HumidiFi source spellings remain one Solana Prop AMM entity.

## Evidence decisions

### HbarSuite

The current first-party HSuite platform domain remains reachable. DefiLlama identifies HbarSuite as a Hedera AMM DEX and reports substantial current TVL plus non-zero 30-day, 7-day, and 24-hour DEX volume. Confidence is `high`.

### HumanFi

DefiLlama identifies HumanFi as a World Chain DEX aggregator and reports non-zero current 30-day, 7-day, and 24-hour swap volume plus fees and revenue. A stable standalone first-party product website was not recovered, so URL fields remain unset. The project social identity is preserved for corroboration. Confidence is `medium`.

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
- Huckleberry AMM -> existing Huckleberry entity `hei_ex_000763`
- Hydra DEX -> existing Hydra DEX entity `hei_ex_000764`
- HyperBrick -> existing `hei_ex_000769`
- HunnySwap -> existing `hei_ex_000770`

The initial BitcoinVN and BIT.TEAM drafts were blocked by permanent overlap validation because current main already represents those identities. Both drafts were removed.

The first replacements, Huckleberry AMM and Hydra DEX, were also blocked by permanent overlap validation because current main already contains the same underlying identities under entity-first slugs. Those drafts were removed and replaced by HbarSuite and HumanFi.

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