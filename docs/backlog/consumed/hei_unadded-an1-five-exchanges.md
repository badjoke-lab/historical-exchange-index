# D-750 Batch AN1 — GMO Coin, GOPAX, Globiance, Globe Exchange, and Glue Hub

Reviewed at: 2026-07-09

## Results

- `0866` GMO Coin Japan -> `hei_ex_000752`, active CEX
- `0878` GoPax -> `hei_ex_000753`, active CEX
- `0879` GOPAX duplicate source row -> consolidated under `hei_ex_000753`
- `0861` Globiance -> `hei_ex_000754`, active hybrid exchange
- `0859` Globe -> `hei_ex_000755`, active CEX
- `0863` Glue Hub -> `hei_ex_000756`, active DEX

## Entity-first consolidation

- GMO Coin exchange spot, leveraged exchange, crypto FX, WebTrader, and API surfaces remain under one GMO Coin entity.
- GoPax/GOPAX duplicate source rows remain one GOPAX entity.
- Globiance regional centralized exchange services and branded GlobianceDEX are modeled as one hybrid exchange entity.
- Globe spot, perpetual, unified-margin, wallet, and API surfaces remain one Globe Exchange entity.
- Glue Hub market overview, Buy & Sell Crypto, transaction history, and wallet-connected trading surfaces remain one Glue Hub entity.

## Evidence decisions

### GMO Coin

Current first-party pages expose order-book spot trading, leveraged exchange trading, crypto FX, WebTrader, deposits and withdrawals, market data, and public and private API services. The official site identifies GMO Coin, Inc. and registration as a Japanese crypto-asset exchange service provider under Kanto Local Finance Bureau registration No. 00006.

### GOPAX

The current first-party GOPAX exchange endpoint is reachable. Official GOPAX REST API documentation covers KRW trading pairs, balances, order queries, market and limit order placement, cancellation, trade history, deposits and withdrawals, tickers, order books, market statistics, charts, notices, WebSocket access, and a change history extending to 2026-06-02. The official GOPAX GitHub organization repository links to the API documentation.

### Globiance

Current first-party pages identify Globiance as a financial-services group with cryptocurrency exchanges and regional trading platforms. The exchange page documents buying and trading crypto assets, while the About page identifies GlobianceDEX as an AMM on XDC Network. HEI therefore uses `hybrid` and models the centralized exchange brand and branded DEX under one entity.

### Globe Exchange

Current first-party pages expose Spot, Perpetuals, Unified Margin, Buy Crypto, Wallet, KYC, Earn, API, signup, and login functionality. Current perpetual-market pages list instruments, prices, price changes, 24-hour volumes, and trade actions. First-party API documentation covers spot and derivatives instruments, balances, orders, trades, market data, REST APIs, and WebSocket feeds.

### Glue Hub

Current first-party Glue Hub market and Buy & Sell Crypto surfaces are reachable in beta. The trading page exposes market prices, 24-hour high and low, volume, Buy and Sell controls, wallet connection, price impact, estimated fees in GLUE, balances, and transaction-history fields. Confidence is `medium` because public protocol documentation for the exchange boundary is thin; the June 2026 exchange candidate corpus corroborates the hub.glue.net exchange identity.

## Current-main overlap findings

Direct current-main checks found several stale add-now assumptions and prevented duplicate drafting:

- Glide Finance -> existing `hei_ex_000693`
- GooseFX -> existing `hei_ex_000694`
- GRVT -> existing `hei_ex_000711`
- H2 Finance -> existing `hei_ex_000706`

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
