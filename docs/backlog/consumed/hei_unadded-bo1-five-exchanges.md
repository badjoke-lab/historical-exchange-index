# D-1000 Batch BO1 — AstroSwap, AuraSwap, BarterSwap Superposition, Basin Exchange, and Beam Swap

Reviewed at: 2026-07-12

## Results

- `0098` AstroSwap -> `hei_ex_000887`, limited DEX
- `0108` AuraSwap -> `hei_ex_000888`, limited DEX
- `0137` BarterSwap Superposition -> `hei_ex_000889`, active DEX
- `0141` Basin Exchange -> `hei_ex_000890`, active DEX
- `0148` Beam Swap -> `hei_ex_000891`, active DEX

Additional repair:

- `hei_ex_000541` AutoShark remains dead; former official domain status repaired from `dead_domain` to `unsafe`, with one new URL-history evidence record.

## Status decisions

- AstroSwap is `limited`, not `active` or `dead`, because its first-party site and residual Velas TVL remain while 7-day and 30-day DEX volume are zero and 24-hour volume is negligible.
- AuraSwap is `limited`, not `active` or `dead`, because residual Polygon TVL and cumulative exchange history remain while all recent DEX-volume windows are zero.
- BarterSwap Superposition is `active` because its first-party application remains reachable and current Ethereum volume is non-zero across 24-hour, 7-day, and 30-day windows.
- Basin Exchange is `active` because its first-party domain remains reachable and current data preserves roughly $3 million in TVL plus non-zero 7-day and 30-day volume.
- Beam Swap is `active` because its first-party application remains reachable and current exchange data reports recently updated markets and non-zero 24-hour volume.
- AutoShark remains `dead` because the 2022 first-party shutdown announcement is authoritative. Residual third-party metrics do not override the terminal event.

## URL safety repair

The former AutoShark official domain now serves unrelated gambling content.

HEI therefore changes:

```text
official_url_status: dead_domain -> unsafe
```

The canonical shutdown history and death date remain unchanged. The repair prevents the repurposed domain from being presented as a safe current exchange destination.

## Stale-overlap findings

The verified-unadded backlog also contained rows that already resolve to reviewed entities:

- Astroport Classic / Terra / Terra 2.0 variants already resolve to `hei_ex_000361`.
- Astrovault already resolves to `hei_ex_000530`.
- Atlantis Monad already resolves to `hei_ex_000552`.
- Atmos DEX and Atmos Studio already resolve to `hei_ex_000553` under one ecosystem-level exchange record.
- Auragi Finance already resolves to `hei_ex_000546`.
- AuroraSwap already resolves to `hei_ex_000555`.
- AutoShark already resolves to `hei_ex_000541` and was repaired rather than duplicated.
- AUX Exchange, Axial, BabyDogeSwap, BabySwap, BaseX, and Bancor version rows already resolve to reviewed records.

These stale rows were excluded from BO1 and were not duplicated.

## Evidence decisions

### AstroSwap

The first-party site remains reachable. Current protocol data preserves residual TVL and cumulative history but almost no recent trading. Confidence is `medium`.

### AuraSwap

Current registry data preserves residual TVL and historical exchange identity, but recent volume is zero. Confidence is `medium`.

### BarterSwap Superposition

The first-party application remains reachable. Current Ethereum volume is non-zero across all recent windows. Confidence is `medium`.

### Basin Exchange

The first-party domain remains reachable. Current Arbitrum and Ethereum data preserves significant TVL and recent activity. Confidence is `medium`.

### Beam Swap

The first-party JavaScript application remains reachable. Current exchange data reports seven coins, eight pairs, and non-zero 24-hour volume. Confidence is `medium`.

### AutoShark repair

The former project domain is currently repurposed into unrelated gambling content. The existing high-confidence 2022 shutdown record remains authoritative; the repair concerns URL safety only.

## Batch output

- new entities: 5
- repaired entities: 1
- new events: 0
- new evidence: 16
- projected entity count: 775
- projected event count: 1004
- projected evidence count: 3295
- projected remaining to D-1000: 225

## Operating mode

BO1 is the fifth five-entity D-1000 growth batch during the L-2 initial HOLD period. It also includes one safety-preserving repair. No localization breadth, third-language authorization, Cloudflare configuration, or canonical schema changes are included.