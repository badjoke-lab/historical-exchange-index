# D-750 Batch N1 — Fraxswap and Fulcrom

Reviewed at: 2026-07-08

## Results

- `0801` Frax Swap plus `0802` Fraxswap and `0803` Ethereum row -> `hei_ex_000703`, active DEX
- `0808` Fulcrom AMM -> `hei_ex_000704`, active DEX

## Consolidation and classification

- Frax Swap, Fraxswap, and the Ethereum-specific source representation are modeled as one Fraxswap entity. Current first-party deployment documentation distinguishes current V2 deployments from deprecated V1 deployments without requiring separate entity records.
- Fulcrom AMM is modeled under one Fulcrom exchange entity rather than as a separate AMM product entity. First-party documentation describes the current platform as a decentralized perpetual exchange with FLP liquidity, swaps, leveraged trading, and staking.

## Decision notes

Fraxswap is promoted from first-party Frax documentation describing a permissionless constant-product AMM with an embedded time-weighted average market maker for large orders. Technical documentation explains the AMM/TWAMM design and current contract documentation publishes V2 deployments across multiple networks while explicitly marking V1 deployments deprecated.

Fulcrom is promoted from its current first-party documentation and trading platform. The official documentation describes a decentralized perpetual exchange on Cronos, zkSync Era, and Cronos zkEVM, with on-chain collateral and trades backed by a multi-asset Fulcrom Liquidity Pool. The current platform exposes Trade, Earn, Dashboard, perpetual markets, pools, swaps, staking, and vesting surfaces.

## Batch output

- new entities: 2
- new events: 0
- new evidence: 6
- deployment/product rows consolidated: 3
- projected entity count: 588
- projected event count: 1004
- projected evidence count: 2733
- remaining to D-750 after projected merge: 162

No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.
