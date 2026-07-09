# D-750 Batch S1 — HakuSwap, Honeyswap, and HorizonDEX

Reviewed at: 2026-07-09

## Results

- `0902` HakuSwap -> `hei_ex_000717`, active DEX
- `0941`/`0942` Honeyswap duplicate source rows -> `hei_ex_000718`, active DEX
- `0944`/`0945` HorizonDEX duplicate source rows -> `hei_ex_000719`, active DEX

## Consolidation and classification

- HakuSwap is modeled as one Avalanche AMM DEX entity covering the protocol and current interface.
- Duplicate Honeyswap exchange source rows are modeled as one 1Hive-supported DEX entity spanning supported EVM deployments under common frontend and protocol identity.
- Duplicate HorizonDEX source rows are modeled as one concentrated-liquidity DEX entity rather than separate registry representations.

## Decision notes

HakuSwap is promoted from current first-party application availability and first-party documentation identifying an Avalanche AMM DEX with wallet-based swaps, liquidity pools, yield farming, trade mining, staking pools, and related exchange functions.

Honeyswap is promoted from its current first-party website and application plus first-party 1Hive documentation. The documentation describes Honeyswap as a network of community-supported decentralized exchanges with liquidity-pool contracts, common frontends, trade routing, analytics, AMM governance constraints, and LP functionality.

HorizonDEX is promoted from its current application and first-party documentation identifying a Linea concentrated-liquidity DEX. Current docs describe token swaps, on-chain execution, custom LP price ranges, concentrated-liquidity positions, reduced-slippage mechanics, farms, and related DEX functions.

## Batch output

- new entities: 3
- new events: 0
- new evidence: 9
- duplicate source rows consolidated: 2
- projected entity count: 603
- projected event count: 1004
- projected evidence count: 2778
- remaining to D-750 after projected merge: 147

No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.
