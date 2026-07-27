# HEI BX30 Consumed Candidate Note

Date: 2026-07-27

## Starting state after intervening lifecycle updates

BX30 starts from current `main` commit `62323569c46eb08ff23b07c4c8271532b4ce4fd6`, not from the earlier BX29 merge.

The intervening reviewed changes are included in the starting counts:

```text
Dango added
Cascade added
Odos active -> limited
BitMart active -> limited
```

Starting reviewed state:

```text
Entities: 915
Events:   1014
Evidence: 3600
```

## Rejected overlap set

The first historical-candidate draft proposed AgoraDesk, Einstein Exchange, BX.in.th, and CoinNest. Records validation identified all four as existing canonical entities:

```text
AgoraDesk         -> hei_ex_000294
Einstein Exchange -> hei_ex_000138
BX Thailand       -> hei_ex_000117
Coinnest          -> hei_ex_000135
```

The duplicate record drafts were removed. Their entity, event, and evidence IDs were not retained or counted.

## Promoted

```text
GroveX   -> hei_ex_001036 active
Koinpark -> hei_ex_001037 active
Orbix    -> hei_ex_001038 active
Niza.io  -> hei_ex_001039 active
```

## Direct duplicate controls

Before final drafting, HEI checked canonical and alternate paths, names, domains, and brand lineage for:

```text
GroveX / grovex.io
Koinpark / Koinpark Private Limited / koinpark.com
Orbix / Orbix Trade / Satang Pro / Satang Corporation
Niza.io / NIZA / Niza Global / niza.io
```

No reviewed canonical entity was found for the final four candidates on the BX30 base commit. Orbix and Satang Pro are deliberately consolidated as one continuing entity rather than counted as separate predecessor and successor exchanges.

## Review basis

### GroveX

- The current first-party domain exposes the GroveX exchange application.
- Current independent exchange data identifies GroveX as an Australia-registered centralized exchange established in 2022 and reports current markets and non-zero trading activity.
- The public legal-entity disclosure reviewed by HEI remains incomplete, so confidence is `medium` and no exact launch date is asserted.

### Koinpark

- Current first-party terms identify Koinpark Private Limited and describe the platform as a marketplace that matches and settles digital-asset buy and sell orders under Indian law.
- Current independent exchange data identifies a 2023 establishment year and reports recently updated INR, USDT, and BTC markets with non-zero activity.
- January 1 is used only as a year-level launch marker because an exact launch day was not verified.

### Orbix

- Current first-party company history records the March 2017 founding of Satang Corporation and the October 2023 acquisition by Unita Capital, a KasikornBank subsidiary.
- Current terms identify Orbix Trade Company Limited under Thai law.
- Current independent exchange data preserves the Satang Pro-to-Orbix lineage and reports active markets.
- Satang Pro and Orbix remain one continuing exchange entity.

### Niza.io

- Current first-party material states that Niza was established in March 2021 and exposes current spot markets, crypto purchase, account, app, and API-related services.
- Current independent exchange data identifies Lithuania registration and reports current markets and non-zero trading activity.
- Public first-party legal-entity disclosure remains incomplete, so confidence is `medium`.

## Safety note

A live website alone was not treated as sufficient for active classification. Each final record includes current first-party platform evidence and independent exchange-market evidence. No unsupported exact launch day, terminal event, acquisition outcome, predecessor split, or legal-entity claim is introduced.
