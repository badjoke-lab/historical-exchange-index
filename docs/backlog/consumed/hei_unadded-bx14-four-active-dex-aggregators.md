# HEI Unadded Candidate Consumption — D-1000 BX14

Date: 2026-07-18  
Status: consumed by reviewed BX14 batch

## Added now

| Candidate | Result | Entity ID | Evidence IDs | Reason |
|---|---|---:|---|---|
| LiquidMesh | added active | `hei_ex_000970` | `hei_src_012154`–`hei_src_012155` | Current first-party website and API documentation plus substantial current non-zero DEX aggregator volume. |
| fly.trade | added active | `hei_ex_000971` | `hei_src_012156`–`hei_src_012157` | Current first-party on-chain and cross-chain swap documentation plus substantial current non-zero DEX aggregator volume. |
| Defi App | added active | `hei_ex_000972` | `hei_src_012158`–`hei_src_012159` | Current first-party swap and perpetual documentation plus current non-zero DEX and perpetual aggregator volume. |
| Nordstern.Finance | added active | `hei_ex_000973` | `hei_src_012160`–`hei_src_012161` | Current first-party smart-order-routing API plus current non-zero DEX aggregator volume. |

## Identity boundaries

```text
LiquidMesh:
  Quote API, Swap API, Flash API, Boost API, chain integrations, and transaction-broadcast products remain one entity.

fly.trade:
  Fly and the former Magpie Protocol identity remain one lifecycle entity.

Defi App:
  Swap, perpetuals, wallet management, yield, and HOME-token surfaces remain one Defi App entity.

Nordstern.Finance:
  Swap API, supported networks, route integrations, and developer endpoints remain one entity.
```

No child product, chain deployment, token, API endpoint, or metric label was promoted to a separate exchange record.

## Dedupe checks performed

For every added candidate:

```text
normal canonical path
alternate slug path
legacy nested path
repository-wide canonical-name search
alias and prior-brand search
official-domain search
reviewed data/entities.json search
parent and child product identity review
```

Final authority remains Records validation, Candidate scan, Watchlist resolution, and the complete pull-request workflow suite.
