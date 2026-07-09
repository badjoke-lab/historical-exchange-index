# D-750 Batch AC1 — Delta Exchange

Reviewed at: 2026-07-09

## Results

- `0549` delta -> `hei_ex_000733`, active CEX

## Consolidation and classification

- The CCXT `delta` discovery row is modeled as the Delta Exchange entity.
- Spot, perpetual futures, options, order-book, API, India, and Global product/environment surfaces are not split into separate HEI entities in this initial record.
- `country_or_origin` uses `Global` because the first-party API documentation exposes separate India and Global environments and the current review does not collapse those regional/legal boundaries into one country.
- Confidence is `medium` pending deeper legal-entity and exact launch-date reconstruction.

## Decision notes

Delta Exchange is promoted after dedicated current-state review rather than from the CCXT candidate row alone.

The first-party About page identifies Delta Exchange as a cryptocurrency derivatives exchange serving retail and institutional traders. The current first-party API documentation covers products, tickers, option chains, orders, positions, fills, L2 order books, public trades, wallet operations, volume statistics, REST clients, WebSocket feeds, and a changelog extending into June 2026.

Current CCXT master retains the Delta Exchange integration and implements spot, perpetual swap, and options support together with markets, order books, trades, orders, balances, positions, and official Delta Exchange endpoints.

Exact bundle-path checks on current main found no existing `records/exchanges/delta-exchange.json`. Repository PR history shows Delta Exchange repeatedly deferred for stronger current-state evidence; the present first-party About and API documentation resolve that requirement for an initial reviewed entity record.

## Batch output

- new entities: 1
- new events: 0
- new evidence: 3
- projected entity count: 617
- projected event count: 1004
- projected evidence count: 2820
- remaining to D-750 after projected merge: 133

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.
