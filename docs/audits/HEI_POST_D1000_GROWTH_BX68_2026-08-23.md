# HEI post-D-1000 growth — BX68

Date: 2026-08-23
Scope: Lane A reviewed canonical growth during L-2 HOLD

## Addition

Hubi is added as a conservative inactive historical centralized exchange record.

Canonical delta:

```text
Entities: +1
Events:   +1
Evidence: +4
```

## Reviewed facts

- First-party Hubi material shows active exchange operations through March 2020.
- Cryptowisser recorded `hubi.com` as unreachable on 2021-06-10 and moved Hubi into inactive/dead tracking.
- CoinMarketCap currently lists Hubi without tracked volume.
- Coin360 identifies the historical Hubi exchange as Hong Kong based.

## Conservative boundaries

BX68 does not infer:

- an operator-announced shutdown;
- a shutdown cause;
- an exact death date;
- a precise launch date;
- any lineage relationship with Huobi/HTX.

The 2021-06-10 event is an observed availability-loss marker only. Entity status is `inactive`, with `death_reason` and `death_date` left null.

## Validation rule

Merge only after the complete current pull-request workflow matrix passes on the exact final head. Do not weaken record, lineage, count, URL, localization, machine/public, or project-network checks to make the batch pass.
