# HEI Unadded Candidate Consumption — BX16

Date: 2026-07-18  
Batch: D-1000 BX16

## Consumed candidates

```text
Avantis         candidate:avantis
Ostium          candidate:ostium
Pacifica        candidate:pacifica-perps
Manifest Trade  candidate:manifest-trade
```

## Canonical assignments

```text
Avantis         hei_ex_000978
Ostium          hei_ex_000979
Pacifica        hei_ex_000980
Manifest Trade  hei_ex_000981
```

## Selection basis

All four candidates were present in the reviewed active-later queue with `held` resolution state. BX16 selected them because current first-party documentation or applications and current independently maintained activity metrics were available at the same time.

```text
Avantis:
  active Base cross-asset perpetual exchange
  substantial current perpetual volume, TVL, fees, and open interest

Ostium:
  active Arbitrum perpetual instruments venue
  substantial current perpetual volume, TVL, fees, revenue, and open interest

Pacifica:
  active Solana hybrid perpetual and spot exchange
  substantial current perpetual volume and non-zero spot volume

Manifest Trade:
  active permissionless Solana spot order book
  substantial current spot DEX volume and TVL
```

## Exclusions and holds

Extended was not added because direct canonical-path inspection found existing entity `hei_ex_000688`.

Hydration DEX and Fluid DEX remained available for later review. Both show current activity, but BX16 prioritized the four reviewed held candidates above to close existing queue state and reduce candidate debt.

## Boundary decisions

```text
Avantis trading, vault, rewards, and SDK surfaces -> one entity
Ostium protocol, interface, vault, and services -> one entity
Pacifica perpetual, spot, account, subaccount, and API surfaces -> one entity
Manifest order book, app, API, vault, and program surfaces -> one entity
```

Manifest descriptions referencing Serum or OpenBook are retained only as contextual comparison. No canonical predecessor or successor link is asserted without stronger lifecycle evidence.

## Resolution action

The four candidates are closed through:

```text
data-staging/watchlists/resolution/overrides/20260718-bx16-four-promotions.json
```

The historical base resolution index remains unchanged.
