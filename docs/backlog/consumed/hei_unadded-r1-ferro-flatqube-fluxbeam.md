# D-750 Batch R1 — Ferro Protocol, FlatQube, and FluxBeam

Reviewed at: 2026-07-09

## Results

- `0751` Ferro Protocol -> `hei_ex_000714`, active DEX
- `0769` FlatQube -> `hei_ex_000715`, active DEX
- `0785`/`0786` FluxBeam duplicate source rows -> `hei_ex_000716`, active DEX

## Consolidation and classification

- Ferro Protocol is modeled as one Cronos StableSwap AMM entity covering Ferro Swap, base and meta pools, staking, and related liquidity functions.
- FlatQube is modeled as one Everscale ecosystem AMM DEX entity.
- Duplicate CoinGecko and DefiLlama FluxBeam rows are modeled as one Solana DEX entity.

## Decision notes

Ferro Protocol is promoted from current first-party documentation identifying a StableSwap AMM protocol for the Cronos ecosystem and documenting Ferro Swap, smart routing, base and meta liquidity pools, deposit and withdrawal incentives, LP tokens, staking, contracts, SDKs, and security resources.

FlatQube is promoted from its current first-party website and documentation identifying a decentralized AMM exchange on Everscale and documenting swaps, liquidity pools, farming, staking, limit trading, cross-exchange functionality, APIs, and smart contracts.

FluxBeam is promoted from current first-party documentation identifying a Solana DEX supporting SPL, SPL404, and Token-2022 assets and documenting swaps, liquidity provisioning and management, advanced limit orders, signals and automations, and developer swap and pool APIs.

## Batch output

- new entities: 3
- new events: 0
- new evidence: 9
- duplicate source rows consolidated: 1
- projected entity count: 600
- projected event count: 1004
- projected evidence count: 2769
- remaining to D-750 after projected merge: 150

## Existing records discovered during research

Direct bundle review confirmed that three remaining scan candidates were already canonical and were therefore not re-added:

- Figure Markets -> existing `hei_ex_000689`
- First Ledger -> existing `hei_ex_000690`
- Fluid DEX / Fluid / Fluid DEX Lite -> existing `hei_ex_000691`

The initial R1 attempt created a duplicate Fluid record. The permanent record overlap validator correctly blocked it, the duplicate was removed, and Ferro Protocol was substituted before merge.

These findings should be considered when consuming the remaining 0751-0800 add-now queue.

No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.
