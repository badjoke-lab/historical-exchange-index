# HEI D-1000 Progress Checkpoint — BW1

Date: 2026-07-15  
Status: IN PROGRESS  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BW1 is the thirteenth reviewed growth batch during the L-2 initial HOLD period. It adds one exchange entity and strengthens three existing exchange records after authoritative overlap validation.

## 2. Batch contents

```text
Kuru       hei_ex_000917 active — new entity
Hydra DEX  hei_ex_000764 active — V2/V3 evidence refresh
HSuite DEX hei_ex_000758 active — adapter evidence refresh
FluxFlow   hei_ex_000841 active — current metric re-verification
```

## 3. Projected reviewed state

```text
Entities: 797
Events:   1004
Evidence: 3353
```

Batch delta:

```text
Entities: +1
Events:   +0
Evidence: +6
```

Remaining to D-1000:

```text
203 reviewed entities
```

## 4. Status discipline

Kuru is active because current first-party documentation identifies a fully on-chain Monad order-book DEX and smart aggregator with swaps, trading, liquidity provisioning, vaults, SDKs, and APIs. Its official organization publishes public DEX contracts, and current metrics report non-zero recent DEX and aggregator volume.

Hydra DEX remains active. BW1 adds direct V2 and V3 protocol profiles; V3 reports current liquidity and non-zero recent volume and fees, while V2 preserves the deployment and liquidity context.

HSuite DEX remains active. BW1 adds open-source adapter evidence that queries dedicated HbarSuite network nodes and the DEX analytics ticker endpoint.

FluxFlow remains active. Its current Fluent-chain liquidity, fee, revenue, and exchange-volume evidence was re-verified without adding a redundant evidence row.

## 5. Overlap findings

Records validation found that the initial proposed HydraDEX, FluxFlow V3, and HSuite records duplicated existing `hydra.json` (`hei_ex_000764`), `fluxflow.json` (`hei_ex_000841`), and `hsuite-dex.json` (`hei_ex_000758`). All duplicate files were removed and useful evidence was folded into the existing records.

Repository-wide exact-path, name, alias, and domain searches found no current-main entity for Kuru or kuru.io.

The original verified-unadded corpus ends around the I range and therefore did not comprehensively cover Kuru. BW1 extends evidence-first review into the later alphabetic range rather than relying only on the stale capped corpus.

## 6. Deferred candidates

```text
Helix Markets
  exchange identity exists but current public status remains insufficiently resolved

Hanbitco, HCoin, Hubi, Hashfort, HeraldEX, HOTDEX, IDCM
  stale registry-only evidence or unresolved current lifecycle
```

BW1 does not use weak candidates merely to increase the batch size.

## 7. Safety boundaries

BW1 changes reviewed exchange bundles and growth checkpoint documentation only.

It does not change:

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
L-2 initial decision: HOLD
D-1000 growth:        CURRENT
D-1000 BV1:           COMPLETE
D-1000 BW1:           validation pending
Language Selection:  blocked until later gate
```

## 9. Authority references

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
docs/audits/HEI_D1000_PROGRESS_BV1_2026-07-14.md
docs/backlog/consumed/hei_unadded-bw1-two-exchange-records.md
records/exchanges/kuru.json
records/exchanges/hydra.json
records/exchanges/hsuite-dex.json
records/exchanges/fluxflow.json
```
