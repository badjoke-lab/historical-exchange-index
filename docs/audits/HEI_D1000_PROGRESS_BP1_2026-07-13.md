# HEI D-1000 Progress Checkpoint — BP1

Date: 2026-07-13  
Status: IN PROGRESS  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BP1 is the sixth reviewed growth batch during the L-2 initial HOLD period. It adds five reviewed centralized exchange or direct-swap entities without expanding localization scope.

## 2. Batch contents

```text
BitcoinVN      hei_ex_000891  active
Currency.com   hei_ex_000892  active
CrossTower     hei_ex_000893  limited
CoinDeal       hei_ex_000894  limited
Coingi         hei_ex_000895  limited
```

## 3. Projected reviewed state

```text
Entities: 779
Events:   1004
Evidence: 3305
```

Batch delta:

```text
Entities: +5
Events:   +0
Evidence: +10
```

Remaining to D-1000:

```text
221 reviewed entities
```

## 4. Status discipline

- BitcoinVN is active because its first-party platform exposes current swaps, VND settlement methods, account access, OTC and ATM services, and recent trades.
- Currency.com is active because its first-party platform exposes current registration, crypto purchases, instant exchange, wallets, markets, payments, and card services.
- CrossTower is limited because current directory data preserves the exchange identity and official domain but reports untracked volume and unavailable reserve data, while the first-party trading interface was not independently verified.
- CoinDeal is limited because its identity and domain remain preserved but current directory data reports untracked volume and no market or reserve data.
- Coingi is limited for the same conservative reason: preserved exchange identity and domain without verified current trading or reserve data.

## 5. Backlog freshness and overlap finding

The verified-unadded backlog contains stale rows whose names or slugs no longer match the canonical filenames used on current main.

During BP1 selection, the following proposed additions were rejected as already represented:

```text
Bitocto         -> hei_ex_000588
Bankera Exchange -> hei_ex_000544
BitPreço        -> hei_ex_000589 under bitypreco
Buda            -> hei_ex_000054 under buda-com
Bitex.la        -> hei_ex_000584 under bitex-la
```

This confirms that current canonical names, aliases, and domains must override historical `not_found` and `add_now` scan fields.

## 6. Safety boundaries

BP1 changes reviewed exchange bundles and growth checkpoint documentation only.

It does not change:

```text
Cloudflare configuration
localization route scope
L-2 HOLD decision
third-language authorization
canonical schema
public machine-readable safety rules
```

## 7. Current execution state

```text
L-2 initial decision: HOLD
D-1000 growth:        CURRENT
D-1000 BO1:           COMPLETE
D-1000 BP1:           validation pending
Language Selection:  blocked until later gate
```

## 8. Authority references

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
docs/audits/HEI_D1000_PROGRESS_BO1_2026-07-12.md
docs/backlog/consumed/hei_unadded-bp1-five-exchanges.md
records/exchanges/bitcoinvn.json
records/exchanges/currency-com.json
records/exchanges/crosstower.json
records/exchanges/coindeal.json
records/exchanges/coingi.json
```
