# D-750 Batch BF1 — Everdex, FermiSwap, Equity, Fibonacci Dex, and Forge

Reviewed at: 2026-07-10

## Results

- `0702` / `0703` Everdex -> `hei_ex_000842`, active DEX
- `0746` FermiSwap -> `hei_ex_000843`, active DEX
- `0685` Equity -> `hei_ex_000844`, active hybrid exchange
- `0754` Fibonacci Dex -> `hei_ex_000845`, limited DEX
- `0796` Forge -> `hei_ex_000846`, limited DEX

## Entity-first and status decisions

- Everdex duplicate CoinGecko and DefiLlama source rows remain one Bifrost Network DEX entity.
- FermiSwap remains one Ethereum prop-AMM exchange entity.
- Equity is modeled as one hybrid trading platform spanning spot and derivatives markets; the original application URL redirects to the v2 application.
- Fibonacci Dex remains one Form Network CLMM entity and is `limited` because residual TVL remains while recent fee windows are zero and recent volume is not exposed in the reviewed snapshot.
- Forge remains one Evmos CLMM entity and is `limited`, not `dead`, because zero current TVL and historical volume do not establish terminal shutdown.

## Evidence decisions

### Everdex

Current first-party application exposes Swap, Pool, LP Reward, Overview, wallet connection, and launch-app access. DefiLlama reports current Bifrost Network TVL and non-zero 30-day, 7-day, and 24-hour DEX volume. Confidence is `high`.

### FermiSwap

DefiLlama identifies FermiSwap as an Ethereum prop AMM and reports substantial non-zero 30-day, 7-day, and 24-hour DEX volume. A stable first-party public website was not recovered in this review pass. Confidence is `medium`.

### Equity

The original Equity application endpoint redirects to the v2 application. DefiLlama identifies Equity as a Fantom trading platform combining spot and derivative markets and reports current TVL and fee data. HEI uses `hybrid` for the combined product boundary. Confidence is `medium`.

### Fibonacci Dex

DefiLlama identifies Fibonacci Dex as a Form Network CLMM DEX and reports residual current TVL plus cumulative DEX volume while 30-day, 7-day, and 24-hour fee windows are zero. HEI uses `limited`. Confidence is `medium`.

### Forge

DefiLlama identifies Forge as a community-owned Evmos concentrated-liquidity DEX and reports zero current TVL together with substantial cumulative DEX volume and fee history. No terminal shutdown evidence was recovered, so HEI uses `limited` rather than `dead`. Confidence is `medium`.

## Current-main overlap findings

Each intended BF1 record path was confirmed absent from reviewed main before drafting. The batch uses source-range candidates only after direct current-main checks and current-state review.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 730
- projected event count: 1004
- projected evidence count: 3159
- remaining to D-750 after projected merge: 20

## Operating mode

BF1 continues normal D-750 multi-entity batching. Routine growth work targets approximately five reviewed entities per PR. No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.