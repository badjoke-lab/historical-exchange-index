# D-1000 Batch BK1 — Aborean Finance, Alien Base, Aequinox, AethonSwap, and Aldrin

Reviewed at: 2026-07-12

## Results

- `0015` Aborean AMM + `0016` Aborean CL + `0017` Aborean Finance V3 -> `hei_ex_000867`, active DEX, canonicalized as Aborean Finance
- `0025` Alien Base V2 + `0026` Alien Base V3 -> `hei_ex_000868`, active DEX, canonicalized as Alien Base
- `0018` Aequinox -> `hei_ex_000869`, active DEX
- `0020` AethonSwap -> `hei_ex_000870`, limited DEX
- `0024` Aldrin -> `hei_ex_000871`, limited DEX

## Status and entity decisions

- Aborean Finance is `active` from a reachable first-party application plus current Abstract DEX discovery rows. AMM, CL, and V3 source rows are one exchange entity.
- Alien Base is `active` from a reachable first-party application plus current Base DEX discovery rows. V2 and V3 source rows are one exchange entity.
- Aequinox is `active` from current BNB Chain protocol identity, liquidity, and recent non-zero volume windows.
- AethonSwap is `limited`, not `active` or `dead`, because current Monad registry identity and residual protocol state remain while recent trading-volume evidence is insufficient.
- Aldrin is `limited`, not `active` or `dead`, because current Solana registry identity remains while strong recent utilization and stable first-party application evidence were not recovered.

## Entity-first decisions

- Aborean Finance remains one entity across AMM, concentrated-liquidity, and V3 source representations.
- Alien Base remains one entity across V2 and V3 source representations.
- Protocol versions, pool models, and chain-specific discovery rows are not counted as separate entities.

## Evidence decisions

### Aborean Finance

The current first-party application remains reachable. DefiLlama preserves Aborean AMM and CL rows on Abstract, while CoinGecko preserves the Aborean Finance V3 identity and current application domain. Confidence is `medium`.

### Alien Base

The current first-party application remains reachable. DefiLlama preserves the Alien Base V2 row on Base, while CoinGecko preserves the Alien Base V3 identity and application domain. Confidence is `medium`.

### Aequinox

Current protocol data preserves the BNB Chain DEX identity and reports continuing liquidity with recent non-zero volume windows. A stable first-party application URL was not promoted in this review pass. Confidence is `medium`.

### AethonSwap

Current registry and protocol data preserve the Monad DEX identity and residual protocol state. Recent trading-volume evidence is weak or zero in the reviewed windows, so HEI uses `limited`. Confidence is `medium`.

### Aldrin

Current registry and protocol data preserve the Solana DEX identity. Strong recent utilization and stable first-party application evidence were not recovered, so HEI uses `limited`. Confidence is `medium`.

## Current-main overlap findings

All five canonical record paths were confirmed absent from reviewed main before drafting.

The version-labelled Aborean and Alien Base candidate rows were consolidated under entity-first canonical records rather than added separately.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 755
- projected event count: 1004
- projected evidence count: 3234
- projected remaining to D-1000: 245

## Operating mode

BK1 is the first planned five-entity D-1000 growth batch after the L-2 initial HOLD decision. No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.