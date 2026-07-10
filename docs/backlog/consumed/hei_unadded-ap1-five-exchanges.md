# D-750 Batch AP1 — Hotcoin, Huckleberry, Hydra DEX, Humble DeFi, and Hummus

Reviewed at: 2026-07-10

## Results

- `0946` Hotcoin -> `hei_ex_000762`, active CEX
- `0950` Huckleberry -> `hei_ex_000763`, active DEX
- `0951` Huckleberry AMM -> consolidated under `hei_ex_000763`
- `0966` Hydra DEX -> `hei_ex_000764`, active DEX
- `0967` Hydradex V2 -> consolidated under `hei_ex_000764`
- `0968` Hydradex V3 -> consolidated under `hei_ex_000764`
- `0953` Humble Defi -> `hei_ex_000765`, active DEX
- `0956` Hummus AMM -> `hei_ex_000766`, active DEX represented as Hummus

## Entity-first consolidation

- Hotcoin spot, margin, futures, copy-trading, buy-crypto, earn, mobile, and API surfaces remain one centralized exchange entity.
- Huckleberry and Huckleberry AMM source rows remain one Huckleberry entity across Moonriver and CLV deployments.
- Hydra DEX and Hydradex V2/V3 source rows remain one exchange entity rather than version-specific entities.
- Humble DeFi and the HumbleSwap application remain one exchange entity.
- Hummus, Hummus AMM, and the Hummus Exchange application remain one Metis DEX entity.

## Evidence decisions

### Hotcoin

Current first-party Hotcoin pages expose spot, margin, futures, copy trading, buy-crypto, earn, order-book trading, mobile applications, and API access. The first-party platform introduction identifies Hotcoin as a global crypto exchange and the current API surface documents spot/leverage, perpetual futures, market data, account services, trading actions, and WebSocket feeds. Confidence is `high`.

### Huckleberry

Current first-party homepage identifies Huckleberry as a community DEX and lending platform on Moonriver and Clover/CLV and exposes Swap, Farm, Stake, Lend, Vote, Bridge, and Launch App navigation. CoinGecko and DefiLlama candidate sources independently corroborate the DEX identity and Huckleberry AMM source row. Confidence is `medium` because detailed current protocol documentation is limited in this review pass.

### Hydra DEX

The current first-party hydradex.org application endpoint is reachable as a JavaScript application. CoinGecko and DefiLlama candidate sources independently identify Hydra DEX and Hydradex V2/V3 exchange surfaces in the Hydra ecosystem. HEI consolidates those version rows into one entity. Confidence is `medium` because public first-party protocol documentation is thin in this review pass.

### Humble DeFi

Current first-party Humble website and HumbleSwap application endpoints are reachable. DefiLlama independently identifies Humble DeFi as an Algorand DEX. Confidence is `medium` because the application is JavaScript-heavy and detailed current first-party protocol documentation was not recovered in this review pass.

### Hummus

Current first-party Hummus application exposes Swap, Pool, veHUM, Gauge, Rewards, Dashboard, Claim, wallet connection, and token-swap controls. The application links first-party About documentation, and DefiLlama independently corroborates Hummus AMM as a Metis DEX. Confidence is `high`.

## Current-main overlap findings

Direct current-main checks found stale add-now assumptions and prevented duplicate drafting:

- HorizonDEX -> existing `hei_ex_000719`
- Hydrex Integral -> existing `hei_ex_000723`
- Hypertrade -> existing `hei_ex_000724`
- ICPSwap -> existing `hei_ex_000726`
- IceCreamSwap -> existing `hei_ex_000727`
- ICDex -> existing `hei_ex_000728`
- Hybra Finance -> existing `hei_ex_000729`
- ICRYPEX -> existing `hei_ex_000730`
- Hydration -> existing `hei_ex_000699`
- Hyperion -> existing `hei_ex_000701`

AP1 was assembled only from candidates confirmed absent from current main.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 650
- projected event count: 1004
- projected evidence count: 2919
- remaining to D-750 after projected merge: 100

## Operating mode

AP1 continues normal D-750 multi-entity batching. Routine growth work targets approximately five reviewed entities per PR, normally 4–6. Single-entity PRs remain reserved for corrections, high-impact lifecycle updates, integrity repairs, or similarly exceptional work.

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.