# HEI WOO X withdrawal-processing incident — 2026-09-06

## Scope

This review updates the existing WOO X record (`hei_ex_000245`) after WOO X publicly acknowledged recent withdrawal-processing delays. It does not introduce a new entity and does not infer a hack, insolvency, or platform-wide withdrawal suspension.

## Reviewed evidence

### First-party

WOO X posted a public statement on 2026-09-06 acknowledging reports about withdrawal processing times. The exchange said it was reviewing affected cases and system status and that some requests might still be under review or on-chain processing. It directed affected users to official support with UID, withdrawal order ID, request time, asset/network information, and status screenshots.

Source:

- https://x.com/_WOO_X/status/2096619239142801415

### Independent reporting

FinanceFeeds reported multiple users describing withdrawals remaining in pending, processing, or submitted states for up to three days, with some canceled attempts. The report explicitly states that the complaints do not establish a platform-wide withdrawal suspension and that the number of affected users, assets, networks, and amounts remained unclear.

Source:

- https://financefeeds.com/woo-x-users-report-crypto-withdrawals-stuck-for-up-to-three-days/

## HEI classification

### Entity status

`active` -> `limited`

Reason: withdrawal is a material customer function, and the combination of a first-party acknowledgement plus multiple independent user reports establishes a current operational limitation. The reviewed evidence does not establish a total platform shutdown, but it is stronger than a routine isolated delay signal.

### Event

- `hei_ev_010232`
- `event_type: service_outage`
- `event_status_effect: limited`
- `impact_level: high`

`service_outage` is used instead of `withdrawal_suspended` because no reviewed source establishes that WOO X suspended withdrawals across the platform.

### Evidence

- `hei_src_012779` — first-party WOO X statement on X
- `hei_src_012780` — FinanceFeeds independent report

## Explicit non-inferences

This review does **not** establish any of the following:

- platform-wide withdrawal suspension;
- confirmed customer asset loss;
- a new security breach;
- insolvency or liquidity shortfall;
- a financial linkage between WOO X and BitMart's restructuring;
- terminal shutdown or dead-side classification.

WOO X therefore remains a live exchange with `status: limited`, not `dead`, `inactive`, or `insolvency`-classified.

## Follow-up condition

When WOO X publishes a resolution or reliable evidence shows withdrawals have normalized, the current entity status should be reviewed for restoration to `active`. If instead restrictions broaden or stronger financial/security evidence emerges, HEI should add a new reviewed event rather than back-projecting unsupported causes into this incident.
