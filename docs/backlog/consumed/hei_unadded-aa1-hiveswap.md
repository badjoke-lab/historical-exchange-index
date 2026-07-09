# D-750 Batch AA1 — HiveSwap

Reviewed at: 2026-07-09

## Results

- `0933` HiveSwap V2 -> `hei_ex_000732`, active DEX
- `0934` HiveSwap V3 -> consolidated under `hei_ex_000732`

## Consolidation and classification

- HiveSwap V2 and HiveSwap V3 are modeled as one HiveSwap exchange entity.
- Exchange versions, pool implementations, subgraph representations, and registry-source rows are not split into separate HEI entities.
- Confidence is `medium` because the live first-party application is current but the selected public interface repository has older code history.

## Decision notes

HiveSwap is promoted from the reachable first-party application, the official HiveSwap interface repository, and MAP Protocol first-party ecosystem materials.

The official interface source describes HiveSwap as a swap and liquidity service using MAP Protocol interoperability for Bitcoin-ecosystem and EVM assets. The interface exposes trading-volume and TVL data and documents swaps, liquidity services, Bitcoin/EVM asset exchange, liquidity pools, and liquidity mining.

The current first-party application endpoint is reachable at review time. MAP Protocol's maintained resource repository also records HiveSwap liquidity-pool and yield-farming materials, corroborating its ecosystem role.

The completed 0901-0950 scan classifies candidate `0933` as `add_now` and `0934` as a version row to consolidate. Exact bundle-path checks on current main found no existing `records/exchanges/hiveswap.json`.

## Batch output

- new entities: 1
- new events: 0
- new evidence: 3
- projected entity count: 616
- projected event count: 1004
- projected evidence count: 2817
- remaining to D-750 after projected merge: 134

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.
