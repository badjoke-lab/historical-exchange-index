# HEI D-1000 Progress Checkpoint — BS1

Date: 2026-07-14  
Status: IN PROGRESS  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BS1 is the ninth reviewed growth batch during the L-2 initial HOLD period. It adds five DEX records after current-main overlap checks and replaces one rejected duplicate candidate before PR creation.

## 2. Batch contents

```text
Dark KnightSwap hei_ex_000904 inactive
Dexter Exchange  hei_ex_000905 inactive
Dezswap          hei_ex_000906 active
DipCoin          hei_ex_000907 active
DiviSwap         hei_ex_000908 active
```

## 3. Projected reviewed state

```text
Entities: 790
Events:   1004
Evidence: 3333
```

Batch delta:

```text
Entities: +5
Events:   +0
Evidence: +10
```

Remaining to D-1000:

```text
210 reviewed entities
```

## 4. Status discipline

Dark KnightSwap and Dexter Exchange are classified inactive because their historical exchange identities are supported but a currently usable first-party interface was not independently verified. Neither receives a death date, death reason, or terminal event.

Dezswap is active because first-party application code updated in April 2026 defines supported mainnets, deployed contracts, and live API endpoints.

DipCoin is active because first-party documentation updated in May 2026 describes current account funding, market data, trading, positions, withdrawals, and vault workflows; a current DefiLlama adapter also queries live DipCoin API endpoints.

DiviSwap is active based on first-party Chiliz Chain DEX interface metadata and current DEX registry corroboration. Its public URL remains live_unverified because this review did not independently fetch the deployed site.

## 5. Overlap finding

DFX V2 initially appeared unlisted under candidate slug `dfx-v2`. Creation was stopped when GitHub reported an existing target path, revealing current-main DFX Finance `hei_ex_000739`, which already consolidates DFX V2 and V3. The candidate was rejected as a duplicate and replaced with DiviSwap.

The final five entities have no exact file, alternate slug, canonical-name, alias, or repository text overlap on current main.

## 6. Safety boundaries

BS1 changes reviewed exchange bundles and growth checkpoint documentation only.

It does not change:

```text
Cloudflare configuration
localization route scope
L-2 HOLD decision
third-language authorization
canonical schema
public machine-readable safety rules
```

## 7. Current execution state

```text
L-2 initial decision: HOLD
D-1000 growth:        CURRENT
D-1000 BR1:           COMPLETE
D-1000 BS1:           validation pending
Language Selection:  blocked until later gate
```

## 8. Authority references

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
docs/audits/HEI_D1000_PROGRESS_BR1_2026-07-14.md
docs/backlog/consumed/hei_unadded-bs1-five-dex-records.md
records/exchanges/dark-knightswap.json
records/exchanges/dexter-exchange.json
records/exchanges/dezswap.json
records/exchanges/dipcoin.json
records/exchanges/diviswap.json
```