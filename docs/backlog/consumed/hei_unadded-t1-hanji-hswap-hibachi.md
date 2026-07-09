# D-750 Batch T1 — Hanji Protocol, hSwap, and Hibachi

Reviewed at: 2026-07-09

## Results

- `0904` Hanji Protocol -> `hei_ex_000720`, active DEX
- `0912` Haven1 hSwap -> `hei_ex_000721`, active DEX
- `0929` Hibachi -> `hei_ex_000722`, active hybrid exchange

## Consolidation and classification

- Hanji Protocol is modeled as one multichain on-chain order-book DEX entity across its current supported exchange surfaces.
- Haven1 hSwap and hSwap V2 are modeled as one Haven1 spot DEX entity rather than separate protocol-version entities.
- Hibachi is classified as hybrid because current first-party documentation supports both exchange-managed and self-managed signing modes while the platform uses a zk-verified settlement architecture.

## Decision notes

Hanji Protocol is promoted from current first-party documentation identifying a fully on-chain order-book exchange with spot trading, price-time-priority matching, contract execution, order-book mechanics, and mainnet contract, HTTP, and WebSocket APIs across current network surfaces.

hSwap is promoted from first-party Haven1 product and core-protocol documentation. The product page describes hSwap V2 as a concentrated-liquidity AMM spot DEX, while the core-protocol documentation explicitly marks hSwap as live and describes trading, liquidity pools, liquidity incentives, and automated-liquidity-management integrations.

Hibachi is promoted from current first-party About, Trading, and Key Management documentation. The platform documents leveraged BTC, ETH, and SOL markets, order and margin systems, subaccounts, funding, vault-related functionality, APIs, and both exchange-managed and self-managed key modes.

## Batch output

- new entities: 3
- new events: 0
- new evidence: 9
- projected entity count: 606
- projected event count: 1004
- projected evidence count: 2787
- remaining to D-750 after projected merge: 144

The branch was started while S1 was still under CI. S1 is now merged on main and owns `hei_ex_000717` through `hei_ex_000719`; T1 intentionally starts at `hei_ex_000720` and `hei_src_011470`.

No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.
