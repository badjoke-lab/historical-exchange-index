# D-750 Batch BH1 — DPEX, EchoDEX, Earnium, E3, and EGAS swap

Reviewed at: 2026-07-10

## Results

- `0603` DPEX -> `hei_ex_000852`, limited DEX
- `0637`-`0639` EchoDEX source family -> `hei_ex_000853`, active DEX
- `0634` Earnium -> `hei_ex_000854`, active DEX
- `0631` E3 -> `hei_ex_000855`, active DEX
- `0646` EGAS swap -> `hei_ex_000856`, active DEX

## Status and entity decisions

- DPEX is `limited`, not `active` or `dead`, because residual Polygon TVL and substantial historical derivatives volume remain while recent volume windows were not exposed and no terminal shutdown evidence was recovered.
- EchoDEX is `active` from current Linea TVL and non-zero 30-day, 7-day, and 24-hour DEX volume; V2 and V3 source rows remain one entity.
- Earnium is `active` from current Aptos liquidity, substantial cumulative DEX volume, and continuing 2026 income activity.
- E3 is `active` from current multichain TVL and non-zero recent volume across Base, Fantom, and Arbitrum.
- EGAS swap is `active` from a reachable first-party ENI application surface, current TVL, and substantial recent DEX volume.

## Evidence decisions

### DPEX

DefiLlama identifies DPEX as a Polygon decentralized perpetual exchange with up to 50x leverage and reports residual current TVL plus substantial cumulative volume. Confidence is `medium` and HEI uses `limited` conservatively.

### EchoDEX

DefiLlama identifies EchoDEX as a Linea DEX and reports current TVL plus non-zero recent volume. Versioned V2 and V3 discovery rows are consolidated into one entity. Confidence is `medium`.

### Earnium

DefiLlama identifies Earnium as an Aptos DEX and liquidity engine and reports current TVL, substantial cumulative DEX volume, and continuing 2026 income activity. Confidence is `medium`.

### E3

The current first-party Eliteness Network surface remains reachable. DefiLlama reports current TVL across Base, Fantom, and Arbitrum together with non-zero 30-day, 7-day, and 24-hour DEX volume. Confidence is `high`.

### EGAS swap

The current first-party ENI XPlan application surface remains reachable. DefiLlama identifies EGAS swap as an ENI native swap protocol and reports current TVL plus substantial non-zero recent DEX volume. Confidence is `high`.

## Current-main overlap findings

Each intended BH1 record path was confirmed absent from reviewed main before drafting. Versioned source rows for EchoDEX are intentionally consolidated into a single entity-first record.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 740
- projected event count: 1004
- projected evidence count: 3189
- remaining to D-750 after projected merge: 10

## Operating mode

BH1 continues normal D-750 multi-entity batching. No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.