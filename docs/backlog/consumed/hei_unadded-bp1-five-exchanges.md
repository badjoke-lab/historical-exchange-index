# D-1000 Batch BP1 — Five Reviewed Exchanges

Reviewed at: 2026-07-13

## Results

- `0194` BitcoinVN -> `hei_ex_000891`, active CEX/direct-swap exchange
- `0488` Currency.com -> `hei_ex_000892`, active CEX
- `0461` CrossTower -> `hei_ex_000893`, limited CEX
- `0403` CoinDeal -> `hei_ex_000894`, limited CEX
- `0410` Coingi -> `hei_ex_000895`, limited CEX

## Status decisions

- BitcoinVN is `active` because its current first-party platform exposes wallet-settled swaps, VND bank and cash methods, OTC, ATM, API, account access, and recent trades.
- Currency.com is `active` because its current first-party platform exposes registration, crypto purchases, instant exchange, wallets, markets, banking links, payments, and card services.
- CrossTower is `limited` because the exchange identity, official domain, United States origin, and 2020 founding remain documented while current volume is untracked and reserve data is unavailable.
- CoinDeal is `limited` because the exchange identity and official domain remain preserved while current volume, market, and reserve data are unavailable.
- Coingi is `limited` because its exchange identity and official domain remain preserved while current volume, market, and reserve data are unavailable.

## Stale-overlap findings

The verified-unadded corpus and scan dispositions are historical snapshots, not current-main truth. BP1 selection rejected the following stale candidates after alternate-slug and domain checks:

```text
Bitocto          -> existing hei_ex_000588
Bankera Exchange -> existing hei_ex_000544
BitPreço         -> existing hei_ex_000589 / bitypreco
Buda             -> existing hei_ex_000054 / buda-com
Bitex.la         -> existing hei_ex_000584 / bitex-la
```

These rows were not duplicated.

## Evidence decisions

### BitcoinVN

Two first-party surfaces establish the current exchange service, 2013 company founding, 2014 operating start, current VND and crypto swap methods, and continuing original-team operation.

### Currency.com

The current first-party platform and legal surface establish the active digital-asset exchange and related multi-currency service framework.

### CrossTower

The current directory profile preserves the first-party domain, exchange identity, United States origin, and 2020 founding, but the untracked-volume state does not support a full active claim.

### CoinDeal

The current directory profile preserves the exchange and domain but reports no tracked market or reserve data. Limited status avoids inferring either normal operation or terminal closure.

### Coingi

The current directory profile preserves the exchange and domain but reports no tracked market or reserve data. Limited status avoids an unsupported active or dead classification.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 10
- projected entity count: 779
- projected event count: 1004
- projected evidence count: 3305
- projected remaining to D-1000: 221

## Operating mode

BP1 is the sixth D-1000 growth batch during the L-2 initial HOLD period. It adds reviewed canonical data only. No localization breadth, third-language authorization, Cloudflare configuration, or canonical schema changes are included.
