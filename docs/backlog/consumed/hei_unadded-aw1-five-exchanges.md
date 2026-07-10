# D-750 Batch AW1 — Dusa, DX25, EddyFinance, Duality, and DTX DEX

Reviewed at: 2026-07-10

## Results

- `0620` Dusa -> `hei_ex_000797`, active DEX
- `0621` Dusa Protocol -> consolidated under `hei_ex_000797`
- `0622` DX25 -> `hei_ex_000798`, active DEX
- `0642` EddyFinance -> `hei_ex_000799`, active DEX
- `0643` EddyFinance AMM -> consolidated under `hei_ex_000799`
- `0615` Duality -> `hei_ex_000800`, active DEX
- `0614` DTX Dex V3 -> `hei_ex_000801`, active DEX represented as DTX DEX

## Entity-first consolidation

- Dusa and Dusa Protocol source rows remain one Massa DEX entity.
- DX25 Spot DEX and broader derivatives roadmap remain one DX25 exchange entity.
- EddyFinance and EddyFinance AMM source rows remain one universal/cross-chain DEX entity.
- Duality remains one native Neutron DEX module entity.
- DTX Dex V3 is modeled as one DTX DEX entity rather than a version-only identity.

## Evidence decisions

### Dusa

Current first-party Dusa website identifies the protocol as a decentralized trading protocol on Massa and documents swaps, concentrated liquidity, variable fees, advanced trading orders, autonomous liquidity, and fully on-chain infrastructure. The live application is linked and reachable. Confidence is `high`.

### DX25

Current first-party website identifies DX25 as a MultiversX platform combining AMM Spot DEX and derivatives trading and documents concentrated liquidity, single-sided liquidity, fee levels, mainnet development milestones, and the live application. Confidence is `high`.

### EddyFinance

Current first-party website identifies Eddy Finance as a Universal DEX and documents native-asset cross-chain transfer, stable-swap pools, smart routing, supported networks, and exchange access. DefiLlama independently reports current ZetaChain AMM TVL, fees, and DEX volume. Confidence is `high`.

### Duality

The current Neutron application endpoint remains reachable. DefiLlama identifies Duality as the native DEX module on Neutron Chain, classifies it as an order-book DEX, and reports current TVL and substantial cumulative DEX volume. Confidence is `medium` because a standalone Duality first-party documentation surface was not recovered in this review pass.

### DTX DEX

The dedicated DTX exchange domain remains reachable. DefiLlama identifies DTX Dex V3 as a Taiko CLMM DEX and reports current TVL, fees, and recent DEX volume. Confidence is `medium` because detailed first-party protocol documentation was not recovered in this review pass.

## Current-main overlap findings

Direct current-main checks and cross-repository searches confirmed the five AW1 entity identities were absent before drafting.

Known stale candidates in the same scan range were excluded:

- DragonSwap -> existing `hei_ex_000681`
- dYdX -> existing `hei_ex_000517`
- Ekubo -> existing `hei_ex_000682`

Drift AMM was not promoted as a separate entity because parent Drift exchange identity and product-boundary handling require a lineage/entity-first review. Econia remains a separate lifecycle-research candidate. Thinner aggregator-only candidates remain outside this reviewed batch.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 685
- projected event count: 1004
- projected evidence count: 3024
- remaining to D-750 after projected merge: 65

## Operating mode

AW1 continues normal D-750 multi-entity batching. Routine growth work targets approximately five reviewed entities per PR, normally 4–6. Single-entity PRs remain reserved for corrections, high-impact lifecycle updates, integrity repairs, or similarly exceptional work.

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.