# HEI Material-Concerns Correction — BX115 — 55 Global Markets — 2026-09-10

## Scope

This batch resolves the zero-evidence legacy bundle for `hei_ex_000297` (55 Global Markets) under #857. No schema, workflow, validator, monitoring, Phase 9, or unrelated canonical record is changed.

## Identity

The exchange/platform is consistently associated with `55.com` and the name 55 Global Markets in operator-originated 2018-2019 promotional material and later exchange trackers. The canonical identity and original domain are retained.

## Launch-date correction

The prior canonical `launch_date` of `2019-01-09` was not the launch date of the exchange. Operator-originated material from 2018-10-26 already described 55 Global Markets as operating six token-exchange sub-markets, and a 2018-12-27 release described the platform before January 2019. The 2019-01-09 release explicitly launched a new Stock Token Market category. Therefore the exact exchange launch date is now `null` and the January 2019 date is preserved only as a product-category event.

## Terminal-date correction

The prior canonical `death_date` of `2020-05-01` was derived from a Cryptowisser update published that day saying that the exchange website had recently become inaccessible. The source does not establish 2020-05-01 as the date on which the exchange permanently ceased operating. The exact death date is therefore now `null`.

## Status and cause

`status: dead` is retained because the historical exchange service is no longer operating at its original domain and later market trackers show no active market data. `death_reason: unknown` is retained because no reliable source establishes insolvency, a hack, regulatory action, acquisition, or a formal voluntary shutdown as the cause.

## Jurisdiction

`country_or_origin: Unknown` is retained. Secondary descriptions variously associate the service with the United States or an Estonian license, but this batch did not verify an attributable operating legal entity or authoritative registry record sufficient to assign a jurisdiction.

## Evidence disposition

Added four evidence records:

- 2018-10-26 operator-originated promotional release showing the platform was already operating multiple sub-markets.
- 2018-12-27 operator-originated release describing 55 Global Markets before the January 2019 product launch.
- 2019-01-09 operator-originated Stock Token Market launch release.
- 2020-05-01 Cryptowisser inactivity update, used only as an inactivity-window source rather than an exact death-date source.

## Material-concerns result

The previous exact launch and death dates overstated what the evidence proves. This correction removes both unsupported exact dates while preserving the historically supported identity, dead status, unknown cause, and 55.com domain association.
