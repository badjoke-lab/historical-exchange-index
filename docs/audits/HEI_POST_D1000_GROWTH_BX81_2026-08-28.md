# HEI post-D-1000 growth audit — BX81 — 2026-08-28

## Scope

Lane A canonical growth only. Adds GetBTC as a reviewed historical inactive centralized exchange record.

Base main: `0445e828a829e86d095fe697731b6aca33d3729f`.

## Canonical reconciliation

Repository search found GetBTC only in backlog/scan material and verified-unadded candidate files; no canonical `records/exchanges/getbtc.json` existed on the BX81 base main.

## Evidence review

1. 2017-07-05 operator announcement — the `ExchangeGetBTC` Bitcointalk account opened a GetBTC.org exchange announcement thread and described the exchange/support endpoint.
2. 2019-07-16 disruption/relaunch marker — Cryptowisser records that GetBTC's own website displayed a message that the project was trying to be reborn.
3. 2020-11-01 follow-up — Cryptowisser records that the website was still unavailable. HEI does not turn this observation into an exact shutdown date.
4. Current status — CoinMarketCap currently marks GetBTC as inactive and retains getbtc.org as its historical website.

## Modeling decision

- entity status: `inactive`
- death reason: `unknown`
- death date: `null`
- launch date: `2017-07-05`, based on the dated operator announcement rather than an asserted first-trade timestamp
- country/origin: `Global`; conflicting historical directory jurisdiction labels are not promoted without a durable reviewed operating-jurisdiction artifact
- official URL status: `unknown`; historical unavailability is documented, but this pass does not overclaim current domain ownership/safety state
- no scam, insolvency, regulatory, or voluntary-shutdown inference

## ID allocation

From current main after BX80:

- entity: `hei_ex_001178`
- events: `hei_ev_010206`–`hei_ev_010207`
- evidence: `hei_src_012711`–`hei_src_012713`

`hei_src_012710` is already consumed by the merged BX80 GBX repair and is not reused.

## Source-count check

- `hei_ev_010206`: 1 directly linked evidence
- `hei_ev_010207`: 1 directly linked evidence

## Delta

- +1 entity
- +2 events
- +3 evidence
- +0 lineage edges

## Boundaries

No schema, validator, monitoring, localization, Phase 9 production, or machine-readable contract changes are included.

If main advances before merge, BX81 must be replayed/re-IDed from the then-current main instead of merging stale IDs.
