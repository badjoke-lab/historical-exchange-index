# HEI BX31 Consumed Candidate Note

Date: 2026-07-28

## Starting state

BX31 starts from `main` commit `71a5bfca7da9e5e58be96713b972c8ab25caa387` after the reviewed BX30 merge.

```text
Entities: 919
Events:   1014
Evidence: 3608
```

## Rejected overlap set

Direct current-main checks found two initially considered candidates already represented:

```text
CoinTR    -> hei_ex_000645
CoinUp.io -> hei_ex_000646
```

Those records were not duplicated and no new IDs were assigned to them.

## Promoted

```text
Coinlocally -> hei_ex_001040 limited
Websea      -> hei_ex_001041 active
BitMake     -> hei_ex_001042 limited
Bitowex     -> hei_ex_001043 limited
```

## Review basis

### Coinlocally

- The current first-party site remains reachable and identifies Coinlocally LLC in Yerevan, Armenia.
- The platform currently states that deposits and withdrawals are temporarily suspended while custody and transfer infrastructure are upgraded.
- Independent directory material identifies a 2019 launch year, but later international operating claims are not treated as a resolved replacement legal lineage.

### Websea

- The current first-party domain exposes spot and derivatives exchange products.
- Current independent data identifies a 2023 establishment year, British Virgin Islands registration, recently updated markets, and non-zero activity.
- The exact launch day and public contracting operator remain unresolved, so confidence is `medium`.

### BitMake

- Current independent exchange-directory material links the first-party domain, describes the 2022 platform launch and products, and reports exchange-provided reserves.
- The same source marks volume as untracked and exposes no usable current market data.
- HEI therefore uses `limited` and keeps the root URL `live_unverified`.

### Bitowex

- Current first-party material exposes spot markets, funding, wallets, fees, account creation, and exchange terms.
- The terms identify DIGITALK DASH Limited; the official UK company register confirms the company is active and was incorporated in April 2022.
- The registry does not independently verify exchange operations, so HEI uses `limited` and leaves launch date null.

## Safety note

A live website alone was not treated as sufficient for unrestricted active classification. Weakly corroborated current-operation claims are represented conservatively as `limited`. No unsupported exact launch day, regulatory authorization, terminal event, predecessor, successor, or legal-entity conclusion is introduced.
