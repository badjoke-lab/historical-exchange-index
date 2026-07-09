# D-750 Batch R1 — Fluid, FlatQube, and FluxBeam

Reviewed at: 2026-07-09

## Results

- `0779`/`0780`/`0781`/`0782` Fluid chain rows plus `0783` Fluid DEX and `0784` Fluid DEX Lite -> `hei_ex_000714`, active DEX
- `0769` FlatQube -> `hei_ex_000715`, active DEX
- `0785`/`0786` FluxBeam duplicate source rows -> `hei_ex_000716`, active DEX

## Consolidation and classification

- Fluid's Ethereum, Arbitrum, Plasma, DEX, and DEX Lite discovery rows are modeled as one multichain Fluid exchange entity rather than separate chain or product entities.
- FlatQube is modeled as one Everscale ecosystem AMM DEX entity.
- Duplicate CoinGecko and DefiLlama FluxBeam rows are modeled as one Solana DEX entity.

## Decision notes

Fluid is promoted from current first-party technical documentation publishing Fluid DEX V2 and DEX Lite liquidity-source integration specifications together with active DEX contracts, fees, range controls, reserves, resolvers, swap interfaces, and oracle components under one protocol documentation surface.

FlatQube is promoted from its current first-party website and documentation identifying a decentralized AMM exchange on Everscale and documenting swaps, liquidity pools, farming, staking, limit trading, cross-exchange functionality, APIs, and smart contracts.

FluxBeam is promoted from current first-party documentation identifying a Solana DEX supporting SPL, SPL404, and Token-2022 assets and documenting swaps, liquidity provisioning and management, advanced limit orders, signals and automations, and developer swap and pool APIs.

## Batch output

- new entities: 3
- new events: 0
- new evidence: 9
- deployment/product/source rows consolidated: 7
- projected entity count: 600
- projected event count: 1004
- projected evidence count: 2769
- remaining to D-750 after projected merge: 150

## Existing records discovered during research

Direct bundle review confirmed that two other remaining scan candidates were already canonical and were therefore not re-added:

- Figure Markets -> existing `hei_ex_000689`
- First Ledger -> existing `hei_ex_000690`

These findings should be considered when consuming the remaining 0751-0800 add-now queue.

No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.
