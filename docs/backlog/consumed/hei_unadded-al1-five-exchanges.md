# D-750 Batch AL1 — Elektrik, Elk Finance, Ethervista, Flamingo Finance, and EverySwap

Reviewed at: 2026-07-09

## Results

- `0653` Elektrik -> `hei_ex_000742`, active DEX
- `0659` Elk -> `hei_ex_000743`, active DEX
- `0660` Elk Finance -> consolidated under `hei_ex_000743`
- `0661` Elk Finance (Avalanche) -> consolidated under `hei_ex_000743`
- `0696` Ethervista -> `hei_ex_000744`, active DEX
- `0767` Flamingo Finance -> `hei_ex_000745`, active DEX
- `0704` EverySwap -> `hei_ex_000746`, active DEX

## Entity-first consolidation

- Elektrik V2 and product-guide representations are modeled as one Elektrik entity.
- Elk, Elk Finance, ElkDEX, and chain-specific discovery rows are modeled as one Elk Finance entity.
- Ethervista documentation, application, and deployed-contract surfaces remain under one exchange entity.
- Flamingo Swap and broader Flamingo Finance exchange surfaces are modeled as one Flamingo Finance entity.
- EverySwap swap and V3 liquidity-position surfaces remain under one EverySwap entity.

## Evidence decisions

### Elektrik

Current first-party documentation identifies Elektrik as a LightLink DEX and documents AMM trading, token swaps, limit orders, TWAPs, liquidity pools, analytics, routes, non-fungible concentrated-liquidity positions, and direct application connection instructions.

### Elk Finance

Current first-party website identifies DEX and liquidity farming as available products, states that ELK is distributed through liquidity farming on ElkDEX, and describes the exchange as a Uniswap v2 AMM DEX whose trading fees flow to liquidity providers. Current documentation links the exchange, analytics, LP APIs, farming, and live application.

### Ethervista

First-party documentation presents Ethervista as a redesign of decentralized exchange dynamics and documents its AMM model, ETH-denominated fee distribution, configurable pool fees, protocol-fee routing, liquidity locks, and long-term LP revenue sharing. The official-links page identifies the DEX application and deployed-contract repository, and the application endpoint is reachable.

### Flamingo Finance

The current Flamingo N3 frontend is reachable. The official Flamingo Finance GitHub organization publishes the Flamingo Swap contract repository, which identifies Flamingo Swap as an on-chain AMM and documents constant-product token trading and liquidity provision. June 2026 DEX registry data provides current corroboration.

### EverySwap

The current first-party application exposes wallet-connected swaps, token selection, configurable slippage, liquidity-pool navigation, new-position creation, and V3 liquidity-position management. Confidence is medium because public protocol documentation is thin; the June 2026 exchange candidate corpus corroborates the everyswap.io exchange identity.

## Main-overlap findings during batch construction

Direct current-main checks found several stale `add_now` assumptions that were not re-added:

- Enosys -> existing `hei_ex_000683`
- Equalizer Exchange -> existing `hei_ex_000684`
- EXMO -> existing `hei_ex_000685`
- Fathom DEX -> existing `hei_ex_000686`
- Extended -> existing `hei_ex_000688`
- Hata -> existing `hei_ex_000696`
- FlowX -> existing `hei_ex_000707`

These findings reinforce the rule that scan dispositions are candidate hypotheses and current reviewed main plus permanent overlap validation are authoritative.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 630
- projected event count: 1004
- projected evidence count: 2859
- remaining to D-750 after projected merge: 120

## Operating mode

AL1 restores normal D-750 growth to multi-entity batching. Routine growth work should target approximately five reviewed entities per PR, normally 4–6, rather than returning to one-entity growth PRs. Single-entity PRs are reserved for corrections, high-impact lifecycle updates, integrity repairs, or similarly exceptional work.

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.
