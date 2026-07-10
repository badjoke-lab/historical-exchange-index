# D-750 Batch BG1 — FCON DEX, Ellipsis Finance, Dswap, DyorSwap, and EagleFi

Reviewed at: 2026-07-10

## Results

- `0741` FCON DEX -> `hei_ex_000847`, limited DEX
- `0662` Ellipsis Finance -> `hei_ex_000848`, active DEX
- `0611` / `0612` Dswap -> `hei_ex_000849`, active DEX
- `0624`-`0628` DyorSwap source family -> `hei_ex_000850`, active DEX
- `0632` EagleFi -> `hei_ex_000851`, active DEX

## Status and entity decisions

- FCON DEX is `limited`, not `active` or `dead`, because residual Mantle TVL remains while recent fees and 24-hour volume are zero and no terminal shutdown evidence was recovered.
- Ellipsis Finance is `active` from a reachable first-party domain plus substantial current BNB Chain TVL and non-zero recent DEX volume.
- Dswap is modeled as the exchange-specific built-in swap surface of DAOaaS and is `active` from a reachable first-party route plus current TVL, fees, revenue, and recent DEX volume.
- DyorSwap remains one multichain entity across chain-specific, AMM, and product source rows. It is `active` from current multichain TVL and non-zero recent volume, while its first-party URL remains `live_unverified` because it timed out during this review pass.
- EagleFi is `active`; the original domain redirects to the current Massa DeWeb-hosted exchange application, and current TVL remains.

## Evidence decisions

### FCON DEX

DefiLlama identifies FCON DEX as a Mantle AMM DEX and reports residual current TVL, cumulative fees, and cumulative DEX volume while recent fees and 24-hour volume are zero. Confidence is `medium`.

### Ellipsis Finance

The current first-party website remains reachable. DefiLlama identifies Ellipsis Finance as a BNB Chain StableSwap DEX and reports substantial current TVL plus non-zero 30-day, 7-day, and 24-hour volume. Confidence is `high`.

### Dswap

The current DAOaaS swap route is reachable. DefiLlama identifies Dswap as the built-in token swap feature of DAOaaS and reports current ENI TVL, fees, protocol revenue, and substantial recent DEX volume. Confidence is `high`.

### DyorSwap

DefiLlama reports substantial current TVL across X Layer, Blast, Plasma, Ink, Unichain, Soneium, Mode, Sonic, Merlin, BOB, ZetaChain, and other networks, together with non-zero recent DEX volume. The first-party domain timed out during this pass and remains `live_unverified`. Confidence is `medium`.

### EagleFi

The original first-party domain redirects to a current Massa DeWeb-hosted EagleFi DEX application. DefiLlama identifies EagleFi as a Massa AMM DEX and reports current TVL plus cumulative fee and DEX-volume history. Confidence is `high`.

## Current-main overlap findings

Each intended BG1 record path was checked against reviewed main before drafting. Fathom DEX and Fraxswap were confirmed already represented and were not redrafted. BG1 uses only entities not represented at their intended current-main identities.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 735
- projected event count: 1004
- projected evidence count: 3174
- remaining to D-750 after projected merge: 15

## Operating mode

BG1 continues normal D-750 multi-entity batching. Routine growth work targets approximately five reviewed entities per PR. No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.