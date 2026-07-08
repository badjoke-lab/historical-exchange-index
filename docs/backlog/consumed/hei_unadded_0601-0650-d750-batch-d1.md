# Range 0601-0650 D-750 Batch D1

Reviewed at: 2026-07-08

## Results

- `0605` DragonSwap V2 plus `0606`/`0607` V3 rows -> `hei_ex_000681`, active DEX
- `0649` Ekubo plus `0650` Ekubo V3 (Ethereum) -> `hei_ex_000682`, active DEX

## Consolidation handling

- DragonSwap V2 and V3 source rows are modeled as one DragonSwap entity.
- Ekubo and the Ethereum V3 source row are modeled as one Ekubo entity across protocol deployments.

## Decision notes

DragonSwap is promoted from its current official website and documentation, which identify a Kaia decentralized exchange with token swaps, V3 liquidity pools, and farming functionality. Ekubo is promoted from current official documentation describing permissionless AMM infrastructure, concentrated liquidity, gas-efficient swaps, extensions, and Starknet/EVM swap-router implementations.

The dYdX candidate row is not consumed by this batch because direct bundle verification found the existing reviewed entity `hei_ex_000517`. A separate scan-correction PR updates that candidate disposition.

DX25 is not included in this batch. Its official website preserves a 2023-10-17 Spot DEX mainnet launch record, but the current application endpoint timed out during review, so current status requires separate verification before public classification.

Drift and Econia are also deferred to dedicated lifecycle/current-state research: Drift requires post-incident status review, and Econia's official repository was archived in September 2025.

## Batch output

- new entities: 2
- new events: 0
- new evidence: 6
- version/deployment rows consolidated: 3
- projected entity count: 566
- projected event count: 1004
- projected evidence count: 2667
- remaining to D-750 after projected merge: 184

No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.
