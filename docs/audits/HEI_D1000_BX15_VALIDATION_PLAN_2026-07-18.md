# HEI D-1000 Batch BX15 Validation Plan

Date: 2026-07-18  
Project: Historical Exchange Index (HEI)  
Branch: `agent/d1000-bx15-four-active-dex-records`

## 1. Scope

BX15 adds four reviewed active decentralized exchange, aggregator, or routed trading-platform entities:

```text
DFlow      hei_ex_000974
Rialto     hei_ex_000975
Minswap    hei_ex_000976
SuperSwap  hei_ex_000977
```

No events, schema changes, localization expansion, third-language authorization, deployment behavior, or Cloudflare changes are included.

BX15 also completes the merged BX14 checkpoint and advances the maintainer recovery contract, L-2 parallel-growth count text, and execution-roadmap dynamic checkpoint to BX15.

## 2. Projected canonical delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected reviewed state:

```text
Entities: 857
Events:   1004
Evidence: 3473
English dossiers:  857
Japanese dossiers: 857
Sitemap routes:     1738
```

Remaining to D-1000: 143 entities.

## 3. Identity and overlap validation

For each candidate, validate:

```text
exact record path
legacy nested record path
likely alternate slug paths
normalized slug
canonical name
aliases and product identity
official domain
repository-wide text overlap
Candidate scan output
Watchlist resolution output
Records validation output
```

Expected identity surfaces:

```text
dflow.net
rialto.xyz
minswap.org
superswap.ink
```

Repository searches, reviewed `data/entities.json`, and direct normal and alternate canonical-path checks found no current-main identity or domain match for the final four records.

Kuru was excluded after direct canonical-path inspection found existing record `hei_ex_000917`. TideSwap and Aura remained held because current independently tracked activity was insufficient for this batch relative to stronger candidates.

DFlow API and router products remain one DFlow entity. Rialto exchange, PropAMM, and routing surfaces remain one Rialto entity. Minswap AMM, aggregator, API, and widget remain one Minswap entity. SuperSwap Ink and multi-chain tokenized-market surfaces remain one SuperSwap entity. Child products, APIs, chain deployments, tokens, and metric labels must not become duplicate exchange records.

## 4. Evidence boundary

```text
DFlow:
  current first-party website and trading API documentation
  current independent DEX aggregator volume metrics

Rialto:
  dated first-party launch announcement and live application
  current independent routed volume, fee, and revenue metrics

Minswap:
  current first-party DEX and aggregator API documentation
  current independent aggregator volume, fee, and revenue metrics

SuperSwap:
  current first-party trading and aggregation documentation
  current independent DEX aggregator volume, fee, and revenue metrics
```

DFlow, Rialto, and Minswap are classified `active` with `high` confidence. SuperSwap is classified `active` with `medium` confidence because it is an interface over third-party issuers and liquidity sources and current routed volume remains modest.

No exact launch date, legal jurisdiction, legal entity, predecessor, successor, terminal date, or shutdown cause is inferred except Rialto's dated public launch announcement, which is stored as evidence rather than forced into an exact entity launch date.

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

BX15 adds reviewed canonical records and matching English and Japanese dossier routes through the existing fallback system. It does not expand localized copy breadth or authorize another language.
