# D-750 Batch AN1 — GLEEC Wallet & DEX, GOPAX, Globiance, Globe Exchange, and Glue Hub

Reviewed at: 2026-07-09

## Results

- `0852` Gleec Wallet -> `hei_ex_000752`, active DEX
- `0853` Gleec Wallet / `komodo-wallet` domain row -> consolidated under `hei_ex_000752`
- `0878` GoPax -> `hei_ex_000753`, active CEX
- `0879` GOPAX duplicate source row -> consolidated under `hei_ex_000753`
- `0861` Globiance -> `hei_ex_000754`, active hybrid exchange
- `0859` Globe -> `hei_ex_000755`, active CEX
- `0863` Glue Hub -> `hei_ex_000756`, active DEX

## Entity-first consolidation

- GLEEC Wallet, Gleec Wallet, Gleec DEX, the dex.gleec.com application, and the `komodo-wallet` source row are modeled as one GLEEC Wallet & DEX entity.
- GoPax/GOPAX duplicate source rows remain one GOPAX entity.
- Globiance regional centralized exchange services and branded GlobianceDEX are modeled as one hybrid exchange entity.
- Globe spot, perpetual, unified-margin, wallet, and API surfaces remain one Globe Exchange entity.
- Glue Hub market overview, Buy & Sell Crypto, transaction history, and wallet-connected trading surfaces remain one Glue Hub entity.

## Evidence decisions

### GLEEC Wallet & DEX

The current first-party dex.gleec.com endpoint is reachable. The official `GLEECBTC/gleec-wallet` repository explicitly identifies the product as `Gleec Wallet & DEX`, links the web application, and documents web, Windows, macOS, Linux, Android, and iOS builds. Confidence is `medium` because the public product documentation does not deeply expose current exchange mechanics; the June 2026 exchange candidate corpus independently corroborates the dex.gleec.com exchange identity.

### GOPAX

The current first-party GOPAX exchange endpoint is reachable. Official GOPAX REST API documentation covers KRW trading pairs, balances, order queries, market and limit order placement, cancellation, trade history, deposits and withdrawals, tickers, order books, market statistics, charts, notices, WebSocket access, and a change history extending to 2026-06-02. The official GOPAX GitHub organization repository links to the API documentation.

### Globiance

Current first-party pages identify Globiance as a financial-services group with cryptocurrency exchanges and regional trading platforms. The exchange page documents buying and trading crypto assets, while the About page identifies GlobianceDEX as an AMM on XDC Network. HEI therefore uses `hybrid` and models the centralized exchange brand and branded DEX under one entity.

### Globe Exchange

Current first-party pages expose Spot, Perpetuals, Unified Margin, Buy Crypto, Wallet, KYC, Earn, API, signup, and login functionality. Current perpetual-market pages list instruments, prices, price changes, 24-hour volumes, and trade actions. First-party API documentation covers spot and derivatives instruments, balances, orders, trades, market data, REST APIs, and WebSocket feeds.

### Glue Hub

Current first-party Glue Hub market and Buy & Sell Crypto surfaces are reachable in beta. The trading page exposes market prices, 24-hour high and low, volume, Buy and Sell controls, wallet connection, price impact, estimated fees in GLUE, balances, and transaction-history fields. Confidence is `medium` because public protocol documentation for the exchange boundary is thin; the June 2026 exchange candidate corpus corroborates the hub.glue.net exchange identity.

## Current-main overlap findings

Direct current-main checks found stale add-now assumptions and prevented duplicate drafting:

- GMO Coin Japan -> existing `hei_ex_000692`
- Glide Finance -> existing `hei_ex_000693`
- GooseFX -> existing `hei_ex_000694`
- GRVT -> existing `hei_ex_000711`
- H2 Finance -> existing `hei_ex_000706`

The initial GMO Coin draft in AN1 was blocked by permanent overlap validation because current main already contains `hei_ex_000692` with `GMO Coin` and `GMOコイン` aliases and the `coin.z.com` domain. The duplicate draft was removed and replaced by GLEEC Wallet & DEX while preserving the five-entity batch size.

Gliquid and Gravity Finance were not forced into AN1 because current public first-party evidence was not strong enough during this review pass.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 640
- projected event count: 1004
- projected evidence count: 2889
- remaining to D-750 after projected merge: 110

## Operating mode

AN1 continues normal D-750 multi-entity batching. Routine growth work targets approximately five reviewed entities per PR, normally 4–6. Single-entity PRs remain reserved for corrections, high-impact lifecycle updates, integrity repairs, or similarly exceptional work.

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.
