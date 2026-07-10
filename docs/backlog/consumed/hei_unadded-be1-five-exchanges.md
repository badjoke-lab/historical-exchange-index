# D-750 Batch BE1 — Funnel, Garuda DeFi, HyperJump, Hashlock Markets, and FluxFlow

Reviewed at: 2026-07-10

## Results

- `0811` Funnel -> `hei_ex_000837`, active hybrid exchange
- `0833` / `0834` Garuda DeFi -> `hei_ex_000838`, active DEX
- `0978` HyperJump -> `hei_ex_000839`, active DEX
- `0910` Hashlock Markets -> `hei_ex_000840`, active hybrid exchange
- `0787` FluxFlow V3 -> `hei_ex_000841`, active DEX

## Entity-first consolidation

- Funnel remains one trading and market-deployment entity across HyperCore Spot and HyperEVM DEX execution surfaces.
- Garuda DeFi and GarudaDefi source rows remain one Terra Classic exchange entity.
- HyperJump remains one multichain DEX entity across BNB Chain, Fantom, and Metis.
- Hashlock Markets remains one RFQ and OTC trading entity across backend quote coordination and HTLC settlement infrastructure.
- FluxFlow V3 is modeled as one FluxFlow entity rather than a version-only identity.

## Evidence decisions

### Funnel

Current first-party website and documentation expose listing, deployment, HyperCore Spot trading, Funnel DEX swap and liquidity surfaces, HyperEVM DEX access, smart routing, analytics, and integrated exchange execution. HEI uses `hybrid` because the trading surface spans HyperCore order-book markets and HyperEVM decentralized exchanges. Confidence is `high`.

### Garuda DeFi

Current first-party website exposes Market, Swap, DEX Shares, farms, staking, token-factory, and P2P surfaces. First-party documentation identifies Garuda DeFi as a Terra Classic AMM with permissionless pools, swaps, liquidity provision, and an on-chain order book. DefiLlama reports current TVL and non-zero recent DEX volume. Confidence is `high`.

### HyperJump

The official HyperJump GitHub organization links the current HyperJump domain and publishes protocol contracts and user-documentation repositories. DefiLlama reports current TVL across BNB Chain, Fantom, and Metis together with non-zero recent DEX volume. Confidence is `high`.

### Hashlock Markets

First-party SDK and architecture documentation describe the Hashlock Markets RFQ, quote, trade, and HTLC-settlement lifecycle and the same trading flow used by the web application. A current DefiLlama DEX-volume adapter tracks Ethereum and Sui HTLC settlement legs and references deployed mainnet contracts. HEI uses `hybrid` because authenticated RFQ and trade coordination use a backend service while settlement is performed through on-chain HTLC mechanisms. Confidence is `high`.

### FluxFlow

DefiLlama identifies FluxFlow V3 as a Fluent concentrated-liquidity DEX and reports current TVL, fees, revenue, and non-zero 30-day, 7-day, and 24-hour DEX volume. HEI records FluxFlow as the canonical entity rather than creating a version-only identity. A stable first-party website URL was not recovered in this review pass. Confidence is `medium`.

## Current-main overlap findings

Direct current-main path checks and repository review prevented stale scan assumptions from creating duplicate drafts. Among nearby candidate rows, Hanji Protocol, Hashflow, HitBTC, Honeyswap, and Huobi Korea already have reviewed main records and were not redrafted.

Hashlock Markets, Funnel, Garuda DeFi, HyperJump, and FluxFlow were each confirmed absent from current main at their intended record paths before drafting.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 725
- projected event count: 1004
- projected evidence count: 3144
- remaining to D-750 after projected merge: 25

## Operating mode

BE1 continues normal D-750 multi-entity batching. Routine growth work targets approximately five reviewed entities per PR, normally 4–6. No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.