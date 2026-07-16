# HEI D-1000 Progress Checkpoint — BX6

Date: 2026-07-16  
Status: COMPLETE  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BX6 is the nineteenth reviewed growth batch during the L-2 HOLD period. It added four current active decentralized exchange or swap-aggregator entities using current first-party application, protocol, deployment, and source-repository evidence.

## 2. Batch contents

```text
Ooga Booga       hei_ex_000938 active
Honeypot Finance hei_ex_000939 active
Reactor DEX      hei_ex_000940 active
Doma DEX         hei_ex_000941 active
```

## 3. Reviewed state

```text
Entities: 821
Events:   1004
Evidence: 3401
```

Batch delta:

```text
Entities: +4
Events:   +0
Evidence: +8
```

Remaining to D-1000:

```text
179 reviewed entities
```

## 4. Status discipline

Ooga Booga is active because its current first-party documentation publishes live router deployments across Berachain, HyperEVM, Botanix, and Monad and documents the current Swap API and executor flow.

Honeypot Finance is active because its current first-party website exposes spot swaps, AMM liquidity, perpetual and multichain trading functions, and its documentation describes the live concentrated-liquidity DEX architecture.

Reactor DEX is active because its current first-party exchange domain remains reachable and the official Reactor-Fuel organization publishes a public, non-archived DEX implementation together with current SDK and trading integration repositories.

Doma DEX is active because the current first-party Doma application exposes a public swap interface and official protocol documentation describes the on-chain Doma application ecosystem supporting the exchange surface.

## 5. Overlap and candidate findings

Repository-wide name and domain searches plus direct normal, alternate, and legacy nested canonical-path checks found no current-main records for:

```text
Ooga Booga / oogabooga.io
Honeypot Finance / honeypotfinance.xyz
Reactor DEX / reactor.exchange
Doma DEX / app.doma.xyz
```

Existing reviewed records found and excluded during candidate screening included Bulla Exchange `hei_ex_000412`, BurrBear `hei_ex_000608`, BEX `hei_ex_000377`, Kuru `hei_ex_000917`, Bean Exchange `hei_ex_000559`, Capricorn `hei_ex_000611`, and Kaia DragonSwap `hei_ex_000681`.

A separate Sei project using the DragonSwap name was not drafted because the normalized-name collision requires dedicated identity review rather than bypassing the growth-batch overlap controls.

Records validation, Candidate scan, and Watchlist resolution remained authoritative and all required gates passed on the final merged head.

## 6. Checkpoint repair

BX6 marked the merged BX5 checkpoint complete and advanced the maintainer recovery reference, L-2 parallel-growth count text, and reviewed counts to BX6.

## 7. Safety boundaries

BX6 did not change:

```text
Cloudflare configuration
localization route scope
L-2 HOLD decision
third-language authorization
canonical schema
public machine-readable safety rules
```

## 8. Current execution state

```text
L-2 decision:       HOLD
D-1000 growth:      CURRENT
D-1000 BX5:         COMPLETE
D-1000 BX6:         COMPLETE
Language Selection: blocked until later gate
```

## 9. Authority references

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
docs/audits/HEI_D1000_PROGRESS_BX5_2026-07-16.md
docs/backlog/consumed/hei_unadded-bx6-four-active-dex-records.md
records/exchanges/ooga-booga.json
records/exchanges/honeypot-finance.json
records/exchanges/reactor-dex.json
records/exchanges/doma-dex.json
```
