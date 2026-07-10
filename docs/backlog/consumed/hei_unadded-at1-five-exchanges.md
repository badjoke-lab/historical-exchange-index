# D-750 Batch AT1 — FlowSwap, Fluid DEX, Firefly, Flashnet, and Fluxion Network

Reviewed at: 2026-07-10

## Results

- `0772` FlowSwap -> `hei_ex_000782`, active DEX
- `0773` FlowSwap duplicate row -> consolidated under `hei_ex_000782`
- `0774` FlowSwap V2 -> consolidated under `hei_ex_000782`
- `0775` FlowSwap V3 -> consolidated under `hei_ex_000782`
- `0779` Fluid (Arbitrum) -> `hei_ex_000783`, active DEX represented as Fluid DEX
- `0780` Fluid (Ethereum) -> consolidated under `hei_ex_000783`
- `0781` Fluid alternate row -> consolidated under `hei_ex_000783`
- `0782` Fluid (Plasma) -> consolidated under `hei_ex_000783`
- `0783` Fluid DEX -> consolidated under `hei_ex_000783`
- `0784` Fluid DEX Lite -> consolidated under `hei_ex_000783`
- `0758` firefly -> `hei_ex_000784`, active DEX represented as Firefly
- `0759` Firefly duplicate row -> consolidated under `hei_ex_000784`
- `0768` Flashnet -> `hei_ex_000785`, active DEX
- `0788` Fluxion -> `hei_ex_000786`, active DEX represented as Fluxion Network
- `0789` Fluxion Network -> consolidated under `hei_ex_000786`

## Entity-first consolidation

- FlowSwap V2 and V3 deployments remain one FlowSwap entity on Flow.
- Fluid chain-specific, DEX, and DEX Lite source rows remain one Fluid DEX entity across supported EVM deployments.
- Firefly duplicate exchange source rows remain one Manta DEX entity.
- Flashnet Markets, Bitcoin liquidity routing, and Spark DEX activity remain one Flashnet exchange entity.
- Fluxion and Fluxion Network source rows remain one Mantle-native hybrid DEX entity.

## Evidence decisions

### FlowSwap

The current first-party FlowSwap application remains reachable as a JavaScript exchange interface. DefiLlama independently classifies FlowSwap as a Flow DEX and reports current TVL, fees, recent DEX volume, and cumulative DEX volume while presenting V2 and V3 implementations under the combined protocol identity. Confidence is `medium` because detailed first-party protocol documentation was not recovered in this review pass.

### Fluid DEX

Current first-party Fluid website and technical documentation remain reachable. Official technical docs publish Fluid DEX V2, DEX liquidity-source integration, DEX Lite integration, DEX fee, resolver, liquidity, and oracle components. DefiLlama independently reports substantial current multichain TVL, fees, revenue, and DEX volume. Confidence is `high`.

### Firefly

The current first-party Firefly application remains reachable. DefiLlama independently classifies Firefly as an audited CLMM DEX on Manta and reports current TVL, fees, recent DEX volume, and cumulative DEX volume. Confidence is `medium` because detailed first-party protocol documentation was not recovered during this review pass.

### Flashnet

Current first-party Flashnet website and documentation describe non-custodial Bitcoin buy/sell infrastructure, native Bitcoin liquidity, routing, bridging, settlement, Markets and Orchestra products, and API orchestration. DefiLlama independently classifies Flashnet as an AMM DEX and modular exchange stack for Bitcoin and reports current Spark-chain DEX volume. Confidence is `high`.

### Fluxion Network

The current first-party Fluxion application identifies itself as a decentralized exchange on Mantle. DefiLlama independently describes Fluxion Network as an RWA-optimized Mantle-native DEX combining AMM V2/V3 and order-book functionality and reports current TVL, fees, and DEX volume. Confidence is `high`.

## Current-main overlap findings

Direct current-main checks prevented stale scan assumptions from creating duplicate drafts:

- Figure Markets -> existing `hei_ex_000689`
- First Ledger -> existing `hei_ex_000690`
- Flamingo Finance -> existing `hei_ex_000745`
- FlatQube -> existing `hei_ex_000715`
- FlowX -> existing `hei_ex_000707`
- FluxBeam -> existing `hei_ex_000716`

FluxFlow V3 was not forced into AT1 because the current registry evidence is strong but a stable first-party website/documentation surface was not recovered in this pass. ForkDelta was also not placed in this routine active-growth batch because its first-party shutdown notice requires terminal-state lifecycle modeling rather than active classification.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 670
- projected event count: 1004
- projected evidence count: 2979
- remaining to D-750 after projected merge: 80

## Operating mode

AT1 continues normal D-750 multi-entity batching. Routine growth work targets approximately five reviewed entities per PR, normally 4–6. Single-entity PRs remain reserved for corrections, high-impact lifecycle updates, integrity repairs, or similarly exceptional work.

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.