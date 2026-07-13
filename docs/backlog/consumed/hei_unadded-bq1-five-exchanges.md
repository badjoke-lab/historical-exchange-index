# D-1000 Batch BQ1 — Five Reviewed Exchanges

Reviewed at: 2026-07-14

## Results

- `0913` HbarSuite -> `hei_ex_000896`, active DEX
- `0918` Helix Markets -> `hei_ex_000897`, limited hybrid exchange
- `0972` Hydrometer Finance -> `hei_ex_000898`, inactive DEX
- `0956` Hummus AMM -> `hei_ex_000899`, active DEX under canonical Hummus Finance identity
- `0920` Hello DEX (Ethereum) -> `hei_ex_000900`, active DEX

## Status decisions

- HbarSuite is `active` because current Hedera TVL and recent DEX volume remain non-zero and the dedicated first-party domain is linked from the current protocol registry.
- Helix Markets is `limited` because the hybrid order-book exchange identity and cumulative volume remain preserved, while current TVL is zero and recent activity is not established.
- Hydrometer Finance is `inactive` because the current protocol registry explicitly flags a rug pull involving user funds and states that the website is down. No dated terminal event is inferred.
- Hummus Finance is `active` because the first-party domain remains reachable and current Metis TVL and recent DEX volume remain non-zero.
- Hello DEX is `active` because the current exchange profile links the trading domain and reports a recently updated Ethereum spot pair with non-zero 24-hour volume.

## Stale-overlap findings

The following candidate rows were rejected after current-main alternate-slug and entity-first checks:

```text
Fluid DEX    -> existing hei_ex_000691
Holdstation  -> existing hei_ex_000725
Haven1 hSwap -> existing hei_ex_000721
```

Drift was deferred for a later incident and migration reconstruction rather than being added through a simplified current-state record.

## Evidence decisions

### HbarSuite

The current registry links the first-party domain and reports substantial Hedera TVL and active recent swap volume.

### Helix Markets

The current registry preserves the hybrid ICP order-book identity, official domain, and cumulative volume, but current TVL is zero; limited status avoids overstating current operation.

### Hydrometer Finance

The registry explicitly reports a rug pull and down website. Inactive status records the terminal condition without inventing a date.

### Hummus Finance

The first-party exchange domain remains reachable and registry metrics report current Metis liquidity and recent exchange volume.

### Hello DEX

The current exchange profile links the first-party trading domain and reports an active Ethereum spot pair and recent volume.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 10
- projected entity count: 784
- projected event count: 1004
- projected evidence count: 3315
- projected remaining to D-1000: 216

## Operating mode

BQ1 is the seventh D-1000 growth batch during the L-2 initial HOLD period. It adds reviewed canonical data only. No localization breadth, third-language authorization, Cloudflare configuration, or canonical schema changes are included.
