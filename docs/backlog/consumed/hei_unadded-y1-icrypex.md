# D-750 Batch Y1 — ICRYPEX

Reviewed at: 2026-07-09

## Results

- `0998` Icrypex -> `hei_ex_000730`, active CEX
- `0999` Icrypex duplicate source row -> consolidated under `hei_ex_000730`

## Consolidation and classification

- The CoinPaprika and CoinGecko discovery rows are modeled as one ICRYPEX exchange entity.
- API surfaces, spot markets, order-book endpoints, and WebSocket channels are service components, not separate HEI entities.
- Confidence is set to `medium` because the selected first-party developer documentation is older than the current candidate verification snapshot.

## Decision notes

ICRYPEX is promoted from official developer documentation plus the completed June 2026 candidate corpus.

The official ICRYPEX API documentation explicitly identifies the service as a spot exchange and documents a REST API base endpoint, API-key authentication, public trading endpoints, authenticated trading endpoints, funding/account endpoints, and WebSocket channels.

The public trading documentation covers exchange asset and pair information, enabled status, spot market types, market/limit/stop order support, tickers, order-book bids and asks, and last trades. Authenticated trading documentation covers order placement, cancellation, open orders, order history, and user trade history.

The completed 0951-1000 scan classifies candidate `0998` as `add_now` and candidate `0999` as a duplicate source representation. Exact bundle-path checks on current main found no existing `records/exchanges/icrypex.json`.

## Batch output

- new entities: 1
- new events: 0
- new evidence: 3
- projected entity count: 614
- projected event count: 1004
- projected evidence count: 2811
- remaining to D-750 after projected merge: 136

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.
