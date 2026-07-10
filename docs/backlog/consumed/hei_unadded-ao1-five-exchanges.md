# D-750 Batch AO1 — Greenhouse, HSuite DEX, GT3, Gull Network, and HiBT

Reviewed at: 2026-07-10

## Results

- `0887` Greenhouse -> `hei_ex_000757`, active DEX
- `0913` HbarSuite -> `hei_ex_000758`, active DEX represented as HSuite DEX
- `0890` GT3 -> `hei_ex_000759`, active DEX
- `0891` GT3 duplicate DEX source row -> consolidated under `hei_ex_000759`
- `0895` Gull Network -> `hei_ex_000760`, active DEX
- `0930` Hibt -> `hei_ex_000761`, active CEX represented as HiBT

## Entity-first consolidation

- Greenhouse Polygon and Aurora deployment surfaces remain one Greenhouse entity.
- HbarSuite and the HSuite V1 DEX application lineage are modeled as one HSuite DEX entity; the wider HSuite infrastructure platform is not split into a second exchange entity.
- CoinGecko and DefiLlama GT3 source rows remain one GT3 entity.
- Gull Network swap, liquidity, bridge, reward, launcher, and related trading surfaces remain one entity.
- HiBT spot, futures, copy-trading, buy-crypto, earn, mobile, and API surfaces remain one centralized exchange entity.

## Evidence decisions

### Greenhouse

Current first-party documentation identifies Greenhouse as a sustainable multi-chain DEX built on Polygon and live on Aurora. The documentation links dedicated swap, farm, pool, and staking surfaces, while the current first-party application domain remains reachable. Confidence is `high`.

### HSuite DEX

First-party HSuite documentation states that the V1 application suite included a DEX and that the Hedera Mainnet V1 technology has remained in production for more than two years. The current HSuite strategy is broader infrastructure, so HEI isolates the exchange surface as HSuite DEX while preserving HbarSuite and HSuite aliases. DefiLlama independently corroborates the Hedera DEX identity. Confidence is `medium` because the current platform boundary is broader than the exchange surface.

### GT3

The dedicated dapp.gt3.finance endpoint is reachable. CoinGecko and DefiLlama candidate sources independently identify GT3 as an exchange/DEX and place the DEX in the Polygon ecosystem. Confidence is `medium` because detailed public first-party protocol documentation is limited.

### Gull Network

Current first-party application surfaces expose wallet-connected swaps, token selection, slippage controls, liquidity management, bridging, rewards, launcher navigation, and related trading functions. The June 2026 exchange candidate corpus independently corroborates the app.gullnetwork.com exchange identity. Confidence is `medium` because public protocol documentation is limited.

### HiBT

The current first-party HiBT platform exposes spot and futures trading, copy trading, crypto purchases, earn products, mobile access, and active account entry points. The official About page identifies HIBT as a digital-asset trading service platform registered in Canada in 2021, while first-party OpenAPI documentation covers spot and perpetual trading, market data, account balances, order management, and authenticated trading interfaces. Confidence is `high`.

## Current-main overlap findings

Direct current-main checks found stale add-now assumptions and prevented duplicate drafting:

- EXMO -> existing `hei_ex_000685`
- Fathom DEX -> existing `hei_ex_000686`
- Ferro -> existing `hei_ex_000687`
- Extended -> existing `hei_ex_000688`
- EverySwap -> existing `hei_ex_000746`
- Hercules -> existing `hei_ex_000714`
- Holdstation / Holdstation Swap -> existing `hei_ex_000725`

The initial Holdstation DEX draft was blocked by permanent overlap validation because current main already contains the Holdstation identity and Holdstation Swap / Holdstation DEX Aggregator aliases. The duplicate draft was removed and replaced by HiBT while preserving the five-entity batch size.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 645
- projected event count: 1004
- projected evidence count: 2904
- remaining to D-750 after projected merge: 105

## Operating mode

AO1 continues normal D-750 multi-entity batching. Routine growth work targets approximately five reviewed entities per PR, normally 4–6. Single-entity PRs remain reserved for corrections, high-impact lifecycle updates, integrity repairs, or similarly exceptional work.

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.