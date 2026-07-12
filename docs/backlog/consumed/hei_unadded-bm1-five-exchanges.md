# D-1000 Batch BM1 — Amped Finance, Apex DeFi, Aquifer, Arbitrum Exchange, and Amaterasu Finance

Reviewed at: 2026-07-12

## Results

- `0050` Amped Finance -> `hei_ex_000877`, limited DEX
- `0065` Apex DeFi -> `hei_ex_000878`, active DEX
- `0068` Aquifer -> `hei_ex_000879`, active DEX
- `0071` Arbitrum Exchange V2 + `0072` Arbitrum Exchange V3 -> `hei_ex_000880`, limited DEX, canonicalized as Arbitrum Exchange
- `0046` Amaterasu Finance -> `hei_ex_000881`, active DEX

## Status decisions

- Amped Finance is `limited`, not `active` or `dead`, because the current first-party site has shifted to a coming-soon index-backed borrowing product while registry data still preserves residual DEX and perpetual-market activity.
- Apex DeFi is `active` because its first-party site remains reachable and current protocol data preserves liquidity plus non-zero recent DEX volume.
- Aquifer is `active` because its first-party application remains reachable and current Solana DEX data reports substantial recent volume.
- Arbitrum Exchange is `limited`, not `active` or `dead`, because residual TVL and fee activity remain while 24-hour, 7-day, and 30-day DEX volume are zero.
- Amaterasu Finance is `active` because current Aurora protocol data preserves continuing liquidity and exchange registries preserve the app.amaterasu.fi identity.

## Entity-first decisions

- Arbitrum Exchange V2 and V3 are one exchange entity rather than separate version-specific entities.
- Amped Finance remains one historical exchange entity while its current first-party product direction is changing.

## Stale-overlap findings

The verified-unadded backlog contained candidates that are no longer unadded:

- `0053` Angstrom already exists as `hei_ex_000531` with a high-confidence active record.
- `0062` and `0063` ApertureSwap already exist as `hei_ex_000534` with a high-confidence active record.

These stale rows were excluded from BM1 and were not duplicated.

## Evidence decisions

### Amped Finance

The first-party site is live but presents a forthcoming borrowing product. DefiLlama still preserves residual multichain trading metrics. Confidence is `medium`, and status is limited during the product transition.

### Apex DeFi

The first-party site remains reachable. Current protocol data preserves liquidity on Avalanche, Base, and Ethereum plus non-zero recent trading volume. Confidence is `medium`.

### Aquifer

The first-party JavaScript application remains reachable. Current Solana DEX data reports substantial 24-hour, 7-day, and 30-day volume. Confidence is `medium`.

### Arbitrum Exchange

Current combined protocol data preserves V2 and V3 identity, residual liquidity, and small fee activity, but recent DEX-volume windows are zero. Confidence is `medium`.

### Amaterasu Finance

Current protocol data preserves Aurora liquidity, while CoinGecko preserves the exchange identity and application domain. The application was not independently rendered, so URL status remains unknown. Confidence is `medium`.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 765
- projected event count: 1004
- projected evidence count: 3264
- projected remaining to D-1000: 235

## Operating mode

BM1 is the third five-entity D-1000 growth batch during the L-2 initial HOLD period. No localization breadth, third-language authorization, Cloudflare configuration, or canonical schema changes are included.