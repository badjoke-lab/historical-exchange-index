# D-750 Batch W1 — IceCreamSwap and ICDex

Reviewed at: 2026-07-09

## Results

- `0989` ICDex -> `hei_ex_000728`, active DEX
- `0990` ICDex duplicate source row -> consolidated under `hei_ex_000728`
- `0991` IcecreamSwap (Core) -> `hei_ex_000727`, active DEX
- `0992` IcecreamSwap (Core) duplicate row -> consolidated under `hei_ex_000727`
- `0993` IcecreamSwap V2 -> consolidated under `hei_ex_000727`
- `0994` IcecreamSwap V3 -> consolidated under `hei_ex_000727`

## Consolidation and classification

- IceCreamSwap Core, V2, V3, chain, and registry-source rows are modeled as one IceCreamSwap exchange entity.
- ICDex duplicate discovery rows, router, pair, and maker infrastructure are modeled as one ICDex exchange entity rather than separate product or component entities.
- Neither entity is split by chain deployment, AMM version, trading pair, maker component, or registry-source row.

## Decision notes

IceCreamSwap is promoted from the live first-party website and the official IceCreamSwapCom frontend repository. The repository identifies itself as the IceCreamSwap frontend, contains the exchange website implementation and swap SDK packages, and documents pools, tokens, volume, liquidity, transactions, and protocol information surfaces. A first-party frontend commit dated 2026-07-02 provides current maintenance evidence.

ICDex is promoted from the live first-party ICLightHouse surface, the official `iclighthouse/ICDex` repository, and first-party 2026 Q1 ecosystem accounting. The implementation repository explicitly identifies ICDex as an order-book DEX on Internet Computer and documents router-managed pair creation, trading, limit orders, pair canisters, and optional OAMM maker infrastructure. The quarterly ecosystem accounting records ICDex router balances, liquidity, volume, and TVL reporting.

Exact bundle-path checks on current main found no existing `records/exchanges/icecreamswap.json` or `records/exchanges/icdex.json`. The completed 0951-1000 scan authority already requires entity-first consolidation for IceCreamSwap Core/V2/V3 and duplicate ICDex source rows.

## Batch output

- new entities: 2
- new events: 0
- new evidence: 6
- projected entity count: 612
- projected event count: 1004
- projected evidence count: 2805
- remaining to D-750 after projected merge: 138

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.
