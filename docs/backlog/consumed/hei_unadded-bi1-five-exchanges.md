# D-750 Batch BI1 — Darkness, DeltaDeFi, DuckyDeFi, Dystopia, and Ebisu's Bay

Reviewed at: 2026-07-10

## Results

- Darkness -> `hei_ex_000857`, active DEX
- DeltaDeFi -> `hei_ex_000858`, active DEX
- DuckyDeFi -> `hei_ex_000859`, limited DEX
- Dystopia -> `hei_ex_000860`, active DEX
- Ebisu's Bay -> `hei_ex_000861`, active DEX

## Status and entity decisions

- Darkness is `active` from current Cronos TVL and non-zero 30-day, 7-day, and 24-hour DEX volume.
- DeltaDeFi is `active` from a current first-party site plus current Cardano TVL, fee/revenue activity, and non-zero recent DEX volume.
- DuckyDeFi is `limited`, not `active` or `dead`, because current Cronos TVL remains while recent volume evidence and a stable first-party website were not recovered in this review pass.
- Dystopia is `active` from current Polygon TVL and non-zero recent DEX volume; the official GitHub organization preserves the exchange implementation and domain identity.
- Ebisu's Bay is `active` from a current first-party Trade on DEX application path and substantial current liquidity across Cronos and Cronos zkEVM.

## Evidence decisions

### Darkness

DefiLlama identifies Darkness as a Cronos weighted-pool AMM DEX and reports current TVL plus non-zero recent volume. Confidence is `medium` because a stable first-party website was not recovered.

### DeltaDeFi

The current first-party site remains available. DefiLlama identifies DeltaDeFi as a Hydra-based Cardano order-book DEX and reports current TVL, fees, revenue, and non-zero recent spot volume. Confidence is `high`.

### DuckyDeFi

DefiLlama identifies DuckyDeFi as a Cronos AMM DEX and reports current TVL. HEI uses `limited` conservatively because recent volume metrics and a stable first-party website were not recovered. Confidence is `medium`.

### Dystopia

The official GitHub organization preserves the dystopia.exchange domain and exchange implementation repositories. DefiLlama reports current Polygon TVL and non-zero 30-day, 7-day, and 24-hour DEX volume. Confidence is `medium` because the first-party website was not fully verified.

### Ebisu's Bay

The current first-party application exposes Trade, Earn, GameFi, trending currencies, and a Trade on DEX path. DefiLlama reports substantial current TVL across Cronos and Cronos zkEVM. Confidence is `high`.

## Current-main overlap findings

DeFi Kingdoms and DefiPlaza were initially considered from stale candidate assumptions but direct current-main checks confirmed existing reviewed entities `hei_ex_000675` and `hei_ex_000677`. They were excluded before drafting and replaced with Dystopia and Ebisu's Bay.

All five BI1 record paths were confirmed absent from reviewed main before drafting.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 745
- projected event count: 1004
- projected evidence count: 3204
- remaining to D-750 after projected merge: 5

## Operating mode

BI1 is the penultimate normal D-750 multi-entity batch. No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.