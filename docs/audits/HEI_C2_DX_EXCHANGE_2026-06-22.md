# HEI C2 DX.Exchange record audit — 2026-06-22

## Result

C2 adds DX.Exchange as the only genuinely unadded candidate remaining from the corrected first Phase C priority review.

```text
Entity:   hei_ex_000526
Events:   hei_ev_002084–hei_ev_002087
Evidence: hei_src_003210–hei_src_003216
```

## Entity decision

```text
Canonical name: DX.Exchange
Aliases:        DX Exchange / DX.Exchange EU / DXtech Exchange
Type:           cex
Status:         dead
Death reason:   insolvency
Launch date:    2019-01-07
Death date:     2019-11-03
Origin:         Estonia / Israel
Original domain: dx.exchange
URL status:       dead_domain
Confidence:       high
```

DX.Exchange publicly presented itself as an Estonia-based exchange. Reporting concerning the shutdown and employee proceedings identified Israeli company CX Technologies as the operating company. HEI therefore preserves the mixed origin rather than forcing one jurisdiction.

The November 3, 2019 halt of deposits and trading is used as the terminal date. The earlier October 24 employee petition concerning CX Technologies is recorded as a separate insolvency event.

## Timeline

### 2019-01-07 — Launch

DX.Exchange launched cryptocurrency, fiat, and tokenized-stock trading.

### 2019-03-14 — Security-token expansion

The exchange added security-token trading and security-token-offering listings. This is modeled as a material product event, not as a second exchange entity.

### 2019-10-24 — Operating-company winding-up petition

Employees petitioned an Israeli court over unpaid wages and sought to wind up CX Technologies, which reporting identified as the company operating DX.Exchange.

### 2019-11-03 — Service shutdown

DX.Exchange stopped deposits and trading, cancelled open orders, and sought a merger or sale. The announcement described the halt as temporary, but no verified restart followed.

## Evidence shape

The initial record includes seven evidence records:

- one company-issued pre-launch statement;
- one independent pre-launch report;
- one independent security-token product report;
- one report covering the operating-company bankruptcy proceeding;
- the archived original shutdown-notice URL;
- two independent reports covering the service halt and financial difficulty.

The evidence follows the HEI rule that entity and event claims remain separate from their supporting records, with archived access retained for dead-side material. 

## Candidate lifecycle

```text
candidate:dx-exchange
needs_research -> promoted
target_entity_id: hei_ex_000526
promotion PR: #422
```

The C1 historical scan remains auditable and records the completed promotion.

## Count impact

```text
Entities:  412 -> 413
Events:    691 -> 695
Evidence: 1620 -> 1627
```

## Regression safeguards

- record bundle schema validation;
- duplicate entity/event/evidence detection;
- reviewed-bundle ID collision detection;
- projected-public overlap audit;
- candidate lifecycle and resolution validation;
- projected-public count and ID-set equality;
- static detail-page and sitemap route-count equality;
- country/origin and entity-quality gates;
- A3 lineage closure safety checks.

The A3 closure gate now treats 412 entities and 691 events as minimum historical baselines rather than permanent exact totals, so normal reviewed growth cannot invalidate the completed Phase A audit.

## Next phase

C3 repairs thin active CEX records without increasing entity count. New growth-batch selection resumes only after the remaining pending-thin candidates pass the strict projected-public overlap gate.
