# D-1000 Batch BL1 — Alita Finance, AlphaQ, AlphaSec Spot, Alphix, and Althea DEX

Reviewed at: 2026-07-12

## Results

- `0028` Alita Finance -> `hei_ex_000872`, limited DEX
- `0034` AlphaQ -> `hei_ex_000873`, limited DEX
- `0035` AlphaSec Spot -> `hei_ex_000874`, limited DEX
- `0037` Alphix -> `hei_ex_000875`, active DEX
- `0042` Althea DEX -> `hei_ex_000876`, limited DEX

## Status decisions

- Alita Finance is `limited`, not `active` or `dead`, because current BNB Chain registry identity remains while strong recent utilization and stable first-party availability were not recovered.
- AlphaQ is `limited`, not `active` or `dead`, because current Solana registry identity remains while strong recent utilization and stable first-party availability were not recovered.
- AlphaSec Spot is `limited`, not `active` or `dead`, because current AlphaSec registry identity remains while strong recent utilization and stable first-party availability were not recovered.
- Alphix is `active` from current Base and Arbitrum protocol identity, continuing liquidity, and recent trading activity.
- Althea DEX is `limited`, not `active` or `dead`, because current Althea registry identity remains while strong recent utilization and stable first-party availability were not recovered.

## Evidence decisions

Each BL1 entity uses the current DefiLlama DEX discovery dataset, protocol profile, and protocol data endpoint.

The four limited classifications avoid converting registry presence alone into an active claim. Alphix receives active status only because current multichain liquidity and recent activity are preserved in protocol data.

All five records use `medium` confidence. No first-party application URL is promoted in this review pass.

## Current-main overlap findings

All five record paths were confirmed absent from reviewed main before drafting.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 760
- projected event count: 1004
- projected evidence count: 3249
- projected remaining to D-1000: 240

## Operating mode

BL1 is the second five-entity D-1000 growth batch during the L-2 initial HOLD period. No localization breadth, third-language authorization, Cloudflare configuration, or canonical schema changes are included.