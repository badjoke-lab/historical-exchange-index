# HEI Post-D-1000 Growth Audit — BX73 Globitex

Reviewed at: 2026-08-24
Issue: #867

## Decision

Promote Globitex as a conservative `inactive` historical CEX record after recovering stronger first-party operating history, group-transition evidence and present-day status evidence.

## Identity and scope

Globitex was a bitcoin/fiat centralized exchange connected to Latvia-rooted Globitex Holding. Contemporary company material confirms existing exchange infrastructure by 2017. Current exchange-directory metadata places public launch in May 2017, but HEI uses only a 2017 year-level normalization because the group's 2015 founding history and the exchange's public-launch timing should not be conflated.

The historical HEI identity is the `globitex.com` venue. A current site using `globitex.io` is not treated as the same entity because this review did not recover reliable continuity, ownership or migration evidence connecting that domain to the historical venue.

## Lifecycle and current state

First-party Nexpay/Globitex-group material states that Globitex exchange volume increased more than threefold during 2020. The same retrospective explains that the primary Globitex platform branding would move to Nexpay while the Globitex exchange remained available through that platform without interruption.

Later evidence changes the confidence boundary:

- CoinMarketCap now leaves Globitex untracked;
- an independently maintained Nexpay API client says former exchange market-data/trading methods are no longer available because the exchange was discontinued;
- 2025 issuer disclosures describe Globitex Holding as the holding company of Nexpay and Nexdesk, demonstrating continuing corporate-group identity but not an active Globitex order-book exchange.

No reliable first-party shutdown announcement or exact discontinuation date was recovered. Therefore the canonical record is `inactive`, not `dead`, with `death_date: null` and `death_reason: null`.

## Event modeling

Only one event is promoted:

- `hei_ev_010148`: 2017 year-level launch/operation marker.

No shutdown event is created because the exact terminal date is unproven. The Nexpay transition is preserved in entity notes and evidence rather than assigned a misleading event date: the currently published first-party retrospective carries a 2022-12-20 page date while its text explicitly looks back on 2020 and discusses 2021 plans.

## Evidence

- `hei_src_012635`: company-supplied 2017 Globitex/PR Newswire release;
- `hei_src_012636`: CoinMarketCap exchange profile and untracked status;
- `hei_src_012637`: first-party Nexpay/Globitex-group retrospective;
- `hei_src_012638`: maintained third-party Nexpay API client recording exchange-method discontinuation;
- `hei_src_012639`: 2025 NBX/Euronext issuer disclosure describing current Globitex Holding group structure.

## Canonical delta

- entities: +1 (`hei_ex_001168`)
- events: +1 (`hei_ev_010148`)
- evidence: +5 (`hei_src_012635`–`hei_src_012639`)

## Program boundaries

L-2 remains HOLD. No monitoring, Cloudflare, localization expansion, schema, or Ledger Series Phase 9 mutation is included.
