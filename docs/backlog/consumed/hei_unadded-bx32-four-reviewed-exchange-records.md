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

The initial Biconomy.com draft was subsequently rejected by the permanent Records validator because the entity is already represented as Biconomy Exchange `hei_ex_000094` in current reviewed aggregation paths. The duplicate draft was removed rather than bypassing the gate.

## Promoted

```text
Lighter   -> hei_ex_001044 active
SafeTrade -> hei_ex_001045 active
Perennial -> hei_ex_001046 active
PointPay  -> hei_ex_001047 active
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

### Perennial

- Current first-party documentation describes a full-stack perps ecosystem using signed intents, solver execution, an AMM, oracle-priced markets, and on-chain settlement.
- Current guides document trading through app.perennial.finance and perp.fun while retaining user control of collateral.
- Current independent data reports material protocol TVL and non-zero 7-day and 30-day perpetual volume. Confidence remains `medium` because 24-hour volume was zero at the review snapshot.

### PointPay

- Current first-party surfaces expose spot, futures, conversion, staking, launchpad, wallet, payment, and P2P products.
- First-party anniversary material states operation since 2018.
- Current independent data reports recently updated markets, non-zero activity, and Saint Vincent and the Grenadines registration.

## Safety note

Current operation was not inferred from a live homepage alone. Each active classification uses current product or legal surfaces plus independent market or protocol activity. No unsupported exact launch day, global licensing conclusion, terminal event, predecessor, successor, or product-level entity split is introduced.
