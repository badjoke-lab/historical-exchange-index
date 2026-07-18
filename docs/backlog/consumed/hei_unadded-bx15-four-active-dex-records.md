# HEI Unadded Candidate Consumption — D-1000 BX15

Date: 2026-07-18  
Status: consumed by reviewed BX15 batch

## Added now

| Candidate | Result | Entity ID | Evidence IDs | Reason |
|---|---|---:|---|---|
| DFlow | added active | `hei_ex_000974` | `hei_src_012162`–`hei_src_012163` | Current first-party Solana routing and trading documentation plus substantial non-zero current aggregator volume. |
| Rialto | added active | `hei_ex_000975` | `hei_src_012164`–`hei_src_012165` | Dated first-party launch announcement and live on-chain exchange plus non-zero current routed volume, fees, and revenue. |
| Minswap | added active | `hei_ex_000976` | `hei_src_012166`–`hei_src_012167` | Current first-party Cardano DEX and aggregator API documentation plus non-zero current aggregator volume, fees, and revenue. |
| SuperSwap | added active | `hei_ex_000977` | `hei_src_012168`–`hei_src_012169` | Current first-party trading and aggregation documentation plus non-zero current DEX aggregator volume, fees, and revenue. |

## Excluded or held

| Candidate | Result | Reason |
|---|---|---|
| Kuru | excluded duplicate | Existing reviewed record `hei_ex_000917` already covers Kuru Exchange and Kuru Flow. |
| TideSwap | held | Current independent 24-hour, 7-day, and 30-day tracked aggregator volume was zero at review time. |
| Aura | held | Current independent volume evidence was weaker than the final candidates and did not justify replacing a stronger record in this batch. |

## Identity boundaries

```text
DFlow:
  router, Swap API, Trade API, metadata, token-discovery, and integration surfaces remain one entity.

Rialto:
  exchange, Rivo Altus PropAMM, partner routing, and Robinhood Chain venue remain one entity.

Minswap:
  AMM pools, DEX application, aggregator API, widget, and routing surfaces remain one entity.

SuperSwap:
  Ink application, tokenized-market discovery, issuer aggregation, bridge routing, and multi-chain execution remain one entity.
```

No child product, chain deployment, token, API endpoint, or metric label was promoted to a separate exchange record.

## Dedupe checks performed

For every added candidate:

```text
normal canonical path
alternate slug path
legacy nested path
repository-wide canonical-name search
alias and product-name search
official-domain search
reviewed data/entities.json search
parent and child product identity review
```

Final authority remains Records validation, Candidate scan, Watchlist resolution, and the complete pull-request workflow suite.
