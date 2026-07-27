# HEI BX30 Consumed Candidate Note

Date: 2026-07-26

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

## Promoted

```text
AgoraDesk        -> hei_ex_001036 dead
Einstein Exchange -> hei_ex_001037 dead
BX.in.th          -> hei_ex_001038 dead
CoinNest          -> hei_ex_001039 dead
```

## Direct duplicate controls

Before drafting, HEI checked the canonical and alternate paths for the four entities, including:

```text
records/exchanges/agoradesk.json
records/exchanges/localmonero.json
records/exchanges/einstein-exchange.json
records/exchanges/einstein.json
records/exchanges/bx-in-th.json
records/exchanges/bitcoin-co-th.json
records/exchanges/coinnest.json
records/exchanges/coin-nest.json
```

The paths were absent on the BX30 base commit. Repository name, alias, and domain searches also found no reviewed canonical entity for the final set.

## Review basis

### AgoraDesk

- AgoraDesk and LocalMonero were two brand surfaces of the same non-custodial P2P platform and remain one entity.
- A first-party May 7, 2024 announcement began a voluntary wind-down.
- New trade creation ended on May 14, 2024; support and fund recovery remained temporarily available until the later website-removal deadline.
- HEI therefore uses `dead / voluntary_shutdown` with `death_date: 2024-05-14`.

### Einstein Exchange

- Primary British Columbia regulator releases confirm the November 1, 2019 interim receivership and operational seizure.
- The receiver shut down the website and reported a severe shortfall between available assets and customer liabilities.
- HEI therefore uses `dead / insolvency` and does not create a separate entity for the later regulatory and fraud findings.

### BX.in.th

- Thailand's SEC preserved the operator's voluntary cessation notice.
- All purchasing, selling, and trading ended after September 30, 2019.
- Temporary withdrawal and support access did not constitute continued exchange operation.
- HEI therefore uses `dead / voluntary_shutdown`.

### CoinNest

- Contemporary Korean and international reporting quotes the exchange's closure notice.
- Trading and deposits ended at 17:00 KST on April 30, 2019, while withdrawals continued through a later wind-down deadline.
- HEI therefore uses April 30 as the death date and `voluntary_shutdown` as the bounded primary reason.

## Safety note

No unverified legal domicile, successor, acquisition, recovery, reimbursement, or incident cause is invented. Withdrawal-only and support-only wind-down access is not treated as active exchange operation.
