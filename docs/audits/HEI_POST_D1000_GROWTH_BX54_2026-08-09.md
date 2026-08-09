# HEI Post-D-1000 Growth — BX54

Date: 2026-08-09  
Lane: canonical data growth  
L-2 state: HOLD / evidence capture

## Result

BX54 continues reviewed canonical growth after BX53 with four Japanese centralized crypto trading services and three meaningful lifecycle/state-change events.

Added reviewed entities:

```text
BITPOINT       active / cex / Japan
S.BLOX         active / cex / Japan
HashKey Japan  active / cex / Japan
BACKSEAT       limited / cex / Japan
```

Added evidence: 11  
Added events: 3

Projected reviewed public state after merge:

```text
Entities: 1016
Events:   1029
Evidence: 3817
```

## Evidence standard

Each addition has current first-party service or operator evidence and a current identity/status corroborator where appropriate.

BITPOINT uses current first-party service evidence plus first-party merger-completion notices from both sides of the 2026 legal-company merger.

S.BLOX uses the current first-party trading service surface plus the current JVCEA member directory.

HashKey Japan uses the current first-party service/identity site, the first-party Tokyo Hash → HashKey Japan company-name change notice, and the current JVCEA member directory.

BACKSEAT uses the current first-party exchange site, a first-party 2026 external deposit/withdrawal suspension notice, and the current JVCEA member directory.

JVCEA is used as a current industry/SRO membership and registration corroborator, not as a safety, solvency, liquidity, custody-quality, or investment endorsement.

## Lifecycle handling

### BITPOINT

BITPoint Japan Co., Ltd. was absorbed into SBI VC Trade Co., Ltd. on 2026-04-01. First-party notices explicitly say that BITPOINT and VCTRADE remained separate customer-facing services after the legal-company merger. BX54 therefore adds a `merged` event with `event_status_effect: active` while keeping the BITPOINT service entity active.

### HashKey Japan

Tokyo Hash Co., Ltd. changed its company name to HashKey Japan Co., Ltd. effective 2026-06-01. The first-party notice says the legal entity, contracts, and services were unchanged. BX54 records a `rebranded` event and keeps one continuing active entity.

### BACKSEAT

BACKSEAT suspended external crypto deposits and withdrawals from 2026-02-25 with no announced restart date while crypto trading remained available. BX54 records a `withdrawal_suspended` event with `event_status_effect: limited`; the simultaneous deposit suspension is preserved in the event text because no combined deposit/withdrawal enum exists.

## Scope control

BX54 does not add every Japanese registered crypto-asset business. CoinTrade was explicitly reviewed and excluded because its own current FAQ states that it offers dealer-market sales only and does not provide exchange-style trading.

Registration or association membership alone is not sufficient for HEI inclusion.

## Date handling

BX54 does not synthesize exact launch dates from:

- company incorporation dates;
- registration dates;
- association membership;
- month-only service-history statements.

HashKey Japan's current site states that crypto-asset exchange service began in September 2021, but no exact day is encoded in `launch_date`.

## L-2 relationship

This batch does not change the L-2 localization decision. Canonical growth remains allowed during HOLD. Missing external search/usage/indexing evidence and operator QA burden remain separate L-2 requirements.

## Next identifiers

```text
Entity:   hei_ex_001137
Event:    hei_ev_010106
Evidence: hei_src_012514
```

## Completion condition

BX54 is complete only after normal record validation, reviewed-public aggregation, ID and overlap checks, country and URL-safety checks, machine/public consistency, localization output checks, recovery validation, count-semantics validation, and merge to `main` succeed.
