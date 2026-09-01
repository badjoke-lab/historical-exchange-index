# HEI Post-D1000 Growth — BX95 Fathom rescue — 2026-09-01

## Candidate

- `hei_unadded_0738` — Fathom AMM
- related source row `hei_unadded_0739` — Fathom DEX

## Canonical result

No new entity is added. Review identified an existing canonical entity:

- `hei_ex_000686` — Fathom DEX (`fathom-dex`)
- aliases already include `Fathom AMM`
- status remains `active`
- type remains `dex`
- events remain empty

The candidate rows are consumed as already represented by the existing canonical identity.

## Repair applied

The existing bundle is refreshed instead of creating a duplicate:

- direct official exchange entry point updated to `https://dapp.fathom.fi/`
- `last_verified_at` refreshed to 2026-08-31
- first-party website evidence refreshed to the current DEX link
- first-party DEX evidence refined to the AMM factory documentation
- DefiLlama evidence updated to the direct Fathom AMM metrics page

## Evidence decision

First-party Fathom material explicitly identifies Fathom DEX as Fathom's own stableswap DEX, links the live dapp, and documents the AMM pair factory. Current DefiLlama metrics classify Fathom AMM as an XDC DEX/AMM and retain non-zero TVL and cumulative DEX volume.

The CoinGecko 2022 establishment year is not promoted to an exact `launch_date`; no exact first-party launch day was established. No lifecycle event is fabricated from routine trading activity.

## Deduplication and rescue correction

`Fathom AMM` and `Fathom DEX` remain one canonical entity. The superseded PR #928 contained stale consumed-document references to proposed ID `hei_ex_001189` even though its canonical patch correctly targeted existing entity `hei_ex_000686`. This rescue branch starts from current `main` and fixes that internal inconsistency rather than carrying the stale allocation forward.

No allowlist or validator weakening is used.