# D-750 Batch AS1 — Futarchy AMM, FWX DEX, FXDX, Gin Finance, and Gaming DEX

Reviewed at: 2026-07-10

## Results

- `0816` Futarchy AMM -> `hei_ex_000777`, active DEX
- `0819` FWX DEX -> `hei_ex_000778`, active DEX
- `0820` FXDX -> `hei_ex_000779`, limited DEX
- `0847` Gin Finance -> `hei_ex_000780`, active DEX
- `0827` Gaming DEX -> `hei_ex_000781`, active DEX
- `0828` Gaming DEX (Oasys) -> consolidated under `hei_ex_000781`

## Entity-first consolidation

- Futarchy AMM remains one Solana AMM exchange entity within the broader MetaDAO ecosystem.
- FWX spot AMM, leveraged exchange, lending-market creation, and futures surfaces remain one FWX DEX entity.
- FXDX protocol identity remains one exchange entity across Base and OP Mainnet.
- Gin Finance remains one Boba Network AMM exchange entity.
- Gaming DEX chain-specific discovery rows remain one weighted-pool AMM exchange entity.

## Evidence decisions

### Futarchy AMM

The current first-party MetaDAO website remains reachable and documents its market-governed fundraising and trading-oriented ecosystem. DefiLlama independently classifies Futarchy AMM as a Solana AMM DEX and reports current TVL, fees, revenue, and DEX volume. Confidence is `medium` because the first-party public root surface presents the broader MetaDAO platform rather than a standalone AMM-only product page.

### FWX DEX

The current first-party FWX application endpoint remains reachable as a JavaScript application. DefiLlama independently describes FWX as a permissionless leveraged AMM DEX with permissionless lending-market creation and futures trading and reports current TVL across Base and Avalanche. Confidence is `medium` because detailed first-party application content is not server-rendered.

### FXDX

The current first-party FXDX website is reachable but presents `V2` and a `Join waitlist` action rather than a live public trading interface. DefiLlama continues to report protocol TVL across Base and OP Mainnet and cumulative DEX volume. HEI therefore classifies FXDX as `limited` instead of `active` pending evidence of reopened public trading. Confidence is `medium`.

### Gin Finance

The current first-party Gin Finance application endpoint remains reachable as a JavaScript application. DefiLlama independently identifies Gin Finance as an open-source Boba Network AMM DEX for ERC-20 trading and liquidity and reports current TVL plus recent and cumulative DEX volume. Confidence is `medium` because detailed first-party documentation is limited in this review pass.

### Gaming DEX

The current first-party Gaming DEX application endpoint remains reachable as a JavaScript application. DefiLlama independently classifies Gaming DEX as a weighted-pool AMM DEX providing token liquidity and reports current TVL plus cumulative fees and DEX volume across supported deployments. Confidence is `medium` because detailed first-party protocol documentation is limited in this review pass.

## Current-main overlap findings

Direct current-main checks and permanent overlap validation prevented stale scan assumptions from creating duplicate drafts:

- Fraxswap -> existing `hei_ex_000703`
- FreiExchange -> existing `hei_ex_000702`
- Fulcrom -> existing `hei_ex_000704`
- Full Sail -> existing `hei_ex_000708`
- FusionX -> existing `hei_ex_000705`
- Giottus -> existing `hei_ex_000713`
- GalaSwap -> existing `hei_ex_000709`

The initial GalaSwap draft was blocked by permanent overlap validation because current main already contains the GalaSwap identity and swap.gala.com domain. The duplicate draft was removed and replaced by Gin Finance while preserving the five-entity batch size.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 665
- projected event count: 1004
- projected evidence count: 2964
- remaining to D-750 after projected merge: 85

## Operating mode

AS1 continues normal D-750 multi-entity batching. Routine growth work targets approximately five reviewed entities per PR, normally 4–6. Single-entity PRs remain reserved for corrections, high-impact lifecycle updates, integrity repairs, or similarly exceptional work.

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.