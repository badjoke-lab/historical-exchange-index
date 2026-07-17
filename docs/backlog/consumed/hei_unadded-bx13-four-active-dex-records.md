# HEI Unadded Candidate Consumption — D-1000 BX13

Date: 2026-07-17  
Status: consumed by reviewed BX13 batch

## Added now

| Candidate | Result | Entity ID | Evidence IDs | Reason |
|---|---|---:|---|---|
| KYO AG | added active | `hei_ex_000966` | `hei_src_012146`–`hei_src_012147` | Current first-party website and API documentation plus current non-zero DEX aggregator volume. |
| DZap | added active | `hei_ex_000967` | `hei_src_012148`–`hei_src_012149` | Current first-party swap, bridge, API, SDK, and intent documentation plus current non-zero DEX and bridge aggregator volume. |
| BIM Exchange | added active | `hei_ex_000968` | `hei_src_012150`–`hei_src_012151` | Current first-party swap-routing documentation plus current non-zero DEX aggregator, bridge, fee, revenue, and TVL metrics. |
| Based | added active | `hei_ex_000969` | `hei_src_012152`–`hei_src_012153` | Current first-party application plus substantial current perpetual, spot, notional, fee, revenue, and open-interest activity. |

## Duplicate excluded

| Candidate | Result | Existing record | Reason |
|---|---|---:|---|
| Cyberperp | existing | `hei_ex_000807` | Direct normal canonical-path inspection found the current active Cyberperp record. |

## Held

| Candidate | Result | Reason |
|---|---|---|
| GlueX | held | Current tracked 24-hour, 7-day, and 30-day DEX aggregator volume was zero despite substantial historical cumulative activity. |
| SomeSwap | held | Current independent activity exists, but a sufficiently strong current first-party identity and documentation surface was not confirmed. |

## Identity boundaries

```text
KYO AG:
  KYO.ag aggregator, meta aggregator, cross-chain routing, zap, and rebalance products remain one entity.

DZap:
  DZap Core, DZap Fuse, and DZap AI remain one DZap entity.

BIM Exchange:
  Swap, bridge, yield, staking, and routing surfaces remain one BIM Exchange entity.

Based:
  Based App, Based Alpha, HYENA, and Based Predict remain one Based entity.
```

No child product, chain deployment, contract adapter, or metric label was promoted to a separate exchange record.

## Dedupe checks performed

For every added candidate:

```text
normal canonical path
alternate slug path
legacy nested path
repository-wide canonical-name search
alias search
official-domain search
parent and child product identity review
existing Cyberperp direct-path check
```

Final authority remains Records validation, Candidate scan, Watchlist resolution, and the complete pull-request workflow suite.
