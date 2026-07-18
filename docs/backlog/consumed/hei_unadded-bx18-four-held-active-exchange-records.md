# HEI Unadded Exchange Backlog — BX18 Consumed

Date: 2026-07-19  
State: consumed by reviewed D-1000 batch BX18

## Promoted candidates

```text
candidate:decibel
candidate:lista-dex
candidate:sovryn-dex
candidate:gmtrade
```

Canonical targets:

```text
Decibel    hei_ex_000986
Lista DEX  hei_ex_000987
Sovryn     hei_ex_000988
GMTrade    hei_ex_000989
```

## Selection rationale

Each selected candidate had:

```text
current first-party exchange identity or documentation
current independently maintained activity metrics
no current-main canonical name match
no current-main official-domain match
no direct normal or alternate canonical-path match
clear exchange-level product identity
```

## Excluded as already canonical

```text
GalaSwap       hei_ex_000709
Fluid DEX      hei_ex_000691
Figure Markets hei_ex_000689
Fraxswap       hei_ex_000703
```

These candidates or discovery names must not be reintroduced as new canonical growth work.

## Identity boundaries

Decibel remains one entity across its Aptos order book, clearinghouse, trader interface, developer surfaces, and cross-chain deposits.

Lista DEX remains an exchange entity distinct from Lista DAO's lending, stablecoin, liquid-staking, and RWA product families.

Sovryn remains one exchange entity across swap, spot, margin, Alpha, AMM, and liquidity interfaces. Its lending and governance products do not create separate exchange records.

GMTrade remains one entity across crypto and real-world-asset perpetual markets and related liquidity interfaces.

## Resolution

The dated override at:

```text
data-staging/watchlists/resolution/overrides/20260719-bx18-four-promotions.json
```

must close all four held candidates as `promoted` after canonical publication.

## Required gates

```text
Records validation
Candidate scan gate
Watchlist resolution gate
Count semantics regression
Maintainer recovery gate
Machine/public consistency gate
URL safety gate
Japanese Pilot readiness gate
L2 localization evaluation gate
v1 baseline checkpoint gate
CI
```
