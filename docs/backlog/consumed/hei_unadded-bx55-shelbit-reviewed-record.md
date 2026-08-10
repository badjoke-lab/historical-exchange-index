# BX55 consumed candidate — Shelbit

Date: 2026-08-10

## Candidate

```text
Shelbit
Shelbit Exchange
Shelbit General Trading L.L.C
historical domain: shelbit.com
```

## Origin

Current-event review after the 2026-08-10 HEI monitoring triage. This candidate did not come from the original numbered 1,000-candidate backlog and is recorded here so later candidate scans do not treat the same current-event case as unreviewed work.

## Dedupe result

Repository search before assignment found no existing Shelbit entity or record bundle. The next reviewed IDs from BX54 were also checked for collision before use.

## Classification

```text
add_now
status: inactive
type: cex
country_or_origin: United Arab Emirates
```

## Why add now

- first-party regulator enforcement exists;
- the regulator explicitly identifies the Shelbit legal/trade identity;
- independent Reuters reporting documents exchange activity and public-access history;
- a later sanctions event materially extends the historical timeline;
- operational status is conflicting enough to benefit from HEI's conservative `inactive` state rather than a forced `dead` classification.

## Why not dead

Reviewed sources do not establish one uncontested terminal date. Shelbit reportedly said operations ceased in January 2026, while VARA said in July that it had continued to provide virtual-asset services. HEI therefore preserves the conflict in notes and leaves `death_date` / `death_reason` unset.

## Canonical bundle

```text
records/exchanges/shelbit.json
```
