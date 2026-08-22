# HEI Post-D-1000 Growth — BX64

Date: 2026-08-23  
Lane: canonical data growth  
L-2 state: HOLD / evidence capture

## Result

BX64 promotes the still-unadded ABCC candidate as one reviewed exchange record with a conservative current-active classification and event-backed product/jurisdiction lifecycle history.

Added reviewed entity candidate:

```text
ABCC  active / cex / Singapore
```

Added events: 3  
Added evidence: 5

Exact reviewed public totals remain derived from repository aggregation/count-semantics after merge rather than copied from an older checkpoint.

## Evidence standard

- The current first-party ABCC site states that ABCC Exchange started in 2018 and continues to present live cryptocurrency trading and fiat buy/sell surfaces.
- ABCC's first-party 2024 Singapore sunset notice identifies Alphabit Consulting Pte Ltd as the Singapore operator, sets 2024-08-23 as the Singapore closure date, and explicitly distinguishes Singapore account closure from the transfer of global users to Alphabit Limited / ABCC Global.
- ABCC's first-party 2025 spot-service notice closes the legacy spot-trading service effective 2025-09-01.
- Current 2026 ABCC Wallet instructions still expose cryptocurrency buy/sell functionality, so the spot-service closure is not treated as a total ABCC shutdown.
- Current ABCC terms/pages identify Unicoin DCX Limited as the operator, and Labuan FSA currently lists Unicoin DCX Limited in its financial-institutions directory as a credit-token company.

## Status handling

ABCC uses:

```text
status: active
death_reason: null
death_date: null
confidence: medium
```

`active` is retained because current first-party 2026 material still provides exchange/buy/sell functionality. The 2025 closure applies specifically to the legacy spot-trading service.

Confidence remains `medium` because the reviewed sources show multiple operating-company transitions but do not fully reconstruct the exact corporate handoff from ABCC Global / Alphabit Limited to Unicoin DCX Limited.

## Lifecycle events

```text
2018-01-01  launched             active
2024-08-23  shutdown_effective   none
2025-09-01  trading_halted       limited
```

The 2024 `shutdown_effective` event is explicitly scoped to the Singapore virtual-asset exchange business. It does not imply a global ABCC shutdown because the same primary source states that global users were transferred to ABCC Global with continuing account access.

The 2025 `trading_halted` event is scoped to ABCC's spot-trading service. Current 2026 wallet trading instructions establish that exchange functionality continued in another product surface.

## Identity controls

- `ABCC` is the canonical exchange name; `ABCC Exchange` is retained as an alias.
- No separate entity is created for the Singapore operation, ABCC Global, or ABCC Wallet in this batch.
- No predecessor/successor edge is asserted because the corporate transitions are not yet fully reconstructed to HEI lineage standard.
- The first-party statement that the exchange began in 2018 is normalized to `2018-01-01`; no exact launch day is inferred.
- `country_or_origin` remains Singapore because the reviewed historical operating-company evidence directly identifies the Singapore exchange business; current Labuan operator evidence is preserved in notes/evidence instead of rewriting the historical origin.

## Identifier allocation

```text
Entity:   hei_ex_001160
Events:   hei_ev_010131 through hei_ev_010133
Evidence: hei_src_012599 through hei_src_012603
```

BX64 starts after merged BX63, whose highest allocated identifiers are `hei_ex_001159`, `hei_ev_010130`, and `hei_src_012598`. No competing record-lane pull request was open when BX64 was drafted.

## Count impact

```text
Entities: +1
Events:   +3
Evidence: +5
```

## Boundary

This is a record-only Lane A batch. It changes no localization rollout decision, monitoring configuration, Cloudflare configuration, schema, or Ledger Series Phase 9 implementation.

L-2 remains `HOLD / EVIDENCE CAPTURE`.

## Completion condition

BX64 is complete only after the final branch head passes record validation, overlap/duplicate checks, identifier-collision checks, source/event enum checks, country/origin checks, URL-safety checks, machine/public consistency, localization output checks, count-semantics validation, merge to `main`, and normal production verification.
