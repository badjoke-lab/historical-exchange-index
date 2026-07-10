# D-750 Batch BD1 — Grizzly Trade AMM, Hadouken AMM, Gravity Finance, Gliquid, and Ginseng Swap

Reviewed at: 2026-07-10

## Results

- `0888` Grizzly Trade AMM -> `hei_ex_000832`, limited DEX
- `0900` Hadouken AMM -> `hei_ex_000833`, limited DEX
- `0885` / `0886` Gravity Finance -> `hei_ex_000834`, active DEX
- `0856` / `0857` Gliquid -> `hei_ex_000835`, active DEX
- `0848` Ginseng Swap -> `hei_ex_000836`, limited DEX

## Entity-first consolidation

- Grizzly Trade AMM remains one BNB Chain exchange entity across spot and perpetual trading context.
- Hadouken AMM remains one Godwoken V1 DEX entity.
- duplicate Gravity Finance source rows remain one Polygon DEX entity.
- duplicate Gliquid source rows remain one Hyperliquid L1 DEX entity.
- Ginseng Swap remains one Conflux CLMM entity.

## Evidence decisions

### Grizzly Trade AMM

DefiLlama identifies Grizzly Trade as a decentralized exchange for spot and perpetual trading and reports substantial cumulative AMM volume on BNB Chain, but the reviewed registry snapshot does not expose current 30-day, 7-day, or 24-hour volume metrics. HEI therefore uses `limited`, not `active` or `dead`. Confidence is `medium`.

### Hadouken AMM

DefiLlama identifies Hadouken AMM as a Godwoken V1 AMM DEX and reports residual TVL and substantial cumulative DEX volume, while recent 30-day, 7-day, and 24-hour fee activity is zero. HEI therefore uses `limited`. Confidence is `medium`.

### Gravity Finance

The current first-party Gravity Finance domain remains reachable. DefiLlama identifies Gravity Finance as a Polygon AMM DEX and reports current TVL, fees, and non-zero 30-day, 7-day, and 24-hour DEX volume. Confidence is `high`.

### Gliquid

DefiLlama identifies Gliquid as a V4 AMM and CLMM on Hyperliquid L1 and reports current TVL plus non-zero 30-day, 7-day, and 24-hour DEX volume. A stable first-party website URL was not recovered. Confidence is `medium`.

### Ginseng Swap

DefiLlama identifies Ginseng Swap as a Conflux CLMM and stablecoin marketplace and reports residual TVL and historical cumulative DEX volume, but zero 30-day, 7-day, and 24-hour volume. HEI therefore uses `limited`. Confidence is `medium`.

## Current-main overlap findings

Direct current-main checks and repository searches prevented stale candidate assumptions from creating duplicate drafts:

- GT3 -> existing `hei_ex_000759`
- Gull Network -> existing `hei_ex_000760`
- Greenhouse -> existing `hei_ex_000757`
- Futarchy AMM -> existing `hei_ex_000777`
- FWX DEX -> existing `hei_ex_000778`
- Full Sail -> existing `hei_ex_000708`
- FusionX -> existing `hei_ex_000705`
- Gin Finance -> existing `hei_ex_000780`

Glyph V2 was not promoted because `glyph.exchange` currently redirects into Molten and the rebrand or successor lineage requires separate review before entity classification.

FVM Exchange was not promoted because current registry material points to Velocimeter infrastructure and the entity boundary requires separate lineage review.

HadesSwap was not promoted because sufficiently strong current public evidence was not recovered during this review pass.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 720
- projected event count: 1004
- projected evidence count: 3129
- remaining to D-750 after projected merge: 30

## Operating mode

BD1 continues normal D-750 multi-entity batching. Routine growth work targets approximately five reviewed entities per PR, normally 4–6. No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.