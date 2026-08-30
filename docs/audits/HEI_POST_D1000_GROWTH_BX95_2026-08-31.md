# HEI Post-D1000 Growth — BX95 — 2026-08-31

## Candidate

- `hei_unadded_0738` — Fathom AMM
- related source row `hei_unadded_0739` — Fathom DEX

## Canonical result

No new entity was added. Review identified an existing canonical entity:

- `hei_ex_000686` — Fathom DEX (`fathom-dex`)
- aliases already include `Fathom AMM`
- status remains `active`
- type remains `dex`
- events remain empty

The candidate rows are therefore consumed as already represented by the existing canonical identity.

## Repair applied

The existing bundle was refreshed instead of creating a duplicate:

- direct official exchange entry point updated to `https://dapp.fathom.fi/`
- `last_verified_at` refreshed to 2026-08-31
- first-party website evidence refreshed to the current DEX link
- first-party DEX evidence refined to the AMM factory documentation
- DefiLlama evidence updated to the direct Fathom AMM metrics page

## Evidence decision

First-party Fathom material explicitly identifies Fathom DEX as Fathom's own stableswap DEX, links the live dapp, and documents the AMM pair factory. Current DefiLlama metrics classify Fathom AMM as an XDC DEX/AMM and retain non-zero TVL and cumulative DEX volume.

The CoinGecko 2022 establishment year was not promoted to an exact `launch_date`; no exact first-party launch day was established. No lifecycle event was fabricated from routine trading activity.

## Deduplication

`Fathom AMM` and `Fathom DEX` remain one canonical entity. No allowlist or validator weakening was used; the duplicate draft was removed after the overlap gate identified the pre-existing record.
