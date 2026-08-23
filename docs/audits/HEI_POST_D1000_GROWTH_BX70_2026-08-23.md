# HEI Post-D-1000 Growth Audit — BX70

Date: 2026-08-23  
Status: REVIEWED IMPLEMENTATION  
Project: Historical Exchange Index (HEI)

## Scope

BX70 resolves the previously deferred CoinExchange.io lifecycle contradiction with contemporaneous shutdown evidence.

## Canonical addition

- `hei_ex_001166` — CoinExchange.io
- type: `cex`
- status: `dead`
- death reason: `voluntary_shutdown`
- death date: `2019-10-15`
- launch date: null
- country/origin: `Unknown`

## Lifecycle interpretation

CoinExchange.io announced on 2019-10-01 that its board had decided to close the exchange because continued operation was no longer economically viable. The contemporaneous announcement language explicitly denied a security breach or other incident as the cause.

The operator schedule set 2019-10-15 for suspension of trading and deposits. The website and withdrawals remained available during a later withdrawal-only run-off period. HEI therefore uses the end of trading as the terminal exchange date while preserving the later asset-return window in notes rather than treating withdrawal availability as continued exchange operation.

Events:

- `hei_ev_010141` — shutdown announced, 2019-10-01
- `hei_ev_010142` — shutdown effective / trading ended, 2019-10-15

## Evidence discipline

The original `coinexchange.io/news/post/85/` announcement is no longer directly retrievable in this review. BX70 therefore does not mislabel a secondary copy as a first-party source.

The record uses four transparent historical sources:

- a contemporaneous BitcoinTalk reproduction of the operator notice;
- Crypto Watch / Impress contemporaneous coverage;
- CryptoNinjas contemporaneous coverage;
- Cryptowisser historical inactive/closure tracking.

No hack, exploit, insolvency, regulatory action, or security-breach event is created.

## Delta

- entities: +1
- events: +2
- evidence: +4

## Boundaries

BX70 preserves:

- L-2 HOLD;
- existing localization scope;
- monitoring boundaries;
- Cloudflare configuration;
- canonical schema;
- Ledger Series Phase 9 scope.

No horizontal Phase 9 files are modified.
