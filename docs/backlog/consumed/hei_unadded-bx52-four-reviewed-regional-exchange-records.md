# Consumed backlog — BX52 reviewed regional exchange records

Status: consumed  
Date: 2026-08-09  
Lane: post-D-1000 canonical growth

## Added

```text
Upbit Thailand   hei_ex_001125 active
MX Global        hei_ex_001126 active
Upbit Singapore hei_ex_001127 active
KuCoin Thailand  hei_ex_001128 dead
```

## Evidence allocation

```text
Upbit Thailand   hei_src_012486–012487
MX Global        hei_src_012488–012489
Upbit Singapore hei_src_012490–012491
KuCoin Thailand  hei_src_012492–012494
```

## Event allocation

```text
KuCoin Thailand  hei_ev_010102 shutdown_effective 2026-04-22
```

## Review basis

Upbit Thailand is supported by the current Thailand SEC Digital Asset Exchange list and current Upbit regional Exchange API documentation.

MX Global is supported by current first-party exchange/rulebook surfaces and the Securities Commission Malaysia registered-DAX list updated 2026-07-20.

Upbit Singapore is supported by current Upbit regional Exchange API documentation and the Monetary Authority of Singapore Financial Institutions Directory, which identifies Upbit Singapore Pte. Ltd. as a Major Payment Institution providing Digital Payment Token Service.

KuCoin Thailand / ERX is added as `dead` because the reviewed sequence progressed beyond a temporary trading restriction: Thailand SEC documented the January capital-related business suspension, first-party notices stated that there was no scheduled near-term resumption, normal customer system access ended on 2026-04-22, and ERX then announced that it was in the process of returning its Digital Asset Exchange licence. Manual offboarding withdrawals and a live support surface are not treated as active exchange operation.

## Identity and overlap controls

Direct current-main path and name checks found no reviewed record for Upbit Thailand, MX Global, Upbit Singapore, or KuCoin Thailand / ERX before BX52.

The two Upbit regional entities are not merged into the South Korean Upbit entity because they are separately licensed regional legal operators with dedicated regional service infrastructure.

MX Global is not split into separate MX Global and MX Exchange entities; MX Exchange is the platform provided by MX Global Sdn Bhd and the former ARXCHANGE name is preserved as an alias.

ERX and KuCoin Thailand are one reviewed entity: ERX Co., Ltd. is the legal operator and KuCoin Thailand is the trade name.

## Reviewed result

```text
Entities: 1008
Events:   1026
Evidence: 3798
```

Next unused identifiers after BX52:

```text
Entity:   hei_ex_001129
Event:    hei_ev_010103
Evidence: hei_src_012495
```

These counts remain subject to the normal reviewed-public aggregation, identity-resolution, and validation semantics at merge time.
