# D-1000 Batch BT1 — Five Exchange Records

Reviewed at: 2026-07-14

## Results

- `0618` Durianfun -> `hei_ex_000909`, active Durianfun AMM entity
- `0641` Econia -> `hei_ex_000910`, inactive DEX
- `0644` edgeX Spot -> `hei_ex_000911`, active edgeX entity
- `0716` ExinSwap -> `hei_ex_000912`, active DEX
- `0817` FVM Exchange -> `hei_ex_000913`, active DEX

## Status decisions

Durianfun AMM is active based on current production-factory, liquidity, and swap adapters covering 2026 protocol generations and graduated AMM pools.

Econia is inactive, not dead. The first-party repository preserves the Aptos order-book protocol but notes inactive maintenance, and current registry infrastructure places Econia in a dead-adapter corpus. No terminal date or cause is inferred.

edgeX is active based on its maintained first-party V2 SDK and a current adapter querying enabled spot markets and public volume APIs.

ExinSwap is active based on first-party AMM documentation and a current adapter querying its application volume API.

FVM Exchange is active based on a current Fantom adapter that reads its pair factory, pools, reserves, gauges, and reward mechanics. Its public URL remains live_unverified.

## Rejected duplicate

```text
0738 Fathom AMM / 0739 Fathom DEX -> existing Fathom DEX hei_ex_000686
```

The old candidate rows were already consolidated in the existing entity. No duplicate or enrichment was required in BT1, and FVM Exchange replaced the candidate.

## Evidence decisions

Each new entity receives two evidence items. First-party repositories or documentation are used when available; current protocol adapters provide direct operational corroboration. No candidate receives an invented launch date, terminal date, death reason, legal entity, or successor.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 10
- projected entity count: 795
- projected event count: 1004
- projected evidence count: 3343
- projected remaining to D-1000: 205

## Operating mode

BT1 is the tenth D-1000 growth batch during the L-2 initial HOLD period. It adds reviewed canonical data only. No localization breadth, third-language authorization, Cloudflare configuration, or canonical schema changes are included.
