# HEI BX33 Consumed Candidate Note

Date: 2026-07-28

## Starting state

BX33 starts from `main` commit `a195b8056c9dd4794cd7d618e0075d05eca57ace` after the reviewed BX32 merge.

```text
Entities: 927
Events:   1014
Evidence: 3624
```

## Rejected overlap and split set

Search-index results alone were not treated as authoritative. Direct canonical-path reads found GRVT, edgeX, Paradex, Pacifica, Hibachi, Reya, Extended, Avantis, Byte Exchange, and Niza.io already represented.

Gate US and OKJ were held because the available review did not justify separate entities from existing Gate.io and OKCoin / OKX lineages. Regional or successor surfaces are not promoted merely because an independent directory lists them separately.

## Promoted

```text
LeveX        -> hei_ex_001048 active
NonKYC.io    -> hei_ex_001049 active
MAX Exchange -> hei_ex_001050 active
Tokpie       -> hei_ex_001051 active
```

## Review basis

### LeveX

- Current first-party material exposes spot, perpetual futures, social trading, competitions, API, support, and proof-of-reserves-related services.
- Current independent data reports recently updated markets, non-zero activity, reserves, a 2023 establishment year, and Panama registration.
- The first-party material does not establish one globally supervising regulator, so confidence remains `medium`.

### NonKYC.io

- Current first-party GitHub repositories expose maintained REST, websocket, HMAC, Python, Hummingbot, and exchange-adapter resources.
- Current first-party announcement channels continue publishing asset, deposit, and delisting notices.
- Current independent data reports current markets, non-zero activity, reserves, a 2023 establishment year, and Seychelles registration.
- The official homepage was not independently fetched in this pass, so URL status remains `live_unverified` and confidence remains `medium`.

### MAX Exchange

- Current first-party MaiCoin Group history identifies the operating group and states that MAX Exchange launched in Taiwan in 2018.
- Current first-party exchange and support surfaces expose trading, staking, bots, APIs, TWD bank-trust arrangements, operator information, and recent announcements.
- Current independent data reports recently updated TWD and USDT markets, non-zero activity, Taiwan registration, and VASP AML-registration context.
- MAX is retained as a distinct exchange venue from the sibling MaiCoin retail platform.

### Tokpie

- Current first-party site exposes live markets, trading, token listing, lending and borrowing, launchpad, card purchase, API, and bounty-stake products.
- The current first-party footer identifies Graceful Globe S.A. in Panama.
- Current independent data reports recently updated markets, non-zero activity, a 2018 establishment year, and a Hong Kong registration/address.
- The Panama / Hong Kong discrepancy is retained rather than resolved through unsupported inference.

## Safety note

Current operation was not inferred from a live homepage alone. Each active classification uses current product, technical, legal, or operator surfaces together with independent market activity. No unsupported exact launch day, global licensing conclusion, terminal event, predecessor, successor, or regional product split is introduced.
