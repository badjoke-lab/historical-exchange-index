# D-750 Batch M1 — Hyperion and FreiExchange

Reviewed at: 2026-07-08

## Results

- `0976` Hyperion plus duplicate source row `0977` -> `hei_ex_000701`, active DEX
- `0804` FreiExchange -> `hei_ex_000702`, active CEX

## Consolidation and classification

- Hyperion's duplicate CoinGecko/DefiLlama source representations are modeled as one Aptos ecosystem DEX entity.
- FreiExchange is modeled as one active centralized exchange based on current first-party markets, About, and public API surfaces.

## Decision notes

Hyperion is promoted from current first-party documentation describing an Aptos trading and liquidity layer that combines swap aggregation, CLMM market making, vault strategies, AMM execution, and order-book execution support. Current docs expose swap, concentrated liquidity, liquidity mining, range orders, recurring orders, pool creation, SDK, contract, API, security, and audit material.

FreiExchange is promoted from its current first-party markets site, About page, and public API documentation. The exchange exposes active market statistics and trading-pair surfaces, while the About page describes deposits, withdrawals, account security controls, and continuing platform development. Exact launch date is intentionally left unset because no precise first-party launch source was selected for this initial bundle.

## Batch output

- new entities: 2
- new events: 0
- new evidence: 6
- duplicate source rows consolidated: 1
- projected entity count: 586
- projected event count: 1004
- projected evidence count: 2727
- remaining to D-750 after projected merge: 164

No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.
