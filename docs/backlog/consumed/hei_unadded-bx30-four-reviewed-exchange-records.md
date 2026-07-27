# HEI BX30 Consumed Candidate Note

Date: 2026-07-27

## Starting state

BX30 starts from `main` commit `62323569c46eb08ff23b07c4c8271532b4ce4fd6` after the reviewed Dango, Cascade, Odos, and BitMart changes.

```text
Entities: 915
Events:   1014
Evidence: 3600
```

## Rejected overlap set

Records validation identified the first four drafts as existing canonical entities:

```text
AgoraDesk         -> hei_ex_000294
Einstein Exchange -> hei_ex_000138
BX Thailand       -> hei_ex_000117
Coinnest          -> hei_ex_000135
```

Those duplicate drafts and their provisional event/evidence data were removed and are not counted.

## Promoted

```text
GroveX   -> hei_ex_001036 active
Koinpark -> hei_ex_001037 active
Orbix    -> hei_ex_001038 active
Niza.io  -> hei_ex_001039 active
```

## Review basis

### GroveX

- Current first-party domain exposes the exchange application.
- Current independent data identifies an Australia-registered centralized exchange with active markets and non-zero trading.
- Legal-entity disclosure remains incomplete, so confidence is `medium` and launch date remains null.

### Koinpark

- First-party terms identify Koinpark Private Limited and an Indian-law digital-asset order-matching marketplace.
- Independent data identifies a 2023 establishment year and current INR, USDT, and BTC markets.
- January 1 is used only as a year-level launch marker.

### Orbix

- First-party history records Satang Corporation's March 2017 founding and acquisition by Unita Capital in October 2023.
- Current legal material identifies Orbix Trade Company Limited under Thai law.
- Orbix and Satang Pro remain one continuing entity rather than separate countable exchanges.

### Niza.io

- First-party material states establishment in March 2021 and exposes current exchange, account, app, and API services.
- Independent data identifies Lithuania registration and current non-zero market activity.
- Legal-entity disclosure remains incomplete, so confidence is `medium`.

## Safety note

A live website alone was not treated as sufficient for active classification. Each record includes current first-party platform evidence and independent market evidence. No unsupported exact launch day, terminal event, predecessor split, or legal-entity claim is introduced.
