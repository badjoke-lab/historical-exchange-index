# D-750 Batch AU1 — FanX Protocol, FeeFree, Ferra, Excalibur, and FairySwap

Reviewed at: 2026-07-10

## Results

- `0732` FanX Protocol / Kayen -> `hei_ex_000787`, active DEX
- `0733` FanX Protocol alternate row -> consolidated under `hei_ex_000787`
- `0742` FeeFree -> `hei_ex_000788`, limited DEX
- `0747` Ferra DLMM -> `hei_ex_000789`, active DEX represented as Ferra
- `0748` Ferra CLMM -> consolidated under `hei_ex_000789`
- `0749` Ferra DLMM duplicate row -> consolidated under `hei_ex_000789`
- `0712` Excalibur -> `hei_ex_000790`, limited DEX
- `0727` FairySwap V1 -> `hei_ex_000791`, limited DEX represented as FairySwap

## Entity-first consolidation

- Kayen and FanX Protocol discovery representations remain one Chiliz AMM exchange entity.
- FeeFree deployments across Base, Scroll, and Zora remain one FeeFree DEX entity.
- Ferra DLMM and CLMM source rows remain one Sui exchange entity.
- Excalibur remains one Fantom AMM DEX entity.
- FairySwap V1 remains one Findora DEX entity.

## Evidence decisions

### FanX Protocol

The current first-party FanX application is reachable. DefiLlama independently classifies FanX Protocol as an AMM DEX on Chiliz and reports current TVL, fees, revenue, and DEX volume. Confidence is `high`.

### FeeFree

The first-party FeeFree GitHub organization identifies FeeFree as a decentralized exchange offering a zero-LP-fee DeFi experience and links the public application plus frontend and contract repositories. DefiLlama reports current TVL across Zora, Scroll, and Base but zero recent DEX volume. HEI therefore classifies FeeFree as `limited` rather than `active`. Confidence is `high`.

### Ferra

The current first-party Ferra website remains reachable. DefiLlama classifies Ferra DLMM as a Sui DEX and reports current TVL, fees, revenue, and substantial current and cumulative DEX volume. HEI consolidates DLMM and CLMM source rows under one Ferra entity. Confidence is `high`.

### Excalibur

DefiLlama continues to classify Excalibur as an audited Fantom AMM and reports current TVL, but current trading-volume evidence is weak and a stable first-party application response was not fully verified during this pass. HEI therefore uses `limited` status and `live_unverified` URL status. Confidence is `medium`.

### FairySwap

DefiLlama identifies FairySwap V1 as a Findora DEX and reports current TVL plus historical cumulative DEX volume. Current 24-hour DEX volume is zero and the first-party website could not be fully fetched in this review pass, so HEI uses `limited` status and `live_unverified` URL status. Confidence is `medium`.

## Current-main overlap findings

Direct current-main checks prevented stale scan assumptions from creating duplicate drafts:

- FameEX -> existing `hei_ex_000750`
- Fenix Finance -> existing `hei_ex_000747`
- Fathom DEX -> existing `hei_ex_000686`
- Ferro -> existing `hei_ex_000687`

AU1 was assembled only from candidates confirmed absent from current main and conservatively classified according to current evidence quality.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 675
- projected event count: 1004
- projected evidence count: 2994
- remaining to D-750 after projected merge: 75

## Operating mode

AU1 continues normal D-750 multi-entity batching. Routine growth work targets approximately five reviewed entities per PR, normally 4–6. Single-entity PRs remain reserved for corrections, high-impact lifecycle updates, integrity repairs, or similarly exceptional work.

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.