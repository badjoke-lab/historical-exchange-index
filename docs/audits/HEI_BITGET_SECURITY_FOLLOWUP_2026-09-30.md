# HEI — Bitget security incident follow-up — 2026-09-30

## Decision

Update existing Bitget entity `hei_ex_000028`. Do not create a new entity.

Keep `status: limited` while withdrawal restoration remains phased.

Add one lifecycle event:

- `hei_ev_010257` — `reopened`, 2026-09-28
- scope: BTC withdrawal restoration confirmed on Bitcoin and BSC
- status effect: `limited`
- confidence: `high`

Add evidence:

- `hei_src_012838` — Bitget first-party incident hub / attack-path and remediation update
- `hei_src_012839` — independent XRPL reporting of 102,976,680 XRP transferred
- `hei_src_012840` — Bitget first-party confirmation that BTC withdrawals reopened on 2026-09-28

## Evidence boundary

Bitget's current first-party incident material states that attackers exploited a vulnerability in a third-party security product to obtain intranet access credentials and forge withdrawal commands that bypassed risk verification. Bitget says private keys were not compromised, cold wallets were not affected, the vulnerability was remediated, and the incident was contained.

Independent XRPL reporting is used for the exact XRP amount. HEI does not present 102,976,680 XRP as a Bitget first-party figure.

## Status boundary

Keep Bitget `limited`.

BTC withdrawal restoration is confirmed. ETH, USDT, other supported assets, fiat, and P2P were scheduled for phased restoration through 2026-10-02. A partial reopening is not enough to restore the entity to `active`.

## Traceability

- roadmap item: continuing canonical lifecycle growth / follow-up
- specification: HEI AI-era registry lifecycle follow-up and reviewed-public boundary
- canonical entity count impact: 0
- deployment impact: reviewed data only; no workflow/config/build change
- preview required: no
- validation: repository data validation and PR CI
- production verification plan: after merge and next intended production deployment, verify the Bitget detail page shows the updated incident timeline and still reports `limited`
