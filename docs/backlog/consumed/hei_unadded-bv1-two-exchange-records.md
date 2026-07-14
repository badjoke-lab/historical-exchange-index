# D-1000 Batch BV1 — HollaEx Record and GalaSwap Evidence Refresh

Reviewed at: 2026-07-14

## Results

- `0936` HollaEx -> `hei_ex_000916`, new active HollaEx entity
- `0825` / `0826` Gala Swap -> existing `hei_ex_000709`, current DEX chaincode evidence refresh

## Status decisions

HollaEx is active based on its current first-party exchange platform and current public, authenticated, WebSocket, and administrative API documentation.

GalaSwap remains active. The existing reviewed entity already preserves its GalaChain DEX identity and current trading and liquidity features. BV1 adds the official GalaChain DEX chaincode repository, updated in July 2026, as implementation evidence.

## Rejected duplicate

```text
proposed GalaSwap hei_ex_000917 -> existing GalaSwap hei_ex_000709
```

Records validation detected overlap through normalized slug, canonical name, and `swap.gala.com`. The duplicate file was removed and the additive source was consolidated into the existing entity.

## Existing candidates rejected during review

Nearby stale candidate rows were rejected after current-main exact-path, alternate-slug, canonical-name, alias, domain, or repository text checks. Examples include Fraxswap, Fulcrom, FusionX, FWX DEX, Hashflow, HashKey Global, HeliSwap, Hercules, Honeyswap, HakuSwap, HARD Swap, Hashlock Markets, Heaven, HiBT, HitBTC, HiveSwap, Heraswap, Hermes Protocol, Humble DeFi, HunnySwap, Hydration, Hydrex, Hyperliquid, HyperSwap, IceCreamSwap, and ICPSwap.

## Deferred candidates

```text
Hanbitco, HCoin, Hubi, Hashfort, HeraldEX, HOTDEX
  stale registry-only evidence or unresolved current state
Hydra DEX
  unresolved identity boundary
Globitex, Graviex, Gleec BTC Exchange, HadesSwap
  insufficient current first-party or lifecycle evidence
```

## Evidence decisions

The new HollaEx entity receives two high-reliability first-party evidence items. Existing GalaSwap receives one high-reliability first-party implementation source. No record receives an invented launch date, terminal date, death reason, jurisdiction, legal entity, predecessor, or successor.

## Batch output

- new entities: 1
- enriched existing entities: 1
- new events: 0
- new evidence: 3
- projected entity count: 796
- projected event count: 1004
- projected evidence count: 3347
- projected remaining to D-1000: 204

## Operating mode

BV1 is the twelfth D-1000 growth batch during the L-2 initial HOLD period. It adds reviewed canonical data and evidence only. No localization breadth, third-language authorization, Cloudflare configuration, or canonical schema changes are included.
