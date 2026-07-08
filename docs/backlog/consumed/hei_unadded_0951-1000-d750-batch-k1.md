# Range 0951-1000 D-750 Batch K1

Reviewed at: 2026-07-08

## Results

- `0979` Hyperliquid plus `0980` spot and `0981` spot-orderbook rows -> `hei_ex_000698`, active DEX
- `0969` Hydration plus `0970` Hydration DEX -> `hei_ex_000699`, active DEX

## Consolidation and classification

- Hyperliquid, Hyperliquid Spot, and Hyperliquid Spot Orderbook are modeled as one exchange entity.
- Hydration, the former HydraDX identity, and the Hydration DEX source representation are modeled as one current Hydration exchange entity rather than separate chain/product rows.

## Decision notes

Hyperliquid is promoted from current first-party documentation describing HyperCore as a fully on-chain perpetual futures and spot order-book system in which orders, cancellations, trades, and liquidations are executed transparently on the Hyperliquid L1. Current trading documentation covers perpetual assets, order books, margining, funding, liquidations, order types, and market making.

Hydration is promoted from its current first-party website and documentation. The official site exposes live swaps, split trading, DCA, OTC, and liquidity functions. Official documentation describes a Polkadot appchain whose trading layer combines Omnipool, Stablepools, and Isolated Pools.

ICPSwap and ICDex remain outside this batch because first-party documentation and lifecycle evidence were not yet selected at the same quality level. HyperSwap remains in entity-boundary research because the Areon-network and Hyperliquid-network identities must not be merged by name alone.

## Batch output

- new entities: 2
- new events: 0
- new evidence: 6
- product/source rows consolidated: 3
- projected entity count after J1 + K1: 583
- projected event count: 1004
- projected evidence count after J1 + K1: 2718
- remaining to D-750 after projected merge: 167

J1 is now merged on main. K1 starts at `hei_ex_000698` and `hei_src_011404` after J1's reserved IDs.

No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.
