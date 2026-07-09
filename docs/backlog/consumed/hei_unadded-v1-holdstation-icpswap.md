# D-750 Batch V1 — Holdstation and ICPSwap

Reviewed at: 2026-07-09

## Results

- `0935` Holdstation Swap -> `hei_ex_000725`, active DEX
- `0996` ICPSwap -> `hei_ex_000726`, active DEX
- `0997` ICPSwap duplicate source row -> consolidated under `hei_ex_000726`

## Consolidation and classification

- Holdstation Swap, Holdstation DEX Aggregator, and Holdstation DeFutures are modeled as one Holdstation exchange entity rather than separate product entities.
- ICPSwap duplicate discovery rows and the V3 service implementation are modeled as one ICPSwap exchange entity.
- Neither entity is split by product surface, AMM version, chain deployment, or registry-source row.

## Decision notes

Holdstation is promoted from current first-party documentation. The documentation identifies a multichain DEX aggregator that routes swaps across multiple liquidity sources and supports direct web and wallet swaps. Separate current first-party documentation describes Holdstation DeFutures as a perpetual decentralized exchange product with leveraged trading and multichain ecosystem coverage. These surfaces are consolidated under one Holdstation exchange entity.

ICPSwap is promoted from the live first-party application plus public ICPSwap-Labs repositories. The official V3 service repository identifies ICPSwap V3 as a concentrated-liquidity AMM on Internet Computer and documents swaps, custom price-range liquidity positions, limit orders, pool creation, deposit/withdraw flows, and wallet integration. The official frontend repository exposes the active trading application implementation and swap/liquidity user flows.

Exact bundle-path checks on current main found no existing `records/exchanges/holdstation.json` or `records/exchanges/icpswap.json`. Repository PR search found no prior Holdstation record PR. ICPSwap appears in the completed 0951-1000 scan and was previously deferred for stronger first-party documentation; the current first-party application and official repositories provide that documentation for this batch.

## Batch output

- new entities: 2
- new events: 0
- new evidence: 6
- projected entity count: 610
- projected event count: 1004
- projected evidence count: 2799
- remaining to D-750 after projected merge: 140

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.
