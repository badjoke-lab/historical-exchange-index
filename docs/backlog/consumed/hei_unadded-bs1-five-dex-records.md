# D-1000 Batch BS1 — Five DEX Records

Reviewed at: 2026-07-14

## Results

- `0520` Dark KnightSwap -> `hei_ex_000904`, inactive DEX
- `0568` Dexter Exchange -> `hei_ex_000905`, inactive DEX
- `0570` Dezswap -> `hei_ex_000906`, active DEX
- `0583` DipCoin Spot -> `hei_ex_000907`, active DipCoin entity
- `0584` Diviswap -> `hei_ex_000908`, active DEX

## Status decisions

Dark KnightSwap retains a historical first-party exchange codebase and official domain reference, but current operability was not independently verified. It is inactive, not dead.

Dexter Exchange is preserved by the DEX registry as a Tezos venue. The review did not establish a current first-party interface, exact terminal date, or reliable relationship to later Dexter2 implementations, so it is inactive with no lifecycle event.

Dezswap is active based on first-party application code updated in April 2026 that defines XPLA and Fetch.ai network support, mainnet contracts, and dezswap.io API endpoints.

DipCoin Spot is consolidated into one DipCoin exchange entity. First-party trading documentation updated in May 2026 and a current-running DefiLlama adapter support active status.

DiviSwap is active based on first-party interface metadata identifying a Chiliz Chain DEX at diviswap.io and current registry corroboration.

## Rejected duplicate

```text
0573 DFX V2 -> existing DFX Finance hei_ex_000739
```

The old candidate slug hid the current-main entity-level record. Existing DFX Finance already consolidates DFX V2 and V3, so no new entity or enrichment was required in BS1.

## Evidence decisions

Each new entity receives two evidence items. Current first-party code or documentation is preferred where available; registry evidence is used for independent identity or status corroboration. No candidate receives an invented launch date, terminal date, death reason, legal entity, or successor.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 10
- projected entity count: 790
- projected event count: 1004
- projected evidence count: 3333
- projected remaining to D-1000: 210

## Operating mode

BS1 is the ninth D-1000 growth batch during the L-2 initial HOLD period. It adds reviewed canonical data only. No localization breadth, third-language authorization, Cloudflare configuration, or canonical schema changes are included.