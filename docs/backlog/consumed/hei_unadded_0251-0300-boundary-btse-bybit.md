# Boundary review: BTSE Futures and Bybit EU

Reviewed at: 2026-07-04

## Rows

- `0287` BTSE Futures
- `0300` Bybit EU

## Results

- `0287` BTSE Futures -> product row under BTSE; no standalone canonical record.
- `0300` Bybit EU -> regional Bybit platform boundary; no standalone canonical record in this PR.

## BTSE Futures decision

`BTSE Futures` is a product or market segment under the broader BTSE exchange identity rather than a standalone exchange identity. HEI should not create a canonical entity named `BTSE Futures`.

The correct follow-up is a parent-entity review for `BTSE` itself. If BTSE is promoted later, futures trading should be captured as event or evidence detail under the parent BTSE record, not as a separate product-row entity.

## Bybit EU decision

`Bybit EU` is a regional regulated platform and domain/legal-entity boundary issue. It should not be promoted in isolation while the global Bybit exchange is not canonical in HEI and while `Bybit Spot` and `Bybit Derivative Exchange` have already been classified as product rows.

The correct follow-up is a broader Bybit identity review covering:

- global Bybit exchange identity;
- Bybit EU regulated regional platform;
- product rows such as spot and derivatives;
- whether the EU operation warrants a separate canonical regional entity or should be modeled as a regional event/status layer under Bybit.

## Batch output

- new entities: 0
- new events: 0
- new evidence: 0
- boundary rows reviewed: 2
- rows kept in parent/global identity review: 2

## Safety checks

- no product-row entity named BTSE Futures was created;
- no isolated Bybit EU record was created without the global Bybit identity decision;
- no Cloudflare or deployment changes are included.
