# D-750 Batch P1 — Full Sail, GalaSwap, and HeliSwap

Reviewed at: 2026-07-09

## Results

- `0809` Full Sail plus duplicate row `0810` -> `hei_ex_000708`, active DEX
- `0825` Gala Swap plus duplicate row `0826` -> `hei_ex_000709`, active DEX
- `0916` HeliSwap -> `hei_ex_000710`, active DEX

## Consolidation and classification

- Duplicate Full Sail source rows are modeled as one Sui DEX entity.
- Duplicate Gala Swap source rows are modeled as one GalaSwap entity on GalaChain.
- HeliSwap is modeled as one Hedera ecosystem DEX entity covering the current AMM exchange surface and related liquidity features.

## Decision notes

Full Sail is promoted from current first-party website and documentation describing a Sui DEX with direct swaps, aggregator routing, concentrated-liquidity positions, dynamic fees, and liquidity-management functions.

GalaSwap is promoted from the current first-party GalaSwap exchange surface, which identifies the product as a native GalaChain DEX and documents self-custodial swaps, concentrated liquidity, market views, portfolio positions, and on-chain settlement. GalaChain SDK documentation provides supporting chain-level token-swap primitives.

HeliSwap is promoted from first-party documentation identifying an open-source Hedera DEX and describing ERC-20, HTS, and HBAR swaps, AMM liquidity pools, LP rewards, and yield farms. The official application endpoint remains reachable.

## Batch output

- new entities: 3
- new events: 0
- new evidence: 9
- duplicate source rows consolidated: 2
- projected entity count: 594
- projected event count: 1004
- projected evidence count: 2751
- remaining to D-750 after projected merge: 156

No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.
