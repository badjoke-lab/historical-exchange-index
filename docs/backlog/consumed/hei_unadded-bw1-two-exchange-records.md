# D-1000 Batch BW1 — One New Entity and Two Existing Updates

Reviewed at: 2026-07-15

## Results

- `0913` HbarSuite -> new `hei_ex_000917`, active HSuite entity
- `0966` / `0967` / `0968` Hydra DEX and Hydradex V2/V3 -> existing `hei_ex_000764`, two current protocol evidence items added
- `0787` FluxFlow V3 -> existing `hei_ex_000841`, current metric evidence re-verified

## Status decisions

HSuite is active based on its current first-party application, current Hedera AMM profile with non-zero recent DEX volume, and open-source adapter code querying dedicated HbarSuite network nodes and DEX analytics tickers.

Hydra DEX remains active based on its current application and direct V2/V3 protocol profiles. FluxFlow remains active based on current Fluent-chain liquidity, fees, revenue, and exchange volume.

## Blocking duplicates rejected by Records validation

The initial proposed standalone HydraDEX and FluxFlow V3 records were rejected because:

```text
HydraDEX / hydradex.org -> records/exchanges/hydra.json / hei_ex_000764
FluxFlow V3 / FluxFlow  -> records/exchanges/fluxflow.json / hei_ex_000841
```

Both duplicate files were deleted. Useful current evidence was attached to the existing entities instead.

## Existing candidates rejected during review

Nearby stale candidate rows were rejected after current-main exact-path, alternate-slug, canonical-name, alias, domain, or repository text checks. Examples include Huckleberry, HumanFi, Humble DeFi, HumidiFi, Hummus, HunnySwap, Huobi Korea, HBUS, HX, Hybra Finance, Hydration, Hydrex, Hydrometer Finance, HyperBlast, HyperBrick, Hyperion, HyperJump, Hyperliquid, HyperSwap, Hypertrade, ICDex, IceCreamSwap, ICPSwap, and ICRYPEX.

## Deferred candidates

```text
Helix Markets
  current public status insufficiently resolved

Hanbitco, HCoin, Hubi, Hashfort, HeraldEX, HOTDEX, IDCM
  stale registry-only evidence or unresolved lifecycle
```

## Evidence decisions

HSuite receives one first-party application item and two current implementation/registry items. Hydra DEX receives two direct current V2/V3 protocol items. FluxFlow's existing current metric evidence is re-verified without adding redundant duplicate evidence.

No record receives an invented launch date, terminal date, death reason, jurisdiction, legal entity, predecessor, or successor.

## Batch output

- new entities: 1
- new events: 0
- new evidence: 5
- projected entity count: 797
- projected event count: 1004
- projected evidence count: 3352
- projected remaining to D-1000: 203

## Operating mode

BW1 is the thirteenth D-1000 growth batch during the L-2 initial HOLD period. It adds reviewed canonical data only. No localization breadth, third-language authorization, Cloudflare configuration, or canonical schema changes are included.
