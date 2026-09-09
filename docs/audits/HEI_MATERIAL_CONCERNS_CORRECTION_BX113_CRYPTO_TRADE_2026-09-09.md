# HEI Material-Concerns Correction — BX113 Crypto-Trade — 2026-09-09

## Scope

This batch repairs the zero-evidence legacy record `hei_ex_000246` (Crypto-Trade) under issue #857. No schema, workflow, validator, monitoring, Phase 9, or unrelated canonical records are changed.

## Identity correction

The reviewed 2013-2015 exchange operated at `crypto-trade.com` and was promoted in the Bitcoin Forum thread `[CRYPTO-TRADE] Crypto-trade.com IPO and official thread!` by project/operator accounts associated with Esecurity S.A.

The prior canonical record incorrectly used `crypto-trade.net`. That domain belongs to a later service whose own 2016 announcement described itself as newly alive after more than a year of development. Treating that later service as the 2013-2015 exchange conflated two separate identities.

Correction:

- `official_url_original`: `https://crypto-trade.net/` -> `https://crypto-trade.com/`
- `official_domain_original`: `crypto-trade.net` -> `crypto-trade.com`
- archived URL moved from `.net` to `.com`
- alias `Crypto-Trade.net` -> `Crypto-Trade.com`

## Launch date

The prior exact `2013-01-01` is unsupported. The original project thread begins in March 2013 and contains multiple planned launch dates in April 2013, including an initially planned 1 April launch, then 2 April, and later a statement that the project would be launched by 15 April. Those are planning statements, not proof of an exact first-live day.

Correction: `launch_date` -> `null`.

No `launched` event is emitted.

## Terminal lifecycle

A contemporaneous Bitcoin Forum post on 2015-01-28 preserves Crypto-Trade's shutdown notice. The notice stated that low volume and weak user growth left the exchange unable to cover server rental, staff salary, and promotion expenses; users were asked to withdraw within 48 hours; and the site would go offline on 2015-01-29 at 06:00 UTC.

A separate contemporaneous fund thread on 2015-01-27 independently referred to the closure of `crypto-trade.com` and repeated the same 2015-01-29 06:00 UTC cutoff.

Therefore:

- `status: dead` retained
- `death_reason: voluntary_shutdown` retained
- `death_date: 2015-01-29` retained
- event `hei_ev_010238` added as `shutdown_effective`

The shutdown notice is treated as evidence of the operator-announced permanent closure and economic rationale. Allegations by community posters about fraud, theft, or mishandling of shareholder assets are not promoted into canonical findings because this batch does not establish those claims through authoritative adjudication or primary evidence.

## Origin

Historical material associates Crypto-Trade with Esecurity S.A. and includes a Hong Kong address. This batch does not convert that address into a definitive operating jurisdiction for the exchange. `country_or_origin` remains `Unknown`.

## Evidence added

- `hei_src_012792` — operator-originated Bitcoin Forum project thread; identity and launch-planning context
- `hei_src_012793` — contemporaneous Bitcoin Forum preservation of the shutdown notice
- `hei_src_012794` — independent contemporaneous closure/cutoff corroboration

## Result

The record now identifies the correct historical domain, removes an unsupported exact launch date, preserves the evidence-supported terminal date and voluntary-shutdown classification, and adds lifecycle/evidence links without importing allegations as findings.
