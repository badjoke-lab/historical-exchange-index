# D-1000 Batch BX9 — Four Active DEX Records

Reviewed at: 2026-07-16

## Results

```text
PunchSwap    -> hei_ex_000950 active
1DEX         -> hei_ex_000951 active
Rubin        -> hei_ex_000952 active
LiquidLaunch -> hei_ex_000953 active
```

## Selection basis

BX9 continues evidence-first expansion beyond the original verified-unadded corpus.

Each selected entity has:

```text
a distinct current-main identity
no normal, alternate, or legacy nested canonical path
no normalized name or official-domain overlap found before PR validation
a current first-party application, documentation, API, or official repository
a clearly described exchange, order-book, swap, bonding, spot, or perpetual function
at least two evidence items appropriate to the confidence level
```

## Status decisions

All four records are `active`.

PunchSwap has current first-party V2/V3 documentation and a dedicated Flow EVM trade and liquidity application. 1DEX exposes a current order-book exchange, markets, and liquidity surface. Rubin publishes official current mainnet spot/perpetual trading tooling and a live first-party indexer. LiquidLaunch remains publicly available and has current contract-event tracking for purchases, sales, bonding, LP fees, and staking distributions.

LiquidLaunch confidence is `medium` because current technical detail is primarily supported by independently maintained on-chain tracking rather than broad first-party documentation.

## Exclusions and holds

```text
Angstrom       existing hei_ex_000531
BrownFi        existing hei_ex_000606
CobaltX        existing hei_ex_000634
Full Sail      existing hei_ex_000708
HARD Swap      existing hei_ex_000822
EagleFi        existing hei_ex_000851
DipCoin        existing hei_ex_000907
Flowr          excluded: on-chain game economy, not an exchange venue
Interest DEX   held: current active-product evidence insufficient
HyperLynx      held: distinct official domain unresolved
```

Direct canonical-path inspection overrode empty repository-search results whenever the two disagreed.

## Count impact

```text
Before BX9: 829 entities / 1004 events / 3417 evidence
BX9 delta:   +4 entities / +0 events / +8 evidence
After BX9:  833 entities / 1004 events / 3425 evidence
Remaining to D-1000: 167
```

## Safety boundary

No launch date, terminal date, jurisdiction, legal entity, predecessor, successor, or shutdown cause was added without direct support. No localization, schema, machine-readable safety, deployment, or Cloudflare behavior changes are included.
