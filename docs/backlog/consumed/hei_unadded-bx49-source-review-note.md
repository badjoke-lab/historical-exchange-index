# BX49 source review boundaries

Date: 2026-08-09  
Status: reviewed support note

## Scope

BX49 uses current first-party exchange surfaces together with the Astana Financial Services Authority public register. All four additions are Kazakhstan-based Digital Asset Trading Facility operators or exchange brands tied to such operators.

## ATAIX Eurasia

The current ATAIX Eurasia surface presents live spot trading, instant exchange, wallet, P2P, fiat funding, and API functions. AFSA lists ATAIX Eurasia Ltd. under licence `AFSA-A-LA-2025-0022` as active for Operating a Digital Asset Trading Facility, custody, and principal/agent dealing in digital assets.

The full-authorisation date is not converted into an exact platform launch date.

## DeltaDA

The current DeltaDA surface identifies Delta DA Ltd. as a regulated crypto exchange operator and presents exchange-based and OTC execution plus custody. AFSA lists licence `AFSA-G-LA-2021-0019` as active for Operating a Digital Asset Trading Facility through 2027-01-31.

The company's statement that it was established in 2021 is not converted into an exact platform launch date.

## CaspianEx

The current CaspianEx surface presents exchange trading, quick exchange, registration, and funding and identifies Top Line Limited as operator. Its footer still displays an older sandbox expiry date. AFSA's current licence entry for `AFSA-G-LA-2022-0011` instead shows active status through 2026-12-31 and records an earlier 2023 voluntary suspension followed by reactivation.

HEI uses the current regulator status rather than the stale footer expiry text. No 2023 event is added in BX49 because this batch is scoped to present identity and status rather than reconstructing the earlier suspension timeline.

## Intebix

The current Intebix platform remains reachable but displays an infrastructure-upgrade notice stating that trading and balance operations are temporarily unavailable. AFSA lists licence `AFSA-G-LA-2022-0004` as active for Operating a Digital Asset Trading Facility through 2026-09-01.

HEI therefore uses:

```text
status: limited
death_reason: null
death_date: null
```

No dated event is added because the reviewed first-party notice does not provide a reliable start date for the current interruption.

## Exclusions

BX49 does not infer:

- exact launch dates from licence dates;
- trading volume, liquidity, solvency, custody quality, or security quality;
- predecessor, successor, merger, acquisition, or rebrand relationships;
- permanent closure from Intebix's current temporary interruption;
- historical Biteeu/Intebix identity continuity without reviewed first-party evidence;
- broader regulatory approval beyond the cited AIFC/AFSA scope.
