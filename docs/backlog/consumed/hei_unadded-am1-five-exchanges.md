# D-750 Batch AM1 — Fenix Finance, Etherex, Emirex, FameEX, and Energiswap

Reviewed at: 2026-07-09

## Results

- `0744` Fenix Finance -> `hei_ex_000747`, inactive DEX
- `0743` Fenix Concentrated Liquidity -> consolidated under `hei_ex_000747`
- `0745` Fenix Standard Pools -> consolidated under `hei_ex_000747`
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

- Fenix Finance standard pools, concentrated-liquidity pools, SDK, and historical Blast deployment are modeled as one Fenix Finance entity.
- Etherex base, duplicate, concentrated-liquidity, and legacy source rows are modeled as one Etherex entity.
- Emirex duplicate source rows are modeled as one centralized exchange entity.
- FameEX spot and derivatives product rows are modeled as one centralized exchange entity.
- Energiswap application, SDK, contract, and token-list infrastructure remain under one Energiswap exchange entity.

## Evidence decisions

### Fenix Finance

The current first-party retrospective site states that Fenix operated on Blast in 2024–2025, processed swap-pool volume and fees, and that the team stopped working on Fenix before the next chapter became `nest`, launched in 2026. Exact terminal date is not asserted, so HEI uses `inactive` with `death_date` and `death_reason` left null. The official Fenix Finance SDK repository supports the exchange implementation identity.

### Etherex

The current first-party website identifies Etherex as a concentrated-liquidity DEX on Linea. The official `etherex-finance` organization publishes the core contract repository, which identifies Etherex as a MetaDEX built for Linea and the broader Ethereum ecosystem. Duplicate, CL, and Legacy source rows are consolidated into one entity.

### Emirex

The current first-party website exposes markets, spot trading, login and signup, fiat gateway services, professional trading tools, fees, and API documentation. Current markets and BTC/USDT spot pages remain accessible. The site footer identifies BME Technologies OÜ in Estonia as the platform operator and references a Canadian MSB license.

### FameEX

The current first-party platform exposes Markets, Trade, Futures, TradFi, Prediction Market, Referral, and Rewards navigation. Current spot-market and BTC/USDT perpetual-swap pages are accessible, and the homepage carries active promotions extending through July 2026. Spot and derivatives discovery rows are consolidated into one entity.

### Energiswap

The current first-party application endpoint is reachable. Official Energi developer documentation identifies Energiswap as a decentralized protocol for automated token exchange and publishes SDK, smart-contract, token-list, and default-token-list packages for building on and interacting with the exchange.

## Overlap and current-state findings

### GalaSwap

An initial Gala Swap draft was blocked by permanent overlap validation because current main already contains `hei_ex_000709` (`galaswap.json`) with `Gala Swap` as an alias. The draft was removed and no duplicate entity is added.

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
