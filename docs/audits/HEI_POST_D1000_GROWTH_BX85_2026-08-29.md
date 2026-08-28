# HEI post-D1000 growth — BX85 FameEX canonical repair

Date: 2026-08-29
Base main: `9dbd646a7d4a5c567cd0a25d5e2f3d93c63c9fe3`

## Scope

BX85 does not add a duplicate FameEX entity. Fresh duplicate reconciliation found existing canonical `records/exchanges/fameex.json` (`hei_ex_000750`). This batch repairs and refreshes that existing record.

## Fresh evidence

- FameEX first-party About page identifies FameEX as a global cryptocurrency exchange operated by FAMEEX INTERNATIONAL PTY LTD, a company registered in Australia since 2020.
- FameEX first-party registration/help page repeats that operating-entity statement and says the company is registered as a Digital Currency Exchange service provider with AUSTRAC.
- FameEX announcements remain current through 2026-08-26, including new spot listings and other live exchange operations.
- Current CoinGecko and CoinMarketCap exchange pages continue to expose active spot-market data; these are corroborative only and are not used to infer safety or reserve quality.

## Canonical repair

- keep entity id `hei_ex_000750`
- keep status `active`
- keep `launch_date: null`; current evidence supports 2020 only, not an exact launch day
- change `country_or_origin` from `Global` to `Australia` based on the identified operating company
- refresh `last_verified_at` to `2026-08-29`
- add first-party operating-entity/current-status evidence
- no lifecycle event is added for routine listings, product announcements, or promotional activity

## Delta

- +0 entities
- +0 events
- +2 evidence
- +0 lineage edges

## Safety

- no duplicate FameEX entity
- no exact launch date invented
- no AUSTRAC registration interpreted as a safety endorsement
- no current trading-volume metric treated as proof of solvency or trustworthy volume
- no schema or validator changes
