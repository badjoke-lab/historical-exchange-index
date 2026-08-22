# Consumed backlog candidate — BX64 ABCC

Date: 2026-08-23  
Source backlog: `hei_unadded_0012 ABCC`

## Decision

Promote as one reviewed HEI exchange entity after fresh first-party and regulatory review.

```text
ABCC
slug: abcc
type: cex
current status: active
```

## Why the old row was insufficient

The original verified-unadded row was only a discovery candidate from an exchange database and did not establish current operating state, lifecycle history, operator identity, or the significance of later service changes.

## Fresh review basis

BX64 replaces discovery-only assumptions with:

- current first-party ABCC operating surface;
- first-party 2024 Singapore-operation sunset notice;
- first-party 2025 spot-trading closure notice;
- current 2026 ABCC Wallet cryptocurrency buy/sell instructions;
- current Labuan FSA listing for Unicoin DCX Limited, the operator identified by ABCC's current terms/pages.

## Scope decisions

The Singapore closure is not promoted into a global terminal state because the same announcement transferred global users to ABCC Global. The later spot-trading closure is a product-level trading event because current ABCC Wallet exchange functionality remains available.

No separate ABCC Global, Singapore-operation, or wallet entity is created, and no lineage edge is asserted without a fully reviewed corporate transition chain.

Canonical implementation is tracked in #816.
