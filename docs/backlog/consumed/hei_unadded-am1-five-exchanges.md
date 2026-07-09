# D-750 Batch AM1 — Gala Swap, Etherex, Emirex, FameEX, and Energiswap

Reviewed at: 2026-07-09

## Results

- `0825` Gala Swap -> `hei_ex_000747`, active DEX
- `0826` Gala Swap duplicate source row -> consolidated under `hei_ex_000747`
- `0690` Etherex -> `hei_ex_000748`, active DEX
- `0691` Etherex duplicate source row -> consolidated under `hei_ex_000748`
- `0692` Etherex CL -> consolidated under `hei_ex_000748`
- `0693` Etherex Legacy -> consolidated under `hei_ex_000748`
- `0667` Emirex -> `hei_ex_000749`, active CEX
- `0666` Emirex duplicate source row -> consolidated under `hei_ex_000749`
- `0729` FameEX -> `hei_ex_000750`, active CEX
- `0728` FameEX alternate source row -> consolidated under `hei_ex_000750`
- `0730` FameEX Derivatives -> product row consolidated under `hei_ex_000750`
- `0671` Energiswap -> `hei_ex_000751`, active DEX
- `0670` Energiswap duplicate source row -> consolidated under `hei_ex_000751`

## Entity-first consolidation

- GalaSwap API, trading-bot, swap creation, and swap acceptance surfaces remain under one Gala Swap exchange entity.
- Etherex base, duplicate, concentrated-liquidity, and legacy source rows are modeled as one Etherex entity.
- Emirex duplicate source rows are modeled as one centralized exchange entity.
- FameEX spot and derivatives product rows are modeled as one centralized exchange entity.
- Energiswap application, SDK, contract, and token-list infrastructure remain under one Energiswap exchange entity.

## Evidence decisions

### Gala Swap

The official GalaChain organization publishes a GalaSwap trading-bot implementation that explicitly identifies GalaSwap as an exchange and documents API-driven swap creation, swap acceptance, market-rate comparison, liquidity offering, trading-pair controls, and GalaChain wallet authentication. The repository links the GalaSwap API documentation used for exchange interaction.

### Etherex

The current first-party website identifies Etherex as a concentrated-liquidity DEX on Linea. The official `etherex-finance` organization publishes the core contract repository, which identifies Etherex as a MetaDEX built for Linea and the broader Ethereum ecosystem. Duplicate, CL, and Legacy source rows are consolidated into one entity.

### Emirex

The current first-party website exposes markets, spot trading, login and signup, fiat gateway services, professional trading tools, fees, and API documentation. Current markets and BTC/USDT spot pages remain accessible. The site footer identifies BME Technologies OÜ in Estonia as the platform operator and references a Canadian MSB license.

### FameEX

The current first-party platform exposes Markets, Trade, Futures, TradFi, Prediction Market, Referral, and Rewards navigation. Current spot-market and BTC/USDT perpetual-swap pages are accessible, and the homepage carries active promotions extending through July 2026. Spot and derivatives discovery rows are consolidated into one entity.

### Energiswap

The current first-party application endpoint is reachable. Official Energi developer documentation identifies Energiswap as a decentralized protocol for automated token exchange and publishes SDK, smart-contract, token-list, and default-token-list packages for building on and interacting with the exchange.

## Excluded after current-state review

### Fenix Finance

Fenix Finance was not included as an active record. Its current official website states that the protocol ran in 2024–2025, that work on Fenix stopped, and that the next chapter became `nest`, with the new protocol launching in 2026. This is a lifecycle/rebrand or successor research case rather than a routine active-growth addition.

### FXDX

FXDX was not included. The current official website presents `V2` and a `Join waitlist` state rather than a clearly active exchange surface. It remains a separate current-state/lifecycle research case.

### Weak-source candidates

FWX DEX, Futarchy AMM, and FVM Exchange were not forced into this batch because current first-party evidence was not strong enough during this review pass. They remain candidates for later research.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 635
- projected event count: 1004
- projected evidence count: 2874
- remaining to D-750 after projected merge: 115

## Operating mode

AM1 continues normal D-750 multi-entity batching. Routine growth work targets approximately five reviewed entities per PR, normally 4–6. Single-entity PRs remain reserved for corrections, high-impact lifecycle updates, integrity repairs, or similarly exceptional work.

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.
