# HEI D-1000 Progress Checkpoint — BX4

Date: 2026-07-16  
Status: COMPLETE  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BX4 is the seventeenth reviewed growth batch during the L-2 initial HOLD period. It adds four current active DEX entities using current first-party exchange, application, protocol, and deployed-contract documentation.

## 2. Batch contents

```text
Shadow Exchange hei_ex_000930 active
Kittenswap      hei_ex_000931 active
Metropolis      hei_ex_000932 active
Momentum        hei_ex_000933 active
```

## 3. Reviewed state

```text
Entities: 813
Events:   1004
Evidence: 3385
```

Batch delta:

```text
Entities: +4
Events:   +0
Evidence: +8
```

Remaining to D-1000:

```text
187 reviewed entities
```

## 4. Status discipline

Shadow Exchange is active because current first-party documentation identifies a Sonic-native concentrated-liquidity exchange, links a live application, and publishes current pool, router, quoter, gauge, voting, and position-management contracts.

Kittenswap is active because its current first-party website and documentation identify a HyperEVM ve(3,3) DEX and liquidity hub with swaps, concentrated liquidity, pools, farming, voting, emissions, fees, and current active factory, router, quoter, farming, position-management, voter, and token contracts.

Metropolis is active because current first-party documentation identifies a Sonic-native Liquidity Book DLMM DEX, links a live application, and publishes current Sonic mainnet factories, routers, quoter, and pair implementation addresses.

Momentum is active because current first-party documentation identifies a live Sui concentrated-liquidity DEX with swaps, liquidity provision, programmable multi-step transactions, incentives, cross-chain support, and a linked public application.

## 5. Overlap and candidate findings

Repository-wide name and domain searches and direct canonical-path checks found no current-main records for:

```text
Shadow Exchange / shadow.so
Kittenswap / kittenswap.finance
Metropolis / metropolis.exchange
Momentum / mmt.finance
```

Blackhole and Kodiak were initially reviewed but excluded when direct path reads confirmed existing reviewed records. Search-index omissions were not treated as proof of absence.

Equalizer was initially drafted but removed after Records validation detected the existing reviewed identity `hei_ex_000684`. Kittenswap replaced it without changing the projected count delta.

Records validation, Candidate scan, and Watchlist resolution remained authoritative and all required gates passed on the final merged head.

## 6. Checkpoint repair

BX4 marked the merged BX3 checkpoint complete, advanced the maintainer recovery reference and reviewed counts to BX4, and refreshed the execution roadmap while preserving the frozen v1 baseline checkpoint.

## 7. Safety boundaries

BX4 did not change:

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
D-1000 BX3:         COMPLETE
D-1000 BX4:         COMPLETE
Language Selection: blocked until later gate
```

## 9. Authority references

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
docs/audits/HEI_D1000_PROGRESS_BX3_2026-07-15.md
docs/backlog/consumed/hei_unadded-bx4-four-active-dex-records.md
records/exchanges/shadow-exchange.json
records/exchanges/kittenswap.json
records/exchanges/metropolis.json
records/exchanges/momentum.json
```
