# HEI Post-D-1000 Growth — BX74 Mine Digital

Date: 2026-08-25  
Status: REVIEWED FOR PR

## Scope

Resolve Mine Digital as a high-confidence historical Australian centralized exchange with a regulator-supported terminal insolvency lifecycle.

## Canonical delta

```text
Entities: +1
Events:   +3
Evidence: +4
```

## Record

```text
hei_ex_001169  Mine Digital  dead  insolvency
```

## Lifecycle

```text
hei_ev_010149  2021-01-29  acquired             GBX acquisition
hei_ev_010150  2022-09-23  insolvency_declared ACCE Australia entered administration
hei_ev_010151  2023-07-10  regulatory_action    AUSTRAC registration cancellation
```

## Evidence

```text
hei_src_012640  GBX / GSX first-party acquisition completion notice
hei_src_012641  ASIC 24-231MR
hei_src_012642  AUSTRAC virtual asset registration actions
hei_src_012643  Australian Business Register historical details
```

## Classification discipline

- ASIC states Mine Digital operated from May 2019 through September 2022, but no exact public launch day is established; `launch_date` remains null.
- 2022-09-23 is used as the terminal insolvency marker because ACCE Australia entered administration that day; it is not represented as a proven exact final trade timestamp.
- `death_reason` is `insolvency`.
- The former CEO fraud charge is not promoted into `scam_rug` or a fraud event for the exchange entity.
- The 2021 GBX acquisition is recorded without inventing a predecessor/successor lineage edge.
- The original domain is retained with `official_url_status: unknown`; no weak current-domain source is used to force a dead-domain classification.

## Boundaries

L-2 HOLD remains unchanged. No monitoring, Cloudflare, localization, schema, machine-readable policy, or Ledger Series Phase 9 mutation is included.
