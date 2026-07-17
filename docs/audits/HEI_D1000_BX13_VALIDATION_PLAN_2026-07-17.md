# HEI D-1000 Batch BX13 Validation Plan

Date: 2026-07-17  
Project: Historical Exchange Index (HEI)  
Branch: `agent/d1000-bx13-four-active-dex-records`

## 1. Scope

BX13 adds four reviewed active decentralized exchange, aggregator, or integrated trading-platform entities:

```text
KYO AG        hei_ex_000966
DZap          hei_ex_000967
BIM Exchange  hei_ex_000968
Based         hei_ex_000969
```

No events, schema changes, localization expansion, third-language authorization, deployment behavior, or Cloudflare changes are included.

BX13 also completes the merged BX12 checkpoint and advances the maintainer recovery contract, L-2 parallel-growth count text, and execution-roadmap dynamic checkpoint to BX13.

## 2. Projected canonical delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected reviewed state:

```text
Entities: 849
Events:   1004
Evidence: 3457
English dossiers:  849
Japanese dossiers: 849
Sitemap routes:     1722
```

Remaining to D-1000: 151 entities.

## 3. Identity and overlap validation

For each candidate, validate:

```text
exact record path
legacy nested record path
likely alternate slug paths
normalized slug
canonical name
aliases
parent and child product identity
official domain
repository-wide text overlap
Candidate scan output
Watchlist resolution output
Records validation output
```

Expected identity surfaces:

```text
kyo.ag
app.dzap.io
exchange.bim.finance
app.based.one
```

Repository searches and direct normal, alternate, and legacy nested canonical-path checks found no current-main identity or domain match for the final records.

Cyberperp was excluded after direct canonical-path inspection found existing record `hei_ex_000807`. GlueX remained held because its current independent 24-hour, 7-day, and 30-day DEX aggregator volume was zero despite substantial historical cumulative activity. SomeSwap remained held because a sufficiently strong current first-party identity surface was not confirmed.

KYO AG products remain one aggregator entity. DZap Core, Fuse, and AI remain one DZap entity. BIM swap, bridge, yield, and staking surfaces remain one BIM Exchange entity. Based App, Based Alpha, HYENA, and Based Predict remain one Based entity. Child metric labels must not become duplicate exchange records.

## 4. Evidence boundary

```text
KYO AG:
  current first-party website and API documentation
  current independent DEX aggregator volume metrics

DZap:
  current first-party protocol documentation and execution interfaces
  current independent DEX and bridge aggregator volume metrics

BIM Exchange:
  current first-party swap and routing documentation
  current independent DEX aggregator, bridge aggregator, fee, revenue, and TVL metrics

Based:
  current first-party application identity
  current independent spot, notional, perpetual, fee, revenue, and open-interest metrics
```

KYO AG and DZap are classified `active` with `high` confidence. BIM Exchange and Based are classified `active` with `medium` confidence because each combines exchange activity with broader protocol or interface functions.

No exact launch date, legal jurisdiction, legal entity, predecessor, successor, terminal date, or shutdown cause is inferred.

## 5. Required validation

All pull-request workflows must pass on the final head, including:

```text
Records validation
Candidate scan gate
Watchlist resolution gate
Count semantics regression
Maintainer recovery gate
Machine/public consistency gate
URL safety gate
Japanese Pilot readiness gate
L2 localization evaluation gate
v1 baseline checkpoint gate
CI
```

Merge only after all 20 workflows complete successfully on the same final head SHA.

## 6. Roadmap safety

The roadmap update must preserve the exact frozen-baseline phrase:

```text
G-7 v1.0 Baseline Checkpoint
```

The roadmap must not duplicate the exact L-2 current-item literal from the active L-2 plan. The active L-2 plan and recovery contract remain authoritative for that item.

## 7. Localization boundary

L-2 remains `HOLD`.

BX13 adds reviewed canonical records and matching English and Japanese dossier routes through the existing fallback system. It does not expand localized copy breadth or authorize another language.
