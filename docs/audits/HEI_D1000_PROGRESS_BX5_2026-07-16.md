# HEI D-1000 Progress Checkpoint — BX5

Date: 2026-07-16  
Status: COMPLETE  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BX5 is the eighteenth reviewed growth batch during the L-2 HOLD period. It added four current active DEX entities using current first-party application, protocol, documentation, and deployed-contract evidence.

## 2. Batch contents

```text
Project X  hei_ex_000934 active
Haiko      hei_ex_000935 active
nest       hei_ex_000936 active
Valantis   hei_ex_000937 active
```

## 3. Reviewed state

```text
Entities: 817
Events:   1004
Evidence: 3393
```

Batch delta:

```text
Entities: +4
Events:   +0
Evidence: +8
```

Remaining to D-1000:

```text
183 reviewed entities
```

## 4. Status discipline

Project X is active because its current first-party application exposes live swap, liquidity, and portfolio interfaces on the official domain.

Haiko is active because current first-party documentation identifies an audited Starknet AMM live on mainnet and its public application exposes trading, vault, position, activity, and rewards surfaces.

nest is active because current first-party documentation identifies a HyperEVM MetaDEX and central liquidity hub with concentrated and classic AMMs, swaps, liquidity, incentives, and current deployed exchange contracts.

Valantis is active because current first-party documentation identifies an LST-specific DEX with a production stHYPE Stake Exchange pool, public swap and liquidity functionality, and a current open-source STEX AMM implementation.

## 5. Overlap and candidate findings

Repository-wide name and domain searches plus direct normal and legacy nested canonical-path checks found no current-main records for:

```text
Project X / prjx.com
Haiko / haiko.xyz
nest / usenest.xyz
Valantis / valantis.xyz
```

HyperSwap and Hybra Finance were reviewed but excluded after direct canonical-path reads confirmed existing reviewed records `hei_ex_000762` and `hei_ex_000729`.

Records validation, Candidate scan, and Watchlist resolution remained authoritative and all required gates passed on the final merged head.

## 6. Checkpoint repair

BX5 marked the merged BX4 checkpoint complete and advanced the maintainer recovery reference, L-2 parallel-growth count text, and reviewed counts to BX5.

## 7. Safety boundaries

BX5 did not change:

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
D-1000 BX4:         COMPLETE
D-1000 BX5:         COMPLETE
Language Selection: blocked until later gate
```

## 9. Authority references

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
docs/audits/HEI_D1000_PROGRESS_BX4_2026-07-16.md
docs/backlog/consumed/hei_unadded-bx5-four-active-dex-records.md
records/exchanges/project-x.json
records/exchanges/haiko.json
records/exchanges/nest-cl.json
records/exchanges/valantis.json
```
