# D-750 Batch AQ1 — HX, HyperBlast, HyperBrick, HunnySwap, and Hello DEX

Reviewed at: 2026-07-10

## Results

- `0961` HX Finance -> `hei_ex_000767`, active DEX represented as HX / HyperExchange
- `0974` HyperBlast -> `hei_ex_000768`, active DEX
- `0975` HyperBrick -> `hei_ex_000769`, active DEX
- `0957` HunnySwap -> `hei_ex_000770`, active DEX
- `0920` Hello DEX (Ethereum) -> `hei_ex_000771`, active DEX

## Entity-first consolidation

- HX Finance and HyperExchange naming remain one HX entity with current website, documentation, and application surfaces.
- HyperBlast remains one exchange entity under the dedicated dapp.hyperblast.io application domain.
- HyperBrick website and swap route remain one exchange entity.
- HunnySwap remains one Avalanche DEX entity.
- HELLO Labs ecosystem context and the dedicated trade.thehellolabs.com exchange surface are modeled as one Hello DEX entity, separate from the broader non-exchange HELLO Labs parent activity.

## Evidence decisions

### HX

Current first-party website identifies HyperExchange as an exchange for HyperEVM and documents optimized routing, liquidity pools, concentrated liquidity, rewards, and wallet-connected trading. First-party documentation explicitly identifies hx.finance as a community-owned DEX built on Hyperliquid and documents swaps, private trading, liquidity provision, yield farming, points, fee mechanics, and smart-contract resources. Confidence is `high`.

### HyperBlast

The dedicated first-party dapp.hyperblast.io application endpoint is reachable. CoinGecko candidate data independently identifies HyperBlast under that domain. Confidence is `medium` because detailed public first-party protocol documentation was not recovered in this review pass.

### HyperBrick

Current first-party HyperBrick website and `/swap` route are reachable. DefiLlama candidate data independently identifies HyperBrick as a DEX on Hyperliquid L1. Confidence is `medium` because detailed protocol documentation is thin.

### HunnySwap

The dedicated first-party hunnyswap.com domain is reachable. DefiLlama candidate data independently identifies HunnySwap as an Avalanche DEX. Confidence is `medium` because detailed current first-party protocol documentation is thin in this review pass.

### Hello DEX

The current HELLO Labs parent site remains reachable and provides the broader protocol/ecosystem identity context. The dedicated trade.thehellolabs.com exchange subdomain is preserved, while CoinGecko candidate data independently identifies Hello DEX (Ethereum) under that domain. Confidence is `medium`; the exchange URL is `live_unverified` because the trade endpoint could not be fully fetched during this review pass.

## Current-main overlap findings

Direct current-main checks confirmed that the five AQ1 entity slugs were absent before drafting:

- `hx-finance`
- `hyperblast`
- `hyperbrick`
- `hunnyswap`
- `hello-dex-ethereum`

AP1 and earlier overlap findings remain authoritative for candidates already consumed or represented in current main. AQ1 does not redraw those entities.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 655
- projected event count: 1004
- projected evidence count: 2934
- remaining to D-750 after projected merge: 95

## Operating mode

AQ1 continues normal D-750 multi-entity batching. Routine growth work targets approximately five reviewed entities per PR, normally 4–6. Single-entity PRs remain reserved for corrections, high-impact lifecycle updates, integrity repairs, or similarly exceptional work.

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.