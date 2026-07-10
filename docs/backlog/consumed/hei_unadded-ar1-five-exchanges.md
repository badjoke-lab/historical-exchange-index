# D-750 Batch AR1 — Haedal AMM Protocol, Heaven, Heraswap, Hermes Protocol, and Horiza

Reviewed at: 2026-07-10

## Results

- `0901` Haedal AMM Protocol -> `hei_ex_000772`, active DEX
- `0915` Heaven -> `hei_ex_000773`, active DEX
- `0922` Heraswap -> `hei_ex_000774`, active DEX
- `0927` Hermes Protocol -> `hei_ex_000775`, active DEX
- `0928` Hermes V1 -> consolidated under `hei_ex_000775`
- `0943` Horiza -> `hei_ex_000776`, active DEX

## Entity-first consolidation

- Haedal AMM Protocol remains one Sui AMM exchange entity within the broader Haedal ecosystem.
- Heaven AMM and launchpad trading surfaces remain one Heaven exchange entity.
- Heraswap swap, liquidity, farm, pool, analytics, and documentation surfaces remain one exchange entity.
- Hermes Protocol and Hermes V1 source rows remain one Metis exchange entity.
- Horiza CLMM and liquidity-management surfaces remain one Arbitrum exchange entity.

## Evidence decisions

### Haedal AMM Protocol

The current first-party Haedal domain remains reachable. DefiLlama independently classifies Haedal AMM Protocol as a Sui AMM DEX and reports current TVL, fee, revenue, and DEX-volume surfaces. Confidence is `medium` because the public first-party root site presents the broader Haedal ecosystem rather than an AMM-only documentation surface in this review pass.

### Heaven

Current first-party Heaven website and documentation remain reachable. Official documentation identifies Heaven as a launchpad and AMM on Solana and publishes developer and API resources. DefiLlama independently classifies Heaven as a Solana AMM DEX and reports fee, revenue, and DEX-volume surfaces. Confidence is `high`.

### Heraswap

Current first-party Heraswap application and swap page are reachable and expose Swap, Liquidity, Farm, Pool, Analytics, wallet connection, and token swap controls. DefiLlama independently identifies Heraswap as a DEX on the ONUS ecosystem. Confidence is `high`.

### Hermes Protocol

The current first-party Hermes Protocol JavaScript application remains reachable. DefiLlama independently classifies Hermes Protocol as a Metis DEX for low-cost, low-slippage trading across correlated and uncorrelated assets and reports current TVL and cumulative DEX volume. Confidence is `medium` because detailed first-party documentation was not recovered in this review pass.

### Horiza

The current first-party Horiza domain remains reachable. DefiLlama independently classifies Horiza as an Arbitrum CLMM DEX, describes concentrated-liquidity management and yield-bearing options-token design, and reports TVL, fee, revenue, and DEX-volume history. Confidence is `medium` because detailed first-party documentation was not recovered in this review pass.

## Current-main overlap findings

Direct current-main checks prevented stale scan assumptions from creating duplicate drafts:

- HakuSwap -> existing `hei_ex_000717`
- HiveSwap -> existing `hei_ex_000732`
- Helix Markets candidate was not promoted because the registry website pointer overlaps the existing Helix exchange domain and the entity boundary requires further review.
- Hydrometer Finance was not promoted in this active-growth batch because the current protocol registry displays a rug-pull warning and requires terminal-state reconstruction rather than routine active classification.

AR1 was assembled only from candidates confirmed absent from current main and suitable for the reviewed growth lane.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 660
- projected event count: 1004
- projected evidence count: 2949
- remaining to D-750 after projected merge: 90

## Operating mode

AR1 continues normal D-750 multi-entity batching. Routine growth work targets approximately five reviewed entities per PR, normally 4–6. Single-entity PRs remain reserved for corrections, high-impact lifecycle updates, integrity repairs, or similarly exceptional work.

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.