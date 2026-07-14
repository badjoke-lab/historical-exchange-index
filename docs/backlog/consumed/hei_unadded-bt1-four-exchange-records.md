# D-1000 Batch BT1 — Four Exchange Records

Reviewed at: 2026-07-14

## Results

- `0641` Econia -> `hei_ex_000910`, inactive DEX
- `0644` edgeX Spot -> `hei_ex_000911`, active edgeX entity
- `0716` ExinSwap -> `hei_ex_000912`, active DEX
- `0817` FVM Exchange -> `hei_ex_000913`, active DEX

## Status decisions

Econia is inactive, not dead. The first-party repository preserves the Aptos order-book protocol but notes inactive maintenance, and current registry infrastructure places Econia in a dead-adapter corpus. No terminal date or cause is inferred.

edgeX is active based on its maintained first-party V2 SDK and a current adapter querying enabled spot markets and public volume APIs.

ExinSwap is active based on first-party AMM documentation and a current adapter querying its application volume API.

FVM Exchange is active based on a current Fantom adapter that reads its pair factory, pools, reserves, gauges, and reward mechanics. Its public URL remains live_unverified.

## Rejected duplicates

```text
0738 Fathom AMM / 0739 Fathom DEX -> existing Fathom DEX hei_ex_000686
0618 Durianfun -> existing Durian AMM hei_ex_000864
```

Fathom was detected through an alternate-slug file collision. Durianfun was detected by records validation through canonical-name and alias overlap. Both proposed records were removed; no duplicate or enrichment was required in BT1.

## Evidence decisions

Each new entity receives two evidence items. First-party repositories or documentation are used when available; current protocol adapters provide direct operational corroboration. No candidate receives an invented launch date, terminal date, death reason, legal entity, or successor.

## Batch output

- new entities: 4
- new events: 0
- new evidence: 8
- projected entity count: 794
- projected event count: 1004
- projected evidence count: 3341
- projected remaining to D-1000: 206

## Operating mode

BT1 is the tenth D-1000 growth batch during the L-2 initial HOLD period. The batch remains at four records rather than forcing a weaker fifth candidate after two overlap rejections. It adds reviewed canonical data only. No localization breadth, third-language authorization, Cloudflare configuration, or canonical schema changes are included.
