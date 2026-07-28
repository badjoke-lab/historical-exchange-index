# HEI BX32 Consumed Candidate Note

Date: 2026-07-28

## Starting state

BX32 starts from `main` commit `a264e9d1df9a473ca81d07a3ff97218a91b3b47c` after the reviewed BX31 merge.

```text
Entities: 923
Events:   1014
Evidence: 3616
```

## Rejected overlap set

Search-index results alone were not treated as authoritative. Direct canonical-path reads found four initially considered candidates already represented:

```text
Backpack Exchange -> hei_ex_000068
Aster             -> hei_ex_000529
StandX            -> hei_ex_001018
Variational       -> hei_ex_001021
```

Those existing entities were not duplicated.

## Promoted

```text
Lighter      -> hei_ex_001044 active
SafeTrade    -> hei_ex_001045 active
Biconomy.com -> hei_ex_001046 active
PointPay     -> hei_ex_001047 active
```

## Review basis

### Lighter

- Current first-party documentation describes a decentralized spot and perpetual exchange with verifiable order matching and liquidations, wallet-linked accounts, subaccounts, and mainnet API access.
- Current independent exchange and protocol data reports substantial non-zero volume, open interest, TVL, fees, revenue, and active addresses.
- Lighter Perps and Lighter Spot are consolidated into one protocol-level entity.

### SafeTrade

- Current first-party About and terms pages identify a 2018-founded spot exchange with account, custody, deposit, withdrawal, order-matching, and settlement services.
- Current independent data reports recently updated markets and non-zero trading activity.
- Public operator naming varies across first-party pages, so confidence remains `medium`.

### Biconomy.com

- Current first-party material identifies BICONOMY PTE. LTD and a British Virgin Islands address and exposes current spot, futures, earn, launchpad, payment, API, and mobile products.
- Current independent data reports recently updated markets, substantial non-zero volume, reserves, and an October 2019 establishment marker.
- The exchange is distinct from the unrelated Biconomy Web3 infrastructure protocol.

### PointPay

- Current first-party surfaces expose spot, futures, conversion, staking, launchpad, wallet, payment, and P2P products.
- First-party anniversary material states operation since 2018.
- Current independent data reports recently updated markets, non-zero activity, and Saint Vincent and the Grenadines registration.

## Safety note

Current operation was not inferred from a live homepage alone. Each active classification uses current product or legal surfaces plus independent market or protocol activity. No unsupported exact launch day, global licensing conclusion, terminal event, predecessor, successor, or product-level entity split is introduced.
