# D-750 Batch Z1 — HitBTC

Reviewed at: 2026-07-09

## Results

- `0931` HitBTC -> `hei_ex_000731`, active CEX
- `0932` HitBTC duplicate source row -> consolidated under `hei_ex_000731`

## Consolidation and classification

- CoinPaprika and CoinGecko discovery rows are modeled as one HitBTC exchange entity.
- Spot, margin, swap, API, and wallet/account surfaces are exchange products or capabilities, not separate HEI entities.
- Confidence is set to `medium` because this initial record resolves current operational identity but does not yet reconstruct the full historical corporate and jurisdictional lifecycle.

## Decision notes

HitBTC is promoted after dedicated current-state research rather than a thin active-style assumption.

The official HitBTC API repository identifies REST and Streaming API version 3 as access to the HitBTC next-generation trading engine and directs users to the API v3 reference.

Current CCXT master, at a 2026-07-09 repository state, retains the HitBTC v3 exchange integration. The implementation identifies official HitBTC website and API endpoints and supports spot, margin, swap, order creation and cancellation, order books, balances, deposits, withdrawals, positions, and related account operations.

The completed 0901-0950 scan classifies candidate `0931` as `add_now` and `0932` as a duplicate source representation. Exact bundle-path checks on current main found no existing `records/exchanges/hitbtc.json`.

## Batch output

- new entities: 1
- new events: 0
- new evidence: 3
- projected entity count: 615
- projected event count: 1004
- projected evidence count: 2814
- remaining to D-750 after projected merge: 135

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.
