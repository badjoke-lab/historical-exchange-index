# D-750 Batch R1 — Hercules, FlatQube, and FluxBeam

Reviewed at: 2026-07-09

## Results

- `0923` Hercules plus `0924` V2 and `0925`/`0926` V3 rows -> `hei_ex_000714`, active DEX
- `0769` FlatQube -> `hei_ex_000715`, active DEX
- `0785`/`0786` FluxBeam duplicate source rows -> `hei_ex_000716`, active DEX

## Consolidation and classification

- Hercules base, V2, and V3 discovery rows are modeled as one Metis DEX entity.
- FlatQube is modeled as one Everscale ecosystem AMM DEX entity.
- Duplicate CoinGecko and DefiLlama FluxBeam rows are modeled as one Solana DEX entity.

## Decision notes

Hercules is promoted from current first-party documentation describing a Metis liquidity protocol with swaps, limit orders, dynamic AMM pools, concentrated-liquidity V3 pools, staking, incentives, and launchpad functions. Current trading and V3 liquidity guides document active swap execution, routing and slippage controls, limit orders, manual and automated concentrated-liquidity range strategies, and LP transaction execution.

FlatQube is promoted from its current first-party website and documentation identifying a decentralized AMM exchange on Everscale and documenting swaps, liquidity pools, farming, staking, limit trading, cross-exchange functionality, APIs, and smart contracts.

FluxBeam is promoted from current first-party documentation identifying a Solana DEX supporting SPL, SPL404, and Token-2022 assets and documenting swaps, liquidity provisioning and management, advanced limit orders, signals and automations, and developer swap and pool APIs.

## Batch output

- new entities: 3
- new events: 0
- new evidence: 9
- version/source rows consolidated: 4
- projected entity count: 600
- projected event count: 1004
- projected evidence count: 2769
- remaining to D-750 after projected merge: 150

## Existing records discovered during research

Direct bundle review and permanent overlap validation confirmed that five remaining scan candidates or candidate groups were already canonical and were therefore not re-added:

- Figure Markets -> existing `hei_ex_000689`
- First Ledger -> existing `hei_ex_000690`
- Fluid DEX / Fluid / Fluid DEX Lite -> existing `hei_ex_000691`
- Ferro / Ferro Protocol -> existing `hei_ex_000687`

The initial R1 attempts created duplicate Fluid and Ferro records. The permanent record overlap validator correctly blocked both. They were removed before merge, and Hercules was selected as the final replacement candidate.

These findings should be considered when consuming the remaining add-now queues.

No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.
